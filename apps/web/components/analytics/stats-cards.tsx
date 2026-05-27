"use client";

import React from "react";
import { FileText, Award, Clock } from "lucide-react";

interface StatsCardsProps {
  totalResponses: number;
  completionRate: number;
  avgCompletionTimeSeconds: number | null;
}

export function StatsCards({
  totalResponses,
  completionRate,
  avgCompletionTimeSeconds,
}: StatsCardsProps) {
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "—";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const cards = [
    {
      title: "Total Responses",
      value: totalResponses.toLocaleString(),
      desc: "Completed submissions",
      icon: FileText,
      iconColor: "text-primary/60",
      iconBg: "bg-primary/5 border-primary/10",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      desc: "Started forms completed",
      icon: Award,
      iconColor: "text-emerald-600/60",
      iconBg: "bg-emerald-50 border-emerald-200/30",
    },
    {
      title: "Avg Time",
      value: formatTime(avgCompletionTimeSeconds),
      desc: "Average session duration",
      icon: Clock,
      iconColor: "text-amber-600/60",
      iconBg: "bg-amber-50 border-amber-200/30",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 font-sans">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-3 sm:p-5 rounded-xl border border-border bg-card relative overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-2 sm:mb-4">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium truncate">
                {card.title}
              </span>
              <div className={`hidden sm:flex p-2 rounded-lg border ${card.iconBg}`}>
                <Icon size={14} className={card.iconColor} />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-3xl font-bold tracking-tight text-foreground">
                {card.value}
              </h3>
              <p className="hidden sm:block text-[11px] text-muted-foreground mt-1 leading-normal">
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
