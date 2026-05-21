"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const features = [
  {
    title: "AI-Powered Builder",
    desc: "Describe your form in plain text. Patra generates fields, labels, and logic in seconds.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      </svg>
    ),
  },
  {
    title: "Conditional Logic",
    desc: "Show or hide questions dynamically based on previous answers. Smart, simple, fast.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M3.34 19a10 10 0 0 1 0-14"/><path d="M7.05 15.54a5 5 0 0 1 0-7.07"/><path d="M16.95 15.54a5 5 0 0 0 0-7.07"/><path d="M20.66 19a10 10 0 0 0 0-14"/>
      </svg>
    ),
  },
  {
    title: "QR & Share Slugs",
    desc: "Unique human-readable slugs for every form. Generate QR codes and embed anywhere.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>
      </svg>
    ),
  },
  {
    title: "CSV Export",
    desc: "Export all submissions into clean CSV or Excel. Handles large datasets without slowdown.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13H8"/><path d="M16 17H8"/><path d="M16 13h-2"/>
      </svg>
    ),
  },
  {
    title: "Custom Themes",
    desc: "Pick from 12+ curated themes or design your own with full color and typography control.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/>
      </svg>
    ),
  },
  {
    title: "Public Explore",
    desc: "Publish forms to a public explore feed. Get discovered by the community and gain responses.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="m2 12 5.1 2.5L12 22l4.9-7.5L22 12l-5.1-2.5L12 2 7.1 9.5Z"/>
      </svg>
    ),
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6" style={{ backgroundColor: "var(--color-landing-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <h2 className="landing-h2 mb-4">Everything you need, nothing you don't</h2>
          <p className="landing-body-lg max-w-xl mx-auto">
            Built for professional form workflows. Clean architecture, beautiful output.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className="landing-card p-7 flex flex-col"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  backgroundColor: "rgba(60, 64, 43, 0.07)",
                  color: "var(--color-landing-accent)",
                }}
              >
                {feature.icon}
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{
                  color: "var(--color-landing-text)",
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--color-landing-text-muted)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
