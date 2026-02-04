import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { uploadFileToS3 } from "@/lib/s3";
import nodemailer from "nodemailer";

/**
 * Send application submission confirmation email to the applicant.
 * Called only after successful insert so all successful applicants receive it.
 */

async function sendApplicationConfirmationEmail(
  email: string,
  applicantName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      console.warn(
        "GMAIL_USER or GMAIL_APP_PASSWORD not set - skipping confirmation email",
      );
      return { success: false, error: "Email not configured" };
    }
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
            <p>Dear ${applicantName},</p>
            
            <p>Thank you for submitting your application. We would like to confirm that we have received your application. Our team of expert evaluators will now review your application for the next round. You will receive an email update from our end on the status of your selection. Thank you for the time and consideration you have given to this application.</p>
            
            <p>Regard,<br>
            Team Nirmaan</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Dear ${applicantName},

Thank you for submitting your application. We would like to confirm that we have received your application. Our team of expert evaluators will now review your application for the next round. You will receive an email update from our end on the status of your selection. Thank you for the time and consideration you have given to this application.

Regard,
Team Nirmaan
    `;

    await transporter.sendMail({
      from: `"Nirmaan Pre-Incubation" <${gmailUser}>`,
      to: email,
      subject: "Thank you for applying!!!",
      text: emailText,
      html: emailHTML,
    });

    console.log("Application confirmation email sent to", email);
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error sending application confirmation email:", err);
    return { success: false, error: err.message };
  }
}

/* =========================
   POST: Submit application
========================= */
export async function POST(request: NextRequest) {
  try {
    // Parse FormData instead of JSON (for file uploads)
    const formData = await request.formData();
    // Extract files directly from FormData (before converting to object)
    const presentationFile = formData.get("presentationFile") as File | null;
    const document1File = formData.get("document1File") as File | null;
    const document2File = formData.get("document2File") as File | null;
    const ipFile = formData.get("ipFile") as File | null;
    const potentialIpFile = formData.get("potentialIpFile") as File | null;

    // Validate file size: max 1 MB per file (check numeric size in case of runtime quirks)
    const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
    const filesToCheck: { file: File | null; label: string }[] = [
      { file: presentationFile, label: "Presentation" },
      { file: document1File, label: "Document 1" },
      { file: document2File, label: "Document 2" },
      { file: ipFile, label: "IP document" },
      { file: potentialIpFile, label: "Potential IP document" },
    ];
    for (const { file, label } of filesToCheck) {
      if (!file || !(file instanceof File)) continue;
      const sizeBytes = Number(file.size);
      if (!Number.isNaN(sizeBytes) && sizeBytes > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "File size is too large. Please upload files under 1 MB." },
          { status: 400 },
        );
      }
    }

    // Debug logging
    console.log("Files received:", {
      ipFile: ipFile
        ? { name: ipFile.name, size: ipFile.size, type: ipFile.type }
        : null,
      potentialIpFile: potentialIpFile
        ? {
            name: potentialIpFile.name,
            size: potentialIpFile.size,
            type: potentialIpFile.type,
          }
        : null,
    });

    // Convert FormData to a regular object (excluding file fields)
    const body: Record<string, any> = {};
    formData.forEach((value, key) => {
      // Skip file fields - we handle them separately above
      if (!key.endsWith("File")) {
        body[key] = value.toString();
      }
    });

    // Validate required fields based on database schema (NOT NULL constraints)
    // NOTE: `rollNumber` is required only for IITM applicants.
    const requiredFields = [
      "email",
      "teamName",
      "yourName",
      "isIITM",
      "phoneNumber",
      "channel",
      "coFoundersCount",
      "facultyInvolved",
      "priorEntrepreneurshipExperience",
      "teamPriorEntrepreneurshipExperience",
      "mcaRegistered",
      "teamMembers",
      "nirmaanCanHelp",
      "preIncubationReason",
      "heardAboutStartups",
      "heardAboutNirmaan",
      "problemSolving",
      "yourSolution",
      "solutionType",
      "targetIndustry",
      "startupStage",
      "hasIntellectualProperty",
      "hasPotentialIntellectualProperty",
      "nirmaanPresentationLink",
      "hasProofOfConcept",
      "hasPatentsOrPapers",
      "seedFundUtilizationPlan",
    ];

    if (String(body.isIITM || "").trim() === "Yes") {
      requiredFields.push("rollNumber");
    }

    for (const field of requiredFields) {
      // Special handling for array fields
      if (field === "teamMembers") {
        let teamMembersValue = body[field];
        if (typeof teamMembersValue === "string") {
          try {
            teamMembersValue = JSON.parse(teamMembersValue);
          } catch {
            teamMembersValue = [];
          }
        }
        if (!Array.isArray(teamMembersValue) || teamMembersValue.length === 0) {
          return NextResponse.json(
            {
              error: `Missing required field: ${field}. At least one team member is required.`,
            },
            { status: 400 },
          );
        }
      } else if (field === "facultyInvolved") {
        let facultyValue: unknown = body[field];
        if (typeof facultyValue === "string") {
          const trimmed = facultyValue.trim();
          // Allow explicit N/A/NA markers
          if (trimmed.toUpperCase() === "NA" || trimmed.toUpperCase() === "N/A") {
            continue;
          }
          try {
            facultyValue = JSON.parse(trimmed);
          } catch {
            facultyValue = null;
          }
        }

        if (Array.isArray(facultyValue)) {
          if (facultyValue.length === 0) {
            return NextResponse.json(
              { error: "Missing required field: facultyInvolved. If no faculty, enter N/A." },
              { status: 400 },
            );
          }
        } else if (!facultyValue || String(facultyValue).trim() === "") {
          return NextResponse.json(
            { error: "Missing required field: facultyInvolved. If no faculty, enter N/A." },
            { status: 400 },
          );
        }
      } else if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Handle file uploads to AWS S3 (nirmaan-launchpad bucket)
    const fileUrls: Record<string, string> = {};

    // Upload presentation file
    if (
      presentationFile &&
      presentationFile instanceof File &&
      presentationFile.size > 0
    ) {
      try {
        console.log("Attempting to upload presentation file:", {
          name: presentationFile.name,
          size: presentationFile.size,
          type: presentationFile.type,
        });
        const result = await uploadFileToS3(presentationFile, "presentation");
        if (result) {
          fileUrls.presentation = result.url;
          console.log(
            "Presentation file uploaded successfully:",
            result.url,
            "filename:",
            result.filename,
          );
        } else {
          console.error("Presentation file upload returned null");
        }
      } catch (error) {
        console.error("Exception uploading presentation file:", error);
      }
    } else {
      console.log("Presentation file not provided or invalid:", {
        presentationFile,
        isFile: presentationFile instanceof File,
      });
    }

    // Upload document files
    if (
      document1File &&
      document1File instanceof File &&
      document1File.size > 0
    ) {
      try {
        console.log("Attempting to upload document1 file:", {
          name: document1File.name,
          size: document1File.size,
          type: document1File.type,
        });
        const result = await uploadFileToS3(document1File, "doc1");
        if (result) {
          fileUrls.document1 = result.url;
          console.log(
            "Document1 file uploaded successfully:",
            result.url,
            "filename:",
            result.filename,
          );
        } else {
          console.error("Document1 file upload returned null");
        }
      } catch (error) {
        console.error("Exception uploading document1 file:", error);
      }
    } else {
      console.log("Document1 file not provided or invalid:", {
        document1File,
        isFile: document1File instanceof File,
      });
    }

    if (
      document2File &&
      document2File instanceof File &&
      document2File.size > 0
    ) {
      try {
        console.log("Attempting to upload document2 file:", {
          name: document2File.name,
          size: document2File.size,
          type: document2File.type,
        });
        const result = await uploadFileToS3(document2File, "doc2");
        if (result) {
          fileUrls.document2 = result.url;
          console.log(
            "Document2 file uploaded successfully:",
            result.url,
            "filename:",
            result.filename,
          );
        } else {
          console.error("Document2 file upload returned null");
        }
      } catch (error) {
        console.error("Exception uploading document2 file:", error);
      }
    } else {
      console.log("Document2 file not provided or invalid:", {
        document2File,
        isFile: document2File instanceof File,
      });
    }

    // Upload IP file
    if (ipFile && ipFile !== null && ipFile.size > 0) {
      try {
        console.log("Attempting to upload IP file:", {
          name: (ipFile as File).name,
          size: (ipFile as File).size,
          type: (ipFile as File).type,
        });
        const result = await uploadFileToS3(ipFile as File, "ip");
        if (result) {
          fileUrls.ipFile = result.url;
          console.log(
            "IP file uploaded successfully:",
            result.url,
            "filename:",
            result.filename,
          );
        } else {
          console.error("IP file upload returned null");
        }
      } catch (error) {
        console.error("Exception uploading IP file:", error);
      }
    } else {
      console.log("IP file not provided or invalid:", {
        ipFile,
        isFile: ipFile instanceof File,
      });
    }

    // Upload potential IP file
    if (
      potentialIpFile &&
      potentialIpFile !== null &&
      potentialIpFile.size > 0
    ) {
      try {
        console.log("Attempting to upload potential IP file:", {
          name: (potentialIpFile as File).name,
          size: (potentialIpFile as File).size,
          type: (potentialIpFile as File).type,
        });
        const result = await uploadFileToS3(
          potentialIpFile as File,
          "potential-ip",
        );
        if (result) {
          fileUrls.potentialIpFile = result.url;
          console.log(
            "Potential IP file uploaded successfully:",
            result.url,
            "filename:",
            result.filename,
          );
        } else {
          console.error("Potential IP file upload returned null");
        }
      } catch (error) {
        console.error("Exception uploading potential IP file:", error);
      }
    } else {
      console.log("Potential IP file not provided or invalid:", {
        potentialIpFile,
        isFile: potentialIpFile instanceof File,
      });
    }

    // Parse JSONB fields if they're strings
    let otherIndustries = body.otherIndustries;
    if (typeof otherIndustries === "string") {
      try {
        otherIndustries = JSON.parse(otherIndustries);
      } catch {
        otherIndustries = [];
      }
    }

    let technologiesUtilized = body.technologiesUtilized;
    if (typeof technologiesUtilized === "string") {
      try {
        technologiesUtilized = JSON.parse(technologiesUtilized);
      } catch {
        technologiesUtilized = [];
      }
    }

    let facultyInvolved = body.facultyInvolved;
    if (typeof facultyInvolved === "string") {
      try {
        facultyInvolved = JSON.parse(facultyInvolved);
        // If empty array, set to "NA" string as per requirement
        if (Array.isArray(facultyInvolved) && facultyInvolved.length === 0) {
          facultyInvolved = "NA";
        }
      } catch {
        facultyInvolved = "NA";
      }
    }
    // If it's already an array but empty, set to "NA"
    if (Array.isArray(facultyInvolved) && facultyInvolved.length === 0) {
      facultyInvolved = "NA";
    }

    let teamMembers = body.teamMembers;
    if (typeof teamMembers === "string") {
      try {
        teamMembers = JSON.parse(teamMembers);
      } catch {
        teamMembers = [];
      }
    }
    // Ensure it's an array
    if (!Array.isArray(teamMembers)) {
      teamMembers = [];
    }

    let externalFunding = body.externalFunding;
    if (typeof externalFunding === "string") {
      try {
        externalFunding = JSON.parse(externalFunding);
      } catch {
        externalFunding = [];
      }
    }
    // Ensure it's an array
    if (!Array.isArray(externalFunding)) {
      externalFunding = [];
    }
    // If empty array, set to null
    if (Array.isArray(externalFunding) && externalFunding.length === 0) {
      externalFunding = null;
    }

    // Map ALL frontend fields to database fields matching the new_application schema
    // Only include applicant_id if present (column may not exist in all DB setups; guest submissions have no applicant)
    const applicationData: Record<string, any> = {
      // Basic Information
      email: body.email,
      team_name: body.teamName || "N/A",
      your_name: body.yourName || "N/A",
      is_iitm: body.isIITM || "No",
      roll_number: body.rollNumber || "N/A",
      college_name: body.collegeName || null,
      current_occupation: body.currentOccupation || null,
      phone_number: body.phoneNumber || "N/A",
      channel: body.channel || "N/A",
      channel_other: body.channelOther || null,
      co_founders_count: parseInt(body.coFoundersCount) || 0,
      faculty_involved: facultyInvolved || "NA",

      // Entrepreneurship Experience
      prior_entrepreneurship_experience:
        body.priorEntrepreneurshipExperience || "No",
      team_prior_entrepreneurship_experience:
        body.teamPriorEntrepreneurshipExperience || "No",
      prior_experience_details: body.priorExperienceDetails || null,

      // Startup Registration & Funding
      mca_registered: body.mcaRegistered || "No",
      dpiit_details: body.dpiitDetails || null,
      external_funding: externalFunding || null,
      currently_incubated: body.currentlyIncubated || null,

      // Team Members
      team_members: teamMembers || [],

      // About Nirmaan Program
      nirmaan_can_help: body.nirmaanCanHelp || "N/A",
      pre_incubation_reason: body.preIncubationReason || "N/A",
      heard_about_startups: body.heardAboutStartups || "N/A",
      heard_about_nirmaan: body.heardAboutNirmaan || "N/A",

      // Problem & Solution
      problem_solving: body.problemSolving || "N/A",
      your_solution: body.yourSolution || "N/A",
      solution_type: body.solutionType || "N/A",
      solution_type_other: body.solutionTypeOther || null,

      // Industry & Technologies
      target_industry: body.targetIndustry || "N/A",
      other_industries: otherIndustries || [],
      industry_other: body.industryOther || null,
      other_industries_other: body.otherIndustriesOther || null,
      technologies_utilized: technologiesUtilized || [],
      other_technology_details: body.otherTechnologyDetails || null,

      // Startup Stage & IP (valid_has_ip constraint requires exactly Yes or No)
      startup_stage: body.startupStage || "N/A",
      has_intellectual_property: body.hasIntellectualProperty === "Yes" ? "Yes" : "No",
      has_potential_intellectual_property:
        body.hasPotentialIntellectualProperty === "Yes" ? "Yes" : "No",
      ip_file_link: fileUrls.ipFile || null,
      potential_ip_file_link: fileUrls.potentialIpFile || null,

      // Presentation & Proof
      nirmaan_presentation_link:
        fileUrls.presentation || body.nirmaanPresentationLink || "N/A",
      has_proof_of_concept: body.hasProofOfConcept || "No",
      proof_of_concept_details: body.proofOfConceptDetails || null,
      has_patents_or_papers: body.hasPatentsOrPapers === "Yes" ? "Yes" : "No",
      patents_or_papers_details: body.patentsOrPapersDetails || null,

      // Seed Fund & Pitch
      seed_fund_utilization_plan: body.seedFundUtilizationPlan || "N/A",
      pitch_video_link: body.pitchVideoLink || "N/A",
      document1_link: fileUrls.document1 || body.document1Link || null,
      document2_link: fileUrls.document2 || body.document2Link || null,

      // Status & Metadata
      status: "pending",
    };
    if (body.applicantId && String(body.applicantId).trim()) {
      applicationData.applicant_id = body.applicantId;
    }

    // Debug: Log file URLs and application data before insert
    console.log("File URLs to be saved:", {
      ipFile: fileUrls.ipFile,
      potentialIpFile: fileUrls.potentialIpFile,
      allFileUrls: fileUrls,
    });
    console.log("IP fields in applicationData:", {
      has_intellectual_property: applicationData.has_intellectual_property,
      ip_file_link: applicationData.ip_file_link,
      has_potential_intellectual_property:
        applicationData.has_potential_intellectual_property,
      potential_ip_file_link: applicationData.potential_ip_file_link,
    });

    const { data, error } = await supabaseServer
      .from("new_application")
      .insert(applicationData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      console.error(
        "Application data that failed to insert:",
        JSON.stringify(applicationData, null, 2),
      );

      // Check if error is related to missing columns (e.g. applicant_id not in schema)
      if (
        error.message &&
        (error.message.includes("column") || error.code === "PGRST204")
      ) {
        return NextResponse.json(
          {
            error:
              "Database schema error. Ensure new_application table has required columns (see SIMPLE_DATABASE_SETUP.sql).",
            details: error.message,
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { error: "Failed to submit application", details: error.message },
        { status: 500 },
      );
    }

    // Send confirmation email only after successful submission (all successful applicants receive it)
    const emailResult = await sendApplicationConfirmationEmail(
      body.email,
      body.yourName,
    );
    if (!emailResult.success) {
      console.warn(
        "Application saved but confirmation email failed:",
        emailResult.error,
      );
    }

    // Log successful insert with IP file links
    console.log("Application inserted successfully:", {
      id: data.id,
      ip_file_link: data.ip_file_link,
      potential_ip_file_link: data.potential_ip_file_link,
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        data: { id: data.id, status: data.status },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 },
    );
  }
}

/* =========================
   GET: Fetch applications
========================= */
export async function GET() {
  try {
    const { data, error, count } = await supabaseServer
      .from("new_application")
      .select("*", { count: "exact" })
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        applications: data || [],
        pagination: { total: count || 0 },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
