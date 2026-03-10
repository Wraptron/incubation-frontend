"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatStatus } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function EvaluationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvaluatedApplications = useCallback(async (role: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const url =
        role === "reviewer"
          ? "/api/evaluations/reviewer/applications"
          : "/api/applications?status=evaluated&limit=200&offset=0";

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
        return;
      }

      const data = await response.json();
      setApplications(data.applications ?? []);
    } catch (error) {
      console.error("Error fetching evaluated applications:", error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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
      </div>
    </DashboardLayout>
  );
}
