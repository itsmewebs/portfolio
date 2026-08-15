import React from "react";
import { prisma } from "@/lib/prisma";
import { BlogTable } from "@/components/admin/BlogTable";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-tertiary uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Publications &amp; Articles Management</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-on-surface">
          Blog &amp; Technical Research Articles
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1">
          Compose, publish, edit, and categorize technical articles, case studies, and corporate HR thoughts with Markdown support.
        </p>
      </div>

      <BlogTable initialPosts={posts} />
    </div>
  );
}
