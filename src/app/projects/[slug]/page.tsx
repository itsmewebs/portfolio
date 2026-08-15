import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { JsonLd } from "@/components/ui/JsonLd";
import { parseArray } from "@/lib/utils";
import {
  ExternalLink,
  Github,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Layers,
  Calendar,
  Terminal,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!project) {
    return {
      title: "Project Not Found | Ali (alinets.com)",
    };
  }

  const url = `https://alinets.com/projects/${project.slug}`;

  return {
    title: `${project.title} | Ali Case Study (alinets.com)`,
    description: project.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.title} | Ali (alinets.com)`,
      description: project.description,
      url,
      images: [{ url: project.imageUrl, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Ali (alinets.com)`,
      description: project.description,
      images: [project.imageUrl],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!project) {
    notFound();
  }

  const techList = parseArray<string>(project.techStack);
  const featuresList = parseArray<string>(project.features);
  const metricsList = parseArray<{ label: string; value: string }>(project.metrics);
  const parsedGallery = parseArray<string>(project.galleryImages);
  const galleryImagesList =
    parsedGallery.length > 0
      ? parsedGallery
      : [project.imageUrl, "/projects/enterprise-hr-onboarding.png", "/projects/predictive-attrition-ml.png", "/projects/nextjs-saas-platform.png"];

  const relatedProjects = await prisma.project.findMany({
    where: {
      id: { not: project.id },
      status: "PUBLISHED",
      OR: [{ category: project.category }, { isFeatured: true }],
    },
    take: 3,
  });

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const categoryLabels: Record<string, { label: string; color: string }> = {
    WEB_DEV: { label: "Full-Stack Web", color: "text-primary border-primary/30 bg-primary/10" },
    NETWORKING: { label: "Network Architecture", color: "text-secondary border-secondary/30 bg-secondary/10" },
    CLOUD_DEVOPS: { label: "Cloud & DevOps", color: "text-tertiary border-tertiary/30 bg-tertiary/10" },
    CYBER_SEC: { label: "Network Security", color: "text-amber-500 border-amber-500/30 bg-amber-500/10" },
    DATA_SCIENCE: { label: "Data & Telemetry", color: "text-secondary border-secondary/30 bg-secondary/10" },
  };

  const catMeta = categoryLabels[project.category] || {
    label: project.category,
    color: "text-on-surface-variant border-outline/30 bg-surface-container",
  };

  const projectUrl = `https://alinets.com/projects/${project.slug}`;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    image: project.imageUrl,
    applicationCategory: catMeta.label,
    author: {
      "@type": "Person",
      name: "Ali",
      url: "https://alinets.com",
    },
    url: projectUrl,
  };

  const breadcrumbJsonLd = {
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
        name: "Projects",
        item: "https://alinets.com/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: projectUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={projectJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors glass-panel px-4 py-2 rounded-full border border-outline/25 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* HERO HEADER */}
        <section className="space-y-6 pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${catMeta.color}`}
            >
              {catMeta.label}
            </span>
            {project.isFeatured && (
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Featured Spotlight
              </span>
            )}
            <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight leading-tight max-w-4xl">
            {project.title}
          </h1>

          <p className="text-on-surface-variant text-base md:text-xl max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-btn-primary font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl flex items-center gap-2 shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch Live System</span>
              </a>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn-secondary font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}
          </div>
        </section>

        {/* METRICS ROW (if available) */}
        {metricsList.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            {metricsList.map((metric, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-outline/25 text-center shadow-sm"
              >
                <p className="font-display text-2xl md:text-3xl font-extrabold text-secondary font-mono">
                  {metric.value}
                </p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                  {metric.label}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* HERO IMAGE CONTAINER */}
        <section className="py-6">
          <div className="relative w-full h-[320px] sm:h-[460px] md:h-[540px] rounded-3xl overflow-hidden glass-panel border border-outline/25 shadow-2xl">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        </section>

        {/* INTERACTIVE HD SCREENSHOT GALLERY WITH LIGHTBOX */}
        <div className="py-4">
          <ImageGallery images={galleryImagesList} title={project.title} />
        </div>

        {/* DETAILS GRID: Long Description + Architecture & Features */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12">
          {/* Left Column: Long Description */}
          <div className="lg:col-span-7 space-y-8">
            <div className="glass-panel rounded-3xl p-8 border border-outline/25 space-y-6 shadow-xl">
              <h2 className="font-display text-2xl font-bold text-on-surface flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <span>Project Narrative &amp; Overview</span>
              </h2>

              <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-on-surface-variant space-y-4">
                {project.longDescription ? (
                  project.longDescription
                    .split("\n\n")
                    .map((paragraph, idx) => (
                      <p key={idx} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))
                ) : (
                  <p>{project.description}</p>
                )}
              </div>
            </div>

            {/* Core Features List */}
            {featuresList.length > 0 && (
              <div className="glass-panel rounded-3xl p-8 border border-outline/25 space-y-4 shadow-xl">
                <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span>Key Engineered Features</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {featuresList.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-surface-container border border-outline/20 flex items-start gap-2.5 text-xs font-semibold text-on-surface"
                    >
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Architecture & Tech Stack Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tech Stack Specs */}
            <div className="glass-panel rounded-3xl p-8 border border-outline/25 space-y-5 shadow-xl">
              <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>Technology Stack</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {techList.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold text-secondary bg-secondary/10 border border-secondary/25"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Card */}
            {project.architecture && (
              <div className="glass-panel rounded-3xl p-8 border border-outline/25 space-y-3 shadow-xl">
                <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-secondary" />
                  <span>System Architecture</span>
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed font-normal">
                  {project.architecture}
                </p>
              </div>
            )}

            {/* Inquiries Box */}
            <div className="glass-panel rounded-3xl p-8 border border-primary/25 space-y-4 text-center shadow-xl">
              <h4 className="font-display text-base font-bold text-on-surface">
                Interested in Technical Deep Dives?
              </h4>
              <p className="text-xs text-on-surface-variant">
                Let&apos;s discuss the architecture, data modeling, or replication details.
              </p>
              <Link
                href="/contact"
                className="glow-btn-primary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider block shadow-md"
              >
                Discuss This Project
              </Link>
            </div>
          </div>
        </section>

        {/* RELATED PROJECTS */}
        {relatedProjects.length > 0 && (
          <section className="py-12 border-t border-outline/20 mt-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-2xl font-bold text-on-surface">
                Explore More Systems
              </h2>
              <Link
                href="/projects"
                className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1"
              >
                <span>View All Projects</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <div key={p.id} className="h-full">
                  <ProjectCard project={p} />
                </div>
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
