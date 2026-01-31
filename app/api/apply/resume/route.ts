import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")?.trim();
    if (!token) {
      return NextResponse.json(
        { error: "Missing token", details: "Resume link token is required." },
        { status: 400 }
      );
    }
    const res = await fetch(
      `${backendUrl}/api/applications/resume?token=${encodeURIComponent(token)}`,
      { method: "GET" }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Resume fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load draft" },
      { status: 500 }
    );
  }
}
