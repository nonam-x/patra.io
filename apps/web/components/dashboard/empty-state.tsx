"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="border border-border rounded-2xl bg-card p-16 text-center max-w-lg mx-auto my-4 transition-all hover:border-muted-foreground/30 shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
        <Icon size={18} className="text-muted-foreground/75" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-4 h-8.5 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
