import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/applications/[id]/invite-reviewer
 * Proxies to backend to invite one reviewer (sends email and creates assignment with pending).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const reviewerId = body.reviewerId;

    if (!reviewerId || !uuidRegex.test(reviewerId)) {
      return NextResponse.json(
        { error: "Valid reviewerId is required" },
        { status: 400 }
      );
    }

    const url = `${backendUrl}/api/applications/${id}/invite-reviewer`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerId }),
      });
    } catch (fetchError: any) {
      console.error("invite-reviewer proxy: backend fetch failed", fetchError);
      return NextResponse.json(
        {
          error: "Could not reach the backend server.",
          details:
            fetchError?.code === "ECONNREFUSED"
              ? "Backend may not be running. Start it with npm run dev (e.g. on port 5001)."
              : fetchError?.message || "Unknown network error",
        },
        { status: 503 }
      );
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data.error || "Failed to invite reviewer",
          details: data.details,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("invite-reviewer proxy error:", error);
    return NextResponse.json(
      {
        error: "Failed to invite reviewer",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
