"use client";

import React, { useState, useEffect } from "react";
import { Heart, Sparkles, Flame, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";

interface ArticleReactionsProps {
  slug: string;
  initialLikes: number;
}

export function ArticleReactions({ slug, initialLikes }: ArticleReactionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [userLikes, setUserLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`alinets_blog_likes_${slug}`);
      if (stored) {
        setUserLikes(parseInt(stored, 10));
      }
    } catch {
      // LocalStorage access fallback
    }
  }, [slug]);

  const handleReaction = async () => {
    if (userLikes >= 10) {
      toast.info("You've given the maximum 10 appreciations for this article! Thank you! 🎉");
      return;
    }

    // Optimistic UI update
    setLikes((prev) => prev + 1);
    const nextUserLikes = userLikes + 1;
    setUserLikes(nextUserLikes);

    // Floating heart bubble effect
    const heartId = Date.now();
    const randomX = (Math.random() - 0.5) * 60;
    setFloatingHearts((prev) => [...prev, { id: heartId, x: randomX }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 1200);

    // Confetti burst on milestone claps
    if (nextUserLikes === 1 || nextUserLikes === 5 || nextUserLikes === 10) {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#d0bcff", "#4cd7f6", "#ffb0cd", "#a078ff"],
        });
      } catch {
        // Fallback
      }
    }

    try {
      localStorage.setItem(`alinets_blog_likes_${slug}`, nextUserLikes.toString());
      setIsLiking(true);
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.likes !== undefined) {
          setLikes(data.likes);
        }
      }
    } catch (err) {
      console.error("Failed to post reaction:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-4 py-4 px-6 rounded-2xl glass-panel border border-tertiary/30 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col">
        <span className="text-xs font-mono font-bold text-on-surface flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-tertiary" />
          <span>Appreciate Article</span>
        </span>
        <span className="text-[11px] text-on-surface-variant">
          {likes} {likes === 1 ? "reader reaction" : "reader reactions"}
        </span>
      </div>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleReaction}
          className={`relative px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
            userLikes > 0
              ? "bg-tertiary/20 text-tertiary border border-tertiary/40 shadow-sm"
              : "glow-btn-primary"
          }`}
          title="Applaud / Like this research"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              userLikes > 0 ? "fill-tertiary text-tertiary animate-pulse" : "text-white"
            }`}
          />
          <span>{userLikes > 0 ? `Liked (${userLikes})` : "Like Article"}</span>
        </motion.button>

        {/* Floating animated heart particles */}
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, y: 0, scale: 0.8, x: heart.x }}
              animate={{ opacity: 0, y: -60, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none text-tertiary z-20"
            >
              <Heart className="w-5 h-5 fill-tertiary" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
