"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ScoringForm } from "@/components/program-renderer/ScoringForm";
import {
  useProgramApplication,
  useProgramEvaluation,
} from "@/lib/program-forms/hooks";
import type { EvaluationScore, ProgramFormField } from "@/lib/program-forms/types";
import {
  formatAnswer,
  groupBySection,
  isAnswerFileUrl,
} from "@/lib/program-forms/utils";

function FieldValue({
  field,
  value,
}: {
  field: ProgramFormField;
  value: unknown;
}) {
  if (isAnswerFileUrl(field, value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
      >
        <Download className="h-3.5 w-3.5" />
        {field.field_type === "image" ? "View image" : "Download file"}
      </a>
    );
  }

  const formatted = formatAnswer(field, value);
  const isEmail = field.field_type === "email" && typeof value === "string" && value;
  const isPhone = field.field_type === "phone" && typeof value === "string" && value;

  if (isEmail) {
    return (
      <a
        href={`mailto:${value}`}
        className="text-blue-600 hover:underline dark:text-blue-400"
      >
        {formatted}
      </a>
    );
  }

  if (isPhone) {
    return (
      <a
        href={`tel:${value}`}
        className="text-blue-600 hover:underline dark:text-blue-400"
      >
        {formatted}
      </a>
    );
  }

  return <span>{formatted}</span>;
}

export default function ProgramEvaluatePage() {
  const router = useRouter();
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
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeScores = scores ?? evaluation?.scores ?? [];
  const locked = evaluation?.status === "completed";

  const sections = useMemo(() => {
    if (!application) return [];
    return groupBySection(application.field_schema);
  }, [application]);

  const totalScore = useMemo(() => {
    const sum = activeScores.reduce((acc, s) => {
      const num = typeof s.value === "number" ? s.value : Number(s.value);
      return acc + (Number.isFinite(num) ? num : 0);
    }, 0);
    return sum.toFixed(1);
  }, [activeScores]);

  const maxScore = (application?.criteria_schema.length ?? 0) * 10;

  const handleScoresChange = (next: EvaluationScore[]) => {
    setScores(next);
  };

  const handleBlurSave = async (next: EvaluationScore[]) => {
    if (locked) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      await saveScores(next);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Autosave failed");
    } finally {
      setSaving(false);
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

  const handleSave = async () => {
    if (locked) return;
    if (requiredMissing) {
      setErrorMsg("Please provide scores for all required criteria (0–10)");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setMessage(null);
    try {
      await submit(activeScores);
      setMessage("Evaluation saved successfully");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save evaluation");
    } finally {
      setSubmitting(false);
    }
  };

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

  const displayTitle =
    application.team_name || application.applicant_name || "Application";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/programs/${formId}/applications/${appId}`
                )
              }
              className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-black dark:text-zinc-50">
              Evaluate Application
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Total Score:{" "}
              <span className="font-bold text-black dark:text-zinc-50">
                {totalScore}/{maxScore.toFixed(1)}
              </span>
            </div>
            <Button
              onClick={() => void handleSave()}
              disabled={locked || submitting || requiredMissing}
              variant="default"
            >
              {submitting
                ? "Saving..."
                : locked
                  ? "Saved"
                  : "Save Evaluation"}
            </Button>
          </div>
        </div>

        {(message || errorMsg || saving) && (
          <div className="mb-4">
            <div
              className={`rounded-lg p-4 ${
                errorMsg
                  ? "border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                  : "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
              }`}
            >
              <p
                className={`text-sm ${
                  errorMsg
                    ? "text-red-800 dark:text-red-200"
                    : "text-green-800 dark:text-green-200"
                }`}
              >
                {errorMsg ||
                  message ||
                  (saving ? "Saving..." : null)}
              </p>
            </div>
          </div>
        )}

        {locked && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-200">
              This evaluation is locked. Further edits are disabled.
            </p>
          </div>
        )}

        <div className="py-6">
          <div className="grid h-[calc(100vh-180px)] grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-2xl font-bold text-black dark:text-zinc-50">
                {displayTitle}
              </h2>

              <div className="space-y-6">
                {sections.length === 0 ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    No application answers available.
                  </p>
                ) : (
                  sections.map(({ section, items }) => (
                    <div key={section}>
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        {section}
                      </h3>
                      <div className="space-y-2 text-sm">
                        {items.map((field) => (
                          <div key={field.id}>
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">
                              {field.label}:{" "}
                            </span>
                            <span className="text-black dark:text-zinc-50">
                              <FieldValue
                                field={field}
                                value={application.answers[field.field_key]}
                              />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-2xl font-bold text-black dark:text-zinc-50">
                Evaluation Sheet
              </h2>

              <ScoringForm
                variant="sheet"
                criteria={application.criteria_schema}
                scores={activeScores}
                readOnly={locked}
                onChange={locked ? undefined : handleScoresChange}
                onBlurSave={locked ? undefined : (s) => void handleBlurSave(s)}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
