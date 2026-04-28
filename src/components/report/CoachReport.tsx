import type { ScoutingReport } from "@/lib/types";

type Props = {
  report: ScoutingReport;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-slate-200 pb-2 text-base font-semibold text-court">
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-slate-500">—</p>;
  return (
    <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-700">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function CoachReport({ report }: Props) {
  return (
    <div className="space-y-10">
      <section>
        <SectionTitle>Opponent summary</SectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {report.opponentSummary}
        </p>
      </section>

      <section>
        <SectionTitle>Top threats</SectionTitle>
        <ul className="mt-3 space-y-4">
          {report.topThreats.map((t, i) => (
            <li
              key={i}
              className="rounded-lg border border-slate-200 bg-slate-50/80 p-4"
            >
              <p className="font-medium text-slate-900">{t.title}</p>
              <p className="mt-1 text-sm text-slate-700">{t.description}</p>
              {t.evidence.length > 0 ? (
                <p className="mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Evidence: </span>
                  {t.evidence.join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>Exploitable weaknesses</SectionTitle>
        <ul className="mt-3 space-y-4">
          {report.exploitableWeaknesses.map((w, i) => (
            <li
              key={i}
              className="rounded-lg border border-slate-200 bg-slate-50/80 p-4"
            >
              <p className="font-medium text-slate-900">{w.title}</p>
              <p className="mt-1 text-sm text-slate-700">{w.description}</p>
              {w.evidence.length > 0 ? (
                <p className="mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Evidence: </span>
                  {w.evidence.join(" · ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>Defensive priorities</SectionTitle>
        <div className="mt-3">
          <BulletList items={report.defensivePriorities} />
        </div>
      </section>

      <section>
        <SectionTitle>Offensive priorities</SectionTitle>
        <div className="mt-3">
          <BulletList items={report.offensivePriorities} />
        </div>
      </section>

      <section>
        <SectionTitle>Key matchups</SectionTitle>
        <div className="mt-3">
          <BulletList items={report.keyMatchups} />
        </div>
      </section>

      <section>
        <SectionTitle>First-quarter checklist</SectionTitle>
        <div className="mt-3">
          <BulletList items={report.firstQuarterChecklist} />
        </div>
      </section>

      <section>
        <SectionTitle>In-game adjustment triggers</SectionTitle>
        <ul className="mt-3 space-y-3">
          {report.adjustmentTriggers.map((a, i) => (
            <li
              key={i}
              className="rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm"
            >
              <p className="font-medium text-amber-950">If: {a.trigger}</p>
              <p className="mt-1 text-amber-900/90">Then: {a.adjustment}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>Missing information</SectionTitle>
        <div className="mt-3">
          <BulletList items={report.missingInformation} />
        </div>
      </section>
    </div>
  );
}
