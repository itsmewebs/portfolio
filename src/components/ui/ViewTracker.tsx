"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewTrackerProps {
  slug: string;
  initialViews: number;
}

export function ViewTracker({ slug, initialViews }: ViewTrackerProps) {
  const [views, setViews] = useState<number>(initialViews);

  useEffect(() => {
    const sessionKey = `viewed_article_${slug}`;
    const alreadyViewed = sessionStorage.getItem(sessionKey);

    if (!alreadyViewed) {
      sessionStorage.setItem(sessionKey, "true");
      fetch(`/api/blog/${slug}/view`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.views === "number") {
            setViews(data.views);
          }
        })
        .catch((err) => console.error("View track failed:", err));
    }
  }, [slug]);

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/80 border border-outline/30 text-on-surface-variant text-xs font-mono font-medium backdrop-blur-md">
      <Eye className="w-3.5 h-3.5 text-primary" />
      <span>{views.toLocaleString()} views</span>
    </span>
  );
}
