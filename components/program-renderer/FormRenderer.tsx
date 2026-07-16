"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProgramFormField } from "@/lib/program-forms/types";
import { groupBySection, widthClass } from "@/lib/program-forms/utils";
import { cn } from "@/lib/utils";

interface FormRendererProps {
  fields: ProgramFormField[];
  answers?: Record<string, unknown>;
  onChange?: (fieldKey: string, value: unknown) => void;
  readOnly?: boolean;
  className?: string;
}

function isVisible(
  field: ProgramFormField,
  answers: Record<string, unknown>
): boolean {
  if (!field.conditional) return true;
  const { field_key, operator, value } = field.conditional;
  const actual = answers[field_key];
  if (operator === "equals") return String(actual ?? "") === String(value);
  if (operator === "not_equals") return String(actual ?? "") !== String(value);
  if (operator === "one_of") {
    const list = Array.isArray(value) ? value.map(String) : String(value).split(",");
    return list.map((s) => s.trim()).includes(String(actual ?? ""));
  }
  return true;
}

export function FieldControl({
  field,
  value,
  readOnly,
  onChange,
}: {
  field: ProgramFormField;
  value: unknown;
  readOnly?: boolean;
  onChange?: (value: unknown) => void;
}) {
  const disabled = readOnly || !onChange;
  const str = value === undefined || value === null ? "" : String(value);

  switch (field.field_type) {
    case "textarea":
      return (
        <Textarea
          value={str}
          disabled={disabled}
          placeholder={field.placeholder ?? undefined}
          rows={4}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
    case "email":
      return (
        <Input
          type="email"
          value={str}
          disabled={disabled}
          placeholder={field.placeholder ?? "you@example.com"}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
    case "phone":
      return (
        <div className="flex gap-2">
          {field.validation?.countryCodePrefix && (
            <Input className="w-20" disabled value="+91" readOnly />
          )}
          <Input
            type="tel"
            value={str}
            disabled={disabled}
            placeholder={field.placeholder ?? "Phone number"}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
      );
    case "date":
      return (
        <Input
          type="date"
          value={str}
          disabled={disabled}
          min={field.validation?.minDate}
          max={field.validation?.maxDate}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
    case "select":
      return (
        <Select
          disabled={disabled}
          value={str || undefined}
          onValueChange={(v) => onChange?.(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder ?? "Select…"} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "radio":
      return (
        <div className="space-y-2">
          {(field.options ?? []).map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={field.field_key}
                value={o.value}
                checked={str === o.value}
                disabled={disabled}
                onChange={() => onChange?.(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      );
    case "multi_select": {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="space-y-2">
          {(field.options ?? []).map((o) => {
            const checked = selected.includes(o.value);
            return (
              <label key={o.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    if (!onChange) return;
                    onChange(
                      checked
                        ? selected.filter((v) => v !== o.value)
                        : [...selected, o.value]
                    );
                  }}
                />
                {o.label}
              </label>
            );
          })}
        </div>
      );
    }
    case "image":
    case "file":
      return (
        <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
          {readOnly && str ? (
            <span className="text-zinc-700">{str}</span>
          ) : (
            <>
              {field.field_type === "image" ? "Image upload" : "File upload"}{" "}
              (preview)
              {field.validation?.maxSizeMb && (
                <span className="mt-1 block text-xs">
                  Max {field.validation.maxSizeMb} MB
                </span>
              )}
              {!disabled && (
                <Input
                  type="file"
                  className="mt-3"
                  disabled={disabled}
                  accept={
                    field.field_type === "image"
                      ? (field.validation?.acceptedFormats ?? [])
                          .map((f) => `.${f}`)
                          .join(",")
                      : (field.validation?.acceptedMimeTypes ?? []).join(",")
                  }
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange?.(file.name);
                  }}
                />
              )}
            </>
          )}
        </div>
      );
    default:
      return (
        <Input
          type="text"
          value={str}
          disabled={disabled}
          placeholder={field.placeholder ?? undefined}
          onChange={(e) => onChange?.(e.target.value)}
        />
      );
  }
}

export function FormRenderer({
  fields,
  answers = {},
  onChange,
  readOnly,
  className,
}: FormRendererProps) {
  const sections = useMemo(() => groupBySection(fields), [fields]);

  if (fields.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500">
        No fields in this form yet.
      </p>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {sections.map(({ section, items }) => {
        const visible = items.filter((f) => isVisible(f, answers));
        if (visible.length === 0) return null;
        return (
          <section key={section}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {section}
            </h3>
            <div className="grid grid-cols-12 gap-x-4 gap-y-5">
              {visible.map((field) => (
                <div
                  key={field.id}
                  className={cn(widthClass(field.width), "space-y-1.5")}
                >
                  <Label>
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </Label>
                  {field.help_text && (
                    <p className="text-xs text-zinc-500">{field.help_text}</p>
                  )}
                  <FieldControl
                    field={field}
                    value={answers[field.field_key]}
                    readOnly={readOnly}
                    onChange={
                      onChange
                        ? (v) => onChange(field.field_key, v)
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
