"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { ToastContainer, ToastProps } from "@/components/ui/toast";

export default function ApplyPage() {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    teamName: "",
    yourName: "",
    isIITM: "",
    rollNumber: "",
    rollNumberOther: "",
    collegeName: "",
    currentOccupation: "",
    phoneNumber: "",
    channel: "",
    channelOther: "",
    coFoundersCount: "",
    facultyInvolved: [] as Array<{
      name: string;
      designation: string;
      department: string;
      university: string;
      roleInStartup: string;
    }>,
    priorEntrepreneurshipExperience: "",
    teamPriorEntrepreneurshipExperience: "",
    priorExperienceDetails: "",
    mcaRegistered: "",
    dpiitRegistered: "",
    dpiitDetails: "",
    externalFunding: [] as Array<{
      funding: string;
      fundingType: string;
      amount: string;
      description: string;
    }>,
    currentlyIncubated: "",
    teamMembers: [] as Array<{
      name: string;
      rollNumber: string;
      email: string;
      mailId: string;
      department: string;
    }>,
    nirmaanCanHelp: "",
    preIncubationReason: "",
    heardAboutStartups: "",
    // New fields from images
    heardAboutNirmaan: "",
    problemSolving: "",
    yourSolution: "",
    solutionType: "",
    solutionTypeOther: "",
    targetIndustry: "",
    otherIndustries: [] as string[],
    industryOther: "",
    otherIndustriesOther: "",
    technologiesUtilized: [] as string[],
    otherTechnologyDetails: "",
    startupStage: "",
    hasIntellectualProperty: "",
    hasPotentialIntellectualProperty: "",
    nirmaanPresentationLink: "",
    hasProofOfConcept: "",
    proofOfConceptDetails: "",
    hasPatentsOrPapers: "",
    patentsOrPapersDetails: "",
    seedFundUtilizationPlan: "",
    pitchVideoLink: "",
    document1Link: "",
    document2Link: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [document1File, setDocument1File] = useState<File | null>(null);
  const [document2File, setDocument2File] = useState<File | null>(null);
  const [ipFile, setIpFile] = useState<File | null>(null);
  const [potentialIpFile, setPotentialIpFile] = useState<File | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset conditional fields when switching to "No"
      ...(name === "priorEntrepreneurshipExperience" &&
        value === "No" && {
          priorExperienceDetails: "N/A",
        }),
      ...(name === "teamPriorEntrepreneurshipExperience" &&
        value === "No" && {
          priorExperienceDetails:
            prev.priorEntrepreneurshipExperience === "No"
              ? "N/A"
              : prev.priorExperienceDetails,
        }),
      ...(name === "mcaRegistered" &&
        value === "No" && {
          dpiitRegistered: "",
          dpiitDetails: "",
        }),
    }));
  };

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Check authentication and load draft from server
  useEffect(() => {
    const checkAuthAndLoadDraft = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Not authenticated, redirect to login
          router.push("/applicant-login");
          return;
        }

        // Check if user is an applicant
        const { data: profile } = await supabase
          .from("applicant_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // Not an applicant, redirect to signup
          await supabase.auth.signOut();
          router.push("/applicant-signup");
          return;
        }

        setUserId(user.id);

        // Load draft from server
        const { data: draftApp } = await supabase
          .from("new_application")
          .select("*")
          .eq("applicant_id", user.id)
          .eq("is_draft", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (draftApp) {
          // Map database fields back to form data
          setFormData({
            email: draftApp.email || "",
            teamName: draftApp.team_name || "",
            yourName: draftApp.your_name || "",
            isIITM: draftApp.is_iitm || "",
            rollNumber: draftApp.roll_number || "",
            rollNumberOther: draftApp.roll_number_other || "",
            collegeName: draftApp.college_name || "",
            currentOccupation: draftApp.current_occupation || "",
            phoneNumber: draftApp.phone_number || "",
            channel: draftApp.channel || "",
            channelOther: draftApp.channel_other || "",
            coFoundersCount: String(draftApp.co_founders_count || ""),
            facultyInvolved: draftApp.faculty_involved === "NA" || !draftApp.faculty_involved ? [] : (Array.isArray(draftApp.faculty_involved) ? draftApp.faculty_involved : []),
            priorEntrepreneurshipExperience: draftApp.prior_entrepreneurship_experience || "",
            teamPriorEntrepreneurshipExperience: draftApp.team_prior_entrepreneurship_experience || "",
            priorExperienceDetails: draftApp.prior_experience_details || "",
            mcaRegistered: draftApp.mca_registered || "",
            dpiitRegistered: draftApp.dpiit_registered || "",
            dpiitDetails: draftApp.dpiit_details || "",
            externalFunding: draftApp.external_funding || [],
            currentlyIncubated: draftApp.currently_incubated || "",
            teamMembers: draftApp.team_members || [],
            nirmaanCanHelp: draftApp.nirmaan_can_help || "",
            preIncubationReason: draftApp.pre_incubation_reason || "",
            heardAboutStartups: draftApp.heard_about_startups || "",
            heardAboutNirmaan: draftApp.heard_about_nirmaan || "",
            problemSolving: draftApp.problem_solving || "",
            yourSolution: draftApp.your_solution || "",
            solutionType: draftApp.solution_type || "",
            solutionTypeOther: draftApp.solution_type_other || "",
            targetIndustry: draftApp.target_industry || "",
            otherIndustries: draftApp.other_industries || [],
            industryOther: draftApp.industry_other || "",
            otherIndustriesOther: draftApp.other_industries_other || "",
            technologiesUtilized: draftApp.technologies_utilized || [],
            otherTechnologyDetails: draftApp.other_technology_details || "",
            startupStage: draftApp.startup_stage || "",
            hasIntellectualProperty: draftApp.has_intellectual_property || "",
            hasPotentialIntellectualProperty: draftApp.has_potential_intellectual_property || "",
            nirmaanPresentationLink: draftApp.nirmaan_presentation_link || "",
            hasProofOfConcept: draftApp.has_proof_of_concept || "",
            proofOfConceptDetails: draftApp.proof_of_concept_details || "",
            hasPatentsOrPapers: draftApp.has_patents_or_papers || "",
            patentsOrPapersDetails: draftApp.patents_or_papers_details || "",
            seedFundUtilizationPlan: draftApp.seed_fund_utilization_plan || "",
            pitchVideoLink: draftApp.pitch_video_link || "",
            document1Link: draftApp.document1_link || "",
            document2Link: draftApp.document2_link || "",
          });
          setDraftId(draftApp.id);
          setDraftLoaded(true);
          addToast({
            variant: "default",
            description: "Draft loaded successfully! Continue where you left off.",
          });
        }
      } catch (error) {
        console.error("Error checking auth or loading draft:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndLoadDraft();
  }, [router]);

  // Auto-save draft to server every 30 seconds
  useEffect(() => {
    if (!userId) return;

    const autoSaveInterval = setInterval(() => {
      // Only auto-save if there's meaningful data
      if (formData.email || formData.teamName || formData.yourName) {
        handleSaveDraft(true); // true for silent save
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, userId]);

  // Save draft to server
  const handleSaveDraft = async (silent = false) => {
    if (!userId) {
      addToast({
        variant: "destructive",
        description: "You must be logged in to save a draft.",
      });
      return;
    }

    try {
      if (!silent) setIsSavingDraft(true);

      // Parse array fields
      let facultyInvolved = formData.facultyInvolved;
      if (Array.isArray(facultyInvolved) && facultyInvolved.length === 0) {
        facultyInvolved = "NA" as any;
      }

      let externalFunding = formData.externalFunding;
      if (Array.isArray(externalFunding) && externalFunding.length === 0) {
        externalFunding = null as any;
      }

      const draftData = {
        applicant_id: userId,
        is_draft: true,
        email: formData.email,
        team_name: formData.teamName,
        your_name: formData.yourName,
        is_iitm: formData.isIITM,
        roll_number: formData.rollNumber,
        roll_number_other: formData.rollNumberOther || null,
        college_name: formData.collegeName || null,
        current_occupation: formData.currentOccupation || null,
        phone_number: formData.phoneNumber,
        channel: formData.channel,
        channel_other: formData.channelOther || null,
        co_founders_count: parseInt(formData.coFoundersCount) || 0,
        faculty_involved: facultyInvolved || "NA",
        prior_entrepreneurship_experience: formData.priorEntrepreneurshipExperience,
        team_prior_entrepreneurship_experience: formData.teamPriorEntrepreneurshipExperience,
        prior_experience_details: formData.priorExperienceDetails || null,
        mca_registered: formData.mcaRegistered,
        dpiit_registered: formData.dpiitRegistered || null,
        dpiit_details: formData.dpiitDetails || null,
        external_funding: externalFunding || null,
        currently_incubated: formData.currentlyIncubated || null,
        team_members: formData.teamMembers,
        nirmaan_can_help: formData.nirmaanCanHelp,
        pre_incubation_reason: formData.preIncubationReason,
        heard_about_startups: formData.heardAboutStartups,
        heard_about_nirmaan: formData.heardAboutNirmaan,
        problem_solving: formData.problemSolving,
        your_solution: formData.yourSolution,
        solution_type: formData.solutionType,
        solution_type_other: formData.solutionTypeOther || null,
        target_industry: formData.targetIndustry,
        other_industries: formData.otherIndustries,
        industry_other: formData.industryOther || null,
        other_industries_other: formData.otherIndustriesOther || null,
        technologies_utilized: formData.technologiesUtilized,
        other_technology_details: formData.otherTechnologyDetails || null,
        startup_stage: formData.startupStage,
        has_intellectual_property: formData.hasIntellectualProperty,
        has_potential_intellectual_property: formData.hasPotentialIntellectualProperty,
        nirmaan_presentation_link: formData.nirmaanPresentationLink,
        has_proof_of_concept: formData.hasProofOfConcept,
        proof_of_concept_details: formData.proofOfConceptDetails || null,
        has_patents_or_papers: formData.hasPatentsOrPapers,
        patents_or_papers_details: formData.patentsOrPapersDetails || null,
        seed_fund_utilization_plan: formData.seedFundUtilizationPlan,
        pitch_video_link: formData.pitchVideoLink,
        document1_link: formData.document1Link || null,
        document2_link: formData.document2Link || null,
        status: "draft",
      };

      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from("new_application")
          .update(draftData)
          .eq("id", draftId);

        if (error) throw error;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from("new_application")
          .insert(draftData)
          .select()
          .single();

        if (error) throw error;
        if (data) setDraftId(data.id);
      }

      if (silent) {
        setAutoSaveIndicator(true);
        setTimeout(() => setAutoSaveIndicator(false), 2000);
      } else {
        setDraftSaved(true);
        addToast({
          variant: "default",
          description: "Draft saved successfully!",
        });
        setTimeout(() => setDraftSaved(false), 3000);
      }
    } catch (error: any) {
      console.error("Error saving draft:", error);
      if (!silent) {
        addToast({
          variant: "destructive",
          description: "Failed to save draft. Please try again.",
        });
      }
    } finally {
      if (!silent) setIsSavingDraft(false);
    }
  };

  // Clear draft from server after successful submission
  const clearDraft = async () => {
    if (draftId) {
      try {
        await supabase
          .from("new_application")
          .delete()
          .eq("id", draftId);
      } catch (error) {
        console.error("Error clearing draft:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    // Validate required radio button fields
    const requiredRadioFields = [
      { field: "isIITM", label: "Are you from IITM?" },
      { field: "priorEntrepreneurshipExperience", label: "Do you have prior entrepreneurship experience?" },
      { field: "teamPriorEntrepreneurshipExperience", label: "Does anyone on your team have prior entrepreneurship experience?" },
      { field: "mcaRegistered", label: "Is the startup registered with MCA?" },
      { field: "hasIntellectualProperty", label: "Do you have any intellectual property (IP) on your solution?" },
      { field: "hasPotentialIntellectualProperty", label: "Do you see any potential intellectual property (IP) on your solution?" },
      { field: "hasProofOfConcept", label: "Do you have a proof of concept to validate your idea?" },
      { field: "hasPatentsOrPapers", label: "Have you filed for any patents/published papers?" },
    ];

    const missingFields: string[] = [];
    for (const { field, label } of requiredRadioFields) {
      if (!formData[field as keyof typeof formData] || String(formData[field as keyof typeof formData]).trim() === "") {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      setIsSubmitting(false);
      // Show toasts one by one with a delay
      missingFields.forEach((field, index) => {
        setTimeout(() => {
          addToast({
            variant: "destructive",
            description: `Please select an option for: ${field}`,
          });
        }, index * 500); // 500ms delay between each toast
      });
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add applicant ID
      if (userId) {
        formDataToSend.append("applicantId", userId);
      }

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          (key === "technologiesUtilized" || 
           key === "otherIndustries" || 
           key === "facultyInvolved" ||
           key === "teamMembers" ||
           key === "externalFunding") &&
          Array.isArray(value)
        ) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      // Add the presentation file if selected
      if (presentationFile) {
        formDataToSend.append("presentationFile", presentationFile);
      }

      // Add document files if selected
      if (document1File) {
        formDataToSend.append("document1File", document1File);
      }
      if (document2File) {
        formDataToSend.append("document2File", document2File);
      }

      // Add IP files if selected
      if (ipFile) {
        formDataToSend.append("ipFile", ipFile);
        console.log("Adding IP file to FormData:", { name: ipFile.name, size: ipFile.size, type: ipFile.type });
      } else {
        console.log("No IP file to add. hasIntellectualProperty:", formData.hasIntellectualProperty);
      }
      if (potentialIpFile) {
        formDataToSend.append("potentialIpFile", potentialIpFile);
        console.log("Adding potential IP file to FormData:", { name: potentialIpFile.name, size: potentialIpFile.size, type: potentialIpFile.type });
      } else {
        console.log("No potential IP file to add. hasPotentialIntellectualProperty:", formData.hasPotentialIntellectualProperty);
      }

      // Debug: Log all FormData entries (excluding file contents)
      console.log("FormData entries being sent:");
      for (const [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const response = await fetch("/api/apply", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setShowSuccessDialog(true);
        
        // Clear draft after successful submission
        clearDraft();
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNonIITMFields = formData.isIITM === "No";
  const showChannelOther = formData.channel === "Others";
  const showSolutionTypeOther = formData.solutionType === "Others";
  const showPriorExperience =
    formData.priorEntrepreneurshipExperience === "Yes" ||
    formData.teamPriorEntrepreneurshipExperience === "Yes";
  const showDPIITFields = formData.mcaRegistered === "Yes";
  const showIndustryOther = formData.targetIndustry === "Other";
  const showOtherIndustriesOther = formData.otherIndustries.includes("Other");
  const showProofOfConceptDetails = formData.hasProofOfConcept === "Yes";
  const showPatentsOrPapersDetails = formData.hasPatentsOrPapers === "Yes";

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-zinc-50 dark:from-black dark:to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Application Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Thank you for applying to NIRMAAN Pre-Incubation Program. We have
              received your application and will review it shortly. You will be
              redirected to the home page in a few seconds.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => router.push("/")}
              variant="default"
              className="px-8"
            >
              Go to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-white to-zinc-50 dark:from-black dark:to-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src="/nirmaan logo.png"
                alt="Nirmaan logo"
                className="w-20 h-20 rounded-2xl shadow-lg"
              />
              <div className="text-left">
                <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                  NIRMAAN
                </h1>
                <p className="text-primary font-semibold">IITM Pre-Incubation</p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full max-w-4xl">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-2 text-black dark:text-zinc-50">
                  Pre-Incubation Application
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  Apply to join Nirmaan's pre-incubation program. Fill out the form below
                  and we'll get back to you soon.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/applicant-login");
                }}
                className="ml-4"
              >
                Logout
              </Button>
            </div>
            {autoSaveIndicator && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 animate-pulse">
                ✓ Auto-saved
              </p>
            )}
          </div>

          {draftLoaded && (
            <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertDescription className="flex items-center justify-between">
                <span className="text-blue-900 dark:text-blue-100">
                  📝 Draft loaded! Your previous progress has been restored.
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Are you sure you want to clear the draft and start over?")) {
                      await clearDraft();
                      setDraftLoaded(false);
                      window.location.reload();
                    }
                  }}
                  className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  Clear Draft
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {errorMessage ||
                  "There was an error submitting your application. Please try again."}
              </AlertDescription>
            </Alert>
          )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Tell us about yourself and your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamName">
                  Name of Your Team / Startup{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="teamName"
                  name="teamName"
                  type="text"
                  required
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="Enter your team or startup name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yourName">
                  Your Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="yourName"
                  name="yourName"
                  type="text"
                  required
                  value={formData.yourName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-3">
                <Label>
                  Are you from IITM? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.isIITM}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      isIITM: value,
                      // Clear college name and occupation if switching to IITM
                      // Clear roll number when switching
                      rollNumber: "",
                      rollNumberOther: "",
                      ...(value === "Yes" && {
                        collegeName: "",
                        currentOccupation: "",
                      }),
                    }));
                  }}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Yes" id="iitm-yes">
                    Yes
                  </RadioGroupItem>
                  <RadioGroupItem value="No" id="iitm-no">
                    No
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">
                  Roll Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="Enter your roll number"
                />
              </div>

              {showNonIITMFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="collegeName">
                      College Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="collegeName"
                      name="collegeName"
                      type="text"
                      required={showNonIITMFields}
                      value={formData.collegeName}
                      onChange={handleChange}
                      placeholder="Enter your college name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentOccupation">
                      Current Occupation <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.currentOccupation}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentOccupation: value,
                        }))
                      }
                      required={showNonIITMFields}
                    >
                      <SelectTrigger id="currentOccupation">
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Employed">Employed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">
                  Please select the relevant channel that you belong to{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      channel: value,
                      channelOther: "",
                    }))
                  }
                  required
                >
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Select a channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CFI">CFI</SelectItem>
                    <SelectItem value="E-cell">E-cell</SelectItem>
                    <SelectItem value="PALS">PALS</SelectItem>
                    <SelectItem value="Carbon Zero Challenge (CZC)">
                      Carbon Zero Challenge (CZC)
                    </SelectItem>
                    <SelectItem value="I2I (Sustainability Venture Studio)">
                      I2I (Sustainability Venture Studio)
                    </SelectItem>
                    <SelectItem value="IITM (Others)">IITM (Others)</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showChannelOther && (
                <div className="space-y-2">
                  <Label htmlFor="channelOther">
                    Please specify <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="channelOther"
                    name="channelOther"
                    type="text"
                    required={showChannelOther}
                    value={formData.channelOther}
                    onChange={handleChange}
                    placeholder="Enter your channel"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="coFoundersCount">
                  How many co-founders do you have?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="coFoundersCount"
                  name="coFoundersCount"
                  type="number"
                  min="0"
                  required
                  value={formData.coFoundersCount}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facultyInvolved">
                  Faculty Involved (Name, Designation, Department, Institute
                  {"{IITM or other}"} and Role in the team){" "}
                </Label>
                <div className="border border-zinc-300 dark:border-zinc-700 rounded-md overflow-hidden mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-100 dark:bg-zinc-800">
                        <tr>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            1. Name
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            2. Designation
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            3. Department
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            4. University
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            5. Role in Startup
                          </th>
                          <th className="px-3 py-2 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-50 w-12">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.facultyInvolved.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-3 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
                            >
                              No faculty members added. Click the Add button below to add one.
                            </td>
                          </tr>
                        ) : (
                          formData.facultyInvolved.map((faculty, index) => (
                            <tr
                              key={index}
                              className="border-t border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            >
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={faculty.name}
                                  onChange={(e) => {
                                    const updated = [...formData.facultyInvolved];
                                    updated[index] = {
                                      ...updated[index],
                                      name: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      facultyInvolved: updated,
                                    }));
                                  }}
                                  placeholder="Enter name"
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={faculty.designation}
                                  onChange={(e) => {
                                    const updated = [...formData.facultyInvolved];
                                    updated[index] = {
                                      ...updated[index],
                                      designation: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      facultyInvolved: updated,
                                    }));
                                  }}
                                  placeholder="Enter designation"
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={faculty.department}
                                  onChange={(e) => {
                                    const updated = [...formData.facultyInvolved];
                                    updated[index] = {
                                      ...updated[index],
                                      department: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      facultyInvolved: updated,
                                    }));
                                  }}
                                  placeholder="Enter department"
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={faculty.university}
                                  onChange={(e) => {
                                    const updated = [...formData.facultyInvolved];
                                    updated[index] = {
                                      ...updated[index],
                                      university: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      facultyInvolved: updated,
                                    }));
                                  }}
                                  placeholder="IITM or other"
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="text"
                                  value={faculty.roleInStartup}
                                  onChange={(e) => {
                                    const updated = [...formData.facultyInvolved];
                                    updated[index] = {
                                      ...updated[index],
                                      roleInStartup: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      facultyInvolved: updated,
                                    }));
                                  }}
                                  placeholder="Enter role"
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = formData.facultyInvolved.filter(
                                      (_, i) => i !== index
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      facultyInvolved: updated,
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                  aria-label="Remove faculty member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-2 border-t border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          facultyInvolved: [
                            ...prev.facultyInvolved,
                            {
                              name: "",
                              designation: "",
                              department: "",
                              university: "",
                              roleInStartup: "",
                            },
                          ],
                        }));
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Faculty Member
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entrepreneurship Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Entrepreneurship Experience</CardTitle>
              <CardDescription>
                Tell us about your entrepreneurial background
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>
                  Do you have prior entrepreneurship experience?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.priorEntrepreneurshipExperience}
                  onValueChange={(value) =>
                    handleRadioChange("priorEntrepreneurshipExperience", value)
                  }
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Yes" id="prior-exp-yes">
                    Yes
                  </RadioGroupItem>
                  <RadioGroupItem value="No" id="prior-exp-no">
                    No
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>
                  Does anyone on your team have prior entrepreneurship
                  experience? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.teamPriorEntrepreneurshipExperience}
                  onValueChange={(value) =>
                    handleRadioChange(
                      "teamPriorEntrepreneurshipExperience",
                      value,
                    )
                  }
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Yes" id="team-prior-exp-yes">
                    Yes
                  </RadioGroupItem>
                  <RadioGroupItem value="No" id="team-prior-exp-no">
                    No
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priorExperienceDetails">
                  Please provide a brief idea about your prior experience or your team's prior experience as an
                  entrepreneur. Do share any links to demos or websites or
                  reports that could help us understand your venture.
                </Label>
                <Textarea
                  id="priorExperienceDetails"
                  name="priorExperienceDetails"
                  rows={4}
                  value={formData.priorExperienceDetails}
                  onChange={handleChange}
                  placeholder={
                    showPriorExperience
                      ? "Describe your prior entrepreneurship experience..."
                      : "N/A"
                  }
                  disabled={!showPriorExperience}
                />
              </div>
            </CardContent>
          </Card>

          {/* Startup Registration & Funding */}
          <Card>
            <CardHeader>
              <CardTitle>Startup Registration & Funding</CardTitle>
              <CardDescription>
                Information about your startup registration and funding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>
                  Is the startup registered with MCA? (Ministry of Corporate
                  Affairs) <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.mcaRegistered}
                  onValueChange={(value) =>
                    handleRadioChange("mcaRegistered", value)
                  }
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Yes" id="mca-yes">
                    Yes
                  </RadioGroupItem>
                  <RadioGroupItem value="No" id="mca-no">
                    No
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              {showDPIITFields && (
                <>
                    <div className="space-y-2">
                      <Label htmlFor="dpiitDetails">
                        DPIIT Registration Details{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dpiitDetails"
                        name="dpiitDetails"
                        type="text"
                        required={formData.dpiitRegistered === "Yes"}
                        value={formData.dpiitDetails}
                        onChange={handleChange}
                        placeholder="Enter DPIIT registration details"
                      />
                    </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="externalFunding">
                  External Funding Received (Grants/Funds) (Please mention the
                  funding body and the amount)
                </Label>
                <div className="border border-zinc-300 dark:border-zinc-700 rounded-md overflow-hidden mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-100 dark:bg-zinc-800">
                        <tr>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            1. Funding
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            2. Funding Type
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            3. Amount
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            4. Description (if any)
                          </th>
                          <th className="px-3 py-2 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-50 w-12">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.externalFunding.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-3 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
                            >
                              No funding entries added. Click the Add button below to add one.
                            </td>
                          </tr>
                        ) : (
                          formData.externalFunding.map((funding, index) => (
                            <tr
                              key={index}
                              className="border-t border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            >
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={funding.funding}
                                  onChange={(e) => {
                                    const updated = [...formData.externalFunding];
                                    updated[index] = {
                                      ...updated[index],
                                      funding: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      externalFunding: updated,
                                    }));
                                  }}
                                  placeholder="Enter Fund Name"
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={funding.fundingType}
                                  onChange={(e) => {
                                    const updated = [...formData.externalFunding];
                                    updated[index] = {
                                      ...updated[index],
                                      fundingType: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      externalFunding: updated,
                                    }));
                                  }}
                                  placeholder="Ex. Grant, Fund, etc."
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={funding.amount}
                                  onChange={(e) => {
                                    const updated = [...formData.externalFunding];
                                    updated[index] = {
                                      ...updated[index],
                                      amount: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      externalFunding: updated,
                                    }));
                                  }}
                                  placeholder="Ex. 200000"
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="text"
                                  value={funding.description}
                                  onChange={(e) => {
                                    const updated = [...formData.externalFunding];
                                    updated[index] = {
                                      ...updated[index],
                                      description: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      externalFunding: updated,
                                    }));
                                  }}
                                  placeholder="Enter description (optional)"
                                  className="w-full"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = formData.externalFunding.filter(
                                      (_, i) => i !== index
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      externalFunding: updated,
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                  aria-label="Remove funding entry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-2 border-t border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          externalFunding: [
                            ...prev.externalFunding,
                            {
                              funding: "",
                              fundingType: "",
                              amount: "",
                              description: "",
                            },
                          ],
                        }));
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Funding Entry
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentlyIncubated">
                  Is the startup currently incubated anywhere? (If yes write the
                  name or else write no)
                </Label>
                <Input
                  id="currentlyIncubated"
                  name="currentlyIncubated"
                  type="text"
                  value={formData.currentlyIncubated}
                  onChange={handleChange}
                  placeholder="Enter incubation name or 'no'"
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Information about your team composition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="teamMembers">
                  Enter the team members names with their roll numbers below{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="border border-zinc-300 dark:border-zinc-700 rounded-md overflow-hidden mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-100 dark:bg-zinc-800">
                        <tr>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            1. Name
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            2. Roll Number
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            3. Email
                          </th>
                         
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            4. Department
                          </th>
                          <th className="px-3 py-2 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-50 w-12">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.teamMembers.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-3 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
                            >
                              No team members added. Click the Add button below to add one.
                            </td>
                          </tr>
                        ) : (
                          formData.teamMembers.map((member, index) => (
                            <tr
                              key={index}
                              className="border-t border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            >
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => {
                                    const updated = [...formData.teamMembers];
                                    updated[index] = {
                                      ...updated[index],
                                      name: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      teamMembers: updated,
                                    }));
                                  }}
                                  placeholder="Enter name"
                                  className="w-full"
                                  required
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={member.rollNumber}
                                  onChange={(e) => {
                                    const updated = [...formData.teamMembers];
                                    updated[index] = {
                                      ...updated[index],
                                      rollNumber: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      teamMembers: updated,
                                    }));
                                  }}
                                  placeholder="Enter roll number"
                                  className="w-full"
                                  required
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="email"
                                  value={member.email}
                                  onChange={(e) => {
                                    const updated = [...formData.teamMembers];
                                    updated[index] = {
                                      ...updated[index],
                                      email: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      teamMembers: updated,
                                    }));
                                  }}
                                  placeholder="Enter email"
                                  className="w-full"
                                  required
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="text"
                                  value={member.department}
                                  onChange={(e) => {
                                    const updated = [...formData.teamMembers];
                                    updated[index] = {
                                      ...updated[index],
                                      department: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      teamMembers: updated,
                                    }));
                                  }}
                                  placeholder="Enter department"
                                  className="w-full"
                                  required
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = formData.teamMembers.filter(
                                      (_, i) => i !== index
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      teamMembers: updated,
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                  aria-label="Remove team member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-2 border-t border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          teamMembers: [
                            ...prev.teamMembers,
                            {
                              name: "",
                              rollNumber: "",
                              email: "",
                              mailId: "",
                              department: "",
                            },
                          ],
                        }));
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nirmaan Program Questions */}
          <Card>
            <CardHeader>
              <CardTitle>About Nirmaan Program</CardTitle>
              <CardDescription>
                Help us understand your interest in the Nirmaan program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="heardAboutNirmaan">
                  Where did you get to know about Nirmaan?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="heardAboutNirmaan"
                  name="heardAboutNirmaan"
                  required
                  rows={3}
                  value={formData.heardAboutNirmaan}
                  onChange={handleChange}
                  placeholder="Tell us how you heard about Nirmaan..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nirmaanCanHelp">
                  I believe Nirmaan can help me with...{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="nirmaanCanHelp"
                  name="nirmaanCanHelp"
                  required
                  rows={4}
                  value={formData.nirmaanCanHelp}
                  onChange={handleChange}
                  placeholder="Describe how Nirmaan can help you..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preIncubationReason">
                  At this stage, I am applying for the pre-incubation program
                  instead of incubation because...{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="preIncubationReason"
                  name="preIncubationReason"
                  required
                  rows={4}
                  value={formData.preIncubationReason}
                  onChange={handleChange}
                  placeholder="Explain your reason for applying to pre-incubation..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heardAboutStartups">
                  What startups from IITM have you heard about which were
                  pre-incubated in Nirmaan?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="heardAboutStartups"
                  name="heardAboutStartups"
                  required
                  rows={4}
                  value={formData.heardAboutStartups}
                  onChange={handleChange}
                  placeholder="List the startups you know about..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Problem & Solution */}
          <Card>
            <CardHeader>
              <CardTitle>Problem & Solution</CardTitle>
              <CardDescription>
                Tell us about the problem you're solving and your solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="problemSolving">
                  What is the problem you are solving? Mention in brief (2-3
                  lines) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="problemSolving"
                  name="problemSolving"
                  required
                  rows={3}
                  value={formData.problemSolving}
                  onChange={handleChange}
                  placeholder="Describe the problem you're addressing..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yourSolution">
                  What is your solution? (2-3 lines){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="yourSolution"
                  name="yourSolution"
                  required
                  rows={3}
                  value={formData.yourSolution}
                  onChange={handleChange}
                  placeholder="Describe your solution..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solutionType">
                  What kind of solution is it?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.solutionType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      solutionType: value,
                      solutionTypeOther: "",
                    }))
                  }
                  required
                >
                  <SelectTrigger id="solutionType">
                    <SelectValue placeholder="Select solution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware Oriented / Physical Products">
                      Hardware Oriented / Physical Products
                    </SelectItem>
                    <SelectItem value="Software Oriented / App / Analytics">
                      Software Oriented / App / Analytics
                    </SelectItem>
                    <SelectItem value="Hybrid - Hardware + Software / Embedded Analytics">
                      Hybrid - Hardware + Software / Embedded Analytics
                    </SelectItem>
                    <SelectItem value="Service Oriented / Services Offered / Consultancy">
                      Service Oriented / Services Offered / Consultancy
                    </SelectItem>
                    <SelectItem value="Others">
                      Others
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showSolutionTypeOther && (
                <div className="space-y-2">
                  <Label htmlFor="solutionTypeOther">
                    Please specify <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="solutionTypeOther"
                    name="solutionTypeOther"
                    type="text"
                    required={showSolutionTypeOther}
                    value={formData.solutionTypeOther}
                    onChange={handleChange}
                    placeholder="Enter solution type"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Industry & Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Industry & Technologies</CardTitle>
              <CardDescription>
                Tell us about your target industry and technologies used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetIndustry">
                  Which industry would this most likely be applied to? Select
                  only the top / main industry.{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.targetIndustry}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetIndustry: value,
                      industryOther:
                        value === "Other" ? prev.industryOther : "",
                    }))
                  }
                  required
                >
                  <SelectTrigger id="targetIndustry">
                    <SelectValue placeholder="Select main industry" />
                  </SelectTrigger>
                  <SelectContent className=" max-h-[250px] overflow-y-auto">
                    <SelectItem value="Aerospace & Drones Applications">
                      Aerospace & Drones Applications
                    </SelectItem>
                    <SelectItem value="Agriculture & Allied Industries">
                      Agriculture & Allied Industries
                    </SelectItem>
                    <SelectItem value="Apparels, Fashion & Personal Gadgets">
                      Apparels, Fashion & Personal Gadgets
                    </SelectItem>
                    <SelectItem value="Arts, Culture & Traditions">
                      Arts, Culture & Traditions
                    </SelectItem>
                    <SelectItem value="Automobiles & Self-Driving Assistances">
                      Automobiles & Self-Driving Assistances
                    </SelectItem>
                    <SelectItem value="Banking, Finance Services & Insurance (BFSI)">
                      Banking, Finance Services & Insurance (BFSI)
                    </SelectItem>
                    <SelectItem value="Central & State Government Agencies">
                      Central & State Government Agencies
                    </SelectItem>
                    <SelectItem value="Defense & Security Systems">
                      Defense & Security Systems
                    </SelectItem>
                    <SelectItem value="E-Commerce Platform">
                      E-Commerce Platform
                    </SelectItem>
                    <SelectItem value="Education & Research">
                      Education & Research
                    </SelectItem>
                    <SelectItem value="Health, Wellness & Allied Industries">
                      Health, Wellness & Allied Industries
                    </SelectItem>
                    <SelectItem value="Human Resources Management">
                      Human Resources Management
                    </SelectItem>
                    <SelectItem value="Logistics & Transportation">
                      Logistics & Transportation
                    </SelectItem>
                    <SelectItem value="Manufacturing & Processing">
                      Manufacturing & Processing
                    </SelectItem>
                    <SelectItem value="Marketing, Social Media & Sales">
                      Marketing, Social Media & Sales
                    </SelectItem>
                    <SelectItem value="Space Exploration Satellite">
                      Space Exploration Satellite
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showIndustryOther && (
                <div className="space-y-2">
                  <Label htmlFor="industryOther">
                    Please specify <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="industryOther"
                    name="industryOther"
                    type="text"
                    required={showIndustryOther}
                    value={formData.industryOther}
                    onChange={handleChange}
                    placeholder="Enter your industry"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>
                  Which other industries would this most likely be applied to?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 p-4 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900">
                  {[
                    "None",
                    "Aerospace & Drones Applications",
                    "Agriculture & Allied Industries",
                    "Apparels, Fashion & Personal Gadgets",
                    "Arts, Culture & Traditions",
                    "Automobiles & Self-Driving Assistances",
                    "Banking, Finance Services & Insurance (BFSI)",
                    "Central & State Government Agencies",
                    "Defense & Security Systems",
                    "E-Commerce Platform",
                    "Education & Research",
                    "Health, Wellness & Allied Industries",
                    "Human Resources Management",
                    "Logistics & Transportation",
                    "Manufacturing & Processing",
                    "Marketing, Social Media & Sales",
                    "Space Exploration Satellite",
                    "Other",
                  ].map((industry) => (
                    <label
                      key={industry}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.otherIndustries.includes(industry)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              otherIndustries: [
                                ...prev.otherIndustries,
                                industry,
                              ],
                              // Clear "Other" input if "None" is selected or vice versa
                              ...(industry === "None" && {
                                otherIndustries: ["None"],
                                otherIndustriesOther: "",
                              }),
                              ...(prev.otherIndustries.includes("None") &&
                                industry !== "None" && {
                                  otherIndustries: prev.otherIndustries.filter(
                                    (i) => i !== "None",
                                  ),
                                }),
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              otherIndustries: prev.otherIndustries.filter(
                                (i) => i !== industry,
                              ),
                              ...(industry === "Other" && {
                                otherIndustriesOther: "",
                              }),
                            }));
                          }
                        }}
                        className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
                      />
                      <span className="text-sm text-zinc-900 dark:text-zinc-50">
                        {industry}
                      </span>
                    </label>
                  ))}
                </div>
                {showOtherIndustriesOther && (
                  <div className="mt-2">
                    <Label htmlFor="otherIndustriesOther">
                      Please specify <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="otherIndustriesOther"
                      name="otherIndustriesOther"
                      type="text"
                      required={showOtherIndustriesOther}
                      value={formData.otherIndustriesOther}
                      onChange={handleChange}
                      placeholder="Enter your industry"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  What technologies are utilized in your solution? (Select all
                  that apply)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    "3D Printing & Fabrication",
                    "App Development",
                    "Artificial Intelligence (AI) & Machine Learning (ML)",
                    "Augmented Reality (AR) & Virtual Reality (VR)",
                    "BioMimicry Applications",
                    "Blockchain",
                    "Deep Technology (Anything with a deep technical expertise)",
                    "Internet of Things (IoT)",
                    "Other",
                  ].map((tech) => (
                    <label
                      key={tech}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.technologiesUtilized.includes(tech)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              technologiesUtilized: [
                                ...prev.technologiesUtilized,
                                tech,
                              ],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              technologiesUtilized:
                                prev.technologiesUtilized.filter(
                                  (t) => t !== tech,
                                ),
                            }));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.technologiesUtilized.includes("Other") && (
                <div className="space-y-2">
                  <Label htmlFor="otherTechnologyDetails">
                    Please specify other technologies{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="otherTechnologyDetails"
                    name="otherTechnologyDetails"
                    type="text"
                    required={formData.technologiesUtilized.includes("Other")}
                    value={formData.otherTechnologyDetails}
                    onChange={handleChange}
                    placeholder="Enter other technologies"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Startup Stage & IP */}
          <Card>
            <CardHeader>
              <CardTitle>Startup Stage & Intellectual Property</CardTitle>
              <CardDescription>
                Information about your startup stage and IP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startupStage">
                  At what stage is your startup/project?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startupStage"
                  name="startupStage"
                  type="text"
                  required
                  value={formData.startupStage}
                  onChange={handleChange}
                  placeholder="Enter the stage of your startup/project"
                />
              </div>

              <div className="space-y-3">
                <Label>
                  Do you have any intellectual property (IP) on your solution?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.hasIntellectualProperty}
                  onValueChange={(value) => {
                    handleRadioChange("hasIntellectualProperty", value);
                    if (value === "No") {
                      setIpFile(null);
                      const fileInput = document.getElementById(
                        "ipFile",
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }
                  }}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Yes" id="ip-yes">
                    Yes
                  </RadioGroupItem>
                  <RadioGroupItem value="No" id="ip-no">
                    No
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              {formData.hasIntellectualProperty === "Yes" && (
                <div className="space-y-2">
                  <Label htmlFor="ipFile">
                    Upload IP Documents{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="ipFile"
                      name="ipFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required={formData.hasIntellectualProperty === "Yes"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIpFile(file);
                          setErrorMessage("");
                        }
                      }}
                      className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-900 dark:file:text-zinc-50 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
                    />
                    {ipFile && (
                      <div className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                        <span className="text-sm text-zinc-900 dark:text-zinc-50">
                          Selected: {ipFile.name} (
                          {(ipFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIpFile(null);
                            const fileInput = document.getElementById(
                              "ipFile",
                            ) as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                          }}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">
                    Accepted formats: PDF, DOC, DOCX
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Label>
                  Do you see any potential intellectual property (IP) on your
                  solution? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.hasPotentialIntellectualProperty}
                  onValueChange={(value) => {
                    handleRadioChange("hasPotentialIntellectualProperty", value);
                    if (value === "No") {
                      setPotentialIpFile(null);
                      const fileInput = document.getElementById(
                        "potentialIpFile",
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }
                  }}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Yes" id="potential-ip-yes">
                    Yes
                  </RadioGroupItem>
                  <RadioGroupItem value="No" id="potential-ip-no">
                    No
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              {formData.hasPotentialIntellectualProperty === "Yes" && (
                <div className="space-y-2">
                  <Label htmlFor="potentialIpFile">
                    Upload Potential IP Documents{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="potentialIpFile"
                      name="potentialIpFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required={formData.hasPotentialIntellectualProperty === "Yes"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPotentialIpFile(file);
                          setErrorMessage("");
                        }
                      }}
                      className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-900 dark:file:text-zinc-50 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
                    />
                    {potentialIpFile && (
                      <div className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                        <span className="text-sm text-zinc-900 dark:text-zinc-50">
                          Selected: {potentialIpFile.name} (
                          {(potentialIpFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPotentialIpFile(null);
                            const fileInput = document.getElementById(
                              "potentialIpFile",
                            ) as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                          }}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">
                    Accepted formats: PDF, DOC, DOCX
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Presentation & Proof */}
          <Card>
            <CardHeader>
              <CardTitle>Presentation & Proof of Concept</CardTitle>
              <CardDescription>
                Share your presentation and proof of concept details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nirmaanPresentationLink">
                  Upload your Nirmaan Presentation as per the Template. (Max 10
                  MB size){" "}
                  <a
                    href="/Nirmaan Sample Pitchdeck.pptx"
                    className="text-blue-500 hover:text-blue-600 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open("/Nirmaan Sample Pitchdeck.pptx", "_blank");
                    }}
                  >
                    Find template here
                  </a>{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  <Input
                    id="nirmaanPresentationLink"
                    name="nirmaanPresentationLink"
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file size (10 MB = 10 * 1024 * 1024 bytes)
                        const maxSize = 10 * 1024 * 1024;
                        if (file.size > maxSize) {
                          setErrorMessage(
                            "File size exceeds 10 MB limit. Please upload a smaller file.",
                          );
                          e.target.value = "";
                          setPresentationFile(null);
                          return;
                        }
                        setPresentationFile(file);
                        setFormData((prev) => ({
                          ...prev,
                          nirmaanPresentationLink: file.name,
                        }));
                        setErrorMessage("");
                      }
                    }}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-900 dark:file:text-zinc-50 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
                  />
                  {presentationFile && (
                    <div className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                      <span className="text-sm text-zinc-900 dark:text-zinc-50">
                        Selected: {presentationFile.name} (
                        {(presentationFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPresentationFile(null);
                          setFormData((prev) => ({
                            ...prev,
                            nirmaanPresentationLink: "",
                          }));
                          const fileInput = document.getElementById(
                            "nirmaanPresentationLink",
                          ) as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-zinc-500">
                  Accepted formats: PDF, PPT, PPTX (Max 10 MB)
                </p>
              </div>

              <div className="space-y-3">
                <Label>
                  Do you have a proof of concept to validate your idea?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.hasProofOfConcept}
                  onValueChange={(value) => {
                    handleRadioChange("hasProofOfConcept", value);
                    if (value === "No") {
                      setFormData((prev) => ({
                        ...prev,
                        proofOfConceptDetails: "",
                      }));
                    }
                  }}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Yes" id="poc-yes">
                    Yes
                  </RadioGroupItem>
                  <RadioGroupItem value="No" id="poc-no">
                    No
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              {showProofOfConceptDetails && (
                <div className="space-y-2">
                  <Label htmlFor="proofOfConceptDetails">
                    Please add descriptions/links below, if applicable.{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="proofOfConceptDetails"
                    name="proofOfConceptDetails"
                    required={showProofOfConceptDetails}
                    rows={4}
                    value={formData.proofOfConceptDetails}
                    onChange={handleChange}
                    placeholder="Describe your proof of concept or provide links..."
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label>
                  Have you filed for any patents/published papers?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.hasPatentsOrPapers}
                  onValueChange={(value) => {
                    handleRadioChange("hasPatentsOrPapers", value);
                    if (value === "No") {
                      setFormData((prev) => ({
                        ...prev,
                        patentsOrPapersDetails: "",
                      }));
                    }
                  }}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Yes" id="patents-yes">
                    Yes
                  </RadioGroupItem>
                  <RadioGroupItem value="No" id="patents-no">
                    No
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              {showPatentsOrPapersDetails && (
                <div className="space-y-2">
                  <Label htmlFor="patentsOrPapersDetails">
                    Please add the relevant links/description.{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="patentsOrPapersDetails"
                    name="patentsOrPapersDetails"
                    required={showPatentsOrPapersDetails}
                    rows={4}
                    value={formData.patentsOrPapersDetails}
                    onChange={handleChange}
                    placeholder="Provide links to patents or papers..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seed Fund & Pitch Video */}
          <Card>
            <CardHeader>
              <CardTitle>Seed Fund & Pitch Video</CardTitle>
              <CardDescription>
                Information about seed fund utilization and pitch video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seedFundUtilizationPlan">
                  How do you plan to use the seed fund...{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="seedFundUtilizationPlan"
                  name="seedFundUtilizationPlan"
                  required
                  rows={4}
                  value={formData.seedFundUtilizationPlan}
                  onChange={handleChange}
                  placeholder="Describe how you plan to utilize the seed fund..."
                />
                <a
                  href="/seed-fund-guidelines.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm inline-block mt-2"
                >
                  View Seed Fund Guidelines (PDF)
                </a>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitchVideoLink">
                  Please share the link to the video of you presenting the
                  PPT... <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pitchVideoLink"
                  name="pitchVideoLink"
                  type="url"
                  required
                  value={formData.pitchVideoLink}
                  onChange={handleChange}
                  placeholder="Enter link to your pitch video"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document1Link">Document 1 - Upload</Label>
                <div className="space-y-2">
                  <Input
                    id="document1Link"
                    name="document1Link"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setDocument1File(file);
                        setFormData((prev) => ({
                          ...prev,
                          document1Link: file.name,
                        }));
                      }
                    }}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-900 dark:file:text-zinc-50 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
                  />
                  {document1File && (
                    <div className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                      <span className="text-sm text-zinc-900 dark:text-zinc-50">
                        Selected: {document1File.name} (
                        {(document1File.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setDocument1File(null);
                          setFormData((prev) => ({
                            ...prev,
                            document1Link: "",
                          }));
                          const fileInput = document.getElementById(
                            "document1Link",
                          ) as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-zinc-500">
                  Accepted formats: PDF, DOC, DOCX
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document2Link">Document 2 - Upload</Label>
                <div className="space-y-2">
                  <Input
                    id="document2Link"
                    name="document2Link"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setDocument2File(file);
                        setFormData((prev) => ({
                          ...prev,
                          document2Link: file.name,
                        }));
                      }
                    }}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-900 dark:file:text-zinc-50 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
                  />
                  {document2File && (
                    <div className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                      <span className="text-sm text-zinc-900 dark:text-zinc-50">
                        Selected: {document2File.name} (
                        {(document2File.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setDocument2File(null);
                          setFormData((prev) => ({
                            ...prev,
                            document2Link: "",
                          }));
                          const fileInput = document.getElementById(
                            "document2Link",
                          ) as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-zinc-500">
                  Accepted formats: PDF, DOC, DOCX
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-between items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
            >
              Cancel
            </Button>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isSavingDraft || isSubmitting}
                className="border-2 border-zinc-300 dark:border-zinc-600"
              >
                {isSavingDraft ? "Saving..." : draftSaved ? "Draft Saved ✓" : "Save Draft"}
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="default">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}