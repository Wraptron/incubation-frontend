"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormRenderer } from "@/components/program-renderer/FormRenderer";
import { ScoringForm } from "@/components/program-renderer/ScoringForm";
import {
  useProgramApplication,
  useProgramEvaluation,
} from "@/lib/program-forms/hooks";
import type { EvaluationScore } from "@/lib/program-forms/types";

export default function ProgramEvaluatePage() {
  const params = useParams();
  const formId = String(params.id);
  const appId = String(params.appId);

  const {
    application,
    loading: appLoading,
    error: appError,
  } = useProgramApplication(appId);

  const {
    evaluation,
    loading: evalLoading,
    error: evalError,
    saveScores,
    submit,
  } = useProgramEvaluation(appId);

  const [scores, setScores] = useState<EvaluationScore[] | null>(null);
  const [answersOpen, setAnswersOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeScores = scores ?? evaluation?.scores ?? [];
  const locked = evaluation?.status === "completed";

  const handleScoresChange = (next: EvaluationScore[]) => {
    setScores(next);
  };

  const handleBlurSave = async (next: EvaluationScore[]) => {
    if (locked) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      await saveScores(next);
      setMessage("Saved");
      setTimeout(() => setMessage(null), 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Autosave failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (locked) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await submit(activeScores);
      setMessage("Evaluation submitted");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const requiredMissing = useMemo(() => {
    if (!application) return false;
    return application.criteria_schema.some((c) => {
      if (!c.required) return false;
      const s = activeScores.find((x) => x.criteria_id === c.id);
      return s === undefined || s.value === null || s.value === "";
    });
  }, [application, activeScores]);

  if (appLoading || evalLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading evaluation…
        </div>
      </DashboardLayout>
    );
  }

  if (appError || evalError || !application || !evaluation) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-red-600">
            {appError || evalError || "Unable to load evaluation"}
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link
              href={`/dashboard/programs/${formId}/applications/${appId}`}
            >
              Back
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href={`/dashboard/programs/${formId}/applications/${appId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to application
          </Link>
        </Button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Evaluate — {application.team_name || application.applicant_name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  locked
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }
              >
                {locked ? "completed" : "in progress"}
              </Badge>
              {saving && (
                <span className="text-xs text-zinc-400">Saving…</span>
              )}
              {message && (
                <span className="text-xs text-emerald-600">{message}</span>
              )}
            </div>
          </div>
          <Button
            disabled={locked || submitting || requiredMissing}
            onClick={() => void handleSubmit()}
          >
            {submitting
              ? "Submitting…"
              : locked
                ? "Submitted"
                : "Submit Evaluation"}
          </Button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {locked && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            This evaluation is locked. Further edits are disabled.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <ScoringForm
              criteria={application.criteria_schema}
              scores={activeScores}
              readOnly={locked}
              onChange={locked ? undefined : handleScoresChange}
              onBlurSave={locked ? undefined : (s) => void handleBlurSave(s)}
            />
          </div>

          <aside>
            <div className="sticky top-4 rounded-lg border border-zinc-200 bg-white">
              <button
                type="button"
                className="flex w-full items-center gap-2 border-b border-zinc-100 px-4 py-3 text-left font-semibold text-zinc-900"
                onClick={() => setAnswersOpen((o) => !o)}
              >
                {answersOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Applicant answers
              </button>
              {answersOpen && (
                <div className="max-h-[70vh] overflow-y-auto p-4">
                  <FormRenderer
                    fields={application.field_schema}
                    answers={application.answers}
                    readOnly
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
