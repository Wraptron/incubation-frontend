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
  created_at: string;
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
                {application.company_name}
              </h2>

              <div className="space-y-6">
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                    Company Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Website:{" "}
                      </span>
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
                        <span className="text-zinc-400">N/A</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Description:{" "}
                      </span>
                      <p className="text-black dark:text-zinc-50 mt-1">
                        {application.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Founder Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                    Founder Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Founder:{" "}
                      </span>
                      <span className="text-black dark:text-zinc-50">
                        {application.founder_name}
                      </span>
                    </div>
                    {application.co_founders && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">
                          Co-Founders:{" "}
                        </span>
                        <span className="text-black dark:text-zinc-50">
                          {application.co_founders}
                        </span>
                      </div>
                    )}
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
                        Phone:{" "}
                      </span>
                      <a
                        href={`tel:${application.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {application.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                    Business Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                        Problem:
                      </span>
                      <p className="text-black dark:text-zinc-50">
                        {application.problem}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                        Solution:
                      </span>
                      <p className="text-black dark:text-zinc-50">
                        {application.solution}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                        Target Market:
                      </span>
                      <p className="text-black dark:text-zinc-50">
                        {application.target_market}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                        Business Model:
                      </span>
                      <p className="text-black dark:text-zinc-50">
                        {application.business_model}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Funding & Traction */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                    Funding & Traction
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Funding Stage:{" "}
                      </span>
                      <span className="text-black dark:text-zinc-50">
                        {application.funding_stage?.replace("_", " ") || "N/A"}
                      </span>
                    </div>
                    {application.funding_amount && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">
                          Funding Amount:{" "}
                        </span>
                        <span className="text-black dark:text-zinc-50">
                          {application.funding_amount}
                        </span>
                      </div>
                    )}
                    {application.current_traction && (
                      <div>
                        <span className="font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                          Current Traction:
                        </span>
                        <p className="text-black dark:text-zinc-50">
                          {application.current_traction}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Why Incubator */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">
                    Why Our Incubator?
                  </h3>
                  <p className="text-sm text-black dark:text-zinc-50">
                    {application.why_incubator}
                  </p>
                </div>
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
