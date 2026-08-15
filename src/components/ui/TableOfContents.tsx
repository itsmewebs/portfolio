"use client";

import React, { useEffect, useState } from "react";
import { ListTree, ArrowUp } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Parse markdown headings (## and ###)
    const lines = content.split("\n");
    const extracted: TocItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        extracted.push({ id, text, level });
      }
    });

    setHeadings(extracted);

    // Scroll listener for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px" }
    );

    const elements = document.querySelectorAll("h2, h3");
    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="glass-panel p-5 rounded-2xl border border-outline/25 space-y-3 sticky top-28 backdrop-blur-xl shadow-lg">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider border-b border-outline/20 pb-2.5">
        <ListTree className="w-4 h-4" />
        <span>Table of Contents</span>
      </div>

      <nav className="space-y-1.5 text-xs font-medium max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
        {headings.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={idx}
              onClick={() => scrollToHeading(item.id)}
              className={`block w-full text-left transition-colors truncate py-1 rounded px-2 ${
                item.level === 3 ? "pl-4 text-[11px]" : "font-semibold"
              } ${
                isActive
                  ? "text-secondary bg-secondary/10 border-l-2 border-secondary font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
              }`}
              title={item.text}
            >
              {item.text}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full pt-2 border-t border-outline/20 flex items-center justify-center gap-1 text-[10px] font-mono text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowUp className="w-3 h-3" />
        <span>Back to Top</span>
      </button>
    </aside>
  );
}
