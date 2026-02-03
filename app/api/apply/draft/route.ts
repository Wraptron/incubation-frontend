import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";
import nodemailer from "nodemailer";

async function sendResumeLinkEmail(
  email: string,
  applicantName: string,
  resumeToken: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping resume link email");
      return { success: false, error: "Email not configured" };
    }
    const resumeLink = `${baseUrl.replace(/\/$/, "")}/apply/resume?token=${encodeURIComponent(resumeToken)}`;
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
     
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;}.container{max-width:600px;margin:0 auto;padding:20px;}.content{padding:20px;}.btn{display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;}</style></head>
      <body>
        <div class="container">
          <div class="content">
            <p>Dear ${applicantName || "Applicant"},</p>
            <p>You have saved a draft of your application. Use the link below to resume and continue where you left off. This link is valid for 30 days.</p>
            <p><a href="${resumeLink}" class="btn">Resume application</a></p>
            <p>Or copy this link: ${resumeLink}</p>
            <p>Regards,<br>Team Nirmaan</p>
          </div>
        </div>
      </body>
      </html>`;
    const emailText = `Dear ${applicantName || "Applicant"},\n\nYou have saved a draft of your application. Use the link below to resume:\n${resumeLink}\n\nThis link is valid for 30 days.\n\nRegards,\nTeam Nirmaan`;
    await transporter.sendMail({
      from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
      to: email,
      subject: "Resume your application – Nirmaan Pre-Incubation",
      text: emailText,
      html: emailHTML,
    });
    console.log("Resume link email sent to", email);
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error sending resume link email:", err);
    return { success: false, error: err.message };
  }
}

export async function POST(request: NextRequest) {
  const backendDraftUrl = `${backendUrl.replace(/\/$/, "")}/api/applications/draft`;
  if (!process.env.API_URL && !process.env.NEXT_PUBLIC_API_URL) {
    console.warn("[Frontend API] No API_URL or NEXT_PUBLIC_API_URL set; using default http://localhost:5001");
  }
  try {
    const body = await request.json().catch(() => ({}));
    let res: Response;
    try {
      res = await fetch(backendDraftUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log("[Frontend API] Backend draft response status:", res.status, res.statusText);
    } catch (fetchError) {
      console.error("[Frontend API] Draft save: backend unreachable", backendDraftUrl, fetchError);
      return NextResponse.json(
        {
          error: "Draft service unavailable",
          details: `Could not reach backend at ${backendDraftUrl}. Start the backend (run \`npm run dev\` in the backend folder) and ensure API_URL or NEXT_PUBLIC_API_URL is set in .env.development or .env.local (e.g. http://localhost:5001).`,
        },
        { status: 503 }
      );
    }

    const data = await res.json().catch(() => ({}));

    if (res.status === 404) {
      return NextResponse.json(
        {
          error: data.error || "Draft endpoint not found",
          details: data.details || "The draft service may not be available. Please try again later.",
        },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data.error || "Failed to save draft",
          details: data.details || data.message,
        },
        { status: res.status }
      );
    }

    // Resume link email is sent by the backend when a new draft is created (backend has Gmail config).
    return NextResponse.json(data);
  } catch (error) {
    console.error("Draft save error:", error);
    return NextResponse.json(
      {
        error: "Failed to save draft",
        details: error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
