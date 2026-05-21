"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Eye, Loader2, Sparkles, Check, Play, Globe } from "lucide-react";
import { Button } from "~/components/ui/button";

interface BuilderHeaderProps {
  formId: string;
  title: string;
  status: string;
  savingState: "saved" | "saving" | "idle";
  onTitleChange: (title: string) => void;
  onTogglePublish: () => void;
  onOpenShare: () => void;
  onOpenPreview: () => void;
}

export function BuilderHeader({
  formId,
  title,
  status,
  savingState,
  onTitleChange,
  onTogglePublish,
  onOpenShare,
  onOpenPreview,
}: BuilderHeaderProps) {
  const [localTitle, setLocalTitle] = useState(title);

  const handleBlur = () => {
    if (localTitle.trim() && localTitle !== title) {
      onTitleChange(localTitle);
    }
  };

  return (
    <header className="h-14 px-6 border-b border-[#27272A] bg-[#111111] flex items-center justify-between flex-shrink-0 z-30 font-sans">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-[#A1A1AA] hover:text-white p-1.5 hover:bg-[#18181B] rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleBlur}
            className="font-bold text-sm bg-transparent border-none focus:outline-none text-white focus:bg-[#18181B] px-2.5 py-1 rounded transition-colors w-24 sm:w-48 md:w-64"
          />
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase tracking-wider flex items-center gap-1 ${
              savingState === "saving"
                ? "text-amber-400 bg-amber-400/10"
                : "text-emerald-400 bg-emerald-400/10"
            }`}
          >
            {savingState === "saving" ? (
              <>
                <Loader2 size={10} className="animate-spin" /> Saving...
              </>
            ) : (
              "Saved"
            )}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-[#18181B] p-1 rounded-lg border border-[#27272A]">
        <Link
          href={`/forms/${formId}/builder`}
          className="px-3.5 py-1.5 rounded-md bg-[#111111] text-white shadow-sm"
        >
          Builder
        </Link>
        <Link
          href={`/forms/${formId}/analytics`}
          className="px-3.5 py-1.5 rounded-md hover:bg-[#111111]/50 text-[#A1A1AA] hover:text-white transition-colors"
        >
          Analytics
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <Button
          onClick={onOpenPreview}
          variant="ghost"
          size="icon"
          className="h-9 w-9 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#A1A1AA] hover:text-white rounded-lg"
          title="Preview Form"
        >
          <Eye size={14} />
        </Button>

        <Button
          onClick={onTogglePublish}
          className={`text-xs font-semibold px-4 h-9 rounded-lg border transition-all active:scale-[0.98] ${
            status === "published"
              ? "bg-transparent text-red-400 border-red-500/20 hover:bg-red-950/20"
              : "bg-white hover:bg-white/90 text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          }`}
        >
          {status === "published" ? "Unpublish" : "Publish"}
        </Button>

        <Button
          onClick={onOpenShare}
          className="bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold px-4 h-9 rounded-lg flex items-center gap-1.5 transition-all text-white active:scale-[0.98]"
        >
          <Share2 size={13} />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </header>
  );
}
