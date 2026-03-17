import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * GET: List all reviewers and managers with their assigned applications.
 * Manager-only endpoint. Returns each assignee (reviewer or manager) with
 * their assigned applications.
 */
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
      return NextResponse.json(
        { error: "Auth not configured" },
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
        { error: "Forbidden - Only managers can view reviewers assignments" },
        { status: 403 }
      );
    }

    const { data: assignments, error: assignError } = await supabaseServer
      .from("application_reviewers")
      .select("application_id, reviewer_id");

    if (assignError) {
      console.error("Error fetching assignments:", assignError);
      return NextResponse.json(
        { error: "Failed to fetch assignments", details: assignError.message },
        { status: 500 }
      );
    }

    if (!assignments?.length) {
      return NextResponse.json({
        assignees: [],
      });
    }

    const reviewerIds = [...new Set(assignments.map((a: any) => a.reviewer_id))];
    const applicationIds = [...new Set(assignments.map((a: any) => a.application_id))];

    const { data: profiles, error: profilesError } = await supabaseServer
      .from("user_profiles")
      .select("id, full_name, email_address, role")
      .in("id", reviewerIds);

    if (profilesError || !profiles?.length) {
      return NextResponse.json({
        assignees: [],
      });
    }

    const { data: applications, error: appsError } = await supabaseServer
      .from("new_application")
      .select("id, team_name, status, submitted_at")
      .in("id", applicationIds);

    if (appsError) {
      console.error("Error fetching applications:", appsError);
      return NextResponse.json(
        { error: "Failed to fetch applications", details: appsError.message },
        { status: 500 }
      );
    }

    const appLookup = Object.fromEntries(
      (applications || []).map((a: any) => [a.id, a])
    );
    const profileLookup = Object.fromEntries(profiles.map((p) => [p.id, p]));

    const assigneeMap: Record<
      string,
      {
        id: string;
        full_name: string | null;
        email_address: string | null;
        role: string;
        applications: Array<{
          id: string;
          team_name: string | null;
          status: string;
          submitted_at: string | null;
        }>;
      }
    > = {};

    for (const a of assignments as Array<{ application_id: string; reviewer_id: string }>) {
      const profile = profileLookup[a.reviewer_id];
      const app = appLookup[a.application_id];
      if (!profile || !app) continue;

      if (!assigneeMap[a.reviewer_id]) {
        assigneeMap[a.reviewer_id] = {
          id: profile.id,
          full_name: profile.full_name ?? null,
          email_address: profile.email_address ?? null,
          role: profile.role ?? "reviewer",
          applications: [],
        };
      }
      assigneeMap[a.reviewer_id].applications.push({
        id: app.id,
        team_name: app.team_name ?? null,
        status: app.status ?? "pending",
        submitted_at: app.submitted_at ?? null,
      });
    }

    const assignees = Object.values(assigneeMap).map((a) => ({
      ...a,
      applications: a.applications.sort(
        (x, y) =>
          new Date(y.submitted_at || 0).getTime() -
          new Date(x.submitted_at || 0).getTime()
      ),
    }));

    assignees.sort((a, b) => {
      const roleOrder = { manager: 0, reviewer: 1 };
      const ra = roleOrder[a.role as keyof typeof roleOrder] ?? 2;
      const rb = roleOrder[b.role as keyof typeof roleOrder] ?? 2;
      if (ra !== rb) return ra - rb;
      return (a.full_name ?? "").localeCompare(b.full_name ?? "");
    });

    return NextResponse.json({ assignees });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in reviewers-assignments GET:", err?.message ?? err, err?.stack);
    return NextResponse.json(
      {
        error: "Failed to fetch reviewers assignments",
        details: process.env.NODE_ENV === "development" ? err?.message : undefined,
      },
      { status: 500 }
    );
  }
}
