"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPostData } from "@/types";
import { parseArray, formatDate } from "@/lib/utils";
import { Clock, Eye, ArrowRight, Sparkles, BookOpen, Heart } from "lucide-react";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: BlogPostData & { likes?: number };
}

export function BlogCard({ post }: BlogCardProps) {
  const tagsList = parseArray<string>(post.tags);

  const categoryColor = (cat: string) => {
    switch (cat) {
      case "NETWORKING":
        return "text-secondary border-secondary/30 bg-secondary/10";
      case "CLOUD_DEVOPS":
        return "text-tertiary border-tertiary/30 bg-tertiary/10";
      case "WEB_DEV":
        return "text-primary border-primary/30 bg-primary/10";
      default:
        return "text-primary border-primary/30 bg-primary/10";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="glass-card rounded-3xl overflow-hidden flex flex-col h-full group relative"
    >
      {/* Cover Image Container */}
      <Link href={`/blog/${post.slug}`} className="relative h-48 sm:h-56 w-full overflow-hidden block">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

        {/* Category & Featured Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${categoryColor(
              post.category
            )}`}
          >
            {post.category.replace("_", " ")}
          </span>
          {post.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/40 flex items-center gap-1 backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Bookmark Action Button */}
        <div className="absolute top-4 right-4 z-10">
          <BookmarkButton id={post.id} slug={post.slug} type="article" title={post.title} />
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          {/* Metadata Bar */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              {post.readingTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-tertiary" />
              {post.views}
            </span>
            {(post.likes ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-tertiary">
                <Heart className="w-3.5 h-3.5 fill-tertiary" />
                {post.likes}
              </span>
            )}
            <span>•</span>
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>

          <Link href={`/blog/${post.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-display text-lg sm:text-xl font-bold text-on-surface line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Tags & Action Link */}
        <div className="pt-4 border-t border-outline/20 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
            {tagsList.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant border border-outline/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-bold text-primary group-hover:text-secondary flex items-center gap-1 flex-shrink-0 transition-colors"
          >
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
