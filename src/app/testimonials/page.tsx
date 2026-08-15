import React from "react";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { PublicTestimonialForm } from "@/components/forms/PublicTestimonialForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { JsonLd } from "@/components/ui/JsonLd";
import Image from "next/image";
import {
  Quote,
  Star,
  Building2,
  User,
  Sparkles,
  Award,
  MessageSquareQuote,
  CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Colleague Endorsements & Recommendations | Ali (alinets.com)",
  description:
    "Read recommendations, peer reviews, and engineering feedback on Ali's technical rigor, Cisco network architectures, and full-stack software development.",
  alternates: {
    canonical: "https://alinets.com/testimonials",
  },
  openGraph: {
    title: "Colleague Endorsements & Recommendations | Ali (alinets.com)",
    description:
      "Peer reviews and collaborative feedback on Ali's full-stack web engineering and enterprise network infrastructure systems.",
    url: "https://alinets.com/testimonials",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Ali Testimonials" }],
  },
};

export default async function TestimonialsPage() {
  const [settings, approvedTestimonials] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const testimonialsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Endorsements and Recommendations for Ali",
    description:
      "Peer and leadership testimonials on Ali's full-stack software development, computer networks, and cloud systems.",
    url: "https://alinets.com/testimonials",
    publisher: {
      "@type": "Person",
      name: "Ali",
      url: "https://alinets.com",
    },
  };

  return (
    <>
      <JsonLd data={testimonialsJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10 space-y-16">
        {/* Header Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-widest px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-md">
            <Award className="w-3.5 h-3.5" />
            <span>Peer &amp; Leadership Endorsements</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.2]">
            What Collaborators Say
          </h1>

          <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
            Perspectives from senior network architects, lead software engineers, and faculty mentors who have partnered with Ali on enterprise networks, cloud telemetry, and full-stack web applications.
          </p>
        </section>

        {/* Testimonials Masonry / Card Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedTestimonials.map((t, idx) => (
            <ScrollReveal key={t.id} delay={idx * 0.08}>
              <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full border border-outline/25 hover:border-primary/40 transition-all duration-300 shadow-lg relative overflow-hidden">
                <div className="space-y-4">
                  {/* Top Rating & Quote Icon */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
                      <Quote className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1 bg-surface-container-high/80 border border-outline/30 px-2.5 py-1 rounded-full">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Body */}
                  <p className="text-on-surface text-sm leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Author Details Footer */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-4 mt-6 border-t border-outline/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center text-primary font-bold text-xs relative overflow-hidden">
                      {t.authorAvatar ? (
                        <Image
                          src={t.authorAvatar}
                          alt={t.authorName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span>{(t.authorName || "A")[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display text-xs font-bold text-on-surface">
                        {t.authorName}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant font-medium">
                        {t.authorTitle}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-semibold">
                    <Building2 className="w-3 h-3" />
                    <span>{t.authorCompany}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </section>

        {/* Interactive Submission Form Section */}
        <section className="pt-8 border-t border-outline/20">
          <ScrollReveal>
            <PublicTestimonialForm />
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
