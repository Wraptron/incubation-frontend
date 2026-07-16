"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FieldOption, FieldType } from "@/lib/program-forms/types";
import { slugify } from "@/lib/program-forms/utils";
import { cn } from "@/lib/utils";
import { FIELD_TYPE_CATEGORIES, FIELD_TYPES } from "./field-types";

const CHOICE_TYPES: FieldType[] = ["radio", "select", "multi_select"];

function needsOptions(type: FieldType | null): boolean {
  return type !== null && CHOICE_TYPES.includes(type);
}

function toFieldOptions(labels: string[]): FieldOption[] {
  const used = new Set<string>();
  return labels
    .map((label) => label.trim())
    .filter(Boolean)
    .map((label, index) => {
      let value = slugify(label) || `option_${index + 1}`;
      if (used.has(value)) {
        let n = 2;
        while (used.has(`${value}_${n}`)) n += 1;
        value = `${value}_${n}`;
      }
      used.add(value);
      return { label, value };
    });
}

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    field_type: FieldType;
    label: string;
    options?: FieldOption[];
  }) => Promise<void>;
}

export function AddFieldDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddFieldDialogProps) {
  const [step, setStep] = useState<"type" | "name">("type");
  const [fieldType, setFieldType] = useState<FieldType | null>(null);
  const [label, setLabel] = useState("");
  const [optionLabels, setOptionLabels] = useState<string[]>(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStep("type");
      setFieldType(null);
      setLabel("");
      setOptionLabels(["", ""]);
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const selected = FIELD_TYPES.find((t) => t.value === fieldType);
  const showOptions = needsOptions(fieldType);

  const handleSelectType = (type: FieldType) => {
    setFieldType(type);
    setOptionLabels(["", ""]);
    setStep("name");
    setError(null);
  };

  const handleBack = () => {
    setStep("type");
    setError(null);
  };

  const updateOption = (index: number, value: string) => {
    setOptionLabels((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  const addOption = () => {
    setOptionLabels((prev) => [...prev, ""]);
  };

  const removeOption = (index: number) => {
    setOptionLabels((prev) =>
      prev.length <= 2 ? prev : prev.filter((_, i) => i !== index)
    );
  };

  const handleCreate = async () => {
    const trimmed = label.trim();
    if (!fieldType || !trimmed) {
      setError("Enter a field name to continue.");
      return;
    }

    let options: FieldOption[] | undefined;
    if (showOptions) {
      options = toFieldOptions(optionLabels);
      if (options.length < 2) {
        setError("Add at least two options.");
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        field_type: fieldType,
        label: trimmed,
        ...(options ? { options } : {}),
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add field");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-xl",
          "border-zinc-200/80 bg-white shadow-2xl shadow-black/10",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40"
        )}
      >
        <DialogHeader className="space-y-1 border-b border-zinc-100 px-6 py-5 dark:border-zinc-800/80">
          <DialogTitle className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {step === "type" ? "Choose field type" : "Name your field"}
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            {step === "type"
              ? "Select the type of answer applicants should provide."
              : showOptions
                ? `Name the field and add the choices for this ${selected?.label.toLowerCase() ?? "field"}.`
                : `Configure your ${selected?.label.toLowerCase() ?? "new"} field.`}
          </DialogDescription>
        </DialogHeader>

        {step === "type" ? (
          <div className="max-h-[min(62vh,520px)] space-y-5 overflow-y-auto px-6 py-5">
            {FIELD_TYPE_CATEGORIES.map((category) => {
              const types = FIELD_TYPES.filter(
                (type) => type.category === category.id
              );
              if (types.length === 0) return null;

              return (
                <div key={category.id} className="space-y-2.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
                    {category.label}
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {types.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleSelectType(type.value)}
                        className={cn(
                          "group relative flex items-start gap-3 rounded-xl border p-3 text-left",
                          "border-zinc-200/90 bg-zinc-50/60",
                          "transition-all duration-150 ease-out",
                          "hover:border-primary/35 hover:bg-primary/[0.06] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                          "dark:border-zinc-800 dark:bg-zinc-900/50",
                          "dark:hover:border-primary/40 dark:hover:bg-primary/[0.08]",
                          "dark:focus-visible:ring-offset-zinc-950",
                          "active:scale-[0.99]"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            "bg-white text-zinc-600 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
                            "transition-colors duration-150",
                            "group-hover:bg-primary/12 group-hover:text-primary group-hover:shadow-none",
                            "dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-none",
                            "dark:group-hover:bg-primary/15 dark:group-hover:text-primary"
                          )}
                        >
                          {type.icon}
                        </span>
                        <span className="min-w-0 pt-0.5">
                          <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {type.label}
                          </span>
                          <span className="mt-0.5 block text-[12px] leading-snug text-zinc-500 dark:text-zinc-400">
                            {type.description}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-h-[min(62vh,520px)] space-y-4 overflow-y-auto px-6 py-5">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Change type
            </button>

            <div className="flex items-center gap-3 rounded-xl border border-zinc-200/90 bg-zinc-50/70 px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary dark:bg-primary/15">
                {selected?.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {selected?.label}
                </p>
                <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                  {selected?.description}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="new-field-name"
                className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300"
              >
                Field name
              </Label>
              <Input
                id="new-field-name"
                autoFocus
                value={label}
                placeholder="e.g. Company stage"
                className="h-10 rounded-lg border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !showOptions) {
                    e.preventDefault();
                    void handleCreate();
                  }
                }}
              />
            </div>

            {showOptions && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                    Options
                  </Label>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    At least 2 required
                  </span>
                </div>
                <div className="space-y-2">
                  {optionLabels.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex h-8 w-6 shrink-0 items-center justify-center text-[12px] tabular-nums text-zinc-400">
                        {index + 1}
                      </span>
                      <Input
                        value={option}
                        placeholder={`Option ${index + 1}`}
                        className="h-9 rounded-lg border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                        onChange={(e) => updateOption(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (index === optionLabels.length - 1) {
                              addOption();
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        disabled={optionLabels.length <= 2}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                  onClick={addOption}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add option
                </Button>
              </div>
            )}

            {error && (
              <p className="text-[13px] text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        )}

        {step === "name" && (
          <DialogFooter className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800/80 dark:bg-zinc-900/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleCreate()}
              disabled={submitting || !label.trim()}
              className="rounded-lg"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Add field
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
