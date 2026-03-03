import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * GET /api/evaluation/applications
 * Returns applications assigned to the current manager for evaluation (Evaluate tab).
 * Uses application_reviewers: manager is in application_reviewers as reviewer_id.
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

    const { data: assignments, error: assignError } = await supabaseServer
      .from("application_reviewers")
      .select("application_id")
      .eq("reviewer_id", user.id);

    if (assignError) {
      console.error("Evaluation assignments fetch error:", assignError);
      return NextResponse.json(
        {
          error: "Failed to fetch assigned applications",
          details: assignError.message,
        },
        { status: 500 }
      );
    }

    const applicationIds = (assignments ?? []).map(
      (a: { application_id: string }) => a.application_id
    );
    if (applicationIds.length === 0) {
      return NextResponse.json({
        applications: [],
        pagination: { total: 0, limit: 25, offset: 0 },
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      200,
      Math.max(1, parseInt(searchParams.get("limit") ?? "25", 10) || 25)
    );
    const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10) || 0);

    const { data: apps, error: appsError } = await supabaseServer
      .from("new_application")
      .select("*")
      .in("id", applicationIds)
      .order("submitted_at", { ascending: false });

    if (appsError) {
      console.error("Applications fetch error:", appsError);
      return NextResponse.json(
        { error: "Failed to fetch applications", details: appsError.message },
        { status: 500 }
      );
    }

    const allApplications = (apps ?? []).map((app: any) => ({
      ...app,
      company_name: app.team_name || app.company_name,
      founder_name: app.your_name || app.founder_name,
      created_at: app.submitted_at || app.created_at,
    }));

    const total = allApplications.length;
    const applications = allApplications.slice(offset, offset + limit);

    return NextResponse.json({
      applications,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error: any) {
    console.error("Error in evaluation applications GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluation applications" },
      { status: 500 }
    );
  }
}
