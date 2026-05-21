"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function CTASection() {
  return (
    <section className="py-28 px-6" style={{ backgroundColor: "#343330" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
        className="max-w-3xl mx-auto text-center"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <h2
          className="text-3xl md:text-5xl font-bold tracking-tight mb-5"
          style={{ color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.15 }}
        >
          Ready to build forms{" "}
          <br className="hidden sm:block" />
          that convert?
        </h2>
        <p
          className="text-base md:text-lg mb-10 max-w-lg mx-auto"
          style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}
        >
          Join thousands of teams creating beautiful, high-converting
          conversational forms with Patra.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <button
              className="w-full sm:w-auto h-12 px-8 font-semibold text-base rounded-xl transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#343330",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
            >
              Start for free
            </button>
          </Link>
          <a href="mailto:hello@patra.io">
            <button
              className="w-full sm:w-auto h-12 px-8 font-semibold text-base rounded-xl transition-all duration-200"
              style={{
                backgroundColor: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              Book a demo
            </button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
