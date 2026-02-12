"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { formatStatus } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Application {
  id: string;
  company_name: string;
  email: string;
  founder_name: string;
  status: string;
  reviewer_id: string | null;
  reviewers?: Array<{
    id: string;
    full_name: string | null;
  }>;
  created_at: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    role: string;
  } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const itemsPerPage = 7;
  const prevFilterRef = useRef(filterStatus);

  // Sync state with URL when returning to dashboard (e.g. after closing an application)
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // Clamp current page when total pages changes (e.g. after filter or data load).
  // Only run after applications have loaded; otherwise we'd reset page=3 to 1 while still loading.
  const totalPagesComputed = applications.length ? Math.ceil(applications.length / itemsPerPage) : 1;
  useEffect(() => {
    if (applications.length > 0 && currentPage > totalPagesComputed && totalPagesComputed >= 1) {
      setCurrentPage(totalPagesComputed);
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(totalPagesComputed));
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [totalPagesComputed, applications.length, currentPage]);

  /* =========================
     FETCH APPLICATIONS
  ========================= */
  const fetchApplications = useCallback(async () => {
    try {
      const params = filterStatus !== "all" ? `?status=${filterStatus}` : "";
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const response = await fetch(`/api/applications${params}`, {
        cache: "no-store",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }, [filterStatus]);

  /* =========================
     AUTH CHECK
  ========================= */
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (
          !profile ||
          (profile.role !== "manager" && profile.role !== "reviewer")
        ) {
          router.push("/login");
          return;
        }

        setUser({ ...user, role: profile.role });
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  /* =========================
     REFETCH ON FILTER CHANGE
  ========================= */
  useEffect(() => {
    if (user) {
      fetchApplications();
      if (prevFilterRef.current !== filterStatus) {
        prevFilterRef.current = filterStatus;
        setCurrentPage(1);
        const url = new URL(window.location.href);
        url.searchParams.set("page", "1");
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
  }, [filterStatus, user, fetchApplications]);

  if (isLoading) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      under_review: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      evaluated: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      interview_scheduled:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      approved: "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary font-semibold",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const tabFilters =
    user?.role === "reviewer"
      ? ["all", "pending", "under_review", "evaluated", "rejected"]
      : ["all", "draft", "pending", "under_review", "evaluated", "interview_scheduled", "approved", "rejected"];

  // Calculate pagination
  const totalPages = totalPagesComputed;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = applications.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(page));
      router.replace(url.pathname + url.search, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">Applications for Pre-Incubation</h2>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabFilters.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? "default" : "ghost"}
              onClick={() => setFilterStatus(status)}
            >
              {formatStatus(status)}
            </Button>
          ))}
        </div>

        <Card>
          {applications.length === 0 ? (
            <CardContent className="p-6 text-center text-gray-500">
              No applications found.
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
                {paginatedApplications.map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/applications/${app.id}?fromPage=${currentPage}`)
                    }
                  >
                    <TableCell>{app.company_name}</TableCell>
                    <TableCell>{app.founder_name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                    <Badge className={getStatusColor(app.status)}>
                    {formatStatus(app.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="link" asChild>
                        <Link
                          href={`/dashboard/applications/${app.id}?fromPage=${currentPage}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View →
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
        {applications.length > itemsPerPage && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium order-2 sm:order-1">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {Math.min(endIndex, applications.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {applications.length}
              </span>{" "}
              teams
            </div>
            <div className="order-1 sm:order-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                maxVisible={3}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </DashboardLayout>
    }>
      <DashboardContent />
    </Suspense>
  );
}
