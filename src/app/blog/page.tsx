import React from "react";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { BlogCard } from "@/components/ui/BlogCard";
import { NewsletterSignup } from "@/components/ui/NewsletterSignup";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { BookOpen, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Technical Research & Engineering Publications | Ali (alinets.com)",
  description:
    "Explore in-depth engineering deep dives, Cisco computer networks, routing architectures, and modern full-stack web development articles authored by Ali.",
  alternates: {
    canonical: "https://alinets.com/blog",
  },
  openGraph: {
    title: "Technical Research & Engineering Publications | Ali (alinets.com)",
    description:
      "Engineering deep dives, Cisco network protocols, and full-stack web development articles by Ali.",
    url: "https://alinets.com/blog",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Blog & Publications" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Research & Engineering Publications | Ali (alinets.com)",
    description: "Explore engineering deep dives and network architecture articles by Ali.",
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
  });

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id);

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ali Technical Research & Publications",
    url: "https://alinets.com/blog",
    description:
      "Articles and deep dives on computer networks, dynamic routing protocols, cloud telemetry, and modern full-stack web platforms.",
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://alinets.com/blog/${p.slug}`,
      description: p.excerpt,
    })),
  };

  return (
    <>
      <JsonLd data={blogListJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Insights &amp; Research</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Web Development, Computer Networks &amp; Cloud Systems
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mt-4 leading-relaxed">
            Reflections, architectural breakdowns, and practical tutorials on enterprise Cisco networking, OSPF/BGP routing, Next.js 15 full-stack engineering, and cloud infrastructure telemetry.
          </p>
        </div>

        {/* Featured Spotlight Article (if available) */}
        {featuredPost && (
          <section className="py-6 max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Spotlight Publication</span>
              </div>
              <BlogCard post={featuredPost} />
            </ScrollReveal>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="py-12">
          <div className="flex justify-between items-center mb-8 border-b border-outline/20 pb-4">
            <h2 className="font-display text-2xl font-bold text-on-surface">
              All Publications ({posts.length})
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">
              Regularly updated
            </span>
          </div>

          {regularPosts.length === 0 && !featuredPost ? (
            <div className="text-center py-20 glass-panel rounded-3xl p-8 border border-outline/25 max-w-lg mx-auto shadow-lg">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="font-bold text-lg text-on-surface">No articles published yet</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                New articles and technical deep dives will be posted soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, idx) => (
                <ScrollReveal key={post.id} delay={idx * 0.1}>
                  <BlogCard post={post} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>

        {/* NEWSLETTER SUBSCRIPTION */}
        <section className="py-8 max-w-4xl mx-auto w-full">
          <ScrollReveal>
            <NewsletterSignup
              title="Subscribe to Ali's Technical & Engineering Publications"
              subtitle="Get notified when new research articles on Cisco network topologies, Next.js architectures, and cloud telemetry systems are published."
            />
          </ScrollReveal>
        </section>
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
