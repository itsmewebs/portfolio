import React from "react";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { Mail, Github, Linkedin, Twitter, Sparkles, MapPin, Building2, Globe } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Consultation Inquiries | Ali (alinets.com)",
  description:
    "Get in touch with Ali for full-stack web development inquiries, Cisco network architecture consulting, cloud systems, and technical collaborations.",
  alternates: {
    canonical: "https://alinets.com/contact",
  },
  openGraph: {
    title: "Contact & Consultation Inquiries | Ali (alinets.com)",
    description: "Get in touch with Ali for web development, Cisco networking, and cloud systems inquiries.",
    url: "https://alinets.com/contact",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Contact" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Consultation Inquiries | Ali (alinets.com)",
    description: "Get in touch with Ali on alinets.com.",
  },
};

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Ali",
    url: "https://alinets.com/contact",
    description:
      "Initiate conversation for computer networks architecture, Next.js full-stack development, and cloud infrastructure systems.",
    mainEntity: {
      "@type": "Person",
      name: "Ali",
      email: settings?.contactEmail || "contact@alinets.com",
      url: "https://alinets.com",
    },
  };

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Transmission Channel</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Initiate Contact
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mt-4 leading-relaxed">
            Whether you are exploring a web development collaboration, Cisco network infrastructure consultation, or technical architecture advisory, I welcome your inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto mt-8">
          {/* Left Column: Coordinates & Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-8 border border-outline/25 space-y-6 shadow-xl">
              <h2 className="font-display text-xl font-bold text-on-surface">
                Professional Details
              </h2>

              <div className="space-y-4 text-xs md:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Specialization</p>
                    <p className="text-on-surface-variant text-xs">Web Development &amp; Network Engineering</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Electronic Mail</p>
                    <a
                      href={`mailto:${settings?.contactEmail || "contact@alinets.com"}`}
                      className="text-secondary hover:underline text-xs font-mono"
                    >
                      {settings?.contactEmail || "contact@alinets.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary flex-shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Domain &amp; Platform</p>
                    <p className="text-on-surface-variant text-xs font-mono">alinets.com</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-outline/20 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Network &amp; Code Links
                </p>
                <div className="flex gap-2.5">
                  {settings?.githubUrl && (
                    <a
                      href={settings.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl glass-panel text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {settings?.linkedinUrl && (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl glass-panel text-on-surface-variant hover:text-secondary hover:border-secondary/40 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {settings?.twitterUrl && (
                    <a
                      href={settings.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl glass-panel text-on-surface-variant hover:text-tertiary hover:border-tertiary/40 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick response badge */}
            <div className="p-5 rounded-2xl bg-surface-container border border-outline/20 text-xs text-on-surface-variant flex items-center gap-3 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse flex-shrink-0" />
              <span>
                Form submissions are dispatched in real-time to the executive admin center.
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Transmission Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
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
