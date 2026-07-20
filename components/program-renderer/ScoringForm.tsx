"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  EvaluationScore,
  ProgramEvaluationCriteria,
} from "@/lib/program-forms/types";
import { groupBySection } from "@/lib/program-forms/utils";
import { cn } from "@/lib/utils";

const RANK_MIN = 0;
const RANK_MAX = 10;

interface ScoringFormProps {
  criteria: ProgramEvaluationCriteria[];
  scores: EvaluationScore[];
  onChange?: (scores: EvaluationScore[]) => void;
  onBlurSave?: (scores: EvaluationScore[]) => void;
  readOnly?: boolean;
  className?: string;
  variant?: "default" | "sheet";
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

function clampRank(n: number): number {
  return Math.min(RANK_MAX, Math.max(RANK_MIN, n));
}

function RankInput({
  value,
  disabled,
  onChange,
  fullWidth = false,
}: {
  value: number | null;
  disabled?: boolean;
  onChange: (v: number | null) => void;
  fullWidth?: boolean;
}) {
  const [draft, setDraft] = useState(
    value === null || value === undefined ? "" : String(value)
  );

  useEffect(() => {
    setDraft(value === null || value === undefined ? "" : String(value));
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "." || trimmed === "-") {
      setDraft("");
      onChange(null);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      setDraft(value === null || value === undefined ? "" : String(value));
      return;
    }
    const clamped = clampRank(parsed);
    setDraft(String(clamped));
    onChange(clamped);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        fullWidth ? "w-full" : "max-w-xs"
      )}
    >
      <Input
        type="number"
        inputMode="decimal"
        min={RANK_MIN}
        max={RANK_MAX}
        step="any"
        disabled={disabled}
        value={draft}
        placeholder="0 – 10"
        className={cn("h-9", fullWidth ? "w-full" : "w-28")}
        onChange={(e) => {
          const next = e.target.value;
          setDraft(next);
          if (next.trim() === "") {
            onChange(null);
            return;
          }
          const parsed = Number(next);
          if (Number.isFinite(parsed) && parsed >= RANK_MIN && parsed <= RANK_MAX) {
            onChange(parsed);
          }
        }}
        onBlur={() => commit(draft)}
      />
      <span className="text-sm text-zinc-500">/ {RANK_MAX}</span>
    </div>
  );
}

export function CriteriaControl({
  value,
  comment,
  readOnly,
  onChange,
  onCommentChange,
  showComment = true,
}: {
  criterion?: ProgramEvaluationCriteria;
  value?: number | string | boolean | null;
  comment?: string;
  readOnly?: boolean;
  onChange?: (value: number | string | boolean | null) => void;
  onCommentChange?: (comment: string) => void;
  showComment?: boolean;
}) {
  const disabled = readOnly || !onChange;
  const numValue = typeof value === "number" ? value : null;

  return (
    <div className="space-y-3">
      <RankInput
        value={numValue}
        disabled={disabled}
        onChange={(v) => onChange?.(v)}
      />

      {showComment && (
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-500">Comment (optional)</Label>
          <Textarea
            rows={2}
            value={comment ?? ""}
            disabled={readOnly || !onCommentChange}
            placeholder="Optional notes…"
            onChange={(e) => onCommentChange?.(e.target.value)}
          />
        </div>
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
  variant = "default",
}: ScoringFormProps) {
  const sections = useMemo(() => groupBySection(criteria), [criteria]);
  const isSheet = variant === "sheet";

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
        No evaluation questions defined.
      </p>
    );
  }

  return (
    <div className={cn(isSheet ? "space-y-6" : "space-y-8", className)}>
      {sections.map(({ section, items }) => (
        <section key={section}>
          {!isSheet && (
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {section}
            </h3>
          )}
          <div className={cn(isSheet ? "space-y-0" : "space-y-6")}>
            {items.map((crit) => {
              const score = getScore(scores, crit.id);

              return (
                <div
                  key={crit.id}
                  className={cn(
                    isSheet
                      ? "border-b border-zinc-200 pb-6 last:border-b-0 dark:border-zinc-800"
                      : "space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  )}
                  onBlur={blurSave}
                >
                  <div className={isSheet ? "mb-4" : undefined}>
                    <Label
                      className={cn(
                        isSheet
                          ? "mb-2 block text-base font-semibold text-black dark:text-zinc-50"
                          : "text-base"
                      )}
                    >
                      {crit.label}
                      {crit.required && (
                        <span className="text-red-500"> *</span>
                      )}
                    </Label>
                    {crit.description && (
                      <p
                        className={cn(
                          "text-sm text-zinc-600 dark:text-zinc-400",
                          isSheet ? "mb-4" : "mt-0.5"
                        )}
                      >
                        {crit.description}
                      </p>
                    )}
                    {!isSheet && (
                      <p className="mt-1 text-xs text-zinc-400">
                        Enter a score from 0 to 10 (decimals allowed)
                      </p>
                    )}
                  </div>

                  {isSheet ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="mb-2 block text-sm text-zinc-700 dark:text-zinc-300">
                          Score (0.0 - 10.0){" "}
                          {crit.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <RankInput
                          value={
                            typeof score.value === "number" ? score.value : null
                          }
                          disabled={readOnly || !onChange}
                          onChange={(v) => update(crit.id, { value: v })}
                          fullWidth
                        />
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          Type a score between 0.0 and 10.0 (decimals allowed)
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-zinc-700 dark:text-zinc-300">
                          Comment
                        </Label>
                        <Textarea
                          rows={4}
                          value={score.comment ?? ""}
                          disabled={readOnly || !onChange}
                          placeholder="Enter your evaluation comment..."
                          className="mt-1"
                          onChange={(e) =>
                            update(crit.id, { comment: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <CriteriaControl
                      criterion={crit}
                      value={score.value}
                      comment={score.comment}
                      readOnly={readOnly || !onChange}
                      onChange={
                        onChange
                          ? (value) => update(crit.id, { value })
                          : undefined
                      }
                      onCommentChange={
                        onChange
                          ? (comment) => update(crit.id, { comment })
                          : undefined
                      }
                    />
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
