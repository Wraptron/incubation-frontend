export type FormStatus = "draft" | "published" | "archived";

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "radio"
  | "select"
  | "multi_select"
  | "image"
  | "file"
  | "date";

export type CriteriaType = "rating_scale" | "number" | "text" | "yes_no";

export type ConditionalOperator = "equals" | "not_equals" | "one_of";

export type FieldWidth = "full" | "half" | "third";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  acceptedMimeTypes?: string[];
  acceptedFormats?: string[];
  maxSizeMb?: number;
  regex?: string;
  minDate?: string;
  maxDate?: string;
  dateFormat?: string;
  countryCodePrefix?: boolean;
}

export interface ConditionalRule {
  field_key: string;
  operator: ConditionalOperator;
  value: string | string[];
}

export interface ProgramFormField {
  id: string;
  form_id: string;
  field_key: string;
  label: string;
  help_text: string | null;
  placeholder: string | null;
  field_type: FieldType;
  required: boolean;
  options: FieldOption[] | null;
  validation: FieldValidation | null;
  conditional: ConditionalRule | null;
  sort_order: number;
  section: string;
  width?: FieldWidth;
  key_locked?: boolean;
}

export interface ProgramEvaluationCriteria {
  id: string;
  form_id: string;
  criteria_key: string;
  label: string;
  description: string | null;
  criteria_type: CriteriaType;
  scale_min: number | null;
  scale_max: number | null;
  weight: number;
  required: boolean;
  sort_order: number;
  section: string;
  key_locked?: boolean;
}

export interface ProgramForm {
  id: string;
  title: string;
  status: FormStatus;
  version: number;
  response_count: number;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
  fields: ProgramFormField[];
  criteria: ProgramEvaluationCriteria[];
}

export interface ProgramApplicationFile {
  id: string;
  field_key: string;
  url: string;
  filename: string;
}

export interface ProgramApplication {
  id: string;
  form_id: string;
  form_version: number;
  applicant_name: string;
  team_name: string | null;
  status: string;
  answers: Record<string, unknown>;
  reviewers: Array<{ id: string; full_name: string | null; email?: string | null }>;
  avg_score: number | null;
  submitted_at: string | null;
  files: ProgramApplicationFile[];
  field_schema: ProgramFormField[];
  criteria_schema: ProgramEvaluationCriteria[];
}

export interface EvaluationScore {
  criteria_id: string;
  value: number | string | boolean | null;
  comment?: string;
}

export interface ProgramEvaluation {
  id: string;
  application_id: string;
  reviewer_id: string;
  status: "in_progress" | "completed";
  scores: EvaluationScore[];
  updated_at: string;
}

export interface AssignableUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
}
