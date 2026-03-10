import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * GET: List applications that the current reviewer has submitted an evaluation for.
 * Reviewer-only endpoint.
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

    if (!profile || profile.role !== "reviewer") {
      return NextResponse.json(
        { error: "Forbidden - Reviewer access required" },
        { status: 403 }
      );
    }

    // Get application IDs where this reviewer has submitted an evaluation
    const { data: evals, error: evalsError } = await supabaseServer
      .from("application_evaluations")
      .select("application_id")
      .eq("reviewer_id", user.id);

    if (evalsError || !evals?.length) {
      return NextResponse.json({
        applications: [],
        pagination: { total: 0, limit: 200, offset: 0 },
      });
    }

    const applicationIds = [...new Set(evals.map((e: { application_id: string }) => e.application_id))];

    const { data: applications, error: appsError } = await supabaseServer
      .from("new_application")
      .select("id, team_name, your_name, email, status, submitted_at")
      .in("id", applicationIds)
      .order("submitted_at", { ascending: false });

    if (appsError) {
      console.error("Error fetching applications:", appsError);
      return NextResponse.json(
        { error: "Failed to fetch applications", details: appsError.message },
        { status: 500 }
      );
    }

    const enriched = (applications || []).map((app: any) => ({
      ...app,
      company_name: app.team_name,
      founder_name: app.your_name,
      created_at: app.submitted_at,
    }));

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      200,
      Math.max(1, parseInt(searchParams.get("limit") ?? "25", 10) || 25)
    );
    const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10) || 0);

    const total = enriched.length;
    const paginatedApplications = enriched.slice(offset, offset + limit);

    return NextResponse.json({
      applications: paginatedApplications,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in reviewer evaluations applications GET:", err);
    return NextResponse.json(
      { error: "Failed to fetch reviewer evaluations" },
      { status: 500 }
    );
  }
}
