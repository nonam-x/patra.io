"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    desc: "Perfect for hobbyists and side projects.",
    features: ["3 active forms", "Up to 100 responses/mo", "Standard layouts", "Community support"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Creator Pro",
    price: "$19",
    period: "/mo",
    desc: "For professionals, developers, and startups.",
    features: ["Unlimited forms", "10,000 responses/mo", "Advanced conditional logic", "AI design assistants", "Custom themes & styles", "Priority support"],
    cta: "Upgrade to Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "/mo",
    desc: "For teams requiring scale, SLA, and security.",
    features: ["Unlimited submissions", "Dedicated API access", "Webhook integrations", "SAML SSO / Security logs", "Custom onboarding"],
    cta: "Contact Sales",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6" style={{ backgroundColor: "var(--color-landing-bg)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <h2 className="landing-h2 mb-4">Simple, honest pricing</h2>
          <p className="landing-body-lg max-w-xl mx-auto">
            Start completely free. Upgrade when your volume grows.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300"
              style={{
                backgroundColor: "var(--color-landing-card)",
                border: plan.featured
                  ? "2px solid var(--color-landing-accent)"
                  : "1px solid var(--color-landing-border)",
                boxShadow: plan.featured
                  ? "0 8px 30px rgba(60, 64, 43, 0.08)"
                  : "none",
                fontFamily: "var(--font-inter)",
              }}
            >
              {plan.featured && (
                <div
                  className="absolute top-0 right-8 -translate-y-1/2 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase"
                  style={{
                    backgroundColor: "var(--color-landing-accent)",
                    color: "#FFFFFF",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div>
                <div
                  className="text-sm font-semibold mb-2"
                  style={{
                    color: plan.featured
                      ? "var(--color-landing-accent)"
                      : "var(--color-landing-text-muted)",
                  }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: "var(--color-landing-text)" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className="text-sm font-normal"
                      style={{ color: "var(--color-landing-text-muted)" }}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs leading-relaxed mb-6"
                  style={{ color: "var(--color-landing-text-muted)" }}
                >
                  {plan.desc}
                </p>
                <div
                  className="mb-6"
                  style={{ borderTop: "1px solid var(--color-landing-border-subtle)" }}
                />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-xs">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "var(--color-landing-accent)", flexShrink: 0 }}
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span style={{ color: "var(--color-landing-text)" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/signup" className="mt-8">
                <button
                  className="w-full text-sm font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98]"
                  style={{
                    backgroundColor: plan.featured
                      ? "var(--color-landing-accent)"
                      : "var(--color-landing-elevated)",
                    color: plan.featured ? "#FFFFFF" : "var(--color-landing-text)",
                    border: plan.featured
                      ? "none"
                      : "1px solid var(--color-landing-border)",
                  }}
                  onMouseEnter={(e) => {
                    if (plan.featured) {
                      e.currentTarget.style.backgroundColor = "var(--color-landing-accent-hover)";
                    } else {
                      e.currentTarget.style.backgroundColor = "var(--color-landing-bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.featured) {
                      e.currentTarget.style.backgroundColor = "var(--color-landing-accent)";
                    } else {
                      e.currentTarget.style.backgroundColor = "var(--color-landing-elevated)";
                    }
                  }}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
