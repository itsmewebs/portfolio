"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlogCard } from "@/components/ui/BlogCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import {
  Bookmark,
  FolderKanban,
  BookOpen,
  Trash2,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime: string;
  views: number;
  likes?: number;
  publishedAt: Date | string;
  coverImage?: string | null;
  tags?: string;
  isFeatured?: boolean;
}

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  techStack: string;
  category: string;
  role?: string | null;
  isFeatured?: boolean;
  liveLink?: string | null;
  githubLink?: string | null;
}

export function BookmarksClient() {
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "projects">("all");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const stored = localStorage.getItem("alinets_bookmarks");
      if (!stored) {
        setArticles([]);
        setProjects([]);
        setLoading(false);
        return;
      }

      const bookmarks: Array<{ slug: string; type: string }> = JSON.parse(stored);
      if (bookmarks.length === 0) {
        setArticles([]);
        setProjects([]);
        setLoading(false);
        return;
      }

      const slugs = bookmarks.map((b) => b.slug);

      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs }),
      });

      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Error loading bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();

    const handleUpdate = () => fetchBookmarks();
    window.addEventListener("bookmarks-updated", handleUpdate);
    return () => window.removeEventListener("bookmarks-updated", handleUpdate);
  }, []);

  const clearAllBookmarks = () => {
    if (!confirm("Are you sure you want to clear your saved bookmarks?")) return;
    localStorage.removeItem("alinets_bookmarks");
    setArticles([]);
    setProjects([]);
    toast.success("Bookmarks cleared");
  };

  const totalCount = articles.length + projects.length;

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-xs font-mono text-on-surface-variant">
          Retrieving saved publications and case studies...
        </p>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto border border-outline/25 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto shadow-md">
          <Bookmark className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-on-surface">
            Your Reading List is Empty
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Click the bookmark icon on any research article or engineering case study to save it here for quick reference.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/blog"
            className="glow-btn-primary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Publications</span>
          </Link>
          <Link
            href="/projects"
            className="glass-btn-secondary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Browse Case Studies</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls & Tab Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline/20 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "all"
                ? "bg-primary text-white shadow-md"
                : "glass-panel text-on-surface-variant hover:text-on-surface"
            }`}
          >
            All Items ({totalCount})
          </button>

          <button
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "articles"
                ? "bg-primary text-white shadow-md"
                : "glass-panel text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "projects"
                ? "bg-primary text-white shadow-md"
                : "glass-panel text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>
        </div>

        <button
          onClick={clearAllBookmarks}
          className="text-xs font-semibold text-error/80 hover:text-error flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-error/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Bookmarks</span>
        </button>
      </div>

      {/* Articles Section */}
      {(activeTab === "all" || activeTab === "articles") && articles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-tertiary uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Saved Technical Publications ({articles.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <BlogCard
                key={art.id}
                post={{
                  id: art.id,
                  title: art.title,
                  slug: art.slug,
                  excerpt: art.excerpt,
                  content: "",
                  category: art.category,
                  readingTime: art.readingTime,
                  views: art.views,
                  likes: art.likes,
                  isPublished: true,
                  isFeatured: art.isFeatured || false,
                  publishedAt: new Date(art.publishedAt),
                  createdAt: new Date(art.publishedAt),
                  updatedAt: new Date(art.publishedAt),
                  coverImage: art.coverImage,
                  tags: art.tags || "[]",
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {(activeTab === "all" || activeTab === "projects") && projects.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-secondary uppercase tracking-wider">
            <FolderKanban className="w-4 h-4" />
            <span>Saved Engineering Projects ({projects.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={{
                  ...proj,
                  category: proj.category as "WEB_DEV" | "NETWORKING" | "CLOUD_DEVOPS" | "CYBER_SEC" | "DATA_SCIENCE",
                  isFeatured: proj.isFeatured || false,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
