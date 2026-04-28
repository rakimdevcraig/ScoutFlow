import type { ScoutingInput } from "./types";

const SPARSE_THRESHOLD = 45;

/**
 * Rough 0–100 score based on how many optional fields are filled.
 * opponentName is required elsewhere; it still contributes to "richness".
 */
export function computeInputCompleteness(input: ScoutingInput): {
  score: number;
  isSparse: boolean;
  message: string | null;
} {
  const checks: boolean[] = [
    Boolean(input.opponentName?.trim()),
    Boolean(input.gameDate?.trim()),
    input.location !== undefined,
    input.gameImportance !== undefined,
    Boolean(input.paceOfPlay?.trim()),
    Boolean(input.offensiveStyle?.trim()),
    Boolean(input.defensiveStyle?.trim()),
    input.topStrengths.length > 0,
    input.topWeaknesses.length > 0,
    input.keyPlayers.length > 0,
    input.thingsToLookOutFor.length > 0,
    Boolean(input.freeformOpponentNotes?.trim()),
    input.playerTendencies.length > 0,
    Boolean(input.topGamePriority?.trim()),
    input.riskLevel !== undefined,
    input.outputTone !== undefined,
  ];

  const filled = checks.filter(Boolean).length;
  const score = Math.round((filled / checks.length) * 100);
  const isSparse = score < SPARSE_THRESHOLD;

  return {
    score,
    isSparse,
    message: isSparse
      ? "Your notes are fairly light — the report may miss details. Add strengths, weaknesses, and player tendencies if you can."
      : null,
  };
}
