import React from "react";
import { prisma } from "@/lib/prisma";
import { ExperienceTable } from "@/components/admin/ExperienceTable";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Milestone Registry</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-on-surface">
          Career &amp; Academic Timeline
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1">
          Manage professional roles, university academic degrees, and certifications rendered on the public About page.
        </p>
      </div>

      <ExperienceTable initialExperiences={experiences} />
    </div>
  );
}
