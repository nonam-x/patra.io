"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "~/components/app/sidebar";
import { CommandPalette } from "~/components/app/command-palette";
import { LoadingScreen } from "~/components/app/loading-screen";
import { useAuthGuard } from "~/hooks/use-auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuthGuard();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Command Palette listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingScreen message="loading patra workspace..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans select-none overflow-hidden relative">
      <Sidebar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
        {children}
      </div>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
