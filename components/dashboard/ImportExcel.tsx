"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { FileSpreadsheet, Download, Upload, Loader2 } from "lucide-react";

export interface ImportExcelProps {
  onImportSuccess?: () => void;
}

interface ImportResult {
  message: string;
  imported: number;
  totalRows: number;
  skipped: number;
  errors?: { row: number; message: string }[];
  insertErrors?: { row: number; message: string }[];
}

export default function ImportExcel({ onImportSuccess }: ImportExcelProps) {
  const [open, setOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ row: number; message: string }[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    setError(null);
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch("/api/applications/import/template", { headers });
      if (!res.ok) throw new Error("Failed to download template");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "application-import-template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download template");
    } finally {
      setIsDownloading(false);
    }
  };

  const doImport = useCallback(
    async (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext !== "xlsx" && ext !== "xls") {
        setError("Please upload an .xlsx or .xls file.");
        return;
      }
      setIsImporting(true);
      setError(null);
      setErrorDetails(null);
      setResult(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const formData = new FormData();
        formData.append("file", file);
        const headers: HeadersInit = {};
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
        const res = await fetch("/api/applications/import", {
          method: "POST",
          headers,
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          const details = data.details as { row: number; message: string }[] | undefined;
          setErrorDetails(details?.length ? details : null);
          throw new Error(data.error || "Import failed");
        }
        setResult(data);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (data.imported > 0) onImportSuccess?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Import failed");
      } finally {
        setIsImporting(false);
      }
    },
    [onImportSuccess]
  );

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doImport(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) doImport(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const resetOnOpen = () => {
    setError(null);
    setErrorDetails(null);
    setResult(null);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => { setOpen(true); resetOnOpen(); }}
        className="h-8 w-8"
        title="Import applications from Excel"
      >
        <Upload className="h-4 w-4" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="sm:max-w-md w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Import Applications
            </SheetTitle>
            <SheetDescription>
              Download the template, fill in application details, then upload your Excel file.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
                className="flex-1"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Template
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Excel</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-zinc-300 dark:border-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500"
                } ${isImporting ? "pointer-events-none opacity-60" : ""}`}
              >
                {isImporting ? (
                  <Loader2 className="w-10 h-10 mx-auto mb-2 animate-spin text-primary" />
                ) : (
                  <Upload className="w-10 h-10 mx-auto mb-2 text-zinc-500 dark:text-zinc-400" />
                )}
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {isImporting ? "Importing..." : "Drop your file here or click to browse"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">.xlsx or .xls</p>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300 space-y-2">
                <p>{error}</p>
                {errorDetails && errorDetails.length > 0 && (
                  <ul className="list-disc list-inside text-red-600 dark:text-red-400">
                    {errorDetails.map((d, i) => (
                      <li key={i}>Row {d.row}: {d.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {result && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm space-y-2">
                <p className="font-medium text-green-800 dark:text-green-200">
                  {result.message}
                </p>
                <p className="text-green-700 dark:text-green-300">
                  Imported: {result.imported} | Total rows: {result.totalRows} | Skipped: {result.skipped}
                </p>
                {result.errors && result.errors.length > 0 && (
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">Row errors:</p>
                    <ul className="list-disc list-inside text-amber-600 dark:text-amber-400">
                      {result.errors.map((e, i) => (
                        <li key={i}>Row {e.row}: {e.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.insertErrors && result.insertErrors.length > 0 && (
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">Insert errors:</p>
                    <ul className="list-disc list-inside text-amber-600 dark:text-amber-400">
                      {result.insertErrors.map((e, i) => (
                        <li key={i}>Row {e.row}: {e.message}</li>
                      ))}
                    </ul>
                    {result.insertErrors.some((e) => /fetch failed|network|ECONNREFUSED/i.test(e.message)) && (
                      <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                        Network error: Check your internet connection and ensure Supabase is reachable. Retry the import.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
