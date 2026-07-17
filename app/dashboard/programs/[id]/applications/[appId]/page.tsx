"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, Loader2, UserPlus } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormRenderer } from "@/components/program-renderer/FormRenderer";
import { useProgramApplication } from "@/lib/program-forms/hooks";
import * as api from "@/lib/program-forms/api";
import type { AssignableUser } from "@/lib/program-forms/types";
import { formatAnswer, formatDateTime } from "@/lib/program-forms/utils";
import { formatStatus } from "@/lib/utils";

export default function ProgramApplicationDetailPage() {
  const params = useParams();
  const formId = String(params.id);
  const appId = String(params.appId);
  const { application, loading, error, setApplication } =
    useProgramApplication(appId);

  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [userFilter, setUserFilter] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  useEffect(() => {
    void api.getAssignableUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const filteredUsers = useMemo(() => {
    const q = userFilter.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.full_name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q)
    );
  }, [users, userFilter]);

  const evaluationSummary = useMemo(() => {
    if (!application) return null;
    const criteria = application.criteria_schema;
    if (!criteria.length || application.avg_score === null) {
      return { avg: application?.avg_score ?? null, perCriterion: [] as Array<{ label: string; weight: number }> };
    }
    return {
      avg: application.avg_score,
      perCriterion: criteria.map((c) => ({ label: c.label, weight: c.weight })),
    };
  }, [application]);

  const handleAssign = async (reviewerId: string) => {
    setAssigning(true);
    setAssignError(null);
    try {
      const updated = await api.assignReviewer(appId, reviewerId);
      setApplication(updated);
      setAssignOpen(false);
      setUserFilter("");
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : "Assign failed");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading application…
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-red-600">{error ?? "Application not found"}</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href={`/dashboard/programs/${formId}/applications`}>
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
          <Link href={`/dashboard/programs/${formId}/applications`}>
            <ArrowLeft className="h-4 w-4" />
            Back to applications
          </Link>
        </Button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              {application.team_name || application.applicant_name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
              <Badge variant="outline">{formatStatus(application.status)}</Badge>
              <span>Form v{application.form_version}</span>
              {application.submitted_at && (
                <span>· Submitted {formatDateTime(application.submitted_at)}</span>
              )}
            </div>
          </div>
          <Button asChild variant="outline">
            <Link
              href={`/dashboard/programs/${formId}/applications/${appId}/evaluate`}
            >
              Open scoring screen
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Answers — schema-driven */}
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-zinc-900">
                Applicant answers
              </h3>
              {application.field_schema.length === 0 ? (
                <p className="text-sm text-zinc-500">No field schema available.</p>
              ) : (
                <dl className="space-y-4">
                  {[...application.field_schema]
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((field) => (
                      <div key={field.id} className="border-b border-zinc-100 pb-3 last:border-0">
                        <dt className="text-sm font-medium text-zinc-700">
                          {field.label}
                        </dt>
                        <dd className="mt-1 text-sm text-zinc-900">
                          {formatAnswer(
                            field,
                            application.answers[field.field_key]
                          )}
                        </dd>
                      </div>
                    ))}
                </dl>
              )}
            </div>

            {application.files.length > 0 && (
              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-zinc-900">
                  Files
                </h3>
                <ul className="space-y-2">
                  {application.files.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between rounded-md border border-zinc-100 px-3 py-2 text-sm"
                    >
                      <span>
                        <span className="text-zinc-400">{file.field_key}: </span>
                        {file.filename}
                      </span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Form preview
              </h3>
              <FormRenderer
                fields={application.field_schema}
                answers={application.answers}
                readOnly
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900">Reviewers</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAssignOpen((o) => !o)}
                >
                  <UserPlus className="h-4 w-4" />
                  Assign
                </Button>
              </div>
              {application.reviewers.length === 0 ? (
                <p className="text-sm text-zinc-500">No reviewers assigned.</p>
              ) : (
                <ul className="space-y-2">
                  {application.reviewers.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-md bg-zinc-50 px-3 py-2 text-sm"
                    >
                      <div className="font-medium">
                        {r.full_name || "Reviewer"}
                      </div>
                      {r.email && (
                        <div className="text-xs text-zinc-500">{r.email}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {assignOpen && (
                <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
                  <Label htmlFor="user-filter">Search users</Label>
                  <Input
                    id="user-filter"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    placeholder="Type a name or email…"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto rounded-md border border-zinc-200">
                    {filteredUsers.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-zinc-500">
                        No matching users
                      </p>
                    ) : (
                      filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          disabled={
                            assigning ||
                            application.reviewers.some((r) => r.id === u.id)
                          }
                          className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-zinc-50 disabled:opacity-40"
                          onClick={() => void handleAssign(u.id)}
                        >
                          <span className="font-medium">
                            {u.full_name || "User"}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {u.email} · {u.role}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                  {assignError && (
                    <p className="text-xs text-red-600">{assignError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h3 className="mb-3 font-semibold text-zinc-900">
                Evaluation summary
              </h3>
              <p className="text-2xl font-bold text-zinc-900">
                {evaluationSummary?.avg !== null &&
                evaluationSummary?.avg !== undefined
                  ? evaluationSummary.avg
                  : "—"}
              </p>
              <p className="text-xs text-zinc-500">Weighted average</p>
              {evaluationSummary && evaluationSummary.perCriterion.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-zinc-100 pt-3">
                  {evaluationSummary.perCriterion.map((c) => (
                    <li
                      key={c.label}
                      className="flex justify-between text-xs text-zinc-600"
                    >
                      <span>{c.label}</span>
                      <span className="text-zinc-400">w{c.weight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
