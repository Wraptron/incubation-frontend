import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
  const {
    data: { user },
    error,
  } = await supabaseAuth.auth.getUser(token);
  if (error || !user?.id) return null;

  const { data: profile } = await supabaseServer
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "manager") return null;
  return { user, profile };
}

/**
 * GET - Fetch manager evaluation for an application.
 * Manager must be in application_reviewers for this app. Stored in application_evaluations (reviewer_id = manager).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;
    if (!applicationId || !uuidRegex.test(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: assignment } = await supabaseServer
      .from("application_reviewers")
      .select("application_id")
      .eq("application_id", applicationId)
      .eq("reviewer_id", auth.user.id)
      .single();

    if (!assignment) {
      return NextResponse.json(
        { error: "You are not assigned to evaluate this application" },
        { status: 403 }
      );
    }

    const { data: evaluation, error } = await supabaseServer
      .from("application_evaluations")
      .select("*")
      .eq("application_id", applicationId)
      .eq("reviewer_id", auth.user.id)
      .maybeSingle();

    if (error) {
      console.error("Manager evaluation fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch evaluation", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ evaluation: evaluation ?? null });
  } catch (error: any) {
    console.error("Error in evaluation GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluation" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Create or update manager evaluation.
 * Stored in application_evaluations (same as reviewers, reviewer_id = manager id).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;
    if (!applicationId || !uuidRegex.test(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: assignment } = await supabaseServer
      .from("application_reviewers")
      .select("application_id")
      .eq("application_id", applicationId)
      .eq("reviewer_id", auth.user.id)
      .single();

    if (!assignment) {
      return NextResponse.json(
        { error: "You are not assigned to evaluate this application" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseScore = (v: unknown): number | null => {
      if (v == null || v === "") return null;
      const n = typeof v === "number" ? v : parseFloat(String(v));
      return isNaN(n) ? null : Math.max(0, Math.min(10, n));
    };

    const payload = {
      application_id: applicationId,
      reviewer_id: auth.user.id,
      need_score: parseScore(body.needScore),
      novelty_score: parseScore(body.noveltyScore),
      feasibility_scalability_score: parseScore(body.feasibilityScalabilityScore),
      market_potential_score: parseScore(body.marketPotentialScore),
      impact_score: parseScore(body.impactScore),
      need_comment: body.needComment ?? null,
      novelty_comment: body.noveltyComment ?? null,
      feasibility_scalability_comment:
        body.feasibilityScalabilityComment ?? null,
      market_potential_comment: body.marketPotentialComment ?? null,
      impact_comment: body.impactComment ?? null,
      overall_comment: body.overallComment ?? null,
    };

    const { data: existing } = await supabaseServer
      .from("application_evaluations")
      .select("id")
      .eq("application_id", applicationId)
      .eq("reviewer_id", auth.user.id)
      .maybeSingle();

    let result;
    if (existing) {
      const { data: updated, error: updateError } = await supabaseServer
        .from("application_evaluations")
        .update({
          need_score: payload.need_score,
          novelty_score: payload.novelty_score,
          feasibility_scalability_score: payload.feasibility_scalability_score,
          market_potential_score: payload.market_potential_score,
          impact_score: payload.impact_score,
          need_comment: payload.need_comment,
          novelty_comment: payload.novelty_comment,
          feasibility_scalability_comment:
            payload.feasibility_scalability_comment,
          market_potential_comment: payload.market_potential_comment,
          impact_comment: payload.impact_comment,
          overall_comment: payload.overall_comment,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        console.error("Manager evaluation update error:", updateError);
        return NextResponse.json(
          {
            error: "Failed to update evaluation",
            details: updateError.message,
          },
          { status: 500 }
        );
      }
      result = updated;
    } else {
      const { data: inserted, error: insertError } = await supabaseServer
        .from("application_evaluations")
        .insert({
          application_id: payload.application_id,
          reviewer_id: payload.reviewer_id,
          need_score: payload.need_score,
          novelty_score: payload.novelty_score,
          feasibility_scalability_score: payload.feasibility_scalability_score,
          market_potential_score: payload.market_potential_score,
          impact_score: payload.impact_score,
          need_comment: payload.need_comment,
          novelty_comment: payload.novelty_comment,
          feasibility_scalability_comment:
            payload.feasibility_scalability_comment,
          market_potential_comment: payload.market_potential_comment,
          impact_comment: payload.impact_comment,
          overall_comment: payload.overall_comment,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Manager evaluation insert error:", insertError);
        return NextResponse.json(
          {
            error: "Failed to save evaluation",
            details: insertError.message,
          },
          { status: 500 }
        );
      }
      result = inserted;
    }

    // If all assigned reviewers have submitted, set status to "evaluated"
    // Count ALL assigned (regardless of invite_status) - only move when every assigned reviewer has evaluated
    const { data: assignedReviewers } = await supabaseServer
      .from("application_reviewers")
      .select("reviewer_id")
      .eq("application_id", applicationId);
    const assignedCount = assignedReviewers?.length ?? 0;
    const { data: evalsForApp } = await supabaseServer
      .from("application_evaluations")
      .select("reviewer_id")
      .eq("application_id", applicationId);
    const uniqueEvalIds = new Set((evalsForApp ?? []).map((e: { reviewer_id: string }) => e.reviewer_id));
    if (assignedCount > 0 && uniqueEvalIds.size >= assignedCount) {
      await supabaseServer
        .from("new_application")
        .update({ status: "evaluated" })
        .eq("id", applicationId);
    }

    return NextResponse.json({ evaluation: result });
  } catch (error: any) {
    console.error("Error in evaluation PUT:", error);
    return NextResponse.json(
      { error: "Failed to save evaluation" },
      { status: 500 }
    );
  }
}
