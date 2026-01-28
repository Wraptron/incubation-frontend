import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

/* =========================
   POST: Create a new user
========================= */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${backendUrl}/api/users`;
    
    console.log('Calling backend URL:', url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log('Response status:', response.status);
    console.log('Response content-type:', response.headers.get('content-type'));

    // Check if response is JSON
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

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error in users POST route:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   GET: List all users
========================= */
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${backendUrl}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in users GET route:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}
