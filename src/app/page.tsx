"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CoachingObjectivesSection } from "@/components/form/CoachingObjectivesSection";
import { GameContextSection } from "@/components/form/GameContextSection";
import { OpponentProfileSection } from "@/components/form/OpponentProfileSection";
import { PlayerTendenciesSection } from "@/components/form/PlayerTendenciesSection";
import { Header } from "@/components/Header";
import { computeInputCompleteness } from "@/lib/completeness";
import {
  formStateForCompleteness,
  formStateToScoutingInput,
  getInitialFormState,
  scoutingInputToFormState,
  type ScoutingFormState,
} from "@/lib/form-state";
import { mockSampleScoutingInput } from "@/lib/mock-data";
import {
  saveLastReport,
  saveLastValidatedInput,
  type LastReportSource,
} from "@/lib/report-store";
import { scoutingInputSchema } from "@/lib/schemas";
import type { ScoutingReport } from "@/lib/types";
import { zodIssuesToFieldMap } from "@/lib/zod-errors";

function isLastReportSource(s: string): s is LastReportSource {
  return s === "openrouter";
}

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState<ScoutingFormState>(getInitialFormState);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeness = useMemo(() => {
    return computeInputCompleteness(formStateForCompleteness(form));
  }, [form]);

  function setGame(patch: Partial<ScoutingFormState["game"]>) {
    setForm(f => ({ ...f, game: { ...f.game, ...patch } }));
  }

  function setOpponent(patch: Partial<ScoutingFormState["opponent"]>) {
    setForm(f => ({ ...f, opponent: { ...f.opponent, ...patch } }));
  }

  function setCoaching(patch: Partial<ScoutingFormState["coaching"]>) {
    setForm(f => ({ ...f, coaching: { ...f.coaching, ...patch } }));
  }

  function useDemoData() {
    setSubmitError(null);
    setFieldErrors({});
    setForm(scoutingInputToFormState(mockSampleScoutingInput));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const raw = formStateToScoutingInput(form);
    const parsed = scoutingInputSchema.safeParse(raw);
    if (!parsed.success) {
      setFieldErrors(zodIssuesToFieldMap(parsed.error.issues));
      const root = parsed.error.flatten().formErrors[0];
      setSubmitError(root ?? "Please fix the highlighted fields.");
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        report?: ScoutingReport;
        source?: LastReportSource;
      };

      if (!res.ok) {
        setSubmitError(
          typeof data.error === "string"
            ? data.error
            : "Could not generate report. Try again.",
        );
        return;
      }

      if (!data.report || data.source === undefined) {
        setSubmitError("Unexpected response from server.");
        return;
      }
      if (!isLastReportSource(data.source)) {
        setSubmitError("Unexpected response from server.");
        return;
      }

      saveLastValidatedInput(parsed.data);
      saveLastReport(data.report, data.source);
      router.push("/report");
    } finally {
      setIsSubmitting(false);
    }
  }

  const gameFieldErrors = {
    opponentName: fieldErrors.opponentName,
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-center text-2xl font-bold text-slate-900">
          Create scouting report
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Submit your notes to generate a structured report
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <span className="font-medium text-slate-700">Input completeness</span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-court ring-1 ring-slate-200">
            {completeness.score}%
          </span>
          {completeness.isSparse && completeness.message ? (
            <span className="text-amber-800">{completeness.message}</span>
          ) : null}
        </div>

        {submitError ? (
          <div
            className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {submitError}
          </div>
        ) : null}

        <div className="mt-6 rounded-lg border border-court/20 bg-white p-4 text-sm text-slate-700 shadow-sm">
          Want to try the flow quickly?{" "}
          <button
            type="button"
            onClick={useDemoData}
            disabled={isSubmitting}
            className="font-semibold text-court underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            Use demo data
          </button>
          .
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <GameContextSection
            value={form.game}
            onChange={setGame}
            fieldErrors={gameFieldErrors}
          />
          <OpponentProfileSection
            value={form.opponent}
            onChange={setOpponent}
          />
          <PlayerTendenciesSection
            players={form.players}
            onChangePlayers={players => setForm(f => ({ ...f, players }))}
            fieldErrors={fieldErrors}
          />
          <CoachingObjectivesSection
            value={form.coaching}
            onChange={setCoaching}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={useDemoData}
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Use demo data
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-lg bg-court px-6 py-3 text-sm font-semibold text-white shadow hover:bg-court-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Generating…" : "Generate report"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
