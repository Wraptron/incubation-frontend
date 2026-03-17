import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import {
  APPLICATION_EXCEL_COLUMNS,
} from "@/lib/applicationFormFields";
import { supabaseServer } from "@/lib/supabaseServer";

/** Parse value from Excel cell */
function parseCellValue(val: unknown): string | number | null | unknown[] {
  if (val === undefined || val === null) return null;
  if (typeof val === "string") {
    const t = val.trim();
    if (t === "" || t.toUpperCase() === "NA" || t.toUpperCase() === "N/A")
      return null;
    return t;
  }
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  return String(val).trim() || null;
}

/** Parse JSON field from cell (teamMembers, facultyInvolved, etc.) */
function parseJsonField(val: unknown): unknown {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (!str || str.toUpperCase() === "NA" || str.toUpperCase() === "N/A")
    return "NA";
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed) && parsed.length === 0) return "NA";
    return parsed;
  } catch {
    return "NA";
  }
}

/** Parse array JSON field (otherIndustries, technologiesUtilized, externalFunding) */
function parseArrayField(val: unknown): unknown[] | null {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (!str || str === "[]") return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Normalize header for flexible matching (trim, lowercase, collapse spaces) */
function normalizeHeader(h: string): string {
  return String(h ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Common header aliases for flexible column matching */
const HEADER_ALIASES: Record<string, string[]> = {
  email: ["email", "e-mail", "email address"],
  teamName: ["team/company name", "team name", "company name", "company"],
  yourName: ["your name (founder)", "your name", "founder name", "founder"],
  teamMembers: ["team members", "members"],
};

/** Find column index for a column def, using exact match first then flexible aliases */
function findColumnIndex(
  headers: string[],
  colDef: { key: string; label: string }
): number {
  const idx = headers.indexOf(colDef.label);
  if (idx >= 0) return idx;
  const normalized = headers.map((h) => ({ raw: h, norm: normalizeHeader(h) }));
  const aliases = HEADER_ALIASES[colDef.key] ?? [normalizeHeader(colDef.label)];
  for (const alias of aliases) {
    const i = normalized.findIndex((h) => h.norm === alias);
    if (i >= 0) return i;
  }
  const labelNorm = normalizeHeader(colDef.label);
  const i = normalized.findIndex((h) => h.norm === labelNorm);
  return i >= 0 ? i : -1;
}

/** Fix common JSON issues: double-quote typo, concatenated arrays, Excel newlines */
function tryFixTeamMembersJson(str: string): string {
  let s = str.replace(/^\uFEFF/, "");
  // Excel inserts literal newlines in cells (e.g. after emails) - these break JSON parsing
  s = s.replace(/\r\n/g, " ").replace(/\n/g, " ").replace(/\r/g, " ");
  s = s.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');
  s = s.replace(/,""/g, ',"');
  s = s.replace(/\{""/g, '{"');
  s = s.replace(/\}\s*\]\s*\[\s*\{/g, "},{");
  s = s.replace(/\]\s*\[\s*\{/g, ",{");
  return s;
}

/** Parse team members - accepts JSON array or comma-separated names as fallback */
function parseTeamMembers(val: unknown): unknown[] | null {
  const str = String(val ?? "").trim();
  if (!str || str.toUpperCase() === "NA" || str.toUpperCase() === "N/A") return null;
  let parsed: unknown = null;
  const fixed = tryFixTeamMembersJson(str);
  try {
    parsed = JSON.parse(fixed);
  } catch {
    try {
      parsed = JSON.parse(str);
    } catch {
      parsed = null;
    }
  }
  if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return [parsed];
  if (str.includes("[") || str.includes("{") || str.includes('"')) return null;
  const parts = str.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  return parts.map((name) => ({ name, email: "", role: "Team Member", isCoFounder: false }));
}

/** Team member column headers (alternative format: one row per JSON fragment) */
const TEAM_MEMBER_ROW_HEADERS = ["name", "roll number", "email", "degree", "department", "college", "year of graduation", "role", "contact number"];

/** Check if this is the "team member rows" format - JSON split across rows in first column */
function isTeamMemberRowsFormat(headers: string[]): boolean {
  const firstNorm = normalizeHeader(String(headers[0] ?? ""));
  const hasName = firstNorm === "name";
  const hasTeamMemberCol = TEAM_MEMBER_ROW_HEADERS.some((h) =>
    headers.some((hh) => normalizeHeader(hh) === h)
  );
  return hasName && hasTeamMemberCol;
}

/** Check if first cell looks like a JSON fragment (key-value or array start) */
function isJsonFragment(val: unknown): boolean {
  const s = String(val ?? "").trim();
  return (s.startsWith("[") || s.startsWith("{") || s.startsWith('"')) && (s.includes(":") || s.includes("}"));
}

/** Parse team member rows format: JSON split across rows, reconstruct and return applications */
function parseTeamMemberRowsFormat(
  headers: string[],
  dataRows: unknown[][]
): { applications: { app: Record<string, unknown>; excelRow: number }[]; errors: { row: number; message: string }[] } {
  const applications: { app: Record<string, unknown>; excelRow: number }[] = [];
  const errors: { row: number; message: string }[] = [];
  const firstColIdx = 0;

  let currentFragments: string[] = [];
  let groupStartRow = 0;

  for (let i = 0; i < dataRows.length; i++) {
    const rowArr = dataRows[i];
    const firstCell = rowArr[firstColIdx];
    const cellStr = String(firstCell ?? "").trim();

    if (cellStr.startsWith("[") || (cellStr.startsWith("{") && currentFragments.length === 0)) {
      if (currentFragments.length > 0) {
        const joined = currentFragments.join(",");
        const teamMembers = parseTeamMembers(joined);
        if (teamMembers && teamMembers.length > 0) {
          const app = buildAppFromTeamMembers(teamMembers, groupStartRow + 2);
          applications.push({ app, excelRow: groupStartRow + 2 });
        } else {
          errors.push({ row: groupStartRow + 2, message: "Could not parse team members JSON from rows" });
        }
      }
      currentFragments = [cellStr];
      groupStartRow = i;
    } else if (isJsonFragment(firstCell) || (currentFragments.length > 0 && cellStr)) {
      currentFragments.push(cellStr);
    } else if (currentFragments.length > 0 && !cellStr) {
      const joined = currentFragments.join(",");
      const teamMembers = parseTeamMembers(joined);
      if (teamMembers && teamMembers.length > 0) {
        const app = buildAppFromTeamMembers(teamMembers, groupStartRow + 2);
        applications.push({ app, excelRow: groupStartRow + 2 });
      } else {
        errors.push({ row: groupStartRow + 2, message: "Could not parse team members JSON from rows" });
      }
      currentFragments = [];
    }
  }

  if (currentFragments.length > 0) {
    const joined = currentFragments.join(",");
    const teamMembers = parseTeamMembers(joined);
    if (teamMembers && teamMembers.length > 0) {
      const app = buildAppFromTeamMembers(teamMembers, groupStartRow + 2);
      applications.push({ app, excelRow: groupStartRow + 2 });
    } else {
      errors.push({ row: groupStartRow + 2, message: "Could not parse team members JSON from rows" });
    }
  }

  return { applications, errors };
}

/** Build application payload from team members (for team-member-rows format) */
function buildAppFromTeamMembers(teamMembers: unknown[], _excelRow: number): Record<string, unknown> {
  const first = Array.isArray(teamMembers) && teamMembers.length > 0 ? teamMembers[0] : null;
  const firstObj = first && typeof first === "object" && first !== null ? (first as Record<string, unknown>) : {};
  const emailRaw = String(firstObj.email ?? "").trim();
  const email = emailRaw && emailRaw.includes("@") ? emailRaw : "imported@example.com";
  const name = String(firstObj.name ?? "Imported").trim();
  const yesNo = (v: unknown) => (String(v).trim().toLowerCase() === "yes" ? "Yes" : "No");
  return {
    email: email.includes("@") ? email : "imported@example.com",
    team_name: `${name} Team`,
    your_name: name,
    is_iitm: "Yes",
    roll_number: String(firstObj.rollNumber ?? "N/A"),
    college_name: firstObj.college ? String(firstObj.college) : null,
    current_occupation: null,
    phone_number: String(firstObj.contactNumber ?? "N/A"),
    channel: "N/A",
    channel_other: null,
    co_founders_count: Math.max(0, teamMembers.length - 1),
    faculty_involved: "NA",
    prior_entrepreneurship_experience: "No",
    team_prior_entrepreneurship_experience: "No",
    prior_experience_details: null,
    mca_registered: "No",
    dpiit_details: null,
    external_funding: null,
    currently_incubated: null,
    team_members: teamMembers,
    nirmaan_can_help: "N/A",
    pre_incubation_reason: "N/A",
    heard_about_startups: "N/A",
    heard_about_nirmaan: "N/A",
    problem_solving: "N/A",
    your_solution: "N/A",
    solution_type: "N/A",
    solution_type_other: null,
    target_industry: "N/A",
    other_industries: [],
    industry_other: null,
    other_industries_other: null,
    technologies_utilized: [],
    other_technology_details: null,
    startup_stage: "N/A",
    has_intellectual_property: "No",
    has_potential_intellectual_property: "No",
    ip_file_link: null,
    potential_ip_file_link: null,
    nirmaan_presentation_link: "N/A",
    has_proof_of_concept: "No",
    proof_of_concept_details: null,
    has_patents_or_papers: "No",
    patents_or_papers_details: null,
    seed_fund_utilization_plan: "N/A",
    pitch_video_link: "N/A",
    document1_link: null,
    document2_link: null,
    status: "pending",
  };
}

/** Map Excel row to application insert payload. Returns { app, error } - error is specific message if validation fails. */
function rowToApplication(
  row: Record<string, unknown>,
  headers: string[]
): { app: Record<string, unknown> } | { error: string } {
  const keyToCol = APPLICATION_EXCEL_COLUMNS.reduce(
    (acc, c) => {
      const idx = findColumnIndex(headers, c);
      if (idx >= 0) acc[c.key] = idx;
      return acc;
    },
    {} as Record<string, number>
  );

  const get = (key: string) => {
    const idx = keyToCol[key];
    if (idx === undefined) return null;
    const raw = row[headers[idx]];
    return parseCellValue(raw);
  };

  const email = get("email");
  const teamName = get("teamName");
  const yourName = get("yourName");
  const missing: string[] = [];
  if (!email) missing.push("email");
  if (!teamName) missing.push("team name");
  if (!yourName) missing.push("your name");
  if (missing.length > 0) {
    return { error: `Missing required: ${missing.join(", ")}` };
  }

  let facultyInvolved = parseJsonField(get("facultyInvolved"));
  if (Array.isArray(facultyInvolved) && facultyInvolved.length === 0)
    facultyInvolved = "NA";

  let teamMembers = parseTeamMembers(get("teamMembers"));
  if (!teamMembers || teamMembers.length === 0) {
    return { error: "Team members must be a JSON array (e.g. [{\"name\":\"...\",\"email\":\"...\"}]) or comma-separated names" };
  }

  let externalFunding = parseArrayField(get("externalFunding"));
  if (externalFunding && externalFunding.length === 0) externalFunding = null;

  const yesNo = (v: unknown) =>
    String(v).trim().toLowerCase() === "yes" ? "Yes" : "No";

  const app: Record<string, unknown> = {
    email: String(email),
    team_name: String(teamName),
    your_name: String(yourName),
    is_iitm: yesNo(get("isIITM")),
    roll_number: String(get("rollNumber") ?? "N/A"),
    college_name: get("collegeName") ? String(get("collegeName")) : null,
    current_occupation: get("currentOccupation")
      ? String(get("currentOccupation"))
      : null,
    phone_number: String(get("phoneNumber") ?? "N/A"),
    channel: String(get("channel") ?? "N/A"),
    channel_other: get("channelOther") ? String(get("channelOther")) : null,
    co_founders_count: Math.max(
      0,
      parseInt(String(get("coFoundersCount") ?? "0"), 10) || 0
    ),
    faculty_involved: facultyInvolved,
    prior_entrepreneurship_experience: yesNo(
      get("priorEntrepreneurshipExperience")
    ),
    team_prior_entrepreneurship_experience: yesNo(
      get("teamPriorEntrepreneurshipExperience")
    ),
    prior_experience_details: get("priorExperienceDetails")
      ? String(get("priorExperienceDetails"))
      : null,
    mca_registered: yesNo(get("mcaRegistered")),
    dpiit_details: get("dpiitDetails") ? String(get("dpiitDetails")) : null,
    external_funding: externalFunding,
    currently_incubated: get("currentlyIncubated")
      ? String(get("currentlyIncubated"))
      : null,
    team_members: teamMembers,
    nirmaan_can_help: String(get("nirmaanCanHelp") ?? "N/A"),
    pre_incubation_reason: String(get("preIncubationReason") ?? "N/A"),
    heard_about_startups: String(get("heardAboutStartups") ?? "N/A"),
    heard_about_nirmaan: String(get("heardAboutNirmaan") ?? "N/A"),
    problem_solving: String(get("problemSolving") ?? "N/A"),
    your_solution: String(get("yourSolution") ?? "N/A"),
    solution_type: String(get("solutionType") ?? "N/A"),
    solution_type_other: get("solutionTypeOther")
      ? String(get("solutionTypeOther"))
      : null,
    target_industry: String(get("targetIndustry") ?? "N/A"),
    other_industries: parseArrayField(get("otherIndustries")) ?? [],
    industry_other: get("industryOther") ? String(get("industryOther")) : null,
    other_industries_other: get("otherIndustriesOther")
      ? String(get("otherIndustriesOther"))
      : null,
    technologies_utilized: parseArrayField(get("technologiesUtilized")) ?? [],
    other_technology_details: get("otherTechnologyDetails")
      ? String(get("otherTechnologyDetails"))
      : null,
    startup_stage: String(get("startupStage") ?? "N/A"),
    has_intellectual_property: yesNo(get("hasIntellectualProperty")),
    has_potential_intellectual_property: yesNo(
      get("hasPotentialIntellectualProperty")
    ),
    ip_file_link: null,
    potential_ip_file_link: null,
    nirmaan_presentation_link: String(
      get("nirmaanPresentationLink") ?? "N/A"
    ),
    has_proof_of_concept: yesNo(get("hasProofOfConcept")),
    proof_of_concept_details: get("proofOfConceptDetails")
      ? String(get("proofOfConceptDetails"))
      : null,
    has_patents_or_papers: yesNo(get("hasPatentsOrPapers")),
    patents_or_papers_details: get("patentsOrPapersDetails")
      ? String(get("patentsOrPapersDetails"))
      : null,
    seed_fund_utilization_plan: String(
      get("seedFundUtilizationPlan") ?? "N/A"
    ),
    pitch_video_link: String(get("pitchVideoLink") ?? "N/A"),
    document1_link: get("document1Link") ? String(get("document1Link")) : null,
    document2_link: get("document2Link") ? String(get("document2Link")) : null,
    status: "pending",
  };
  return { app };
}

/**
 * POST /api/applications/import
 * Accepts Excel file, parses rows, inserts applications into DB.
 * Manager-only - caller should verify role.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "";
    if (supabaseUrl && supabaseAnonKey && token) {
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
        if (profile?.role !== "manager") {
          return NextResponse.json(
            { error: "Only managers can import applications" },
            { status: 403 }
          );
        }
      }
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Please upload an Excel file." },
        { status: 400 }
      );
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      return NextResponse.json(
        { error: "Invalid file type. Please upload .xlsx or .xls file." },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "buffer" });
    const sheetName = wb.SheetNames.find(
      (n) => n.toLowerCase() !== "instructions"
    );
    if (!sheetName) {
      return NextResponse.json(
        { error: "No data sheet found in the Excel file." },
        { status: 400 }
      );
    }
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      defval: "",
    }) as unknown[][];

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "Excel file must have a header row and at least one data row." },
        { status: 400 }
      );
    }

    const headers = (rows[0] as unknown[]).map((h) => String(h ?? ""));
    const dataRows = rows.slice(1) as unknown[][];

    let applications: { app: Record<string, unknown>; excelRow: number }[] = [];
    let errors: { row: number; message: string }[] = [];

    if (isTeamMemberRowsFormat(headers)) {
      const result = parseTeamMemberRowsFormat(headers, dataRows);
      applications = result.applications;
      errors = result.errors;
    } else {
      for (let i = 0; i < dataRows.length; i++) {
        const rowArr = dataRows[i];
        const row: Record<string, unknown> = {};
        headers.forEach((h, j) => {
          row[h] = rowArr[j];
        });
        const result = rowToApplication(row, headers);
        if ("app" in result) {
          applications.push({ app: result.app, excelRow: i + 2 });
        } else {
          const firstCell = rowArr[0];
          if (firstCell !== undefined && firstCell !== null && String(firstCell).trim() !== "") {
            errors.push({
              row: i + 2,
              message: result.error,
            });
          }
        }
      }
    }

    if (applications.length === 0) {
      return NextResponse.json(
        {
          error: "No valid applications to import",
          details: errors,
        },
        { status: 400 }
      );
    }

    const inserted: string[] = [];
    const insertErrors: { row: number; message: string }[] = [];

    for (let i = 0; i < applications.length; i++) {
      const { app, excelRow } = applications[i];
      const { data, error } = await supabaseServer
        .from("new_application")
        .insert(app)
        .select("id")
        .single();

      if (error) {
        insertErrors.push({
          row: excelRow,
          message: error.message,
        });
      } else if (data?.id) {
        inserted.push(data.id);
      }
    }

    return NextResponse.json({
      message: `Successfully imported ${inserted.length} application(s)`,
      imported: inserted.length,
      totalRows: dataRows.length,
      skipped: dataRows.length - applications.length,
      errors: errors.length > 0 ? errors : undefined,
      insertErrors: insertErrors.length > 0 ? insertErrors : undefined,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import applications" },
      { status: 500 }
    );
  }
}
