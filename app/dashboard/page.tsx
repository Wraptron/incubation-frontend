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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatStatus } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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

interface Assignee {
  id: string;
  full_name: string | null;
  email_address: string | null;
  role: string;
  applications: Array<{
    id: string;
    team_name: string | null;
    status: string;
    submitted_at: string | null;
  }>;
}

const VALID_STATUS_FILTERS = ["all", "draft", "pending", "under_review", "evaluated", "interview_scheduled", "interview_completed", "approved", "rejected", "unassigned"];
const VALID_PAGE_SIZES = [10, 25, 50, 100, 150, 200];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    role: string;
  } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const pageSizeFromUrl = parseInt(searchParams.get("pageSize") ?? "25", 10);
  const [itemsPerPage, setItemsPerPage] = useState(
    VALID_PAGE_SIZES.includes(pageSizeFromUrl) ? pageSizeFromUrl : 25
  );
  const searchFromUrl = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const prevFilterRef = useRef(filterStatus);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tabFromUrl = searchParams.get("tab") ?? "status";
  const [activeTab, setActiveTab] = useState<"status" | "reviewers">(
    tabFromUrl === "reviewers" ? "reviewers" : "status"
  );
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [assigneesLoading, setAssigneesLoading] = useState(false);
  const [reviewersSearchInput, setReviewersSearchInput] = useState("");

  // Search as you type: debounce and update URL so fetch runs.
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      searchDebounceRef.current = null;
      const q = searchInput.trim();
      const currentSearch = searchParams.get("search") ?? "";
      if (q === currentSearch) return;
      const url = new URL(window.location.href);
      url.searchParams.set("page", "1");
      if (q) url.searchParams.set("search", q);
      else url.searchParams.delete("search");
      if (filterStatus !== "all") url.searchParams.set("status", filterStatus);
      if (itemsPerPage !== 25) url.searchParams.set("pageSize", String(itemsPerPage));
      router.replace(url.pathname + url.search, { scroll: false });
    }, 300);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchInput]);

  // Sync state with URL when returning to dashboard (e.g. after closing an application).
  // Restores tab (status), page, and search so "Back" returns to same view.
  const statusFromUrl = searchParams.get("status") ?? "all";
  useEffect(() => {
    setCurrentPage(pageFromUrl);
    if (VALID_STATUS_FILTERS.includes(statusFromUrl)) {
      setFilterStatus(statusFromUrl);
      prevFilterRef.current = statusFromUrl;
    }
    const pageSizeFromUrl = parseInt(searchParams.get("pageSize") ?? "25", 10);
    if (VALID_PAGE_SIZES.includes(pageSizeFromUrl)) {
      setItemsPerPage(pageSizeFromUrl);
    }
    setSearchInput(searchFromUrl);
    const t = searchParams.get("tab") ?? "status";
    if (t === "reviewers" || t === "status") {
      setActiveTab(t);
    }
  }, [pageFromUrl, statusFromUrl, searchFromUrl, searchParams]);

  const totalPagesComputed = totalCount > 0 ? Math.ceil(totalCount / itemsPerPage) : 1;

  // Clamp current page when total pages changes (e.g. after filter or data load).
  useEffect(() => {
    if (totalCount > 0 && currentPage > totalPagesComputed && totalPagesComputed >= 1) {
      setCurrentPage(totalPagesComputed);
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(totalPagesComputed));
      if (filterStatus !== "all") url.searchParams.set("status", filterStatus);
      if (itemsPerPage !== 25) url.searchParams.set("pageSize", String(itemsPerPage));
      if (searchFromUrl) url.searchParams.set("search", searchFromUrl);
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [totalPagesComputed, totalCount, currentPage, filterStatus, itemsPerPage, searchFromUrl]);

  /* =========================
     FETCH APPLICATIONS (server-side pagination)
  ========================= */
  const fetchApplications = useCallback(async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (searchFromUrl) params.set("search", searchFromUrl);
      params.set("limit", String(itemsPerPage));
      params.set("offset", String(offset));
      const query = params.toString() ? `?${params.toString()}` : "";
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const response = await fetch(`/api/applications${query}`, {
        cache: "no-store",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data.applications || []);
      setTotalCount(data.pagination?.total ?? 0);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }, [filterStatus, currentPage, itemsPerPage, searchFromUrl]);

  /* =========================
     REFETCH ON PAGE OR FILTER CHANGE
  ========================= */
  useEffect(() => {
    if (!user) return;
    if (prevFilterRef.current !== filterStatus) {
      prevFilterRef.current = filterStatus;
      setCurrentPage(1);
      const url = new URL(window.location.href);
      url.searchParams.set("page", "1");
      if (filterStatus !== "all") {
        url.searchParams.set("status", filterStatus);
      } else {
        url.searchParams.delete("status");
      }
      if (searchFromUrl) url.searchParams.set("search", searchFromUrl);
      router.replace(url.pathname + url.search, { scroll: false });
      return;
    }
    fetchApplications();
  }, [filterStatus, currentPage, user, fetchApplications]);

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
     FETCH STATUS COUNTS (for tab badges)
  ========================= */
  const fetchStatusCounts = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const response = await fetch("/api/applications/counts", {
        cache: "no-store",
        headers,
      });
      if (!response.ok) return;
      const data = await response.json();
      setStatusCounts(data.counts ?? {});
    } catch (error) {
      console.error("Error fetching application counts:", error);
    }
  }, []);

  useEffect(() => {
    if (user) fetchStatusCounts();
  }, [user, fetchStatusCounts]);

  /* =========================
     FETCH REVIEWERS ASSIGNMENTS (managers only)
  ========================= */
  const fetchAssignees = useCallback(async () => {
    if (user?.role !== "manager") return;
    setAssigneesLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const response = await fetch("/api/applications/reviewers-assignments", {
        cache: "no-store",
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        const msg = data?.details ?? data?.error ?? "Failed to fetch reviewers assignments";
        throw new Error(msg);
      }
      setAssignees(data.assignees ?? []);
    } catch (error) {
      console.error("Error fetching reviewers assignments:", error);
      setAssignees([]);
    } finally {
      setAssigneesLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === "manager" && activeTab === "reviewers") {
      fetchAssignees();
    }
  }, [user?.role, activeTab, fetchAssignees]);

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
      interview_completed:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      approved: "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary font-semibold",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const tabFilters =
    user?.role === "reviewer"
      ? ["all", "pending", "under_review", "evaluated", "rejected"]
      : ["all", "draft", "pending", "unassigned", "under_review", "evaluated", "interview_scheduled", "interview_completed", "approved", "rejected"];

  const totalPages = totalPagesComputed;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = applications;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(page));
      if (filterStatus !== "all") url.searchParams.set("status", filterStatus);
      if (searchFromUrl) url.searchParams.set("search", searchFromUrl);
      router.replace(url.pathname + url.search, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize, 10);
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page when changing page size
    const url = new URL(window.location.href);
    url.searchParams.set("pageSize", String(size));
    url.searchParams.set("page", "1");
    if (filterStatus !== "all") url.searchParams.set("status", filterStatus);
    if (searchFromUrl) url.searchParams.set("search", searchFromUrl);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const handleTabChange = (value: string) => {
    const tab = value === "reviewers" ? "reviewers" : "status";
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === "reviewers") url.searchParams.set("tab", "reviewers");
    else url.searchParams.delete("tab");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const showTabs = user?.role === "manager";

  const statusTabContent = (
    <>
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

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabFilters.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filterStatus === status ? "default" : "ghost"}
            onClick={() => setFilterStatus(status)}
          >
            {status === "unassigned" ? "Unassigned Reviewer" : formatStatus(status)}
            <span className="ml-1.5 opacity-90">
              ({statusCounts[status] ?? "—"})
            </span>
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
                    router.push(`/dashboard/applications/${app.id}?fromPage=${currentPage}&fromStatus=${filterStatus}&fromPageSize=${itemsPerPage}`)
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
                        href={`/dashboard/applications/${app.id}?fromPage=${currentPage}&fromStatus=${filterStatus}&fromPageSize=${itemsPerPage}`}
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

      {totalCount > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium order-2 sm:order-1">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {Math.min(startIndex + applications.length, totalCount)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {totalCount}
            </span>{" "}
            teams
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
                totalPages={totalPages}
                onPageChange={handlePageChange}
                maxVisible={3}
              />
            )}
          </div>
        </div>
      )}
    </>
  );

  const filteredAssignees = assignees.filter((a) => {
    const q = reviewersSearchInput.trim().toLowerCase();
    if (!q) return true;
    const name = (a.full_name ?? "").toLowerCase();
    const email = (a.email_address ?? "").toLowerCase();
    const role = (a.role ?? "").toLowerCase();
    const appNames = a.applications.map((app) => (app.team_name ?? "").toLowerCase()).join(" ");
    return name.includes(q) || email.includes(q) || role.includes(q) || appNames.includes(q);
  });

  const reviewersTabContent = (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search by name, email, role, or application..."
            value={reviewersSearchInput}
            onChange={(e) => setReviewersSearchInput(e.target.value)}
            className="h-9"
          />
        </div>
      </div>
      <Card>
      {assigneesLoading ? (
        <CardContent className="p-6 text-center text-gray-500">
          Loading reviewers and managers...
        </CardContent>
      ) : assignees.length === 0 ? (
        <CardContent className="p-6 text-center text-gray-500">
          No reviewers or managers assigned to applications yet.
        </CardContent>
      ) : filteredAssignees.length === 0 ? (
        <CardContent className="p-6 text-center text-gray-500">
          No reviewers or managers match your search.
        </CardContent>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assigned Applications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignees.map((assignee) => (
              <TableRow key={assignee.id}>
                <TableCell className="font-medium">
                  {assignee.full_name ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={assignee.role === "manager" ? "default" : "secondary"}>
                    {assignee.role === "manager" ? "Manager" : "Reviewer"}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {assignee.email_address ?? "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {assignee.applications.map((app) => (
                      <Link
                        key={app.id}
                        href={`/dashboard/applications/${app.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <span className="font-medium truncate max-w-[180px]">
                          {app.team_name ?? "Untitled"}
                        </span>
                        <Badge className={getStatusColor(app.status)} variant="outline">
                          {formatStatus(app.status)}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
    </>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">Applications for Pre-Incubation</h2>

        {showTabs ? (
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="reviewers">Reviewers</TabsTrigger>
            </TabsList>
            <TabsContent value="status" className="mt-0">
              {statusTabContent}
            </TabsContent>
            <TabsContent value="reviewers" className="mt-0">
              {reviewersTabContent}
            </TabsContent>
          </Tabs>
        ) : (
          statusTabContent
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
