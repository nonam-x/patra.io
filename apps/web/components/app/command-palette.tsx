"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  Settings,
  Globe,
  Palette,
  LayoutTemplate,
  ChevronRight,
  Plus,
} from "lucide-react";
import { trpc } from "~/trpc/client";
import { useAuth } from "~/hooks/use-auth";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const { data: formsData } = trpc.form.list.useQuery(
    { page: 1, limit: 10, search: query || undefined },
    { enabled: !!user && open }
  );

  // Reset query on open
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      onClose();
    },
    [router, onClose]
  );

  const navigationItems = [
    { label: "All Forms", icon: FileText, path: "/dashboard" },
    { label: "Explore Public Forms", icon: Globe, path: "/dashboard/explore" },
    { label: "Themes Gallery", icon: Palette, path: "/dashboard/themes" },
    { label: "Templates", icon: LayoutTemplate, path: "/dashboard/templates" },
    { label: "Workspace Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-[18vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl bg-[#111111] border border-[#27272A] rounded-xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="p-3.5 border-b border-[#27272A] flex items-center gap-3">
              <Search size={15} className="text-[#A1A1AA] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search forms, navigate..."
                className="bg-transparent border-none text-sm outline-none text-white w-full placeholder:text-[#52525B]"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                className="text-[10px] bg-[#18181B] border border-[#27272A] px-2 py-0.5 rounded font-mono text-[#A1A1AA] flex-shrink-0 hover:text-white"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {/* Navigation section */}
              <div className="p-1.5">
                <div className="text-[10px] text-[#52525B] font-bold px-3 py-1.5 uppercase font-mono tracking-wider">
                  Navigation
                </div>
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#18181B] text-[13px] text-[#A1A1AA] hover:text-white flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon size={14} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={12} className="text-[#3F3F46]" />
                  </button>
                ))}
              </div>

              {/* Forms section */}
              {formsData?.forms && formsData.forms.length > 0 && (
                <div className="p-1.5 border-t border-[#27272A]">
                  <div className="text-[10px] text-[#52525B] font-bold px-3 py-1.5 uppercase font-mono tracking-wider">
                    Forms
                  </div>
                  {formsData.forms.map((form: any) => (
                    <button
                      key={form.id}
                      onClick={() => navigate(`/forms/${form.id}/builder`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#18181B] text-[13px] text-[#A1A1AA] hover:text-white flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText size={14} />
                        <span className="truncate max-w-[300px] font-medium">
                          {form.title || "Untitled Form"}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#3F3F46] font-mono">edit</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
