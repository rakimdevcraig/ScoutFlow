import { z } from "zod";

/**
 * Zod shapes aligned with SCHEMAS.md (ScoutingInput, ScoutingReport, nested types).
 * TypeScript types: infer from these in [types.ts](./types.ts) via z.infer.
 */

export const confidenceLevelSchema = z.enum(["low", "medium", "high"]);

export const playerTendencyInputSchema = z.object({
  playerIdentifier: z.string().min(1, "Name or number is required"),
  playerRole: z.string().optional(),
  tendencyNotes: z.string().min(1, "Add at least one tendency note"),
});

export const scoutingInputSchema = z.object({
  opponentName: z.string().min(1, "Opponent name is required"),
  gameDate: z.string().optional(),
  location: z.enum(["home", "away", "neutral"]).optional(),
  gameImportance: z
    .enum(["league", "playoffs", "tournament", "scrimmage"])
    .optional(),
  paceOfPlay: z.string().optional(),
  offensiveStyle: z.string().optional(),
  defensiveStyle: z.string().optional(),
  topStrengths: z.array(z.string()),
  topWeaknesses: z.array(z.string()),
  keyPlayers: z.array(z.string()),
  thingsToLookOutFor: z.array(z.string()),
  freeformOpponentNotes: z.string().optional(),
  playerTendencies: z.array(playerTendencyInputSchema),
  topGamePriority: z.string().optional(),
  riskLevel: z.enum(["conservative", "balanced", "aggressive"]).optional(),
  outputTone: z.enum(["tactical", "simple", "motivational"]).optional(),
});

export const reportItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  evidence: z.array(z.string()),
  confidence: confidenceLevelSchema,
});

export const adjustmentTriggerSchema = z.object({
  trigger: z.string(),
  adjustment: z.string(),
});

/** SCHEMAS.md "PlayerBrief" nested on ScoutingReport */
export const playerBriefOutputSchema = z.object({
  whatToExpect: z.string(),
  focusPoints: z.array(z.string()),
  whatToAvoid: z.array(z.string()),
  mindsetMessage: z.string(),
});

export const scoutingReportSchema = z.object({
  opponentSummary: z.string(),
  topThreats: z.array(reportItemSchema),
  exploitableWeaknesses: z.array(reportItemSchema),
  defensivePriorities: z.array(z.string()),
  offensivePriorities: z.array(z.string()),
  keyMatchups: z.array(z.string()),
  firstQuarterChecklist: z.array(z.string()),
  adjustmentTriggers: z.array(adjustmentTriggerSchema),
  missingInformation: z.array(z.string()),
  playerBrief: playerBriefOutputSchema,
});
