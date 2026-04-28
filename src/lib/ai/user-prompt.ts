import type { ScoutingInput } from "../types";

const USER_PREFIX = `Generate a structured basketball scouting report from the following input.

Rules:

- Output valid JSON only
- Do not include markdown fences
- Do not ask questions
- Do not invent details not grounded in the input
- Use missingInformation when needed
- If you output anything before or after the JSON object, the response will be rejected

Scouting input:
`;

/** Builds the user message from validated scouting input (normalized as JSON). */
export function buildUserPrompt(input: ScoutingInput): string {
  return `${USER_PREFIX}${JSON.stringify(input, null, 2)}`;
}
