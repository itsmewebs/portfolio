"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  BrainCircuit,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Server,
  Layout,
  FileCode,
  Palette,
  BarChart3,
  TrendingUp,
  Cpu,
  Binary,
  LineChart,
  UserCheck,
  Award,
  GitBranch,
  Box,
  Globe,
  Star,
} from "lucide-react";
import { SkillData } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Database,
  BrainCircuit,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Server,
  Layout,
  FileCode,
  Palette,
  BarChart3,
  TrendingUp,
  Cpu,
  Binary,
  LineChart,
  UserCheck,
  Award,
  GitBranch,
  Box,
  Globe,
};

interface SkillBarProps {
  skill: SkillData | {
    id: string;
    name: string;
    category: string;
    proficiency: number;
    icon?: string | null;
    yearsOfExp?: string | null;
    isTopSkill: boolean;
  };
  delay?: number;
}

export function SkillBar({ skill, delay = 0 }: SkillBarProps) {
  const IconComponent = (skill.icon && iconMap[skill.icon]) || Sparkles;

  const categoryColors: Record<string, { bar: string; glow: string; text: string; bg: string }> = {
    FRONTEND: {
      bar: "from-primary via-primary-container to-secondary",
      glow: "shadow-[0_0_12px_rgba(124,58,237,0.35)]",
      text: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    BACKEND: {
      bar: "from-secondary via-secondary-container to-primary",
      glow: "shadow-[0_0_12px_rgba(2,132,199,0.35)]",
      text: "text-secondary",
      bg: "bg-secondary/10 border-secondary/20",
    },
    DATA_AI: {
      bar: "from-secondary via-primary to-tertiary",
      glow: "shadow-[0_0_12px_rgba(14,165,233,0.35)]",
      text: "text-secondary",
      bg: "bg-secondary/10 border-secondary/20",
    },
    NETWORKING: {
      bar: "from-secondary via-secondary-container to-tertiary",
      glow: "shadow-[0_0_12px_rgba(2,132,199,0.35)]",
      text: "text-secondary",
      bg: "bg-secondary/10 border-secondary/20",
    },
    TOOLS_DEVOPS: {
      bar: "from-primary via-secondary to-primary-container",
      glow: "shadow-[0_0_12px_rgba(109,40,217,0.35)]",
      text: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
  };

  const scheme = categoryColors[skill.category] || categoryColors.FRONTEND;

  return (
    <div className="glass-panel p-4 rounded-2xl border border-outline/25 hover:border-primary/40 transition-all group">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl ${scheme.bg} border flex items-center justify-center flex-shrink-0 ${scheme.text} group-hover:scale-110 transition-transform`}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors truncate">
                {skill.name}
              </span>
              {skill.isTopSkill && (
                <span title="Core Specialization" className="text-secondary flex-shrink-0">
                  <Star className="w-3 h-3 fill-secondary" />
                </span>
              )}
            </div>
            {skill.yearsOfExp && (
              <span className="text-[10px] font-mono text-on-surface-variant">
                {skill.yearsOfExp} experience
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-mono text-xs font-bold text-on-surface">
            {skill.proficiency}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden p-0.5 border border-outline/20">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full bg-gradient-to-r ${scheme.bar} rounded-full ${scheme.glow}`}
        />
      </div>
    </div>
  );
}
