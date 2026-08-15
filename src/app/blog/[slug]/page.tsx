import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { ArticleReactions } from "@/components/ui/ArticleReactions";
import { ViewTracker } from "@/components/ui/ViewTracker";
import { BlogCard } from "@/components/ui/BlogCard";
import { JsonLd } from "@/components/ui/JsonLd";
import { parseArray, formatDate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Tag,
  BookOpen,
  Sparkles,
  Heart,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Publication Not Found | Ali (alinets.com)",
      description: "The requested technical article could not be located.",
    };
  }

  const tagsList = parseArray<string>(post.tags);

  return {
    title: `${post.title} | Technical Publication`,
    description: post.excerpt,
    keywords: [
      ...tagsList,
      "Ali",
      "alinets.com",
      "Technical Article",
      "Network Engineering",
      "Cisco Networking",
      "Full-Stack Web Development",
      "ICT Specialist",
    ],
    alternates: {
      canonical: `https://alinets.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://alinets.com/blog/${post.slug}`,
      siteName: "Ali Technical Publications (alinets.com)",
      type: "article",
      publishedTime: (post.publishedAt || post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["Ali"],
      tags: tagsList,
      images: [
        {
          url: post.coverImage || "https://alinets.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || "https://alinets.com/og-image.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  const [settings, relatedPosts] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.blogPost.findMany({
      where: {
        isPublished: true,
        slug: { not: slug },
        category: post.category,
      },
      take: 3,
    }),
  ]);

  const tagsList = parseArray<string>(post.tags);
  const articleUrl = `https://alinets.com/blog/${post.slug}`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || "https://alinets.com/og-image.jpg",
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Ali",
      url: "https://alinets.com",
      jobTitle: "ICT Specialist & Full-Stack Architect",
    },
    publisher: {
      "@type": "Person",
      name: "Ali",
      url: "https://alinets.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: tagsList.join(", "),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://alinets.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog & Research",
        item: "https://alinets.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLdArticle} />
      <JsonLd data={jsonLdBreadcrumb} />
      <ReadingProgressBar />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        {/* Back Navigation & Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Publications</span>
          </Link>

          <ShareButtons title={post.title} url={articleUrl} />
        </div>

        {/* 2-Column Grid: Main Content + Sticky Table of Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Main Article Column (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Article Header */}
            <header className="space-y-4 pb-6 border-b border-outline/20">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
                  {post.category.replace("_", " ")}
                </span>
                {post.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tertiary/15 border border-tertiary/30 text-tertiary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured Article
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.2]">
                {post.title}
              </h1>

              <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed italic">
                {post.excerpt}
              </p>

              {/* Metadata Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-on-surface-variant pt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span>{post.readingTime}</span>
                </span>
                <ViewTracker slug={post.slug} initialViews={post.views} />
                {(post.likes ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5 text-tertiary">
                    <Heart className="w-4 h-4 fill-tertiary" />
                    <span>{post.likes} reactions</span>
                  </span>
                )}
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden glass-panel border border-outline/25 shadow-2xl">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Markdown Content Body */}
            <article className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:text-on-surface prose-h2:border-b prose-h2:border-outline/20 prose-h2:pb-2 prose-h3:text-xl prose-h3:text-on-surface prose-p:text-on-surface prose-p:leading-relaxed prose-code:text-primary prose-code:bg-surface-container-high prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-surface-container-lowest prose-pre:border prose-pre:border-outline/20 prose-pre:rounded-2xl prose-a:text-secondary prose-a:no-underline hover:prose-a:underline">
              <MarkdownRenderer content={post.content} />
            </article>

            {/* V5 Interactive Reactions & Appreciation Banner */}
            <div className="py-6 flex justify-center">
              <ArticleReactions slug={post.slug} initialLikes={post.likes ?? 0} />
            </div>

            {/* Tags & Article Footer */}
            <div className="space-y-4 pt-6 border-t border-outline/20">
              {tagsList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Topics:
                  </span>
                  {tagsList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-surface-container-high border border-outline/30 text-on-surface hover:border-primary/40 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-outline/20">
                <Link
                  href="/blog"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>More Publications</span>
                </Link>
                <ShareButtons title={post.title} url={articleUrl} />
              </div>
            </div>

            {/* Author Card */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-display font-extrabold text-xl flex-shrink-0 shadow-lg">
                A
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-on-surface">
                    Written by Ali
                  </h3>
                  <span className="text-xs font-mono text-secondary">
                    ICT Specialist &times; Web Developer &times; Network Architect
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Specializing in Cisco network topologies, dynamic routing protocols, cloud telemetry, and Next.js full-stack platform architecture.
                </p>
                <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-semibold text-primary">
                  <Link href="/about" className="hover:underline">
                    About Author &rarr;
                  </Link>
                  <Link href="/contact" className="hover:underline text-secondary">
                    Initiate Transmission &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Table of Contents (Col 4) */}
          <div className="hidden lg:block lg:col-span-4">
            <TableOfContents content={post.content} />
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="py-12 border-t border-outline/20 mt-16 max-w-container-max mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-2xl font-bold text-on-surface">
                Related Technical Publications &amp; Research
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer
        githubUrl={settings?.githubUrl}
        linkedinUrl={settings?.linkedinUrl}
        twitterUrl={settings?.twitterUrl}
        contactEmail={settings?.contactEmail}
        footerText={settings?.footerText}
      />
    </>
  );
}
