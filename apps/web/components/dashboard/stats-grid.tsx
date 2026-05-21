"use client";

import React from "react";

interface StatsGridProps {
  totalForms?: number;
  totalResponses?: number;
  publishedForms?: number;
  isLoading: boolean;
}

export function StatsGrid({
  totalForms = 0,
  totalResponses = 0,
  publishedForms = 0,
  isLoading,
}: StatsGridProps) {
  const stats = [
    {
      label: "Total Forms",
      value: totalForms,
      description: "Active forms count",
      gradient: "from-[#8B5CF6]/10",
    },
    {
      label: "Total Submissions",
      value: totalResponses,
      description: "Aggregated response volume",
      gradient: "from-[#3B82F6]/10",
    },
    {
      label: "Active Live Forms",
      value: publishedForms,
      description: "Published and collecting responses",
      gradient: "from-[#22D3EE]/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-6 rounded-xl border border-border bg-card relative overflow-hidden transition-all duration-300 hover:border-muted-foreground/30 shadow-sm"
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.gradient} to-transparent pointer-events-none`}
          />
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 font-mono">
            {stat.label}
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? (
              <span className="inline-block w-12 h-8 bg-muted rounded animate-pulse" />
            ) : (
              stat.value
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono block mt-2">
            {stat.description}
          </span>
        </div>
      ))}
    </div>
  );
}
