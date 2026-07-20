"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Eye, FileText, Link2, Loader2, X } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddFieldDialog } from "@/components/program-builder/AddFieldDialog";
import { AddCriteriaDialog } from "@/components/program-builder/AddCriteriaDialog";
import { FieldCanvas } from "@/components/program-builder/FieldCanvas";
import { FieldInspector } from "@/components/program-builder/FieldInspector";
import { CriteriaCanvas } from "@/components/program-builder/CriteriaCanvas";
import { CriteriaInspector } from "@/components/program-builder/CriteriaInspector";
import { FormRenderer } from "@/components/program-renderer/FormRenderer";
import { ScoringForm } from "@/components/program-renderer/ScoringForm";
import { useProgramForm } from "@/lib/program-forms/hooks";
import { statusBadgeClass, copyPublicFormLink, getPublicFormUrl } from "@/lib/program-forms/utils";
import type {
  FieldType,
  FieldWidth,
  ProgramEvaluationCriteria,
  ProgramFormField,
} from "@/lib/program-forms/types";

export default function ProgramBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = String(params.id);
  const {
    form,
    loading,
    error,
    updateTitle,
    addField,
    removeField,
    reorderFields,
    saveField,
    saveCriteria,
    addCriteria,
    removeCriteria,
    reorderCriteria,
    publish,
  } = useProgramForm(formId);

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(
    null
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<"fields" | "criteria">("fields");
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, unknown>>(
    {}
  );
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [addCriteriaOpen, setAddCriteriaOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState<string | null>(null);

  const readOnly = form?.status !== "draft";

  const selectedField = useMemo(
    () => form?.fields.find((f) => f.id === selectedFieldId) ?? null,
    [form, selectedFieldId]
  );

  const selectedCriterion = useMemo(
    () => form?.criteria.find((c) => c.id === selectedCriteriaId) ?? null,
    [form, selectedCriteriaId]
  );

  const handleFieldChange = (
    id: string,
    data: Partial<ProgramFormField>
  ) => {
    void saveField(id, data).catch((err: unknown) => {
      setActionError(err instanceof Error ? err.message : "Save failed");
    });
  };

  const handleCriteriaChange = (
    id: string,
    data: Partial<ProgramEvaluationCriteria>
  ) => {
    void saveCriteria(id, data).catch((err: unknown) => {
      setActionError(err instanceof Error ? err.message : "Save failed");
    });
  };

  const handleAddField = async (data: {
    field_type: FieldType;
    label: string;
    required?: boolean;
    options?: { label: string; value: string }[];
  }) => {
    const created = await addField({
      section: "General",
      label: data.label,
      field_type: data.field_type,
      required: data.required ?? true,
      ...(data.options ? { options: data.options } : {}),
    });
    if (created) setSelectedFieldId(created.id);
  };

  const handleAddCriteria = async (data: {
    label: string;
    description?: string;
  }) => {
    const created = await addCriteria({
      section: "General",
      label: data.label,
      description: data.description ?? null,
      criteria_type: "rating_scale",
      scale_min: 0,
      scale_max: 10,
      weight: 1,
      required: true,
    });
    if (created) setSelectedCriteriaId(created.id);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setActionError(null);
    try {
      const updated = await publish();
      setPublishOpen(false);
      // Mock drafts receive a real UUID from Supabase — update the URL.
      if (updated && updated.id !== formId) {
        router.replace(`/dashboard/programs/${updated.id}`);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = async () => {
    if (!form?.public_slug) return;
    setActionError(null);
    try {
      await copyPublicFormLink(form.public_slug);
      setCopyNotice("Form link copied to clipboard");
      window.setTimeout(() => setCopyNotice(null), 3000);
    } catch {
      setActionError(
        `Could not copy automatically. Link: ${getPublicFormUrl(form.public_slug)}`
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading form…
        </div>
      </DashboardLayout>
    );
  }

  if (error || !form) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-red-600">{error ?? "Form not found"}</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/dashboard/programs">Back to forms</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={titleDraft ?? form.title}
                disabled={readOnly}
                className="h-9 max-w-md border-transparent bg-transparent text-lg font-semibold text-zinc-900 shadow-none focus-visible:border-zinc-200 focus-visible:bg-white dark:text-zinc-50 dark:focus-visible:border-zinc-700 dark:focus-visible:bg-zinc-950"
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={() => {
                  if (titleDraft !== null && titleDraft !== form.title) {
                    void updateTitle(titleDraft).catch((err: unknown) => {
                      setActionError(
                        err instanceof Error ? err.message : "Title save failed"
                      );
                      setTitleDraft(form.title);
                    });
                  }
                  setTitleDraft(null);
                }}
              />
              <Badge variant="outline" className={statusBadgeClass(form.status)}>
                {form.status}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/programs/${form.id}/applications`}>
              <FileText className="h-4 w-4" />
              Applications
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPreviewTab("fields");
              setPreviewOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          {form.status === "published" && form.public_slug && (
            <Button variant="outline" size="sm" onClick={() => void handleCopyLink()}>
              <Link2 className="h-4 w-4" />
              Copy link
            </Button>
          )}
          <Button
            size="sm"
            disabled={readOnly}
            onClick={() => setPublishOpen(true)}
          >
            Publish
          </Button>
        </div>

        {readOnly && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            This form is <strong>{form.status}</strong>. Fields and criteria are
            read-only. Duplicate the form to create a new editable draft.
            {form.public_slug && (
              <span className="ml-1">
                Share link:{" "}
                <button
                  type="button"
                  className="font-medium underline"
                  onClick={() => void handleCopyLink()}
                >
                  {getPublicFormUrl(form.public_slug)}
                </button>
              </span>
            )}
          </div>
        )}

        {copyNotice && (
          <div className="border-b border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
            {copyNotice}
          </div>
        )}

        {actionError && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {actionError}
            <button
              type="button"
              className="ml-3 underline"
              onClick={() => setActionError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        <Tabs defaultValue="fields" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
            <TabsList className="h-11 bg-transparent p-0">
              <TabsTrigger
                value="fields"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Applicant Fields
              </TabsTrigger>
              <TabsTrigger
                value="criteria"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Evaluation Questions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="fields"
            className="mt-0 min-h-0 flex-1 overflow-y-auto bg-white data-[state=inactive]:hidden dark:bg-zinc-950"
          >
            <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6 sm:px-6">
              <FieldCanvas
                fields={form.fields}
                selectedId={selectedFieldId}
                readOnly={readOnly}
                onSelect={setSelectedFieldId}
                onReorder={(ids) => void reorderFields(ids)}
                onChangeWidth={(id, width: FieldWidth) => {
                  void saveField(id, { width }).catch((err: unknown) => {
                    setActionError(
                      err instanceof Error ? err.message : "Width save failed"
                    );
                  });
                }}
                onAddField={() => setAddFieldOpen(true)}
                onDeleteField={(id) => {
                  void removeField(id);
                  if (selectedFieldId === id) setSelectedFieldId(null);
                }}
              />
              {selectedField && (
                <FieldInspector
                  field={selectedField}
                  readOnly={readOnly}
                  onChange={handleFieldChange}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="criteria"
            className="mt-0 min-h-0 flex-1 overflow-y-auto bg-white data-[state=inactive]:hidden dark:bg-zinc-950"
          >
            <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6 sm:px-6">
              <CriteriaCanvas
                criteria={form.criteria}
                selectedId={selectedCriteriaId}
                readOnly={readOnly}
                onSelect={setSelectedCriteriaId}
                onReorder={(ids) => void reorderCriteria(ids)}
                onAddCriteria={() => setAddCriteriaOpen(true)}
                onDeleteCriteria={(id) => {
                  void removeCriteria(id);
                  if (selectedCriteriaId === id) setSelectedCriteriaId(null);
                }}
              />
              {selectedCriterion && (
                <CriteriaInspector
                  criterion={selectedCriterion}
                  readOnly={readOnly}
                  onChange={handleCriteriaChange}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddFieldDialog
        open={addFieldOpen}
        onOpenChange={setAddFieldOpen}
        onSubmit={handleAddField}
      />

      <AddCriteriaDialog
        open={addCriteriaOpen}
        onOpenChange={setAddCriteriaOpen}
        onSubmit={handleAddCriteria}
      />

      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-white to-zinc-50 dark:from-black dark:to-zinc-900">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={previewTab === "fields" ? "default" : "outline"}
                onClick={() => setPreviewTab("fields")}
              >
                Applicant Form
              </Button>
              <Button
                size="sm"
                variant={previewTab === "criteria" ? "default" : "outline"}
                onClick={() => setPreviewTab("criteria")}
              >
                Ranking Form
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setPreviewOpen(false);
                setPreviewAnswers({});
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Close preview
            </Button>
          </div>

          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <div className="mb-8 text-center">
              <div className="mb-6 flex w-full items-center justify-between">
                <img
                  src="/iitm-sie-logo.png"
                  alt="School of Innovation & Entrepreneurship IIT Madras"
                  className="h-16 w-auto object-contain sm:h-20"
                />
                <img
                  src="/nirmaan logo.png"
                  alt="Nirmaan logo"
                  className="h-16 w-16 rounded-2xl shadow-lg sm:h-20 sm:w-20"
                />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl dark:text-zinc-50">
                {form.title}
              </h1>
              <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                {previewTab === "fields"
                  ? "This is how applicants will see and fill your form."
                  : "This is how reviewers will score applications."}
              </p>
            </div>

            {previewTab === "fields" ? (
              <FormRenderer
                fields={form.fields}
                answers={previewAnswers}
                onChange={(key, value) =>
                  setPreviewAnswers((prev) => ({ ...prev, [key]: value }))
                }
              />
            ) : (
              <ScoringForm criteria={form.criteria} scores={[]} readOnly />
            )}
          </div>
        </div>
      )}

      <AlertDialog open={publishOpen} onOpenChange={setPublishOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish form?</AlertDialogTitle>
            <AlertDialogDescription>
              This freezes v{form.version}. Existing applications stay on their
              original version. Fields and criteria can no longer be edited after
              publishing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={publishing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={publishing}
              onClick={(e) => {
                e.preventDefault();
                void handlePublish();
              }}
            >
              {publishing ? "Publishing…" : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
