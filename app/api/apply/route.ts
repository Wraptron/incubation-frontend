import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

/* =========================
   POST: Submit application
========================= */
export async function POST(request: NextRequest) {
  try {
    // Parse FormData instead of JSON (for file uploads)
    const formData = await request.formData();
    
    // Convert FormData to a regular object
    const body: Record<string, any> = {};
    formData.forEach((value, key) => {
      // Skip file fields
      if (key.endsWith('File')) {
        body[key] = value;
      } else {
        body[key] = value.toString();
      }
    });

    // Validate required fields based on database schema (NOT NULL constraints)
    const requiredFields = [
      "email",
      "teamName",
      "yourName",
      "isIITM",
      "rollNumber",
      "phoneNumber",
      "channel",
      "coFoundersCount",
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
      "pitchVideoLink",
    ];

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Handle file uploads to Supabase Storage
    const fileUrls: Record<string, string> = {};
    
    // Upload presentation file
    if (body.presentationFile && body.presentationFile instanceof File) {
      const file = body.presentationFile as File;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-presentation.${fileExt}`;
      const filePath = `applications/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabaseServer
        .storage
        .from('application-files')
        .upload(filePath, file);
      
      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabaseServer
          .storage
          .from('application-files')
          .getPublicUrl(filePath);
        fileUrls.presentation = publicUrl;
      }
    }
    
    // Upload document files
    if (body.document1File && body.document1File instanceof File) {
      const file = body.document1File as File;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-doc1.${fileExt}`;
      const filePath = `applications/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabaseServer
        .storage
        .from('application-files')
        .upload(filePath, file);
      
      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabaseServer
          .storage
          .from('application-files')
          .getPublicUrl(filePath);
        fileUrls.document1 = publicUrl;
      }
    }
    
    if (body.document2File && body.document2File instanceof File) {
      const file = body.document2File as File;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-doc2.${fileExt}`;
      const filePath = `applications/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabaseServer
        .storage
        .from('application-files')
        .upload(filePath, file);
      
      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabaseServer
          .storage
          .from('application-files')
          .getPublicUrl(filePath);
        fileUrls.document2 = publicUrl;
      }
    }

    // Parse JSONB fields if they're strings
    let otherIndustries = body.otherIndustries;
    if (typeof otherIndustries === 'string') {
      try {
        otherIndustries = JSON.parse(otherIndustries);
      } catch {
        otherIndustries = [];
      }
    }
    
    let technologiesUtilized = body.technologiesUtilized;
    if (typeof technologiesUtilized === 'string') {
      try {
        technologiesUtilized = JSON.parse(technologiesUtilized);
      } catch {
        technologiesUtilized = [];
      }
    }

    // Map ALL frontend fields to database fields matching the new_application schema
    const applicationData: Record<string, any> = {
      // Basic Information
      email: body.email,
      team_name: body.teamName || "N/A",
      your_name: body.yourName || "N/A",
      is_iitm: body.isIITM || "No",
      roll_number: body.rollNumber || "N/A",
      roll_number_other: body.rollNumberOther || null,
      college_name: body.collegeName || null,
      current_occupation: body.currentOccupation || null,
      phone_number: body.phoneNumber || "N/A",
      channel: body.channel || "N/A",
      channel_other: body.channelOther || null,
      co_founders_count: parseInt(body.coFoundersCount) || 0,
      faculty_involved: body.facultyInvolved || null,

      // Entrepreneurship Experience
      prior_entrepreneurship_experience: body.priorEntrepreneurshipExperience || "No",
      team_prior_entrepreneurship_experience: body.teamPriorEntrepreneurshipExperience || "No",
      prior_experience_details: body.priorExperienceDetails || null,

      // Startup Registration & Funding
      mca_registered: body.mcaRegistered || "No",
      dpiit_registered: body.dpiitRegistered || null,
      dpiit_details: body.dpiitDetails || null,
      external_funding: body.externalFunding || null,
      currently_incubated: body.currentlyIncubated || null,

      // Team Members
      team_members: body.teamMembers || "N/A",

      // About Nirmaan Program
      nirmaan_can_help: body.nirmaanCanHelp || "N/A",
      pre_incubation_reason: body.preIncubationReason || "N/A",
      heard_about_startups: body.heardAboutStartups || "N/A",
      heard_about_nirmaan: body.heardAboutNirmaan || "N/A",

      // Problem & Solution
      problem_solving: body.problemSolving || "N/A",
      your_solution: body.yourSolution || "N/A",
      solution_type: body.solutionType || "N/A",

      // Industry & Technologies
      target_industry: body.targetIndustry || "N/A",
      other_industries: otherIndustries || [],
      industry_other: body.industryOther || null,
      other_industries_other: body.otherIndustriesOther || null,
      technologies_utilized: technologiesUtilized || [],
      other_technology_details: body.otherTechnologyDetails || null,

      // Startup Stage & IP
      startup_stage: body.startupStage || "N/A",
      has_intellectual_property: body.hasIntellectualProperty || "No",
      has_potential_intellectual_property: body.hasPotentialIntellectualProperty || "No",

      // Presentation & Proof
      nirmaan_presentation_link: body.nirmaanPresentationLink || fileUrls.presentation || "N/A",
      has_proof_of_concept: body.hasProofOfConcept || "No",
      proof_of_concept_details: body.proofOfConceptDetails || null,
      has_patents_or_papers: body.hasPatentsOrPapers || "No",
      patents_or_papers_details: body.patentsOrPapersDetails || null,

      // Seed Fund & Pitch
      seed_fund_utilization_plan: body.seedFundUtilizationPlan || "N/A",
      pitch_video_link: body.pitchVideoLink || "N/A",
      document1_link: body.document1Link || fileUrls.document1 || null,
      document2_link: body.document2Link || fileUrls.document2 || null,

      // Status & Metadata
      status: "pending",
    };

    const { data, error } = await supabaseServer
      .from("new_application")
      .insert(applicationData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit application", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        data: { id: data.id, status: data.status },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
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
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        applications: data || [],
        pagination: { total: count || 0 },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
