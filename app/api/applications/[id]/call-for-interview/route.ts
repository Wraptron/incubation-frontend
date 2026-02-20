import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";
import nodemailer from "nodemailer";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function sendInterviewEmail(
  email: string,
  founderName: string,
  startupName: string,
  date: string,
  time: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      console.warn(
        "GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping interview email"
      );
      return { success: false, error: "Email not configured" };
    }
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const formattedDate = new Date(date + "T" + time).toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { padding: 20px; background-color: #fff; }
          .highlight { font-weight: bold; color: #166534; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <p>Dear ${founderName},</p>
            
            <p>Congratulations! Your application for Nirmaan Pre-Incubation has been evaluated and we would like to invite you for an interview.</p>
            
            <p><strong>Interview date and time:</strong> <span class="highlight">${formattedDate}</span></p>
            
            <p>Please ensure you are available at the scheduled time. We will send further details if needed.</p>
            
            <p>Regards,<br>
            Team Nirmaan</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Dear ${founderName},

Congratulations! Your application for Nirmaan Pre-Incubation has been evaluated and we would like to invite you for an interview.

Interview date and time: ${formattedDate}

Please ensure you are available at the scheduled time. We will send further details if needed.

Regards,
Team Nirmaan
    `;

    await transporter.sendMail({
      from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
      to: email,
      subject: `Interview scheduled – ${startupName || "Pre-Incubation Application"}`,
      text: emailText,
      html: emailHTML,
    });

    console.log("Interview email sent to", email);
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error sending interview email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * POST /api/applications/[id]/call-for-interview
 * Manager schedules an interview: updates status and sends email to founder.
 * Body: { date: "YYYY-MM-DD", time: "HH:mm" }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "https://dfzfmtthyvwltwwmntmd.supabase.co";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmemZtdHRoeXZ3bHR3d21udG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQwNDk0NiwiZXhwIjoyMDgzOTgwOTQ2fQ.m8DKbf04d5Awu99sYyTIpv15xvnkoXV3WTOlk4GP8HE";

    if (!token) {
      console.error("call-for-interview: Missing authorization token");
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication token. Please log in again." },
        { status: 401 }
      );
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    if (userError) {
      console.error("call-for-interview: Token validation error:", userError.message);
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token. Please log in again." },
        { status: 401 }
      );
    }

    if (!user?.id) {
      console.error("call-for-interview: No user found for token");
      return NextResponse.json(
        { error: "Unauthorized: User not found. Please log in again." },
        { status: 401 }
      );
    }

    const { data: profile } = await supabaseServer
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "manager") {
      return NextResponse.json(
        { error: "Only managers can call for interview" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const date = typeof body?.date === "string" ? body.date.trim() : "";
    const time = typeof body?.time === "string" ? body.time.trim() : "";

    if (!date || !time) {
      return NextResponse.json(
        { error: "Date and time are required" },
        { status: 400 }
      );
    }

    const { data: application, error: appError } = await supabaseServer
      .from("new_application")
      .select("id, email, your_name, team_name, status")
      .eq("id", id)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const isReschedule = application.status === "interview_scheduled";
    if (application.status !== "evaluated" && !isReschedule) {
      return NextResponse.json(
        { error: "Application must be in evaluated or interview_scheduled status to schedule or reschedule interview" },
        { status: 400 }
      );
    }

    const founderEmail = application.email;
    if (!founderEmail) {
      return NextResponse.json(
        { error: "Application has no founder email" },
        { status: 400 }
      );
    }

    // Store interview datetime as ISO string (e.g. "2025-02-20T14:30:00") for "is time past" checks.
    const interviewScheduledAt = `${date}T${time}:00`;

    const { error: updateError } = await supabaseServer
      .from("new_application")
      .update({
        status: "interview_scheduled",
        interview_scheduled_at: interviewScheduledAt,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update application status:", updateError);
      return NextResponse.json(
        { error: "Failed to update application" },
        { status: 500 }
      );
    }

    const founderName =
      application.your_name || "Founder";
    const startupName =
      application.team_name || "Your startup";

    const emailResult = await sendInterviewEmail(
      founderEmail,
      founderName,
      startupName,
      date,
      time
    );

    if (!emailResult.success) {
      return NextResponse.json(
        {
          message: "Interview scheduled, but email could not be sent.",
          error: emailResult.error,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      message: "Interview scheduled and email sent to the founder.",
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("call-for-interview error:", err);
    return NextResponse.json(
      { error: "Failed to schedule interview" },
      { status: 500 }
    );
  }
}
