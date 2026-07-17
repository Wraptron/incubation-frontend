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
