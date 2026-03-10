"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Evaluation {
  id: string;
  reviewer_id: string;
  need_score: number | null;
  novelty_score: number | null;
  feasibility_scalability_score: number | null;
  market_potential_score: number | null;
  impact_score: number | null;
  need_comment: string | null;
  novelty_comment: string | null;
  feasibility_scalability_comment: string | null;
  market_potential_comment: string | null;
  impact_comment: string | null;
  overall_comment: string | null;
  total_score: number | null;
  created_at: string;
  reviewer?: { id: string; full_name: string | null };
}

export default function EvaluationResultPage() {
  const router = useRouter();
  const params = useParams();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [applicationName, setApplicationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = params?.id;
      if (!id || typeof id !== "string") {
        setError("Invalid application ID");
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${session.access_token}` };

        // Get user role
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", session.user?.id)
          .single();
        const role = profile?.role ?? "reviewer";

        // Fetch application name (reviewers can access apps they're assigned to)
        const appRes = await fetch(`/api/applications/${id}`, { headers });
        if (appRes.ok) {
          const appData = await appRes.json();
          setApplicationName(
            appData.application?.company_name ||
            appData.application?.team_name ||
            "Application"
          );
        }

        // Fetch evaluations: reviewers get only their own; managers get all
        const isReviewer = role === "reviewer";
        const evalUrl = isReviewer
          ? `/api/evaluations/application/${id}`
          : `/api/evaluations/application/${id}/all`;

        const evalRes = await fetch(evalUrl, { headers });

        if (!evalRes.ok) {
          const data = await evalRes.json().catch(() => ({}));
          setError(data.error || "Failed to load evaluation");
          setEvaluations([]);
          setIsLoading(false);
          return;
        }

        const data = await evalRes.json();
        let list: Evaluation[] = isReviewer
          ? data.evaluation ? [data.evaluation as Evaluation] : []
          : (data.evaluations || []) as Evaluation[];

        // Calculate total_score if missing
        list = list.map((e) => {
          if (
            (e.total_score === null || e.total_score === undefined) &&
            [e.need_score, e.novelty_score, e.feasibility_scalability_score, e.market_potential_score, e.impact_score].every(
              (s) => s != null
            )
          ) {
            e.total_score =
              (e.need_score ?? 0) +
              (e.novelty_score ?? 0) +
              (e.feasibility_scalability_score ?? 0) +
              (e.market_potential_score ?? 0) +
              (e.impact_score ?? 0);
          }
          return e;
        });

        setEvaluations(list);
      } catch (err) {
        console.error("Error fetching evaluation result:", err);
        setError("Failed to load evaluation results");
        setEvaluations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params?.id, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-zinc-600 dark:text-zinc-400">Loading evaluation results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="link" asChild className="mb-4">
          <Link href="/dashboard/evaluations">← Back to Evaluations</Link>
        </Button>

        <h1 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
          Evaluation Results
        </h1>
        {applicationName && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            {applicationName}
          </p>
        )}

        {error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/evaluations">Back to Evaluations</Link>
              </Button>
            </CardContent>
          </Card>
        ) : evaluations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-zinc-600 dark:text-zinc-400">
                No evaluations have been submitted yet.
              </p>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/dashboard/evaluations">Back to Evaluations</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {evaluations.map((evaluation) => (
              <Card key={evaluation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>
                      Evaluation
                      {evaluation.reviewer && (
                        <span className="text-sm font-normal text-zinc-600 dark:text-zinc-400 ml-2">
                          by {evaluation.reviewer.full_name || "Unknown"}
                        </span>
                      )}
                    </CardTitle>
                    {evaluation.total_score !== null && (
                      <Badge variant="secondary" className="text-lg">
                        Total: {evaluation.total_score}/50
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Submitted:{" "}
                    {new Date(evaluation.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {evaluation.need_score !== null && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            1. Need
                          </label>
                          <Badge variant="secondary">
                            {evaluation.need_score}/10
                          </Badge>
                        </div>
                        {evaluation.need_comment && (
                          <p className="text-sm text-black dark:text-zinc-50 mt-1">
                            {evaluation.need_comment}
                          </p>
                        )}
                      </div>
                    )}

                    {evaluation.novelty_score !== null && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            2. Novelty
                          </label>
                          <Badge variant="secondary">
                            {evaluation.novelty_score}/10
                          </Badge>
                        </div>
                        {evaluation.novelty_comment && (
                          <p className="text-sm text-black dark:text-zinc-50 mt-1">
                            {evaluation.novelty_comment}
                          </p>
                        )}
                      </div>
                    )}

                    {evaluation.feasibility_scalability_score !== null && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            3. Feasibility & Scalability
                          </label>
                          <Badge variant="secondary">
                            {evaluation.feasibility_scalability_score}/10
                          </Badge>
                        </div>
                        {evaluation.feasibility_scalability_comment && (
                          <p className="text-sm text-black dark:text-zinc-50 mt-1">
                            {evaluation.feasibility_scalability_comment}
                          </p>
                        )}
                      </div>
                    )}

                    {evaluation.market_potential_score !== null && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            4. Market Potential
                          </label>
                          <Badge variant="secondary">
                            {evaluation.market_potential_score}/10
                          </Badge>
                        </div>
                        {evaluation.market_potential_comment && (
                          <p className="text-sm text-black dark:text-zinc-50 mt-1">
                            {evaluation.market_potential_comment}
                          </p>
                        )}
                      </div>
                    )}

                    {evaluation.impact_score !== null && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            5. Impact
                          </label>
                          <Badge variant="secondary">
                            {evaluation.impact_score}/10
                          </Badge>
                        </div>
                        {evaluation.impact_comment && (
                          <p className="text-sm text-black dark:text-zinc-50 mt-1">
                            {evaluation.impact_comment}
                          </p>
                        )}
                      </div>
                    )}

                    {evaluation.overall_comment && (
                      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">
                          Overall Comment
                        </label>
                        <p className="text-sm text-black dark:text-zinc-50">
                          {evaluation.overall_comment}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
