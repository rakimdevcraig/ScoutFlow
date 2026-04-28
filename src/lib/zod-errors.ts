import type { ZodIssue } from "zod";

/** First message per dotted path (e.g. playerTendencies.0.tendencyNotes). */
export function zodIssuesToFieldMap(issues: ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const path = issue.path.length ? issue.path.join(".") : "_root";
    if (out[path] === undefined) {
      out[path] = issue.message;
    }
  }
  return out;
}
