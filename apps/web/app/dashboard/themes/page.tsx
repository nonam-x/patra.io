"use client";

import React, { useState } from "react";
import { Palette, Trash2, Plus, Sparkles } from "lucide-react";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "sonner";

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export default function ThemesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [newFontFamily, setNewFontFamily] = useState("Inter");
  const [newBorderRadius, setNewBorderRadius] = useState("8px");

  // Default color state
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#3C402B",
    secondary: "#3C402B",
    background: "#EEEAE3",
    text: "#343330",
    accent: "#3C402B",
  });

  // Queries & Mutations
  const { data: themes, isLoading, refetch } = trpc.theme.list.useQuery();

  const createMutation = trpc.theme.create.useMutation({
    onSuccess: () => {
      toast.success("Custom theme created!");
      setIsCreateOpen(false);
      refetch();
      // Reset state
      setNewThemeName("");
      setColors({
        primary: "#3C402B",
        secondary: "#3C402B",
        background: "#EEEAE3",
        text: "#343330",
        accent: "#3C402B",
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create theme");
    },
  });

  const deleteMutation = trpc.theme.delete.useMutation({
    onSuccess: () => {
      toast.success("Theme deleted successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete theme");
    },
  });

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeName.trim()) {
      toast.error("Please enter a name for the theme");
      return;
    }

    createMutation.mutate({
      name: newThemeName,
      colors,
      fontFamily: newFontFamily,
      borderRadius: newBorderRadius,
    });
  };

  const handleDeleteTheme = (id: string) => {
    if (confirm("Are you sure you want to delete this custom theme?")) {
      deleteMutation.mutate({ id });
    }
  };

  const applySubtlePalettePreset = () => {
    setColors({
      primary: "#3C402B",
      secondary: "#5C5A56",
      background: "#EEEAE3",
      text: "#343330",
      accent: "#3C402B",
    });
    setNewThemeName("Patra Light Subtle");
    setNewFontFamily("Outfit");
    setNewBorderRadius("12px");
    toast.success("Loaded Patra's custom light & subtle palette preset!");
  };

  return (
    <div className="flex-grow bg-[var(--color-landing-bg)] font-sans p-6 md:p-8 space-y-8 select-none min-h-screen">
      {/* Header section */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[var(--color-landing-border)] pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-landing-text)] flex items-center gap-2">
            <Palette className="text-[var(--color-landing-accent)]" size={22} /> Themes Gallery
          </h2>
          <p className="text-xs text-[var(--color-landing-text-secondary)]">
            Create, manage and apply style systems to your conversational forms.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button 
              className="text-white text-xs font-semibold px-4 h-9 rounded-xl flex items-center gap-1.5 transition-all duration-200 shadow-sm active:scale-[0.98]"
              style={{ backgroundColor: "var(--color-landing-accent)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent)")}
            >
              <Plus size={14} />
              <span>Create Theme</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px] bg-[var(--color-landing-card)] border-[var(--color-landing-border)] text-[var(--color-landing-text)] p-6 shadow-2xl rounded-2xl" style={{ fontFamily: "var(--font-inter)" }}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold tracking-tight text-[var(--color-landing-text)]">Create Custom Theme</DialogTitle>
              <DialogDescription className="text-xs text-[var(--color-landing-text-secondary)]">
                Design your form styling using color palettes, typography, and border radius constraints.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateTheme} className="space-y-4 pt-2">
              <Button
                type="button"
                onClick={applySubtlePalettePreset}
                variant="outline"
                className="w-full border-dashed border-[var(--color-landing-accent)]/20 hover:border-[var(--color-landing-accent)]/45 bg-[var(--color-landing-accent)]/5 hover:bg-[var(--color-landing-accent)]/10 text-[var(--color-landing-accent)] text-[11px] h-9 rounded-xl flex items-center justify-center gap-1.5 font-semibold transition-all duration-200"
              >
                <Sparkles size={12} /> Use Patra Subtle Light Preset
              </Button>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-landing-text-secondary)]">Theme Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Minimal Sand"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="bg-[var(--color-landing-elevated)] border-[var(--color-landing-border)] text-xs text-[var(--color-landing-text)] h-9.5 rounded-xl focus-visible:ring-[var(--color-landing-accent)] focus:border-[var(--color-landing-accent)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--color-landing-text-secondary)]">Font Family</label>
                  <select
                    className="w-full bg-[var(--color-landing-elevated)] border border-[var(--color-landing-border)] text-xs rounded-xl p-2 text-[var(--color-landing-text)] outline-none h-9.5 focus:border-[var(--color-landing-accent)] transition-all"
                    value={newFontFamily}
                    onChange={(e) => setNewFontFamily(e.target.value)}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Outfit">Outfit</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--color-landing-text-secondary)]">Border Radius</label>
                  <select
                    className="w-full bg-[var(--color-landing-elevated)] border border-[var(--color-landing-border)] text-xs rounded-xl p-2 text-[var(--color-landing-text)] outline-none h-9.5 focus:border-[var(--color-landing-accent)] transition-all"
                    value={newBorderRadius}
                    onChange={(e) => setNewBorderRadius(e.target.value)}
                  >
                    <option value="0px">Sharp (0px)</option>
                    <option value="6px">Small (6px)</option>
                    <option value="12px">Medium (12px)</option>
                    <option value="20px">Rounded (20px)</option>
                  </select>
                </div>
              </div>

              {/* Color picks */}
              <div className="space-y-2 border-t border-[var(--color-landing-border)] pt-3">
                <label className="text-xs font-semibold text-[var(--color-landing-text-secondary)] block">Color Palette</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(colors).map((key) => {
                    const colorKey = key as keyof ThemeColors;
                    return (
                      <div key={colorKey} className="flex items-center gap-2 bg-[var(--color-landing-elevated)] p-2 rounded-xl border border-[var(--color-landing-border)] h-9.5">
                        <input
                          type="color"
                          value={colors[colorKey]}
                          onChange={(e) => setColors((c) => ({ ...c, [colorKey]: e.target.value }))}
                          className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-[10px] uppercase font-mono text-[var(--color-landing-text-secondary)] font-semibold truncate">
                          {colorKey}: {colors[colorKey]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[var(--color-landing-border)]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs hover:bg-secondary text-[var(--color-landing-text-secondary)] h-9 rounded-xl transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="text-white text-xs font-semibold px-5 h-9 rounded-xl transition-all duration-200"
                  style={{ backgroundColor: "var(--color-landing-accent)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent)")}
                >
                  {createMutation.isPending ? "Creating..." : "Save Theme"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-52 rounded-2xl border border-[var(--color-landing-border)] bg-[var(--color-landing-card)] animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes?.map((theme: any) => {
            const tc = (theme.colors || {}) as ThemeColors;
            return (
              <div
                key={theme.id}
                className="p-6 rounded-2xl border border-[var(--color-landing-border)] bg-[var(--color-landing-card)] text-[var(--color-landing-text)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(52,51,48,0.06)] flex flex-col justify-between h-52 group relative shadow-[0_4px_20px_rgba(52,51,48,0.02)] overflow-hidden"
              >
                {/* Abstract subtle background decorations */}
                <div 
                  className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-5 transition-opacity duration-300 group-hover:opacity-10"
                  style={{ background: `radial-gradient(circle, ${tc.primary || "var(--color-landing-accent)"} 0%, transparent 80%)` }}
                />

                {/* Top metadata info */}
                <div className="space-y-1 relative z-10">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-[var(--color-landing-text)] truncate max-w-[70%]">
                      {theme.name}
                    </h3>
                    <span 
                      className="text-[8px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider transition-all duration-200"
                      style={{
                        backgroundColor: theme.isSystem 
                          ? "var(--color-landing-elevated)" 
                          : "color-mix(in srgb, var(--color-landing-accent) 8%, transparent)",
                        borderColor: theme.isSystem
                          ? "var(--color-landing-border)"
                          : "color-mix(in srgb, var(--color-landing-accent) 15%, transparent)",
                        color: theme.isSystem
                          ? "var(--color-landing-text-secondary)"
                          : "var(--color-landing-accent)",
                      }}
                    >
                      {theme.isSystem ? "System" : "Custom"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--color-landing-text-secondary)]/80 font-mono">
                    Font: {theme.fontFamily || "Inter"} • Radius: {theme.borderRadius || "8px"}
                  </p>
                </div>

                {/* Swatches and Mini-Preview Row */}
                <div className="flex items-center justify-between gap-4 py-3 relative z-10">
                  {/* Circular Swatches */}
                  <div className="flex gap-1.5 items-center">
                    {Object.entries(tc).map(([key, val]) => (
                      <div
                        key={key}
                        className="w-6.5 h-6.5 rounded-full border border-[var(--color-landing-border)] transition-transform duration-200 hover:scale-110 relative group/swatch cursor-help shrink-0 shadow-inner"
                        style={{ backgroundColor: val }}
                        title={`${key}: ${val}`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/swatch:block bg-[var(--color-landing-card)] border border-[var(--color-landing-border)] text-[8px] font-mono px-1 rounded text-[var(--color-landing-text)] whitespace-nowrap z-50 shadow-sm">
                          {key}: {val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tiny Conversational Form Mockup Block */}
                  <div 
                    className="w-24 h-12 rounded-lg border border-[var(--color-landing-border)]/70 p-1.5 flex flex-col justify-between shrink-0 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.015)] transition-all duration-300 group-hover:border-[var(--color-landing-border)]"
                    style={{ backgroundColor: tc.background }}
                  >
                    <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: tc.primary }} />
                    <div className="w-16 h-1 rounded-full opacity-60" style={{ backgroundColor: tc.text }} />
                    <div className="flex justify-end">
                      <div className="px-2 py-0.5 rounded-md text-[6px] font-bold" style={{ backgroundColor: tc.accent, color: tc.background }}>
                        Next
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions bottom footer */}
                <div className="pt-3 border-t border-[var(--color-landing-border)]/60 flex justify-between items-center relative z-10">
                  <span className="text-[9px] text-[var(--color-landing-text-muted)] font-mono">
                    ID: {theme.id.slice(0, 8)}...
                  </span>

                  {!theme.isSystem && (
                    <Button
                      onClick={() => handleDeleteTheme(theme.id)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[var(--color-landing-text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <Trash2 size={13} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
