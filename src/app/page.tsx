import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { TypewriterHeading } from "@/components/ui/TypewriterHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { BlogCard } from "@/components/ui/BlogCard";
import { CertificateCard } from "@/components/ui/CertificateCard";
import { InteractiveTechMarquee } from "@/components/ui/InteractiveTechMarquee";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SkillBar } from "@/components/ui/SkillBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { NewsletterSignup } from "@/components/ui/NewsletterSignup";
import { JsonLd } from "@/components/ui/JsonLd";
import { parseArray } from "@/lib/utils";
import {
  ArrowRight,
  Mail,
  Users,
  Code2,
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Database,
  BookOpen,
  Briefcase,
  MessageSquareQuote,
  Eye,
  CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ali | ICT Specialist — Web Developer & Network Infrastructure Architect (alinets.com)",
  description:
    "Official portfolio & engineering platform of Ali: ICT Specialist, Full-Stack Web Developer, and Computer Network Architect. Explore enterprise web systems, network topologies, routing protocols, and cloud infrastructure.",
  alternates: {
    canonical: "https://alinets.com",
  },
  openGraph: {
    title: "Ali | ICT Specialist — Web Developer & Network Infrastructure Architect (alinets.com)",
    description: "Bridging Modern Web Development with Enterprise Computer Networks & Cloud Systems.",
    url: "https://alinets.com",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Ali Portfolio Preview" }],
  },
};

export default async function HomePage() {
  const [
    settings,
    featuredProjects,
    allProjectsCount,
    topSkills,
    testimonials,
    latestPosts,
    totalBlogPosts,
    totalBlogViewsAgg,
    totalCertificatesCount,
    totalApprovedEndorsements,
    totalSkillsCount,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.project.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.skill.findMany({
      where: { isTopSkill: true },
      orderBy: [{ order: "asc" }, { proficiency: "desc" }],
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      take: 5,
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 3,
    }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.blogPost.aggregate({ _sum: { views: true } }),
    prisma.certificate.count(),
    prisma.testimonial.count({ where: { isApproved: true } }),
    prisma.skill.count(),
  ]);

  const totalViewsCount = totalBlogViewsAgg._sum.views || 0;

  const brandingTags = parseArray(settings?.dynamicBrandingTags);

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: "Ali",
      url: "https://alinets.com",
      jobTitle: "ICT Specialist, Web Developer & Network Systems Architect",
      alumniOf: "Bachelor of Science in Information & Communications Technology",
    },
  };

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full flex flex-col justify-center relative z-10">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-10 md:py-16">
          {/* Left Column: Hero Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6 z-10">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 bg-surface-container-high/60 border border-outline/30 rounded-full px-4 py-1.5 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(2,132,199,0.8)] animate-pulse" />
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {settings?.statusBadgeText || "ICT Specialist × Web Developer × Network Infrastructure Architect"}
              </span>
            </div>

            {/* Dynamic Typewriter Heading */}
            <TypewriterHeading
              greeting={settings?.heroGreeting || "Hi, I'm Ali,"}
              tagline={
                settings?.heroTagline ||
                "ICT Specialist in Full-Stack Web Development, Network Architecture & Cloud Systems."
              }
            />

            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              {settings?.heroDescription ||
                "Holding an academic degree in Information and Communications Technology (ICT), I engineer responsive full-stack web applications, scalable cloud infrastructure, and robust enterprise network topologies."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/projects"
                className="glow-btn-primary font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <span>Explore Systems</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/services"
                className="glass-btn-secondary font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Consulting Services</span>
              </Link>

              <Link
                href="/blog"
                className="px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 border border-outline/30 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Publications</span>
              </Link>
            </div>

            {/* Quick Animated Metrics Bar */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-outline/20 max-w-xl">
              <div>
                <p className="font-display text-xl md:text-2xl font-extrabold text-primary">
                  ICT
                </p>
                <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
                  Academic Degree
                </p>
              </div>
              <div>
                <p className="font-display text-xl md:text-2xl font-extrabold text-secondary">
                  Cisco / Net
                </p>
                <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
                  Infrastructure
                </p>
              </div>
              <div>
                <p className="font-display text-xl md:text-2xl font-extrabold text-tertiary">
                  <AnimatedCounter to={allProjectsCount || 6} suffix="+" />
                </p>
                <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
                  Web &amp; Networks
                </p>
              </div>
              <div>
                <p className="font-display text-xl md:text-2xl font-extrabold text-amber-500 dark:text-amber-400">
                  <AnimatedCounter to={totalBlogPosts || 4} suffix="+" />
                </p>
                <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
                  Articles
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract 3D Glassmorphism Visual */}
          <div className="lg:col-span-5 relative h-[420px] md:h-[480px] w-full hidden sm:flex justify-center items-center">
            {/* Ambient Radial Highlights */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-2xl top-4 left-4" />
            <div className="absolute w-60 h-60 rounded-full bg-gradient-to-bl from-secondary/20 to-transparent blur-2xl bottom-4 right-4" />

            {/* Layer 1 (Back Orbital Ring) */}
            <div className="absolute w-72 h-72 rounded-full glass-panel animate-float border-outline/30 opacity-50 translate-x-8 translate-y-8 scale-95 flex items-center justify-center">
              <div className="w-56 h-56 rounded-full border border-primary/20 border-dashed animate-spin-slow" />
            </div>

            {/* Layer 2 (Middle Glowing Disc) */}
            <div className="absolute w-80 h-80 rounded-full glass-panel animate-float-delayed border-primary/30 opacity-80 backdrop-blur-xl shadow-xl flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border border-secondary/30" />
            </div>

            {/* Layer 3 (Foreground Identity Card) */}
            <div className="absolute w-64 h-84 rounded-2xl glass-card animate-float -translate-x-8 -translate-y-4 flex flex-col p-6 justify-between border-primary/30 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="w-11 h-11 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 font-mono">
                  alinets.com
                </span>
              </div>

              <div className="space-y-2.5 my-auto">
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Core Specialization
                </p>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>Network Infrastructure</span>
                  <span className="text-secondary font-mono font-semibold">Cisco / CCNA</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full w-[96%]" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
                  <span>Full-Stack Web Dev</span>
                  <span className="text-primary font-mono font-semibold">Next.js 15</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[95%]" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
                  <span>ICT Degree &amp; Systems</span>
                  <span className="text-tertiary font-mono font-semibold">Honors</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full w-[92%]" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-outline/20 text-[11px] text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-secondary" /> Version 7.0 Live
                </span>
                <span className="text-secondary font-bold font-mono">Zenith</span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTINUOUS TECH MARQUEE RIBBON */}
        <section className="my-8">
          <InteractiveTechMarquee />
        </section>

        {/* THREE CORE DISCIPLINES */}
        <section className="py-16">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5" /> Core ICT Specialization
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
                Three Pillars. One Integrated Engineering Mindset.
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-3">
                Unifying enterprise computer networks, modern full-stack web platforms, and scalable cloud infrastructure systems.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Discipline 1 */}
            <ScrollReveal delay={0.1}>
              <div className="glass-panel rounded-3xl p-8 border border-outline/25 hover:border-secondary/40 transition-all group flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-on-surface mb-3 group-hover:text-secondary transition-colors">
                    Computer Networks &amp; Routing
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Designing enterprise network topologies, configuring multi-layer Cisco switches and routers, multi-area OSPF/BGP dynamic routing, 802.1Q VLAN segmentation, and perimeter firewall security policies.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline/20 flex items-center gap-2 text-xs font-semibold text-secondary">
                  <Award className="w-3.5 h-3.5" />
                  <span>Cisco Routing &amp; Switching (CCNA)</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Discipline 2 */}
            <ScrollReveal delay={0.2}>
              <div className="glass-panel rounded-3xl p-8 border border-outline/25 hover:border-primary/40 transition-all group flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                    Full-Stack Web Engineering
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Engineering production-ready web applications with Next.js 15 App Router, React 19, TypeScript, PostgreSQL schemas, Prisma ORM, and responsive glassmorphic UI systems.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline/20 flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next.js 15 &amp; React 19</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Discipline 3 */}
            <ScrollReveal delay={0.3}>
              <div className="glass-panel rounded-3xl p-8 border border-outline/25 hover:border-tertiary/40 transition-all group flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-tertiary/15 border border-tertiary/30 flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-on-surface mb-3 group-hover:text-tertiary transition-colors">
                    Cloud Infrastructure &amp; Telemetry
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Deploying containerized microservices with Docker, Nginx reverse proxies with automated SSL/TLS, real-time WebSocket network telemetry streams, and Linux server administration.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline/20 flex items-center gap-2 text-xs font-semibold text-tertiary">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Linux &amp; DevOps Pipelines</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FEATURED PROJECTS SPOTLIGHT */}
        <section className="py-16">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Curated Showcase
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
                  Featured Engineering Endeavors
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1.5 transition-colors group"
              >
                <span>View All Systems ({allProjectsCount})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <ScrollReveal key={project.id} delay={idx * 0.15}>
                <div className="h-full">
                  <ProjectCard project={project} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* SERVICES PREVIEW BANNER */}
        <section className="py-12">
          <ScrollReveal>
            <div className="glass-panel rounded-3xl p-8 md:p-12 border border-secondary/30 relative overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider">
                    <Briefcase className="w-3.5 h-3.5" /> Technical Engineering &amp; Architecture Services
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface">
                    Enterprise Web Platforms, Network Topologies &amp; Cloud Systems
                  </h2>
                  <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed">
                    Collaborating with organizations, tech startups, and engineering teams to architect scalable Next.js web applications, deploy resilient Cisco network infrastructures, and automate cloud DevOps pipelines.
                  </p>
                </div>
                <div className="lg:col-span-4 flex justify-start lg:justify-end">
                  <Link
                    href="/services"
                    className="glow-btn-primary font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-md"
                  >
                    <span>Explore All Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* LATEST BLOG & RESEARCH ARTICLES */}
        {latestPosts.length > 0 && (
          <section className="py-16">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-tertiary uppercase tracking-wider mb-2">
                    <BookOpen className="w-3.5 h-3.5" /> Technical Publications &amp; Research
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
                    Latest Engineering Deep Dives
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-bold text-tertiary hover:text-primary flex items-center gap-1.5 transition-colors group"
                >
                  <span>Explore All Articles ({totalBlogPosts})</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, idx) => (
                <ScrollReveal key={post.id} delay={idx * 0.12}>
                  <div className="h-full">
                    <BlogCard post={post} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* CORE SKILLS & CAPABILITIES PREVIEW */}
        {topSkills.length > 0 && (
          <section className="py-16">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    <Database className="w-3.5 h-3.5" /> Technical Foundations
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
                    Core Technical Competencies
                  </h2>
                </div>
                <Link
                  href="/skills"
                  className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1.5 transition-colors group"
                >
                  <span>Explore Complete Skill Matrix</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topSkills.map((skill, idx) => (
                <ScrollReveal key={skill.id} delay={idx * 0.08}>
                  <SkillBar skill={skill} delay={idx * 0.08} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONIALS SECTION */}
        {testimonials.length > 0 && (
          <section className="py-16">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 max-w-4xl mx-auto">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    <Award className="w-3.5 h-3.5" /> Engineering &amp; Peer Endorsements
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
                    What Collaborators Say
                  </h2>
                  <p className="text-on-surface-variant text-sm mt-2">
                    Perspectives from network architects, lead software engineers, and faculty mentors.
                  </p>
                </div>
                <Link
                  href="/testimonials"
                  className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1.5 transition-colors group px-4 py-2 rounded-xl glass-panel border border-outline/30"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5" />
                  <span>Leave Recommendation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <TestimonialCarousel testimonials={testimonials} />
            </ScrollReveal>
          </section>
        )}

        {/* DYNAMIC BRANDING TAGS */}
        {brandingTags.length > 0 && (
          <section className="py-12 border-t border-b border-outline/20 my-8">
            <p className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
              Specialized Engineering Domains &amp; Protocols
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {brandingTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="glass-panel px-4 py-2 rounded-full text-xs font-semibold text-on-surface hover:text-primary hover:border-primary/40 transition-colors border border-outline/25"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PERIODIC RESEARCH NEWSLETTER SUBSCRIPTION */}
        <section className="py-8 max-w-4xl mx-auto w-full">
          <ScrollReveal>
            <NewsletterSignup />
          </ScrollReveal>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-16">
          <ScrollReveal>
            <div className="glass-panel rounded-3xl p-10 md:p-14 border border-primary/30 relative overflow-hidden text-center max-w-4xl mx-auto shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent pointer-events-none" />

              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-4 tracking-tight relative z-10">
                Let&apos;s Connect &amp; Engineer High-Performance Solutions
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base max-w-2xl mx-auto mb-8 relative z-10">
                Whether you are designing multi-layer enterprise network topologies, building full-stack web platforms, or configuring cloud telemetry systems—let&apos;s architect something remarkable.
              </p>

              <div className="flex flex-wrap justify-center gap-4 relative z-10">
                <Link
                  href="/contact"
                  className="glow-btn-primary font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Mail className="w-4 h-4" />
                  <span>Initiate Conversation</span>
                </Link>
                <Link
                  href="/about"
                  className="glass-btn-secondary font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl flex items-center gap-2"
                >
                  <span>Read Background &amp; ICT Specialization</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
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
