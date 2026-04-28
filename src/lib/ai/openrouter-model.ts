/** Default primary OpenRouter model id (see AI_PROMPTS.md). */
export const OPENROUTER_MODEL = "google/gemma-4-31b-it:free";

/** Default fallback when the primary model’s HTTP path fails (override via OPENROUTER_FALLBACK_MODEL). */
export const OPENROUTER_FALLBACK_MODEL = "minimax/minimax-m2.5:free";

export function resolveOpenRouterPrimaryModel(): string {
  const fromEnv = process.env.OPENROUTER_MODEL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : OPENROUTER_MODEL;
}

export function resolveOpenRouterFallbackModel(): string {
  const fromEnv = process.env.OPENROUTER_FALLBACK_MODEL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : OPENROUTER_FALLBACK_MODEL;
}

export const OPENROUTER_CHAT_COMPLETIONS_URL =
  "https://openrouter.ai/api/v1/chat/completions";
