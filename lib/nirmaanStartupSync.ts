/**
 * Build Nirmaan sync payload and POST to APP_Y (Nirmaan backend).
 * Mirrors incubation-backend `src/routes/applications.ts` so approve/reject
 * can run from Next API routes without a second hop to the Express server.
 */

type TeamMemberRow = Record<string, unknown>;

function trimTrailingSlash(input: string): string {
  return input.replace(/\/+$/, "");
}

function resolveNirmaanSyncUrl(): { url: string | null; error?: string } {
  const rawBase =
    process.env.APP_Y_API_URL?.trim() ||
    process.env.NIRMAAN_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_Y_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_NIRMAAN_API_URL?.trim() ||
    "";

    console.log(rawBase)

  if (!rawBase) {
    return {
      url: null,
      error:
        "Missing Nirmaan API base URL. Set APP_Y_API_URL (or NIRMAAN_API_URL).",
    };
  }

  const normalized = trimTrailingSlash(rawBase);
  // Support all common styles:
  // - https://host
  // - https://host/api/v1
  // - https://host/api/v1/sync/startup
  // - https://host/sync/startup
  let url: string;
  if (/\/api\/v1\/sync\/startup$/i.test(normalized)) {
    url = normalized;
  } else if (/\/sync\/startup$/i.test(normalized)) {
    url = normalized;
  } else if (/\/api\/v1$/i.test(normalized)) {
    url = `${normalized}/sync/startup`;
  } else {
    url = `${normalized}/api/v1/sync/startup`;
  }

  try {
    // Validate URL early so production misconfig is surfaced clearly.
    // eslint-disable-next-line no-new
    new URL(url);
  } catch {
    return {
      url: null,
      error: `Invalid Nirmaan API URL: ${rawBase}`,
    };
  }

  return { url };
}

function strField(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

function parseTeamMembersFromApplication(raw: unknown): TeamMemberRow[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as TeamMemberRow[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as TeamMemberRow[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function isCoFounderMember(m: TeamMemberRow): boolean {
  return m.isCoFounder === true || m.is_co_founder === true;
}

function findFounderTeamMember(
  members: TeamMemberRow[],
  founderName: string,
  founderEmail: string,
): TeamMemberRow | null {
  if (members.length === 0) return null;
  const nameNorm = founderName.trim().toLowerCase();
  const emailNorm = founderEmail.trim().toLowerCase();

  if (emailNorm) {
    const byEmail = members.find(
      (m) => strField(m.email).toLowerCase() === emailNorm,
    );
    if (byEmail) return byEmail;
  }
  if (nameNorm) {
    const byName = members.find(
      (m) => strField(m.name).toLowerCase() === nameNorm,
    );
    if (byName) return byName;
  }
  const founderRole = members.find(
    (m) => !isCoFounderMember(m) && /founder/i.test(strField(m.role)),
  );
  if (founderRole) return founderRole;

  const nonCo = members.filter((m) => !isCoFounderMember(m));
  if (nonCo.length >= 1) return nonCo[0];

  return members[0];
}

function academicBackgroundFromFounderTeamMember(
  application: Record<string, unknown>,
): string {
  const members = parseTeamMembersFromApplication(application.team_members);
  const founderName = strField(application.your_name || application.founder_name);
  const founderEmail = strField(application.email);
  const row = findFounderTeamMember(members, founderName, founderEmail);
  if (!row) return "N/A";

  const degree = strField(row.degree ?? row.Degree);
  const department = strField(row.department ?? row.Department);
  const parts = [degree, department].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "N/A";
}

function parseFacultyInvolvedRows(raw: unknown): TeamMemberRow[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t || /^na$/i.test(t) || /^n\/a$/i.test(t)) return [];
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as TeamMemberRow[]) : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return raw as TeamMemberRow[];
  return [];
}

/** Nirmaan `official.role_of_faculty`: faculty name + role in startup only. */
function roleOfFacultyFromIncubation(application: Record<string, unknown>): string {
  const rows = parseFacultyInvolvedRows(application.faculty_involved);
  if (rows.length === 0) return "N/A";

  const parts: string[] = [];
  for (const row of rows) {
    const name = strField(row.name ?? row.Name);
    const roleInStartup = strField(
      row.roleInStartup ?? row.role_in_startup ?? row.role_in_their_startup,
    );
    if (!name && !roleInStartup) continue;
    if (name && roleInStartup) parts.push(`${name} — ${roleInStartup}`);
    else if (name) parts.push(name);
    else parts.push(roleInStartup);
  }
  return parts.length > 0 ? parts.join("; ") : "N/A";
}

export function buildNirmaanStartupPayloadFromApplication(
  application: Record<string, unknown>,
) {
  const teamName =
    (application.team_name as string) ||
    (application.company_name as string) ||
    "Unnamed team";
  const founderName =
    (application.your_name as string) ||
    (application.founder_name as string) ||
    "Founder";
  const founderEmail = (application.email as string) || "";
  const founderPhone =
    (application.phone_number as string) ||
    (application.phone as string) ||
    "";

  return {
    basic: {
      startup_name: teamName,
      startup_sector: "N/A",
      startup_domain: "N/A",
      startup_type: "N/A",
      startup_industry: (application.target_industry as string) || "N/A",
      startup_technology:
        (application.solution_type as string) ||
        (application.solution_type_other as string) ||
        "N/A",
      program: "Pratham",
      startup_Community: "N/A",
      startup_cohort: "Apr' 26",
    },
    official: {
      official_contact_number: founderPhone || "N/A",
      official_email_address: founderEmail,
      website_link: (application.website as string) || "N/A",
      linkedin_id: (application.linkedin as string) || "N/A",
      role_of_faculty: roleOfFacultyFromIncubation(application),
      mentor_associated: "N/A",
      registration_number:"N/A",
      dpiit_number: (application.dpiit_details as string) || "N/A",
      funding_stage: (application.funding_stage as string) || "N/A",
      official_registered: "N/A",
      pia_state: "Not signed",
      scheme: "N/A",
    },
    founder: {
      founder_name: founderName,
      founder_email: founderEmail,
      founder_number: founderPhone || "N/A",
      founder_gender: "N/A",
      founder_student_id: (application.roll_number as string) || "N/A",
      academic_background: academicBackgroundFromFounderTeamMember(application),
      linkedInid: (application.linkedin as string) || "N/A",
    },
    description: {
      logo: "N/A",
      startup_description: "",
    },
  };
}

export async function syncApprovedApplicationToNirmaan(
  application: Record<string, unknown>,
): Promise<{ success: boolean; error?: string }> {
  const { url: syncUrl, error: syncUrlError } = resolveNirmaanSyncUrl();
  if (!syncUrl) {
    return {
      success: false,
      error: syncUrlError,
    };
  }

  const founderEmail = ((application.email as string) || "").trim();
  if (!founderEmail) {
    return { success: false, error: "Application founder email is missing" };
  }

  const payload = buildNirmaanStartupPayloadFromApplication(application);
  const secret = process.env.APP_Y_API_SECRET?.trim();
  let response: Response;
  try {
    response = await fetch(syncUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret
          ? {
              "x-api-key": secret,
              "x-app-secret": secret,
              Authorization: `Bearer ${secret}`,
            }
          : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: `Failed to reach Nirmaan API (${syncUrl}): ${err.message}`,
    };
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      success: false,
      error:
        (data as { error?: string; message?: string }).error ||
        (data as { error?: string; message?: string }).message ||
        `Failed to sync startup to Nirmaan app (HTTP ${response.status})`,
    };
  }

  return { success: true };
}
