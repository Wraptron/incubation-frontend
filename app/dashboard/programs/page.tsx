"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Plus } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useProgramForms } from "@/lib/program-forms/hooks";
import * as api from "@/lib/program-forms/api";
import { formatDateTime, statusBadgeClass, copyPublicFormLink, getPublicFormUrl } from "@/lib/program-forms/utils";
import type { ProgramForm } from "@/lib/program-forms/types";

export default function ProgramsListPage() {
  const router = useRouter();
  const { forms, loading, error, refresh, setForms } = useProgramForms();
  const [creating, setCreating] = useState(false);
  const [publishTarget, setPublishTarget] = useState<ProgramForm | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  const handleCreate = async () => {
    setCreating(true);
    setActionError(null);
    try {
      const form = await api.createForm();
      router.push(`/dashboard/programs/${form.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to create form");
      setCreating(false);
    }
  };

  const handlePublish = async () => {
    if (!publishTarget) return;
    const previousId = publishTarget.id;
    try {
      const updated = await api.publishForm(previousId);
      // Mock drafts get a new UUID on publish — replace by either id.
      setForms((prev) =>
        prev.map((f) =>
          f.id === previousId || f.id === updated.id ? updated : f
        )
      );
      setPublishTarget(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to publish");
      setPublishTarget(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await api.duplicateForm(id);
      setForms((prev) => [copy, ...prev]);
      router.push(`/dashboard/programs/${copy.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to duplicate");
    }
  };

  const handleCopyLink = async (form: ProgramForm) => {
    if (!form.public_slug) {
      setActionError("This form has no public link yet.");
      return;
    }
    setActionError(null);
    try {
      await copyPublicFormLink(form.public_slug);
      setCopyNotice(`Form link copied for "${form.title}"`);
      window.setTimeout(() => setCopyNotice(null), 3000);
    } catch {
      setActionError(
        `Could not copy automatically. Link: ${getPublicFormUrl(form.public_slug)}`
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Program Forms
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Build applicant forms and reviewer evaluation criteria.
            </p>
          </div>
          <Button onClick={handleCreate} disabled={creating}>
            <Plus className="h-4 w-4" />
            {creating ? "Creating…" : "New Program Form"}
          </Button>
        </div>

        {(error || actionError) && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error || actionError}
            {error && (
              <button
                type="button"
                className="ml-3 underline"
                onClick={() => void refresh()}
              >
                Retry
              </button>
            )}
          </div>
        )}

        {copyNotice && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {copyNotice}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-zinc-500">
                    Loading forms…
                  </TableCell>
                </TableRow>
              ) : forms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-zinc-500">
                    No program forms yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/programs/${form.id}`}
                        className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                      >
                        {form.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(form.status)}
                      >
                        {form.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{form.response_count}</TableCell>
                    <TableCell className="text-zinc-500">
                      {formatDateTime(form.updated_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/programs/${form.id}`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={form.status !== "draft"}
                            onClick={() => setPublishTarget(form)}
                          >
                            Publish
                          </DropdownMenuItem>
                          {form.status === "published" && form.public_slug && (
                            <DropdownMenuItem
                              onClick={() => void handleCopyLink(form)}
                            >
                              Copy form link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => void handleDuplicate(form.id)}
                          >
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/programs/${form.id}/applications`
                              )
                            }
                          >
                            View applications
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={!!publishTarget}
        onOpenChange={(open) => !open && setPublishTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish form?</AlertDialogTitle>
            <AlertDialogDescription>
              This freezes v{publishTarget?.version}. Existing applications stay
              on their original version. You will not be able to edit fields or
              criteria after publishing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handlePublish()}>
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
