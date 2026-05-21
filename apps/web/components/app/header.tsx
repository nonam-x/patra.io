"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export function Header({ title, breadcrumbs, children }: HeaderProps) {
  return (
    <header className="h-14 px-6 border-b border-border bg-background flex items-center justify-between flex-shrink-0 z-10">
      <div className="flex flex-col justify-center">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-0.5 font-mono">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight size={10} className="text-muted-foreground/50" />}
              </React.Fragment>
            ))}
          </div>
        ) : null}
        <h1 className="text-sm font-bold text-foreground tracking-tight leading-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {children}
      </div>
    </header>
  );
}
