import { scoutingReportSchema } from "../schemas";
import type { ScoutingInput, ScoutingReport } from "../types";
import { extractJsonValue } from "./extract-json";
import {
  OPENROUTER_CHAT_COMPLETIONS_URL,
  resolveOpenRouterFallbackModel,
  resolveOpenRouterPrimaryModel,
} from "./openrouter-model";
import { OpenRouterTransportError } from "./openrouter-transport-error";
import { REPAIR_PROMPT } from "./repair-prompt";
import { SCOUTFLOW_SYSTEM_PROMPT } from "./system-prompt";
import { buildUserPrompt } from "./user-prompt";

export type GenerateReportSource = "openrouter";

export type GenerateScoutingReportResult = {
  report: ScoutingReport;
  source: GenerateReportSource;
};

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

function parseReportFromContent(content: string): ScoutingReport | null {
  const value = extractJsonValue(content);
  if (value === null) return null;
  const parsed = scoutingReportSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function getAssistantContent(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const root = data as Record<string, unknown>;
  const choices = root.choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0] as Record<string, unknown>;
  const message = first.message as Record<string, unknown> | undefined;
  const content = message?.content;
  return typeof content === "string" ? content : null;
}

async function postOpenRouter(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
      }),
    });
  } catch (cause) {
    throw new OpenRouterTransportError("OpenRouter request failed (network)", {
      cause,
    });
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    throw new OpenRouterTransportError(
      `OpenRouter returned non-JSON (HTTP ${res.status})`,
    );
  }

  if (!res.ok) {
    const errMsg =
      typeof (data as { error?: { message?: string } })?.error?.message ===
      "string"
        ? (data as { error: { message: string } }).error.message
        : text.slice(0, 200);
    throw new OpenRouterTransportError(
      `OpenRouter error HTTP ${res.status}: ${errMsg}`,
    );
  }

  const content = getAssistantContent(data);
  if (!content) {
    throw new OpenRouterTransportError(
      "OpenRouter response missing assistant message content",
    );
  }
  return content;
}

/**
 * One model: initial completion, parse; if needed one repair completion and parse.
 * Throws OpenRouterTransportError on HTTP/envelope failures; throws Error if output
 * still cannot be parsed after repair.
 */
async function generateReportWithModel(
  apiKey: string,
  model: string,
  input: ScoutingInput,
): Promise<ScoutingReport> {
  const userPrompt = buildUserPrompt(input);
  const initialMessages: ChatMessage[] = [
    { role: "system", content: SCOUTFLOW_SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  const firstContent = await postOpenRouter(apiKey, model, initialMessages);
  const firstReport = parseReportFromContent(firstContent);
  if (firstReport) {
    return firstReport;
  }

  const repairMessages: ChatMessage[] = [
    ...initialMessages,
    { role: "assistant", content: firstContent },
    { role: "user", content: REPAIR_PROMPT },
  ];

  const secondContent = await postOpenRouter(apiKey, model, repairMessages);
  const secondReport = parseReportFromContent(secondContent);
  if (secondReport) {
    return secondReport;
  }

  throw new Error(
    "Model output could not be parsed or validated as ScoutingReport after repair retry.",
  );
}

/**
 * Produces a validated ScoutingReport via OpenRouter (primary Gemma 31B free,
 * then fallback MiniMax M2.5 on transport failure only). Requires OPENROUTER_API_KEY.
 */
export async function generateScoutingReport(
  input: ScoutingInput,
): Promise<GenerateScoutingReportResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Add it to .env.local and restart the dev server.",
    );
  }

  try {
    const report = await generateReportWithModel(
      apiKey,
      resolveOpenRouterPrimaryModel(),
      input,
    );
    return { report, source: "openrouter" };
  } catch (primaryError) {
    if (!(primaryError instanceof OpenRouterTransportError)) {
      throw primaryError;
    }

    try {
      const fallbackModel = resolveOpenRouterFallbackModel();
      const report = await generateReportWithModel(
        apiKey,
        fallbackModel,
        input,
      );
      return { report, source: "openrouter" };
    } catch (fallbackError) {
      const primaryMsg =
        primaryError instanceof Error ? primaryError.message : String(primaryError);
      const fallbackMsg =
        fallbackError instanceof Error
          ? fallbackError.message
          : String(fallbackError);
      throw new Error(
        `OpenRouter primary failed (${primaryMsg}). Fallback failed (${fallbackMsg}).`,
      );
    }
  }
}
