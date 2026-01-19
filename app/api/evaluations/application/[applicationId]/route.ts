import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://dfzfmtthyvwltwwmntmd.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;
    const applicationId = resolvedParams.applicationId;

    console.log("=== Frontend API Route - GET Evaluation ===");
    console.log("Application ID from params:", applicationId);
    console.log("Params object:", resolvedParams);

    // Validate applicationId
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      !applicationId ||
      applicationId === "undefined" ||
      !uuidRegex.test(applicationId)
    ) {
      console.error("Invalid applicationId in GET route:", applicationId);
      return NextResponse.json(
        { error: "Invalid application ID", received: applicationId },
        { status: 400 },
      );
    }

    // Get auth token from request
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Supabase client with user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a reviewer
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "reviewer") {
      return NextResponse.json(
        { error: "Forbidden - Reviewer access required" },
        { status: 403 },
      );
    }

    // Call backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://65.1.107.13:5000";
    const response = await fetch(
      `${backendUrl}/api/evaluations/application/${applicationId}`,
      {
        headers: {
          "x-reviewer-id": user.id,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch evaluation" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching evaluation:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluation" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;
    const applicationId = resolvedParams.applicationId;

    console.log("=== Frontend API Route - PUT Evaluation ===");
    console.log("Application ID from params:", applicationId);
    console.log("Params object:", resolvedParams);

    // Validate applicationId early
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      !applicationId ||
      applicationId === "undefined" ||
      !uuidRegex.test(applicationId)
    ) {
      console.error("Invalid applicationId in PUT route:", applicationId);
      return NextResponse.json(
        { error: "Invalid application ID", received: applicationId },
        { status: 400 },
      );
    }

    // Get auth token from request
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Supabase client with user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a reviewer
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "reviewer") {
      return NextResponse.json(
        { error: "Forbidden - Reviewer access required" },
        { status: 403 },
      );
    }

    const body = await request.json();

    // Ensure user.id is valid
    if (!user || !user.id) {
      console.error("User or user.id is missing:", { user });
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 401 },
      );
    }

    console.log("Reviewer ID:", user.id);
    console.log(
      "Backend URL:",
      process.env.NEXT_PUBLIC_API_URL || "http://65.1.107.13:5000",
    );

    // Call backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://65.1.107.13:5000";
    const backendEndpoint = `${backendUrl}/api/evaluations/application/${applicationId}`;
    console.log("Calling backend endpoint:", backendEndpoint);

    const response = await fetch(backendEndpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-reviewer-id": user.id,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to save evaluation" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error saving evaluation:", error);
    return NextResponse.json(
      { error: "Failed to save evaluation" },
      { status: 500 },
    );
  }
}
