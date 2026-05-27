"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { trpc } from "~/trpc/client";
import { useAuth } from "~/hooks/use-auth";
import { StatsCards } from "~/components/analytics/stats-cards";
import { ResponsesChart } from "~/components/analytics/responses-chart";
import { FieldBreakdown } from "~/components/analytics/field-breakdown";
import { SubmissionsTable } from "~/components/analytics/submissions-table";
import { CSVExportButton } from "~/components/analytics/csv-export-button";

export default function AnalyticsPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { user, isLoading: authLoading } = useAuth();

  // Queries
  const { data: analytics, isLoading: analyticsLoading } =
    trpc.analytics.getFormAnalytics.useQuery({ formId: id }, { enabled: !!user });

  const { data: form, isLoading: formLoading } =
    trpc.form.getById.useQuery({ id }, { enabled: !!user });

  const { data: submissionsData, isLoading: subsLoading } =
    trpc.submission.list.useQuery({ formId: id, limit: 100 }, { enabled: !!user });

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || formLoading || analyticsLoading || subsLoading || !form || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-xs animate-pulse font-medium">
          Loading analytics...
        </div>
      </div>
    );
  }

  const fields = (form.fields || []) as any[];
  const submissions = (submissionsData?.submissions || []) as any[];

  return (
    <div className="h-screen bg-background text-foreground flex flex-col font-sans select-none overflow-hidden relative">
      {/* Header */}
      <header className="h-12 px-3 sm:px-4 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground p-1 sm:p-1.5 hover:bg-secondary rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={15} />
          </Link>
          <span className="font-semibold text-xs sm:text-sm text-foreground truncate max-w-[70px] min-[370px]:max-w-[110px] sm:max-w-[200px]" title={form.title}>
            {form.title}
          </span>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-0.5 text-[10px] sm:text-xs font-medium bg-secondary/80 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-border/60">
          <Link
            href={`/forms/${id}/builder`}
            className="px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all duration-200"
          >
            Builder
          </Link>
          <Link
            href={`/forms/${id}/analytics`}
            className="px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-lg bg-card text-foreground shadow-sm border border-border/40 transition-all duration-200"
          >
            Analytics
          </Link>
        </div>

        <div>
          <CSVExportButton
            submissions={submissions}
            fields={fields}
            formTitle={form.title}
          />
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 md:p-8 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {/* Key Metrics Widgets */}
          <StatsCards
            totalResponses={analytics.totalResponses}
            completionRate={analytics.completionRate}
            avgCompletionTimeSeconds={analytics.avgCompletionTimeSeconds}
          />

          {/* Area Chart trend of responses */}
          <ResponsesChart data={analytics.responsesOverTime} />

          {/* Submissions Detail Grid */}
          <SubmissionsTable submissions={submissions} fields={fields} />

          {/* Question breakdown lists */}
          <FieldBreakdown breakdown={analytics.fieldBreakdown as any} />
        </div>
      </div>
    </div>
  );
}
