"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300"
      style={{
        borderColor: "var(--color-landing-border-subtle)",
        backgroundColor: "rgba(238, 234, 227, 0.85)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: "var(--color-landing-accent)" }}
          >
            <span className="font-bold text-xs tracking-tight text-white">P</span>
          </div>
          <span className="font-semibold text-lg tracking-tight"
            style={{ color: "var(--color-landing-text)" }}
          >
            patra<span style={{ color: "var(--color-landing-accent)" }}>.io</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium"
          style={{ color: "var(--color-landing-text-muted)" }}
        >
          {["Features", "Templates", "Pricing", "Explore"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="transition-colors duration-200 hover:opacity-100"
              style={{ color: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-landing-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-landing-text-muted)")}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <button
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              style={{ color: "var(--color-landing-text-secondary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-landing-elevated)";
                e.currentTarget.style.color = "var(--color-landing-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-landing-text-secondary)";
              }}
            >
              Log in
            </button>
          </Link>
          <Link href="/signup">
            <button
              className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center gap-2"
              style={{
                backgroundColor: "var(--color-landing-accent)",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent)")}
            >
              Start Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--color-landing-text-secondary)" }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 8h16"/><path d="M4 16h16"/></svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{
              borderColor: "var(--color-landing-border-subtle)",
              backgroundColor: "var(--color-landing-bg)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {["Features", "Templates", "Pricing", "Explore"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium py-1"
                  style={{ color: "var(--color-landing-text-secondary)" }}
                >
                  {item}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-3" style={{ borderTop: "1px solid var(--color-landing-border-subtle)" }}>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full text-sm font-medium py-2.5 rounded-lg"
                    style={{ color: "var(--color-landing-text-secondary)" }}
                  >
                    Log in
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full text-sm font-semibold py-2.5 rounded-lg"
                    style={{ backgroundColor: "var(--color-landing-accent)", color: "#FFFFFF" }}
                  >
                    Start Free
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
