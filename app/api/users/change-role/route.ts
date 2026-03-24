import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://dfzfmtthyvwltwwmntmd.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE";

const ALLOWED_ROLES = ["manager", "reviewer"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user: caller },
      error: callerError,
    } = await supabase.auth.getUser();

    if (callerError || !caller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: callerProfile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (!callerProfile || callerProfile.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden - Only managers can change roles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const userId = typeof body?.userId === "string" ? body.userId : "";
    const newRole = typeof body?.newRole === "string" ? body.newRole : "";

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "Missing required fields: userId and newRole are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(newRole as AllowedRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'manager' or 'reviewer'" },
        { status: 400 }
      );
    }

    if (caller.id === userId) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      );
    }

    const { data: targetProfile, error: targetFetchError } = await supabaseServer
      .from("user_profiles")
      .select("id, role")
      .eq("id", userId)
      .single();

    if (targetFetchError || !targetProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!ALLOWED_ROLES.includes(targetProfile.role as AllowedRole)) {
      return NextResponse.json(
        { error: "Target user role is not supported for switching" },
        { status: 400 }
      );
    }

    const { error: profileUpdateError } = await supabaseServer
      .from("user_profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (profileUpdateError) {
      return NextResponse.json(
        { error: "Failed to update user profile role", details: profileUpdateError.message },
        { status: 500 }
      );
    }

    const { error: authUpdateError } =
      await supabaseServer.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole },
      });

    if (authUpdateError) {
      return NextResponse.json(
        { error: "Failed to update auth metadata role", details: authUpdateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User role updated successfully",
      data: { userId, role: newRole },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("PATCH /api/users/change-role error:", err);
    return NextResponse.json(
      { error: "Failed to change role", details: err.message },
      { status: 500 }
    );
  }
}
