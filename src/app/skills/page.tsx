import React from "react";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { SkillsFilterGrid } from "@/components/ui/SkillsFilterGrid";
import { JsonLd } from "@/components/ui/JsonLd";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skills Matrix & Technical Stack | Ali (alinets.com)",
  description:
    "Explore Ali's comprehensive technical skill matrix across Full-Stack Web Development, Cisco Computer Networks, Linux Administration, and Cloud DevOps.",
  alternates: {
    canonical: "https://alinets.com/skills",
  },
  openGraph: {
    title: "Skills Matrix & Technical Stack | Ali (alinets.com)",
    description:
      "Comprehensive proficiency matrix across Next.js 15, Cisco Routing & Switching, PostgreSQL, Linux, and Cloud Infrastructure.",
    url: "https://alinets.com/skills",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Skills & Tech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills Matrix & Technical Stack | Ali (alinets.com)",
    description: "Explore Ali's technical competencies across web development and computer networks.",
  },
};

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ isTopSkill: "desc" }, { order: "asc" }, { proficiency: "desc" }],
  });

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const skillsJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Ali Technical Skills & Capability Index",
    url: "https://alinets.com/skills",
    description: "Technical competencies across Full-Stack Web Engineering, Computer Networks, and Cloud Infrastructure.",
  };

  return (
    <>
      <JsonLd data={skillsJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Capability Index &amp; Proficiency Matrix</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Technical Stack &amp; Core Disciplines
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mt-4 leading-relaxed">
            A comprehensive overview of protocols, network appliances, programming languages, web frameworks, and DevOps tooling cultivated through academic ICT foundations and production implementations.
          </p>
        </div>

        {/* Interactive Skills Filter & Grid */}
        <div className="mt-8">
          <SkillsFilterGrid initialSkills={skills} />
        </div>
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
