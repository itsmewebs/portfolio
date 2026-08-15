"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/actions/projects";
import { slugify, parseArray } from "@/lib/utils";
import { ProjectData } from "@/types";
import {
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

interface ProjectFormProps {
  initialData?: ProjectData;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [longDescription, setLongDescription] = useState(
    initialData?.longDescription || ""
  );
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  );
  const [galleryImagesInput, setGalleryImagesInput] = useState(
    initialData?.galleryImages
      ? parseArray<string>(initialData.galleryImages).join("\n")
      : ""
  );
  const [techStackInput, setTechStackInput] = useState(
    initialData
      ? parseArray(initialData.techStack).join(", ")
      : "Next.js, TypeScript, PostgreSQL, Prisma"
  );
  const [featuresInput, setFeaturesInput] = useState(
    initialData?.features
      ? parseArray<string>(initialData.features).join("\n")
      : ""
  );
  const [architecture, setArchitecture] = useState(
    initialData?.architecture || ""
  );
  const [liveLink, setLiveLink] = useState(initialData?.liveLink || "");
  const [githubLink, setGithubLink] = useState(initialData?.githubLink || "");
  const [category, setCategory] = useState(initialData?.category || "WEB_DEV");
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [order, setOrder] = useState(initialData?.order?.toString() || "0");

  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEdit || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("longDescription", longDescription);
    formData.append("imageUrl", imageUrl);
    formData.append("galleryImages", galleryImagesInput);
    formData.append("techStack", techStackInput);
    formData.append("features", featuresInput);
    formData.append("architecture", architecture);
    formData.append("liveLink", liveLink);
    formData.append("githubLink", githubLink);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("isFeatured", isFeatured ? "true" : "false");
    formData.append("order", order);

    try {
      const res =
        isEdit && initialData?.id
          ? await updateProject(initialData.id, formData)
          : await createProject(formData);

      if (res.success) {
        toast.success(isEdit ? "Project updated successfully!" : "Project published successfully!");
        router.push("/admin/projects");
        router.refresh();
      } else {
        setFormStatus("error");
        setErrorMessage(res.error || "Failed to save project.");
        toast.error("Error saving project", { description: res.error });
      }
    } catch {
      setFormStatus("error");
      const err = "An unexpected server error occurred.";
      setErrorMessage(err);
      toast.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline/20 pb-6">
        <div>
          <Link
            href="/admin/projects"
            className="text-xs font-semibold text-on-surface-variant hover:text-primary flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Project List
          </Link>
          <h2 className="font-display text-2xl font-bold text-on-surface">
            {isEdit ? `Edit Project: ${initialData?.title}` : "Architect New Project"}
          </h2>
        </div>

        <button
          type="submit"
          disabled={formStatus === "loading"}
          className="glow-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {formStatus === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEdit ? "Update Project" : "Publish Project"}</span>
            </>
          )}
        </button>
      </div>

      {formStatus === "error" && (
        <div className="p-4 rounded-xl bg-error/15 border border-error/30 text-error flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-primary">
              Core Metadata
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Cisco Enterprise Multi-VLAN Routing"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="cisco-enterprise-multi-vlan-routing"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Summary Description (Short) *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short elevator pitch for project cards and previews..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Comprehensive Narrative (Project Detail Page)
              </label>
              <textarea
                rows={6}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="In-depth breakdown of business objectives, engineering obstacles, and quantitative results..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Technologies &amp; Libraries (Comma-separated) *
              </label>
              <input
                type="text"
                required
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="e.g. Next.js, Python, Scikit-Learn, PostgreSQL, Prisma"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
              />
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-secondary">
              Features &amp; Technical Architecture
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Key Features (One per line)
              </label>
              <textarea
                rows={4}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Predictive Flight-Risk ML Algorithm&#10;Real-Time Retention Matrix&#10;Automated PDF Executive Export"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                System Architecture Summary
              </label>
              <input
                type="text"
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value)}
                placeholder="e.g. Next.js 15 Server Actions, FastAPI Python ML worker, Neon PostgreSQL via Prisma."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-secondary">
              Deployment &amp; Repository URLs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Live System URL
                </label>
                <input
                  type="url"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  placeholder="https://alinets.com/demo"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  placeholder="https://github.com/alinets/repo"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Category, Status, Image Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-tertiary">
              Classification
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
              >
                <option value="WEB_DEV" className="bg-surface text-on-surface">Full-Stack Web (WEB_DEV)</option>
                <option value="NETWORKING" className="bg-surface text-on-surface">Network Architecture (NETWORKING)</option>
                <option value="CLOUD_DEVOPS" className="bg-surface text-on-surface">Cloud & DevOps (CLOUD_DEVOPS)</option>
                <option value="CYBER_SEC" className="bg-surface text-on-surface">Network Security (CYBER_SEC)</option>
                <option value="DATA_SCIENCE" className="bg-surface text-on-surface">Data & Telemetry (DATA_SCIENCE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
              >
                <option value="PUBLISHED" className="bg-surface text-on-surface">Published (Visible)</option>
                <option value="DRAFT" className="bg-surface text-on-surface">Draft (Hidden)</option>
                <option value="ARCHIVED" className="bg-surface text-on-surface">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Sort Priority / Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl bg-surface-container/60 border border-outline/20 hover:border-primary/40 transition-colors shadow-sm">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-primary rounded bg-surface-container border-outline/30 focus:ring-primary"
                />
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Feature on Home Hero Spotlight
                </span>
              </label>
            </div>
          </div>

          {/* Image URL & Preview */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-on-surface flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-secondary" /> Cover Image
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Image URL *
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
              />
            </div>

            {imageUrl && (
              <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-outline/25 bg-surface-container-highest shadow-sm">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Screenshot Gallery URLs */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-on-surface flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" /> Screenshot Gallery
            </h3>
            <p className="text-xs text-on-surface-variant">
              Add multiple screenshot URLs (one per line) for the interactive full-screen Lightbox gallery on the project detail page.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Gallery Image URLs (One per line)
              </label>
              <textarea
                rows={4}
                value={galleryImagesInput}
                onChange={(e) => setGalleryImagesInput(e.target.value)}
                placeholder="/projects/screen1.png&#10;/projects/screen2.png&#10;https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
