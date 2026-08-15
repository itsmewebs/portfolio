import React from "react";
import { prisma } from "@/lib/prisma";
import { SkillsTable } from "@/components/admin/SkillsTable";
import { Code2, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ isTopSkill: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
          <Code2 className="w-3.5 h-3.5" />
          <span>Technical Capability Engine</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-on-surface">
          Skills &amp; Competencies Registry
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1">
          Manage technical proficiencies, categories, experience levels, and featured top skill badges.
        </p>
      </div>

      <SkillsTable initialSkills={skills} />
    </div>
  );
}
