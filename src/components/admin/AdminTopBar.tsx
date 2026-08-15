"use client";

import React from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  ExternalLink,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

interface AdminTopBarProps {
  userEmail?: string;
}

export function AdminTopBar({
  userEmail = "admin@alinets.com",
}: AdminTopBarProps) {
  const triggerCommandPalette = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-container/90 backdrop-blur-xl border-b border-outline/20 px-6 flex items-center justify-between shadow-sm">
      {/* Search trigger in admin */}
      <button
        onClick={triggerCommandPalette}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-high border border-outline/20 hover:border-primary/40 text-xs font-mono text-on-surface-variant hover:text-on-surface transition-all"
      >
        <Search className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">Search portfolio items...</span>
        <kbd className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded border border-outline/30 font-bold">
          ⌘K
        </kbd>
      </button>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-xl border border-outline/20 hover:border-primary/40 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Public Site</span>
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-outline/20">
          <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-display font-bold text-xs shadow-sm">
            A
          </div>
          <span className="text-xs font-mono text-on-surface-variant hidden md:inline">
            {userEmail}
          </span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="p-1.5 rounded-lg text-error/80 hover:text-error hover:bg-error/10 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
