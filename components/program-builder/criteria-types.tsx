import type { ReactNode } from "react";
import { Star } from "lucide-react";
import type { CriteriaType } from "@/lib/program-forms/types";

/** Evaluation questions always use a fixed 0–10 rank. */
export const DEFAULT_CRITERIA_TYPE: CriteriaType = "rating_scale";
export const RANK_MIN = 0;
export const RANK_MAX = 10;

export const CRITERIA_TYPES: Array<{
  value: CriteriaType;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    value: "rating_scale",
    label: "Rank 0–10",
    description: "Reviewers score each question from 0 to 10",
    icon: <Star className="h-4 w-4" strokeWidth={1.75} />,
  },
];
