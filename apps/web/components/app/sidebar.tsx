"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Settings,
  Search,
  Globe,
  Palette,
  LayoutTemplate,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "~/hooks/use-auth";

const navItems = [
  { href: "/dashboard", label: "All Forms", icon: LayoutGrid },
  { href: "/dashboard/explore", label: "Explore", icon: Globe },
  { href: "/dashboard/themes", label: "Themes", icon: Palette },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onOpenCommandPalette?: () => void;
  onClose?: () => void;
}

export function Sidebar({ onOpenCommandPalette, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col justify-between flex-shrink-0 z-20">
      <div>
        {/* Logo / Workspace */}
        <div className="h-14 px-5 border-b border-sidebar-border flex items-center gap-3">
          <img 
            src="/logos/patra.io-logo.png" 
            alt="Patra.io Logo" 
            className="w-7 h-7 object-contain bg-white rounded-lg p-0.5" 
          />
          <div>
            <span className="font-semibold text-sm block text-sidebar-foreground leading-tight">Patra</span>
            <span className="text-[9px] text-sidebar-primary font-mono uppercase font-bold tracking-wider">
              {user?.plan || "free"} plan
            </span>
          </div>
        </div>
 
        {/* Nav */}
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon size={15} className={active ? "text-sidebar-primary" : ""} />
                <span>{item.label}</span>
              </Link>
            );
          })}
 
          {/* Command palette trigger */}
          <button
            onClick={() => {
              onOpenCommandPalette?.();
              onClose?.();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground text-[13px] font-medium transition-all duration-200 text-left mt-2 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search size={15} />
              <span>Search</span>
            </div>
            <kbd className="text-[9px] bg-sidebar-accent px-1.5 py-0.5 rounded-md border border-sidebar-border font-mono text-sidebar-foreground/40">
              ⌘K
            </kbd>
          </button>
        </nav>
      </div>
 
      {/* User footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-2.5 px-2.5">
          <div className="w-7 h-7 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center flex-shrink-0">
            <User size={13} className="text-sidebar-foreground/70" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold truncate text-sidebar-foreground">{user?.name}</div>
            <div className="text-[10px] text-sidebar-foreground/50 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-sidebar-foreground/70 hover:text-red-500 text-[13px] font-medium transition-all duration-200 text-left cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
