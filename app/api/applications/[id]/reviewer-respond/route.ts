import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/applications/[id]/reviewer-respond
 * Reviewer accepts or rejects the assignment. Requires Authorization: Bearer <supabase_access_token>.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;

    if (!applicationId || !uuidRegex.test(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json(
        { error: "Authorization required (Bearer token)" },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const accept = body.accept === true;

    const { error: updateError } = await supabaseServer
      .from("application_reviewers")
      .update({
        invite_status: accept ? "accepted" : "rejected",
        responded_at: new Date().toISOString(),
      })
      .eq("application_id", applicationId)
      .eq("reviewer_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update response", details: updateError.message },
        { status: 500 }
      );
    }

    // When reviewer accepts: if at least 2 reviewers have accepted, move application to under_review
    if (accept) {
      const { data: acceptedRows } = await supabaseServer
        .from("application_reviewers")
        .select("id")
        .eq("application_id", applicationId)
        .eq("invite_status", "accepted");

      if (acceptedRows && acceptedRows.length >= 2) {
        await supabaseServer
          .from("new_application")
          .update({ status: "under_review" })
          .eq("id", applicationId);
      }
    }

    return NextResponse.json({
      message: accept
        ? "You have accepted the assignment"
        : "You have declined the assignment",
      accepted: accept,
    });
  } catch (error: any) {
    console.error("reviewer-respond error:", error);
    return NextResponse.json(
      { error: "Failed to update response" },
      { status: 500 }
    );
  }
}
