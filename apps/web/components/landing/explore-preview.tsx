"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const forms = [
  { title: "Product Feedback", creator: "Alex K.", responses: 342, color: "#3C402B" },
  { title: "Event RSVP", creator: "Mia L.", responses: 128, color: "#5C5A56" },
  { title: "NPS Survey", creator: "Raj P.", responses: 891, color: "#343330" },
  { title: "Job Application", creator: "Sara M.", responses: 67, color: "#3C402B" },
  { title: "Customer Onboarding", creator: "Dani T.", responses: 215, color: "#5C5A56" },
];

export default function ExplorePreview() {
  return (
    <section id="explore" className="py-24 px-6" style={{ backgroundColor: "var(--color-landing-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="landing-h2 mb-3">Discover public forms</h2>
            <p className="landing-body max-w-lg">
              Browse forms shared by the community. Get inspired or contribute your own.
            </p>
          </div>
          <a
            href="#"
            className="text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            style={{
              color: "var(--color-landing-accent)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Browse all forms
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </motion.div>

        {/* Horizontal Scroll */}
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
          {forms.map((form, i) => (
            <motion.div
              key={form.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className="landing-card min-w-[260px] sm:min-w-[280px] flex-shrink-0 overflow-hidden cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Mini Preview */}
              <div
                className="h-32 p-5 flex flex-col justify-end"
                style={{ backgroundColor: form.color }}
              >
                <div className="text-white text-xs font-mono opacity-60 mb-1">01 →</div>
                <div className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
                  What's your name?
                </div>
                <div className="w-2/3 h-1 mt-2 rounded-full bg-white/30" />
              </div>

              {/* Info */}
              <div className="p-5" style={{ fontFamily: "var(--font-inter)" }}>
                <h4
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--color-landing-text)" }}
                >
                  {form.title}
                </h4>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-landing-text-muted)" }}
                  >
                    by {form.creator}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-landing-text-muted)" }}
                  >
                    {form.responses} responses
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
