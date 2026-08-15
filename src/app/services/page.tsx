import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  Briefcase,
  Code2,
  BrainCircuit,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Layers,
  Database,
  BarChart3,
  Users,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Services & Architecture Solutions | Ali (alinets.com)",
  description:
    "Explore bespoke enterprise engineering services offered by Ali: Computer Networks & Infrastructure Architecture, Full-Stack Next.js 15 Web Applications, and Cloud Systems.",
  alternates: {
    canonical: "https://alinets.com/services",
  },
  openGraph: {
    title: "Engineering Services & Architecture Solutions | Ali (alinets.com)",
    description:
      "Enterprise Computer Networks, High-Performance Full-Stack Web Architecture, and Cloud Telemetry Consulting.",
    url: "https://alinets.com/services",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Services & Architecture Solutions | Ali (alinets.com)",
    description: "Enterprise Computer Networks, Next.js Web Platforms, and Cloud Infrastructure Consulting.",
  },
};

export default async function ServicesPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const services = [
    {
      id: "networking-infra",
      icon: Database,
      badge: "Cisco & Network Architecture",
      title: "Computer Networks & Infrastructure Architecture",
      description:
        "Designing resilient enterprise network topologies, configuring multi-layer Cisco switches and routers, multi-area OSPF/BGP dynamic routing, 802.1Q VLAN segmentation, and perimeter firewall security policies.",
      deliverables: [
        "Multi-layer enterprise network topology design & Cisco IOS provisioning",
        "Multi-area OSPF, BGP, and static route optimization with failover",
        "802.1Q VLAN segmentation, ACL traffic filtering, and STP/RSTP hardening",
        "Site-to-site WireGuard / IPsec VPN gateways & stateful firewall rules",
      ],
      techStack: ["Cisco IOS", "OSPF / BGP", "VLANs / 802.1Q", "WireGuard", "Wireshark", "Linux"],
      accentColor: "text-secondary",
      borderGlow: "group-hover:border-secondary/50",
    },
    {
      id: "full-stack",
      icon: Code2,
      badge: "Next.js 15 & React 19 Architecture",
      title: "Enterprise Full-Stack Web Development",
      description:
        "Engineering ultra-fast, responsive web platforms and custom internal tooling using Next.js 15 App Router, React 19 Server Components, Tailwind CSS glassmorphism, and serverless Neon PostgreSQL.",
      deliverables: [
        "High-performance SaaS web applications & executive CMS dashboards",
        "Serverless database architecture with connection pooling & Prisma ORM",
        "Type-safe Server Actions with structured input validation",
        "Responsive, high-contrast dark/light glassmorphic user interfaces",
      ],
      techStack: ["Next.js 15", "React 19", "Prisma", "PostgreSQL", "Tailwind CSS", "Framer Motion"],
      accentColor: "text-primary",
      borderGlow: "group-hover:border-primary/50",
    },
    {
      id: "cloud-devops",
      icon: BrainCircuit,
      badge: "Linux, Docker & Telemetry",
      title: "Cloud Infrastructure & Telemetry Streaming",
      description:
        "Deploying containerized microservices with Docker, Nginx reverse proxies with automated SSL/TLS, real-time WebSocket network telemetry streams, and Linux server administration.",
      deliverables: [
        "Containerized application orchestration with Docker & Docker Compose",
        "Nginx reverse proxy configuration, rate limiting, and SSL/TLS automation",
        "Real-time WebSocket telemetry pipelines for bandwidth and interface monitoring",
        "Automated CI/CD deployment pipelines & server health alerts",
      ],
      techStack: ["Linux", "Docker", "Nginx", "WebSockets", "SNMP", "CI/CD"],
      accentColor: "text-tertiary",
      borderGlow: "group-hover:border-tertiary/50",
    },
    {
      id: "systems-audit",
      icon: ShieldCheck,
      badge: "Quality, Performance & Security",
      title: "Full-Scale Systems Audit & Network Diagnostics",
      description:
        "Comprehensive architectural audits assessing network packet loss, latency, Core Web Vitals, serverless database indexing, TypeScript type-safety, and search engine optimization structured data.",
      deliverables: [
        "Network packet capture analysis (Wireshark) & latency bottleneck diagnosis",
        "Core Web Vitals & Google Lighthouse 100/100 optimization",
        "JSON-LD structured data schemas (Person, Blog, Service, Breadcrumb)",
        "PostgreSQL query optimization & relational index strategy",
      ],
      techStack: ["Wireshark", "Lighthouse", "PostgreSQL EXPLAIN", "JSON-LD", "Security Auditing"],
      accentColor: "text-amber-500 dark:text-amber-400",
      borderGlow: "group-hover:border-amber-400/50",
    },
  ];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Full-Stack Web Development & Computer Networks Infrastructure Consulting",
    provider: {
      "@type": "Person",
      name: "Ali",
      url: "https://alinets.com",
      jobTitle: "ICT Specialist, Full-Stack Web Developer & Network Systems Architect",
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Engineering & Architecture Services",
      itemListElement: services.map((s, idx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
        position: idx + 1,
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consulting &amp; Technical Capabilities</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Engineering &amp; Network Architecture Services
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mt-4 leading-relaxed">
            Designing resilient computer networks, scalable full-stack web applications, and high-performance cloud infrastructure for organizations and digital enterprises.
          </p>
        </div>

        {/* Services Grid */}
        <section className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={service.id} delay={idx * 0.1}>
                <div
                  className={`glass-panel rounded-3xl p-8 border border-outline/25 ${service.borderGlow} transition-all duration-300 flex flex-col justify-between h-full group hover:shadow-2xl`}
                >
                  <div>
                    {/* Header with icon & badge */}
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-surface-container-high border border-outline/30 flex items-center justify-center ${service.accentColor} group-hover:scale-110 transition-transform shadow-md`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-surface-container-high border border-outline/30 text-on-surface-variant">
                        {service.badge}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>

                    <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Deliverables checklist */}
                    <div className="space-y-2.5 mb-6">
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface">
                        Key Deliverables:
                      </p>
                      {service.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${service.accentColor} flex-shrink-0 mt-0.5`} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack pills & Action */}
                  <div className="pt-6 border-t border-outline/20 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {service.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline/30 text-on-surface-variant"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      href="/contact"
                      className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-primary/20 text-on-surface hover:text-primary border border-outline/30 hover:border-primary/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </section>

        {/* Engagement Approach Section */}
        <section className="py-16">
          <ScrollReveal>
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-outline/25 max-w-4xl mx-auto space-y-8 shadow-xl">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-secondary">
                  Methodology &amp; Standards
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
                  How We Collaborate
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-2 p-4 rounded-2xl bg-surface-container-high border border-outline/25">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mx-auto font-display font-bold">
                    01
                  </div>
                  <h3 className="font-bold text-sm text-on-surface">Discovery &amp; Topology Design</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Analyzing network requirements, subnet planning, and software architectural scoping for your infrastructure.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-surface-container-high border border-outline/25">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mx-auto font-display font-bold">
                    02
                  </div>
                  <h3 className="font-bold text-sm text-on-surface">Engineering &amp; Implementation</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Configuring Cisco switches/routers, deploying Next.js web applications, and provisioning secure cloud environments.
                  </p>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-surface-container-high border border-outline/25">
                  <div className="w-10 h-10 rounded-xl bg-tertiary/20 text-tertiary flex items-center justify-center mx-auto font-display font-bold">
                    03
                  </div>
                  <h3 className="font-bold text-sm text-on-surface">Verification &amp; Telemetry</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Packet capture validation, latency benchmarking, automated failover testing, and telemetry handover.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* CTA Banner */}
        <section className="py-8">
          <ScrollReveal>
            <div className="glass-panel rounded-3xl p-10 md:p-14 border border-primary/30 relative overflow-hidden text-center max-w-4xl mx-auto shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-secondary/15 to-transparent pointer-events-none" />

              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-3 tracking-tight relative z-10">
                Ready to Architect Something Exceptional?
              </h2>
              <p className="text-on-surface-variant text-xs md:text-sm max-w-xl mx-auto mb-8 relative z-10">
                Discuss custom network topologies, Next.js web development, or enterprise infrastructure systems with Ali.
              </p>

              <div className="flex flex-wrap justify-center gap-4 relative z-10">
                <Link
                  href="/contact"
                  className="glow-btn-primary font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-md"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Initiate Project Transmission</span>
                </Link>
                <Link
                  href="/projects"
                  className="glass-btn-secondary font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl flex items-center gap-2"
                >
                  <span>Explore Case Studies</span>
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
