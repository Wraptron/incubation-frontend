import type {
  FieldWidth,
  ProgramFormField,
  ProgramEvaluationCriteria,
} from "./types";

export function widthClass(width?: FieldWidth): string {
  switch (width) {
    case "half":
      return "col-span-12 sm:col-span-6";
    case "third":
      return "col-span-12 sm:col-span-4";
    case "full":
    default:
      return "col-span-12";
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "_")
    .replace(/^-+|-+$/g, "");
}

/** Build a unique slug from a label, avoiding collisions with `existing`. */
export function uniqueSlug(
  label: string,
  existing: Iterable<string>,
  fallback: string
): string {
  const used = new Set(existing);
  const base = slugify(label) || fallback;
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}_${n}`)) n += 1;
  return `${base}_${n}`;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Public applicant URL path segment for a published form. */
export function getPublicFormPath(publicSlug: string): string {
  return `/forms/${encodeURIComponent(publicSlug)}`;
}

/** Full public applicant URL (uses current origin in the browser). */
export function getPublicFormUrl(publicSlug: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${getPublicFormPath(publicSlug)}`;
}

export async function copyPublicFormLink(publicSlug: string): Promise<void> {
  const url = getPublicFormUrl(publicSlug);
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }
  throw new Error("Clipboard unavailable");
}

export function groupBySection<T extends { section: string; sort_order: number }>(
  items: T[]
): Array<{ section: string; items: T[] }> {
  const map = new Map<string, T[]>();
  const order: string[] = [];

  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
  for (const item of sorted) {
    const section = item.section || "General";
    if (!map.has(section)) {
      map.set(section, []);
      order.push(section);
    }
    map.get(section)!.push(item);
  }

  return order.map((section) => ({
    section,
    items: map.get(section)!,
  }));
}

export function uniqueSections(
  fields: ProgramFormField[],
  criteria: ProgramEvaluationCriteria[]
): string[] {
  const set = new Set<string>();
  for (const f of fields) set.add(f.section || "General");
  for (const c of criteria) set.add(c.section || "General");
  if (set.size === 0) set.add("General");
  return Array.from(set);
}

export function formatAnswer(
  field: ProgramFormField,
  value: unknown
): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** True when a stored answer looks like a downloadable URL for file/image fields. */
export function isAnswerFileUrl(field: ProgramFormField, value: unknown): value is string {
  if (field.field_type !== "file" && field.field_type !== "image") return false;
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

export function statusBadgeClass(status: string): string {
  switch (status) {
    case "draft":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200";
    case "published":
      return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200";
    case "archived":
      return "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200";
  }
}

export function applicationStatusBadgeClass(status: string): string {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200";
    case "under_review":
      return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200";
    case "evaluated":
      return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200";
    case "approved":
      return "border-primary/30 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200";
  }
}

export function applicantInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function answerString(
  answers: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const value = answers[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

/** Map a program application to dashboard-style table columns. */
export function applicationTableRow(app: {
  applicant_name: string;
  team_name: string | null;
  answers: Record<string, unknown>;
  field_schema?: Array<{ field_key: string; field_type: string }>;
}) {
  const answers = app.answers ?? {};
  const teamName =
    app.team_name ||
    answerString(answers, ["team_name", "company_name", "startup_name"]) ||
    app.applicant_name;

  const founderName =
    (app.team_name ? app.applicant_name : "") ||
    answerString(answers, [
      "founder_name",
      "full_name",
      "name",
      "applicant_name",
    ]) ||
    app.applicant_name;

  let email = answerString(answers, [
    "founder_email",
    "email",
    "applicant_email",
    "contact_email",
  ]);

  if (!email && app.field_schema) {
    for (const field of app.field_schema) {
      if (field.field_type !== "email") continue;
      const value = answers[field.field_key];
      if (typeof value === "string" && value.trim()) {
        email = value.trim();
        break;
      }
    }
  }

  return { teamName, founderName, email: email || "—" };
}
