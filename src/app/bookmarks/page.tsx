import React from "react";
import { prisma } from "@/lib/prisma";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { BookmarksClient } from "./BookmarksClient";
import { JsonLd } from "@/components/ui/JsonLd";
import { Bookmark, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved Reading List & Bookmarks | Ali (alinets.com)",
  description:
    "Your personalized reading list and saved technical case studies, HR tech workflows, and predictive data science publications by Ali.",
  alternates: {
    canonical: "https://alinets.com/bookmarks",
  },
  openGraph: {
    title: "Saved Reading List & Bookmarks | Ali (alinets.com)",
    description:
      "Access your saved engineering publications, HR automation case studies, and predictive ML systems.",
    url: "https://alinets.com/bookmarks",
    siteName: "Ali Portfolio (alinets.com)",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Saved Bookmarks" }],
  },
};

export default async function BookmarksPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const bookmarksJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ali Portfolio Reading List & Bookmarks",
    url: "https://alinets.com/bookmarks",
    description:
      "Personalized collection of saved research articles, HR systems case studies, and full-stack engineering documentation.",
  };

  return (
    <>
      <JsonLd data={bookmarksJsonLd} />
      <TopNavBar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-container-max mx-auto w-full relative z-10 space-y-10">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto py-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personalized Reading List</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Saved Bookmarks &amp; Research
          </h1>

          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
            Your collection of saved publications, corporate HR technology architectures, and machine learning case studies. Saved locally in your browser for instant access.
          </p>
        </div>

        {/* Bookmarks Client Container */}
        <BookmarksClient />
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
