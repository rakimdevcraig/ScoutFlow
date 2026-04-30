"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoachReport } from "@/components/report/CoachReport";
import { PlayerBrief } from "@/components/report/PlayerBrief";
import { Header } from "@/components/Header";
import {
  formatPlayerBriefPlainText,
  reportToMarkdown,
} from "@/lib/export-report";
import {
  loadLastReport,
  loadLastReportSource,
  loadLastValidatedInput,
  saveLastReport,
  type LastReportSource,
} from "@/lib/report-store";
import type { ScoutingInput, ScoutingReport } from "@/lib/types";

function isLastReportSource(s: string): s is LastReportSource {
  return s === "openrouter";
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportPage() {
  const [lastInput, setLastInput] = useState<ScoutingInput | null>(null);
  const [report, setReport] = useState<ScoutingReport | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setLastInput(loadLastValidatedInput());
    const stored = loadLastReport();
    const src = loadLastReportSource();
    if (stored && src === "openrouter") {
      setReport(stored);
    } else {
      setReport(null);
    }
  }, []);

  async function regenerateReport() {
    if (!lastInput) {
      setActionError("Create a report first before regenerating.");
      return;
    }
    setActionError(null);
    setActionMessage(null);
    setIsRegenerating(true);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastInput),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        report?: ScoutingReport;
        source?: LastReportSource;
      };

      if (!res.ok) {
        setActionError(
          typeof data.error === "string"
            ? data.error
            : "Could not regenerate the report.",
        );
        return;
      }

      if (!data.report || data.source === undefined) {
        setActionError("Unexpected response from server.");
        return;
      }
      if (!isLastReportSource(data.source)) {
        setActionError("Unexpected response from server.");
        return;
      }

      setReport(data.report);
      saveLastReport(data.report, data.source);
      setActionMessage("Report regenerated.");
    } finally {
      setIsRegenerating(false);
    }
  }

  async function copyPlayerBrief() {
    if (!report) return;
    setActionError(null);
    setActionMessage(null);
    try {
      await navigator.clipboard.writeText(formatPlayerBriefPlainText(report));
      setActionMessage("Player brief copied.");
    } catch {
      setActionError("Could not copy to clipboard.");
    }
  }

  function downloadMarkdown() {
    if (!report) return;
    const namePart = lastInput?.opponentName
      ? lastInput.opponentName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : "report";
    downloadTextFile(
      `scoutflow-${namePart}-report.md`,
      reportToMarkdown(report, lastInput?.opponentName),
    );
    setActionError(null);
    setActionMessage("Markdown report downloaded.");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Scouting report</h1>
            {lastInput ? (
              <p className="mt-2 text-sm text-slate-600">
                Prepared for your game vs{" "}
                <strong>{lastInput.opponentName}</strong>
                {lastInput.gameDate ? (
                  <>
                    {" "}
                    on <strong>{lastInput.gameDate}</strong>
                  </>
                ) : null}
                .
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                Add opponent details from{" "}
                <Link
                  href="/"
                  className="font-medium text-court underline"
                >
                  Create report
                </Link>{" "}
                to personalize the header.
              </p>
            )}
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            New report
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={regenerateReport}
            disabled={!lastInput || isRegenerating}
            className="rounded-lg bg-court px-4 py-2 text-sm font-semibold text-white shadow hover:bg-court-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegenerating ? "Regenerating..." : "Regenerate report"}
          </button>
          <button
            type="button"
            onClick={copyPlayerBrief}
            disabled={!report}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy player brief
          </button>
          <button
            type="button"
            onClick={downloadMarkdown}
            disabled={!report}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download Markdown
          </button>
        </div>

        {actionMessage ? (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
            {actionMessage}
          </div>
        ) : null}

        {actionError ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {actionError}
          </div>
        ) : null}

        {report ? (
          <article className="mt-10 space-y-12 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <CoachReport report={report} />
            <PlayerBrief brief={report.playerBrief} />
          </article>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center text-sm text-slate-600">
            <p className="font-medium text-slate-800">No report to show yet.</p>
            <p className="mt-2">
              Go to{" "}
              <Link href="/" className="font-semibold text-court underline">
                Create report
              </Link>{" "}
              and submit the form. Reports are generated with OpenRouter
              (Nemotron 3 Nano)
              and stored for this session only.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
