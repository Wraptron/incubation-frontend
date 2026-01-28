import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

/* =========================
   POST: Submit application
========================= */
export async function POST(request: NextRequest) {
  try {
    // Parse FormData instead of JSON (for file uploads)
    const formData = await request.formData();
    
    // Extract files directly from FormData (before converting to object)
    const presentationFile = formData.get('presentationFile') as File | null;
    const document1File = formData.get('document1File') as File | null;
    const document2File = formData.get('document2File') as File | null;
    const ipFile = formData.get('ipFile') as File | null;
    const potentialIpFile = formData.get('potentialIpFile') as File | null;
    
    // Debug logging
    console.log("Files received:", {
      ipFile: ipFile ? { name: ipFile.name, size: ipFile.size, type: ipFile.type } : null,
      potentialIpFile: potentialIpFile ? { name: potentialIpFile.name, size: potentialIpFile.size, type: potentialIpFile.type } : null,
    });
    
    // Convert FormData to a regular object (excluding file fields)
    const body: Record<string, any> = {};
    formData.forEach((value, key) => {
      // Skip file fields - we handle them separately above
      if (!key.endsWith('File')) {
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
      // Special handling for array fields
      if (field === 'teamMembers') {
        let teamMembersValue = body[field];
        if (typeof teamMembersValue === 'string') {
          try {
            teamMembersValue = JSON.parse(teamMembersValue);
          } catch {
            teamMembersValue = [];
          }
        }
        if (!Array.isArray(teamMembersValue) || teamMembersValue.length === 0) {
          return NextResponse.json(
            { error: `Missing required field: ${field}. At least one team member is required.` },
            { status: 400 }
          );
        }
      } else if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Handle file uploads to Supabase Storage
    const fileUrls: Record<string, string> = {};
    
    // Upload presentation file
    if (presentationFile && presentationFile instanceof File) {
      const file = presentationFile;
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
    if (document1File && document1File instanceof File) {
      const file = document1File;
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
    
    if (document2File && document2File instanceof File) {
      const file = document2File;
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

    // Upload IP file
    if (ipFile && ipFile !== null && ipFile.size > 0) {
      try {
        const file = ipFile as File;
        const fileExt = file.name.split('.').pop() || 'pdf';
        const fileName = `${Date.now()}-ip.${fileExt}`;
        const filePath = `applications/${fileName}`;
        
        console.log("Attempting to upload IP file:", { name: file.name, size: file.size, type: file.type });
        
        const { data: uploadData, error: uploadError } = await supabaseServer
          .storage
          .from('application-files')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error("Error uploading IP file:", uploadError);
        } else if (uploadData) {
          const { data: { publicUrl } } = supabaseServer
            .storage
            .from('application-files')
            .getPublicUrl(filePath);
          fileUrls.ipFile = publicUrl;
          console.log("IP file uploaded successfully:", publicUrl);
        }
      } catch (error) {
        console.error("Exception uploading IP file:", error);
      }
    } else {
      console.log("IP file not provided or invalid:", { ipFile, isFile: ipFile instanceof File });
    }

    // Upload potential IP file
    if (potentialIpFile && potentialIpFile !== null && potentialIpFile.size > 0) {
      try {
        const file = potentialIpFile as File;
        const fileExt = file.name.split('.').pop() || 'pdf';
        const fileName = `${Date.now()}-potential-ip.${fileExt}`;
        const filePath = `applications/${fileName}`;
        
        console.log("Attempting to upload potential IP file:", { name: file.name, size: file.size, type: file.type });
        
        const { data: uploadData, error: uploadError } = await supabaseServer
          .storage
          .from('application-files')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error("Error uploading potential IP file:", uploadError);
        } else if (uploadData) {
          const { data: { publicUrl } } = supabaseServer
            .storage
            .from('application-files')
            .getPublicUrl(filePath);
          fileUrls.potentialIpFile = publicUrl;
          console.log("Potential IP file uploaded successfully:", publicUrl);
        }
      } catch (error) {
        console.error("Exception uploading potential IP file:", error);
      }
    } else {
      console.log("Potential IP file not provided or invalid:", { potentialIpFile, isFile: potentialIpFile instanceof File });
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

    let facultyInvolved = body.facultyInvolved;
    if (typeof facultyInvolved === 'string') {
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
    if (typeof teamMembers === 'string') {
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
    if (typeof externalFunding === 'string') {
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
      faculty_involved: facultyInvolved || "NA",

      // Entrepreneurship Experience
      prior_entrepreneurship_experience: body.priorEntrepreneurshipExperience || "No",
      team_prior_entrepreneurship_experience: body.teamPriorEntrepreneurshipExperience || "No",
      prior_experience_details: body.priorExperienceDetails || null,

      // Startup Registration & Funding
      mca_registered: body.mcaRegistered || "No",
      dpiit_registered: body.dpiitRegistered || null,
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

      // Startup Stage & IP
      startup_stage: body.startupStage || "N/A",
      has_intellectual_property: body.hasIntellectualProperty || "No",
      has_potential_intellectual_property: body.hasPotentialIntellectualProperty || "No",
      ip_file_link: fileUrls.ipFile || null,
      potential_ip_file_link: fileUrls.potentialIpFile || null,

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

    // Debug: Log file URLs and application data before insert
    console.log("File URLs to be saved:", { 
      ipFile: fileUrls.ipFile, 
      potentialIpFile: fileUrls.potentialIpFile,
      allFileUrls: fileUrls
    });
    console.log("IP fields in applicationData:", {
      has_intellectual_property: applicationData.has_intellectual_property,
      ip_file_link: applicationData.ip_file_link,
      has_potential_intellectual_property: applicationData.has_potential_intellectual_property,
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
      console.error("Application data that failed to insert:", JSON.stringify(applicationData, null, 2));
      
      // Check if error is related to missing columns
      if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: "Database schema error. Please ensure ip_file_link and potential_ip_file_link columns exist in the new_application table.",
            details: error.message 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to submit application", details: error.message },
        { status: 500 }
      );
    }
    
    // Log successful insert with IP file links
    console.log("Application inserted successfully:", {
      id: data.id,
      ip_file_link: data.ip_file_link,
      potential_ip_file_link: data.potential_ip_file_link
    });

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
