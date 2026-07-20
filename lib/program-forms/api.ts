import { backendUrl } from "@/lib/config";
import type {
  AssignableUser,
  EvaluationScore,
  ProgramApplication,
  ProgramEvaluation,
  ProgramEvaluationCriteria,
  ProgramForm,
  ProgramFormField,
} from "./types";
import { generateId, uniqueSlug } from "./utils";

/**
 * Frontend API for program forms.
 * Most CRUD stays on the in-memory mock (USE_MOCK).
 * publishForm and submitApplication call the Express backend directly.
 */
const USE_MOCK = true;

const programFormsUrl = (path: string) =>
  `${backendUrl.replace(/\/$/, "")}/api/program-forms${path}`;

const now = () => new Date().toISOString();

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

let mockForms: ProgramForm[] = [
  {
    id: "form_demo_1",
    title: "Demo Program Application",
    status: "draft",
    version: 1,
    response_count: 0,
    public_slug: null,
    created_at: now(),
    updated_at: now(),
    fields: [
      {
        id: "field_1",
        form_id: "form_demo_1",
        field_key: "team_name",
        label: "Team Name",
        help_text: "Official name of your startup team",
        placeholder: "Acme Labs",
        field_type: "text",
        required: true,
        options: null,
        validation: null,
        conditional: null,
        sort_order: 0,
        section: "Basics",
        width: "full",
        key_locked: true,
      },
      {
        id: "field_2",
        form_id: "form_demo_1",
        field_key: "founder_email",
        label: "Founder Email",
        help_text: null,
        placeholder: "you@example.com",
        field_type: "email",
        required: true,
        options: null,
        validation: null,
        conditional: null,
        sort_order: 1,
        section: "Basics",
        width: "half",
        key_locked: true,
      },
      {
        id: "field_3",
        form_id: "form_demo_1",
        field_key: "stage",
        label: "Current Stage",
        help_text: null,
        placeholder: null,
        field_type: "select",
        required: true,
        options: [
          { label: "Idea", value: "idea" },
          { label: "MVP", value: "mvp" },
          { label: "Revenue", value: "revenue" },
        ],
        validation: null,
        conditional: null,
        sort_order: 2,
        section: "Basics",
        width: "half",
        key_locked: true,
      },
    ],
    criteria: [
      {
        id: "crit_1",
        form_id: "form_demo_1",
        criteria_key: "problem_clarity",
        label: "How clear is the problem statement?",
        description: "Rank how clearly the problem is articulated.",
        criteria_type: "rating_scale",
        scale_min: 0,
        scale_max: 10,
        weight: 1,
        required: true,
        sort_order: 0,
        section: "General",
        key_locked: true,
      },
      {
        id: "crit_2",
        form_id: "form_demo_1",
        criteria_key: "market_size",
        label: "How strong is the market opportunity?",
        description: "Rank market size and potential.",
        criteria_type: "rating_scale",
        scale_min: 0,
        scale_max: 10,
        weight: 1,
        required: true,
        sort_order: 1,
        section: "General",
        key_locked: true,
      },
      {
        id: "crit_3",
        form_id: "form_demo_1",
        criteria_key: "team_strength",
        label: "How strong is the founding team?",
        description: "Rank team capability and fit.",
        criteria_type: "rating_scale",
        scale_min: 0,
        scale_max: 10,
        weight: 1,
        required: true,
        sort_order: 2,
        section: "General",
        key_locked: true,
      },
    ],
  },
];

let mockApplications: ProgramApplication[] = [
  {
    id: "app_demo_1",
    form_id: "form_demo_1",
    form_version: 1,
    applicant_name: "Ada Lovelace",
    team_name: "Analytical Engines",
    status: "pending",
    answers: {
      team_name: "Analytical Engines",
      founder_email: "ada@example.com",
      stage: "mvp",
    },
    reviewers: [],
    avg_score: null,
    submitted_at: now(),
    field_schema: [],
    criteria_schema: [],
  },
];

const mockEvaluations = new Map<string, ProgramEvaluation>();

const mockUsers: AssignableUser[] = [
  { id: "user_r1", full_name: "Riya Sharma", email: "riya@example.com", role: "reviewer" },
  { id: "user_r2", full_name: "Arjun Mehta", email: "arjun@example.com", role: "reviewer" },
  { id: "user_r3", full_name: "Priya Nair", email: "priya@example.com", role: "reviewer" },
  { id: "user_m1", full_name: "Karan Singh", email: "karan@example.com", role: "manager" },
];

function delay(ms = 120): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function findForm(id: string): ProgramForm {
  const form = mockForms.find((f) => f.id === id);
  if (!form) throw new Error("Form not found");
  return form;
}

function attachSchemas(app: ProgramApplication): ProgramApplication {
  const form = mockForms.find((f) => f.id === app.form_id);
  return {
    ...deepClone(app),
    field_schema: form ? deepClone(form.fields) : [],
    criteria_schema: form ? deepClone(form.criteria) : [],
  };
}

// ── Forms ──────────────────────────────────────────────────────────────────

export async function getForms(): Promise<ProgramForm[]> {
  await delay();
  if (!USE_MOCK) throw new Error("Live API not wired yet");
  return deepClone(mockForms);
}

export async function createForm(): Promise<ProgramForm> {
  await delay();
  const id = generateId("form");
  const form: ProgramForm = {
    id,
    title: "Untitled Program Form",
    status: "draft",
    version: 1,
    response_count: 0,
    public_slug: null,
    created_at: now(),
    updated_at: now(),
    fields: [],
    criteria: [],
  };
  mockForms = [form, ...mockForms];
  return deepClone(form);
}

export async function getForm(id: string): Promise<ProgramForm> {
  await delay();
  return deepClone(findForm(id));
}

export async function updateForm(
  id: string,
  data: Partial<Pick<ProgramForm, "title" | "status" | "public_slug">>
): Promise<ProgramForm> {
  await delay();
  const form = findForm(id);
  Object.assign(form, data, { updated_at: now() });
  return deepClone(form);
}

export async function publishForm(id: string): Promise<ProgramForm> {
  // Real Supabase publish path (dynamic table creation + freeze).
  // Mock drafts use non-UUID ids — send the full snapshot so the API can persist them.
  const form = findForm(id);
  const res = await fetch(programFormsUrl(`/${id}/publish`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: form.title,
      public_slug: form.public_slug,
      fields: form.fields,
      criteria: form.criteria,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Failed to publish form"
    );
  }

  const published = body as ProgramForm;
  // Remap in-memory mock id → real UUID returned by Supabase
  mockForms = mockForms.map((f) => (f.id === id ? deepClone(published) : f));
  mockApplications = mockApplications.map((a) =>
    a.form_id === id ? { ...a, form_id: published.id } : a
  );
  return deepClone(published);
}

/**
 * Submit an application to a published form (dual-write to dynamic table + registry).
 * Use FormData when uploading file/image fields; otherwise JSON is fine.
 */
export async function submitApplication(
  formId: string,
  payload:
    | {
        answers: Record<string, unknown>;
        applicant_name?: string;
        team_name?: string | null;
      }
    | FormData
): Promise<ProgramApplication> {
  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;
  const res = await fetch(programFormsUrl(`/${formId}/applications`), {
    method: "POST",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? payload : JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Failed to submit application"
    );
  }
  return body as ProgramApplication;
}

export async function duplicateForm(id: string): Promise<ProgramForm> {
  await delay();
  const source = findForm(id);
  const newId = generateId("form");
  const copy: ProgramForm = {
    ...deepClone(source),
    id: newId,
    title: `${source.title} (Copy)`,
    status: "draft",
    version: 1,
    response_count: 0,
    public_slug: null,
    created_at: now(),
    updated_at: now(),
    fields: source.fields.map((f, i) => ({
      ...deepClone(f),
      id: generateId("field"),
      form_id: newId,
      sort_order: i,
    })),
    criteria: source.criteria.map((c, i) => ({
      ...deepClone(c),
      id: generateId("crit"),
      form_id: newId,
      sort_order: i,
    })),
  };
  mockForms = [copy, ...mockForms];
  return deepClone(copy);
}

export async function archiveForm(id: string): Promise<ProgramForm> {
  await delay();
  const form = findForm(id);
  form.status = "archived";
  form.updated_at = now();
  return deepClone(form);
}

// ── Fields ─────────────────────────────────────────────────────────────────

export async function addField(
  formId: string,
  field: Partial<ProgramFormField>
): Promise<ProgramFormField> {
  await delay();
  const form = findForm(formId);
  assertDraft(form);
  const label = field.label || "New Field";
  const fieldKey =
    field.field_key ||
    uniqueSlug(
      label,
      form.fields.map((f) => f.field_key),
      `field_${form.fields.length + 1}`
    );
  const next: ProgramFormField = {
    id: generateId("field"),
    form_id: formId,
    field_key: fieldKey,
    label,
    help_text: field.help_text ?? null,
    placeholder: field.placeholder ?? null,
    field_type: field.field_type || "text",
    required: field.required ?? false,
    options: field.options ?? null,
    validation: field.validation ?? null,
    conditional: field.conditional ?? null,
    sort_order: field.sort_order ?? form.fields.length,
    section: field.section || "General",
    width: field.width ?? "full",
    // Label chosen at create time — lock key so later renames don't break columns.
    key_locked: field.key_locked ?? true,
  };
  form.fields.push(next);
  form.updated_at = now();
  return deepClone(next);
}

export async function updateField(
  formId: string,
  fieldId: string,
  data: Partial<ProgramFormField>
): Promise<ProgramFormField> {
  await delay();
  const form = findForm(formId);
  assertDraft(form);
  const idx = form.fields.findIndex((f) => f.id === fieldId);
  if (idx < 0) throw new Error("Field not found");
  form.fields[idx] = { ...form.fields[idx], ...data, id: fieldId, form_id: formId };
  form.updated_at = now();
  return deepClone(form.fields[idx]);
}

export async function deleteField(formId: string, fieldId: string): Promise<void> {
  await delay();
  const form = findForm(formId);
  assertDraft(form);
  form.fields = form.fields.filter((f) => f.id !== fieldId);
  form.fields.forEach((f, i) => {
    f.sort_order = i;
  });
  form.updated_at = now();
}

export async function reorderFields(
  formId: string,
  orderedFieldIds: string[]
): Promise<ProgramFormField[]> {
  await delay();
  const form = findForm(formId);
  assertDraft(form);
  const byId = new Map(form.fields.map((f) => [f.id, f]));
  form.fields = orderedFieldIds
    .map((id, i) => {
      const f = byId.get(id);
      if (!f) return null;
      f.sort_order = i;
      return f;
    })
    .filter((f): f is ProgramFormField => f !== null);
  form.updated_at = now();
  return deepClone(form.fields);
}

// ── Criteria ───────────────────────────────────────────────────────────────

export async function addCriteria(
  formId: string,
  criteria: Partial<ProgramEvaluationCriteria>
): Promise<ProgramEvaluationCriteria> {
  await delay();
  const form = findForm(formId);
  assertDraft(form);
  const label = criteria.label || "New Question";
  const criteriaKey =
    criteria.criteria_key ||
    uniqueSlug(
      label,
      form.criteria.map((c) => c.criteria_key),
      `criteria_${form.criteria.length + 1}`
    );
  const next: ProgramEvaluationCriteria = {
    id: generateId("crit"),
    form_id: formId,
    criteria_key: criteriaKey,
    label,
    description: criteria.description ?? null,
    criteria_type: "rating_scale",
    scale_min: 0,
    scale_max: 10,
    weight: 1,
    required: criteria.required ?? true,
    sort_order: criteria.sort_order ?? form.criteria.length,
    section: criteria.section || "General",
    key_locked: criteria.key_locked ?? true,
  };
  form.criteria.push(next);
  form.updated_at = now();
  return deepClone(next);
}

export async function updateCriteria(
  formId: string,
  criteriaId: string,
  data: Partial<ProgramEvaluationCriteria>
): Promise<ProgramEvaluationCriteria> {
  await delay();
  const form = findForm(formId);
  assertDraft(form);
  const idx = form.criteria.findIndex((c) => c.id === criteriaId);
  if (idx < 0) throw new Error("Criteria not found");
  form.criteria[idx] = {
    ...form.criteria[idx],
    ...data,
    criteria_type: "rating_scale",
    scale_min: 0,
    scale_max: 10,
    weight: 1,
    id: criteriaId,
    form_id: formId,
  };
  form.updated_at = now();
  return deepClone(form.criteria[idx]);
}

export async function deleteCriteria(formId: string, criteriaId: string): Promise<void> {
  await delay();
  const form = findForm(formId);
  assertDraft(form);
  form.criteria = form.criteria.filter((c) => c.id !== criteriaId);
  form.criteria.forEach((c, i) => {
    c.sort_order = i;
  });
  form.updated_at = now();
}

export async function reorderCriteria(
  formId: string,
  orderedCriteriaIds: string[]
): Promise<ProgramEvaluationCriteria[]> {
  await delay();
  const form = findForm(formId);
  assertDraft(form);
  const byId = new Map(form.criteria.map((c) => [c.id, c]));
  form.criteria = orderedCriteriaIds
    .map((id, i) => {
      const c = byId.get(id);
      if (!c) return null;
      c.sort_order = i;
      return c;
    })
    .filter((c): c is ProgramEvaluationCriteria => c !== null);
  form.updated_at = now();
  return deepClone(form.criteria);
}

// ── Applications / evaluations ─────────────────────────────────────────────

export async function getApplications(formId: string): Promise<ProgramApplication[]> {
  const res = await fetch(programFormsUrl(`/${formId}/applications`));
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof body.error === "string"
        ? body.error
        : "Failed to load applications"
    );
  }
  return body as ProgramApplication[];
}

export async function getApplication(appId: string): Promise<ProgramApplication> {
  const res = await fetch(programFormsUrl(`/applications/${appId}`));
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Application not found"
    );
  }
  return body as ProgramApplication;
}

export async function assignReviewer(
  appId: string,
  reviewerId: string
): Promise<ProgramApplication> {
  await delay();
  const app = mockApplications.find((a) => a.id === appId);
  if (!app) throw new Error("Application not found");
  const user = mockUsers.find((u) => u.id === reviewerId);
  if (!user) throw new Error("User not found");
  if (!app.reviewers.some((r) => r.id === reviewerId)) {
    app.reviewers.push({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    });
  }
  return attachSchemas(app);
}

export async function getAssignableUsers(): Promise<AssignableUser[]> {
  await delay();
  return deepClone(mockUsers.filter((u) => u.role === "reviewer" || u.role === "manager"));
}

export async function getEvaluation(
  appId: string,
  reviewerId = "current_reviewer"
): Promise<ProgramEvaluation> {
  await delay();
  const key = `${appId}:${reviewerId}`;
  let evaln = mockEvaluations.get(key);
  if (!evaln) {
    evaln = {
      id: generateId("eval"),
      application_id: appId,
      reviewer_id: reviewerId,
      status: "in_progress",
      scores: [],
      updated_at: now(),
    };
    mockEvaluations.set(key, evaln);
  }
  return deepClone(evaln);
}

export async function saveEvaluationScores(
  appId: string,
  scores: EvaluationScore[],
  reviewerId = "current_reviewer"
): Promise<ProgramEvaluation> {
  await delay();
  const key = `${appId}:${reviewerId}`;
  let evaln = mockEvaluations.get(key);
  if (!evaln) {
    evaln = {
      id: generateId("eval"),
      application_id: appId,
      reviewer_id: reviewerId,
      status: "in_progress",
      scores: [],
      updated_at: now(),
    };
  }
  if (evaln.status === "completed") throw new Error("Evaluation is locked");
  const byId = new Map(evaln.scores.map((s) => [s.criteria_id, s]));
  for (const s of scores) {
    byId.set(s.criteria_id, s);
  }
  evaln.scores = Array.from(byId.values());
  evaln.updated_at = now();
  mockEvaluations.set(key, evaln);
  return deepClone(evaln);
}

export async function submitEvaluation(
  appId: string,
  scores: EvaluationScore[],
  reviewerId = "current_reviewer"
): Promise<ProgramEvaluation> {
  await delay();
  const evaln = await saveEvaluationScores(appId, scores, reviewerId);
  const key = `${appId}:${reviewerId}`;
  const stored = mockEvaluations.get(key)!;
  stored.status = "completed";
  stored.updated_at = now();

  const app = mockApplications.find((a) => a.id === appId);
  if (app) {
    const form = mockForms.find((f) => f.id === app.form_id);
    if (form) {
      let total = 0;
      let count = 0;
      for (const s of stored.scores) {
        const crit = form.criteria.find((c) => c.id === s.criteria_id);
        if (!crit) continue;
        const num = typeof s.value === "number" ? s.value : Number(s.value);
        if (!Number.isFinite(num)) continue;
        total += num;
        count += 1;
      }
      app.avg_score =
        count > 0 ? Math.round((total / count) * 100) / 100 : null;
      app.status = "evaluated";
    }
  }

  return deepClone(stored);
}

function assertDraft(form: ProgramForm): void {
  if (form.status !== "draft") {
    throw new Error("Published/archived forms cannot be edited. Create a new draft version.");
  }
}
