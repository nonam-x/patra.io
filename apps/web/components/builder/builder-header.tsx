"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Eye, Loader2, Check, PanelLeft, PanelRight, MoreVertical, BarChart2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface BuilderHeaderProps {
  formId: string;
  title: string;
  status: string;
  savingState: "saved" | "saving" | "idle";
  onTitleChange: (title: string) => void;
  onTogglePublish: () => void;
  onOpenShare: () => void;
  onOpenPreview: () => void;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
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
  leftSidebarOpen,
  setLeftSidebarOpen,
  rightSidebarOpen,
  setRightSidebarOpen,
}: BuilderHeaderProps) {
  const [localTitle, setLocalTitle] = useState(title);

  const handleBlur = () => {
    if (localTitle.trim() && localTitle !== title) {
      onTitleChange(localTitle);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <header className="h-12 px-4 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-30 font-sans">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-secondary rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={15} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">Dashboard</TooltipContent>
          </Tooltip>

          <div className="w-px h-5 bg-border/60 mx-0.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                variant="ghost"
                className={`h-8 px-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                  leftSidebarOpen
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <PanelLeft size={14} />
                <span className="hidden md:inline text-xs font-medium">Fields</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {leftSidebarOpen ? "Hide fields" : "Show fields"}
            </TooltipContent>
          </Tooltip>

          {/* Title + save state */}
          <div className="flex items-center gap-2 ml-1">
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleBlur}
              className="font-semibold text-sm bg-transparent border-none focus:outline-none text-foreground hover:bg-secondary/60 focus:bg-secondary px-2.5 py-1.5 rounded-lg transition-all duration-200 w-24 sm:w-48 md:w-64 placeholder:text-muted-foreground truncate"
              placeholder="Untitled form"
            />
            <span
              className={`flex items-center gap-1 text-[10px] font-medium transition-all duration-300 ${
                savingState === "saving"
                  ? "text-amber-600"
                  : "text-muted-foreground"
              }`}
            >
              {savingState === "saving" ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </span>
          </div>
        </div>

        {/* Center tabs */}
        <div className="hidden sm:flex items-center gap-0.5 text-xs font-medium bg-secondary/80 p-1 rounded-xl border border-border/60">
          <Link
            href={`/forms/${formId}/builder`}
            className="px-3.5 py-1.5 rounded-lg bg-card text-foreground shadow-sm border border-border/40 transition-all duration-200"
          >
            Builder
          </Link>
          <Link
            href={`/forms/${formId}/analytics`}
            className="px-3.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all duration-200"
          >
            Analytics
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                variant="ghost"
                className={`h-8 px-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                  rightSidebarOpen
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <PanelRight size={14} />
                <span className="hidden md:inline text-xs font-medium">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {rightSidebarOpen ? "Hide settings" : "Show settings"}
            </TooltipContent>
          </Tooltip>

          <div className="w-px h-5 bg-border/60 mx-0.5" />

          {/* Desktop/Tablet Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onOpenPreview}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                >
                  <Eye size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Preview</TooltipContent>
            </Tooltip>

            <Button
              onClick={onTogglePublish}
              className={`text-xs font-semibold px-4 h-8 rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                status === "published"
                  ? "bg-transparent text-red-500 border-red-500/20 hover:bg-red-50"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent shadow-sm"
              }`}
            >
              {status === "published" ? "Unpublish" : "Publish"}
            </Button>

            <Button
              onClick={onOpenShare}
              variant="outline"
              className="border-border text-xs font-medium px-3 h-8 rounded-lg flex items-center gap-1.5 transition-all duration-200 text-foreground hover:bg-secondary active:scale-[0.98]"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>

          {/* Mobile Actions Dropdown */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  <MoreVertical size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border text-foreground rounded-xl" align="end">
                <DropdownMenuItem
                  onClick={onOpenPreview}
                  className="hover:bg-secondary cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200"
                >
                  <Eye size={13} />
                  <span>Preview Form</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onOpenShare}
                  className="hover:bg-secondary cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200"
                >
                  <Share2 size={13} />
                  <span>Share Link</span>
                </DropdownMenuItem>

                <Link href={`/forms/${formId}/analytics`}>
                  <DropdownMenuItem
                    className="hover:bg-secondary cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200 w-full"
                  >
                    <BarChart2 size={13} />
                    <span>View Analytics</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  onClick={onTogglePublish}
                  className={`cursor-pointer flex items-center gap-2 text-xs rounded-lg transition-all duration-200 font-semibold ${
                    status === "published" 
                      ? "text-red-500 hover:bg-red-50" 
                      : "text-primary hover:bg-secondary"
                  }`}
                >
                  <Check size={13} />
                  <span>{status === "published" ? "Unpublish Form" : "Publish Form"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
