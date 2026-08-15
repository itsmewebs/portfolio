"use client";

import React, { useState } from "react";
import { updateSiteSettings } from "@/actions/settings";
import { SiteSettingsData } from "@/types";
import { parseArray } from "@/lib/utils";
import { Save, CheckCircle2, AlertCircle, Loader2, Plus, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SettingsFormProps {
  settings: SiteSettingsData | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [siteTitle, setSiteTitle] = useState(
    settings?.siteTitle || "Ali - ICT Specialist | Web Developer & Network Infrastructure Architect"
  );
  const [heroGreeting, setHeroGreeting] = useState(settings?.heroGreeting || "Hi, I'm Ali,");
  const [heroTagline, setHeroTagline] = useState(
    settings?.heroTagline ||
      "ICT Specialist specializing in Full-Stack Web Development, Network Architecture & Cloud Systems."
  );
  const [heroDescription, setHeroDescription] = useState(
    settings?.heroDescription ||
      "With an academic degree in Information and Communications Technology (ICT), I engineer responsive full-stack web applications, scalable cloud infrastructure, and robust enterprise network topologies."
  );
  const [aboutText, setAboutText] = useState(
    settings?.aboutText ||
      "Holding a specialized degree in Information and Communications Technology (ICT), I focus on the intersection of modern Full-Stack Web Engineering, Computer Networks, and Infrastructure Systems. From architecting high-performance Next.js web applications to configuring enterprise routing protocols, firewalls, and cloud telemetry, I build secure, scalable digital ecosystems."
  );
  const [statusBadgeText, setStatusBadgeText] = useState(
    settings?.statusBadgeText || "ICT Specialist × Web Developer × Network Infrastructure Architect"
  );
  const [resumeLink, setResumeLink] = useState(settings?.resumeLink || "/resume.pdf");
  const [contactEmail, setContactEmail] = useState(settings?.contactEmail || "contact@alinets.com");
  const [githubUrl, setGithubUrl] = useState(settings?.githubUrl || "https://github.com/alinets");
  const [linkedinUrl, setLinkedinUrl] = useState(settings?.linkedinUrl || "https://linkedin.com/in/alinets");
  const [twitterUrl, setTwitterUrl] = useState(settings?.twitterUrl || "https://twitter.com/alinets");
  const [footerText, setFooterText] = useState(
    settings?.footerText || "Engineered with Next.js 15, Neon PostgreSQL, Prisma ORM & Zenith Design v7.0."
  );

  // Dynamic Branding Tags state
  const [tags, setTags] = useState<string[]>(
    parseArray(settings?.dynamicBrandingTags).length > 0
      ? parseArray(settings?.dynamicBrandingTags)
      : ["ICT Specialist", "Full-Stack Web Developer", "Network Systems Engineer", "Next.js 15 & React 19", "Cisco Routing & Switching", "PostgreSQL & Prisma"]
  );
  const [newTag, setNewTag] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData();
    formData.append("siteTitle", siteTitle);
    formData.append("heroGreeting", heroGreeting);
    formData.append("heroTagline", heroTagline);
    formData.append("heroDescription", heroDescription);
    formData.append("aboutText", aboutText);
    formData.append("statusBadgeText", statusBadgeText);
    formData.append("resumeLink", resumeLink);
    formData.append("contactEmail", contactEmail);
    formData.append("githubUrl", githubUrl);
    formData.append("linkedinUrl", linkedinUrl);
    formData.append("twitterUrl", twitterUrl);
    formData.append("footerText", footerText);
    formData.append("dynamicBrandingTags", JSON.stringify(tags));

    try {
      const res = await updateSiteSettings(formData);
      if (res.success) {
        setStatus("success");
        const msg = "Site narrative, branding tags, and configuration updated successfully!";
        setMessage(msg);
        toast.success("Settings Saved!", { description: msg });
      } else {
        setStatus("error");
        setMessage(res.error || "Failed to update site settings.");
        toast.error("Error Saving Settings", { description: res.error });
      }
    } catch {
      setStatus("error");
      const err = "An unexpected error occurred.";
      setMessage(err);
      toast.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {status === "success" && (
        <div className="p-4 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-xl bg-error/15 border border-error/30 text-error flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Hero Narrative Section */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-primary font-display font-bold text-base">
          <Sparkles className="w-4 h-4" />
          <h3>Hero Section Copy &amp; Narrative</h3>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Site Browser Title *
          </label>
          <input
            type="text"
            required
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Status Pill Badge Text
          </label>
          <input
            type="text"
            value={statusBadgeText}
            onChange={(e) => setStatusBadgeText(e.target.value)}
            placeholder="ICT Specialist × Web Developer × Network Infrastructure Architect"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Hero Greeting *
            </label>
            <input
              type="text"
              required
              value={heroGreeting}
              onChange={(e) => setHeroGreeting(e.target.value)}
              placeholder="Hi, I'm Ali,"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Hero Tagline (Animated Typewriter) *
            </label>
            <input
              type="text"
              required
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Hero Narrative Description *
          </label>
          <textarea
            required
            rows={3}
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 resize-none"
          />
        </div>
      </div>

      {/* Dynamic Branding Tags Manager */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
        <h3 className="text-secondary font-display font-bold text-base">
          Dynamic Branding Tags (Home Page Skills Carousel)
        </h3>
        <p className="text-xs text-on-surface-variant">
          Add authentic tags that appear dynamically on the home page showcase.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="glass-panel px-3 py-1.5 rounded-full text-xs font-semibold text-primary border border-primary/30 flex items-center gap-1.5 shadow-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-error transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add new tag e.g. 'Cisco Routing' and press Enter"
            className="flex-grow px-4 py-2 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-xs focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Tag
          </button>
        </div>
      </div>

      {/* About Background Section */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
        <h3 className="text-tertiary font-display font-bold text-base">
          About Page Narrative (ICT Background &amp; Specialization)
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            About Text *
          </label>
          <textarea
            required
            rows={5}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Resume Download / View Link
            </label>
            <input
              type="text"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              placeholder="/resume.pdf or Google Drive link"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Footer Text
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
            />
          </div>
        </div>
      </div>

      {/* Social & Contact Coordinates */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
        <h3 className="text-on-surface font-display font-bold text-base">
          Contact Coordinates &amp; Social Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@alinets.com"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              GitHub Profile URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Twitter / X URL
            </label>
            <input
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="glow-btn-primary px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Configurations...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish Site Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
