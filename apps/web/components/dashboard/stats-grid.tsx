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
      gradient: "from-primary/5",
    },
    {
      label: "Total Submissions",
      value: totalResponses,
      description: "Aggregated response volume",
      gradient: "from-muted-foreground/5",
    },
    {
      label: "Active Live Forms",
      value: publishedForms,
      description: "Published and collecting responses",
      gradient: "from-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-6 rounded-2xl border border-border bg-card relative overflow-hidden transition-all duration-300 hover:border-muted-foreground/30 hover:shadow-sm"
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.gradient} to-transparent pointer-events-none`}
          />
          <div className="text-xs font-semibold text-muted-foreground/80 mb-1.5">
            {stat.label}
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? (
              <span className="inline-block w-12 h-8 bg-muted rounded animate-pulse" />
            ) : (
              stat.value
            )}
          </div>
          <span className="text-[10px] text-muted-foreground/70 font-medium block mt-2">
            {stat.description}
          </span>
        </div>
      ))}
    </div>
  );
}
