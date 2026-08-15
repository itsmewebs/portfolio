import React from "react";
import { prisma } from "@/lib/prisma";
import { ProjectTable } from "@/components/admin/ProjectTable";
import Link from "next/link";
import { PlusCircle, FolderKanban } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManageProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Systems Management</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Portfolio Projects Registry
          </h2>
          <p className="text-on-surface-variant text-xs md:text-sm mt-1">
            Create, modify, toggle featured hero spotlight, and manage live project entries.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="glow-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(160,120,255,0.3)]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Projects Table Component */}
      <ProjectTable projects={projects} />
    </div>
  );
}
