import type { ScoutingReport } from "./types";

/** Plain text for clipboard (player brief only). */
export function formatPlayerBriefPlainText(report: ScoutingReport): string {
  const b = report.playerBrief;
  return [
    "PLAYER BRIEF",
    "",
    "What to expect",
    b.whatToExpect,
    "",
    "Focus points",
    ...b.focusPoints.map((x) => `- ${x}`),
    "",
    "What to avoid",
    ...b.whatToAvoid.map((x) => `- ${x}`),
    "",
    "Mindset",
    b.mindsetMessage,
  ].join("\n");
}

/** Coach-facing report as Markdown. Confidence remains internal and is omitted. */
export function reportToMarkdown(
  report: ScoutingReport,
  titleSuffix?: string,
): string {
  const title = titleSuffix
    ? `Scouting report - ${titleSuffix}`
    : "Scouting report";
  const bullets = (items: string[]) => items.map((x) => `- ${x}`).join("\n");
  const reportItems = (
    items: { title: string; description: string; evidence: string[] }[],
  ) =>
    items
      .map(
        (item) =>
          `### ${item.title}\n\n${item.description}\n\n**Evidence:** ${
            item.evidence.join("; ") || "-"
          }`,
      )
      .join("\n\n");

  const brief = report.playerBrief;

  return [
    `# ${title}`,
    "",
    "## Opponent summary",
    report.opponentSummary,
    "",
    "## Top threats",
    reportItems(report.topThreats),
    "",
    "## Exploitable weaknesses",
    reportItems(report.exploitableWeaknesses),
    "",
    "## Defensive priorities",
    bullets(report.defensivePriorities),
    "",
    "## Offensive priorities",
    bullets(report.offensivePriorities),
    "",
    "## Key matchups",
    bullets(report.keyMatchups),
    "",
    "## First-quarter checklist",
    bullets(report.firstQuarterChecklist),
    "",
    "## In-game adjustment triggers",
    report.adjustmentTriggers
      .map((a) => `- **If:** ${a.trigger}\n  **Then:** ${a.adjustment}`)
      .join("\n"),
    "",
    "## Missing information",
    bullets(report.missingInformation),
    "",
    "## Player brief",
    "### What to expect",
    brief.whatToExpect,
    "",
    "### Focus points",
    bullets(brief.focusPoints),
    "",
    "### What to avoid",
    bullets(brief.whatToAvoid),
    "",
    "### Mindset",
    brief.mindsetMessage,
    "",
  ].join("\n");
}
