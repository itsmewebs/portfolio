"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X, ShieldCheck, Sparkles, Search, MessageSquareQuote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function TopNavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/skills", label: "Skills & Tech" },
    { href: "/blog", label: "Blog & Research" },
    { href: "/testimonials", label: "Endorsements" },
    { href: "/bookmarks", label: "Reading List" },
    { href: "/about", label: "About & ICT" },
    { href: "/resume", label: "Resume / CV" },
  ];

  const triggerCommandPalette = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
      <div className="max-w-container-max mx-auto">
        <nav className="glass-panel rounded-full px-5 py-2.5 flex items-center justify-between shadow-xl backdrop-blur-xl">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform hover:scale-105"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(124,58,237,0.25)]">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-display font-extrabold text-sm tracking-tight text-on-surface">
              Ali<span className="text-secondary font-mono text-xs ml-1">.alinets</span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/15 text-primary border border-primary/30">
                v7.0
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all relative ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action: Search (⌘K), Theme, Admin, Contact */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick ⌘K Search Button */}
            <button
              onClick={triggerCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel hover:border-primary/40 text-xs font-mono text-on-surface-variant hover:text-on-surface transition-all shadow-sm group"
              title="Search Spotlight (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[11px] hidden xl:inline">Search</span>
              <kbd className="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded border border-outline/30 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Admin Center Link */}
            <Link
              href="/admin"
              className="text-xs font-semibold text-on-surface-variant hover:text-primary flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-primary/30 transition-all"
              title="Admin CMS Command Center"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Contact Action */}
            <Link
              href="/contact"
              className="glow-btn-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Let&apos;s Talk</span>
            </Link>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={triggerCommandPalette}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu with Framer Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 glass-panel rounded-2xl p-4 flex flex-col gap-2 shadow-2xl backdrop-blur-xl"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                    pathname === link.href
                      ? "bg-primary/20 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-outline/20 flex items-center justify-between">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin CMS</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="glow-btn-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Let&apos;s Talk
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
