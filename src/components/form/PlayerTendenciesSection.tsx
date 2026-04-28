import type { PlayerRowForm } from "@/lib/form-state";

type Props = {
  players: PlayerRowForm[];
  onChangePlayers: (next: PlayerRowForm[]) => void;
  fieldErrors?: Record<string, string>;
};

const label = "mb-1 block text-sm font-medium text-slate-700";
const input =
  "mt-0 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-court focus:outline-none focus:ring-1 focus:ring-court";
const textarea = `${input} min-h-[80px] resize-y`;
const errorText = "mt-1 text-xs text-red-600";

function rowErrors(
  index: number,
  fieldErrors: Record<string, string> | undefined,
): { id?: string; role?: string; notes?: string } {
  if (!fieldErrors) return {};
  return {
    id: fieldErrors[`playerTendencies.${index}.playerIdentifier`],
    role: fieldErrors[`playerTendencies.${index}.playerRole`],
    notes: fieldErrors[`playerTendencies.${index}.tendencyNotes`],
  };
}

export function PlayerTendenciesSection({
  players,
  onChangePlayers,
  fieldErrors,
}: Props) {
  function updateRow(index: number, patch: Partial<PlayerRowForm>) {
    const next = players.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    onChangePlayers(next);
  }

  function addRow() {
    onChangePlayers([
      ...players,
      { playerIdentifier: "", playerRole: "", tendencyNotes: "" },
    ]);
  }

  function removeRow(index: number) {
    if (players.length <= 1) return;
    onChangePlayers(players.filter((_, i) => i !== index));
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-court">Player tendencies</h2>
      <p className="mt-1 text-sm text-slate-600">
        Add opponent players and what they like to do. Leave blank rows out of
        the way — they won&apos;t be submitted.
      </p>
      <div className="mt-6 space-y-6">
        {players.map((row, index) => {
          const err = rowErrors(index, fieldErrors);
          return (
            <div
              key={index}
              className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Player {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  disabled={players.length <= 1}
                  className="text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor={`pid-${index}`}>
                    Name / number
                  </label>
                  <input
                    id={`pid-${index}`}
                    className={input}
                    value={row.playerIdentifier}
                    onChange={(e) =>
                      updateRow(index, { playerIdentifier: e.target.value })
                    }
                    placeholder="e.g. #0 or Avery Chen"
                  />
                  {err.id ? <p className={errorText}>{err.id}</p> : null}
                </div>
                <div>
                  <label className={label} htmlFor={`prole-${index}`}>
                    Role <span className="font-normal text-slate-500">(optional)</span>
                  </label>
                  <input
                    id={`prole-${index}`}
                    className={input}
                    value={row.playerRole}
                    onChange={(e) =>
                      updateRow(index, { playerRole: e.target.value })
                    }
                    placeholder="Guard, big, sixth man…"
                  />
                  {err.role ? <p className={errorText}>{err.role}</p> : null}
                </div>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor={`pnotes-${index}`}>
                    Tendency notes
                  </label>
                  <textarea
                    id={`pnotes-${index}`}
                    className={textarea}
                    value={row.tendencyNotes}
                    onChange={(e) =>
                      updateRow(index, { tendencyNotes: e.target.value })
                    }
                    placeholder="Drives, shooting habits, defense tells…"
                  />
                  {err.notes ? <p className={errorText}>{err.notes}</p> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-4 rounded-md border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-court hover:bg-slate-50"
      >
        + Add player
      </button>
    </section>
  );
}
