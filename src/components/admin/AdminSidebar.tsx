"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Briefcase,
  Quote,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  PlusCircle,
  Terminal,
  BookOpen,
  Award,
  Mail,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/projects",
      label: "Projects",
      icon: FolderKanban,
      active: pathname.startsWith("/admin/projects"),
    },
    {
      href: "/admin/blog",
      label: "Blog & Research",
      icon: BookOpen,
      active: pathname.startsWith("/admin/blog"),
    },
    {
      href: "/admin/subscribers",
      label: "Subscribers",
      icon: Mail,
      active: pathname.startsWith("/admin/subscribers"),
    },
    {
      href: "/admin/skills",
      label: "Skills & Tech",
      icon: Code2,
      active: pathname.startsWith("/admin/skills"),
    },
    {
      href: "/admin/certificates",
      label: "Certificates",
      icon: Award,
      active: pathname.startsWith("/admin/certificates"),
    },
    {
      href: "/admin/experience",
      label: "Experience",
      icon: Briefcase,
      active: pathname.startsWith("/admin/experience"),
    },
    {
      href: "/admin/testimonials",
      label: "Testimonials",
      icon: Quote,
      active: pathname.startsWith("/admin/testimonials"),
    },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: MessageSquare,
      active: pathname.startsWith("/admin/messages"),
    },
    {
      href: "/admin/settings",
      label: "Site Settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-surface-container/95 backdrop-blur-xl border-r border-outline/20 shadow-2xl flex flex-col py-6">
      {/* Header Profile / Branding */}
      <div className="px-6 pb-6 mb-4 border-b border-outline/20 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/30 via-secondary/20 to-surface-container-high border-2 border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(124,58,237,0.2)]">
          <Terminal className="w-8 h-8" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-base font-bold text-on-surface tracking-tight">
            Ali CMS v7 Zenith
          </h1>
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            Web &amp; Network Specialist
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="mt-2 w-full py-2 px-4 rounded-xl glow-btn-primary transition-all font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Navigation List */}
      <ul className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  item.active
                    ? "bg-primary/15 text-primary border-r-4 border-primary shadow-sm font-extrabold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Footer Actions */}
      <div className="px-3 pt-4 border-t border-outline/20 space-y-1.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </span>
          <span className="text-[10px] text-secondary font-mono font-bold">Live</span>
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-error/80 hover:text-error hover:bg-error/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
