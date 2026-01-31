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
      message: "Reviewer removed. You can invite a new reviewer.",
    });
  } catch (error: any) {
    console.error("DELETE reviewer error:", error);
    return NextResponse.json(
      { error: "Failed to remove reviewer" },
      { status: 500 }
    );
  }
}
