/** Used when the first model response fails JSON extraction or Zod validation. */
export const REPAIR_PROMPT = `Your previous response did not match the required JSON format.

Return the same scouting report again as valid JSON only.
Do not include markdown fences.
Do not include any explanation before or after the JSON.
Ensure all keys match the required schema exactly.`;
