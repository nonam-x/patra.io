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
      <div className="border border-[#27272A] rounded-xl bg-[#111111] p-6 text-center text-xs text-[#71717A] font-mono h-80 flex flex-col justify-center items-center">
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
    <div className="border border-[#27272A] rounded-xl bg-[#111111] p-6 space-y-4 font-sans">
      <div>
        <h4 className="text-sm font-semibold text-white">Responses Over Time</h4>
        <p className="text-xs text-[#A1A1AA]">Daily completions for the last 30 days.</p>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" vertical={false} />
            <XAxis
              dataKey="formattedDate"
              stroke="#71717A"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#71717A"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111111",
                border: "1px solid #27272A",
                borderRadius: "8px",
                fontSize: "11px",
                color: "#FFFFFF",
                fontFamily: "monospace",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Responses"
              stroke="#8B5CF6"
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
