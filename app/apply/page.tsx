"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { cn } from "@/lib/utils";

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
      college: string;
      role: string;
      contactNumber: string;
      isCoFounder?: boolean;
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  // Check authentication and load draft from server (form is always shown; draft only when logged in as applicant)
  useEffect(() => {
    const checkAuthAndLoadDraft = async () => {
      try {
        // Resume from link: draft loaded by token and stored in sessionStorage
        const resumeDraftRaw = typeof window !== "undefined" ? sessionStorage.getItem("resumeDraft") : null;
        if (resumeDraftRaw) {
          try {
            const draftApp = JSON.parse(resumeDraftRaw);
            sessionStorage.removeItem("resumeDraft");
            setFormData({
              email: draftApp.email || "",
              teamName: draftApp.team_name || "",
              yourName: draftApp.your_name || "",
              isIITM: draftApp.is_iitm || "",
              rollNumber: draftApp.roll_number || "",
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
              teamMembers: (() => {
                const raw = draftApp.team_members || [];
                const coCount = Math.max(0, parseInt(String(draftApp.co_founders_count || "0"), 10) || 0);
                return raw.map((m: Record<string, unknown>, i: number) => ({
                  name: m.name ?? "",
                  rollNumber: m.roll_number ?? (m as { rollNumber?: string }).rollNumber ?? "",
                  email: m.email ?? (m as { mailId?: string }).mailId ?? "",
                  mailId: (m as { mailId?: string }).mailId ?? m.email ?? "",
                  department: m.department ?? "",
                  college: m.college ?? "",
                  role: m.role ?? (i < coCount ? "Co-founder" : ""),
                  contactNumber: m.contact_number ?? (m as { contactNumber?: string }).contactNumber ?? "",
                  isCoFounder: i < coCount,
                }));
              })(),
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
              description: "Draft loaded from resume link. Continue where you left off.",
            });
          } catch (e) {
            console.error("Failed to load resume draft from sessionStorage:", e);
          }
          setIsCheckingAuth(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsCheckingAuth(false);
          return;
        }

        // Check if user is an applicant
        const { data: profile } = await supabase
          .from("applicant_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profile) {
          await supabase.auth.signOut();
          setIsCheckingAuth(false);
          return;
        }

        setUserId(user.id);

        // Load draft from server
        const { data: draftApp } = await supabase
          .from("new_application")
          .select("*")
          .eq("applicant_id", user.id)
          .eq("status", "draft")
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
            teamMembers: (() => {
              const raw = draftApp.team_members || [];
              const coCount = Math.max(0, parseInt(String(draftApp.co_founders_count || "0"), 10) || 0);
              return raw.map((m: Record<string, unknown>, i: number) => ({
                name: m.name ?? "",
                rollNumber: m.roll_number ?? m.rollNumber ?? "",
                email: m.email ?? m.mailId ?? "",
                mailId: m.mailId ?? m.email ?? "",
                department: m.department ?? "",
                college: m.college ?? "",
                role: m.role ?? (i < coCount ? "Co-founder" : ""),
                contactNumber: m.contact_number ?? m.contactNumber ?? "",
                isCoFounder: i < coCount,
              }));
            })(),
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

  // Sync co-founder rows when "How many co-founders" changes
  useEffect(() => {
    const n = Math.max(0, parseInt(formData.coFoundersCount, 10) || 0);
    const current = formData.teamMembers;
    const coFounders = current.filter((m) => m.isCoFounder);
    const others = current.filter((m) => !m.isCoFounder);

    if (n === coFounders.length) return;

    let newCoFounders = coFounders;
    if (n > coFounders.length) {
      const toAdd = n - coFounders.length;
      const newRows = Array.from({ length: toAdd }, () => ({
        name: "",
        rollNumber: "",
        email: "",
        mailId: "",
        department: "",
        college: "",
        role: "Co-founder",
        contactNumber: "",
        isCoFounder: true as const,
      }));
      newCoFounders = [...newRows, ...coFounders];
    } else {
      newCoFounders = coFounders.slice(0, n);
    }

    setFormData((prev) => ({
      ...prev,
      teamMembers: [...newCoFounders, ...others],
    }));
  }, [formData.coFoundersCount]);

  const formDataRef = useRef(formData);
  formDataRef.current = formData;
  const saveDraftRef = useRef<(silent: boolean) => Promise<void>>(() => Promise.resolve());
  const blurSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const BLUR_DEBOUNCE_MS = 2000;

  // Auto-save draft every 60 seconds (calls latest handleSaveDraft via ref)
  useEffect(() => {
    if (!draftId && !userId) return;
    const id = setInterval(() => {
      const fd = formDataRef.current;
      if (fd.email || fd.teamName || fd.yourName) saveDraftRef.current(true);
    }, 60000);
    return () => clearInterval(id);
  }, [draftId, userId]);

  // Save draft via API (create or update); no required fields — save whatever the user has entered.
  const handleSaveDraft = async (silent = false) => {
    try {
      if (!silent) setIsSavingDraft(true);

      let recoveredFrom404 = false;
      const payload: Record<string, unknown> = {
        applicationId: draftId || undefined,
        applicantId: userId || undefined,
        email: formData.email,
        teamName: formData.teamName,
        yourName: formData.yourName,
        isIITM: formData.isIITM,
        rollNumber: formData.rollNumber,
        collegeName: formData.collegeName || null,
        currentOccupation: formData.currentOccupation || null,
        phoneNumber: formData.phoneNumber,
        channel: formData.channel,
        channelOther: formData.channelOther || null,
        coFoundersCount: formData.coFoundersCount,
        facultyInvolved: formData.facultyInvolved,
        priorEntrepreneurshipExperience: formData.priorEntrepreneurshipExperience,
        teamPriorEntrepreneurshipExperience: formData.teamPriorEntrepreneurshipExperience,
        priorExperienceDetails: formData.priorExperienceDetails || null,
        mcaRegistered: formData.mcaRegistered,
        dpiitRegistered: formData.dpiitRegistered || null,
        dpiitDetails: formData.dpiitDetails || null,
        externalFunding: formData.externalFunding,
        currentlyIncubated: formData.currentlyIncubated || null,
        teamMembers: formData.teamMembers,
        nirmaanCanHelp: formData.nirmaanCanHelp,
        preIncubationReason: formData.preIncubationReason,
        heardAboutStartups: formData.heardAboutStartups,
        heardAboutNirmaan: formData.heardAboutNirmaan,
        problemSolving: formData.problemSolving,
        yourSolution: formData.yourSolution,
        solutionType: formData.solutionType,
        solutionTypeOther: formData.solutionTypeOther || null,
        targetIndustry: formData.targetIndustry,
        otherIndustries: formData.otherIndustries,
        industryOther: formData.industryOther || null,
        otherIndustriesOther: formData.otherIndustriesOther || null,
        technologiesUtilized: formData.technologiesUtilized,
        otherTechnologyDetails: formData.otherTechnologyDetails || null,
        startupStage: formData.startupStage,
        hasIntellectualProperty: formData.hasIntellectualProperty,
        hasPotentialIntellectualProperty: formData.hasPotentialIntellectualProperty,
        nirmaanPresentationLink: formData.nirmaanPresentationLink,
        hasProofOfConcept: formData.hasProofOfConcept,
        proofOfConceptDetails: formData.proofOfConceptDetails || null,
        hasPatentsOrPapers: formData.hasPatentsOrPapers,
        patentsOrPapersDetails: formData.patentsOrPapersDetails || null,
        seedFundUtilizationPlan: formData.seedFundUtilizationPlan,
        pitchVideoLink: formData.pitchVideoLink,
        document1Link: formData.document1Link || null,
        document2Link: formData.document2Link || null,
      };

      let res = await fetch("/api/apply/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = await res.json().catch(() => ({}));

      // 404 = draft not found or already submitted: clear stale id and retry as new draft once
      if (res.status === 404 && payload.applicationId) {
        setDraftId(null);
        const newPayload = { ...payload, applicationId: undefined };
        res = await fetch("/api/apply/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPayload),
        });
        data = await res.json().catch(() => ({}));
        if (res.ok) recoveredFrom404 = true;
      }

      if (!res.ok) {
        const msg =
          res.status === 503
            ? "Draft service is unavailable. Start the backend (e.g. run `npm run dev` in the backend folder) and ensure API_URL or NEXT_PUBLIC_API_URL is set in .env.development or .env.local (e.g. http://localhost:5001)."
            : res.status === 404
              ? data.details || data.error || "Draft not found or already submitted."
              : data.details || data.error || "Failed to save draft";
        throw new Error(msg);
      }

      if (data.id) setDraftId(data.id);
      if (data.resumeToken && data.isNew) {
        addToast({
          variant: "default",
          description: "Draft saved. Check your email for a resume link.",
        });
      }
      if (recoveredFrom404 && !silent) {
        addToast({
          variant: "default",
          description: "Previous draft was not found; saved as a new draft.",
        });
      }

      if (silent) {
        setAutoSaveIndicator(true);
        setTimeout(() => setAutoSaveIndicator(false), 2000);
      } else if (!data.resumeToken) {
        setDraftSaved(true);
        addToast({
          variant: "default",
          description: "Draft saved successfully!",
        });
        setTimeout(() => setDraftSaved(false), 3000);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save draft. Please try again.";
      console.error("Error saving draft:", error);
      addToast({
        variant: "destructive",
        description: message,
      });
    } finally {
      if (!silent) setIsSavingDraft(false);
    }
  };
  saveDraftRef.current = handleSaveDraft;

  // Auto-save on blur: when focus leaves any form field, debounce 2s then save
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onFocusOut = () => {
      if (blurSaveTimeoutRef.current) clearTimeout(blurSaveTimeoutRef.current);
      blurSaveTimeoutRef.current = setTimeout(() => {
        blurSaveTimeoutRef.current = null;
        const fd = formDataRef.current;
        if (fd.email || fd.teamName || fd.yourName) saveDraftRef.current(true);
      }, BLUR_DEBOUNCE_MS);
    };
    form.addEventListener("focusout", onFocusOut);
    return () => {
      form.removeEventListener("focusout", onFocusOut);
      if (blurSaveTimeoutRef.current) clearTimeout(blurSaveTimeoutRef.current);
    };
  }, []);

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
    setFieldErrors({});

    const newErrors: Record<string, string> = {};

    // Phone: exactly 10 digits only
    const phoneDigits = (formData.phoneNumber || "").replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      newErrors.phoneNumber = "Contact number must be exactly 10 digits (numbers only).";
    }

    // Email: required and must end with .com or .in
    const email = (formData.email || "").trim().toLowerCase();
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\.(com|in)$/.test(email)) {
      newErrors.email = "Email must end with .com or .in";
    }

    // Required dropdowns
    if (!formData.channel?.trim()) {
      newErrors.channel = "Please select a channel.";
    }
    if (showNonIITMFields && !formData.currentOccupation?.trim()) {
      newErrors.currentOccupation = "Please select your occupation.";
    }
    if (!formData.solutionType?.trim()) {
      newErrors.solutionType = "Please select a solution type.";
    }
    if (!formData.targetIndustry?.trim()) {
      newErrors.targetIndustry = "Please select main industry.";
    }

    // Fund table: amount must be numbers only
    formData.externalFunding.forEach((entry, index) => {
      if (entry.amount.trim() !== "" && !/^\d+$/.test(entry.amount.replace(/,/g, ""))) {
        newErrors[`fundAmount_${index}`] = "Amount must contain only numbers.";
      }
    });

    // Team members: email must end with .com or .in when provided
    formData.teamMembers.forEach((member, index) => {
      const teamEmail = (member.email || "").trim().toLowerCase();
      if (teamEmail && !/\.(com|in)$/.test(teamEmail)) {
        newErrors[`teamEmail_${index}`] = "Team member email must end with .com or .in";
      }
    });

    // Team members: contact number 10 digits only when provided
    formData.teamMembers.forEach((member, index) => {
      if (member.contactNumber?.trim()) {
        const digits = (member.contactNumber || "").replace(/\D/g, "");
        if (digits.length !== 10) {
          newErrors[`teamContact_${index}`] = "Contact number must be exactly 10 digits.";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setIsSubmitting(false);
      const errorMessages = [...new Set(Object.values(newErrors))];
      const description = errorMessages.length === 1
        ? errorMessages[0]
        : `Please fix the following: ${errorMessages.map((msg, i) => `${i + 1}. ${msg}`).join(" ")}`;
      addToast({
        variant: "destructive",
        description,
      });
      return;
    }

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
      const radioErrorMessages = missingFields.map((label) => `Please select an option for: ${label}`);
      const description = radioErrorMessages.length === 1
        ? radioErrorMessages[0]
        : `Please fix the following: ${radioErrorMessages.map((msg, i) => `${i + 1}. ${msg}`).join(" ")}`;
      addToast({
        variant: "destructive",
        description,
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
        const msg = data.error || "Failed to submit application";
        setErrorMessage(msg);
        addToast({ variant: "destructive", description: msg });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
      const msg = "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
      addToast({ variant: "destructive", description: msg });
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
              {userId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                  }}
                  className="ml-4"
                >
                  Logout
                </Button>
              )}
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

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={(e) => {
                    handleChange(e);
                    if (fieldErrors.email) setFieldErrors((prev) => { const next = { ...prev }; delete next.email; return next; });
                  }}
                  placeholder="your@email.com"
                  className={cn(fieldErrors.email && "border-red-500")}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-500">{fieldErrors.email}</p>
                )}
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
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, currentOccupation: value }));
                        if (fieldErrors.currentOccupation) setFieldErrors((prev) => { const next = { ...prev }; delete next.currentOccupation; return next; });
                      }}
                      required={showNonIITMFields}
                    >
                      <SelectTrigger id="currentOccupation" className={cn(fieldErrors.currentOccupation && "border-red-500")}>
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Employed">Employed</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.currentOccupation && (
                      <p className="text-sm text-red-500">{fieldErrors.currentOccupation}</p>
                    )}
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
                  inputMode="numeric"
                  maxLength={10}
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData((prev) => ({ ...prev, phoneNumber: v }));
                    if (fieldErrors.phoneNumber) setFieldErrors((prev) => { const next = { ...prev }; delete next.phoneNumber; return next; });
                  }}
                  placeholder="10 digit number"
                  className={cn(fieldErrors.phoneNumber && "border-red-500")}
                />
                {fieldErrors.phoneNumber && (
                  <p className="text-sm text-red-500">{fieldErrors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">
                  Please select the relevant channel that you belong to{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, channel: value, channelOther: "" }));
                    if (fieldErrors.channel) setFieldErrors((prev) => { const next = { ...prev }; delete next.channel; return next; });
                  }}
                  required
                >
                  <SelectTrigger id="channel" className={cn(fieldErrors.channel && "border-red-500")}>
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
                {fieldErrors.channel && (
                  <p className="text-sm text-red-500">{fieldErrors.channel}</p>
                )}
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
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.coFoundersCount}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, coFoundersCount: v }));
                  }}
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
                                <div>
                                  <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={funding.amount}
                                    onChange={(e) => {
                                      const v = e.target.value.replace(/\D/g, "");
                                      const updated = [...formData.externalFunding];
                                      updated[index] = { ...updated[index], amount: v };
                                      setFormData((prev) => ({ ...prev, externalFunding: updated }));
                                      if (fieldErrors[`fundAmount_${index}`]) setFieldErrors((prev) => { const next = { ...prev }; delete next[`fundAmount_${index}`]; return next; });
                                    }}
                                    placeholder="Ex. 200000"
                                    className={cn("w-full", fieldErrors[`fundAmount_${index}`] && "border-red-500")}
                                  />
                                  {fieldErrors[`fundAmount_${index}`] && (
                                    <p className="text-xs text-red-500 mt-0.5">{fieldErrors[`fundAmount_${index}`]}</p>
                                  )}
                                </div>
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
                    <table className="w-full min-w-[1200px]">
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
                         
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            4. Department
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            5. College
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            6. Role
                          </th>
                          <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 border-r border-zinc-300 dark:border-zinc-700">
                            7. Contact Number
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
                              colSpan={8}
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
                                <div>
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
                                      if (fieldErrors[`teamEmail_${index}`]) setFieldErrors((prev) => { const next = { ...prev }; delete next[`teamEmail_${index}`]; return next; });
                                    }}
                                    placeholder="e.g. name@domain.com or .in"
                                    className={cn("w-full", fieldErrors[`teamEmail_${index}`] && "border-red-500")}
                                    required
                                  />
                                  {fieldErrors[`teamEmail_${index}`] && (
                                    <p className="text-xs text-red-500 mt-0.5">{fieldErrors[`teamEmail_${index}`]}</p>
                                  )}
                                </div>
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
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <Input
                                  type="text"
                                  value={member.college}
                                  onChange={(e) => {
                                    const updated = [...formData.teamMembers];
                                    updated[index] = {
                                      ...updated[index],
                                      college: e.target.value,
                                    };
                                    setFormData((prev) => ({
                                      ...prev,
                                      teamMembers: updated,
                                    }));
                                  }}
                                  placeholder="Enter College Name"
                                  className="w-full"
                                  required
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                {member.isCoFounder ? (
                                  <span className="text-sm text-zinc-700 dark:text-zinc-300 px-2 py-1.5 block bg-zinc-100 dark:bg-zinc-800 rounded">
                                    Co-founder
                                  </span>
                                ) : (
                                  <Input
                                    type="text"
                                    value={member.role ?? ""}
                                    onChange={(e) => {
                                      const updated = [...formData.teamMembers];
                                      updated[index] = {
                                        ...updated[index],
                                        role: e.target.value,
                                      };
                                      setFormData((prev) => ({
                                        ...prev,
                                        teamMembers: updated,
                                      }));
                                    }}
                                    placeholder="Enter role"
                                    className="w-full"
                                  />
                                )}
                              </td>
                              <td className="px-3 py-2 border-r border-zinc-300 dark:border-zinc-700">
                                <div>
                                  <Input
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={member.contactNumber ?? ""}
                                    onChange={(e) => {
                                      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                                      const updated = [...formData.teamMembers];
                                      updated[index] = { ...updated[index], contactNumber: v };
                                      setFormData((prev) => ({ ...prev, teamMembers: updated }));
                                      if (fieldErrors[`teamContact_${index}`]) setFieldErrors((prev) => { const next = { ...prev }; delete next[`teamContact_${index}`]; return next; });
                                    }}
                                    placeholder="10 digit number"
                                    className={cn("w-full", fieldErrors[`teamContact_${index}`] && "border-red-500")}
                                  />
                                  {fieldErrors[`teamContact_${index}`] && (
                                    <p className="text-xs text-red-500 mt-0.5">{fieldErrors[`teamContact_${index}`]}</p>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (member.isCoFounder) return;
                                    const updated = formData.teamMembers.filter(
                                      (_, i) => i !== index
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      teamMembers: updated,
                                    }));
                                  }}
                                  disabled={member.isCoFounder}
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                              college: "",
                              role: "",
                              contactNumber: "",
                              isCoFounder: false,
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
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, solutionType: value, solutionTypeOther: "" }));
                    if (fieldErrors.solutionType) setFieldErrors((prev) => { const next = { ...prev }; delete next.solutionType; return next; });
                  }}
                  required
                >
                  <SelectTrigger id="solutionType" className={cn(fieldErrors.solutionType && "border-red-500")}>
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
                {fieldErrors.solutionType && (
                  <p className="text-sm text-red-500">{fieldErrors.solutionType}</p>
                )}
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
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      targetIndustry: value,
                      industryOther: value === "Other" ? prev.industryOther : "",
                    }));
                    if (fieldErrors.targetIndustry) setFieldErrors((prev) => { const next = { ...prev }; delete next.targetIndustry; return next; });
                  }}
                  required
                >
                  <SelectTrigger id="targetIndustry" className={cn(fieldErrors.targetIndustry && "border-red-500")}>
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
                {fieldErrors.targetIndustry && (
                  <p className="text-sm text-red-500">{fieldErrors.targetIndustry}</p>
                )}
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
                <Label htmlFor="document1Link">If you have any documents related to your startup upload here
                  <p className="text-sm text-zinc-500">(research paper, White document or others )		</p>
                </Label>
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
                <Label htmlFor="document2Link">If you have any documents related to your startup upload here
                  <p className="text-sm text-zinc-500">(research paper, White document or others )</p>
                </Label>
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
                onClick={() => handleSaveDraft()}
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
