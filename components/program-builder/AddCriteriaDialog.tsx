"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AddCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { label: string; description?: string }) => Promise<void>;
}

export function AddCriteriaDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddCriteriaDialogProps) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setLabel("");
      setDescription("");
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const handleCreate = async () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError("Enter a question to continue.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        label: trimmed,
        ...(description.trim() ? { description: description.trim() } : {}),
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-lg",
          "border-zinc-200/80 bg-white shadow-2xl shadow-black/10",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40"
        )}
      >
        <DialogHeader className="space-y-1 border-b border-zinc-100 px-6 py-5 dark:border-zinc-800/80">
          <DialogTitle className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Add evaluation question
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Reviewers will enter a score from 0 to 10 (decimals allowed).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <Label
              htmlFor="new-criteria-name"
              className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300"
            >
              Question
            </Label>
            <Input
              id="new-criteria-name"
              autoFocus
              value={label}
              placeholder="e.g. How clear is the problem statement?"
              className="h-10 rounded-lg border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleCreate();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="new-criteria-desc"
              className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Textarea
              id="new-criteria-desc"
              value={description}
              rows={2}
              placeholder="Helper text for reviewers"
              className="rounded-lg border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <DialogFooter className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleCreate()}
            disabled={submitting || !label.trim()}
            className="rounded-lg"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
