"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ResponsesChartProps {
  data: { date: string; count: number }[];
}

export function ResponsesChart({ data }: ResponsesChartProps) {
  // If no data, display a placeholder
  if (!data || data.length === 0) {
    return (
      <div className="border border-border rounded-xl bg-card p-6 text-center text-xs text-muted-foreground h-80 flex flex-col justify-center items-center">
        No response data available for the last 30 days.
      </div>
    );
  }

  // Format date labels nicely
  const formattedData = data.map((d) => {
    const dateObj = new Date(d.date);
    return {
      ...d,
      formattedDate: dateObj.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    };
  });

  return (
    <div className="border border-border rounded-xl bg-card p-4 sm:p-6 space-y-4 font-sans">
      <div>
        <h4 className="text-sm font-semibold text-foreground">Responses Over Time</h4>
        <p className="text-xs text-muted-foreground">Daily completions for the last 30 days.</p>
      </div>

      <div className="h-56 sm:h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3C402B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3C402B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DC" vertical={false} />
            <XAxis
              dataKey="formattedDate"
              stroke="#8A8780"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#8A8780"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDD9D1",
                borderRadius: "10px",
                fontSize: "11px",
                color: "#343330",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Responses"
              stroke="#3C402B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
