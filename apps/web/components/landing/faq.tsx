"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const faqs = [
  {
    q: "Is Patra really free to start?",
    a: "Yes! The free plan includes 3 active forms and up to 100 responses per month. No credit card required.",
  },
  {
    q: "How does the AI form builder work?",
    a: "Describe your form goal in plain text — e.g., 'Create a product feedback form with rating and open text.' Our AI generates the complete form structure with fields, labels, placeholders, and logic in under 3 seconds.",
  },
  {
    q: "Can I integrate Patra with other tools?",
    a: "Pro and Enterprise plans include webhook integrations and API access. Connect Patra to Slack, email, Notion, Google Sheets, and more.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is encrypted at rest and in transit. Enterprise plans include SAML SSO, security audit logs, and dedicated data residency options.",
  },
  {
    q: "Can I customize the look of my forms?",
    a: "Yes — choose from 12+ curated themes or create your own with full control over colors, typography, and layout. Every form looks polished by default.",
  },
  {
    q: "What's the difference between Pro and Enterprise?",
    a: "Pro is perfect for individuals and small teams. Enterprise adds unlimited submissions, dedicated API, webhook integrations, SAML SSO, and priority support with custom onboarding.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "var(--color-landing-bg)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <h2 className="landing-h2 mb-4">Frequently asked questions</h2>
          <p className="landing-body-lg max-w-lg mx-auto">
            Everything you need to know about Patra.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <Accordion.Root type="single" collapsible className="flex flex-col">
            {faqs.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`faq-${i}`}
                className="group"
                style={{
                  borderBottom: "1px solid var(--color-landing-border-subtle)",
                }}
              >
                <Accordion.Header>
                  <Accordion.Trigger
                    className="w-full flex items-center justify-between py-6 text-left cursor-pointer transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <span
                      className="text-base font-semibold pr-6"
                      style={{ color: "var(--color-landing-text)", letterSpacing: "-0.01em" }}
                    >
                      {faq.q}
                    </span>
                    <span
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 group-data-[state=open]:rotate-45"
                      style={{
                        backgroundColor: "var(--color-landing-elevated)",
                        color: "var(--color-landing-text-muted)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14"/><path d="M5 12h14"/>
                      </svg>
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <p
                    className="pb-6 text-sm leading-relaxed pr-10"
                    style={{
                      color: "var(--color-landing-text-muted)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {faq.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </section>
  );
}
