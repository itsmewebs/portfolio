import React from "react";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { PrintButton } from "@/components/ui/PrintButton";
import { parseArray } from "@/lib/utils";
import {
  Mail,
  Globe,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Professional Resume & Executive CV | Ali (alinets.com)",
  description:
    "Curriculum Vitae of Ali: ICT Specialist, Full-Stack Web Developer, and Computer Network Infrastructure Architect.",
  alternates: {
    canonical: "https://alinets.com/resume",
  },
  openGraph: {
    title: "Professional Resume & Executive CV | Ali (alinets.com)",
    description: "Curriculum Vitae of Ali: ICT Specialist, Full-Stack Web Developer & Network Architect.",
    url: "https://alinets.com/resume",
    siteName: "Ali Portfolio (alinets.com)",
  },
};

export default async function ResumePage() {
  const [settings, experiences, skills, certificates, projects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.experience.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    prisma.skill.findMany({ orderBy: [{ isTopSkill: "desc" }, { order: "asc" }, { proficiency: "desc" }] }),
    prisma.certificate.findMany({ orderBy: [{ order: "asc" }] }),
    prisma.project.findMany({ where: { status: "PUBLISHED", isFeatured: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <div className="print-hide">
        <TopNavBar />
      </div>

      <main className="flex-grow pt-28 pb-20 px-6 max-w-4xl mx-auto w-full relative z-10 print:pt-0 print:pb-0 print:px-0">
        {/* Action Header (Hidden in Print) */}
        <div className="print-hide flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-surface-container border border-outline/25 p-6 rounded-3xl backdrop-blur-xl shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Verified Executive Curriculum Vitae</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
              Ali — Professional Resume
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Auto-synchronized with database records. Ready for print and PDF export.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PrintButton />
          </div>
        </div>

        {/* PRINTABLE RESUME DOCUMENT CONTAINER */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-outline/25 shadow-2xl space-y-10 print:border-none print:shadow-none print:p-0 print:bg-white">
          {/* Header & Contact Information */}
          <header className="border-b border-outline/20 pb-8 print:border-gray-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-on-surface print:text-black tracking-tight">
                  Ali
                </h1>
                <p className="text-sm sm:text-base font-semibold text-primary print:text-purple-700 mt-1">
                  ICT Specialist &times; Web Developer &times; Network Infrastructure Architect
                </p>
              </div>

              <div className="space-y-1 text-xs font-mono text-on-surface-variant print:text-gray-600 sm:text-right">
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-secondary print:text-black" />
                  <span>{settings?.contactEmail || "contact@alinets.com"}</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary print:text-black" />
                  <span>alinets.com</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-tertiary print:text-black" />
                  <span>Kuwait</span>
                </p>
              </div>
            </div>

            {/* Executive Summary */}
            <p className="text-xs sm:text-sm text-on-surface-variant print:text-gray-700 leading-relaxed mt-6">
              {settings?.aboutText ||
                "Academic graduate in Information and Communications Technology (ICT) specializing in enterprise Computer Networks, Cisco Routing & Switching, and Full-Stack Web Development. Engineering resilient network topologies, cloud microservices, and modern Next.js web applications."}
            </p>
          </header>

          {/* Professional Experience & Milestones */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-outline/20 pb-2 print:border-gray-300">
              <Briefcase className="w-4 h-4 text-secondary print:text-black" />
              <h2 className="font-display text-lg font-bold text-on-surface print:text-black uppercase tracking-wider">
                Career &amp; Professional Experience
              </h2>
            </div>

            <div className="space-y-6">
              {experiences.map((exp) => {
                const skillsList = parseArray<string>(exp.skills);
                return (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                      <h3 className="font-display font-bold text-sm sm:text-base text-on-surface print:text-black">
                        {exp.title}
                      </h3>
                      <span className="text-xs font-mono text-secondary print:text-gray-600 font-semibold">
                        {exp.period}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-primary print:text-purple-700">
                      {exp.organization} {exp.location ? `• ${exp.location}` : ""}
                    </div>

                    <p className="text-xs text-on-surface-variant print:text-gray-700 leading-relaxed">
                      {exp.description}
                    </p>

                    {skillsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skillsList.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-high border border-outline/30 text-on-surface-variant print:bg-gray-100 print:text-gray-800 print:border-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Education & Academic Background */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-outline/20 pb-2 print:border-gray-300">
              <GraduationCap className="w-4 h-4 text-primary print:text-black" />
              <h2 className="font-display text-lg font-bold text-on-surface print:text-black uppercase tracking-wider">
                Academic Qualifications
              </h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-sm sm:text-base text-on-surface print:text-black">
                  Bachelor of Information &amp; Communications Technology (ICT)
                </h3>
                <span className="text-xs font-mono text-secondary print:text-gray-600 font-semibold">
                  Graduated
                </span>
              </div>
              <p className="text-xs text-on-surface-variant print:text-gray-700 leading-relaxed">
                Core curriculum: Relational Database Systems, Network Architecture, Software Engineering, Systems Analysis &amp; Design, Information Security.
              </p>
            </div>
          </section>

          {/* Professional Certifications */}
          {certificates.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-outline/20 pb-2 print:border-gray-300">
                <Award className="w-4 h-4 text-tertiary print:text-black" />
                <h2 className="font-display text-lg font-bold text-on-surface print:text-black uppercase tracking-wider">
                  Verified Industry Certifications
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-2xl bg-surface-container border border-outline/25 print:bg-transparent print:border-gray-300 space-y-1"
                  >
                    <h4 className="font-display font-bold text-xs sm:text-sm text-on-surface print:text-black">
                      {cert.title}
                    </h4>
                    <p className="text-[11px] text-primary print:text-purple-700 font-semibold">
                      {cert.issuer} &bull; Issued {cert.issueDate}
                    </p>
                    {cert.credentialId && (
                      <p className="text-[10px] font-mono text-on-surface-variant print:text-gray-600">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Engineering Projects Spotlight */}
          {projects.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-outline/20 pb-2 print:border-gray-300">
                <Code2 className="w-4 h-4 text-secondary print:text-black" />
                <h2 className="font-display text-lg font-bold text-on-surface print:text-black uppercase tracking-wider">
                  Key Engineered Systems &amp; Case Studies
                </h2>
              </div>

              <div className="space-y-4">
                {projects.map((proj) => {
                  const techList = parseArray<string>(proj.techStack);
                  return (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-on-surface print:text-black">
                          {proj.title}
                        </h4>
                        <span className="text-[11px] font-mono text-secondary print:text-gray-600">
                          {proj.role || "Lead Architect"}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant print:text-gray-700 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1 text-[10px] font-mono text-primary print:text-purple-700">
                        {techList.slice(0, 5).join(" • ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Core Technical & Organizational Skills Matrix */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-outline/20 pb-2 print:border-gray-300">
              <CheckCircle2 className="w-4 h-4 text-primary print:text-black" />
              <h2 className="font-display text-lg font-bold text-on-surface print:text-black uppercase tracking-wider">
                Technical Mastery &amp; Skill Competencies
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-surface-container border border-outline/25 text-xs print:bg-transparent print:border-none"
                >
                  <span className="font-medium text-on-surface print:text-black">{skill.name}</span>
                  <span className="font-mono text-[10px] text-secondary print:text-gray-600 font-bold">
                    {skill.proficiency}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <div className="print-hide">
        <Footer
          githubUrl={settings?.githubUrl}
          linkedinUrl={settings?.linkedinUrl}
          twitterUrl={settings?.twitterUrl}
          contactEmail={settings?.contactEmail}
          footerText={settings?.footerText}
        />
      </div>
    </>
  );
}
