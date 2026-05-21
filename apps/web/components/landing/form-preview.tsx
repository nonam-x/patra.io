"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const previewQuestions = [
  {
    id: "q1",
    label: "What should we call you?",
    type: "text" as const,
    placeholder: "Type your first name...",
  },
  {
    id: "q2",
    label: "What are you building with Patra?",
    type: "choices" as const,
    options: ["SaaS Product", "Feedback Form", "Event Registration", "Internal Survey"],
  },
  {
    id: "q3",
    label: "Your forms should feel like...",
    type: "choices" as const,
    options: ["Tactile & Apple-like", "Linear & Minimalist", "Plain HTML", "Cluttered & Crowded"],
  },
];

export default function FormPreview() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [previewCompleted, setPreviewCompleted] = useState(false);

  const handleAnswerSubmit = (value: string) => {
    const currentQ = previewQuestions[activeQuestion];
    if (!currentQ) return;

    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));

    if (activeQuestion < previewQuestions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setPreviewCompleted(true);
    }
  };

  const resetPreview = () => {
    setActiveQuestion(0);
    setAnswers({});
    setPreviewCompleted(false);
  };

  return (
    <section id="demo" className="py-20 px-6" style={{ backgroundColor: "var(--color-landing-bg)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-landing-card)",
          border: "1px solid var(--color-landing-border)",
          boxShadow: "0 20px 60px rgba(52, 51, 48, 0.08)",
        }}
      >
        {/* Browser Chrome */}
        <div
          className="h-12 px-5 flex items-center justify-between text-xs"
          style={{
            borderBottom: "1px solid var(--color-landing-border)",
            backgroundColor: "var(--color-landing-elevated)",
            fontFamily: "var(--font-inter)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF6159" }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFC02E" }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#27CA41" }} />
          </div>
          <span
            className="px-3 py-1 rounded-md font-mono text-[11px]"
            style={{
              backgroundColor: "var(--color-landing-bg)",
              border: "1px solid var(--color-landing-border)",
              color: "var(--color-landing-text-muted)",
            }}
          >
            patra.io/share/demo-form
          </span>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{
              backgroundColor: "rgba(60, 64, 43, 0.1)",
              color: "var(--color-landing-accent)",
            }}
          >
            Live Preview
          </span>
        </div>

        {/* Form Body */}
        <div
          className="relative flex flex-col justify-center items-center px-8 md:px-16 py-16"
          style={{ backgroundColor: "var(--color-landing-card)", minHeight: "360px" }}
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: "var(--color-landing-border)" }}>
            <div
              className="h-full transition-all duration-500 ease-out rounded-r-full"
              style={{
                width: `${(Object.keys(answers).length / previewQuestions.length) * 100}%`,
                backgroundColor: "var(--color-landing-accent)",
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            {!previewCompleted ? (
              <motion.div
                key={activeQuestion}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-lg text-left"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span
                  className="font-semibold font-mono text-sm block mb-3"
                  style={{ color: "var(--color-landing-accent)" }}
                >
                  0{activeQuestion + 1} →
                </span>
                <label
                  className="text-2xl md:text-3xl font-bold tracking-tight block mb-7"
                  style={{
                    color: "var(--color-landing-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {previewQuestions[activeQuestion]?.label}
                </label>

                {previewQuestions[activeQuestion]?.type === "text" ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={previewQuestions[activeQuestion]?.placeholder}
                      className="w-full bg-transparent border-b-2 text-xl py-2 outline-none transition-colors"
                      style={{
                        borderColor: "var(--color-landing-border)",
                        color: "var(--color-landing-text)",
                      }}
                      autoFocus
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-landing-accent)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-landing-border)")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value) {
                          handleAnswerSubmit(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <div
                      className="absolute right-0 bottom-2 text-xs flex items-center gap-1 font-mono"
                      style={{ color: "var(--color-landing-text-muted)" }}
                    >
                      press{" "}
                      <kbd
                        className="px-1.5 py-0.5 rounded text-[10px]"
                        style={{
                          backgroundColor: "var(--color-landing-elevated)",
                          border: "1px solid var(--color-landing-border)",
                        }}
                      >
                        Enter ↵
                      </kbd>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {previewQuestions[activeQuestion]?.options?.map((option, idx) => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSubmit(option)}
                        className="w-full p-4 rounded-xl text-left font-medium transition-all duration-200 active:scale-[0.98] flex items-center justify-between group"
                        style={{
                          backgroundColor: "var(--color-landing-elevated)",
                          border: "1px solid var(--color-landing-border)",
                          color: "var(--color-landing-text)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--color-landing-accent)";
                          e.currentTarget.style.backgroundColor = "rgba(60, 64, 43, 0.04)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--color-landing-border)";
                          e.currentTarget.style.backgroundColor = "var(--color-landing-elevated)";
                        }}
                      >
                        <span className="text-sm">{option}</span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-mono"
                          style={{
                            backgroundColor: "var(--color-landing-bg)",
                            border: "1px solid var(--color-landing-border)",
                            color: "var(--color-landing-text-muted)",
                          }}
                        >
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-sm"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    backgroundColor: "rgba(60, 64, 43, 0.1)",
                    border: "1px solid rgba(60, 64, 43, 0.2)",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-landing-accent)" }}>
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <h3
                  className="text-2xl font-bold tracking-tight mb-2"
                  style={{ color: "var(--color-landing-text)" }}
                >
                  You're all set!
                </h3>
                <p className="text-sm mb-6" style={{ color: "var(--color-landing-text-muted)" }}>
                  That's how seamless a Patra conversational form feels. Ready to build yours?
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={resetPreview}
                    className="text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    style={{
                      backgroundColor: "var(--color-landing-elevated)",
                      border: "1px solid var(--color-landing-border)",
                      color: "var(--color-landing-text)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Start Again
                  </button>
                  <Link href="/signup">
                    <button
                      className="text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
                      style={{
                        backgroundColor: "var(--color-landing-accent)",
                        color: "#FFFFFF",
                      }}
                    >
                      Create a Form
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
