import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

const MANAGER_STATUSES = [
  "draft",
  "pending",
  "under_review",
  "evaluated",
  "interview_scheduled",
  "interview_completed",
  "approved",
  "rejected",
] as const;

const REVIEWER_STATUSES = ["pending", "under_review", "evaluated", "rejected"] as const;

/* =========================
   GET: Application counts by status
   Returns { all, draft?, pending, ... } for tabs.
   Respects reviewer vs manager (reviewer sees only assigned apps).
========================= */
export async function GET(request: NextRequest) {
  try {
    let isReviewer = false;
    let reviewerApplicationIds: string[] = [];
    let reviewerUserId: string | null = null;
    let reviewerAssignmentsWithStatus: Array<{
      application_id: string;
      invite_status: string | null;
    }> = [];

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (token) {
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
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
            isReviewer = true;
            reviewerUserId = user.id;
            const { data: assignments } = await supabaseServer
              .from("application_reviewers")
              .select("application_id, invite_status")
              .eq("reviewer_id", user.id);
            reviewerAssignmentsWithStatus = assignments ?? [];
            reviewerApplicationIds = reviewerAssignmentsWithStatus.map(
              (a: { application_id: string }) => a.application_id
            );
          }
        }
      }
    }

    const counts: Record<string, number> = { all: 0 };

    if (isReviewer) {
      if (reviewerApplicationIds.length === 0) {
        REVIEWER_STATUSES.forEach((s) => (counts[s] = 0));
        return NextResponse.json({ counts });
      }

      const { data: apps } = await supabaseServer
        .from("new_application")
        .select("id")
        .in("id", reviewerApplicationIds);

      const applicationIds = apps?.map((a: { id: string }) => a.id) ?? [];

      let evaluatedApplicationIds: Set<string> = new Set();
      if (reviewerUserId && applicationIds.length) {
        const { data: evals } = await supabaseServer
          .from("application_evaluations")
          .select("application_id")
          .eq("reviewer_id", reviewerUserId)
          .in("application_id", applicationIds);
        if (evals?.length) {
          evals.forEach((e: { application_id: string }) =>
            evaluatedApplicationIds.add(e.application_id)
          );
        }
      }

      const assignmentByAppId: Record<string, string | null> = {};
      reviewerAssignmentsWithStatus.forEach((a) => {
        assignmentByAppId[a.application_id] = a.invite_status ?? "pending";
      });

      REVIEWER_STATUSES.forEach((s) => (counts[s] = 0));
      applicationIds.forEach((id: string) => {
        const inviteStatus = assignmentByAppId[id] ?? "pending";
        let status: string;
        if (inviteStatus === "rejected") status = "rejected";
        else if (inviteStatus === "pending") status = "pending";
        else
          status = evaluatedApplicationIds.has(id) ? "evaluated" : "under_review";
        if (status in counts) counts[status]++;
      });
      counts.all = applicationIds.length;
    } else {
      const statusList = [...MANAGER_STATUSES];
      await Promise.all(
        statusList.map(async (status) => {
          const { count } = await supabaseServer
            .from("new_application")
            .select("*", { count: "exact", head: true })
            .eq("status", status);
          counts[status] = count ?? 0;
        })
      );
      counts.all = MANAGER_STATUSES.reduce((sum, s) => sum + (counts[s] ?? 0), 0);
    }

    return NextResponse.json({ counts });
  } catch (error: unknown) {
    console.error("Error in applications counts route:", error);
    return NextResponse.json(
      { error: "Failed to fetch application counts" },
      { status: 500 }
    );
  }
}
