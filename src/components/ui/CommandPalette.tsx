"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  FolderKanban,
  FileText,
  Code2,
  Briefcase,
  Award,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  MessageSquareQuote,
  Bookmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResults {
  projects: Array<{ id: string; title: string; slug: string; category: string }>;
  posts: Array<{ id: string; title: string; slug: string; category: string; readingTime: string }>;
  skills: Array<{ id: string; name: string; category: string; proficiency: number }>;
  experiences: Array<{ id: string; title: string; organization: string; period: string }>;
  certificates: Array<{ id: string; title: string; issuer: string }>;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    posts: [],
    skills: [],
    experiences: [],
    certificates: [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Toggle with keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [open]);

  // Fetch search results on query change
  useEffect(() => {
    if (!search || search.length < 2) {
      setResults({
        projects: [],
        posts: [],
        skills: [],
        experiences: [],
        certificates: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  const navigateTo = (path: string) => {
    setOpen(false);
    setSearch("");
    router.push(path);
  };

  const quickLinks = [
    { label: "Home", href: "/", icon: Sparkles },
    { label: "Engineering Projects", href: "/projects", icon: FolderKanban },
    { label: "Consulting & Services", href: "/services", icon: Briefcase },
    { label: "Technical Blog & Research", href: "/blog", icon: FileText },
    { label: "Colleague Endorsements", href: "/testimonials", icon: MessageSquareQuote },
    { label: "Saved Reading List / Bookmarks", href: "/bookmarks", icon: Bookmark },
    { label: "Skills & Capabilities", href: "/skills", icon: Code2 },
    { label: "About & Career Journey", href: "/about", icon: Compass },
    { label: "Printable Resume / CV", href: "/resume", icon: Award },
    { label: "Contact Channel", href: "/contact", icon: ArrowRight },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-2xl bg-surface border border-primary/30 rounded-3xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-2xl"
          >
            <Command
              shouldFilter={false}
              className="w-full text-on-surface"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-outline/20">
                <Search className="w-5 h-5 text-primary flex-shrink-0" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search projects, articles, skills, credentials... (Type to explore)"
                  className="w-full bg-transparent text-sm md:text-base text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Results List */}
              <Command.List className="max-h-[380px] overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {/* Default Navigation Links if search query is empty */}
                {search.length < 2 && (
                  <Command.Group heading="QUICK DESTINATIONS" className="text-[10px] font-mono text-secondary px-2 py-1 uppercase tracking-wider font-bold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                      {quickLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Command.Item
                            key={link.href}
                            onSelect={() => navigateTo(link.href)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-high cursor-pointer text-xs font-semibold transition-colors"
                          >
                            <Icon className="w-4 h-4 text-primary" />
                            <span>{link.label}</span>
                          </Command.Item>
                        );
                      })}
                    </div>
                  </Command.Group>
                )}

                {/* Projects Results */}
                {results.projects.length > 0 && (
                  <Command.Group heading="ENGINEERING PROJECTS" className="text-[10px] font-mono text-primary px-2 py-1 uppercase tracking-wider font-bold">
                    <div className="space-y-1 pt-1">
                      {results.projects.map((p) => (
                        <Command.Item
                          key={p.id}
                          onSelect={() => navigateTo(`/projects/${p.slug}`)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-container-high cursor-pointer text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <FolderKanban className="w-4 h-4 text-secondary flex-shrink-0" />
                            <span className="font-semibold text-on-surface">{p.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                        </Command.Item>
                      ))}
                    </div>
                  </Command.Group>
                )}

                {/* Blog Posts Results */}
                {results.posts.length > 0 && (
                  <Command.Group heading="BLOG & RESEARCH ARTICLES" className="text-[10px] font-mono text-tertiary px-2 py-1 uppercase tracking-wider font-bold">
                    <div className="space-y-1 pt-1">
                      {results.posts.map((post) => (
                        <Command.Item
                          key={post.id}
                          onSelect={() => navigateTo(`/blog/${post.slug}`)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-container-high cursor-pointer text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-tertiary flex-shrink-0" />
                            <span className="font-semibold text-on-surface">{post.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-on-surface-variant">
                            {post.readingTime}
                          </span>
                        </Command.Item>
                      ))}
                    </div>
                  </Command.Group>
                )}

                {/* Skills Results */}
                {results.skills.length > 0 && (
                  <Command.Group heading="MATCHING SKILLS" className="text-[10px] font-mono text-secondary px-2 py-1 uppercase tracking-wider font-bold">
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      {results.skills.map((s) => (
                        <Command.Item
                          key={s.id}
                          onSelect={() => navigateTo("/skills")}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-container-high cursor-pointer text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Code2 className="w-3.5 h-3.5 text-primary" />
                            <span className="font-semibold text-on-surface">{s.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-secondary">{s.proficiency}%</span>
                        </Command.Item>
                      ))}
                    </div>
                  </Command.Group>
                )}

                {/* No results message */}
                {search.length >= 2 &&
                  !loading &&
                  results.projects.length === 0 &&
                  results.posts.length === 0 &&
                  results.skills.length === 0 &&
                  results.experiences.length === 0 && (
                    <div className="text-center py-8 text-xs text-on-surface-variant">
                      No results found for &quot;{search}&quot;. Try exploring categories in the menu.
                    </div>
                  )}
              </Command.List>

              {/* Footer hint */}
              <div className="px-5 py-2.5 border-t border-outline/20 bg-surface-container/50 flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                <span>Navigate with ↑ ↓ and ↵ Enter</span>
                <span className="hidden sm:inline">ESC to dismiss</span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
