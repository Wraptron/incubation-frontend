"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    role: string;
  } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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
      setCurrentPage(1); // Reset to first page when filter changes
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
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = applications.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of table when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
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
                      router.push(`/dashboard/applications/${app.id}`)
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
                          href={`/dashboard/applications/${app.id}`}
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

        {/* Pagination Controls */}
        {applications.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">{Math.min(endIndex, applications.length)}</span> of{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">{applications.length}</span> teams
            </div>
            <div className="flex items-center gap-1">
              {/* First Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Previous Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-1">
                {getPageNumbers().map((page, index) => {
                  if (page === "ellipsis-start" || page === "ellipsis-end") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 py-1 text-gray-500 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  const pageNum = page as number;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 min-w-[36px] font-medium ${
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              {/* Next Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 px-3"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>

              {/* Last Page Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
