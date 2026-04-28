import type { OpponentProfileForm } from "@/lib/form-state";

type Props = {
  value: OpponentProfileForm;
  onChange: (patch: Partial<OpponentProfileForm>) => void;
};

const label = "mb-1 block text-sm font-medium text-slate-700";
const input =
  "mt-0 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-court focus:outline-none focus:ring-1 focus:ring-court";
const textarea = `${input} min-h-[88px] resize-y`;

const hint =
  "One item per line (or comma-separated). Empty lines are ignored.";

export function OpponentProfileSection({ value, onChange }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-court">Opponent profile</h2>
      <p className="mt-1 text-sm text-slate-600">
        Style of play and what stands out about this team.
      </p>
      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="paceOfPlay" className={label}>
              Pace of play
            </label>
            <input
              id="paceOfPlay"
              className={input}
              value={value.paceOfPlay}
              onChange={(e) => onChange({ paceOfPlay: e.target.value })}
              placeholder="e.g. Fast in transition"
            />
          </div>
          <div>
            <label htmlFor="offensiveStyle" className={label}>
              Offensive style
            </label>
            <input
              id="offensiveStyle"
              className={input}
              value={value.offensiveStyle}
              onChange={(e) => onChange({ offensiveStyle: e.target.value })}
              placeholder="e.g. 4-out, drive & kick"
            />
          </div>
          <div>
            <label htmlFor="defensiveStyle" className={label}>
              Defensive style
            </label>
            <input
              id="defensiveStyle"
              className={input}
              value={value.defensiveStyle}
              onChange={(e) => onChange({ defensiveStyle: e.target.value })}
              placeholder="e.g. Aggressive man"
            />
          </div>
        </div>
        <div>
          <label htmlFor="topStrengths" className={label}>
            Top strengths
          </label>
          <p className="mb-1 text-xs text-slate-500">{hint}</p>
          <textarea
            id="topStrengths"
            className={textarea}
            value={value.topStrengths}
            onChange={(e) => onChange({ topStrengths: e.target.value })}
            placeholder="Paint touches off the dribble&#10;Offensive rebounding"
          />
        </div>
        <div>
          <label htmlFor="topWeaknesses" className={label}>
            Top weaknesses
          </label>
          <p className="mb-1 text-xs text-slate-500">{hint}</p>
          <textarea
            id="topWeaknesses"
            className={textarea}
            value={value.topWeaknesses}
            onChange={(e) => onChange({ topWeaknesses: e.target.value })}
            placeholder="Turnovers under pressure&#10;Slow recovery after misses"
          />
        </div>
        <div>
          <label htmlFor="keyPlayers" className={label}>
            Key players to know
          </label>
          <p className="mb-1 text-xs text-slate-500">{hint}</p>
          <textarea
            id="keyPlayers"
            className={textarea}
            value={value.keyPlayers}
            onChange={(e) => onChange({ keyPlayers: e.target.value })}
            placeholder="#0 — lead guard&#10;#12 — energy forward"
          />
        </div>
        <div>
          <label htmlFor="thingsToLookOutFor" className={label}>
            Things to look out for
          </label>
          <p className="mb-1 text-xs text-slate-500">{hint}</p>
          <textarea
            id="thingsToLookOutFor"
            className={textarea}
            value={value.thingsToLookOutFor}
            onChange={(e) => onChange({ thingsToLookOutFor: e.target.value })}
            placeholder="Early drag screens in transition"
          />
        </div>
        <div>
          <label htmlFor="freeformOpponentNotes" className={label}>
            Freeform opponent notes
          </label>
          <textarea
            id="freeformOpponentNotes"
            className={textarea}
            value={value.freeformOpponentNotes}
            onChange={(e) =>
              onChange({ freeformOpponentNotes: e.target.value })
            }
            placeholder="Anything else — crowd, refs, last matchup, etc."
          />
        </div>
      </div>
    </section>
  );
}
