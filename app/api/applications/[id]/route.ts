import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";
import nodemailer from "nodemailer";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Optional CC for founder emails (approval, rejection, evaluated Send Mail). MAIL_CC or GMAIL_CC: comma- or semicolon-separated addresses. */
function getFounderMailCc(): string | undefined {
  const raw = process.env.MAIL_CC || process.env.GMAIL_CC;
  if (!raw?.trim()) return undefined;
  const parts = raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

const buildApplicationResponse = async (
  id: string,
  /** When set (reviewer viewing), only this reviewer is included in reviewers array */
  viewerReviewerId?: string
) => {
  const { data: application, error } = await supabaseServer
    .from("new_application")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !application) {
    return { application: null, error };
  }

  // Reviewer assignments (with invite status for manager/reviewer flow)
  const { data: reviewerAssignments } = await supabaseServer
    .from("application_reviewers")
    .select("application_id, reviewer_id, invite_status, invited_at, responded_at")
    .eq("application_id", id);

  const reviewerIds = reviewerAssignments?.length
    ? [...new Set(reviewerAssignments.map((r: any) => r.reviewer_id))]
    : [];
  let assigneeProfiles: Array<{ id: string; full_name: string | null; email_address?: string | null; role?: string }> = [];
  if (reviewerIds.length > 0) {
    const { data } = await supabaseServer
      .from("user_profiles")
      .select("id, full_name, email_address, role")
      .in("id", reviewerIds);
    assigneeProfiles = data ?? [];
  }

  const profileLookup = Object.fromEntries(
    assigneeProfiles.map((r) => [r.id, r])
  );

  // Reviewers list: only users with role=reviewer (exclude managers)
  let reviewers: Array<{
    id: string;
    full_name: string | null;
    email_address?: string | null;
    invite_status?: string;
    invited_at?: string | null;
    responded_at?: string | null;
  }> = [];
  if (reviewerAssignments?.length) {
    let assignments = reviewerAssignments;
    if (viewerReviewerId) {
      assignments = reviewerAssignments.filter(
        (a: any) => a.reviewer_id === viewerReviewerId
      );
    }
    reviewers = assignments
      .map((assignment: any) => {
        const profile = profileLookup[assignment.reviewer_id];
        if (!profile || (profile as { role?: string }).role !== "reviewer") return null;
        return {
          id: profile.id,
          full_name: profile.full_name,
          email_address: profile.email_address ?? null,
          invite_status: assignment.invite_status ?? "pending",
          invited_at: assignment.invited_at ?? null,
          responded_at: assignment.responded_at ?? null,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r != null);
  }

  // Evaluation managers: from application_reviewers, all assignees with role=manager (multiple per app)
  const evaluation_managers: Array<{ id: string; full_name: string | null }> = [];
  if (reviewerAssignments?.length) {
    const managerAssignments = reviewerAssignments.filter(
      (a: any) => (profileLookup[a.reviewer_id] as { role?: string } | undefined)?.role === "manager"
    );
    for (const assignment of managerAssignments) {
      const profile = profileLookup[assignment.reviewer_id] as { id: string; full_name: string | null } | undefined;
      if (profile) {
        evaluation_managers.push({ id: profile.id, full_name: profile.full_name });
      }
    }
  }
  const evaluation_manager = evaluation_managers[0] ?? null;

  // Evaluation stats
  const { data: evaluations } = await supabaseServer
    .from("application_evaluations")
    .select("id, reviewer_id")
    .eq("application_id", id);

  // Count only accepted reviewers (exclude managers; matching backend logic)
  const acceptedReviewers =
    reviewerAssignments?.filter(
      (a: any) =>
        (profileLookup[a.reviewer_id] as { role?: string } | undefined)?.role === "reviewer" &&
        (a.invite_status ?? "pending") === "accepted"
    ) ?? [];
  const totalReviewers = viewerReviewerId
    ? (reviewerAssignments?.filter(
        (a: any) =>
          (profileLookup[a.reviewer_id] as { role?: string } | undefined)?.role === "reviewer" &&
          (a.invite_status ?? "pending") === "accepted"
      ).length ?? 0)
    : acceptedReviewers.length;
  const evaluationsCount = evaluations?.length ?? 0;
  // Total evaluators = accepted reviewers + all assigned evaluation managers
  const totalEvaluators = totalReviewers + evaluation_managers.length;
  const allEvaluationsComplete =
    totalEvaluators > 0 && evaluationsCount >= totalEvaluators;

  // Map new_application fields to old field names for frontend compatibility
  return {
    application: {
      ...application,
      // Basic mappings
      company_name: application.team_name || application.company_name,
      founder_name: application.your_name || application.founder_name,
      phone: application.phone_number || application.phone,
      created_at: application.submitted_at || application.created_at,
      
      // Content mappings
      problem: application.problem_solving || application.problem,
      solution: application.your_solution || application.solution,
      description: application.your_solution || application.problem_solving || application.description,
      
      // Business mappings
      target_market: application.target_industry || application.target_market,
      business_model: application.solution_type || application.business_model,
      current_traction: application.proof_of_concept_details || application.current_traction,
      why_incubator: application.nirmaan_can_help || application.pre_incubation_reason || application.why_incubator,
      funding_amount: application.external_funding || application.funding_amount,
      
      // Additional fields with fallbacks
      website: application.website || null,
      co_founders: application.faculty_involved || application.co_founders || null,
      funding_stage: application.funding_stage || null,
      
      reviewers,
      totalReviewers,
      totalEvaluators,
      evaluationsCount,
      allEvaluationsComplete,
      evaluation_manager,
      evaluation_managers,
    },
  };
};

/** Send rejection email to team founder when manager rejects the application. */
async function sendRejectionEmail(
  email: string,
  founderName: string,
  startupName: string,
  rejectionReason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      console.warn(
        "GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping rejection email"
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

    const reasonBlock = rejectionReason.trim()
      ? `<p><strong>Reason:</strong></p><p>${rejectionReason.trim().replace(/\n/g, "<br>")}</p>`
      : "";

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { padding: 20px; background-color: #fff; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <p>Dear ${founderName},</p>
            <p>Thank you for your interest in Nirmaan Pre-Incubation and for submitting your application${startupName ? ` for <strong>${startupName}</strong>` : ""}.</p>
            <p>After careful review, we regret to inform you that we are unable to move forward with your application at this time.</p>
            ${reasonBlock}
            <p>We encourage you to apply again in the future if your plans or circumstances change.</p>
            <p>Regards,<br>Team Nirmaan</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const reasonText = rejectionReason.trim()
      ? `\n\nReason: ${rejectionReason.trim()}`
      : "";
    const emailText = `
Dear ${founderName},

Thank you for your interest in Nirmaan Pre-Incubation and for submitting your application${startupName ? ` for ${startupName}` : ""}.

After careful review, we regret to inform you that we are unable to move forward with your application at this time.${reasonText}

We encourage you to apply again in the future if your plans or circumstances change.

Regards,
Team Nirmaan
    `.trim();

    const cc = getFounderMailCc();
    await transporter.sendMail({
      from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
      to: email,
      ...(cc ? { cc } : {}),
      subject: `Update on your Pre-Incubation application${startupName ? ` – ${startupName}` : ""}`,
      text: emailText,
      html: emailHTML,
    });

    console.log("Rejection email sent to founder at", email, cc ? `(cc: ${cc})` : "");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error sending rejection email:", err);
    return { success: false, error: err.message };
  }
}

/** Send approval email to team founder when manager approves the application. */
async function sendApprovalEmail(
  email: string,
  founderName: string,
  startupName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      console.warn(
        "GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping approval email"
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
            
            <p>Congratulations! We are thrilled to inform you that your application${startupName ? ` for <strong>${startupName}</strong>` : ""} has been approved, and you have been <span class="highlight">added to our Pre-Incubation cohort</span>!</p>
            
            <p>This is an exciting milestone, and we look forward to supporting you on your entrepreneurial journey.</p>
            
            <p>Once again, congratulations on this achievement! We are excited to work with you and help bring your vision to life.</p>
            
            <p>Regards,<br>Team Nirmaan</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Dear ${founderName},

Congratulations! We are thrilled to inform you that your application${startupName ? ` for ${startupName}` : ""} has been approved, and you have been added to our Pre-Incubation cohort!

This is an exciting milestone, and we look forward to supporting you on your entrepreneurial journey.

Once again, congratulations on this achievement! We are excited to work with you and help bring your vision to life.

Regards,
Team Nirmaan
    `.trim();

    const cc = getFounderMailCc();
    await transporter.sendMail({
      from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
      to: email,
      ...(cc ? { cc } : {}),
      subject: `Congratulations! You've been added to the Pre-Incubation cohort${startupName ? ` – ${startupName}` : ""}`,
      text: emailText,
      html: emailHTML,
    });

    console.log("Approval email sent to founder at", email, cc ? `(cc: ${cc})` : "");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error sending approval email:", err);
    return { success: false, error: err.message };
  }
}

/** Send provisional-selection email without changing status. */
async function sendProvisionalSelectionEmail(
  _email: string,
  _founderName: string,
  _startupName: string
): Promise<{ success: boolean; error?: string }> {
  // Provisional-selection mail temporarily commented out by request.
  return { success: true };
}

/** Send final-selection email without changing status. */
async function sendFinalSelectionEmail(
  email: string,
  _founderName: string,
  _startupName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      console.warn(
        "GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping final-selection email"
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

    const onlineMeetingUrl =
      "https://teams.microsoft.com/meet/45985276703158?p=XMtlSVoWdvOuVSwWAk";
    const whatsappUrl = "https://chat.whatsapp.com/Ix1JMVizXQDIZ1PrlyTbCO";

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .content { padding: 20px; background-color: #fff; }
          .note { font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <p>Dear Team,</p>
            <p>A warm congratulations on your selection to the Nirmaan Pre-Incubation April 2026 Cohort at IIT Madras! We're thrilled to have you join us and can't wait to support your entrepreneurial journey.</p>
            <p>To get started on the right foot, our team is hosting a welcoming Orientation Session on April 22. We encourage everyone to attend, it's the perfect opportunity to learn about Nirmaan's procedures, connect with fellow teams, and get excited about what's ahead.</p>
            <p><strong>Session Details:</strong></p>
            <p><strong>Date:</strong> April 22, 2026<br>
            <strong>Time:</strong> 4:30 PM - 6:30 PM</p>
            <p><strong>In-Person Venue (for IITM BTech, MTech, MS, and PhD students):</strong><br>
            1st Floor, Sudha and Shankar Innovation Hub, IIT Madras (Nirmaan space)</p>
            <p><strong>Online Option (for BS Data Science students, non-IITM students, and other participants):</strong><br>
            <a href="${onlineMeetingUrl}">${onlineMeetingUrl}</a></p>
            <p><strong>Meeting ID:</strong> 459 852 767 031 58<br>
            <strong>Passcode:</strong> nT9V7Xj3</p>
            <p><strong>Join our April Cohort WhatsApp Group:</strong> <a href="${whatsappUrl}">${whatsappUrl}</a></p>
            <p>(Set your WhatsApp name as "Team Name _ Your Name" so we can easily identify you.)</p>
            <p class="note">Note - Do not share this meeting link, meeting ID and WhatsApp group link with anybody.</p>
            <p>Right after orientation, we'll kick off Pratham Sessions, an intensive 8-10 day program featuring one entrepreneurship topic per day with inspiring expert speakers. Topics, speakers, and dates coming soon!</p>
            <p>--<br><br>
            Warm Regards<br><br>
            Team Nirmaan,<br>
            The Pre-Incubator<br>
            Indian Institute of Technology, Madras</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Dear Team,

A warm congratulations on your selection to the Nirmaan Pre-Incubation April 2026 Cohort at IIT Madras! We're thrilled to have you join us and can't wait to support your entrepreneurial journey.

To get started on the right foot, our team is hosting a welcoming Orientation Session on April 22. We encourage everyone to attend, it's the perfect opportunity to learn about Nirmaan's procedures, connect with fellow teams, and get excited about what's ahead.

Session Details:

Date: April 22, 2026
Time: 4:30 PM - 6:30 PM

In-Person Venue (for IITM BTech, MTech, MS, and PhD students):
1st Floor, Sudha and Shankar Innovation Hub, IIT Madras (Nirmaan space)

Online Option (for BS Data Science students, non-IITM students, and other participants):
${onlineMeetingUrl}

Meeting ID: 459 852 767 031 58
Passcode: nT9V7Xj3

Join our April Cohort WhatsApp Group: ${whatsappUrl}

(Set your WhatsApp name as "Team Name _ Your Name" so we can easily identify you.)

Note - Do not share this meeting link, meeting ID and WhatsApp group link with anybody.

Right after orientation, we'll kick off Pratham Sessions, an intensive 8-10 day program featuring one entrepreneurship topic per day with inspiring expert speakers. Topics, speakers, and dates coming soon!

--
Warm Regards

Team Nirmaan,
The Pre-Incubator
Indian Institute of Technology, Madras
    `.trim();

    await transporter.sendMail({
      from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
      to: email,
      subject: "Orientation Session - Nirmaan Pre-Incubation April 2026 Cohort",
      text: emailText,
      html: emailHTML,
    });

    console.log("Final-selection email sent to founder at", email);
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error sending final-selection email:", err);
    return { success: false, error: err.message };
  }
}

/* =========================
   GET: Single application
   If Authorization Bearer is present and user is a reviewer, reviewers array
   contains only that reviewer (so they cannot see other reviewers).
========================= */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || !uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    let viewerReviewerId: string | undefined;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (token) {
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        "";
      const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        "";
      if (supabaseUrl && supabaseAnonKey) {
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
          error: userError,
        } = await supabaseAuth.auth.getUser(token);
        if (!userError && user?.id) {
          const { data: profile } = await supabaseServer
            .from("user_profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (profile?.role === "reviewer") {
            viewerReviewerId = user.id;
          }
        }
      }
    }

    if (viewerReviewerId) {
      const { data: assignment } = await supabaseServer
        .from("application_reviewers")
        .select("id")
        .eq("application_id", id)
        .eq("reviewer_id", viewerReviewerId)
        .maybeSingle();
      // Also allow reviewers who have submitted an evaluation (e.g. for viewing their evaluation result)
      if (!assignment) {
        const { data: evalRow } = await supabaseServer
          .from("application_evaluations")
          .select("id")
          .eq("application_id", id)
          .eq("reviewer_id", viewerReviewerId)
          .maybeSingle();
        if (!evalRow) {
          return NextResponse.json(
            { error: "Application not found or you are not assigned to this application" },
            { status: 404 },
          );
        }
      }
    }

    const { application, error } = await buildApplicationResponse(
      id,
      viewerReviewerId
    );

    if (error || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ application });
  } catch (error: any) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

/* =========================
   PUT: Update application
========================= */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || !uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (body.sendEvaluatedMail === true || body.sendSelectionMail === true) {
      const selectionType: "provisional" | "final" =
        body.selectionType === "final" ? "final" : "provisional";
      const { data: appRow, error: appError } = await supabaseServer
        .from("new_application")
        .select("email, your_name, team_name, status")
        .eq("id", id)
        .single();

      if (appError || !appRow) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 },
        );
      }

      if (appRow.status !== "evaluated") {
        return NextResponse.json(
          { error: "Mail can only be sent when application is in evaluated status" },
          { status: 400 },
        );
      }

      const founderEmail = appRow.email?.trim();
      if (!founderEmail) {
        return NextResponse.json(
          { error: "Application founder email is missing" },
          { status: 400 },
        );
      }

      const emailResult =
        selectionType === "final"
          ? await sendFinalSelectionEmail(
              founderEmail,
              appRow.your_name || "Founder",
              appRow.team_name || "your startup team",
            )
          : await sendProvisionalSelectionEmail(
              founderEmail,
              appRow.your_name || "Founder",
              appRow.team_name || "your startup team",
            );

      if (!emailResult.success) {
        return NextResponse.json(
          { error: `Failed to send ${selectionType}-selection email`, details: emailResult.error },
          { status: 500 },
        );
      }

      const { application } = await buildApplicationResponse(id);
      return NextResponse.json({
        message: `${
          selectionType === "final" ? "Final-selection" : "Provisional-selection"
        } email sent successfully`,
        application,
      });
    }

    // Assign reviewers
    if (Array.isArray(body.reviewerIds)) {
      const reviewerIds = (body.reviewerIds as Array<string>).filter(
        (rid) => rid && uuidRegex.test(rid),
      );

      if (reviewerIds.length === 0) {
        return NextResponse.json(
          { error: "Please provide at least one reviewerId" },
          { status: 400 },
        );
      }

      // Replace assignments
      await supabaseServer
        .from("application_reviewers")
        .delete()
        .eq("application_id", id);

      const { error: insertError } = await supabaseServer
        .from("application_reviewers")
        .insert(
          reviewerIds.map((reviewerId) => ({
            application_id: id,
            reviewer_id: reviewerId,
          })),
        );

      if (insertError) {
        return NextResponse.json(
          { error: "Failed to assign reviewers", details: insertError.message },
          { status: 500 },
        );
      }

      // Do not move to under_review here; status moves to under_review only when all assigned reviewers and manager have invite_status = accepted (see reviewer-respond and assign-manager).
    }

    // Update status (including rejection reason)
    if (body.status) {
      const updateData: Record<string, any> = {
        status: body.status,
      };

      if (body.status === "rejected") {
        updateData.rejection_reason = body.rejectionReason || null;
      } else if ("rejectionReason" in body) {
        updateData.rejection_reason = null;
      }

      const { error: updateError } = await supabaseServer
        .from("new_application")
        .update(updateData)
        .eq("id", id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update status", details: updateError.message },
          { status: 500 },
        );
      }

      // When manager rejects, send email to team founder
      if (body.status === "rejected") {
        const { data: appRow } = await supabaseServer
          .from("new_application")
          .select("email, your_name, team_name, rejection_reason")
          .eq("id", id)
          .single();

        const founderEmail = appRow?.email?.trim();
        if (founderEmail) {
          const founderName = appRow?.your_name || "Founder";
          const startupName = appRow?.team_name || "";
          const reason = appRow?.rejection_reason || body.rejectionReason || "";
          const emailResult = await sendRejectionEmail(
            founderEmail,
            founderName,
            startupName,
            reason,
          );
          if (!emailResult.success) {
            console.warn("Rejection email not sent to founder:", emailResult.error);
          }
        } else {
          console.warn("Application has no founder email; rejection email skipped.");
        }
      }

      // When manager approves, send email to team founder about cohort and onboarding
      if (body.status === "approved") {
        const { data: appRow } = await supabaseServer
          .from("new_application")
          .select("email, your_name, team_name")
          .eq("id", id)
          .single();

        const founderEmail = appRow?.email?.trim();
        if (founderEmail) {
          const founderName = appRow?.your_name || "Founder";
          const startupName = appRow?.team_name || "";
          const emailResult = await sendApprovalEmail(
            founderEmail,
            founderName,
            startupName,
          );
          if (!emailResult.success) {
            console.warn("Approval email not sent to founder:", emailResult.error);
          }
        } else {
          console.warn("Application has no founder email; approval email skipped.");
        }
      }
    }

    const { application } = await buildApplicationResponse(id);

    return NextResponse.json({
      message: "Application updated successfully",
      application,
    });
  } catch (error: any) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}
