"use client";

import { useCallback, useEffect, useState } from "react";
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
  founder_name?: string;
  email?: string;
  status?: string;
  created_at?: string;
}

export default function EvaluatePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssignedApplications = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const response = await fetch("/api/evaluation/applications", {
        cache: "no-store",
        headers,
      });

      if (response.status === 403 || response.status === 401) {
        router.push("/dashboard");
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("Elevation applications error:", data);
        setApplications([]);
        return;
      }

      const data = await response.json();
      setApplications(data.applications ?? []);
    } catch (error) {
      console.error("Error fetching evaluation applications:", error);
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

        if (!profile || profile.role !== "manager") {
          router.push("/dashboard");
          return;
        }
        setUser({ id: u.id, role: profile.role });
        await fetchAssignedApplications();
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      }
    };
    checkUser();
  }, [router, fetchAssignedApplications]);

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
          Evaluate
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Applications assigned to you for evaluation.
        </p>

        <Card>
          {applications.length === 0 ? (
            <CardContent className="p-8 text-center text-zinc-500 dark:text-zinc-400">
              No applications assigned to you for evaluation.
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
                  <TableRow
                    key={app.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/applications/${app.id}/evaluate`)
                    }
                  >
                    <TableCell className="font-medium">
                      {app.company_name || "—"}
                    </TableCell>
                    <TableCell>{app.founder_name || "—"}</TableCell>
                    <TableCell>{app.email || "—"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(app.status || "")}>
                        {app.status ? formatStatus(app.status) : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {app.created_at
                        ? new Date(app.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/dashboard/applications/${app.id}/evaluate`}>
                          Evaluate
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
