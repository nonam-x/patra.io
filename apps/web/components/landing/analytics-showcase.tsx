"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const stats = [
  { label: "Avg. Completion", value: "87%", desc: "across all forms" },
  { label: "Responses / Day", value: "1,240", desc: "real-time tracking" },
  { label: "Avg. Time", value: "42s", desc: "per submission" },
];

const barData = [
  { label: "Mon", height: 60 },
  { label: "Tue", height: 85 },
  { label: "Wed", height: 45 },
  { label: "Thu", height: 92 },
  { label: "Fri", height: 70 },
  { label: "Sat", height: 38 },
  { label: "Sun", height: 55 },
];

export default function AnalyticsShowcase() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "var(--color-landing-bg-alt, var(--color-landing-bg))" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <h2 className="landing-h2 mb-4">Understand your audience</h2>
          <p className="landing-body-lg max-w-xl mx-auto">
            Real-time analytics dashboard with completion funnels, response
            timelines, and exportable data.
          </p>
        </motion.div>

        {/* Analytics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Stats Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="landing-card p-6 flex items-center gap-5"
              >
                <div
                  className="text-3xl font-bold tracking-tight"
                  style={{
                    color: "var(--color-landing-text)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {stat.value}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{
                      color: "var(--color-landing-text)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{
                      color: "var(--color-landing-text-muted)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {stat.desc}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="lg:col-span-3 landing-card p-8"
          >
            <div className="flex items-center justify-between mb-8" style={{ fontFamily: "var(--font-inter)" }}>
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-landing-text)" }}
                >
                  Weekly Submissions
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--color-landing-text-muted)" }}>
                  Last 7 days overview
                </p>
              </div>
              <div
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: "rgba(60, 64, 43, 0.08)",
                  color: "var(--color-landing-accent)",
                }}
              >
                +12.4%
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-3 h-40">
              {barData.map((bar, i) => (
                <motion.div
                  key={bar.label}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.05, ease }}
                  className="flex-1 flex flex-col items-center gap-2 origin-bottom"
                >
                  <div
                    className="w-full rounded-md transition-colors duration-200"
                    style={{
                      height: `${bar.height}%`,
                      backgroundColor: i === 3 ? "var(--color-landing-accent)" : "var(--color-landing-border)",
                    }}
                  />
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: "var(--color-landing-text-muted)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {bar.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Table Row Preview */}
            <div
              className="mt-8 rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--color-landing-border)" }}
            >
              <table className="w-full text-[11px]" style={{ fontFamily: "var(--font-inter)" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--color-landing-elevated)" }}>
                    <th className="text-left p-2.5 font-semibold" style={{ color: "var(--color-landing-text)", borderBottom: "1px solid var(--color-landing-border)" }}>ID</th>
                    <th className="text-left p-2.5 font-semibold" style={{ color: "var(--color-landing-text)", borderBottom: "1px solid var(--color-landing-border)" }}>Submitted</th>
                    <th className="text-left p-2.5 font-semibold" style={{ color: "var(--color-landing-text)", borderBottom: "1px solid var(--color-landing-border)" }}>Name</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--color-landing-text-secondary)" }}>
                  <tr style={{ borderBottom: "1px solid var(--color-landing-border-subtle)" }}>
                    <td className="p-2.5 font-mono" style={{ color: "var(--color-landing-text-muted)" }}>sub_8fa2...</td>
                    <td className="p-2.5">2026-05-20</td>
                    <td className="p-2.5 font-medium" style={{ color: "var(--color-landing-text)" }}>Alex Johnson</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono" style={{ color: "var(--color-landing-text-muted)" }}>sub_5b21...</td>
                    <td className="p-2.5">2026-05-20</td>
                    <td className="p-2.5 font-medium" style={{ color: "var(--color-landing-text)" }}>Sarah Connor</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
