"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type {
  CriteriaType,
  ProgramEvaluationCriteria,
} from "@/lib/program-forms/types";
import { slugify } from "@/lib/program-forms/utils";
import { cn } from "@/lib/utils";
import { Plus, Star } from "lucide-react";

const CRITERIA_TYPES: Array<{ value: CriteriaType; label: string }> = [
  { value: "rating_scale", label: "Rating Scale" },
  { value: "number", label: "Number" },
  { value: "text", label: "Text" },
  { value: "yes_no", label: "Yes / No" },
];

interface CriteriaInspectorProps {
  criterion: ProgramEvaluationCriteria | null;
  readOnly?: boolean;
  onChange: (id: string, data: Partial<ProgramEvaluationCriteria>) => void;
  onAddCriteria?: () => void;
}

function RatingPreview({ min, max }: { min: number; max: number }) {
  const stars = Math.max(1, Math.min(10, max - min + 1));
  return (
    <div className="flex flex-wrap items-center gap-1">
      {Array.from({ length: stars }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-5 w-5",
            i < Math.ceil(stars / 2)
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-300"
          )}
        />
      ))}
      <span className="ml-2 text-xs text-zinc-500">
        {min}–{max}
      </span>
    </div>
  );
}

export function CriteriaInspector({
  criterion,
  readOnly,
  onChange,
  onAddCriteria,
}: CriteriaInspectorProps) {
  if (!criterion) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-zinc-50 p-8 text-center">
        <p className="max-w-xs text-sm text-zinc-500">
          Select a criterion on the left to edit it, or add a new one to get
          started.
        </p>
        {!readOnly && onAddCriteria && (
          <Button type="button" size="sm" onClick={onAddCriteria}>
            <Plus className="h-4 w-4" />
            Add criterion
          </Button>
        )}
      </div>
    );
  }

  const patch = (data: Partial<ProgramEvaluationCriteria>) =>
    onChange(criterion.id, data);

  const min = criterion.scale_min ?? 1;
  const max = criterion.scale_max ?? 5;

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 p-4">
      <div className="mx-auto max-w-xl space-y-5">
        <div className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Criteria Inspector
            </h3>
            {criterion.key_locked && (
              <p className="mt-1 text-xs text-zinc-400">
                key: {criterion.criteria_key}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="crit-label">Label</Label>
            <Input
              id="crit-label"
              value={criterion.label}
              disabled={readOnly}
              onChange={(e) => {
                const label = e.target.value;
                const data: Partial<ProgramEvaluationCriteria> = { label };
                if (!criterion.key_locked) {
                  data.criteria_key = slugify(label) || criterion.criteria_key;
                }
                patch(data);
              }}
              onBlur={() => {
                if (!criterion.key_locked && criterion.label) {
                  patch({
                    key_locked: true,
                    criteria_key:
                      slugify(criterion.label) || criterion.criteria_key,
                  });
                }
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="crit-desc">Description</Label>
            <Textarea
              id="crit-desc"
              value={criterion.description ?? ""}
              disabled={readOnly}
              rows={2}
              placeholder="Helper text shown to the reviewer"
              onChange={(e) =>
                patch({ description: e.target.value || null })
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label>Criteria type</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {CRITERIA_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  disabled={readOnly}
                  onClick={() => {
                    const data: Partial<ProgramEvaluationCriteria> = {
                      criteria_type: t.value,
                    };
                    if (t.value === "rating_scale") {
                      data.scale_min = criterion.scale_min ?? 1;
                      data.scale_max = criterion.scale_max ?? 5;
                    }
                    patch(data);
                  }}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition-colors disabled:opacity-50",
                    criterion.criteria_type === t.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-zinc-200 hover:bg-zinc-50"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {criterion.criteria_type === "rating_scale" && (
            <div className="space-y-3 rounded-md border border-zinc-100 bg-zinc-50 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="scale-min">Scale min</Label>
                  <Input
                    id="scale-min"
                    type="number"
                    value={min}
                    disabled={readOnly}
                    onChange={(e) =>
                      patch({ scale_min: Number(e.target.value) || 1 })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="scale-max">Scale max</Label>
                  <Input
                    id="scale-max"
                    type="number"
                    value={max}
                    disabled={readOnly}
                    onChange={(e) =>
                      patch({ scale_max: Number(e.target.value) || 5 })
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Live preview</Label>
                <RatingPreview min={min} max={max} />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="weight">Weight</Label>
              <span
                className="cursor-help text-xs text-zinc-400"
                title="Used for weighted average across criteria"
              >
                (?)
              </span>
            </div>
            <Input
              id="weight"
              type="number"
              min={0}
              step={0.1}
              value={criterion.weight}
              disabled={readOnly}
              onChange={(e) =>
                patch({ weight: Number(e.target.value) || 0 })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="crit-required">Required</Label>
            <Switch
              id="crit-required"
              checked={criterion.required}
              disabled={readOnly}
              onCheckedChange={(checked) => patch({ required: checked })}
            />
          </div>

        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h4 className="mb-1 text-sm font-semibold text-zinc-900">
            Reviewer Preview
          </h4>
          <p className="mb-3 text-xs text-zinc-500">
            How this criterion will appear on the scoring screen
          </p>
          <div className="space-y-2 rounded-md border border-zinc-100 bg-zinc-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-zinc-900">
                  {criterion.label || "Untitled"}
                  {criterion.required && (
                    <span className="text-red-500"> *</span>
                  )}
                </p>
                {criterion.description && (
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {criterion.description}
                  </p>
                )}
              </div>
              {criterion.weight > 0 && (
                <span className="shrink-0 text-xs text-zinc-400">
                  weight {criterion.weight}
                </span>
              )}
            </div>
            {criterion.criteria_type === "rating_scale" && (
              <RatingPreview min={min} max={max} />
            )}
            {criterion.criteria_type === "number" && (
              <Input type="number" disabled placeholder="Number" />
            )}
            {criterion.criteria_type === "text" && (
              <Textarea disabled rows={2} placeholder="Reviewer comments…" />
            )}
            {criterion.criteria_type === "yes_no" && (
              <div className="flex gap-3 text-sm">
                <label className="flex items-center gap-1.5">
                  <input type="radio" disabled name="preview-yn" /> Yes
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="radio" disabled name="preview-yn" /> No
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
