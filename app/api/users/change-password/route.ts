import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

/* =========================
   PUT: Change user password (Supabase direct)
========================= */

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, oldPassword, newPassword } = body;

    if (!userId || !email || !oldPassword || !newPassword) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId, email, oldPassword, and newPassword are required",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Verify current password by attempting to sign in
    const { data: signInData, error: signInError } =
      await supabaseServer.auth.signInWithPassword({
        email,
        password: oldPassword,
      });

    if (signInError || !signInData.user) {
      console.error("Current password verification failed:", signInError);
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    if (signInData.user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to change this password" },
        { status: 403 }
      );
    }

    // Update password using admin API
    const { error: updateError } = await supabaseServer.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update password", details: updateError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Password updated successfully for user: ${userId}`);

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in change-password PUT route:", err);
    return NextResponse.json(
      { error: "Failed to change password", details: err.message },
      { status: 500 }
    );
  }
}
