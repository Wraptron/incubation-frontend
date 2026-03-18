"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatStatus } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
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

const VALID_PAGE_SIZES = [10, 25, 50, 100, 150, 200];

interface AppItem {
  id: string;
  company_name?: string;
  team_name?: string;
  founder_name?: string;
  email?: string;
  status?: string;
  created_at?: string;
  submitted_at?: string;
}

function EvaluationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const pageSizeFromUrl = parseInt(searchParams.get("pageSize") ?? "25", 10);
  const [itemsPerPage, setItemsPerPage] = useState(
    VALID_PAGE_SIZES.includes(pageSizeFromUrl) ? pageSizeFromUrl : 25
  );

  const totalPagesComputed = totalCount > 0 ? Math.ceil(totalCount / itemsPerPage) : 1;

  useEffect(() => {
    setCurrentPage(pageFromUrl);
    const ps = parseInt(searchParams.get("pageSize") ?? "25", 10);
    if (VALID_PAGE_SIZES.includes(ps)) setItemsPerPage(ps);
  }, [pageFromUrl, searchParams]);

  useEffect(() => {
    if (totalCount > 0 && currentPage > totalPagesComputed && totalPagesComputed >= 1) {
      setCurrentPage(totalPagesComputed);
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(totalPagesComputed));
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [totalPagesComputed, totalCount, currentPage, router]);

  const fetchEvaluatedApplications = useCallback(
    async (role: string) => {
      try {
        setIsLoading(true);
        const offset = (currentPage - 1) * itemsPerPage;
        const params = new URLSearchParams();
        params.set("limit", String(itemsPerPage));
        params.set("offset", String(offset));

        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }

        const url =
          role === "reviewer"
            ? `/api/evaluations/reviewer/applications?${params.toString()}`
            : `/api/applications?status=evaluated&${params.toString()}`;

        const response = await fetch(url, {
          cache: "no-store",
          headers,
        });

        if (response.status === 403 || response.status === 401) {
          router.push("/dashboard");
          return;
        }

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          console.error("Evaluations list error:", data);
          setApplications([]);
          setTotalCount(0);
          return;
        }

        const data = await response.json();
        setApplications(data.applications ?? []);
        setTotalCount(data.pagination?.total ?? 0);
      } catch (error) {
        console.error("Error fetching evaluated applications:", error);
        setApplications([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [router, currentPage, itemsPerPage]
  );

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) {
          router.push("/login");
          return;
        }
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", u.id)
          .single();

        if (!profile || (profile.role !== "manager" && profile.role !== "reviewer")) {
          router.push("/dashboard");
          return;
        }
        setUser({ id: u.id, role: profile.role });
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetchEvaluatedApplications(user.role);
  }, [user, fetchEvaluatedApplications]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPagesComputed) {
      setCurrentPage(page);
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(page));
      router.replace(url.pathname + url.search, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize, 10);
    setItemsPerPage(size);
    setCurrentPage(1);
    const url = new URL(window.location.href);
    url.searchParams.set("pageSize", String(size));
    url.searchParams.set("page", "1");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      under_review: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      evaluated: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      interview_scheduled:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      interview_completed:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      approved: "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary font-semibold",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[300px]">
            <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2 text-black dark:text-zinc-50">
          Evaluations
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          {user.role === "reviewer"
            ? "Applications you have evaluated. Click to view your evaluation results."
            : "Applications that have been fully evaluated. Click to view evaluation results."}
        </p>

        <Card>
          {applications.length === 0 ? (
            <CardContent className="p-8 text-center text-zinc-500 dark:text-zinc-400">
              {user.role === "reviewer"
                ? "You haven't evaluated any applications yet."
                : "No evaluated applications yet."}
            </CardContent>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team / Startup</TableHead>
                  <TableHead>Founder</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.company_name || app.team_name || "—"}
                    </TableCell>
                    <TableCell>{app.founder_name || "—"}</TableCell>
                    <TableCell>{app.email || "—"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(app.status || "")}>
                        {app.status ? formatStatus(app.status) : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(app.submitted_at || app.created_at)
                        ? new Date(app.submitted_at || app.created_at!).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/dashboard/applications/${app.id}/evaluation-result`}>
                          View Evaluation
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium order-2 sm:order-1">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {Math.min((currentPage - 1) * itemsPerPage + applications.length, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {totalCount}
              </span>{" "}
              applications
            </div>
            <div className="flex items-center gap-4 order-1 sm:order-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                <Select value={String(itemsPerPage)} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[80px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_PAGE_SIZES.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {totalCount > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPagesComputed}
                  onPageChange={handlePageChange}
                  maxVisible={3}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function EvaluationsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[300px]">
              <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
            </div>
          </div>
        </DashboardLayout>
      }
    >
      <EvaluationsContent />
    </Suspense>
  );
}
