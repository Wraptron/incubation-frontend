import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * DELETE /api/applications/[id]/reviewers/[reviewerId]
 * Remove a reviewer assignment (e.g. after rejection so manager can reassign).
 * Caller should be manager (optional: verify role via session).
 */
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; reviewerId: string }> }
) {
  try {
    const { id: applicationId, reviewerId } = await params;

    if (
      !applicationId ||
      !uuidRegex.test(applicationId) ||
      !reviewerId ||
      !uuidRegex.test(reviewerId)
    ) {
      return NextResponse.json(
        { error: "Invalid application ID or reviewer ID" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "";
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase config" },
        { status: 500 }
      );
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

    if (!profile || profile.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden - Manager access required" },
        { status: 403 }
      );
    }

    const { data: assignment, error: assignmentError } = await supabaseServer
      .from("application_reviewers")
      .select("id")
      .eq("application_id", applicationId)
      .eq("reviewer_id", reviewerId)
      .maybeSingle();

    if (assignmentError) {
      return NextResponse.json(
        { error: "Failed to verify assignment", details: assignmentError.message },
        { status: 500 }
      );
    }

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignee is not assigned to this application" },
        { status: 404 }
      );
    }

    const { data: existingEvaluation, error: evalCheckError } = await supabaseServer
      .from("application_evaluations")
      .select("id")
      .eq("application_id", applicationId)
      .eq("reviewer_id", reviewerId)
      .maybeSingle();

    if (evalCheckError) {
      return NextResponse.json(
        { error: "Failed to verify evaluation status", details: evalCheckError.message },
        { status: 500 }
      );
    }

    if (existingEvaluation) {
      return NextResponse.json(
        {
          error:
            "Cannot remove this assignee because they have already submitted an evaluation",
        },
        { status: 409 }
      );
    }

    const { error: deleteError } = await supabaseServer
      .from("application_reviewers")
      .delete()
      .eq("application_id", applicationId)
      .eq("reviewer_id", reviewerId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to remove reviewer", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Assignee removed. You can assign someone else.",
    });
  } catch (error: any) {
    console.error("DELETE reviewer error:", error);
    return NextResponse.json(
      { error: "Failed to remove reviewer" },
      { status: 500 }
    );
  }
}
