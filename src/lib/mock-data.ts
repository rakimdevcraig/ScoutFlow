import { scoutingInputSchema, scoutingReportSchema } from "./schemas";
import type { ScoutingInput, ScoutingReport } from "./types";

/** Example object from SCHEMAS.md — runtime-validated. */
const mockSampleInputRaw = {
  opponentName: "Central High",
  gameDate: "2026-04-26",
  location: "away" as const,
  gameImportance: "league" as const,
  paceOfPlay: "Fast, especially after defensive rebounds",
  offensiveStyle: "4-out, heavy guard penetration",
  defensiveStyle: "Aggressive man-to-man with occasional trapping",
  topStrengths: [
    "Create paint touches off the dribble",
    "Push pace in transition",
    "Crash the offensive glass",
  ],
  topWeaknesses: [
    "Can be turnover-prone under ball pressure",
    "Slow to recover after missed shots",
  ],
  keyPlayers: ["Player 0", "Player 12"],
  thingsToLookOutFor: [
    "Early drag screens in transition",
    "Corner help opens up skip passes",
  ],
  freeformOpponentNotes:
    "They feed off momentum and can go on quick runs if the crowd gets involved.",
  playerTendencies: [
    {
      playerIdentifier: "Player 0",
      playerRole: "Guard",
      tendencyNotes:
        "Likes to drive left into pull-up jumpers and drive right to attack the rim.",
    },
    {
      playerIdentifier: "Player 12",
      playerRole: "Forward",
      tendencyNotes:
        "Runs the floor hard and crashes the offensive glass every possession.",
    },
  ],
  topGamePriority:
    "Keep the ball out of the middle and limit second-chance points.",
  riskLevel: "balanced" as const,
  outputTone: "tactical" as const,
};

/** Canonical mock scouting input (SCHEMAS.md). */
export const mockSampleScoutingInput: ScoutingInput =
  scoutingInputSchema.parse(mockSampleInputRaw);

/** Example object from SCHEMAS.md — runtime-validated. */
const mockSampleReportRaw = {
  opponentSummary:
    "Central High wants to play fast, create paint pressure through its guards, and generate second-chance points through aggressive offensive rebounding.",
  topThreats: [
    {
      title: "Guard-driven paint pressure",
      description:
        "Their lead guard creates rim pressure to the right and can punish left drives with pull-up jumpers.",
      evidence: [
        "Player 0 likes to drive left into pull-up jumpers and drive right to attack the rim.",
      ],
      confidence: "high" as const,
    },
  ],
  exploitableWeaknesses: [
    {
      title: "Turnover vulnerability under pressure",
      description:
        "They may be vulnerable if the defense disrupts rhythm early and applies disciplined ball pressure.",
      evidence: ["Can be turnover-prone under ball pressure"],
      confidence: "high" as const,
    },
  ],
  defensivePriorities: [
    "Keep the ball out of the middle.",
    "Finish possessions with box outs.",
    "Build early transition defense.",
  ],
  offensivePriorities: [
    "Attack before their defense gets set after missed shots.",
    "Use pressure to force rushed decisions.",
  ],
  keyMatchups: [
    "Primary on-ball defender must sit on Player 0's right-hand rim attacks while staying ready for left-hand pull-up counters.",
    "Frontcourt players must body Player 12 early on shot release.",
  ],
  firstQuarterChecklist: [
    "See whether Player 0 is getting downhill right without resistance.",
    "Track whether Player 12 is creating extra possessions on the glass.",
    "Confirm whether their trapping pressure is consistent or situational.",
  ],
  adjustmentTriggers: [
    {
      trigger:
        "If Player 0 is getting into the paint repeatedly going right",
      adjustment:
        "Shrink gaps earlier and send help from a non-shooter instead of allowing clean rim pressure.",
    },
  ],
  missingInformation: [
    "Limited information about their half-court zone offense.",
    "No bench player tendencies were provided.",
  ],
  playerBrief: {
    whatToExpect:
      "Expect an up-tempo team that wants to attack the paint and generate momentum through transition and rebounding.",
    focusPoints: [
      "Protect the paint early.",
      "Box out every possession.",
      "Take care of the ball against pressure.",
    ],
    whatToAvoid: [
      "Live-ball turnovers",
      "Late help on strong-side drives",
    ],
    mindsetMessage:
      "Be disciplined early, control the pace, and make them earn everything in the half court.",
  },
};

/** Canonical mock report (SCHEMAS.md). `confidence` must not be shown in UI. */
export const mockSampleScoutingReport: ScoutingReport =
  scoutingReportSchema.parse(mockSampleReportRaw);

/** Backward-compatible name — same as mockSampleScoutingReport. */
export const mockScoutingReport = mockSampleScoutingReport;
