import React from "react";
import Link from "next/link";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { Terminal, ArrowLeft, Home, Search, FolderKanban, BookOpen, Briefcase } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <TopNavBar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        <div className="glass-panel rounded-3xl p-10 md:p-14 text-center max-w-xl border border-primary/30 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto shadow-xl">
            <Terminal className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono text-secondary uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
              Error 404 &bull; Quantum Node Unreachable
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-on-surface mt-4 tracking-tight">
              Route Coordinates Not Found
            </h1>
            <p className="text-on-surface-variant text-xs md:text-sm mt-3 leading-relaxed max-w-md mx-auto">
              The requested system route does not exist or has been relocated in the Nova Prism v5.0 architecture.
            </p>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="grid grid-cols-3 gap-2 pt-2 max-w-md mx-auto text-xs font-semibold">
            <Link
              href="/projects"
              className="p-3 rounded-xl glass-panel hover:border-primary/40 text-on-surface hover:text-primary transition-colors flex flex-col items-center gap-1"
            >
              <FolderKanban className="w-4 h-4 text-primary" />
              <span>Projects</span>
            </Link>
            <Link
              href="/services"
              className="p-3 rounded-xl glass-panel hover:border-secondary/40 text-on-surface hover:text-secondary transition-colors flex flex-col items-center gap-1"
            >
              <Briefcase className="w-4 h-4 text-secondary" />
              <span>Services</span>
            </Link>
            <Link
              href="/blog"
              className="p-3 rounded-xl glass-panel hover:border-tertiary/40 text-on-surface hover:text-tertiary transition-colors flex flex-col items-center gap-1"
            >
              <BookOpen className="w-4 h-4 text-tertiary" />
              <span>Articles</span>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-outline/20">
            <Link
              href="/"
              className="glow-btn-primary px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <Home className="w-4 h-4" />
              <span>Return to Core Portal</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
