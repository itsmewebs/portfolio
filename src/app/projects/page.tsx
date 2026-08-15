import React from "react";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { JsonLd } from "@/components/ui/JsonLd";
import { Sparkles, Terminal } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Endeavors & Network Architectures | Ali (alinets.com)",
  description:
    "Explore curated full-stack web platforms, Cisco enterprise network topologies, telemetry streaming gateways, and cloud microservices engineered by Ali.",
  alternates: {
    canonical: "https://alinets.com/projects",
  },
  openGraph: {
    title: "Engineering Endeavors & Network Architectures | Ali (alinets.com)",
    description:
      "Enterprise network architectures, Next.js 15 systems, and cloud infrastructure solutions by Ali.",
    url: "https://alinets.com/projects",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Projects" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Endeavors & Network Architectures | Ali (alinets.com)",
    description: "Explore enterprise web applications and Cisco network systems by Ali.",
  },
};

interface ProjectsPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "";

  const whereClause: {
    status: string;
    category?: string;
  } = {
    status: "PUBLISHED",
  };

  if (currentCategory && currentCategory !== "ALL") {
    whereClause.category = currentCategory;
  }

  const projects = await prisma.project.findMany({
    where: whereClause,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ali Engineering & Network Projects",
    url: "https://alinets.com/projects",
    description:
      "Curated engineering archive spanning Cisco network topologies, cloud microservices, and full-stack web platforms.",
    hasPart: projects.map((p) => ({
      "@type": "SoftwareApplication",
      name: p.title,
      url: `https://alinets.com/projects/${p.slug}`,
      description: p.description,
      applicationCategory: p.category,
    })),
  };

  return (
    <>
      <JsonLd data={projectsJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Engineering Archive</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Web Applications &amp; Network Infrastructure
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mt-4 leading-relaxed">
            Explore production applications spanning enterprise Cisco network topologies, Next.js 15 web engineering, WireGuard zero-trust security, and real-time telemetry systems.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-8">
            <CategoryFilter currentCategory={currentCategory} />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {projects.map((project) => (
            <div key={project.id} className="h-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 glass-panel rounded-3xl p-8 border border-outline/25 max-w-lg mx-auto shadow-lg">
            <Terminal className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
            <h3 className="font-bold text-lg text-on-surface">No projects found</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Try selecting another category or clear your active filters.
            </p>
          </div>
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
