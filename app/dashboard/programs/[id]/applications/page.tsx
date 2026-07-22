"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Link2, Loader2, Plus } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProgramApplications, useProgramForm } from "@/lib/program-forms/hooks";
import type { ProgramFormField } from "@/lib/program-forms/types";
import {
  buildApplicationTableColumns,
  copyPublicFormLink,
  defaultVisibleApplicationColumns,
  getApplicationColumnValue,
  getPublicFormUrl,
  loadVisibleApplicationColumns,
  saveVisibleApplicationColumns,
  statusBadgeClass,
} from "@/lib/program-forms/utils";
import { formatStatus, getApplicationStatusColor } from "@/lib/utils";

export default function ProgramApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = String(params.id);
  const { form } = useProgramForm(formId);
  const { applications, loading, error } = useProgramApplications(formId);
  const [searchInput, setSearchInput] = useState("");
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>([]);
  const [columnsReady, setColumnsReady] = useState(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  const schemaFields = useMemo((): ProgramFormField[] => {
    if (form?.published_field_schema?.length) {
      return form.published_field_schema;
    }
    if (form?.fields?.length) return form.fields;
    const fromApp = applications.find((app) => app.field_schema?.length)?.field_schema;
    return fromApp ?? [];
  }, [applications, form]);

  const allColumns = useMemo(
    () => buildApplicationTableColumns(schemaFields),
    [schemaFields]
  );

  const availableIds = useMemo(
    () => allColumns.map((col) => col.id),
    [allColumns]
  );

  useEffect(() => {
    if (!form && loading) return;

    if (availableIds.length === 0) {
      setVisibleColumnIds(["__status", "__submitted"]);
      setColumnsReady(true);
      return;
    }

    const fallback = defaultVisibleApplicationColumns(schemaFields);
    const loaded = loadVisibleApplicationColumns(formId, availableIds, fallback);
    setVisibleColumnIds(loaded);
    setColumnsReady(true);
  }, [availableIds, form, formId, loading, schemaFields]);

  const visibleColumns = useMemo(() => {
    const byId = new Map(allColumns.map((col) => [col.id, col]));
    return visibleColumnIds
      .map((id) => byId.get(id))
      .filter((col): col is NonNullable<typeof col> => Boolean(col));
  }, [allColumns, visibleColumnIds]);

  const toggleColumn = (columnId: string, checked: boolean) => {
    setVisibleColumnIds((prev) => {
      const next = checked
        ? prev.includes(columnId)
          ? prev
          : [...prev, columnId]
        : prev.filter((id) => id !== columnId);

      // Keep at least one data column visible.
      if (next.length === 0) return prev;

      saveVisibleApplicationColumns(formId, next);
      return next;
    });
  };

  const handleCopyLink = async () => {
    if (!form?.public_slug) {
      setCopyError("Publish this form to get a shareable link.");
      return;
    }
    setCopyError(null);
    try {
      await copyPublicFormLink(form.public_slug);
      setCopyNotice("Form link copied to clipboard");
      window.setTimeout(() => setCopyNotice(null), 3000);
    } catch {
      setCopyError(
        `Could not copy automatically. Link: ${getPublicFormUrl(form.public_slug)}`
      );
    }
  };

  const filtered = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return applications;

    return applications.filter((app) => {
      const answerText = Object.values(app.answers ?? {})
        .map((value) => {
          if (value === null || value === undefined) return "";
          if (Array.isArray(value)) return value.join(" ");
          return String(value);
        })
        .join(" ");
      const haystack = [
        app.applicant_name,
        app.team_name,
        app.status,
        answerText,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [applications, searchInput]);

  const pageTitle = form?.title ?? "Program form";
  const canCopyLink = Boolean(form?.public_slug);

  const columnPicker = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          aria-label="Add table columns"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto">
        <DropdownMenuLabel>Select fields to display</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allColumns.length === 0 ? (
          <p className="px-2 py-1.5 text-sm text-zinc-500">
            No form fields available yet.
          </p>
        ) : (
          allColumns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={visibleColumnIds.includes(column.id)}
              onCheckedChange={(checked) =>
                toggleColumn(column.id, checked === true)
              }
              onSelect={(event) => event.preventDefault()}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/dashboard/programs">
            <ArrowLeft className="h-4 w-4" />
            Back to programs
          </Link>
        </Button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {pageTitle}
              </h2>
              {form?.status && (
                <Badge variant="outline" className={statusBadgeClass(form.status)}>
                  {form.status}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {applications.length} application
              {applications.length === 1 ? "" : "s"} received
            </p>
          </div>

          <Button
            size="sm"
            className="sm:self-start"
            disabled={!canCopyLink}
            onClick={() => void handleCopyLink()}
            title={
              canCopyLink
                ? "Copy public form link"
                : "Publish this form to get a shareable link"
            }
          >
            <Link2 className="h-4 w-4" />
            Copy form link
          </Button>
        </div>

        {(error || copyError) && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error || copyError}
          </div>
        )}

        {copyNotice && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
            {copyNotice}
          </div>
        )}

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search applications..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <Card>
          {loading || !columnsReady ? (
            <CardContent className="flex items-center justify-center gap-2 py-12 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading applications…
            </CardContent>
          ) : filtered.length === 0 ? (
            <CardContent className="p-6 text-center text-gray-500">
              <div className="mb-3 flex justify-end">{columnPicker}</div>
              {applications.length === 0
                ? "No applications received yet."
                : "No applications match your search."}
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableHead key={column.id}>{column.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                    <TableHead className="w-10 px-2 text-right">
                      {columnPicker}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app) => {
                    const detailHref = `/dashboard/programs/${formId}/applications/${app.id}`;

                    return (
                      <TableRow
                        key={app.id}
                        className="cursor-pointer"
                        onClick={() => router.push(detailHref)}
                      >
                        {visibleColumns.map((column) => {
                          if (column.id === "__status") {
                            return (
                              <TableCell key={column.id}>
                                <Badge
                                  className={getApplicationStatusColor(
                                    app.status || "pending"
                                  )}
                                >
                                  {formatStatus(app.status || "pending")}
                                </Badge>
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell key={column.id} className="max-w-[16rem] truncate">
                              {getApplicationColumnValue(app, column)}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Button variant="link" asChild>
                            <Link
                              href={detailHref}
                              onClick={(e) => e.stopPropagation()}
                            >
                              View →
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
