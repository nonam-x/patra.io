"use client";

import React from "react";
import { motion } from "framer-motion";

const logos = [
  { name: "Archway", width: "w-20" },
  { name: "Bloom", width: "w-16" },
  { name: "Canopy", width: "w-20" },
  { name: "Drift", width: "w-14" },
  { name: "Ember", width: "w-16" },
  { name: "Fathom", width: "w-18" },
];

export default function TrustedBy() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: "var(--color-landing-bg)" }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center"
      >
        <p
          className="text-xs font-medium tracking-widest uppercase mb-10"
          style={{
            color: "var(--color-landing-text-muted)",
            fontFamily: "var(--font-inter)",
            letterSpacing: "0.1em",
          }}
        >
          Trusted by 2,000+ teams worldwide
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-center gap-2"
              style={{ color: "var(--color-landing-text-muted)", fontFamily: "var(--font-inter)" }}
            >
              {/* Simple circle icon + wordmark */}
              <div
                className="w-5 h-5 rounded-full opacity-40"
                style={{ backgroundColor: "var(--color-landing-text-muted)" }}
              />
              <span className="text-sm font-semibold tracking-tight opacity-50">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
