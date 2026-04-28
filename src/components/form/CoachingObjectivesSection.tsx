import type { CoachingObjectivesForm } from "@/lib/form-state";

type Props = {
  value: CoachingObjectivesForm;
  onChange: (patch: Partial<CoachingObjectivesForm>) => void;
};

const label = "mb-1 block text-sm font-medium text-slate-700";
const input =
  "mt-0 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-court focus:outline-none focus:ring-1 focus:ring-court";

export function CoachingObjectivesSection({ value, onChange }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-court">Coaching objectives</h2>
      <p className="mt-1 text-sm text-slate-600">
        What matters most tonight and how you want the report framed.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="topGamePriority" className={label}>
            Top game priority
          </label>
          <input
            id="topGamePriority"
            className={input}
            value={value.topGamePriority}
            onChange={(e) => onChange({ topGamePriority: e.target.value })}
            placeholder="e.g. Limit second-chance points"
          />
        </div>
        <div>
          <label htmlFor="riskLevel" className={label}>
            Risk level
          </label>
          <select
            id="riskLevel"
            className={input}
            value={value.riskLevel}
            onChange={(e) =>
              onChange({
                riskLevel: e.target
                  .value as CoachingObjectivesForm["riskLevel"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        <div>
          <label htmlFor="outputTone" className={label}>
            Output tone
          </label>
          <select
            id="outputTone"
            className={input}
            value={value.outputTone}
            onChange={(e) =>
              onChange({
                outputTone: e.target
                  .value as CoachingObjectivesForm["outputTone"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="tactical">Tactical</option>
            <option value="simple">Simple</option>
            <option value="motivational">Motivational</option>
          </select>
        </div>
      </div>
    </section>
  );
}
