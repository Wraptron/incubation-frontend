import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/applications/[id]/reviewer-respond
 * Proxies to backend. Reviewer accepts or rejects the assignment.
 * Backend notifies managers by email. Requires Authorization: Bearer <supabase_access_token>.
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
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization required (Bearer token)" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const accept = body.accept === true;
    const rejectReason = body.rejectReason || null;

    const url = `${backendUrl}/api/applications/${applicationId}/reviewer-respond`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ accept, rejectReason }),
      });
    } catch (fetchError: unknown) {
      console.error("reviewer-respond proxy: backend fetch failed", fetchError);
      return NextResponse.json(
        {
          error: "Could not reach the backend server.",
          details:
            fetchError instanceof Error && (fetchError as { code?: string }).code === "ECONNREFUSED"
              ? "Backend may not be running."
              : fetchError instanceof Error
                ? (fetchError as Error).message
                : "Unknown network error",
        },
        { status: 503 }
      );
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data.error ?? "Failed to update response",
          details: data.details,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("reviewer-respond error:", error);
    return NextResponse.json(
      {
        error: "Failed to update response",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
