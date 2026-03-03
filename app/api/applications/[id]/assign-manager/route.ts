import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { supabaseServer } from "@/lib/supabaseServer";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Send email to manager when they are assigned to evaluate an application. */
async function sendManagerAssignEmail(
  toEmail: string,
  managerName: string,
  startupName: string,
  applicationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      return { success: false, error: "Email not configured" };
    }
    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://traktor.sieiitm.org";
    const applicationLink = `${appUrl}/dashboard/applications/${applicationId}`;

    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #fff; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; margin: 10px 5px 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Manager Assignment – Nirmaan Pre-Incubation</h2>
          </div>
          <div class="content">
            <p>Dear ${managerName},</p>
            <p>You have been assigned as the evaluation manager for the following startup application:</p>
            <p><strong>Startup: ${startupName}</strong></p>
            <p>Please log in to review and manage the evaluation for this application.</p>
            <p>
              <a href="${applicationLink}" class="button">View Application</a>
            </p>
            <p>Thanks,<br>Team Nirmaan</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `Dear ${managerName},\n\nYou have been assigned as the evaluation manager for the startup: ${startupName}.\n\nView the application: ${applicationLink}\n\nThanks,\nTeam Nirmaan`;

    await transporter.sendMail({
      from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
      to: toEmail,
      subject: `You have been assigned to evaluate: ${startupName}`,
      text: emailText,
      html: emailHTML,
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error sending manager assign email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * POST - Add a manager to this application for evaluation (Evaluate tab).
 * Body: { managerId: string }
 * Only managers can assign. Adds the manager; does not replace existing managers. Multiple managers allowed.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    if (!applicationId || !uuidRegex.test(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "";
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase config" },
        { status: 500 }
      );
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);
    if (userError || !user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabaseServer
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

    const body = await request.json();
    const managerId = body?.managerId;
    if (!managerId || !uuidRegex.test(managerId)) {
      return NextResponse.json(
        { error: "Valid managerId is required" },
        { status: 400 }
      );
    }

    const { data: targetProfile } = await supabaseServer
      .from("user_profiles")
      .select("id, role, full_name, email_address")
      .eq("id", managerId)
      .single();

    if (!targetProfile || targetProfile.role !== "manager") {
      return NextResponse.json(
        { error: "Selected user is not a manager" },
        { status: 400 }
      );
    }

    const { data: application } = await supabaseServer
      .from("new_application")
      .select("team_name")
      .eq("id", applicationId)
      .single();

    // Check if this manager is already assigned to this application
    const { data: existing } = await supabaseServer
      .from("application_reviewers")
      .select("id")
      .eq("application_id", applicationId)
      .eq("reviewer_id", managerId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { message: "Manager already assigned", assignment: existing },
        { status: 200 }
      );
    }

    const now = new Date().toISOString();
    const { data: inserted, error: insertError } = await supabaseServer
      .from("application_reviewers")
      .insert({
        application_id: applicationId,
        reviewer_id: managerId,
        invite_status: "accepted",
        invited_at: now,
        responded_at: now,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Assign manager error:", insertError);
      return NextResponse.json(
        {
          error: "Failed to assign manager",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    let emailSent = false;
    const managerEmail = targetProfile.email_address?.trim();
    if (managerEmail) {
      const emailResult = await sendManagerAssignEmail(
        managerEmail,
        targetProfile.full_name || "Manager",
        application?.team_name || "Startup",
        applicationId
      );
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.warn("Manager assign email not sent:", emailResult.error);
      }
    } else {
      console.warn("Manager has no email_address; assign email skipped.");
    }

    // Move to under_review when: (1) at least 2 assignees (reviewers + managers), (2) ALL assignees accepted
    const { data: allAssignments } = await supabaseServer
      .from("application_reviewers")
      .select("reviewer_id, invite_status")
      .eq("application_id", applicationId);
    const totalAssignees = allAssignments?.length ?? 0;
    const allAccepted =
      totalAssignees >= 2 &&
      (allAssignments ?? []).every(
        (a: { invite_status: string | null }) => (a.invite_status ?? "pending") === "accepted"
      );
    if (allAccepted) {
      await supabaseServer
        .from("new_application")
        .update({ status: "under_review" })
        .eq("id", applicationId);
    }

    return NextResponse.json({
      message: "Manager added for evaluation",
      assignment: inserted,
      emailSent,
    });
  } catch (error: any) {
    console.error("Error in assign-manager:", error);
    return NextResponse.json(
      { error: "Failed to assign manager" },
      { status: 500 }
    );
  }
}
