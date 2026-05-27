"use client";

import React from "react";

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
      <div className="border border-border rounded-xl bg-card p-12 text-center text-xs text-muted-foreground">
        No questions breakdown data available.
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h4 className="text-sm font-semibold text-foreground">Questions Breakdown</h4>
        <p className="text-xs text-muted-foreground">Response analysis per question.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {breakdown.map((item) => {
          const totalAnswers = item.answerDistribution.reduce((sum, d) => sum + d.count, 0);

          return (
            <div
              key={item.fieldId}
              className="border border-border rounded-xl bg-card p-5 space-y-4"
            >
              {/* Question metadata header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-3">
                <div className="space-y-0.5 max-w-[80%]">
                  <h5 className="text-sm font-semibold text-foreground leading-normal">{item.fieldLabel}</h5>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md capitalize shrink-0">
                  {item.fieldType.replace("_", " ")}
                </span>
              </div>

              {/* Answers list */}
              {totalAnswers === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">No responses for this question.</p>
              ) : (
                <div className="space-y-3 pt-1">
                  {item.answerDistribution.map((dist, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-foreground font-medium truncate max-w-[70%]">
                          {dist.value}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
                          <span>{dist.count} responses</span>
                          <span className="text-muted-foreground/40">|</span>
                          <span className="font-semibold text-foreground">{dist.percentage}%</span>
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full transition-all duration-500"
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
