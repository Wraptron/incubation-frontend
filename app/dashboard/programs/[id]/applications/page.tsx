"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProgramApplications, useProgramForm } from "@/lib/program-forms/hooks";
import { applicationTableRow } from "@/lib/program-forms/utils";
import { formatStatus, getApplicationStatusColor } from "@/lib/utils";

export default function ProgramApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = String(params.id);
  const { form } = useProgramForm(formId);
  const { applications, loading, error } = useProgramApplications(formId);
  const [searchInput, setSearchInput] = useState("");

  const filtered = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return applications;

    return applications.filter((app) => {
      const { teamName, founderName, email } = applicationTableRow(app);
      const haystack = [teamName, founderName, email]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [applications, searchInput]);

  const pageTitle = form?.title
    ? `Applications for ${form.title}`
    : "Applications";

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href={`/dashboard/programs/${formId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to builder
          </Link>
        </Button>

        <h2 className="text-2xl font-bold mb-4">{pageTitle}</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search by team name, founder, or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <Card>
          {loading ? (
            <CardContent className="flex items-center justify-center gap-2 py-12 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading applications…
            </CardContent>
          ) : filtered.length === 0 ? (
            <CardContent className="p-6 text-center text-gray-500">
              {applications.length === 0
                ? "No applications found."
                : "No applications match your search."}
            </CardContent>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Founder</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => {
                  const { teamName, founderName, email } =
                    applicationTableRow(app);
                  const detailHref = `/dashboard/programs/${formId}/applications/${app.id}`;

                  return (
                    <TableRow
                      key={app.id}
                      className="cursor-pointer"
                      onClick={() => router.push(detailHref)}
                    >
                      <TableCell>{teamName}</TableCell>
                      <TableCell>{founderName}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>
                        <Badge
                          className={getApplicationStatusColor(
                            app.status || "pending"
                          )}
                        >
                          {formatStatus(app.status || "pending")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.submitted_at
                          ? new Date(app.submitted_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="link" asChild>
                          <Link href={detailHref} onClick={(e) => e.stopPropagation()}>
                            View →
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
