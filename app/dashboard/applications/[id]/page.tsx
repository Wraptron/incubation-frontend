"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatStatus } from "@/lib/utils";
import { extractFilenameFromS3Url } from "@/lib/s3";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Application {
  id: string;
  // Basic Information
  email: string;
  team_name?: string;
  company_name?: string;
  your_name?: string;
  founder_name?: string;
  is_iitm?: string;
  roll_number?: string;
  roll_number_other?: string | null;
  college_name?: string | null;
  current_occupation?: string | null;
  phone_number?: string;
  phone?: string;
  channel?: string;
  channel_other?: string | null;
  co_founders_count?: number;
  faculty_involved?: string | Array<{
    name: string;
    designation: string;
    department: string;
    university: string;
    roleInStartup: string;
  }> | null;
  co_founders?: string | null;
  
  // Entrepreneurship Experience
  prior_entrepreneurship_experience?: string;
  team_prior_entrepreneurship_experience?: string;
  prior_experience_details?: string | null;
  
  // Startup Registration & Funding
  mca_registered?: string;
  dpiit_registered?: string | null;
  dpiit_details?: string | null;
  external_funding?: string | Array<{
    funding: string;
    fundingType: string;
    amount: string;
    description: string;
  }> | null;
  funding_amount?: string | null;
  currently_incubated?: string | null;
  
  // Team Members
  team_members?: string | Array<{
    name: string;
    rollNumber: string;
    email: string;
    degree: string;
    department: string;
    college: string;
    yearOfGraduation: string;
    role: string;
    contactNumber: string;
  }> | null;
  
  // About Nirmaan Program
  nirmaan_can_help?: string;
  pre_incubation_reason?: string;
  heard_about_startups?: string;
  heard_about_nirmaan?: string;
  why_incubator?: string;
  
  // Problem & Solution
  problem_solving?: string;
  problem?: string;
  your_solution?: string;
  solution?: string;
  solution_type?: string;
  solution_type_other?: string | null;
  business_model?: string;
  description?: string;
  
  // Industry & Technologies
  target_industry?: string;
  target_market?: string;
  other_industries?: string[] | null;
  industry_other?: string | null;
  other_industries_other?: string | null;
  technologies_utilized?: string[] | null;
  other_technology_details?: string | null;
  
  // Startup Stage & IP
  startup_stage?: string;
  has_intellectual_property?: string;
  has_potential_intellectual_property?: string;
  
  // Presentation & Proof
  nirmaan_presentation_link?: string;
  has_proof_of_concept?: string;
  proof_of_concept_details?: string | null;
  current_traction?: string | null;
  has_patents_or_papers?: string;
  patents_or_papers_details?: string | null;
  
  // IP Files
  ip_file_link?: string | null;
  potential_ip_file_link?: string | null;
  
  // Seed Fund & Pitch
  seed_fund_utilization_plan?: string;
  pitch_video_link?: string;
  document1_link?: string | null;
  document2_link?: string | null;
  
  // Status & Metadata
  status: string;
  rejection_reason?: string | null;
  reviewer_id?: string | null;
  reviewers?: Array<{
    id: string;
    full_name: string | null;
    email_address?: string | null;
    invite_status?: string;
    invited_at?: string | null;
    responded_at?: string | null;
  }>;
  reviewer?: {
    id: string;
    full_name: string | null;
    email?: string;
  };
  allEvaluationsComplete?: boolean;
  evaluationsCount?: number;
  totalReviewers?: number;
  submitted_at?: string;
  created_at?: string;
  website?: string | null;
  funding_stage?: string | null;
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
  const [selectedToInviteList, setSelectedToInviteList] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [inviteSentForId, setInviteSentForId] = useState<string | null>(null);
  const [isInvitingId, setIsInvitingId] = useState<string | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [evaluations, setEvaluations] = useState<
    Array<{
      id: string;
      reviewer_id: string;
      need_score: number | null;
      novelty_score: number | null;
      feasibility_scalability_score: number | null;
      market_potential_score: number | null;
      impact_score: number | null;
      need_comment: string | null;
      novelty_comment: string | null;
      feasibility_scalability_comment: string | null;
      market_potential_comment: string | null;
      impact_comment: string | null;
      overall_comment: string | null;
      total_score: number | null;
      created_at: string;
      reviewer?: {
        id: string;
        full_name: string | null;
      };
    }>
  >([]);
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
  const [evaluationsError, setEvaluationsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
        fetchAllEvaluations();
      } else if (profile.role === "reviewer") {
        fetchReviewerEvaluation();
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
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const response = await fetch(
        `/api/applications/${params.id}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        setApplication(data.application);
        // Initialize selected reviewers with currently assigned reviewers
        if (data.application.reviewers) {
          setSelectedReviewers(
            data.application.reviewers.map((r: { id: string }) => r.id),
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

  const fetchAllEvaluations = async () => {
    if (!user || user.role !== "manager") return;

    setIsLoadingEvaluations(true);
    setEvaluationsError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setEvaluationsError("Not signed in.");
        setIsLoadingEvaluations(false);
        return;
      }

      const response = await fetch(
        `/api/evaluations/application/${params.id}/all`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      const text = await response.text();
      let data: { error?: string; details?: string; evaluations?: unknown[] } = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        console.error("Evaluations response was not JSON:", text?.slice(0, 200));
        const errMsg =
          response.status >= 500
            ? "Server returned an invalid response."
            : "Failed to load evaluations.";
        setEvaluationsError(errMsg);
        setUpdateMessage(errMsg);
        setTimeout(() => setUpdateMessage(""), 5000);
        setEvaluations([]);
        setIsLoadingEvaluations(false);
        return;
      }

      if (response.ok) {
        type EvaluationItem = {
          id: string;
          reviewer_id: string;
          need_score: number | null;
          novelty_score: number | null;
          feasibility_scalability_score: number | null;
          market_potential_score: number | null;
          impact_score: number | null;
          need_comment: string | null;
          novelty_comment: string | null;
          feasibility_scalability_comment: string | null;
          market_potential_comment: string | null;
          impact_comment: string | null;
          overall_comment: string | null;
          total_score: number | null;
          created_at: string;
          reviewer?: { id: string; full_name: string | null };
        };
        const evaluationsList = (data.evaluations || []) as EvaluationItem[];
        console.log("Fetched evaluations:", evaluationsList.length);
        // Calculate total scores for evaluations that don't have them
        const evaluationsWithScores = evaluationsList.map(
          (evaluation: EvaluationItem) => {
            if (
              evaluation.total_score === null ||
              evaluation.total_score === undefined
            ) {
              const scores = [
                evaluation.need_score,
                evaluation.novelty_score,
                evaluation.feasibility_scalability_score,
                evaluation.market_potential_score,
                evaluation.impact_score,
              ].filter((s) => s !== null && s !== undefined) as number[];
              evaluation.total_score = scores.reduce(
                (sum, score) => sum + score,
                0,
              );
            }
            return evaluation;
          },
        );
        setEvaluations(evaluationsWithScores);
      } else {
        const errMsg = data.details
          ? `${data.error || "Failed to fetch evaluations"}: ${data.details}`
          : data.error || "Failed to fetch evaluations";
        console.error("Failed to fetch evaluations:", response.status, data);
        setEvaluationsError(errMsg);
        setUpdateMessage(errMsg);
        setTimeout(() => setUpdateMessage(""), 5000);
        setEvaluations([]);
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to load evaluations.";
      const friendlyMsg =
        errMsg.toLowerCase().includes("fetch") ||
        errMsg.includes("ECONNREFUSED") ||
        errMsg.toLowerCase().includes("network")
          ? "Could not reach server. Check your connection and that the backend is running."
          : errMsg;
      console.error("Error fetching evaluations:", error);
      setEvaluationsError(friendlyMsg);
      setUpdateMessage(friendlyMsg);
      setTimeout(() => setUpdateMessage(""), 5000);
      setEvaluations([]);
    } finally {
      setIsLoadingEvaluations(false);
    }
  };

  const fetchReviewerEvaluation = async () => {
    if (!user || user.role !== "reviewer") return;

    setIsLoadingEvaluations(true);
    setEvaluationsError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setEvaluationsError("Not signed in.");
        setIsLoadingEvaluations(false);
        return;
      }

      const response = await fetch(
        `/api/evaluations/application/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      const text = await response.text();
      let data: { error?: string; details?: string; evaluation?: unknown } = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        console.error("Evaluation response was not JSON:", text?.slice(0, 200));
        const errMsg =
          response.status >= 500
            ? "Server returned an invalid response."
            : "Failed to load evaluation.";
        setEvaluationsError(errMsg);
        setUpdateMessage(errMsg);
        setTimeout(() => setUpdateMessage(""), 5000);
        setEvaluations([]);
        setIsLoadingEvaluations(false);
        return;
      }

      if (response.ok) {
        if (data.evaluation) {
          // Calculate total score if not present; cast to full evaluation shape for state
          type EvaluationItem = {
            id: string;
            reviewer_id: string;
            need_score: number | null;
            novelty_score: number | null;
            feasibility_scalability_score: number | null;
            market_potential_score: number | null;
            impact_score: number | null;
            need_comment: string | null;
            novelty_comment: string | null;
            feasibility_scalability_comment: string | null;
            market_potential_comment: string | null;
            impact_comment: string | null;
            overall_comment: string | null;
            total_score: number | null;
            created_at: string;
            reviewer?: { id: string; full_name: string | null };
          };
          const evaluation = data.evaluation as EvaluationItem;
          if (
            evaluation.total_score === null ||
            evaluation.total_score === undefined
          ) {
            const scores = [
              evaluation.need_score,
              evaluation.novelty_score,
              evaluation.feasibility_scalability_score,
              evaluation.market_potential_score,
              evaluation.impact_score,
            ].filter((s) => s !== null && s !== undefined) as number[];
            evaluation.total_score = scores.reduce(
              (sum, score) => sum + score,
              0,
            );
          }
          console.log("Fetched reviewer evaluation:", evaluation);
          setEvaluations([evaluation]);
        } else {
          console.log("No evaluation found for reviewer");
          setEvaluations([]);
        }
      } else {
        const errMsg = data.details
          ? `${data.error || "Failed to fetch evaluation"}: ${data.details}`
          : data.error || "Failed to fetch evaluation";
        console.error("Failed to fetch evaluation:", response.status, data);
        setEvaluationsError(errMsg);
        setUpdateMessage(errMsg);
        setTimeout(() => setUpdateMessage(""), 5000);
        setEvaluations([]);
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to load evaluation.";
      const friendlyMsg =
        errMsg.toLowerCase().includes("fetch") ||
        errMsg.includes("ECONNREFUSED") ||
        errMsg.toLowerCase().includes("network")
          ? "Could not reach server. Check your connection and that the backend is running."
          : errMsg;
      console.error("Error fetching evaluation:", error);
      setEvaluationsError(friendlyMsg);
      setUpdateMessage(friendlyMsg);
      setTimeout(() => setUpdateMessage(""), 5000);
      setEvaluations([]);
    } finally {
      setIsLoadingEvaluations(false);
    }
  };

  const updateStatus = async (newStatus: string, reason?: string) => {
    try {
      const body: { status: string; rejectionReason?: string } = {
        status: newStatus,
      };

      if (newStatus === "rejected" && reason) {
        body.rejectionReason = reason;
      }

      const response = await fetch(
        `/api/applications/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        setUpdateMessage(`Status updated to ${formatStatus(newStatus)}`);
        setTimeout(() => setUpdateMessage(""), 3000);
        setShowRejectModal(false);
        setRejectionReason("");
        fetchApplication();
        // Refresh evaluations
        if (user?.role === "manager") {
          fetchAllEvaluations();
        } else if (user?.role === "reviewer") {
          fetchReviewerEvaluation();
        }
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

  // const handleReject = () => {
  //   if (!rejectionReason.trim()) {
  //     setUpdateMessage("Please provide a reason for rejection");
  //     setTimeout(() => setUpdateMessage(""), 3000);
  //     return;
  //   }
  //   updateStatus("rejected", rejectionReason);
  // };

  // const handleReviewerToggle = (reviewerId: string) => {
  //   setSelectedReviewers((prev) => {
  //     if (prev.includes(reviewerId)) {
  //       // Remove reviewer
  //       return prev.filter((id) => id !== reviewerId);
  //     } else {
  //       // Add reviewer (max 5)
  //       if (prev.length >= 5) {
  //         setUpdateMessage("Maximum of 5 reviewers allowed");
  //         setTimeout(() => setUpdateMessage(""), 3000);
  //         return prev;
  //       }
  //       return [...prev, reviewerId];
  //     }
  //   });
  // };

  // const assignReviewers = async () => {
  //   try {
  //     if (selectedReviewers.length === 0) {
  //       setUpdateMessage("Please select at least one reviewer");
  //       setTimeout(() => setUpdateMessage(""), 3000);
  //       return;
  //     }

  //     const response = await fetch(
  //       `/api/applications/${params.id}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           reviewerIds: selectedReviewers,
  //           // Backend will auto-transition from pending to under_review
  //         }),
  //       },
  //     );

  //     if (response.ok) {
  //       setUpdateMessage(
  //         selectedReviewers.length === 1
  //           ? "Reviewer assigned successfully"
  //           : `${selectedReviewers.length} reviewers assigned successfully`,
  //       );
  //       setTimeout(() => setUpdateMessage(""), 3000);
  //       setShowAssignReviewer(false);
  //       fetchApplication();
  //       // Refresh evaluations
  //       if (user?.role === "manager") {
  //         fetchAllEvaluations();
  //       }
  //     } else {
  //       const data = await response.json();
  //       setUpdateMessage(data.error || "Failed to assign reviewers");
  //       setTimeout(() => setUpdateMessage(""), 3000);
  //     }
  //   } catch (error) {
  //     console.error("Error assigning reviewer:", error);
  //     setUpdateMessage("Error assigning reviewer");
  //     setTimeout(() => setUpdateMessage(""), 3000);
  //   }
  // };

  // const getStatusColor = (status: string) => {
  //   const colors: Record<string, string> = {
  //     pending:
  //       "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
  //     under_review:
  //       "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800",
  //     approved:
  //       "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800",
  //     rejected:
  //       "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800",
  //     withdrawn:
  //       "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200 border-gray-200 dark:border-gray-800",
  //   };
  //   return (
  //     colors[status] ||
  //     "bg-gray-100 text-gray-800 border-gray-200 dark:border-gray-800"
  //   );
  // };
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

  const removeReviewer = (reviewerId: string) => {
    setSelectedReviewers((prev) => prev.filter((id) => id !== reviewerId));
  };

  const assignReviewers = async () => {
    try {
      if (selectedReviewers.length < 2) {
        setUpdateMessage("Please select at least 2 reviewers");
        setTimeout(() => setUpdateMessage(""), 3000);
        return;
      }

      // Get reviewer names for logging
      const reviewerNames = selectedReviewers
        .map((id) => {
          const reviewer = availableReviewers.find((r) => r.id === id);
          return reviewer?.full_name || "Unknown";
        })
        .filter(Boolean);

      console.log("📧 Starting reviewer assignment process...");
      console.log(`📋 Application ID: ${params.id}`);
      console.log(`👥 Assigning ${selectedReviewers.length} reviewer(s):`, reviewerNames);
      console.log(`📧 Email notifications will be sent to assigned reviewers`);

      const response = await fetch(
        `/api/applications/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewerIds: selectedReviewers,
            // Backend will auto-transition from pending to under_review
          }),
        },
      );

      if (response.ok) {
            setUpdateMessage(
          `${selectedReviewers.length} reviewers assigned successfully`,
            );
        setTimeout(() => setUpdateMessage(""), 3000);
        setShowAssignReviewer(false);
        setSearchQuery("");
        setShowDropdown(false);
        fetchApplication();
        // Refresh evaluations
        if (user?.role === "manager") {
          fetchAllEvaluations();
        }
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
      
  // Filter reviewers: not already assigned, and match search
  const assignedIds = (application?.reviewers ?? []).map((r) => r.id);
  const filteredReviewers = availableReviewers.filter(
    (reviewer) =>
      !assignedIds.includes(reviewer.id) &&
      (reviewer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false)
  );

  const getSelectedReviewerNames = () => {
    return selectedReviewers
      .map((id) => {
        const reviewer = availableReviewers.find((r) => r.id === id);
        return reviewer?.full_name || "Unknown";
      })
      .filter(Boolean);
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

        {/* Reviewer: Accept or decline assignment */}
        {user?.role === "reviewer" &&
          application.reviewers?.some(
            (r) => r.id === user.id && ((r as { invite_status?: string }).invite_status === "pending" || !(r as { invite_status?: string }).invite_status)
          ) && (
            <Alert className="mb-4 border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
              <AlertDescription>
                <p className="font-medium mb-2">You have been assigned to review this startup.</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Please accept to submit your evaluation, or decline if you cannot review.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      setIsResponding(true);
                      try {
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session?.access_token) {
                          setUpdateMessage("Please log in again.");
                          setTimeout(() => setUpdateMessage(""), 3000);
                          return;
                        }
                        const r = await fetch(
                          `/api/applications/${params.id}/reviewer-respond`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${session.access_token}`,
                            },
                            body: JSON.stringify({ accept: true }),
                          }
                        );
                        const data = await r.json().catch(() => ({}));
                        if (r.ok) {
                          setUpdateMessage("You have accepted the assignment.");
                          setTimeout(() => setUpdateMessage(""), 3000);
                          fetchApplication();
                          fetchReviewerEvaluation();
                        } else {
                          setUpdateMessage(data.error || "Failed to accept");
                          setTimeout(() => setUpdateMessage(""), 3000);
                        }
                      } catch (e) {
                        setUpdateMessage("Failed to respond");
                        setTimeout(() => setUpdateMessage(""), 3000);
                      } finally {
                        setIsResponding(false);
                      }
                    }}
                    disabled={isResponding}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      setIsResponding(true);
                      try {
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session?.access_token) {
                          setUpdateMessage("Please log in again.");
                          setTimeout(() => setUpdateMessage(""), 3000);
                          return;
                        }
                        const r = await fetch(
                          `/api/applications/${params.id}/reviewer-respond`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${session.access_token}`,
                            },
                            body: JSON.stringify({ accept: false }),
                          }
                        );
                        const data = await r.json().catch(() => ({}));
                        if (r.ok) {
                          setUpdateMessage("You have declined the assignment.");
                          setTimeout(() => setUpdateMessage(""), 3000);
                          fetchApplication();
                        } else {
                          setUpdateMessage(data.error || "Failed to decline");
                          setTimeout(() => setUpdateMessage(""), 3000);
                        }
                      } catch (e) {
                        setUpdateMessage("Failed to respond");
                        setTimeout(() => setUpdateMessage(""), 3000);
                      } finally {
                        setIsResponding(false);
                      }
                    }}
                    disabled={isResponding}
                  >
                    Decline
                  </Button>
                </div>
              </AlertDescription>
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
                    {formatStatus(application.status)}
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
                {/* Only managers see the list of assigned reviewers; reviewers cannot see other reviewers */}
                {user?.role === "manager" &&
                  ((application.reviewers && application.reviewers.length > 0) ||
                    application.reviewer_id) ? (
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
                      <div className="mt-1 flex flex-wrap gap-2 items-center">
                        {application.reviewers.map((reviewer) => {
                          const status = (reviewer as { invite_status?: string }).invite_status ?? "pending";
                          const name = reviewer.full_name || "Unknown";
                          return (
                            <div
                              key={reviewer.id}
                              className="flex items-center gap-1 flex-wrap"
                            >
                              {status === "accepted" ? (
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                  {name} <span className="font-normal">(Accepted)</span>
                                </span>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  {name}
                                  {status === "rejected" && " ✗ Rejected"}
                                  {status === "pending" && " (Pending)"}
                                </Badge>
                              )}
                              {status === "rejected" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={async () => {
                                    try {
                                      const r = await fetch(
                                        `/api/applications/${params.id}/reviewers/${reviewer.id}`,
                                        { method: "DELETE" }
                                      );
                                      if (r.ok) {
                                        setUpdateMessage("Reviewer removed. You can invite a new one.");
                                        setTimeout(() => setUpdateMessage(""), 3000);
                                        fetchApplication();
                                        fetchAllEvaluations();
                                      } else {
                                        const d = await r.json();
                                        setUpdateMessage(d.error || "Failed to remove reviewer");
                                        setTimeout(() => setUpdateMessage(""), 3000);
                                      }
                                    } catch (e) {
                                      setUpdateMessage("Failed to remove reviewer");
                                      setTimeout(() => setUpdateMessage(""), 3000);
                                    }
                                  }}
                                >
                                  Reassign
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="font-medium text-black dark:text-zinc-50">
                        {application.reviewer?.full_name || "Unknown"}
                      </span>
                    )}
                  </div>
                ) : user?.role === "manager" ? (
                  <div className="mt-2">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      No reviewers assigned
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Manager: Assign/Manage Reviewers (pending + under_review for reassign) */}
                {user?.role === "manager" &&
                  (application.status === "pending" ||
                    application.status === "under_review") && (
                    <>
                      <Button
                        onClick={() => {
                          setShowAssignReviewer(!showAssignReviewer);
                          if (!showAssignReviewer) {
                            setSelectedToInviteList([]);
                            setInviteSentForId(null);
                            setSearchQuery("");
                            setShowDropdown(false);
                          }
                        }}
                        variant={!showAssignReviewer ? "default" : "outline"}
                        className={!showAssignReviewer ? "" : "border-2 border-primary text-primary hover:bg-primary hover:text-white"}
                      >
                        {showAssignReviewer
                          ? "Close"
                          : application.reviewers &&
                              application.reviewers.length > 0
                            ? "Manage Reviewers"
                            : "Assign Reviewers"}
                      </Button>
                      {application.status === "pending" && (
                        <Button
                          onClick={() => setShowRejectModal(true)}
                          variant="default"
                        >
                          Reject
                        </Button>
                      )}
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
                {/* Reviewer evaluate button: only when assignment accepted */}
                {user?.role === "reviewer" &&
                  (application.status === "pending" ||
                    application.status === "under_review") &&
                  (application.reviewers?.some(
                    (r) =>
                      r.id === user.id &&
                      ((r as { invite_status?: string }).invite_status === "accepted" ||
                        !(r as { invite_status?: string }).invite_status)
                  ) ||
                    application.reviewer_id === user.id) && (
                    <Button
                      onClick={() =>
                        router.push(
                          `/dashboard/applications/${params.id}/evaluate`,
                        )
                      }
                      variant="default"
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
                        variant="default"
                      >
                        Reject
                      </Button>
                    </>
                  )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Manage Reviewers panel: Rejected list + Selected list with Invite/Clear */}
        {showAssignReviewer && user?.role === "manager" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Manage Reviewers</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Invite at least 2 reviewers. Select from dropdown to add to the list, then click Invite (email will be sent). Rejected reviewers can be cancelled and replaced.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rejected reviewers: Cancel and Reassign */}
              {application?.reviewers?.filter(
                (r) => (r as { invite_status?: string }).invite_status === "rejected"
              ).length ? (
                <div>
                  <h4 className="font-medium text-sm mb-2">Rejected reviewers</h4>
                  <ul className="space-y-2">
                    {application.reviewers
                      .filter((r) => (r as { invite_status?: string }).invite_status === "rejected")
                      .map((reviewer) => (
                        <li
                          key={reviewer.id}
                          className="flex items-center gap-2 flex-wrap"
                        >
                          <span className="text-sm text-red-600 dark:text-red-400">
                            {reviewer.full_name || "Unknown"} (Rejected)
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const r = await fetch(
                                  `/api/applications/${params.id}/reviewers/${reviewer.id}`,
                                  { method: "DELETE" }
                                );
                                if (r.ok) {
                                  setUpdateMessage("Reviewer removed. Invite a new reviewer below.");
                                  setTimeout(() => setUpdateMessage(""), 3000);
                                  fetchApplication();
                                  fetchAllEvaluations();
                                } else {
                                  const d = await r.json();
                                  setUpdateMessage(d.error || "Failed to remove");
                                  setTimeout(() => setUpdateMessage(""), 3000);
                                }
                              } catch (e) {
                                setUpdateMessage("Failed to remove reviewer");
                                setTimeout(() => setUpdateMessage(""), 3000);
                              }
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={async () => {
                              try {
                                const r = await fetch(
                                  `/api/applications/${params.id}/reviewers/${reviewer.id}`,
                                  { method: "DELETE" }
                                );
                                if (r.ok) {
                                  fetchApplication();
                                  setUpdateMessage("Reviewer removed. Select and invite a new reviewer below.");
                                  setTimeout(() => setUpdateMessage(""), 3000);
                                  fetchAllEvaluations();
                                }
                              } catch (e) {
                                setUpdateMessage("Failed to remove reviewer");
                                setTimeout(() => setUpdateMessage(""), 3000);
                              }
                            }}
                          >
                            Reassign
                          </Button>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}

              {/* Add reviewer: dropdown + selected list with Invite / Clear */}
              <div>
                <h4 className="font-medium text-sm mb-2">Add reviewer</h4>
                {availableReviewers.length === 0 ? (
                  <p className="text-red-500 text-sm">
                    No reviewers available. Create reviewer accounts first.
                  </p>
                ) : (
                  <>
                    <div className="relative mb-3" ref={dropdownRef}>
                      <input
                        type="text"
                        placeholder="Search and select a reviewer"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring"
                      />
                      {showDropdown && (
                        <ul className="absolute z-50 w-full max-h-48 overflow-y-auto border rounded-md bg-white dark:bg-zinc-800 mt-2 shadow-lg">
                          {filteredReviewers.length === 0 ? (
                            <li className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                              No reviewers found or all already assigned
                            </li>
                          ) : (
                            filteredReviewers.map((reviewer) => {
                              const alreadyInList = selectedToInviteList.some((s) => s.id === reviewer.id);
                              if (alreadyInList) return null;
                              return (
                                <li
                                  key={reviewer.id}
                                  onClick={() => {
                                    setSelectedToInviteList((prev) => {
                                      if (prev.some((s) => s.id === reviewer.id)) return prev;
                                      return [
                                        ...prev,
                                        {
                                          id: reviewer.id,
                                          name: reviewer.full_name || "Unnamed Reviewer",
                                        },
                                      ];
                                    });
                                    setShowDropdown(false);
                                    setSearchQuery("");
                                  }}
                                  className="flex justify-between px-4 py-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 text-sm"
                                >
                                  {reviewer.full_name || "Unnamed Reviewer"}
                                </li>
                              );
                            })
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Selected list: "Selected: Name" [Invite] [Clear] */}
                    {selectedToInviteList.length > 0 && (
                      <ul className="space-y-2">
                        {selectedToInviteList.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-2 flex-wrap text-sm"
                          >
                            <span className="text-zinc-700 dark:text-zinc-300">
                              Selected: <strong>{item.name}</strong>
                            </span>
                            {inviteSentForId === item.id ? (
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                Invite sent
                              </span>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  disabled={isInvitingId !== null}
                                  onClick={async () => {
                                    setIsInvitingId(item.id);
                                    setInviteSentForId(null);
                                    try {
                                      const r = await fetch(
                                        `/api/applications/${params.id}/invite-reviewer`,
                                        {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ reviewerId: item.id }),
                                        }
                                      );
                                      const data = await r.json().catch(() => ({}));
                                      if (r.ok) {
                                        setInviteSentForId(item.id);
                                        setUpdateMessage(
                                          data.emailSent
                                            ? "Invite sent. Email has been sent to the reviewer."
                                            : "Reviewer invited. (Email not sent – set GMAIL_USER and GMAIL_APP_PASSWORD on server.)"
                                        );
                                        setTimeout(() => setUpdateMessage(""), 4000);
                                        fetchApplication();
                                        fetchAllEvaluations();
                                        setTimeout(() => {
                                          setSelectedToInviteList((prev) => prev.filter((p) => p.id !== item.id));
                                          setInviteSentForId(null);
                                        }, 1500);
                                      } else {
                                        setUpdateMessage(data.error || "Failed to invite reviewer");
                                        setTimeout(() => setUpdateMessage(""), 3000);
                                      }
                                    } catch (e) {
                                      setUpdateMessage("Failed to invite reviewer");
                                      setTimeout(() => setUpdateMessage(""), 3000);
                                    } finally {
                                      setIsInvitingId(null);
                                    }
                                  }}
                                >
                                  {isInvitingId === item.id ? "Sending…" : "Invite"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedToInviteList((prev) => prev.filter((p) => p.id !== item.id));
                                  }}
                                >
                                  Clear
                                </Button>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {(application?.reviewers?.length ?? 0) < 2 && (
                      <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
                        ⚠️ Invite at least 2 reviewers for this application.
                      </p>
                    )}
                  </>
                )}
              </div>
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
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                variant="default"
                className="disabled:opacity-50"
              >
                Reject Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="pt-6">
            <Tabs
              defaultValue="startup-info"
              className="w-full"
              onValueChange={(value) => {
                // Refresh evaluations when switching to evaluations tab
                if (value === "evaluations") {
                  if (user?.role === "manager") {
                    fetchAllEvaluations();
                  } else if (user?.role === "reviewer") {
                    fetchReviewerEvaluation();
                  }
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="startup-info">
                  Startup Information
                </TabsTrigger>
                <TabsTrigger value="application-form">
                  Application Form
                </TabsTrigger>
                <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
              </TabsList>

              {/* Startup Information Tab */}
              <TabsContent value="startup-info" className="space-y-6 mt-6">
                {/* Company Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Website
                        </label>
                        {application.website ? (
                          <a
                            href={application.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline block"
                          >
                            {application.website}
                          </a>
                        ) : (
                          <p className="text-black dark:text-zinc-50">N/A</p>
                        )}
                      </div> */}
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
                      {/* <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Co-Founders
                        </label>
                        {Array.isArray(application.team_members) && application.team_members.length > 0 ? (
                          <div className="text-black dark:text-zinc-50">
                            {application.team_members.map((member, idx) => (
                              <div key={idx} className="mb-2">
                                {member.name} ({member.rollNumber})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-black dark:text-zinc-50">
                            {typeof application.team_members === 'string' ? application.team_members : "N/A"}
                          </p>
                        )}
                      </div> */}
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Email
                        </label>
                        <a
                          href={`mailto:${application.email}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline block"
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
                          className="text-blue-600 dark:text-blue-400 hover:underline block"
                        >
                          {application.phone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Application Form Tab */}
              <TabsContent value="application-form" className="space-y-6 mt-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Email
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Team/Startup Name
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.team_name || application.company_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Your Name
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.your_name || application.founder_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Are you from IITM?
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.is_iitm || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Roll Number
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.roll_number || "N/A"}
                        </p>
                      </div>
                      {application.roll_number_other && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Roll Number (Other)
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.roll_number_other}
                          </p>
                        </div>
                      )}
                      {application.college_name && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            College Name
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.college_name}
                          </p>
                        </div>
                      )}
                      {application.current_occupation && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Current Occupation
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.current_occupation}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Phone Number
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.phone_number || application.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Channel
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.channel || "N/A"}
                        </p>
                      </div>
                      {application.channel_other && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Channel (Other)
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.channel_other}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Co-Founders Count
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.co_founders_count ?? "N/A"}
                        </p>
                      </div>
                      {application.faculty_involved && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 block mb-2">
                            Faculty Involved
                          </label>
                          {(() => {
                            // Parse faculty_involved - it can be an array, "NA" string, or null
                            let facultyData: any = application.faculty_involved;
                            
                            // If it's a string, try to parse it
                            if (typeof facultyData === 'string') {
                              if (facultyData === 'NA' || facultyData === '"NA"') {
                                return <p className="text-black dark:text-zinc-50">N/A</p>;
                              }
                              try {
                                facultyData = JSON.parse(facultyData);
                              } catch {
                                // If parsing fails, display as string
                                return <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">{facultyData}</p>;
                              }
                            }
                            
                            // If it's an array, display as table
                            if (Array.isArray(facultyData) && facultyData.length > 0) {
                              return (
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse border border-zinc-300 dark:border-zinc-700">
                                    <thead>
                                      <tr className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700">
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Name</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Designation</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Department</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">University</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">Role in Startup</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {facultyData.map((faculty: any, index: number) => (
                                        <tr key={index} className="border-b border-zinc-200 dark:border-zinc-800">
                                          <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{faculty.name || "N/A"}</td>
                                          <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{faculty.designation || "N/A"}</td>
                                          <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{faculty.department || "N/A"}</td>
                                          <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{faculty.university || "N/A"}</td>
                                          <td className="px-3 py-2 text-black dark:text-zinc-50">{faculty.roleInStartup || "N/A"}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            }
                            
                            // Default fallback
                            return <p className="text-black dark:text-zinc-50">N/A</p>;
                          })()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Entrepreneurship Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle>Entrepreneurship Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Prior Entrepreneurship Experience
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.prior_entrepreneurship_experience || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Team Prior Entrepreneurship Experience
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.team_prior_entrepreneurship_experience || "N/A"}
                        </p>
                      </div>
                      {application.prior_experience_details && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Prior Experience Details
                          </label>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.prior_experience_details}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Startup Registration & Funding */}
                <Card>
                  <CardHeader>
                    <CardTitle>Startup Registration & Funding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          MCA Registered
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.mca_registered || "N/A"}
                        </p>
                      </div>
                      {application.dpiit_registered && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            DPIIT Registered
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.dpiit_registered}
                          </p>
                        </div>
                      )}
                      {application.dpiit_details && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            DPIIT Details
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.dpiit_details}
                          </p>
                        </div>
                      )}
                      {application.external_funding && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 block mb-2">
                            External Funding
                          </label>
                          {(() => {
                            // Parse external_funding - it can be an array, string, or null
                            let fundingData: any = application.external_funding;
                            
                            // If it's a string, try to parse it
                            if (typeof fundingData === 'string') {
                              try {
                                fundingData = JSON.parse(fundingData);
                              } catch {
                                // If parsing fails, display as string
                                return <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">{fundingData}</p>;
                              }
                            }
                            
                            // If it's an array, display as table
                            if (Array.isArray(fundingData) && fundingData.length > 0) {
                              return (
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse border border-zinc-300 dark:border-zinc-700">
                                    <thead>
                                      <tr className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700">
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Funding</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Funding Type</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Amount</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">Description</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {fundingData.map((funding: any, index: number) => (
                                        <tr key={index} className="border-b border-zinc-200 dark:border-zinc-800">
                                          <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{funding.funding || "N/A"}</td>
                                          <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{funding.fundingType || "N/A"}</td>
                                          <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{funding.amount || "N/A"}</td>
                                          <td className="px-3 py-2 text-black dark:text-zinc-50">{funding.description || "N/A"}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            }
                            
                            // Default fallback
                            return <p className="text-black dark:text-zinc-50">N/A</p>;
                          })()}
                        </div>
                      )}
                      {application.currently_incubated && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Currently Incubated
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.currently_incubated}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Parse team_members - it can be an array, string, or null
                      let teamData: any = application.team_members;
                      
                      // If it's a string, try to parse it
                      if (typeof teamData === 'string') {
                        try {
                          teamData = JSON.parse(teamData);
                        } catch {
                          // If parsing fails, display as string
                          return (
                            <div>
                              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Team Members
                              </label>
                              <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                                {teamData}
                              </p>
                            </div>
                          );
                        }
                      }
                      
                      // If it's an array, display as table
                      if (Array.isArray(teamData) && teamData.length > 0) {
                        return (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-zinc-300 dark:border-zinc-700">
                              <thead>
                                <tr className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700">
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Name</th>
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Roll Number</th>
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Email</th>
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Degree</th>
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Department</th>
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">College</th>
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Year of Graduation</th>
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Role</th>
                                  <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">Contact Number</th>

                                </tr>
                              </thead>
                              <tbody>
                                {teamData.map((member: any, index: number) => (
                                  <tr key={index} className="border-b border-zinc-200 dark:border-zinc-800">
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{member.name || "N/A"}</td>
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{member.rollNumber || "N/A"}</td>
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                                      {member.email ? (
                                        <a href={`mailto:${member.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                          {member.email}
                                        </a>
                                      ) : (
                                        "N/A"
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{member.degree || "N/A"}</td>
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{member.department || "N/A"}</td>
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{member.college || "N/A"}</td>
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{member.yearOfGraduation || "N/A"}</td>
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{member.role || "N/A"}</td>
                                    <td className="px-3 py-2 text-black dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">{member.contactNumber || "N/A"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                      
                      // Default fallback
                      return (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Team Members
                          </label>
                          <p className="text-black dark:text-zinc-50">N/A</p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* About Nirmaan Program */}
                <Card>
                  <CardHeader>
                    <CardTitle>About Nirmaan Program</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.nirmaan_can_help && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            How Nirmaan Can Help
                          </label>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.nirmaan_can_help}
                          </p>
                        </div>
                      )}
                      {application.pre_incubation_reason && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Pre-Incubation Reason
                          </label>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.pre_incubation_reason}
                          </p>
                        </div>
                      )}
                      {application.heard_about_startups && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Heard About Startups
                          </label>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.heard_about_startups}
                          </p>
                        </div>
                      )}
                      {application.heard_about_nirmaan && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Heard About Nirmaan
                          </label>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.heard_about_nirmaan}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Problem & Solution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Problem & Solution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Problem Solving
                        </label>
                        <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                          {application.problem_solving || application.problem || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Your Solution
                        </label>
                        <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                          {application.your_solution || application.solution || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Solution Type
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.solution_type || application.business_model || "N/A"}
                          {application.solution_type === "Others" && application.solution_type_other && (
                            <span className="ml-2 text-zinc-600 dark:text-zinc-400">
                              ({application.solution_type_other})
                            </span>
                          )}
                        </p>
                      </div>
                      {application.solution_type === "Others" && application.solution_type_other && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Solution Type (Other Details)
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.solution_type_other}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Industry & Technologies */}
                <Card>
                  <CardHeader>
                    <CardTitle>Industry & Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Target Industry
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.target_industry || application.target_market || "N/A"}
                        </p>
                      </div>
                      {application.industry_other && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Industry (Other)
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.industry_other}
                          </p>
                        </div>
                      )}
                      {application.other_industries && application.other_industries.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Other Industries
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {Array.isArray(application.other_industries) 
                              ? application.other_industries.join(", ")
                              : application.other_industries}
                          </p>
                        </div>
                      )}
                      {application.other_industries_other && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Other Industries (Other)
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.other_industries_other}
                          </p>
                        </div>
                      )}
                      {application.technologies_utilized && application.technologies_utilized.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Technologies Utilized
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {Array.isArray(application.technologies_utilized)
                              ? application.technologies_utilized.join(", ")
                              : application.technologies_utilized}
                          </p>
                        </div>
                      )}
                      {application.other_technology_details && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Other Technology Details
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            {application.other_technology_details}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Startup Stage & IP */}
                <Card>
                  <CardHeader>
                    <CardTitle>Startup Stage & Intellectual Property</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Startup Stage
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.startup_stage || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Has Intellectual Property
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.has_intellectual_property || "N/A"}
                        </p>
                      </div>
                      {application.has_intellectual_property === "Yes" && application.ip_file_link && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            IP Documents
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            <a
                              href={application.ip_file_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {extractFilenameFromS3Url(application.ip_file_link)}
                            </a>
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Has Potential Intellectual Property
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.has_potential_intellectual_property || "N/A"}
                        </p>
                      </div>
                      {application.has_potential_intellectual_property === "Yes" && application.potential_ip_file_link && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Potential IP Documents
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            <a
                              href={application.potential_ip_file_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {extractFilenameFromS3Url(application.potential_ip_file_link)}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Presentation & Proof */}
                <Card>
                  <CardHeader>
                    <CardTitle>Presentation & Proof of Concept</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.nirmaan_presentation_link && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Nirmaan Presentation
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            <a
                              href={application.nirmaan_presentation_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {extractFilenameFromS3Url(application.nirmaan_presentation_link)}
                            </a>
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Has Proof of Concept
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.has_proof_of_concept || "N/A"}
                        </p>
                      </div>
                      {application.proof_of_concept_details && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Proof of Concept Details
                          </label>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.proof_of_concept_details}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Has Patents or Papers
                        </label>
                        <p className="text-black dark:text-zinc-50">
                          {application.has_patents_or_papers || "N/A"}
                        </p>
                      </div>
                      {application.patents_or_papers_details && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Patents or Papers Details
                          </label>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.patents_or_papers_details}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Seed Fund & Pitch */}
                <Card>
                  <CardHeader>
                    <CardTitle>Seed Fund & Pitch Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.seed_fund_utilization_plan && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Seed Fund Utilization Plan
                          </label>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.seed_fund_utilization_plan}
                          </p>
                        </div>
                      )}
                      {application.pitch_video_link && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Pitch Video Link
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            <a
                              href={application.pitch_video_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {application.pitch_video_link}
                            </a>
                          </p>
                        </div>
                      )}
                      {application.document1_link && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Document 1
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            <a
                              href={application.document1_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {extractFilenameFromS3Url(application.document1_link)}
                            </a>
                          </p>
                        </div>
                      )}
                      {application.document2_link && (
                        <div>
                          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Document 2
                          </label>
                          <p className="text-black dark:text-zinc-50">
                            <a
                              href={application.document2_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {extractFilenameFromS3Url(application.document2_link)}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Evaluations Tab */}
              <TabsContent value="evaluations" className="space-y-6 mt-6">
                {isLoadingEvaluations ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Loading evaluations...
                      </p>
                    </CardContent>
                  </Card>
                ) : evaluationsError ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-red-600 dark:text-red-400 mb-4">
                        {evaluationsError}
                      </p>
                      <Button
                        onClick={() => {
                          if (user?.role === "manager") {
                            fetchAllEvaluations();
                          } else if (user?.role === "reviewer") {
                            fetchReviewerEvaluation();
                          }
                        }}
                        variant="default"
                      >
                        Retry
                      </Button>
                    </CardContent>
                  </Card>
                ) : evaluations.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {user?.role === "manager"
                          ? "No evaluations have been submitted yet."
                          : "You haven't submitted an evaluation yet."}
                      </p>
                      {user?.role === "reviewer" &&
                        (application.status === "pending" ||
                          application.status === "under_review") &&
                        (application.reviewers?.some(
                          (r) =>
                            r.id === user.id &&
                            ((r as { invite_status?: string }).invite_status === "accepted" ||
                              !(r as { invite_status?: string }).invite_status)
                        ) ||
                          application.reviewer_id === user.id) && (
                          <Button
                            onClick={() =>
                              router.push(
                                `/dashboard/applications/${params.id}/evaluate`,
                              )
                            }
                            variant="default"
                            className="mt-4"
                          >
                            Start Evaluation
                          </Button>
                        )}
                    </CardContent>
                  </Card>
                ) : (
                  evaluations.map((evaluation) => (
                    <Card key={evaluation.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>
                            Evaluation
                            {evaluation.reviewer && (
                              <span className="text-sm font-normal text-zinc-600 dark:text-zinc-400 ml-2">
                                by {evaluation.reviewer.full_name || "Unknown"}
                              </span>
                            )}
                          </CardTitle>
                          {evaluation.total_score !== null && (
                            <Badge variant="secondary" className="text-lg">
                              Total: {evaluation.total_score}/50
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Submitted:{" "}
                          {new Date(evaluation.created_at).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Need */}
                          {evaluation.need_score !== null && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                  1. Need
                                </label>
                                <Badge variant="secondary">
                                  {evaluation.need_score}/10
                                </Badge>
                              </div>
                              {evaluation.need_comment && (
                                <p className="text-sm text-black dark:text-zinc-50 mt-1">
                                  {evaluation.need_comment}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Novelty */}
                          {evaluation.novelty_score !== null && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                  2. Novelty
                                </label>
                                <Badge variant="secondary">
                                  {evaluation.novelty_score}/10
                                </Badge>
                              </div>
                              {evaluation.novelty_comment && (
                                <p className="text-sm text-black dark:text-zinc-50 mt-1">
                                  {evaluation.novelty_comment}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Feasibility & Scalability */}
                          {evaluation.feasibility_scalability_score !==
                            null && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                  3. Feasibility & Scalability
                                </label>
                                <Badge variant="secondary">
                                  {evaluation.feasibility_scalability_score}/10
                                </Badge>
                              </div>
                              {evaluation.feasibility_scalability_comment && (
                                <p className="text-sm text-black dark:text-zinc-50 mt-1">
                                  {evaluation.feasibility_scalability_comment}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Market Potential */}
                          {evaluation.market_potential_score !== null && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                  4. Market Potential
                                </label>
                                <Badge variant="secondary">
                                  {evaluation.market_potential_score}/10
                                </Badge>
                              </div>
                              {evaluation.market_potential_comment && (
                                <p className="text-sm text-black dark:text-zinc-50 mt-1">
                                  {evaluation.market_potential_comment}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Impact */}
                          {evaluation.impact_score !== null && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                  5. Impact
                                </label>
                                <Badge variant="secondary">
                                  {evaluation.impact_score}/10
                                </Badge>
                              </div>
                              {evaluation.impact_comment && (
                                <p className="text-sm text-black dark:text-zinc-50 mt-1">
                                  {evaluation.impact_comment}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Overall Comment */}
                          {evaluation.overall_comment && (
                            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">
                                Overall Comment
                              </label>
                              <p className="text-sm text-black dark:text-zinc-50">
                                {evaluation.overall_comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
