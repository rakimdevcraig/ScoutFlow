/**
 * Normalize free-text into string[] for ScoutingInput list fields per SCHEMAS.md:
 * topStrengths, topWeaknesses, keyPlayers, thingsToLookOutFor.
 */

/**
 * Split on newlines, commas, or semicolons into trimmed non-empty strings.
 */
export function normalizeToStringList(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
