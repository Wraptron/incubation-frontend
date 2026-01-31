import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const buildApplicationResponse = async (
  id: string,
  /** When set (reviewer viewing), only this reviewer is included in reviewers array */
  viewerReviewerId?: string
) => {
  const { data: application, error } = await supabaseServer
    .from("new_application")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !application) {
    return { application: null, error };
  }

  // Reviewer assignments (with invite status for manager/reviewer flow)
  const { data: reviewerAssignments } = await supabaseServer
    .from("application_reviewers")
    .select("application_id, reviewer_id, invite_status, invited_at, responded_at")
    .eq("application_id", id);

  let reviewers: Array<{
    id: string;
    full_name: string | null;
    email_address?: string | null;
    invite_status?: string;
    invited_at?: string | null;
    responded_at?: string | null;
  }> = [];
  if (reviewerAssignments?.length) {
    let assignments = reviewerAssignments;
    if (viewerReviewerId) {
      assignments = reviewerAssignments.filter(
        (a: any) => a.reviewer_id === viewerReviewerId
      );
    }
    const reviewerIds = [
      ...new Set(assignments.map((r: any) => r.reviewer_id)),
    ];
    if (reviewerIds.length) {
      const { data: reviewerProfiles } = await supabaseServer
        .from("user_profiles")
        .select("id, full_name, email_address")
        .in("id", reviewerIds);

      if (reviewerProfiles) {
        const lookup = Object.fromEntries(
          reviewerProfiles.map((r) => [r.id, r]),
        );
        reviewers = assignments
          .map((assignment: any) => {
            const profile = lookup[assignment.reviewer_id];
            if (!profile) return null;
            return {
              id: profile.id,
              full_name: profile.full_name,
              email_address: profile.email_address ?? null,
              invite_status: assignment.invite_status ?? "pending",
              invited_at: assignment.invited_at ?? null,
              responded_at: assignment.responded_at ?? null,
            };
          })
          .filter((r): r is NonNullable<typeof r> => r != null);
      }
    }
  }

  // Evaluation stats
  const { data: evaluations } = await supabaseServer
    .from("application_evaluations")
    .select("id, reviewer_id")
    .eq("application_id", id);

  const totalReviewers = viewerReviewerId
    ? (reviewerAssignments?.length ?? 0)
    : reviewers.length;
  const evaluationsCount = evaluations?.length ?? 0;
  const allEvaluationsComplete =
    totalReviewers > 0 && evaluationsCount >= totalReviewers;

  // Map new_application fields to old field names for frontend compatibility
  return {
    application: {
      ...application,
      // Basic mappings
      company_name: application.team_name || application.company_name,
      founder_name: application.your_name || application.founder_name,
      phone: application.phone_number || application.phone,
      created_at: application.submitted_at || application.created_at,
      
      // Content mappings
      problem: application.problem_solving || application.problem,
      solution: application.your_solution || application.solution,
      description: application.your_solution || application.problem_solving || application.description,
      
      // Business mappings
      target_market: application.target_industry || application.target_market,
      business_model: application.solution_type || application.business_model,
      current_traction: application.proof_of_concept_details || application.current_traction,
      why_incubator: application.nirmaan_can_help || application.pre_incubation_reason || application.why_incubator,
      funding_amount: application.external_funding || application.funding_amount,
      
      // Additional fields with fallbacks
      website: application.website || null,
      co_founders: application.faculty_involved || application.co_founders || null,
      funding_stage: application.funding_stage || null,
      
      reviewers,
      totalReviewers,
      evaluationsCount,
      allEvaluationsComplete,
    },
  };
};

/* =========================
   GET: Single application
   If Authorization Bearer is present and user is a reviewer, reviewers array
   contains only that reviewer (so they cannot see other reviewers).
========================= */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || !uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    let viewerReviewerId: string | undefined;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (token) {
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        "";
      const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        "";
      if (supabaseUrl && supabaseAnonKey) {
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
          error: userError,
        } = await supabaseAuth.auth.getUser(token);
        if (!userError && user?.id) {
          const { data: profile } = await supabaseServer
            .from("user_profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (profile?.role === "reviewer") {
            viewerReviewerId = user.id;
          }
        }
      }
    }

    if (viewerReviewerId) {
      const { data: assignment } = await supabaseServer
        .from("application_reviewers")
        .select("id")
        .eq("application_id", id)
        .eq("reviewer_id", viewerReviewerId)
        .maybeSingle();
      if (!assignment) {
        return NextResponse.json(
          { error: "Application not found or you are not assigned to this application" },
          { status: 404 },
        );
      }
    }

    const { application, error } = await buildApplicationResponse(
      id,
      viewerReviewerId
    );

    if (error || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ application });
  } catch (error: any) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

/* =========================
   PUT: Update application
========================= */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || !uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Assign reviewers
    if (Array.isArray(body.reviewerIds)) {
      const reviewerIds = (body.reviewerIds as Array<string>).filter(
        (rid) => rid && uuidRegex.test(rid),
      );

      if (reviewerIds.length === 0) {
        return NextResponse.json(
          { error: "Please provide at least one reviewerId" },
          { status: 400 },
        );
      }

      // Replace assignments
      await supabaseServer
        .from("application_reviewers")
        .delete()
        .eq("application_id", id);

      const { error: insertError } = await supabaseServer
        .from("application_reviewers")
        .insert(
          reviewerIds.map((reviewerId) => ({
            application_id: id,
            reviewer_id: reviewerId,
          })),
        );

      if (insertError) {
        return NextResponse.json(
          { error: "Failed to assign reviewers", details: insertError.message },
          { status: 500 },
        );
      }

      // Move to under_review when reviewers get assigned
      await supabaseServer
        .from("new_application")
        .update({ status: "under_review" })
        .eq("id", id);
    }

    // Update status (including rejection reason)
    if (body.status) {
      const updateData: Record<string, any> = {
        status: body.status,
      };

      if (body.status === "rejected") {
        updateData.rejection_reason = body.rejectionReason || null;
      } else if ("rejectionReason" in body) {
        updateData.rejection_reason = null;
      }

      const { error: updateError } = await supabaseServer
        .from("new_application")
        .update(updateData)
        .eq("id", id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update status", details: updateError.message },
          { status: 500 },
        );
      }
    }

    const { application } = await buildApplicationResponse(id);

    return NextResponse.json({
      message: "Application updated successfully",
      application,
    });
  } catch (error: any) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}
