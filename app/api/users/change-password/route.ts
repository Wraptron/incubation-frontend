import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

/* =========================
   PUT: Change user password
========================= */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${backendUrl}/api/users/change-password`;

    console.log('Calling backend URL:', url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log('Response status:', response.status);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response received:', text.substring(0, 200));
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
    console.error("Error in change-password PUT route:", error);
    return NextResponse.json(
      { error: "Failed to change password", details: error.message },
      { status: 500 }
    );
  }
}
