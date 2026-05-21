"use client";

import React, { useState } from "react";
import { Palette, Trash2, Plus, Check, Undo, Sparkles } from "lucide-react";
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
      secondary: "#3C402B",
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
    <div className="flex-grow bg-[#09090B] font-sans p-6 md:p-8 space-y-8 select-none">
      {/* Header section */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[#27272A]/50 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Palette className="text-[#8B5CF6]" size={20} /> Themes Gallery
          </h2>
          <p className="text-xs text-[#A1A1AA]">
            Create, manage and apply style systems to your conversational forms.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 text-black text-xs font-bold px-4 h-9 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_4px_15px_rgba(255,255,255,0.15)] active:scale-[0.98]">
              <Plus size={14} />
              <span>Create Theme</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px] bg-[#111111] border-[#27272A] text-white p-6 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold tracking-tight">Create Custom Theme</DialogTitle>
              <DialogDescription className="text-xs text-[#A1A1AA]">
                Design your form styling using color palettes, typography, and border radius constraints.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateTheme} className="space-y-4 pt-2">
              <Button
                type="button"
                onClick={applySubtlePalettePreset}
                variant="outline"
                className="w-full border-dashed border-[#8B5CF6]/30 hover:border-[#8B5CF6]/50 bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10 text-[#8B5CF6] text-[11px] h-8 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all"
              >
                <Sparkles size={12} /> Use Patra Subtle Light Preset
              </Button>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Theme Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Minimal Sand"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="bg-[#18181B] border-[#27272A] text-xs text-white h-9 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Font Family</label>
                  <select
                    className="w-full bg-[#18181B] border border-[#27272A] text-xs rounded-lg p-2 text-white outline-none h-9"
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
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">Border Radius</label>
                  <select
                    className="w-full bg-[#18181B] border border-[#27272A] text-xs rounded-lg p-2 text-white outline-none h-9"
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
              <div className="space-y-2 border-t border-[#27272A]/50 pt-3">
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono block">Color Palette</label>
                <div className="grid grid-cols-2 gap-3.5">
                  {Object.keys(colors).map((key) => {
                    const colorKey = key as keyof ThemeColors;
                    return (
                      <div key={colorKey} className="flex items-center gap-2 bg-[#18181B] p-2 rounded-lg border border-[#27272A] h-9">
                        <input
                          type="color"
                          value={colors[colorKey]}
                          onChange={(e) => setColors((c) => ({ ...c, [colorKey]: e.target.value }))}
                          className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold truncate">
                          {colorKey}: {colors[colorKey]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#27272A]/50">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs hover:bg-[#18181B] text-zinc-400 h-9 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-white hover:bg-white/90 text-black text-xs font-bold px-5 h-9 rounded-lg"
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
            <div key={i} className="h-48 rounded-xl border border-[#27272A] bg-[#111111]/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes?.map((theme: any) => {
            const tc = (theme.colors || {}) as ThemeColors;
            return (
              <div
                key={theme.id}
                className="p-6 rounded-xl border border-[#27272A] bg-[#111111] hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between h-52 group relative hover:shadow-xl overflow-hidden"
              >
                {/* Top metadata info */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-white truncate max-w-[70%]">
                      {theme.name}
                    </h3>
                    <span className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                      theme.isSystem 
                        ? "text-zinc-400 bg-zinc-500/10 border-zinc-500/15" 
                        : "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/15"
                    }`}>
                      {theme.isSystem ? "System" : "Custom"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#71717A] font-mono">
                    Font: {theme.fontFamily || "Inter"} • Radius: {theme.borderRadius || "8px"}
                  </p>
                </div>

                {/* Color swatches layout */}
                <div className="py-4 flex gap-1.5 items-center">
                  {Object.entries(tc).map(([key, val]) => (
                    <div
                      key={key}
                      className="w-7 h-7 rounded-lg border border-[#27272A] shadow-inner relative group/swatch cursor-help shrink-0"
                      style={{ backgroundColor: val }}
                      title={`${key}: ${val}`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/swatch:block bg-black border border-[#27272A] text-[8px] font-mono px-1 rounded text-white whitespace-nowrap z-55">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions bottom footer */}
                <div className="pt-3 border-t border-[#27272A]/50 flex justify-between items-center">
                  <span className="text-[9px] text-zinc-600 font-mono">
                    ID: {theme.id.slice(0, 8)}...
                  </span>

                  {!theme.isSystem && (
                    <Button
                      onClick={() => handleDeleteTheme(theme.id)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-zinc-500 hover:text-red-400 hover:bg-red-950/15 rounded-md"
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
