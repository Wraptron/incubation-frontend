"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Max page number buttons to show (excluding first/last and ellipsis). Default 3. */
  maxVisible?: number;
  className?: string;
}

/** Returns an array of page numbers and "ellipsis" placeholders to display. */
function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number
): (number | "ellipsis")[] {
  if (totalPages <= maxVisible + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(
    totalPages - 1,
    Math.max(currentPage + 1, start + 1)
  );

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i);
    }
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 3,
  className,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages, maxVisible);
  const canGoBack = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const linkBase =
    "inline-flex items-center gap-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const linkEnabled =
    "text-primary hover:text-primary/80";
  const linkDisabled = "text-gray-400 dark:text-gray-500";

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3 shadow-sm",
        "bg-white dark:bg-card border border-gray-100 dark:border-border",
        className
      )}
    >
      {/* Back */}
      <button
        type="button"
        onClick={() => canGoBack && onPageChange(currentPage - 1)}
        disabled={!canGoBack}
        className={cn(linkBase, canGoBack ? linkEnabled : linkDisabled)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center px-1 text-primary"
                aria-hidden
              >
                …
              </span>
            );
          }

          const isActive = currentPage === page;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "flex h-9 min-w-[36px] items-center justify-center rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25"
              )}
              aria-label={isActive ? `Page ${page}, current` : `Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={cn(linkBase, canGoNext ? linkEnabled : linkDisabled)}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
