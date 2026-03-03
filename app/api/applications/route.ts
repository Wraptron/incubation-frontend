import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

/* =========================
   GET: List applications
   If Authorization Bearer token is present and user is a reviewer,
   returns only applications assigned to that reviewer (no other reviewers listed).
========================= */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const searchQuery = (searchParams.get("search") ?? "").trim().replace(/'/g, "''");
    const limit = Number(searchParams.get("limit") ?? 50);
    const offset = Number(searchParams.get("offset") ?? 0);

    let isReviewer = false;
    let reviewerApplicationIds: string[] = [];
    let reviewerUserId: string | null = null;
    let reviewerAssignmentsWithStatus: Array<{ application_id: string; invite_status: string | null }> = [];

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
            isReviewer = true;
            reviewerUserId = user.id;
            const { data: assignments } = await supabaseServer
              .from("application_reviewers")
              .select("application_id, invite_status")
              .eq("reviewer_id", user.id);
            reviewerAssignmentsWithStatus = assignments ?? [];
            reviewerApplicationIds = reviewerAssignmentsWithStatus.map((a: any) => a.application_id);
          }
        }
      }
    }

    // For reviewers we fetch all assigned apps then filter by reviewer_status in memory
    const reviewerFetchLimit = isReviewer ? 500 : limit;
    const reviewerFetchOffset = isReviewer ? 0 : offset;

    let query = supabaseServer
      .from("new_application")
      .select("*")
      .order("submitted_at", { ascending: false })
      .range(reviewerFetchOffset, reviewerFetchOffset + reviewerFetchLimit - 1);

    if (statusParam && statusParam !== "all" && !isReviewer) {
      query = query.eq("status", statusParam);
    }

    if (searchQuery) {
      const pattern = `%${searchQuery}%`;
      const quoted = `"${pattern.replace(/"/g, '""')}"`;
      query = query.or(
        `team_name.ilike.${quoted},your_name.ilike.${quoted},email.ilike.${quoted}`
      );
    }

    if (isReviewer && reviewerApplicationIds.length === 0) {
      return NextResponse.json({
        applications: [],
        pagination: { total: 0, limit, offset },
      });
    }

    if (isReviewer && reviewerApplicationIds.length > 0) {
      query = query.in("id", reviewerApplicationIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications", details: error.message },
        { status: 500 },
      );
    }

    const applicationIds = data?.map((app: any) => app.id) ?? [];

    // Reviewer: which applications has this reviewer evaluated?
    let evaluatedApplicationIds: Set<string> = new Set();
    if (isReviewer && reviewerUserId && applicationIds.length) {
      const { data: evals } = await supabaseServer
        .from("application_evaluations")
        .select("application_id")
        .eq("reviewer_id", reviewerUserId)
        .in("application_id", applicationIds);
      if (evals?.length) {
        evals.forEach((e: any) => evaluatedApplicationIds.add(e.application_id));
      }
    }

    const assignmentByAppId: Record<string, string | null> = {};
    if (isReviewer && reviewerAssignmentsWithStatus.length) {
      reviewerAssignmentsWithStatus.forEach((a: any) => {
        assignmentByAppId[a.application_id] = a.invite_status ?? "pending";
      });
    }

    let reviewersMap: Record<string, Array<{ id: string; full_name: string | null }>> =
      {};

    if (!isReviewer && applicationIds.length) {
      const { data: reviewerAssignments, error: assignmentError } =
        await supabaseServer
          .from("application_reviewers")
          .select("application_id, reviewer_id")
          .in("application_id", applicationIds);

      if (!assignmentError && reviewerAssignments?.length) {
        const reviewerIds = [
          ...new Set(reviewerAssignments.map((r: any) => r.reviewer_id)),
        ];

        const { data: reviewers, error: reviewerError } = await supabaseServer
          .from("user_profiles")
          .select("id, full_name")
          .in("id", reviewerIds);

        if (!reviewerError && reviewers) {
          const reviewerLookup = Object.fromEntries(
            reviewers.map((r) => [r.id, r]),
          );

          reviewerAssignments.forEach((assignment: any) => {
            reviewersMap[assignment.application_id] ??= [];
            const reviewer = reviewerLookup[assignment.reviewer_id];
            if (reviewer) {
              reviewersMap[assignment.application_id].push(reviewer);
            }
          });
        }
      }
    }

    let count = 0;
    if (!isReviewer) {
      let countQuery = supabaseServer
        .from("new_application")
        .select("*", { count: "exact", head: true });
      if (statusParam && statusParam !== "all") {
        countQuery = countQuery.eq("status", statusParam);
      }
      if (searchQuery) {
        const pattern = `%${searchQuery}%`;
        const quoted = `"${pattern.replace(/"/g, '""')}"`;
        countQuery = countQuery.or(
          `team_name.ilike.${quoted},your_name.ilike.${quoted},email.ilike.${quoted}`
        );
      }
      const { count: c } = await countQuery;
      count = c ?? 0;
    }

    const enriched = (data || []).map((app: any) => {
      let status = app.status;
      if (isReviewer) {
        const inviteStatus = assignmentByAppId[app.id] ?? "pending";
        if (inviteStatus === "rejected") {
          status = "rejected";
        } else if (inviteStatus === "pending") {
          status = "pending";
        } else {
          // Only show "evaluated" when DB status is evaluated (all assigned reviewers have submitted)
          status = app.status === "evaluated" ? "evaluated" : "under_review";
        }
      }
      return {
        ...app,
        status,
        company_name: app.team_name || app.company_name,
        founder_name: app.your_name || app.founder_name,
        phone: app.phone_number || app.phone,
        created_at: app.submitted_at || app.created_at,
        reviewers: reviewersMap[app.id] || [],
      };
    });

    let resultApplications = enriched;
    if (isReviewer && statusParam && statusParam !== "all") {
      resultApplications = enriched.filter((app: any) => app.status === statusParam);
      count = resultApplications.length;
      resultApplications = resultApplications.slice(offset, offset + limit);
    } else if (isReviewer) {
      count = resultApplications.length;
      resultApplications = resultApplications.slice(offset, offset + limit);
    }

    return NextResponse.json({
      applications: resultApplications,
      pagination: {
        total: count,
        limit,
        offset,
      },
    });
  } catch (error: any) {
    console.error("Error in applications GET route:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
