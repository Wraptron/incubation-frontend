"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { FormRenderer } from "@/components/program-renderer/FormRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { backendUrl } from "@/lib/config";
import * as api from "@/lib/program-forms/api";
import type { ProgramFormField } from "@/lib/program-forms/types";

type PublicForm = {
  id: string;
  title: string;
  fields: ProgramFormField[];
};

function buildSubmissionPayload(
  formId: string,
  fields: ProgramFormField[],
  answers: Record<string, unknown>
): FormData | { answers: Record<string, unknown> } {
  const hasFiles = fields.some((field) => {
    if (field.field_type !== "file" && field.field_type !== "image") {
      return false;
    }
    return answers[field.field_key] instanceof File;
  });

  if (!hasFiles) {
    return { answers };
  }

  const answersJson: Record<string, unknown> = { ...answers };
  const formData = new FormData();
  formData.append("form_id", formId);

  for (const field of fields) {
    if (field.field_type !== "file" && field.field_type !== "image") continue;
    const value = answers[field.field_key];
    if (value instanceof File) {
      formData.append(field.field_key, value);
      delete answersJson[field.field_key];
    }
  }

  formData.append("answers", JSON.stringify(answersJson));
  return formData;
}

export default function PublicProgramFormPage() {
  const params = useParams();
  const slug = String(params.slug ?? "");
  const [form, setForm] = useState<PublicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${backendUrl.replace(/\/$/, "")}/api/program-forms/public/${encodeURIComponent(slug)}`
        );
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof body.error === "string" ? body.error : "Form not found"
          );
        }
        if (!cancelled) {
          setForm(body as PublicForm);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load form");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (slug) void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleSubmit = async () => {
    if (!form) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = buildSubmissionPayload(form.id, form.fields, answers);
      await api.submitApplication(form.id, payload);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-zinc-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading form…
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Form unavailable</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!form) return null;

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Application submitted</CardTitle>
            <CardDescription>
              Thank you. Your response to &ldquo;{form.title}&rdquo; was received.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {form.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Fill in the details below to apply.
          </p>
        </div>

        <FormRenderer
          fields={form.fields}
          answers={answers}
          onChange={(key, value) =>
            setAnswers((prev) => ({ ...prev, [key]: value }))
          }
        />

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        </div>
      </div>
    </div>
  );
}
