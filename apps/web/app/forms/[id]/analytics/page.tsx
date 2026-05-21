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
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-[#A1A1AA] text-xs animate-pulse font-mono uppercase tracking-wider">
          compiling analytics dashboard...
        </div>
      </div>
    );
  }

  const fields = (form.fields || []) as any[];
  const submissions = (submissionsData?.submissions || []) as any[];

  return (
    <div className="h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col font-sans select-none overflow-hidden relative">
      {/* Header */}
      <header className="h-14 px-6 border-b border-[#27272A] bg-[#111111] flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-[#A1A1AA] hover:text-white p-1.5 hover:bg-[#18181B] rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="font-bold text-sm text-white truncate max-w-[80px] sm:max-w-[200px]" title={form.title}>
            {form.title}
          </span>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-1 text-xs font-semibold bg-[#18181B] p-1 rounded-lg border border-[#27272A]">
          <Link
            href={`/forms/${id}/builder`}
            className="px-3.5 py-1.5 rounded-md hover:bg-[#111111]/50 text-[#A1A1AA] hover:text-white transition-colors"
          >
            Builder
          </Link>
          <Link
            href={`/forms/${id}/analytics`}
            className="px-3.5 py-1.5 rounded-md bg-[#111111] text-white shadow-sm"
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
      <div className="flex-1 overflow-y-auto bg-[#09090B] p-6 md:p-8">
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
