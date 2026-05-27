"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "~/components/app/sidebar";
import { CommandPalette } from "~/components/app/command-palette";
import { LoadingScreen } from "~/components/app/loading-screen";
import { useAuthGuard } from "~/hooks/use-auth-guard";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuthGuard();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row font-sans select-none overflow-hidden relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 border-r border-sidebar-border">
        <Sidebar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      </div>

      {/* Mobile Sticky Top Header */}
      <header className="lg:hidden h-14 border-b border-sidebar-border bg-card/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30 w-full">
        <div className="flex items-center gap-3">
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <button
                className="p-1.5 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r border-sidebar-border">
              <Sidebar 
                onOpenCommandPalette={() => {
                  setMobileSidebarOpen(false);
                  setCommandPaletteOpen(true);
                }} 
                onClose={() => setMobileSidebarOpen(false)} 
              />
            </SheetContent>
          </Sheet>

          {/* Mini Logo */}
          <div className="flex items-center gap-1.5">
            <img 
              src="/logos/patra.io-logo.png" 
              alt="PatraLogo" 
              className="w-5.5 h-5.5 object-contain bg-white rounded-md p-0.5" 
            />
            <span className="font-semibold text-xs tracking-tight text-foreground leading-none pt-0.5">
              Patra<span className="text-primary font-mono text-[9px] uppercase font-bold ml-1">{user?.plan || "free"}</span>
            </span>
          </div>
        </div>

        {/* Right workspace profile indicator / quick actions */}
        <div className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-foreground">
            {user?.name?.slice(0, 2).toUpperCase() || "US"}
          </div>
        </div>
      </header>
      
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
