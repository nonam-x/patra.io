"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Hero() {
  return (
    <section
      className="relative pt-28 pb-20 px-6 overflow-hidden"
      style={{ backgroundColor: "var(--color-landing-bg)" }}
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Pill Badge */}
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-10"
          style={{
            backgroundColor: "var(--color-landing-card)",
            border: "1px solid var(--color-landing-border)",
            color: "var(--color-landing-text-secondary)",
            fontFamily: "var(--font-inter)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-landing-accent)" }}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          <span>AI-Powered Form Builder</span>
        </motion.div> */}

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className="landing-display max-w-4xl mx-auto mb-7 mt-20"
        >
          Forms that feel like{" "}
          <br className="hidden sm:block" />
          conversations.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease }}
          className="landing-body-lg max-w-2xl mx-auto mb-12"
        >
          Combine AI form creation, conversational layouts, and real-time
          analytics. Beautiful interfaces that maximize completion rates.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <Link href="/signup">
            <button
              className="w-full sm:w-auto h-12 px-8 font-semibold text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98]"
              style={{
                backgroundColor: "var(--color-landing-accent)",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent)")}
            >
              Create a free form
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </Link>
          <a href="#demo">
            <button
              className="w-full sm:w-auto h-12 px-8 font-semibold text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-landing-text)",
                border: "1px solid var(--color-landing-border)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-card)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              See it in action
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
