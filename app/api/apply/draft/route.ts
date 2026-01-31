import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

export async function POST(request: NextRequest) {
  const backendDraftUrl = `${backendUrl.replace(/\/$/, "")}/api/applications/draft`;
  if (!process.env.API_URL && !process.env.NEXT_PUBLIC_API_URL) {
    console.warn("[Frontend API] No API_URL or NEXT_PUBLIC_API_URL set; using default http://localhost:5001");
  }
  try {
    const body = await request.json().catch(() => ({}));
    let res: Response;
    try {
      res = await fetch(backendDraftUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log("[Frontend API] Backend draft response status:", res.status, res.statusText);
    } catch (fetchError) {
      console.error("[Frontend API] Draft save: backend unreachable", backendDraftUrl, fetchError);
      return NextResponse.json(
        {
          error: "Draft service unavailable",
          details: `Could not reach backend at ${backendDraftUrl}. Start the backend (run \`npm run dev\` in the backend folder) and ensure API_URL or NEXT_PUBLIC_API_URL is set in .env.development or .env.local (e.g. http://localhost:5001).`,
        },
        { status: 503 }
      );
    }

    const data = await res.json().catch(() => ({}));

    if (res.status === 404) {
      return NextResponse.json(
        {
          error: data.error || "Draft endpoint not found",
          details: data.details || "The draft service may not be available. Please try again later.",
        },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data.error || "Failed to save draft",
          details: data.details || data.message,
        },
        { status: res.status }
      );
    }

    // Resume link email is sent by the backend when a new draft is created (backend has Gmail config).
    return NextResponse.json(data);
  } catch (error) {
    console.error("Draft save error:", error);
    return NextResponse.json(
      {
        error: "Failed to save draft",
        details: error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
