"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type {
  EvaluationScore,
  ProgramEvaluationCriteria,
} from "@/lib/program-forms/types";
import { groupBySection } from "@/lib/program-forms/utils";
import { cn } from "@/lib/utils";

interface ScoringFormProps {
  criteria: ProgramEvaluationCriteria[];
  scores: EvaluationScore[];
  onChange?: (scores: EvaluationScore[]) => void;
  onBlurSave?: (scores: EvaluationScore[]) => void;
  readOnly?: boolean;
  className?: string;
}

function getScore(
  scores: EvaluationScore[],
  criteriaId: string
): EvaluationScore {
  return (
    scores.find((s) => s.criteria_id === criteriaId) ?? {
      criteria_id: criteriaId,
      value: null,
      comment: "",
    }
  );
}

function setScore(
  scores: EvaluationScore[],
  criteriaId: string,
  patch: Partial<EvaluationScore>
): EvaluationScore[] {
  const existing = getScore(scores, criteriaId);
  const next = { ...existing, ...patch, criteria_id: criteriaId };
  const others = scores.filter((s) => s.criteria_id !== criteriaId);
  return [...others, next];
}

function RatingInput({
  min,
  max,
  value,
  disabled,
  onChange,
}: {
  min: number;
  max: number;
  value: number | null;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  const count = Math.max(1, max - min + 1);
  return (
    <div className="flex flex-wrap items-center gap-1">
      {Array.from({ length: count }, (_, i) => {
        const n = min + i;
        const active = value !== null && value >= n;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            aria-label={`Rate ${n}`}
            onClick={() => onChange(n)}
            className="disabled:opacity-50"
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                active
                  ? "fill-amber-400 text-amber-400"
                  : "text-zinc-300 hover:text-amber-300"
              )}
            />
          </button>
        );
      })}
      {value !== null && (
        <span className="ml-2 text-sm text-zinc-600">
          {value} / {max}
        </span>
      )}
    </div>
  );
}

export function ScoringForm({
  criteria,
  scores,
  onChange,
  onBlurSave,
  readOnly,
  className,
}: ScoringFormProps) {
  const sections = useMemo(() => groupBySection(criteria), [criteria]);
  const disabled = readOnly || !onChange;

  const update = (criteriaId: string, patch: Partial<EvaluationScore>) => {
    if (!onChange) return;
    onChange(setScore(scores, criteriaId, patch));
  };

  const blurSave = () => {
    onBlurSave?.(scores);
  };

  if (criteria.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        No evaluation criteria defined.
      </p>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {sections.map(({ section, items }) => (
        <section key={section}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {section}
          </h3>
          <div className="space-y-6">
            {items.map((crit) => {
              const score = getScore(scores, crit.id);
              const numValue =
                typeof score.value === "number" ? score.value : null;

              return (
                <div
                  key={crit.id}
                  className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
                  onBlur={blurSave}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Label className="text-base">
                        {crit.label}
                        {crit.required && (
                          <span className="text-red-500"> *</span>
                        )}
                      </Label>
                      {crit.description && (
                        <p className="mt-0.5 text-sm text-zinc-500">
                          {crit.description}
                        </p>
                      )}
                    </div>
                    {crit.weight > 0 && (
                      <span className="shrink-0 text-xs text-zinc-400">
                        weight {crit.weight}
                      </span>
                    )}
                  </div>

                  {crit.criteria_type === "rating_scale" && (
                    <RatingInput
                      min={crit.scale_min ?? 1}
                      max={crit.scale_max ?? 5}
                      value={numValue}
                      disabled={disabled}
                      onChange={(v) => update(crit.id, { value: v })}
                    />
                  )}

                  {crit.criteria_type === "number" && (
                    <Input
                      type="number"
                      value={numValue ?? ""}
                      disabled={disabled}
                      onChange={(e) =>
                        update(crit.id, {
                          value:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                    />
                  )}

                  {crit.criteria_type === "text" && (
                    <Textarea
                      rows={3}
                      value={typeof score.value === "string" ? score.value : ""}
                      disabled={disabled}
                      onChange={(e) =>
                        update(crit.id, { value: e.target.value })
                      }
                    />
                  )}

                  {crit.criteria_type === "yes_no" && (
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={score.value === true}
                        disabled={disabled}
                        onCheckedChange={(checked) =>
                          update(crit.id, { value: checked })
                        }
                      />
                      <span className="text-sm text-zinc-600">
                        {score.value === true
                          ? "Yes"
                          : score.value === false
                            ? "No"
                            : "Not set"}
                      </span>
                    </div>
                  )}

                  {crit.criteria_type !== "text" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-500">
                        Comment (optional)
                      </Label>
                      <Textarea
                        rows={2}
                        value={score.comment ?? ""}
                        disabled={disabled}
                        placeholder="Optional notes…"
                        onChange={(e) =>
                          update(crit.id, { comment: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
