import type { PlayerBriefOutput } from "@/lib/types";

type Props = {
  brief: PlayerBriefOutput;
};

export function PlayerBrief({ brief }: Props) {
  return (
    <div className="rounded-xl border border-court/30 bg-gradient-to-br from-court/5 to-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-court">Player-facing brief</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-800">
        {brief.whatToExpect}
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-court">
            Focus points
          </h4>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
            {brief.focusPoints.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-red-800/80">
            What to avoid
          </h4>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
            {brief.whatToAvoid.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <blockquote className="mt-6 border-l-4 border-court-accent pl-4 text-sm italic text-slate-700">
        {brief.mindsetMessage}
      </blockquote>
    </div>
  );
}
