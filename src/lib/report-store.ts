import type { ScoutingInput, ScoutingReport } from "./types";

const INPUT_KEY = "scoutflow:lastValidatedInput";
const REPORT_KEY = "scoutflow:lastReport";
const REPORT_SOURCE_KEY = "scoutflow:lastReportSource";

/** How the last report was produced (for UI banner). */
export type LastReportSource = "openrouter";

/** Includes empty session when no report is stored. */
export type DisplayReportSource = LastReportSource | "none";

export function saveLastValidatedInput(input: ScoutingInput): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(INPUT_KEY, JSON.stringify(input));
  } catch {
    // ignore quota / private mode
  }
}

export function loadLastValidatedInput(): ScoutingInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(INPUT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ScoutingInput;
  } catch {
    return null;
  }
}

export function saveLastReport(
  report: ScoutingReport,
  source: LastReportSource,
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(REPORT_KEY, JSON.stringify(report));
    sessionStorage.setItem(REPORT_SOURCE_KEY, source);
  } catch {
    // ignore
  }
}

export function loadLastReport(): ScoutingReport | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(REPORT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ScoutingReport;
  } catch {
    return null;
  }
}

export function loadLastReportSource(): LastReportSource | null {
  if (typeof window === "undefined") return null;
  const s = sessionStorage.getItem(REPORT_SOURCE_KEY);
  if (s === "openrouter") return "openrouter";
  return null;
}
