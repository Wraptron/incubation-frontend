"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProgramApplications } from "@/lib/program-forms/hooks";
import { formatDateTime } from "@/lib/program-forms/utils";
import { formatStatus } from "@/lib/utils";

export default function ProgramApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = String(params.id);
  const { applications, loading, error } = useProgramApplications(formId);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return applications;
    return applications.filter((a) => a.status === statusFilter);
  }, [applications, statusFilter]);

  const statuses = useMemo(() => {
    const set = new Set(applications.map((a) => a.status));
    return Array.from(set);
  }, [applications]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
              <Link href={`/dashboard/programs/${formId}`}>
                <ArrowLeft className="h-4 w-4" />
                Back to builder
              </Link>
            </Button>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Applications
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Responses submitted against this program form.
            </p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {formatStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant / Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviewers</TableHead>
                <TableHead>Avg score</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-zinc-500">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </span>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-zinc-500">
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer hover:bg-zinc-50"
                    onClick={() =>
                      router.push(
                        `/dashboard/programs/${formId}/applications/${app.id}`
                      )
                    }
                  >
                    <TableCell>
                      <div className="font-medium text-zinc-900">
                        {app.team_name || app.applicant_name}
                      </div>
                      {app.team_name && (
                        <div className="text-xs text-zinc-500">
                          {app.applicant_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatStatus(app.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      {app.reviewers.length === 0
                        ? "—"
                        : app.reviewers
                            .map((r) => r.full_name || "Reviewer")
                            .join(", ")}
                    </TableCell>
                    <TableCell>
                      {app.avg_score !== null ? app.avg_score : "—"}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {app.submitted_at
                        ? formatDateTime(app.submitted_at)
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
