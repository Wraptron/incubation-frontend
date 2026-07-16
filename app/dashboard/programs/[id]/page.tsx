"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Eye, FileText, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { FieldCanvas } from "@/components/program-builder/FieldCanvas";
import { CriteriaList } from "@/components/program-builder/CriteriaList";
import { CriteriaInspector } from "@/components/program-builder/CriteriaInspector";
import { FormRenderer } from "@/components/program-renderer/FormRenderer";
import { ScoringForm } from "@/components/program-renderer/ScoringForm";
import { useProgramForm } from "@/lib/program-forms/hooks";
import { statusBadgeClass } from "@/lib/program-forms/utils";
import type {
  FieldType,
  FieldWidth,
  ProgramEvaluationCriteria,
} from "@/lib/program-forms/types";

export default function ProgramBuilderPage() {
  const params = useParams();
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
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState<string | null>(null);

  const readOnly = form?.status !== "draft";

  const selectedCriterion = useMemo(
    () => form?.criteria.find((c) => c.id === selectedCriteriaId) ?? null,
    [form, selectedCriteriaId]
  );

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
    options?: { label: string; value: string }[];
  }) => {
    const created = await addField({
      section: "General",
      label: data.label,
      field_type: data.field_type,
      ...(data.options ? { options: data.options } : {}),
    });
    if (created) setSelectedFieldId(created.id);
  };

  const handleAddCriteria = async () => {
    try {
      const created = await addCriteria({
        section: "General",
        label: "New Criterion",
        criteria_type: "rating_scale",
        scale_min: 1,
        scale_max: 5,
        weight: 1,
      });
      if (created) setSelectedCriteriaId(created.id);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to add criterion"
      );
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setActionError(null);
    try {
      await publish();
      setPublishOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
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
                className="h-9 max-w-md border-transparent bg-transparent text-lg font-semibold shadow-none focus-visible:border-zinc-200 focus-visible:bg-white"
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
              <span className="text-sm text-zinc-400">v{form.version}</span>
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
                Evaluation Criteria
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="fields"
            className="mt-0 min-h-0 flex-1 overflow-y-auto bg-white data-[state=inactive]:hidden dark:bg-zinc-950"
          >
            <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
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
            </div>
          </TabsContent>

          <TabsContent
            value="criteria"
            className="mt-0 min-h-0 flex-1 data-[state=inactive]:hidden"
          >
            <div className="grid h-full min-h-[480px] grid-cols-1 lg:grid-cols-[30%_1fr]">
              <CriteriaList
                criteria={form.criteria}
                selectedId={selectedCriteriaId}
                readOnly={readOnly}
                onSelect={setSelectedCriteriaId}
                onReorder={(ids) => void reorderCriteria(ids)}
                onAddCriteria={() => void handleAddCriteria()}
                onDeleteCriteria={(id) => {
                  void removeCriteria(id);
                  if (selectedCriteriaId === id) setSelectedCriteriaId(null);
                }}
              />
              <CriteriaInspector
                criterion={selectedCriterion}
                readOnly={readOnly}
                onChange={handleCriteriaChange}
                onAddCriteria={() => void handleAddCriteria()}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddFieldDialog
        open={addFieldOpen}
        onOpenChange={setAddFieldOpen}
        onSubmit={handleAddField}
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Preview — {form.title}</DialogTitle>
          </DialogHeader>
          <div className="mb-3 flex gap-2">
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
              Scoring Form
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-zinc-100 bg-zinc-50 p-4">
            {previewTab === "fields" ? (
              <FormRenderer fields={form.fields} readOnly />
            ) : (
              <ScoringForm criteria={form.criteria} scores={[]} readOnly />
            )}
          </div>
        </DialogContent>
      </Dialog>

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
