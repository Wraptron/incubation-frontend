"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RESUME_STORAGE_KEY = "resumeDraft";

function ResumePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error" | "redirect">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token")?.trim();
    if (!token) {
      setStatus("error");
      setMessage("Resume link is invalid. Missing token.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/apply/resume?token=${encodeURIComponent(token)}`
        );
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok) {
          setStatus("error");
          setMessage(
            data.details || data.error || "This resume link is invalid or has expired."
          );
          return;
        }

        const draft = data.draft;
        if (!draft) {
          setStatus("error");
          setMessage("Draft not found.");
          return;
        }

        if (typeof window !== "undefined") {
          sessionStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(draft));
        }
        setStatus("redirect");
        router.replace("/apply");
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setMessage("Failed to load your draft. Please try again.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  if (status === "loading" || status === "redirect") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            {status === "redirect" ? "Opening your draft..." : "Loading your draft..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Could not load draft
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">{message}</p>
        <a
          href="/apply"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Start new application
        </a>
      </div>
    </div>
  );
}

function ResumeFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading your draft...</p>
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<ResumeFallback />}>
      <ResumePageContent />
    </Suspense>
  );
}
