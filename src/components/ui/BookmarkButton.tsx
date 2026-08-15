"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  id: string;
  slug: string;
  type: "article" | "project";
  title: string;
  className?: string;
}

export function BookmarkButton({
  slug,
  type,
  title,
  className = "",
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("alinets_bookmarks");
      if (stored) {
        const bookmarks = JSON.parse(stored) as Array<{ slug: string; type: string }>;
        const exists = bookmarks.some((b) => b.slug === slug && b.type === type);
        setIsBookmarked(exists);
      }
    } catch {}
  }, [slug, type]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem("alinets_bookmarks");
      let bookmarks: Array<{ slug: string; type: string; title: string }> = stored
        ? JSON.parse(stored)
        : [];

      if (isBookmarked) {
        bookmarks = bookmarks.filter((b) => !(b.slug === slug && b.type === type));
        localStorage.setItem("alinets_bookmarks", JSON.stringify(bookmarks));
        setIsBookmarked(false);
        toast.info("Removed from Bookmarks", {
          description: `"${title}" has been removed from your saved list.`,
        });
      } else {
        bookmarks.push({ slug, type, title });
        localStorage.setItem("alinets_bookmarks", JSON.stringify(bookmarks));
        setIsBookmarked(true);
        toast.success("Saved to Bookmarks!", {
          description: `"${title}" is saved in your reading list. View anytime at /bookmarks.`,
        });
      }

      window.dispatchEvent(new CustomEvent("bookmarks-updated"));
    } catch {
      toast.error("Unable to update bookmarks in browser storage");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 focus:outline-none ${
        isBookmarked
          ? "bg-primary text-white shadow-[0_0_12px_rgba(109,40,217,0.4)]"
          : "bg-surface-container-high/80 text-on-surface-variant hover:text-primary hover:bg-surface-container-high border border-outline/30"
      } ${className}`}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
      title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
    >
      <Bookmark
        className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
          isBookmarked ? "fill-current" : ""
        }`}
      />
    </button>
  );
}
