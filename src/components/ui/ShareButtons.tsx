"use client";

import React, { useState } from "react";
import { Share2, Link as LinkIcon, Check, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Check out "${title}" by Ali:`
    )}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  };

  const handleLinkedinShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1 mr-1">
        <Share2 className="w-3.5 h-3.5 text-primary" />
        <span>Share:</span>
      </span>

      <button
        onClick={handleCopyLink}
        className="px-2.5 py-1 rounded-lg bg-surface-container-high/70 hover:bg-surface-container-highest border border-outline/30 text-on-surface-variant hover:text-on-surface text-xs font-mono flex items-center gap-1 transition-colors shadow-sm"
        title="Copy Link"
        aria-label="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-secondary" />
            <span className="text-secondary font-bold">Copied</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link</span>
          </>
        )}
      </button>

      <button
        onClick={handleTwitterShare}
        className="p-1.5 rounded-lg bg-surface-container-high/70 hover:bg-surface-container-highest border border-outline/30 text-on-surface-variant hover:text-secondary text-xs flex items-center transition-colors shadow-sm"
        title="Share on X (Twitter)"
        aria-label="Share on X"
      >
        <Twitter className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={handleLinkedinShare}
        className="p-1.5 rounded-lg bg-surface-container-high/70 hover:bg-surface-container-highest border border-outline/30 text-on-surface-variant hover:text-primary text-xs flex items-center transition-colors shadow-sm"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
