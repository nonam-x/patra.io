"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const themes = [
  {
    name: "Minimal Light",
    desc: "Clean and focused",
    bg: "#FFFFFF",
    accent: "#343330",
    text: "#343330",
    cardBg: "#F9F8F6",
  },
  {
    name: "Warm Olive",
    desc: "Natural and calm",
    bg: "#F5F3EE",
    accent: "#3C402B",
    text: "#3C402B",
    cardBg: "#EEEAE3",
  },
  {
    name: "Deep Charcoal",
    desc: "Bold and modern",
    bg: "#343330",
    accent: "#E8E4DE",
    text: "#E8E4DE",
    cardBg: "#3D3B37",
  },
];

export default function ThemesSection() {
  return (
    <section id="templates" className="py-24 px-6" style={{ backgroundColor: "var(--color-landing-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <h2 className="landing-h2 mb-4">Beautiful themes, ready to go</h2>
          <p className="landing-body-lg max-w-xl mx-auto">
            Choose from curated themes or create your own. Every form feels
            polished out of the box.
          </p>
          <span
            className="inline-block mt-5 text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: "rgba(60, 64, 43, 0.08)",
              color: "var(--color-landing-accent)",
              fontFamily: "var(--font-inter)",
            }}
          >
            12+ themes included
          </span>
        </motion.div>

        {/* Theme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="landing-card overflow-hidden group cursor-pointer"
            >
              {/* Mini Form Preview */}
              <div
                className="p-6 pb-8"
                style={{ backgroundColor: theme.bg }}
              >
                <div className="space-y-3" style={{ fontFamily: "var(--font-inter)" }}>
                  {/* Mini question label */}
                  <div
                    className="text-xs font-semibold font-mono"
                    style={{ color: theme.accent, opacity: 0.6 }}
                  >
                    01 →
                  </div>
                  <div
                    className="text-base font-bold tracking-tight"
                    style={{ color: theme.text }}
                  >
                    What's your name?
                  </div>
                  {/* Mini input */}
                  <div
                    className="w-full h-8 rounded-lg"
                    style={{
                      backgroundColor: theme.cardBg,
                      border: `1px solid ${theme.accent}20`,
                    }}
                  />
                  {/* Mini button */}
                  <div className="flex justify-end pt-1">
                    <div
                      className="text-[10px] font-semibold px-3 py-1.5 rounded-md"
                      style={{
                        backgroundColor: theme.accent,
                        color: theme.bg,
                      }}
                    >
                      Continue →
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div
                className="px-6 py-4"
                style={{
                  borderTop: "1px solid var(--color-landing-border)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-landing-text)" }}
                >
                  {theme.name}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-landing-text-muted)" }}
                >
                  {theme.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
