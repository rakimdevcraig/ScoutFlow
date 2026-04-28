import type { z } from "zod";
import {
  adjustmentTriggerSchema,
  confidenceLevelSchema,
  playerBriefOutputSchema,
  playerTendencyInputSchema,
  reportItemSchema,
  scoutingInputSchema,
  scoutingReportSchema,
} from "./schemas";

export type ConfidenceLevel = z.infer<typeof confidenceLevelSchema>;
export type PlayerTendencyInput = z.infer<typeof playerTendencyInputSchema>;
export type ScoutingInput = z.infer<typeof scoutingInputSchema>;
export type ReportItem = z.infer<typeof reportItemSchema>;
export type AdjustmentTrigger = z.infer<typeof adjustmentTriggerSchema>;
/** SCHEMAS.md nested player brief on the report */
export type PlayerBriefOutput = z.infer<typeof playerBriefOutputSchema>;
export type ScoutingReport = z.infer<typeof scoutingReportSchema>;
