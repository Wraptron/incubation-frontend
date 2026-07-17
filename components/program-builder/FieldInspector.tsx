"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ProgramFormField } from "@/lib/program-forms/types";
import { slugify } from "@/lib/program-forms/utils";

export function FieldInspector({
  field,
  readOnly,
  onChange,
}: {
  field: ProgramFormField;
  readOnly?: boolean;
  onChange: (id: string, data: Partial<ProgramFormField>) => void;
}) {
  const patch = (data: Partial<ProgramFormField>) => onChange(field.id, data);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Field settings
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Edit how this question appears to applicants.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={field.label}
            disabled={readOnly}
            onChange={(e) => {
              const label = e.target.value;
              const data: Partial<ProgramFormField> = { label };
              if (!field.key_locked) {
                data.field_key = slugify(label) || field.field_key;
              }
              patch(data);
            }}
            onBlur={() => {
              if (!field.key_locked && field.label) {
                patch({
                  key_locked: true,
                  field_key: slugify(field.label) || field.field_key,
                });
              }
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="field-help">Help text</Label>
          <Textarea
            id="field-help"
            value={field.help_text ?? ""}
            disabled={readOnly}
            rows={2}
            placeholder="Helper text shown under the label"
            onChange={(e) => patch({ help_text: e.target.value || null })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required</Label>
          <Switch
            id="field-required"
            checked={field.required}
            disabled={readOnly}
            onCheckedChange={(checked) => patch({ required: checked })}
          />
        </div>
      </div>
    </div>
  );
}
