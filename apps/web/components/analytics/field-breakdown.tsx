"use client";

import React from "react";
import { Star, MessageSquare, List } from "lucide-react";

interface AnswerDistribution {
  value: string;
  count: number;
  percentage: number;
}

interface FieldAnalytic {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  answerDistribution: AnswerDistribution[];
}

interface FieldBreakdownProps {
  breakdown: FieldAnalytic[];
}

export function FieldBreakdown({ breakdown }: FieldBreakdownProps) {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="border border-[#27272A] rounded-xl bg-[#111111] p-12 text-center text-xs text-[#71717A] font-mono">
        No questions breakdown data available.
      </div>
    );
  }

  const getFieldBadgeColor = (type: string) => {
    switch (type) {
      case "rating":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "multiple_choice":
      case "checkbox":
      case "dropdown":
        return "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20";
      default:
        return "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h4 className="text-sm font-semibold text-white">Questions Breakdown</h4>
        <p className="text-xs text-[#A1A1AA]">Detailed analysis of responses per question.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {breakdown.map((item) => {
          const totalAnswers = item.answerDistribution.reduce((sum, d) => sum + d.count, 0);

          return (
            <div
              key={item.fieldId}
              className="border border-[#27272A] rounded-xl bg-[#111111] p-6 space-y-4 shadow-sm"
            >
              {/* Question metadata header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#27272A]/50 pb-4">
                <div className="space-y-1 max-w-[80%]">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                    Question Label
                  </span>
                  <h5 className="text-sm font-bold text-white leading-normal">{item.fieldLabel}</h5>
                </div>
                <span
                  className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${getFieldBadgeColor(
                    item.fieldType
                  )}`}
                >
                  {item.fieldType.replace("_", " ")}
                </span>
              </div>

              {/* Answers list */}
              {totalAnswers === 0 ? (
                <p className="text-xs text-[#71717A] italic py-2">No responses captured for this question.</p>
              ) : (
                <div className="space-y-3.5 pt-1">
                  {item.answerDistribution.map((dist, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-medium truncate max-w-[70%]">
                          {dist.value}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-[#A1A1AA] shrink-0">
                          <span>{dist.count} responses</span>
                          <span className="text-zinc-500">|</span>
                          <span className="font-bold text-zinc-300">{dist.percentage}%</span>
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="h-2 w-full bg-[#18181B] rounded-full overflow-hidden border border-[#27272A]/50">
                        <div
                          className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] rounded-full transition-all duration-500"
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
