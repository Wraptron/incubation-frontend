"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Application {
  id: string;
  company_name: string;
  website: string;
  description: string;
  founder_name: string;
  co_founders: string;
  email: string;
  phone: string;
  problem: string;
  solution: string;
  target_market: string;
  business_model: string;
  funding_stage: string;
  funding_amount: string;
  current_traction: string;
  why_incubator: string;
  status: string;
  rejection_reason?: string | null;
  reviewer_id: string | null;
  reviewers?: Array<{
    id: string;
    full_name: string | null;
  }>;
  reviewer?: {
    id: string;
    full_name: string | null;
    email?: string;
  };
  allEvaluationsComplete?: boolean;
  evaluationsCount?: number;
  totalReviewers?: number;
  created_at: string;
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    role: string;
  } | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string>("");
  const [availableReviewers, setAvailableReviewers] = useState<
    Array<{ id: string; full_name: string | null }>
  >([]);
  const [showAssignReviewer, setShowAssignReviewer] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      fetchApplication();

      // If manager, fetch reviewers list for assignment
      if (profile.role === "manager") {
        fetchReviewers();
      }
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/login");
    }
  };

  const fetchReviewers = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, full_name")
        .eq("role", "reviewer");

      if (error) {
        console.error("Error fetching reviewers:", error);
        return;
      }

      if (data) {
        console.log("Fetched reviewers:", data);
        setAvailableReviewers(data);
      } else {
        console.log("No reviewers found in database");
      }
    } catch (error) {
      console.error("Error fetching reviewers:", error);
    }
  };

  const fetchApplication = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${backendUrl}/api/applications/${params.id}`
      );

      if (response.ok) {
        const data = await response.json();
        setApplication(data.application);
        // Initialize selected reviewers with currently assigned reviewers
        if (data.application.reviewers) {
          setSelectedReviewers(
            data.application.reviewers.map((r: { id: string }) => r.id)
          );
        }
      } else {
        console.error("Failed to fetch application");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string, reason?: string) => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const body: { status: string; rejectionReason?: string } = {
        status: newStatus,
      };

      if (newStatus === "rejected" && reason) {
        body.rejectionReason = reason;
      }

      const response = await fetch(
        `${backendUrl}/api/applications/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        setUpdateMessage(`Status updated to ${newStatus.replace("_", " ")}`);
        setTimeout(() => setUpdateMessage(""), 3000);
        setShowRejectModal(false);
        setRejectionReason("");
        fetchApplication();
      } else {
        const data = await response.json();
        setUpdateMessage(data.error || "Failed to update status");
        setTimeout(() => setUpdateMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateMessage("Error updating status");
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setUpdateMessage("Please provide a reason for rejection");
      setTimeout(() => setUpdateMessage(""), 3000);
      return;
    }
    updateStatus("rejected", rejectionReason);
  };

  const handleReviewerToggle = (reviewerId: string) => {
    setSelectedReviewers((prev) => {
      if (prev.includes(reviewerId)) {
        // Remove reviewer
        return prev.filter((id) => id !== reviewerId);
      } else {
        // Add reviewer (max 5)
        if (prev.length >= 5) {
          setUpdateMessage("Maximum of 5 reviewers allowed");
          setTimeout(() => setUpdateMessage(""), 3000);
          return prev;
        }
        return [...prev, reviewerId];
      }
    });
  };

  const assignReviewers = async () => {
    try {
      if (selectedReviewers.length === 0) {
        setUpdateMessage("Please select at least one reviewer");
        setTimeout(() => setUpdateMessage(""), 3000);
        return;
      }

      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${backendUrl}/api/applications/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewerIds: selectedReviewers,
            // Backend will auto-transition from pending to under_review
          }),
        }
      );

      if (response.ok) {
        setUpdateMessage(
          selectedReviewers.length === 1
            ? "Reviewer assigned successfully"
            : `${selectedReviewers.length} reviewers assigned successfully`
        );
        setTimeout(() => setUpdateMessage(""), 3000);
        setShowAssignReviewer(false);
        fetchApplication();
      } else {
        const data = await response.json();
        setUpdateMessage(data.error || "Failed to assign reviewers");
        setTimeout(() => setUpdateMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error assigning reviewer:", error);
      setUpdateMessage("Error assigning reviewer");
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
      under_review:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      approved:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800",
      rejected:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800",
      withdrawn:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200 border-gray-200 dark:border-gray-800",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 border-gray-200 dark:border-gray-800"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">
          Application not found
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Button
            variant="link"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            ← Back to Applications
          </Button>
        </div>
        {updateMessage && (
          <Alert
            variant={
              updateMessage.includes("Failed") ||
              updateMessage.includes("Error")
                ? "destructive"
                : "default"
            }
            className="mb-4"
          >
            <AlertDescription>{updateMessage}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">
                  {application.company_name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Status:
                  </span>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace("_", " ")}
                  </Badge>
                </div>
                {application.status === "rejected" &&
                  application.rejection_reason && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        <p className="font-medium mb-1">Rejection Reason:</p>
                        <p>{application.rejection_reason}</p>
                      </AlertDescription>
                    </Alert>
                  )}
                {(application.reviewers && application.reviewers.length > 0) ||
                application.reviewer_id ? (
                  <div className="mt-2">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Assigned Reviewer
                      {application.reviewers && application.reviewers.length > 1
                        ? "s"
                        : ""}
                      :{" "}
                    </span>
                    {application.reviewers &&
                    application.reviewers.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {application.reviewers.map((reviewer) => (
                          <Badge
                            key={reviewer.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {reviewer.full_name || "Unknown"}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="font-medium text-black dark:text-zinc-50">
                        {application.reviewer?.full_name || "Unknown"}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      No reviewers assigned
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Manager actions in pending phase */}
                {user?.role === "manager" &&
                  application.status === "pending" && (
                    <>
                      <Button
                        onClick={() => {
                          setShowAssignReviewer(!showAssignReviewer);
                          // Initialize selected reviewers when opening
                          if (!showAssignReviewer && application.reviewers) {
                            setSelectedReviewers(
                              application.reviewers.map((r) => r.id)
                            );
                          }
                        }}
                      >
                        {showAssignReviewer
                          ? "Cancel"
                          : application.reviewers &&
                            application.reviewers.length > 0
                          ? "Manage Reviewers"
                          : "Assign Reviewers"}
                      </Button>
                      <Button
                        onClick={() => setShowRejectModal(true)}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </>
                  )}

                {/* Reviewer evaluate button */}
                {user?.role === "reviewer" &&
                  application.status === "under_review" &&
                  application.reviewers?.some((r) => r.id === user.id) && (
                    <Button
                      onClick={() =>
                        router.push(
                          `/dashboard/applications/${params.id}/evaluate`
                        )
                      }
                    >
                      Evaluate
                    </Button>
                  )}

                {/* Manager actions when all evaluations are complete */}
                {user?.role === "manager" &&
                  application.status === "under_review" &&
                  application.allEvaluationsComplete &&
                  application.totalReviewers &&
                  application.totalReviewers > 0 && (
                    <>
                      <Button
                        onClick={() => updateStatus("approved")}
                        variant="default"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => setShowRejectModal(true)}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </>
                  )}

                {/* Evaluation status indicator */}
                {application.status === "under_review" &&
                  application.totalReviewers &&
                  application.totalReviewers > 0 && (
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 px-4 py-2">
                      Evaluations: {application.evaluationsCount || 0}/
                      {application.totalReviewers}
                      {application.allEvaluationsComplete && (
                        <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                          ✓ Complete
                        </span>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Assign Reviewers Section */}
        {showAssignReviewer && user?.role === "manager" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assign Reviewers (up to 5)</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Select up to 5 reviewers for this application. Currently
                selected: {selectedReviewers.length}/5
              </p>
            </CardHeader>
            <CardContent>
              {availableReviewers.length === 0 ? (
                <p className="text-zinc-600 dark:text-zinc-400">
                  No reviewers available. Please create reviewer accounts first.
                </p>
              ) : (
                <div className="space-y-3">
                  {availableReviewers.map((reviewer) => (
                    <label
                      key={reviewer.id}
                      className="flex items-center space-x-3 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedReviewers.includes(reviewer.id)}
                        onChange={() => handleReviewerToggle(reviewer.id)}
                        disabled={
                          !selectedReviewers.includes(reviewer.id) &&
                          selectedReviewers.length >= 5
                        }
                        className="w-4 h-4 text-black border-zinc-300 rounded focus:ring-2 focus:ring-black dark:focus:ring-zinc-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-black dark:text-zinc-50">
                          {reviewer.full_name || "Unnamed Reviewer"}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          ID: {reviewer.id.substring(0, 8)}...
                        </div>
                      </div>
                    </label>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={assignReviewers}
                      disabled={selectedReviewers.length === 0}
                    >
                      Assign{" "}
                      {selectedReviewers.length > 0
                        ? `${selectedReviewers.length} `
                        : ""}
                      Reviewer{selectedReviewers.length !== 1 ? "s" : ""}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAssignReviewer(false);
                        // Reset selection when canceling
                        if (application?.reviewers) {
                          setSelectedReviewers(
                            application.reviewers.map((r) => r.id)
                          );
                        } else {
                          setSelectedReviewers([]);
                        }
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reject Modal */}
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this application. This
                reason will be visible to the applicant.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="min-h-[100px]"
                required
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                variant="destructive"
              >
                Reject Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Website
                  </label>
                  {application.website ? (
                    <a
                      href={application.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {application.website}
                    </a>
                  ) : (
                    <p className="text-black dark:text-zinc-50">N/A</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Description
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Founder Information */}
          <Card>
            <CardHeader>
              <CardTitle>Founder Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Founder Name
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.founder_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Co-Founders
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.co_founders || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Email
                  </label>
                  <a
                    href={`mailto:${application.email}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {application.email}
                  </a>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Phone
                  </label>
                  <a
                    href={`tel:${application.phone}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {application.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Problem
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.problem}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Solution
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.solution}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Target Market
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.target_market}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Business Model
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.business_model}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding & Traction */}
          <Card>
            <CardHeader>
              <CardTitle>Funding & Traction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Funding Stage
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.funding_stage?.replace("_", " ") || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Funding Amount
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.funding_amount || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Current Traction
                  </label>
                  <p className="text-black dark:text-zinc-50">
                    {application.current_traction || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Incubator */}
          <Card>
            <CardHeader>
              <CardTitle>Why Our Incubator?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-black dark:text-zinc-50">
                {application.why_incubator}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
