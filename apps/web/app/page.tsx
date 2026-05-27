"use client";

import React from "react";
import Navbar from "~/components/landing/navbar";
import Hero from "~/components/landing/hero";
import FormPreview from "~/components/landing/form-preview";
import AnalyticsShowcase from "~/components/landing/analytics-showcase";
import ThemesSection from "~/components/landing/themes-section";
import FeaturesGrid from "~/components/landing/features-grid";
import ExplorePreview from "~/components/landing/explore-preview";
import Pricing from "~/components/landing/pricing";
import Testimonials from "~/components/landing/testimonials";
import FAQ from "~/components/landing/faq";
import CTASection from "~/components/landing/cta-section";
import Footer from "~/components/landing/footer";

export default function LandingPage() {
  return (
    <div 
      className="landing-page min-h-screen w-full p-0 sm:p-4 md:p-6 lg:p-0 transition-all duration-300"
      style={{ backgroundColor: "var(--color-landing-bg-alt)" }}
    >
   
        <Navbar />
        <Hero />
        <FormPreview />
        <AnalyticsShowcase />
        <ThemesSection />
        <FeaturesGrid />
        <ExplorePreview />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTASection />
        <Footer />
    
    </div>
  );
}
