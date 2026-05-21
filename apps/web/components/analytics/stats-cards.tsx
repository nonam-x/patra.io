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
      desc: "Completed submissions collected",
      icon: FileText,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      desc: "Percentage of started forms completed",
      icon: Award,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Avg Completion Time",
      value: formatTime(avgCompletionTimeSeconds),
      desc: "Average session duration to submit",
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-6 rounded-xl border border-[#27272A] bg-[#111111] relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] text-[#A1A1AA] font-mono font-bold uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <Icon size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-white">
                {card.value}
              </h3>
              <p className="text-[11px] text-[#71717A] mt-1 leading-normal">
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
