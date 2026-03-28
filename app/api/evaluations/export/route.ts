import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

type EvaluationRecord = {
  application_id: string;
  reviewer_id: string;
  total_score: number | null;
  need_score: number | null;
  need_comment: string | null;
  novelty_score: number | null;
  novelty_comment: string | null;
  feasibility_scalability_score: number | null;
  feasibility_scalability_comment: string | null;
  market_potential_score: number | null;
  market_potential_comment: string | null;
  impact_score: number | null;
  impact_comment: string | null;
  overall_comment: string | null;
  created_at: string;
};

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "";
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabaseServer
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "manager" && profile.role !== "reviewer")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let evaluationsQuery = supabaseServer
      .from("application_evaluations")
      .select(
        "application_id, reviewer_id, total_score, need_score, need_comment, novelty_score, novelty_comment, feasibility_scalability_score, feasibility_scalability_comment, market_potential_score, market_potential_comment, impact_score, impact_comment, overall_comment, created_at"
      )
      .order("created_at", { ascending: false });

    if (profile.role === "reviewer") {
      evaluationsQuery = evaluationsQuery.eq("reviewer_id", user.id);
    }

    const { data: evaluations, error: evalError } = await evaluationsQuery;

    if (evalError) {
      return NextResponse.json(
        { error: "Failed to fetch evaluations", details: evalError.message },
        { status: 500 }
      );
    }

    const evalRows = (evaluations ?? []) as EvaluationRecord[];
    if (evalRows.length === 0) {
      return NextResponse.json({ rows: [] });
    }

    const applicationIds = [...new Set(evalRows.map((row) => row.application_id))];
    const reviewerIds = [...new Set(evalRows.map((row) => row.reviewer_id))];

    const [{ data: apps, error: appsError }, { data: reviewers, error: reviewersError }] =
      await Promise.all([
        supabaseServer
          .from("new_application")
          .select("id, team_name, your_name")
          .in("id", applicationIds),
        supabaseServer
          .from("user_profiles")
          .select("id, full_name")
          .in("id", reviewerIds),
      ]);

    if (appsError) {
      return NextResponse.json(
        { error: "Failed to fetch applications", details: appsError.message },
        { status: 500 }
      );
    }

    if (reviewersError) {
      return NextResponse.json(
        { error: "Failed to fetch reviewers", details: reviewersError.message },
        { status: 500 }
      );
    }

    const appNameById = new Map<string, string>();
    for (const app of apps ?? []) {
      appNameById.set(
        app.id,
        app.team_name || app.your_name || "Application"
      );
    }

    const reviewerNameById = new Map<string, string>();
    for (const reviewer of reviewers ?? []) {
      reviewerNameById.set(reviewer.id, reviewer.full_name || "Reviewer");
    }

    const rows = evalRows.map((evaluation) => ({
      applicationName: appNameById.get(evaluation.application_id) || "Application",
      reviewerName: reviewerNameById.get(evaluation.reviewer_id) || "Reviewer",
      totalMark: evaluation.total_score,
      needMark: evaluation.need_score,
      needComment: evaluation.need_comment,
      noveltyMark: evaluation.novelty_score,
      noveltyComment: evaluation.novelty_comment,
      feasibilityScalabilityMark: evaluation.feasibility_scalability_score,
      feasibilityScalabilityComment: evaluation.feasibility_scalability_comment,
      marketPotentialMark: evaluation.market_potential_score,
      marketPotentialComment: evaluation.market_potential_comment,
      impactMark: evaluation.impact_score,
      impactComment: evaluation.impact_comment,
      overallComment: evaluation.overall_comment,
      evaluationDate: evaluation.created_at,
    }));

    rows.sort((a, b) =>
      a.applicationName.localeCompare(b.applicationName, undefined, {
        sensitivity: "base",
      })
    );

    return NextResponse.json({ rows });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to export evaluations", details: err.message },
      { status: 500 }
    );
  }
}
