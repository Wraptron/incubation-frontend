import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { backendUrl } from "@/lib/config";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://dfzfmtthyvwltwwmntmd.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;
    const applicationId = resolvedParams.applicationId;

    console.log("=== Frontend API Route - GET All Evaluations ===");
    console.log("Application ID from params:", applicationId);

    // Validate applicationId
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      !applicationId ||
      applicationId === "undefined" ||
      !uuidRegex.test(applicationId)
    ) {
      console.error("Invalid applicationId in GET all route:", applicationId);
      return NextResponse.json(
        { error: "Invalid application ID", received: applicationId },
        { status: 400 }
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

    // Check if user is a manager
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden - Manager access required" },
        { status: 403 }
      );
    }

    // Call backend API
    let response: Response;
    try {
      response = await fetch(
        `${backendUrl}/api/evaluations/application/${applicationId}/all`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
    } catch (fetchError: unknown) {
      const msg =
        fetchError instanceof Error ? fetchError.message : "Network error";
      console.error("Backend unreachable when fetching evaluations:", fetchError);
      return NextResponse.json(
        {
          error: "Failed to fetch evaluations",
          details:
            msg.includes("fetch") || msg.includes("ECONNREFUSED")
              ? "Backend may be down. Check NEXT_PUBLIC_API_URL and that the backend is running."
              : msg,
        },
        { status: 502 }
      );
    }

    const text = await response.text();
    let data: { error?: string; details?: string; evaluations?: unknown[] } = {};
    try {
      if (text) data = JSON.parse(text);
    } catch (parseError) {
      console.error("Backend response was not JSON:", text?.slice(0, 200));
      return NextResponse.json(
        {
          error: "Failed to fetch evaluations",
          details: response.status >= 500 ? "Server returned invalid response." : undefined,
        },
        { status: response.status >= 400 ? response.status : 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error || "Failed to fetch evaluations",
          details: data.details,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching evaluations:", error);
    const msg = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json(
      {
        error: "Failed to fetch evaluations",
        details: msg,
      },
      { status: 500 }
    );
  }
}
