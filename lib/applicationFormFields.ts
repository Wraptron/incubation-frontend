/**
 * Application form field definitions for Excel template generation.
 * Maps to new_application table and /api/apply schema.
 */

export interface ExcelColumnDef {
  key: string;
  label: string;
  dbKey: string;
  hint?: string;
  required?: boolean;
}

/** Excel columns in order - matches application form structure */
export const APPLICATION_EXCEL_COLUMNS: ExcelColumnDef[] = [
  { key: "email", label: "Email", dbKey: "email", required: true, hint: "e.g. founder@startup.com" },
  { key: "teamName", label: "Team/Company Name", dbKey: "team_name", required: true },
  { key: "yourName", label: "Your Name (Founder)", dbKey: "your_name", required: true },
  { key: "isIITM", label: "Are you from IITM?", dbKey: "is_iitm", required: true, hint: "Yes or No" },
  { key: "rollNumber", label: "Roll Number", dbKey: "roll_number", hint: "Required if IITM=Yes" },
  { key: "collegeName", label: "College Name", dbKey: "college_name", hint: "If not IITM" },
  { key: "currentOccupation", label: "Current Occupation", dbKey: "current_occupation" },
  { key: "phoneNumber", label: "Phone Number", dbKey: "phone_number", required: true },
  { key: "channel", label: "Channel", dbKey: "channel", required: true, hint: "CFI | E-cell | PALS | Carbon Zero Challenge (CZC) | I2I (Sustainability Venture Studio) | IITM (Others) | Others" },
  { key: "channelOther", label: "Channel (Other)", dbKey: "channel_other", hint: "Required when channel=Others" },
  { key: "coFoundersCount", label: "Number of Co-founders", dbKey: "co_founders_count", required: true, hint: "0, 1, 2, etc." },
  { key: "facultyInvolved", label: "Faculty Involved", dbKey: "faculty_involved", required: true, hint: "NA or JSON array" },
  { key: "priorEntrepreneurshipExperience", label: "Prior Entrepreneurship Experience?", dbKey: "prior_entrepreneurship_experience", required: true, hint: "Yes or No" },
  { key: "teamPriorEntrepreneurshipExperience", label: "Team Prior Entrepreneurship Experience?", dbKey: "team_prior_entrepreneurship_experience", required: true, hint: "Yes or No" },
  { key: "priorExperienceDetails", label: "Prior Experience Details", dbKey: "prior_experience_details" },
  { key: "mcaRegistered", label: "MCA Registered?", dbKey: "mca_registered", required: true, hint: "Yes or No" },
  { key: "dpiitDetails", label: "DPIIT Details", dbKey: "dpiit_details", hint: "If MCA registered" },
  { key: "externalFunding", label: "External Funding", dbKey: "external_funding", hint: "JSON array or []" },
  { key: "currentlyIncubated", label: "Currently Incubated?", dbKey: "currently_incubated" },
  { key: "teamMembers", label: "Team Members", dbKey: "team_members", required: true, hint: "JSON array - see Instructions sheet" },
  { key: "nirmaanCanHelp", label: "How can Nirmaan help?", dbKey: "nirmaan_can_help", required: true },
  { key: "preIncubationReason", label: "Pre-Incubation Reason", dbKey: "pre_incubation_reason", required: true },
  { key: "heardAboutStartups", label: "Heard About Startups", dbKey: "heard_about_startups", required: true },
  { key: "heardAboutNirmaan", label: "Heard About Nirmaan", dbKey: "heard_about_nirmaan", required: true },
  { key: "problemSolving", label: "Problem Solving", dbKey: "problem_solving", required: true },
  { key: "yourSolution", label: "Your Solution", dbKey: "your_solution", required: true },
  { key: "solutionType", label: "Solution Type", dbKey: "solution_type", required: true },
  { key: "solutionTypeOther", label: "Solution Type (Other)", dbKey: "solution_type_other" },
  { key: "targetIndustry", label: "Target Industry", dbKey: "target_industry", required: true },
  { key: "otherIndustries", label: "Other Industries", dbKey: "other_industries", hint: "JSON array e.g. [\"Healthcare\"]" },
  { key: "industryOther", label: "Industry (Other)", dbKey: "industry_other" },
  { key: "otherIndustriesOther", label: "Other Industries (Other)", dbKey: "other_industries_other" },
  { key: "technologiesUtilized", label: "Technologies Utilized", dbKey: "technologies_utilized", hint: "JSON array e.g. [\"AI\",\"ML\"]" },
  { key: "otherTechnologyDetails", label: "Other Technology Details", dbKey: "other_technology_details" },
  { key: "startupStage", label: "Startup Stage", dbKey: "startup_stage", required: true },
  { key: "hasIntellectualProperty", label: "Has Intellectual Property?", dbKey: "has_intellectual_property", required: true, hint: "Yes or No" },
  { key: "hasPotentialIntellectualProperty", label: "Has Potential IP?", dbKey: "has_potential_intellectual_property", required: true, hint: "Yes or No" },
  { key: "nirmaanPresentationLink", label: "Nirmaan Presentation Link", dbKey: "nirmaan_presentation_link", required: true },
  { key: "hasProofOfConcept", label: "Has Proof of Concept?", dbKey: "has_proof_of_concept", required: true, hint: "Yes or No" },
  { key: "proofOfConceptDetails", label: "Proof of Concept Details", dbKey: "proof_of_concept_details" },
  { key: "hasPatentsOrPapers", label: "Has Patents/Papers?", dbKey: "has_patents_or_papers", required: true, hint: "Yes or No" },
  { key: "patentsOrPapersDetails", label: "Patents/Papers Details", dbKey: "patents_or_papers_details" },
  { key: "seedFundUtilizationPlan", label: "Seed Fund Utilization Plan", dbKey: "seed_fund_utilization_plan", required: true },
  { key: "pitchVideoLink", label: "Pitch Video Link", dbKey: "pitch_video_link", required: true },
  { key: "document1Link", label: "Document 1 Link", dbKey: "document1_link" },
  { key: "document2Link", label: "Document 2 Link", dbKey: "document2_link" },
];

/** Example team member JSON for template instructions */
export const TEAM_MEMBER_EXAMPLE = [
  {
    name: "John Doe",
    email: "john@example.com",
    rollNumber: "CE20B001",
    degree: "B.Tech",
    department: "CSE",
    college: "IIT Madras",
    yearOfGraduation: "2024",
    role: "Co-founder",
    contactNumber: "9876543210",
    isCoFounder: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    rollNumber: "",
    degree: "B.Tech",
    department: "ECE",
    college: "Other College",
    yearOfGraduation: "2024",
    role: "Team Member",
    contactNumber: "9876543211",
    isCoFounder: false,
  },
];
