"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  reviewer?: {
    id: string;
    full_name: string | null;
  };
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchApplications = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const response = await fetch(`${backendUrl}/api/applications${params}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched applications:", data);
        setApplications(data.applications || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error fetching applications:", response.status, errorData);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [filterStatus, user]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Check user role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.role !== 'manager' && profile.role !== 'reviewer')) {
        router.push('/login');
        return;
      }

      setUser({ ...user, role: profile.role });
      fetchApplications();
    } catch (error) {
      console.error("Error checking user:", error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if DashboardLayout handles auth
  if (isLoading) {
    return null;
  }


  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
      under_review: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      approved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800",
      withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200 border-gray-200 dark:border-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200 dark:border-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
            Startup Applications
          </h2>
          
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setFilterStatus("all")}
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
            >
              All
            </Button>
            <Button
              onClick={() => setFilterStatus("pending")}
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
            >
              Pending
            </Button>
            <Button
              onClick={() => setFilterStatus("under_review")}
              variant={filterStatus === "under_review" ? "default" : "outline"}
              size="sm"
            >
              Under Review
            </Button>
            <Button
              onClick={() => setFilterStatus("approved")}
              variant={filterStatus === "approved" ? "default" : "outline"}
              size="sm"
            >
              Approved
            </Button>
            <Button
              onClick={() => setFilterStatus("rejected")}
              variant={filterStatus === "rejected" ? "default" : "outline"}
              size="sm"
            >
              Rejected
            </Button>
          </div>
        </div>

        <Card>
          {applications.length === 0 ? (
            <CardContent className="p-8 text-center text-zinc-600 dark:text-zinc-400">
              No applications found.
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Founder</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow
                      key={app.id}
                      onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {app.company_name}
                      </TableCell>
                      <TableCell>{app.founder_name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.reviewers && app.reviewers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {app.reviewers.slice(0, 2).map((reviewer) => (
                              <Badge
                                key={reviewer.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {reviewer.full_name || "Unknown"}
                              </Badge>
                            ))}
                            {app.reviewers.length > 2 && (
                              <span className="text-xs text-zinc-500">
                                +{app.reviewers.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : app.reviewer?.full_name ? (
                          app.reviewer.full_name
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-600">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="link" asChild onClick={(e) => e.stopPropagation()}>
                          <Link href={`/dashboard/applications/${app.id}`}>
                            View →
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
