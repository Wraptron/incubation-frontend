"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgramApplication, useProgramEvaluation } from "@/lib/program-forms/hooks";
import * as api from "@/lib/program-forms/api";
import type { AssignableUser } from "@/lib/program-forms/types";
import {
  formatAnswer,
  groupBySection,
  isAnswerFileUrl,
} from "@/lib/program-forms/utils";
import { formatStatus } from "@/lib/utils";

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
    under_review:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800",
    evaluated:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800",
    rejected:
      "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800",
  };
  return (
    colors[status] ||
    "bg-gray-100 text-gray-800 border-gray-200 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
  );
}

function FieldValue({
  field,
  value,
}: {
  field: { field_type: string; label: string };
  value: unknown;
}) {
  if (isAnswerFileUrl(field as Parameters<typeof isAnswerFileUrl>[0], value)) {
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

  const formatted = formatAnswer(
    field as Parameters<typeof formatAnswer>[0],
    value
  );
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

export default function ProgramApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const formId = String(params.id);
  const appId = String(params.appId);
  const { application, loading, error, setApplication } =
    useProgramApplication(appId);
  const {
    evaluation,
    loading: evalLoading,
    error: evalError,
    refresh: refreshEvaluation,
  } = useProgramEvaluation(appId);

  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAssignReviewer, setShowAssignReviewer] = useState(false);
  const [userFilter, setUserFilter] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"application-form" | "evaluations">(
    "application-form"
  );

  const loadAssignableUsers = async () => {
    setUsersLoading(true);
    setAssignError(null);
    try {
      const data = await api.getAssignableUsers();
      setUsers(data);
    } catch (err) {
      setUsers([]);
      setAssignError(
        err instanceof Error ? err.message : "Failed to load reviewers"
      );
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (showAssignReviewer) {
      void loadAssignableUsers();
    }
  }, [showAssignReviewer]);

  const filteredUsers = useMemo(() => {
    const q = userFilter.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.full_name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q)
    );
  }, [users, userFilter]);

  const sections = useMemo(() => {
    if (!application) return [];
    return groupBySection(application.field_schema);
  }, [application]);

  const submittedEvaluations = useMemo(() => {
    if (
      !evaluation ||
      evaluation.status !== "completed" ||
      evaluation.scores.length === 0
    ) {
      return [];
    }
    return [evaluation];
  }, [evaluation]);

  const handleAssign = async (reviewerId: string) => {
    setAssigning(true);
    setAssignError(null);
    try {
      const updated = await api.assignReviewer(appId, reviewerId);
      setApplication(updated);
      setShowAssignReviewer(false);
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

  const displayTitle =
    application.team_name || application.applicant_name || "Application";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="link"
          onClick={() =>
            router.push(`/dashboard/programs/${formId}/applications`)
          }
          className="mb-4"
        >
          ← Back to Applications
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="mb-2 text-2xl">{displayTitle}</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Status:
                  </span>
                  <Badge className={getStatusColor(application.status)}>
                    {formatStatus(application.status || "pending")}
                  </Badge>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Assigned Reviewer
                    {application.reviewers.length !== 1 ? "s" : ""}:{" "}
                  </span>
                  {application.reviewers.length === 0 ? (
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      No reviewers assigned
                    </span>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {application.reviewers.map((r) => (
                        <Badge key={r.id} variant="secondary" className="text-xs">
                          {r.full_name || "Reviewer"}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showAssignReviewer ? "outline" : "default"}
                  onClick={() => setShowAssignReviewer((open) => !open)}
                >
                  {showAssignReviewer
                    ? "Close"
                    : application.reviewers.length > 0
                      ? "Manage Reviewers"
                      : "Assign Reviewers"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {showAssignReviewer && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Manage Reviewers</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Search and assign a reviewer to this application.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="user-filter">Search users</Label>
                <Input
                  id="user-filter"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  placeholder="Type a name or email…"
                  className="mt-1"
                  autoFocus
                />
              </div>
              <div className="max-h-96 overflow-y-auto rounded-md border border-zinc-200 dark:border-zinc-700">
                {usersLoading ? (
                  <p className="px-4 py-3 text-center text-sm text-zinc-500">
                    Loading reviewers…
                  </p>
                ) : filteredUsers.length === 0 ? (
                  <p className="px-4 py-3 text-center text-sm text-zinc-500">
                    {users.length === 0
                      ? "No reviewers found"
                      : "No matching users"}
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
                      className="flex w-full flex-col items-start px-4 py-2 text-left text-sm hover:bg-zinc-50 disabled:opacity-40 dark:hover:bg-zinc-800"
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
                <p className="text-sm text-red-600">{assignError}</p>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "application-form" | "evaluations")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="application-form">
                  Application Form
                </TabsTrigger>
                <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
              </TabsList>

              <TabsContent value="application-form" className="mt-6 space-y-6">
                {application.field_schema.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-zinc-600 dark:text-zinc-400">
                        No field schema available.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  sections.map(({ section, items }) => (
                    <Card key={section}>
                      <CardHeader>
                        <CardTitle>{section}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {items.map((field) => (
                            <div key={field.id}>
                              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                {field.label}
                              </label>
                              <p className="text-black dark:text-zinc-50">
                                <FieldValue
                                  field={field}
                                  value={application.answers[field.field_key]}
                                />
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="evaluations" className="mt-6 space-y-6">
                {evalLoading ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Loading evaluations...
                      </p>
                    </CardContent>
                  </Card>
                ) : evalError ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="mb-4 text-red-600 dark:text-red-400">
                        {evalError}
                      </p>
                      <Button
                        onClick={() => void refreshEvaluation()}
                        variant="default"
                      >
                        Retry
                      </Button>
                    </CardContent>
                  </Card>
                ) : submittedEvaluations.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-zinc-600 dark:text-zinc-400">
                        No evaluations have been submitted yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  submittedEvaluations.map((evaln) => {
                    const reviewer = application.reviewers.find(
                      (r) => r.id === evaln.reviewer_id
                    );
                    const totalScore = evaln.scores.reduce((sum, s) => {
                      const num =
                        typeof s.value === "number" ? s.value : Number(s.value);
                      return sum + (Number.isFinite(num) ? num : 0);
                    }, 0);
                    const maxScore = application.criteria_schema.length * 10;

                    return (
                      <Card key={evaln.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle>
                              Evaluation
                              {reviewer && (
                                <span className="ml-2 text-sm font-normal text-zinc-600 dark:text-zinc-400">
                                  by {reviewer.full_name || "Unknown"}
                                </span>
                              )}
                            </CardTitle>
                            <Badge variant="secondary" className="text-lg">
                              Total: {totalScore.toFixed(1)}/{maxScore}
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Submitted:{" "}
                            {new Date(evaln.updated_at).toLocaleDateString()}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {application.criteria_schema.map((crit, idx) => {
                              const score = evaln.scores.find(
                                (s) => s.criteria_id === crit.id
                              );
                              const value = score?.value;
                              if (
                                value === null ||
                                value === undefined ||
                                value === ""
                              ) {
                                return null;
                              }

                              return (
                                <div key={crit.id}>
                                  <div className="mb-1 flex items-center justify-between">
                                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                      {idx + 1}. {crit.label}
                                    </label>
                                    <Badge variant="secondary">
                                      {value}/10
                                    </Badge>
                                  </div>
                                  {score?.comment && (
                                    <p className="mt-1 text-sm text-black dark:text-zinc-50">
                                      {score.comment}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
