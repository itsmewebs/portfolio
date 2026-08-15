"use client";

import React, { useState } from "react";
import { SkillData } from "@/types";
import { SkillBar } from "@/components/ui/SkillBar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layout,
  Server,
  BrainCircuit,
  Box,
  Layers,
  Terminal,
} from "lucide-react";

interface SkillsFilterGridProps {
  initialSkills: SkillData[];
}

export function SkillsFilterGrid({ initialSkills }: SkillsFilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    { id: "ALL", label: "All Capabilities", icon: Layers },
    { id: "NETWORKING", label: "Computer Networks & Cisco", icon: Server },
    { id: "FRONTEND", label: "Frontend & UI/UX", icon: Layout },
    { id: "BACKEND", label: "Backend & Systems", icon: Box },
    { id: "TOOLS_DEVOPS", label: "Linux & DevOps", icon: Terminal },
    { id: "DATA_AI", label: "Data & Telemetry", icon: BrainCircuit },
  ];

  const filteredSkills =
    selectedCategory === "ALL"
      ? initialSkills
      : initialSkills.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-12">
      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                isSelected
                  ? "bg-primary text-on-primary shadow-md scale-105"
                  : "glass-panel text-on-surface-variant hover:text-on-surface hover:border-primary/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? "bg-black/20 text-white" : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {cat.id === "ALL"
                  ? initialSkills.length
                  : initialSkills.filter((s) => s.category === cat.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Animated Skill Bars */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, idx) => (
            <motion.div
              layout
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
            >
              <SkillBar skill={skill} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Core Specialization Focus Banner */}
      <div className="glass-panel rounded-3xl p-8 md:p-10 border border-primary/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3 text-secondary">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-display text-xl font-bold text-on-surface">
            Integrated ICT Engineering Competency
          </h3>
        </div>
        <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed max-w-3xl">
          By combining formal academic foundations in Information and Communications Technology (ICT) with hands-on Cisco routing, switching, Linux administration, and modern Next.js full-stack software development, I architect robust digital ecosystems from the physical packet layer to the interactive user interface.
        </p>
      </div>
    </div>
  );
}
