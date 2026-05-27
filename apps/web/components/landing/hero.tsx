"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Hero() {
  return (
    <section
      className="relative pt-20 pb-20 px-6 sm:px-12 md:px-16 overflow-hidden flex flex-col justify-center min-h-[85vh] border-b border-[var(--color-landing-border)]/30"
      style={{ backgroundColor: "var(--color-landing-bg)" }}
    >
      {/* Soft layered ambient light gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(60,64,43,0.05)_0%,transparent_70%)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(60,64,43,0.03)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10">
        
        {/* Left Column: Premium Editorial Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Refined Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-6 bg-white/60 border border-[var(--color-landing-border)]/40 backdrop-blur-md shadow-[0_2px_12px_rgba(60,64,43,0.02)]"
            style={{
              color: "var(--color-landing-text-secondary)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-landing-accent)] animate-pulse" />
            <span className="tracking-wide">AI-Powered Form Builder</span>
          </motion.div>

          {/* Editorial Mixed Serif Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--color-landing-text)] leading-[1.08] mb-6 max-w-2xl font-sans"
          >
            Forms that feel like{" "}
            <br className="hidden sm:block" />
            <span className="font-serif italic font-normal text-[var(--color-landing-accent)]">
              conversations.
            </span>
          </motion.h1>

          {/* Elegant Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease }}
            className="text-sm sm:text-base md:text-lg text-[var(--color-landing-text-secondary)] leading-relaxed max-w-xl mb-8 opacity-90"
          >
            Combine AI form creation, conversational layouts, and real-time
            analytics. Build beautiful interfaces that maximize completion rates
            without code.
          </motion.p>

          {/* CTA Pill Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto h-11 px-6 rounded-full font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm"
                style={{
                  backgroundColor: "var(--color-landing-accent)",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent)")}
              >
                Create a free form
                <ArrowRight size={13} className="stroke-[3]" />
              </button>
            </Link>
            <a href="#demo" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto h-11 px-6 rounded-full font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: "white",
                  color: "var(--color-landing-text)",
                  borderColor: "var(--color-landing-border)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
              >
                See it in action
              </button>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Floating Glass UI Mockup + Concentric Dial */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] lg:min-h-[420px] w-full">
          
          {/* Concentric rings/dial SVG graphic behind card */}
          <div className="absolute w-[130%] h-[130%] flex items-center justify-center opacity-25 select-none pointer-events-none z-0">
            <svg
              className="w-full h-full max-w-[500px]"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="250" cy="250" r="110" stroke="var(--color-landing-accent)" strokeWidth="0.75" strokeDasharray="4 4" />
              <circle cx="250" cy="250" r="150" stroke="var(--color-landing-accent)" strokeWidth="0.75" />
              <circle cx="250" cy="250" r="190" stroke="var(--color-landing-accent)" strokeWidth="0.5" strokeDasharray="8 8" />
              <circle cx="250" cy="250" r="230" stroke="var(--color-landing-accent)" strokeWidth="1" />
              <circle cx="250" cy="250" r="270" stroke="var(--color-landing-accent)" strokeWidth="0.5" />
              <line x1="250" y1="0" x2="250" y2="500" stroke="var(--color-landing-accent)" strokeWidth="0.5" opacity="0.3" />
              <line x1="0" y1="250" x2="500" y2="250" stroke="var(--color-landing-accent)" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>

          {/* Floating UI Container Wrapper */}
          <div className="relative w-full max-w-[380px] aspect-[4/3.1] z-10 px-4 sm:px-0">
            
            {/* Primary Glassmorphic Form Card Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full h-full rounded-2xl bg-white/70 border border-white/60 backdrop-blur-xl shadow-[0_30px_70px_rgba(60,64,43,0.06)] p-6 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Browser Chrome Dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#E5E1D9]" />
                <div className="w-2 h-2 rounded-full bg-[#E5E1D9]" />
                <div className="w-2 h-2 rounded-full bg-[#E5E1D9]" />
              </div>

              {/* Form Question Mockup content */}
              <div className="flex-grow flex flex-col justify-center text-left pt-2">
                <span className="font-semibold font-mono text-[9px] text-[var(--color-landing-accent)] block mb-1.5 tracking-wider">
                  02 → SURVEY VALUE
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[var(--color-landing-text)] leading-snug tracking-tight mb-4">
                  What's your estimated monthly responses?
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-[var(--color-landing-accent)]/10 bg-white/30 text-[10px] font-semibold text-[var(--color-landing-text-secondary)] flex items-center justify-between shadow-[0_2px_8px_rgba(60,64,43,0.01)] cursor-pointer">
                    <span>Under 1,000</span>
                    <span className="text-[8px] font-mono opacity-50">1</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[var(--color-landing-accent)] bg-[var(--color-landing-accent)] text-white text-[10px] font-semibold flex items-center justify-between shadow-[0_6px_12px_rgba(60,64,43,0.08)]">
                    <span>1,000 - 10,000</span>
                    <Check size={10} strokeWidth={3} className="shrink-0" />
                  </div>
                  <div className="p-2.5 rounded-xl border border-[var(--color-landing-accent)]/10 bg-white/30 text-[10px] font-semibold text-[var(--color-landing-text-secondary)] flex items-center justify-between shadow-[0_2px_8px_rgba(60,64,43,0.01)] cursor-pointer">
                    <span>10k - 50k</span>
                    <span className="text-[8px] font-mono opacity-50">3</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[var(--color-landing-accent)]/10 bg-white/30 text-[10px] font-semibold text-[var(--color-landing-text-secondary)] flex items-center justify-between shadow-[0_2px_8px_rgba(60,64,43,0.01)] cursor-pointer">
                    <span>50k+</span>
                    <span className="text-[8px] font-mono opacity-50">4</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-[var(--color-landing-border-subtle)]/60 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-[var(--color-landing-accent)] w-2/3 rounded-full" />
              </div>
            </motion.div>

            {/* Left Floating Badge: Completion Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -left-6 top-[15%] bg-white/85 border border-white/50 backdrop-blur-md shadow-[0_12px_30px_rgba(60,64,43,0.05)] rounded-2xl p-3 flex items-center gap-2.5 select-none hover:scale-[1.03] transition-transform duration-300"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--color-landing-accent)]/5 flex items-center justify-center text-[var(--color-landing-accent)]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 5-5 5 5M12 7v10"/></svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-bold text-[var(--color-landing-text-muted)] tracking-wider uppercase">COMPLETION</span>
                <span className="text-xs font-extrabold text-[var(--color-landing-text)] leading-tight">94.8%</span>
              </div>
            </motion.div>

            {/* Right Floating Badge: AI Engine status */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="absolute -right-4 bottom-[20%] bg-white/85 border border-white/50 backdrop-blur-md shadow-[0_12px_30px_rgba(60,64,43,0.05)] rounded-2xl p-3 flex items-center gap-2.5 select-none hover:scale-[1.03] transition-transform duration-300"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--color-landing-accent)]/5 flex items-center justify-center">
                <Sparkles size={10} className="text-[var(--color-landing-accent)]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-bold text-[var(--color-landing-text-muted)] tracking-wider uppercase">AI ENGINE</span>
                <span className="text-[10px] font-extrabold text-[var(--color-landing-accent)] leading-tight">Active</span>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
