"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProjectData } from "@/types";
import { deleteProject, toggleProjectFeatured } from "@/actions/projects";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  Sparkles,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";

interface ProjectTableProps {
  projects: ProjectData[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const [projectList, setProjectList] = useState<ProjectData[]>(projects);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      const res = await toggleProjectFeatured(id, !current);
      if (res.success) {
        setProjectList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p))
        );
        toast.success(
          !current ? "Project spotlighted on hero" : "Project removed from spotlight"
        );
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update spotlight status");
      }
    } catch {
      toast.error("Network error updating status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setLoadingId(id);
    try {
      const res = await deleteProject(id);
      if (res.success) {
        setProjectList((prev) => prev.filter((p) => p.id !== id));
        toast.success(`Project "${title}" deleted successfully.`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete project");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting project");
    } finally {
      setLoadingId(null);
    }
  };

  const categoryBadges: Record<string, { label: string; color: string }> = {
    WEB_DEV: { label: "Web Dev", color: "text-primary border-primary/30 bg-primary/10" },
    NETWORKING: { label: "Networking", color: "text-secondary border-secondary/30 bg-secondary/10" },
    CLOUD_DEVOPS: { label: "Cloud & DevOps", color: "text-tertiary border-tertiary/30 bg-tertiary/10" },
    CYBER_SEC: { label: "Security", color: "text-amber-500 border-amber-500/30 bg-amber-500/10" },
    DATA_SCIENCE: { label: "Data Science", color: "text-secondary border-secondary/30 bg-secondary/10" },
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-3xl border border-outline/25 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline/20 bg-surface-container-highest/40 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-4 px-6">Project Title &amp; Details</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Featured</th>
                <th className="py-4 px-4">Created Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-xs">
              {projectList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    No engineering projects found. Click &quot;New Project&quot; to create your first portfolio entry.
                  </td>
                </tr>
              ) : (
                projectList.map((project) => {
                  const cat = categoryBadges[project.category] || {
                    label: project.category,
                    color: "text-on-surface-variant border-outline/25 bg-surface-container",
                  };

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-surface-container-high/40 transition-colors group"
                    >
                      {/* Project Title with Thumbnail */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 border border-outline/25 shadow-sm">
                            <Image
                              src={project.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"}
                              alt={project.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-display font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                              {project.title}
                            </p>
                            <p className="text-[11px] text-on-surface-variant font-mono">
                              /{project.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cat.color}`}
                        >
                          {cat.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                            project.status === "PUBLISHED"
                              ? "text-secondary font-bold"
                              : "text-on-surface-variant"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              project.status === "PUBLISHED"
                                ? "bg-secondary shadow-[0_0_8px_rgba(2,132,199,0.6)]"
                                : "bg-on-surface-variant"
                            }`}
                          />
                          {project.status}
                        </span>
                      </td>

                      {/* Featured Spotlight Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(project.id, project.isFeatured)}
                          disabled={loadingId === project.id}
                          className={`p-2 rounded-xl border transition-all ${
                            project.isFeatured
                              ? "bg-primary/20 text-primary border-primary/40 shadow-[0_0_12px_rgba(109,40,217,0.25)]"
                              : "bg-surface-container/60 text-on-surface-variant border-outline/20 hover:border-primary/40 hover:text-on-surface"
                          }`}
                          title="Toggle Hero Spotlight"
                        >
                          {loadingId === project.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-on-surface-variant text-[11px] font-mono">
                        {formatDate(project.createdAt)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-colors"
                              title="Open Live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(project.id, project.title)}
                            disabled={loadingId === project.id}
                            className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/15 transition-colors"
                            title="Delete Project"
                          >
                            {loadingId === project.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
