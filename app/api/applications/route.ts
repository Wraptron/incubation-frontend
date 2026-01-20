import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

/* =========================
   GET: List applications
========================= */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const limit = Number(searchParams.get("limit") ?? 50);
    const offset = Number(searchParams.get("offset") ?? 0);

    let query = supabaseServer
      .from("startup_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (statusParam && statusParam !== "all") {
      query = query.eq("status", statusParam);
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
    let reviewersMap: Record<string, Array<{ id: string; full_name: string | null }>> =
      {};

    if (applicationIds.length) {
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

    let countQuery = supabaseServer
      .from("startup_applications")
      .select("*", { count: "exact", head: true });

    if (statusParam && statusParam !== "all") {
      countQuery = countQuery.eq("status", statusParam);
    }

    const { count } = await countQuery;

    const enriched = (data || []).map((app: any) => ({
      ...app,
      reviewers: reviewersMap[app.id] || [],
    }));

    return NextResponse.json({
      applications: enriched,
      pagination: {
        total: count || 0,
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
