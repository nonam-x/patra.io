import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";
import { ErrorBoundary } from "~/components/app/error-boundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Patra.io — Forms that feel like conversations",
  description:
    "Build beautiful, conversational forms with AI. Patra.io combines smart form creation, conditional logic, and real-time analytics into one elegant platform.",
  keywords: ["form builder", "conversational forms", "AI forms", "survey builder", "typeform alternative"],
  openGraph: {
    title: "Patra.io — Forms that feel like conversations",
    description: "Build beautiful, conversational forms with AI.",
    siteName: "Patra.io",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-x-none">
      <body className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} overflow-x-hidden`}>
        {/* BUG-12 fix: Ensure landing page elements are visible if JS fails */}
        <noscript>
          <style>{`[style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <ErrorBoundary>
          <GlobalProviders>{children}</GlobalProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}

