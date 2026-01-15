"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function CohortsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
            Cohorts
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage startup cohorts and batches.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-zinc-600 dark:text-zinc-400">
              Cohorts management coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
