import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockSampleScoutingInput, mockSampleScoutingReport } from "@/lib/mock-data";
import { scoutingInputSchema, scoutingReportSchema } from "@/lib/schemas";
import { generateScoutingReport } from "./generate-scouting-report";
import {
  OPENROUTER_FALLBACK_MODEL,
  OPENROUTER_MODEL,
} from "./openrouter-model";

function openRouterJsonResponse(assistantContent: string) {
  return {
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        choices: [{ message: { content: assistantContent } }],
      }),
  };
}

describe("generateScoutingReport", () => {
  const savedApiKey = process.env.OPENROUTER_API_KEY;
  const savedOpenRouterModel = process.env.OPENROUTER_MODEL;
  const savedOpenRouterFallbackModel = process.env.OPENROUTER_FALLBACK_MODEL;

  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    if (savedApiKey === undefined) {
      delete process.env.OPENROUTER_API_KEY;
    } else {
      process.env.OPENROUTER_API_KEY = savedApiKey;
    }
    if (savedOpenRouterModel === undefined) {
      delete process.env.OPENROUTER_MODEL;
    } else {
      process.env.OPENROUTER_MODEL = savedOpenRouterModel;
    }
    if (savedOpenRouterFallbackModel === undefined) {
      delete process.env.OPENROUTER_FALLBACK_MODEL;
    } else {
      process.env.OPENROUTER_FALLBACK_MODEL = savedOpenRouterFallbackModel;
    }
  });

  it("throws when OPENROUTER_API_KEY is missing", async () => {
    delete process.env.OPENROUTER_API_KEY;
    await expect(
      generateScoutingReport(mockSampleScoutingInput),
    ).rejects.toThrow(/OPENROUTER_API_KEY/);
  });

  it("returns openrouter source when fetch returns valid report JSON", async () => {
    process.env.OPENROUTER_API_KEY = "test-key-not-used-on-network-if-mocked";
    const body = JSON.stringify(mockSampleScoutingReport);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(openRouterJsonResponse(body)),
    );

    const result = await generateScoutingReport(mockSampleScoutingInput);
    expect(result.source).toBe("openrouter");
    const again = scoutingReportSchema.safeParse(result.report);
    expect(again.success).toBe(true);
    expect(result.report.opponentSummary).toBe(
      mockSampleScoutingReport.opponentSummary,
    );
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });

  it("retries once with repair prompt when first response is not valid JSON", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    const validBody = JSON.stringify(mockSampleScoutingReport);
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          openRouterJsonResponse("Thanks! Here is the report. (no json)"),
        )
        .mockResolvedValueOnce(openRouterJsonResponse(validBody)),
    );

    const result = await generateScoutingReport(mockSampleScoutingInput);
    expect(result.source).toBe("openrouter");
    expect(scoutingReportSchema.safeParse(result.report).success).toBe(true);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
  });

  it("uses fallback model when primary OpenRouter request returns HTTP error", async () => {
    delete process.env.OPENROUTER_MODEL;
    delete process.env.OPENROUTER_FALLBACK_MODEL;
    process.env.OPENROUTER_API_KEY = "test-key";
    const validBody = JSON.stringify(mockSampleScoutingReport);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body ?? "{}")) as { model?: string };
        if (body.model === OPENROUTER_MODEL) {
          return {
            ok: false,
            status: 503,
            text: async () =>
              JSON.stringify({ error: { message: "Primary unavailable" } }),
          };
        }
        if (body.model === OPENROUTER_FALLBACK_MODEL) {
          return openRouterJsonResponse(validBody);
        }
        throw new Error(`Unexpected model in fetch mock: ${body.model}`);
      }),
    );

    const result = await generateScoutingReport(mockSampleScoutingInput);
    expect(result.source).toBe("openrouter");
    expect(scoutingReportSchema.safeParse(result.report).success).toBe(true);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    const firstBody = JSON.parse(
      String(vi.mocked(fetch).mock.calls[0][1]?.body ?? "{}"),
    ) as { model: string };
    const secondBody = JSON.parse(
      String(vi.mocked(fetch).mock.calls[1][1]?.body ?? "{}"),
    ) as { model: string };
    expect(firstBody.model).toBe(OPENROUTER_MODEL);
    expect(secondBody.model).toBe(OPENROUTER_FALLBACK_MODEL);
  });

  it("does not use fallback when primary returns HTTP 200 but output never parses", async () => {
    delete process.env.OPENROUTER_MODEL;
    delete process.env.OPENROUTER_FALLBACK_MODEL;
    process.env.OPENROUTER_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        openRouterJsonResponse("Still not JSON after your repair ask."),
      ),
    );

    await expect(
      generateScoutingReport(mockSampleScoutingInput),
    ).rejects.toThrow(/could not be parsed or validated/);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    const models = vi.mocked(fetch).mock.calls.map(
      (call) =>
        JSON.parse(String(call[1]?.body ?? "{}")) as { model?: string },
    );
    expect(models.every((m) => m.model === OPENROUTER_MODEL)).toBe(true);
  });
});

describe("generateScoutingReport live OpenRouter", () => {
  const savedApiKey = process.env.OPENROUTER_API_KEY;

  afterEach(() => {
    if (savedApiKey === undefined) {
      delete process.env.OPENROUTER_API_KEY;
    } else {
      process.env.OPENROUTER_API_KEY = savedApiKey;
    }
  });

  it.skipIf(!process.env.OPENROUTER_API_KEY?.trim())(
    "calls OpenRouter and returns a schema-valid report (requires OPENROUTER_API_KEY)",
    async () => {
      const minimal = scoutingInputSchema.parse({
        opponentName: "Live smoke opponent",
        topStrengths: ["They push pace"],
        topWeaknesses: [],
        keyPlayers: [],
        thingsToLookOutFor: [],
        playerTendencies: [],
      });

      const result = await generateScoutingReport(minimal);
      expect(result.source).toBe("openrouter");
      expect(scoutingReportSchema.safeParse(result.report).success).toBe(true);
      expect(result.report.topThreats.length).toBeGreaterThan(0);
    },
    120_000,
  );
});
