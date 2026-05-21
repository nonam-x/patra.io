"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const testimonials = [
  {
    quote: "Patra replaced three tools for us. The conversational flow alone doubled our completion rates.",
    name: "Arjun Mehta",
    role: "Head of Product",
    company: "Canopy Labs",
    stars: 5,
  },
  {
    quote: "The cleanest form builder I've used. It feels like it was designed by someone who actually cares about UX.",
    name: "Clara Reeves",
    role: "Design Lead",
    company: "Bloom Studio",
    stars: 5,
  },
  {
    quote: "Setting up conditional logic used to take hours. With Patra, it's literally two clicks. Brilliant product.",
    name: "David Park",
    role: "Founding Engineer",
    company: "Drift Systems",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "var(--color-landing-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <h2 className="landing-h2 mb-4">Loved by creators</h2>
          <p className="landing-body-lg max-w-xl mx-auto">
            Join thousands of teams who build better forms with Patra.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="landing-card p-7 flex flex-col justify-between"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <svg
                    key={si}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ color: "var(--color-landing-accent)" }}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sm leading-relaxed mb-8 flex-1"
                style={{
                  color: "var(--color-landing-text-secondary)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3" style={{ fontFamily: "var(--font-inter)" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: "rgba(60, 64, 43, 0.08)",
                    color: "var(--color-landing-accent)",
                  }}
                >
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-landing-text)" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-landing-text-muted)" }}
                  >
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
