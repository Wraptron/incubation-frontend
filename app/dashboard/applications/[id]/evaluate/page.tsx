"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

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
  faculty_involved?: string | null;
  co_founders?: string | null;
  
  // Entrepreneurship Experience
  prior_entrepreneurship_experience?: string;
  team_prior_entrepreneurship_experience?: string;
  prior_experience_details?: string | null;
  
  // Startup Registration & Funding
  mca_registered?: string;
  dpiit_registered?: string | null;
  dpiit_details?: string | null;
  external_funding?: string | null;
  funding_amount?: string | null;
  currently_incubated?: string | null;
  
  // Team Members
  team_members?: string;
  
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
  
  // Seed Fund & Pitch
  seed_fund_utilization_plan?: string;
  pitch_video_link?: string;
  document1_link?: string | null;
  document2_link?: string | null;
  
  // Status & Metadata
  status: string;
  website?: string | null;
  funding_stage?: string | null;
  created_at?: string;
}

interface Evaluation {
  id?: string;
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
  total_score?: number;
}

const EVALUATION_CRITERIA = [
  {
    id: "need",
    label: "1. Need",
    description:
      "Why is the applicant's idea/innovation required in the market? What customer needs are being satisfied or will be satisfied through their idea/innovation? Are they able to provide some background information or insights?",
    scoreKey: "needScore" as const,
    commentKey: "needComment" as const,
  },
  {
    id: "novelty",
    label: "2. Novelty",
    description:
      "What is the novelty or uniqueness of the idea/innovation. What is the unique selling proposition (USP)? Does the applicant have any intellectual property rights over this idea?",
    scoreKey: "noveltyScore" as const,
    commentKey: "noveltyComment" as const,
  },
  {
    id: "feasibility",
    label: "3. Feasibility & Scalability",
    description:
      "How feasible is the solution? If the applicant is at idea stage, then how will the idea be implemented in future? If the applicant is at a prototype/product stage, then are they providing any technical details of the idea/innovation. Could the applicant provide details about its pilot and how is it currently being implemented? How scalable is the idea/innovation (in terms of production/ distribution/ consumption/ service/ market locations and/or application etc.)?",
    scoreKey: "feasibilityScalabilityScore" as const,
    commentKey: "feasibilityScalabilityComment" as const,
  },
  {
    id: "market",
    label: "4. Market Potential",
    description:
      "What is the applicant's understanding of the target market & who are the customers (buyers and/or consumers)? Are there any competitors or alternative solutions available in the market? What marketing strategy or marketing plan do they have to target this market and acquire customers?",
    scoreKey: "marketPotentialScore" as const,
    commentKey: "marketPotentialComment" as const,
  },
  {
    id: "impact",
    label: "5. Impact",
    description:
      "At the end, what kind of overall business, socio-economic or environmental impact can the idea/innovation have on the stakeholders? How do you think will it affect or change the lives of people?",
    scoreKey: "impactScore" as const,
    commentKey: "impactComment" as const,
  },
];

export default function EvaluatePage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState({
    needScore: "5",
    noveltyScore: "5",
    feasibilityScalabilityScore: "5",
    marketPotentialScore: "5",
    impactScore: "5",
    needComment: "",
    noveltyComment: "",
    feasibilityScalabilityComment: "",
    marketPotentialComment: "",
    impactComment: "",
    overallComment: "",
  });

  // UUID validation helper
  const isValidUUID = (id: string | string[] | undefined): boolean => {
    if (!id || Array.isArray(id)) return false;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  useEffect(() => {
    console.log("=== EvaluatePage Mount ===");
    console.log("Params:", params);
    console.log("Params.id:", params?.id);
    console.log("Params.id type:", typeof params?.id);

    // Check if params.id is valid before proceeding
    if (!params?.id) {
      console.error("No params.id found - params not loaded yet");
      setError("Loading application...");
      return;
    }

    if (params.id === "undefined" || params.id === "null") {
      console.error("params.id is string 'undefined' or 'null'");
      setError("Invalid application ID");
      setIsLoading(false);
      setTimeout(() => router.push("/dashboard"), 2000);
      return;
    }

    if (!isValidUUID(params.id)) {
      console.error("params.id is not a valid UUID:", params.id);
      setError("Invalid application ID format");
      setIsLoading(false);
      setTimeout(() => router.push("/dashboard"), 2000);
      return;
    }

    console.log("Valid params.id found:", params.id);
    checkUser();
  }, [params?.id]); // Only re-run when params.id changes

  const checkUser = async () => {
    try {
      // Double-check params.id is still valid
      if (!params?.id || !isValidUUID(params.id)) {
        console.error("Invalid application ID in checkUser");
        router.push("/dashboard");
        return;
      }

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

      if (!profile || profile.role !== "reviewer") {
        router.push("/dashboard");
        return;
      }

      setUser({ id: user.id, role: profile.role });
      await Promise.all([fetchApplication(), fetchEvaluation()]);
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplication = async () => {
    try {
      if (!params?.id || !isValidUUID(params.id)) {
        console.error("Cannot fetch application: invalid ID");
        return;
      }

      console.log("Fetching application:", params.id);
      const response = await fetch(
        `/api/applications/${params.id}`,
      );

      if (response.ok) {
        const data = await response.json();
        setApplication(data.application);
      } else {
        console.error("Failed to fetch application");
        setError("Failed to load application");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      setError("Failed to load application");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  const fetchEvaluation = async () => {
    try {
      if (!params?.id || !isValidUUID(params.id)) {
        console.error("Cannot fetch evaluation: invalid ID");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      // Double-check params.id is valid before making the API call
      if (!params.id || params.id === "undefined" || !isValidUUID(params.id)) {
        console.error("Invalid params.id in fetchEvaluation:", params.id);
        return;
      }

      console.log("Fetching evaluation for application ID:", params.id);
      const response = await fetch(
        `/api/evaluations/application/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.evaluation) {
          setEvaluation(data.evaluation);
          setFormData({
            needScore: data.evaluation.need_score?.toString() || "5",
            noveltyScore: data.evaluation.novelty_score?.toString() || "5",
            feasibilityScalabilityScore:
              data.evaluation.feasibility_scalability_score?.toString() || "5",
            marketPotentialScore:
              data.evaluation.market_potential_score?.toString() || "5",
            impactScore: data.evaluation.impact_score?.toString() || "5",
            needComment: data.evaluation.need_comment || "",
            noveltyComment: data.evaluation.novelty_comment || "",
            feasibilityScalabilityComment:
              data.evaluation.feasibility_scalability_comment || "",
            marketPotentialComment:
              data.evaluation.market_potential_comment || "",
            impactComment: data.evaluation.impact_comment || "",
            overallComment: data.evaluation.overall_comment || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching evaluation:", error);
    }
  };

  const handleScoreChange = (key: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
      setFormData((prev) => ({
        ...prev,
        [key]: numValue.toString(),
      }));
    }
  };

  const handleCommentChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const calculateTotalScore = () => {
    const scores = [
      parseInt(formData.needScore) || 0,
      parseInt(formData.noveltyScore) || 0,
      parseInt(formData.feasibilityScalabilityScore) || 0,
      parseInt(formData.marketPotentialScore) || 0,
      parseInt(formData.impactScore) || 0,
    ];
    return scores.reduce((sum, score) => sum + score, 0);
  };

  const handleSave = async (isDraft: boolean = false) => {
    if (!params?.id || !isValidUUID(params.id)) {
      console.error("Cannot save: invalid application ID");
      setSaveMessage("Error: Invalid application ID");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    const requiredScores = [
      "needScore",
      "noveltyScore",
      "feasibilityScalabilityScore",
      "marketPotentialScore",
      "impactScore",
    ];

    for (const scoreKey of requiredScores) {
      if (
        !formData[scoreKey as keyof typeof formData] ||
        formData[scoreKey as keyof typeof formData].trim() === ""
      ) {
        setSaveMessage("Please provide scores for all criteria (0-10)");
        setTimeout(() => setSaveMessage(""), 3000);
        return;
      }
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // Double-check params.id is valid before making the API call
      if (!params.id || params.id === "undefined" || !isValidUUID(params.id)) {
        console.error("Invalid params.id in handleSave:", params.id);
        setSaveMessage("Error: Invalid application ID");
        setTimeout(() => setSaveMessage(""), 3000);
        setIsSaving(false);
        return;
      }

      console.log("Saving evaluation for application ID:", params.id);
      const response = await fetch(
        `/api/evaluations/application/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            applicationId: params.id,
            needScore: parseInt(formData.needScore),
            noveltyScore: parseInt(formData.noveltyScore),
            feasibilityScalabilityScore: parseInt(
              formData.feasibilityScalabilityScore,
            ),
            marketPotentialScore: parseInt(formData.marketPotentialScore),
            impactScore: parseInt(formData.impactScore),
            needComment: formData.needComment || null,
            noveltyComment: formData.noveltyComment || null,
            feasibilityScalabilityComment:
              formData.feasibilityScalabilityComment || null,
            marketPotentialComment: formData.marketPotentialComment || null,
            impactComment: formData.impactComment || null,
            overallComment: formData.overallComment || null,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSaveMessage(
          evaluation
            ? "Evaluation updated successfully"
            : "Evaluation saved successfully",
        );
        setEvaluation(data.evaluation);
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage(data.error || "Failed to save evaluation");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving evaluation:", error);
      setSaveMessage("An error occurred while saving");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
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

  const totalScore = calculateTotalScore();

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                router.push(`/dashboard/applications/${params.id}`)
              }
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-black dark:text-zinc-50">
              Evaluate Application
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Total Score:{" "}
              <span className="font-bold text-black dark:text-zinc-50">
                {totalScore}/50
              </span>
            </div>
            <Button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90"
            >
              {isSaving ? "Saving..." : "Save Evaluation"}
            </Button>
          </div>
        </div>

        {saveMessage && (
          <div className="mb-4">
            <div
              className={`p-4 rounded-lg ${
                saveMessage.includes("Failed") || saveMessage.includes("error")
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              }`}
            >
              <p
                className={`text-sm ${
                  saveMessage.includes("Failed") ||
                  saveMessage.includes("error")
                    ? "text-red-800 dark:text-red-200"
                    : "text-green-800 dark:text-green-200"
                }`}
              >
                {saveMessage}
              </p>
            </div>
          </div>
        )}

        <div className="py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
            {/* Left Side - Application Details */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
                {application.team_name || application.company_name || "Application"}
              </h2>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                    Basic Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Email:{" "}
                      </span>
                      <a
                        href={`mailto:${application.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {application.email}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Team/Startup Name:{" "}
                      </span>
                      <span className="text-black dark:text-zinc-50">
                        {application.team_name || application.company_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Your Name:{" "}
                      </span>
                      <span className="text-black dark:text-zinc-50">
                        {application.your_name || application.founder_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Are you from IITM:{" "}
                      </span>
                      <span className="text-black dark:text-zinc-50">
                        {application.is_iitm || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Roll Number:{" "}
                      </span>
                      <span className="text-black dark:text-zinc-50">
                        {application.roll_number || "N/A"}
                      </span>
                    </div>
                    {application.roll_number_other && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">
                          Roll Number (Other):{" "}
                        </span>
                        <span className="text-black dark:text-zinc-50">
                          {application.roll_number_other}
                        </span>
                      </div>
                    )}
                    {application.college_name && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">
                          College Name:{" "}
                        </span>
                        <span className="text-black dark:text-zinc-50">
                          {application.college_name}
                        </span>
                      </div>
                    )}
                    {application.current_occupation && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">
                          Current Occupation:{" "}
                        </span>
                        <span className="text-black dark:text-zinc-50">
                          {application.current_occupation}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Phone:{" "}
                      </span>
                      <a
                        href={`tel:${application.phone_number || application.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {application.phone_number || application.phone || "N/A"}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Channel:{" "}
                      </span>
                      <span className="text-black dark:text-zinc-50">
                        {application.channel || "N/A"}
                      </span>
                    </div>
                    {application.channel_other && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">
                          Channel (Other):{" "}
                        </span>
                        <span className="text-black dark:text-zinc-50">
                          {application.channel_other}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Co-Founders Count:{" "}
                      </span>
                      <span className="text-black dark:text-zinc-50">
                        {application.co_founders_count ?? "N/A"}
                      </span>
                    </div>
                    {application.faculty_involved && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                          Faculty Involved:
                        </span>
                        <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                          {application.faculty_involved}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Entrepreneurship Experience */}
                {(application.prior_entrepreneurship_experience || application.team_prior_entrepreneurship_experience || application.prior_experience_details) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                      Entrepreneurship Experience
                    </h3>
                    <div className="space-y-2 text-sm">
                      {application.prior_entrepreneurship_experience && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Prior Entrepreneurship Experience:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.prior_entrepreneurship_experience}
                          </span>
                        </div>
                      )}
                      {application.team_prior_entrepreneurship_experience && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Team Prior Entrepreneurship Experience:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.team_prior_entrepreneurship_experience}
                          </span>
                        </div>
                      )}
                      {application.prior_experience_details && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            Prior Experience Details:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.prior_experience_details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Startup Registration & Funding */}
                {(application.mca_registered || application.dpiit_registered || application.external_funding || application.currently_incubated) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                      Startup Registration & Funding
                    </h3>
                    <div className="space-y-2 text-sm">
                      {application.mca_registered && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            MCA Registered:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.mca_registered}
                          </span>
                        </div>
                      )}
                      {application.dpiit_registered && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            DPIIT Registered:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.dpiit_registered}
                          </span>
                        </div>
                      )}
                      {application.dpiit_details && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            DPIIT Details:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.dpiit_details}
                          </span>
                        </div>
                      )}
                      {application.external_funding && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            External Funding:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.external_funding}
                          </p>
                        </div>
                      )}
                      {application.currently_incubated && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Currently Incubated:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.currently_incubated}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Team Members */}
                {application.team_members && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                      Team Members
                    </h3>
                    <div className="text-sm">
                      <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                        {application.team_members}
                      </p>
                    </div>
                  </div>
                )}

                {/* About Nirmaan Program */}
                {(application.nirmaan_can_help || application.pre_incubation_reason || application.heard_about_startups || application.heard_about_nirmaan) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                      About Nirmaan Program
                    </h3>
                    <div className="space-y-2 text-sm">
                      {application.nirmaan_can_help && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            How Nirmaan Can Help:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.nirmaan_can_help}
                          </p>
                        </div>
                      )}
                      {application.pre_incubation_reason && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            Pre-Incubation Reason:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.pre_incubation_reason}
                          </p>
                        </div>
                      )}
                      {application.heard_about_startups && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            Heard About Startups:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.heard_about_startups}
                          </p>
                        </div>
                      )}
                      {application.heard_about_nirmaan && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            Heard About Nirmaan:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.heard_about_nirmaan}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Problem & Solution */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                    Problem & Solution
                  </h3>
                  <div className="space-y-3 text-sm">
                    {(application.problem_solving || application.problem) && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                          Problem:
                        </span>
                        <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                          {application.problem_solving || application.problem}
                        </p>
                      </div>
                    )}
                    {(application.your_solution || application.solution) && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                          Solution:
                        </span>
                        <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                          {application.your_solution || application.solution}
                        </p>
                      </div>
                    )}
                    {(application.solution_type || application.business_model) && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                          Solution Type:
                        </span>
                        <p className="text-black dark:text-zinc-50">
                          {application.solution_type || application.business_model}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Industry & Technologies */}
                {(application.target_industry || application.target_market || application.other_industries || application.technologies_utilized) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                      Industry & Technologies
                    </h3>
                    <div className="space-y-2 text-sm">
                      {(application.target_industry || application.target_market) && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Target Industry:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.target_industry || application.target_market}
                          </span>
                        </div>
                      )}
                      {application.industry_other && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Industry (Other):{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.industry_other}
                          </span>
                        </div>
                      )}
                      {application.other_industries && application.other_industries.length > 0 && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Other Industries:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {Array.isArray(application.other_industries)
                              ? application.other_industries.join(", ")
                              : application.other_industries}
                          </span>
                        </div>
                      )}
                      {application.other_industries_other && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Other Industries (Other):{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.other_industries_other}
                          </span>
                        </div>
                      )}
                      {application.technologies_utilized && application.technologies_utilized.length > 0 && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Technologies Utilized:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {Array.isArray(application.technologies_utilized)
                              ? application.technologies_utilized.join(", ")
                              : application.technologies_utilized}
                          </span>
                        </div>
                      )}
                      {application.other_technology_details && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Other Technology Details:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.other_technology_details}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Startup Stage & IP */}
                {(application.startup_stage || application.has_intellectual_property || application.has_potential_intellectual_property) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                      Startup Stage & Intellectual Property
                    </h3>
                    <div className="space-y-2 text-sm">
                      {application.startup_stage && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Startup Stage:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.startup_stage}
                          </span>
                        </div>
                      )}
                      {application.has_intellectual_property && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Has Intellectual Property:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.has_intellectual_property}
                          </span>
                        </div>
                      )}
                      {application.has_potential_intellectual_property && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Has Potential Intellectual Property:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.has_potential_intellectual_property}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Presentation & Proof */}
                {(application.nirmaan_presentation_link || application.has_proof_of_concept || application.proof_of_concept_details || application.has_patents_or_papers || application.patents_or_papers_details) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                      Presentation & Proof of Concept
                    </h3>
                    <div className="space-y-2 text-sm">
                      {application.nirmaan_presentation_link && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Nirmaan Presentation:{" "}
                          </span>
                          <a
                            href={application.nirmaan_presentation_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {application.nirmaan_presentation_link}
                          </a>
                        </div>
                      )}
                      {application.has_proof_of_concept && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Has Proof of Concept:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.has_proof_of_concept}
                          </span>
                        </div>
                      )}
                      {application.proof_of_concept_details && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            Proof of Concept Details:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.proof_of_concept_details}
                          </p>
                        </div>
                      )}
                      {application.has_patents_or_papers && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Has Patents or Papers:{" "}
                          </span>
                          <span className="text-black dark:text-zinc-50">
                            {application.has_patents_or_papers}
                          </span>
                        </div>
                      )}
                      {application.patents_or_papers_details && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            Patents or Papers Details:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.patents_or_papers_details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Seed Fund & Pitch */}
                {(application.seed_fund_utilization_plan || application.pitch_video_link || application.document1_link || application.document2_link) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                      Seed Fund & Pitch Video
                    </h3>
                    <div className="space-y-2 text-sm">
                      {application.seed_fund_utilization_plan && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                            Seed Fund Utilization Plan:
                          </span>
                          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap">
                            {application.seed_fund_utilization_plan}
                          </p>
                        </div>
                      )}
                      {application.pitch_video_link && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Pitch Video Link:{" "}
                          </span>
                          <a
                            href={application.pitch_video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {application.pitch_video_link}
                          </a>
                        </div>
                      )}
                      {application.document1_link && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Document 1:{" "}
                          </span>
                          <a
                            href={application.document1_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {application.document1_link}
                          </a>
                        </div>
                      )}
                      {application.document2_link && (
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Document 2:{" "}
                          </span>
                          <a
                            href={application.document2_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {application.document2_link}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Evaluation Form */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
                Evaluation Sheet
              </h2>

              <div className="space-y-6">
                {EVALUATION_CRITERIA.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="border-b border-zinc-200 dark:border-zinc-800 pb-6 last:border-b-0"
                  >
                    <Label className="text-base font-semibold text-black dark:text-zinc-50 mb-2 block">
                      {criterion.label}
                    </Label>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      {criterion.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-zinc-700 dark:text-zinc-300">
                            Score (0-10) <span className="text-red-500">*</span>
                          </Label>
                          <span className="text-lg font-bold text-black dark:text-zinc-50 min-w-[2rem] text-right">
                            {formData[criterion.scoreKey] || "5"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-zinc-500 dark:text-zinc-500 w-4">
                            0
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={formData[criterion.scoreKey] || "5"}
                            onChange={(e) =>
                              handleScoreChange(
                                criterion.scoreKey,
                                e.target.value,
                              )
                            }
                            className={`flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer 
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:dark:bg-zinc-50
                            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                            [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:dark:bg-zinc-50 [&::-moz-range-thumb]:border-0
                            [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md`}
                            required
                          />
                          <span className="text-xs text-zinc-500 dark:text-zinc-500 w-6 text-right">
                            10
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-zinc-700 dark:text-zinc-300">
                          Comment
                        </Label>
                        <Textarea
                          value={formData[criterion.commentKey]}
                          onChange={(e) =>
                            handleCommentChange(
                              criterion.commentKey,
                              e.target.value,
                            )
                          }
                          className="mt-1"
                          rows={4}
                          placeholder="Enter your evaluation comment..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Overall Comment */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                  <Label className="text-base font-semibold text-black dark:text-zinc-50 mb-2 block">
                    Overall Comment
                  </Label>
                  <Textarea
                    value={formData.overallComment}
                    onChange={(e) =>
                      handleCommentChange("overallComment", e.target.value)
                    }
                    className="mt-1"
                    rows={6}
                    placeholder="Enter your overall evaluation comment..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
