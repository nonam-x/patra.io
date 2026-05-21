"use client";

import React, { useState } from "react";
import { Plus, Search, FileText } from "lucide-react";
import { trpc } from "~/trpc/client";
import { useAuthGuard } from "~/hooks/use-auth-guard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Header } from "~/components/app/header";
import { StatsGrid } from "~/components/dashboard/stats-grid";
import { FormsTable } from "~/components/dashboard/forms-table";
import { EmptyState } from "~/components/dashboard/empty-state";
import { CreateFormDialog } from "~/components/dashboard/create-form-dialog";

export default function DashboardPage() {
  const { user } = useAuthGuard();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Queries
  const {
    data: dashboardData,
    isLoading: statsLoading,
    refetch: refetchDashboard,
  } = trpc.analytics.getDashboard.useQuery(undefined, {
    enabled: !!user,
  });

  const {
    data: formsData,
    isLoading: formsLoading,
    refetch: refetchForms,
  } = trpc.form.list.useQuery(
    { page, limit: 10, search: search || undefined },
    { enabled: !!user }
  );

  const handleRefetch = () => {
    refetchForms();
    refetchDashboard();
  };

  return (
    <>
      <Header title="Workspace Forms" breadcrumbs={[{ label: "Patra" }, { label: "Forms" }]}>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-white hover:bg-white/90 text-black text-xs font-semibold px-4 h-9 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-[0.98]"
        >
          <Plus size={14} />
          <span>Create Form</span>
        </Button>
      </Header>

      <div className="p-6 max-w-6xl w-full mx-auto space-y-6 flex-1">
        {/* Quick Stats */}
        <StatsGrid
          totalForms={dashboardData?.totalForms}
          totalResponses={dashboardData?.totalResponses}
          publishedForms={dashboardData?.publishedForms}
          isLoading={statsLoading}
        />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <h2 className="text-sm font-bold text-white tracking-tight font-mono uppercase">
            All Forms
          </h2>
          
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-[#71717A]" />
            <Input
              type="text"
              placeholder="Search forms..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset page on search
              }}
              className="pl-9 h-9 bg-[#111111] border-[#27272A] text-xs focus-visible:ring-[#8B5CF6] text-white"
            />
          </div>
        </div>

        {/* Forms Content */}
        {formsLoading ? (
          <div className="border border-[#27272A] rounded-xl bg-[#111111] p-12 text-center text-xs text-[#A1A1AA] font-mono animate-pulse">
            fetching forms...
          </div>
        ) : !formsData?.forms || formsData.forms.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={search ? "No matches found" : "No forms created yet"}
            description={
              search
                ? "Try searching for a different name or description."
                : "Create a conversational form manually or generate one with AI."
            }
            actionLabel="Create Form"
            onAction={() => setIsCreateOpen(true)}
          />
        ) : (
          <FormsTable
            forms={formsData.forms as any}
            pagination={formsData.pagination}
            page={page}
            onPageChange={setPage}
            onRefetch={handleRefetch}
          />
        )}
      </div>

      <CreateFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleRefetch}
      />
    </>
  );
}
