import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { supabaseServer } from "@/lib/supabaseServer";

const MAX_EXPORT_ROWS = 5000;

function serializeCell(value: unknown): string | number | boolean {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "boolean" || typeof value === "number") return value;
  return String(value);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const searchQuery = (searchParams.get("search") ?? "").trim().replace(/'/g, "''");

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
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

    if (!profile || (profile.role !== "manager" && profile.role !== "reviewer")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const isReviewer = profile.role === "reviewer";
    let reviewerApplicationIds: string[] = [];
    let reviewerAssignmentsWithStatus: Array<{
      application_id: string;
      invite_status: string | null;
    }> = [];
    const isUnassignedFilter = statusParam === "unassigned";
    let assignedApplicationIds: string[] = [];

    if (isReviewer) {
      const { data: assignments } = await supabaseServer
        .from("application_reviewers")
        .select("application_id, invite_status")
        .eq("reviewer_id", user.id);
      reviewerAssignmentsWithStatus = assignments ?? [];
      reviewerApplicationIds = reviewerAssignmentsWithStatus.map((a) => a.application_id);
    }

    let query = supabaseServer
      .from("new_application")
      .select("*")
      .order("submitted_at", { ascending: false })
      .range(0, MAX_EXPORT_ROWS - 1);

    if (statusParam && statusParam !== "all" && statusParam !== "unassigned" && !isReviewer) {
      query = query.eq("status", statusParam);
    }

    if (searchQuery) {
      const pattern = `%${searchQuery}%`;
      const quoted = `"${pattern.replace(/"/g, '""')}"`;
      query = query.or(
        `team_name.ilike.${quoted},your_name.ilike.${quoted},email.ilike.${quoted}`
      );
    }

    if (!isReviewer && isUnassignedFilter) {
      const { data: assignments } = await supabaseServer
        .from("application_reviewers")
        .select("application_id");
      assignedApplicationIds = [
        ...new Set((assignments ?? []).map((a: { application_id: string }) => a.application_id)),
      ];
      if (assignedApplicationIds.length > 0) {
        const quotedIds = assignedApplicationIds.map((id) => `"${id}"`).join(",");
        query = query.not("id", "in", `(${quotedIds})`);
      }
    }

    if (isReviewer && reviewerApplicationIds.length === 0) {
      const wb = XLSX.utils.book_new();
      const emptyApps = XLSX.utils.json_to_sheet([
        { Message: "No applications assigned to export." },
      ]);
      XLSX.utils.book_append_sheet(wb, emptyApps, "Applications");
      const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      return new NextResponse(buf, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="applications-export.xlsx"`,
        },
      });
    }

    if (isReviewer && reviewerApplicationIds.length > 0) {
      query = query.in("id", reviewerApplicationIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase export fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications", details: error.message },
        { status: 500 }
      );
    }

    const applicationIds = data?.map((app: { id: string }) => app.id) ?? [];

    const assignmentByAppId: Record<string, string | null> = {};
    if (isReviewer && reviewerAssignmentsWithStatus.length) {
      reviewerAssignmentsWithStatus.forEach((a) => {
        assignmentByAppId[a.application_id] = a.invite_status ?? "pending";
      });
    }

    let reviewersMap: Record<string, Array<{ id: string; full_name: string | null }>> = {};

    if (!isReviewer && applicationIds.length) {
      const { data: reviewerAssignments, error: assignmentError } = await supabaseServer
        .from("application_reviewers")
        .select("application_id, reviewer_id")
        .in("application_id", applicationIds);

      if (!assignmentError && reviewerAssignments?.length) {
        const reviewerIds = [...new Set(reviewerAssignments.map((r) => r.reviewer_id))];

        const { data: reviewers, error: reviewerError } = await supabaseServer
          .from("user_profiles")
          .select("id, full_name")
          .in("id", reviewerIds);

        if (!reviewerError && reviewers) {
          const reviewerLookup = Object.fromEntries(reviewers.map((r) => [r.id, r]));

          reviewerAssignments.forEach((assignment) => {
            reviewersMap[assignment.application_id] ??= [];
            const reviewer = reviewerLookup[assignment.reviewer_id];
            if (reviewer) {
              reviewersMap[assignment.application_id].push(reviewer);
            }
          });
        }
      }
    }

    type AppRow = Record<string, unknown> & {
      id: string;
      status: string;
      company_name?: unknown;
      founder_name?: unknown;
      phone?: unknown;
      created_at?: unknown;
      reviewers: Array<{ id: string; full_name: string | null }>;
    };

    const enriched: AppRow[] = (data || []).map((app: Record<string, unknown>) => {
      let status = app.status as string;
      const id = app.id as string;
      if (isReviewer) {
        const inviteStatus = assignmentByAppId[id] ?? "pending";
        if (inviteStatus === "rejected") {
          status = "rejected";
        } else if (inviteStatus === "pending") {
          status = "pending";
        } else {
          status = app.status === "evaluated" ? "evaluated" : "under_review";
        }
      }
      return {
        ...app,
        id,
        status,
        company_name: app.team_name || app.company_name,
        founder_name: app.your_name || app.founder_name,
        phone: app.phone_number || app.phone,
        created_at: app.submitted_at || app.created_at,
        reviewers: reviewersMap[id] || [],
      };
    });

    let resultApplications = enriched;
    if (isReviewer && statusParam && statusParam !== "all") {
      resultApplications = enriched.filter((app) => app.status === statusParam);
    }

    const applicationsSheetRows = resultApplications.map((app) => {
      const row: Record<string, string | number | boolean> = {};
      const keys = Object.keys(app).sort((a, b) => {
        const pri = ["id", "team_name", "your_name", "email", "status", "submitted_at"];
        const ia = pri.indexOf(a);
        const ib = pri.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
      });
      for (const k of keys) {
        const v = app[k];
        if (k === "reviewers" && Array.isArray(v)) {
          row["reviewers"] = (v as { full_name?: string | null }[])
            .map((x) => x.full_name || "")
            .filter(Boolean)
            .join("; ");
        } else {
          row[k] = serializeCell(v) as string | number | boolean;
        }
      }
      return row;
    });

    const wb = XLSX.utils.book_new();

    const noteRow =
      resultApplications.length >= MAX_EXPORT_ROWS
        ? [
            {
              _export_note: `Export limited to the first ${MAX_EXPORT_ROWS} applications by submission date. Narrow filters to export the rest.`,
            },
          ]
        : [];

    const appsSheetData =
      noteRow.length > 0 ? [...noteRow, ...applicationsSheetRows] : applicationsSheetRows;

    const wsApps = XLSX.utils.json_to_sheet(
      appsSheetData.length ? appsSheetData : [{ Message: "No applications match the current filters." }]
    );
    XLSX.utils.book_append_sheet(wb, wsApps, "Applications");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const date = new Date().toISOString().slice(0, 10);
    const filename = `pre-incubation-applications-${date}.xlsx`;

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("applications export error:", err);
    return NextResponse.json(
      { error: "Failed to export applications", details: err.message },
      { status: 500 }
    );
  }
}
