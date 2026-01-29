import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

/* =========================
   DELETE: Delete a user
========================= */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${backendUrl}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Backend returned non-JSON response", details: text.substring(0, 200) },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in users DELETE route:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  }
}
