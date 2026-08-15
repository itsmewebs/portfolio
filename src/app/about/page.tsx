import React from "react";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { CertificateCard } from "@/components/ui/CertificateCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { parseArray } from "@/lib/utils";
import {
  GraduationCap,
  Briefcase,
  Code2,
  BrainCircuit,
  Sparkles,
  Terminal,
  Layers,
  Award,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About & Academic ICT Background | Ali (alinets.com)",
  description:
    "Learn about Ali's background spanning Bachelor of Science in ICT, Cisco Network Engineering, and applied Full-Stack Web Development.",
  alternates: {
    canonical: "https://alinets.com/about",
  },
  openGraph: {
    title: "About & Academic ICT Background | Ali (alinets.com)",
    description:
      "Bachelor of ICT, Cisco Network Infrastructure Architect, and Full-Stack Web Developer.",
    url: "https://alinets.com/about",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "About Ali" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About & Academic ICT Background | Ali (alinets.com)",
    description: "Bachelor of ICT, Network Infrastructure Architect, and Full-Stack Web Developer.",
  },
};

export default async function AboutPage() {
  const [settings, experiences, certificates] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
    prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.certificate.findMany({
      orderBy: [{ order: "asc" }],
    }),
  ]);

  const brandingTags = parseArray(settings?.dynamicBrandingTags);

  const iconForType = (type: string, title: string) => {
    if (type === "ACADEMIC" || title.toLowerCase().includes("bachelor")) return GraduationCap;
    if (title.toLowerCase().includes("network") || title.toLowerCase().includes("cisco") || title.toLowerCase().includes("infrastructure")) return Layers;
    if (title.toLowerCase().includes("full-stack") || title.toLowerCase().includes("web") || title.toLowerCase().includes("developer")) return Code2;
    return Briefcase;
  };

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Ali",
    url: "https://alinets.com/about",
    description: settings?.aboutText,
    mainEntity: {
      "@type": "Person",
      name: "Ali",
      jobTitle: "ICT Specialist, Full-Stack Web Developer & Network Systems Architect",
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Bachelor of Science in Information & Communications Technology (ICT)",
      },
    },
  };

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        {/* Hero Section */}
        <section className="py-12 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            <span>Academic ICT Foundations &times; Network &amp; Web Systems</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Engineering Web Platforms &amp; Enterprise Computer Networks
          </h1>

          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed pt-2">
            {settings?.aboutText ||
              "Holding a specialized degree in Information and Communications Technology (ICT), I focus on the intersection of modern Full-Stack Web Engineering, Computer Networks, and Infrastructure Systems. From architecting high-performance Next.js web applications to configuring enterprise routing protocols, firewalls, and cloud telemetry, I build secure, scalable digital ecosystems."}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/resume"
              className="glow-btn-primary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <Award className="w-4 h-4" />
              <span>View Executive CV</span>
            </Link>
            <Link
              href="/contact"
              className="glass-btn-secondary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Initiate Transmission</span>
            </Link>
          </div>
        </section>

        {/* Dynamic Career & Education Journey Timeline */}
        <section className="py-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Layers className="w-5 h-5 text-secondary" />
            <h2 className="font-display text-2xl font-bold text-on-surface">
              Professional Journey &amp; Verified Milestones
            </h2>
          </div>

          <div className="space-y-6">
            {experiences.map((m, idx) => {
              const Icon = iconForType(m.type, m.title);
              const skillsList = parseArray<string>(m.skills);

              return (
                <ScrollReveal key={m.id || idx} delay={idx * 0.1}>
                  <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 hover:border-primary/40 transition-all flex flex-col md:flex-row gap-6 items-start group shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline/30 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                          {m.title}
                        </h3>
                        <span className="text-xs font-mono text-secondary font-semibold">
                          {m.period}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        <span>{m.organization}</span>
                        {m.location && (
                          <>
                            <span>&bull;</span>
                            <span className="text-on-surface-variant">{m.location}</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed pt-1">
                        {m.description}
                      </p>

                      {/* Skill chips */}
                      {skillsList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {skillsList.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline/30 text-on-surface-variant"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Verified Industry Certifications Grid */}
        {certificates.length > 0 && (
          <section className="py-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-2 mb-8">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-tertiary" />
                <h2 className="font-display text-2xl font-bold text-on-surface">
                  Professional Certifications &amp; Credentials
                </h2>
              </div>
              <span className="text-xs font-mono text-secondary font-bold">
                {certificates.length} Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert, idx) => (
                <ScrollReveal key={cert.id} delay={idx * 0.1}>
                  <CertificateCard cert={cert} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Technical Competencies Grid */}
        {brandingTags.length > 0 && (
          <section className="py-12 max-w-4xl mx-auto">
            <div className="glass-panel rounded-3xl p-8 md:p-10 border border-secondary/20 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h2 className="font-display text-2xl font-bold text-on-surface">
                  Core Competencies &amp; Specialization Keywords
                </h2>
              </div>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                A blended skillset encompassing people operations and organizational analysis paired with modern programming languages, database architectures, and analytical workflows.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {brandingTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface border border-outline/30 text-xs font-semibold hover:border-secondary/40 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
