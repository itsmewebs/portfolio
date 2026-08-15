"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProjectData } from "@/types";
import { parseArray } from "@/lib/utils";
import { ExternalLink, Github, Sparkles, ArrowRight } from "lucide-react";
import { BookmarkButton } from "@/components/ui/BookmarkButton";

interface ProjectCardProps {
  project: ProjectData | {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    techStack: string;
    liveLink?: string | null;
    githubLink?: string | null;
    isFeatured: boolean;
    category: string;
    metrics?: string | null;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const techList = parseArray(project.techStack);
  const metricsList = parseArray<{ label: string; value: string }>(project.metrics);

  const categoryLabels: Record<string, { label: string; color: string }> = {
    WEB_DEV: { label: "Full-Stack Web", color: "text-primary border-primary/30 bg-primary/10" },
    NETWORKING: { label: "Network Architecture", color: "text-secondary border-secondary/30 bg-secondary/10" },
    CLOUD_DEVOPS: { label: "Cloud & DevOps", color: "text-tertiary border-tertiary/30 bg-tertiary/10" },
    CYBER_SEC: { label: "Network Security", color: "text-amber-500 border-amber-500/30 bg-amber-500/10" },
    DATA_SCIENCE: { label: "Data & Telemetry", color: "text-secondary border-secondary/30 bg-secondary/10" },
  };

  const catMeta = categoryLabels[project.category] || {
    label: project.category,
    color: "text-on-surface-variant border-outline/30 bg-surface-container",
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-full group hover:border-primary/40 transition-all duration-300">
      {/* Project Image Container */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative h-56 w-full overflow-hidden bg-surface-container-high block"
      >
        <Image
          src={
            project.imageUrl ||
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          }
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent group-hover:opacity-60 transition-opacity" />

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 pointer-events-none">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${catMeta.color}`}
            >
              {catMeta.label}
            </span>
            {project.isFeatured && (
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          <BookmarkButton
            id={project.id}
            slug={project.slug}
            type="project"
            title={project.title}
          />
        </div>

        {/* Highlight Metrics overlay if available */}
        {metricsList.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 pointer-events-none z-10">
            {metricsList.slice(0, 2).map((m, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-surface-container/90 border border-outline/30 backdrop-blur-md flex items-center gap-1.5 text-[10px]"
              >
                <span className="text-secondary font-mono font-bold">{m.value}</span>
                <span className="text-on-surface-variant">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2.5">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
              {project.title}
            </h3>
          </Link>
          <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed line-clamp-3 font-normal">
            {project.description}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-1.5">
            {techList.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-secondary bg-secondary/10 border border-secondary/25 px-2.5 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
            {techList.length > 4 && (
              <span className="text-[11px] font-medium text-on-surface-variant bg-surface-container-high border border-outline/30 px-2 py-0.5 rounded-full">
                +{techList.length - 4}
              </span>
            )}
          </div>

          {/* Action Links & Detail Trigger */}
          <div className="flex items-center justify-between pt-3 border-t border-outline/20 text-xs font-semibold">
            <Link
              href={`/projects/${project.slug}`}
              className="text-primary hover:text-secondary flex items-center gap-1 transition-colors"
            >
              <span>Deep Dive</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-3">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  title="Live Application"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Source Code"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
