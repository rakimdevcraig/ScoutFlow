import type { GameContextForm } from "@/lib/form-state";

type Props = {
  value: GameContextForm;
  onChange: (patch: Partial<GameContextForm>) => void;
  fieldErrors?: Partial<Record<keyof GameContextForm, string>>;
};

const label = "mb-1 block text-sm font-medium text-slate-700";
const input =
  "mt-0 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-court focus:outline-none focus:ring-1 focus:ring-court";
const errorText = "mt-1 text-xs text-red-600";

export function GameContextSection({ value, onChange, fieldErrors }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-court">Game context</h2>
      <p className="mt-1 text-sm text-slate-600">
        Who you&apos;re playing, when, and how much it matters.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="opponentName" className={label}>
            Opponent name <span className="text-red-500">*</span>
          </label>
          <input
            id="opponentName"
            className={input}
            value={value.opponentName}
            onChange={(e) => onChange({ opponentName: e.target.value })}
            placeholder="e.g. Central High"
            autoComplete="organization"
          />
          {fieldErrors?.opponentName ? (
            <p className={errorText}>{fieldErrors.opponentName}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="gameDate" className={label}>
            Game date
          </label>
          <input
            id="gameDate"
            type="date"
            className={input}
            value={value.gameDate}
            onChange={(e) => onChange({ gameDate: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="location" className={label}>
            Location
          </label>
          <select
            id="location"
            className={input}
            value={value.location}
            onChange={(e) =>
              onChange({
                location: e.target.value as GameContextForm["location"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="home">Home</option>
            <option value="away">Away</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="gameImportance" className={label}>
            Game importance
          </label>
          <select
            id="gameImportance"
            className={input}
            value={value.gameImportance}
            onChange={(e) =>
              onChange({
                gameImportance: e.target
                  .value as GameContextForm["gameImportance"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="league">League</option>
            <option value="playoffs">Playoffs</option>
            <option value="tournament">Tournament</option>
            <option value="scrimmage">Scrimmage</option>
          </select>
        </div>
      </div>
    </section>
  );
}
