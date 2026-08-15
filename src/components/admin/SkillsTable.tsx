"use client";

import React, { useState } from "react";
import { SkillData } from "@/types";
import { createSkill, updateSkill, deleteSkill, toggleSkillTop } from "@/actions/skills";
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Sparkles,
  Loader2,
  X,
  Code2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface SkillsTableProps {
  initialSkills: SkillData[];
}

export function SkillsTable({ initialSkills }: SkillsTableProps) {
  const [skills, setSkills] = useState<SkillData[]>(initialSkills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const categories = [
    { value: "NETWORKING", label: "Computer Networks & Cisco" },
    { value: "FRONTEND", label: "Frontend & UI/UX" },
    { value: "BACKEND", label: "Backend & Systems" },
    { value: "TOOLS_DEVOPS", label: "Linux & DevOps" },
    { value: "DATA_AI", label: "Data & Telemetry" },
  ];

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: SkillData) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete skill "${name}"?`)) return;
    try {
      const res = await deleteSkill(id);
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        toast.success(`Skill "${name}" deleted.`);
      } else {
        toast.error("Failed to delete skill.");
      }
    } catch {
      toast.error("Network error deleting skill.");
    }
  };

  const handleToggleTop = async (id: string, current: boolean) => {
    try {
      const res = await toggleSkillTop(id, !current);
      if (res.success) {
        setSkills((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isTopSkill: !current } : s))
        );
        toast.success(!current ? "Marked as Core Specialization" : "Removed from Top Skills");
      }
    } catch {
      toast.error("Failed to toggle top status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (editingSkill) {
        const res = await updateSkill(editingSkill.id, formData);
        if (res.success && res.skill) {
          setSkills((prev) =>
            prev.map((s) => (s.id === editingSkill.id ? (res.skill as unknown as SkillData) : s))
          );
          toast.success("Skill updated successfully!");
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update skill.");
        }
      } else {
        const res = await createSkill(formData);
        if (res.success && res.skill) {
          setSkills((prev) => [res.skill as unknown as SkillData, ...prev]);
          toast.success("New skill created successfully!");
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create skill.");
        }
      }
    } catch {
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered =
    categoryFilter === "ALL"
      ? skills
      : skills.filter((s) => s.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container/60 p-4 rounded-2xl border border-outline/20">
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface-container-high text-on-surface text-xs font-semibold px-3 py-2 rounded-xl border border-outline/25 focus:outline-none focus:border-secondary"
          >
            <option value="ALL">All Categories ({skills.length})</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value} className="bg-surface text-on-surface">
                {c.label} ({skills.filter((s) => s.category === c.value).length})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="glow-btn-primary px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-outline/25 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container-high/80 text-on-surface-variant uppercase font-mono tracking-wider border-b border-outline/20">
            <tr>
              <th className="p-4">Skill Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Proficiency</th>
              <th className="p-4">Experience</th>
              <th className="p-4 text-center">Core Focus</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/10">
            {filtered.map((skill) => (
              <tr key={skill.id} className="hover:bg-surface-container-high/40 transition-colors">
                <td className="p-4 font-bold text-on-surface flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span>{skill.name}</span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container border border-outline/25 text-on-surface-variant">
                    {skill.category}
                  </span>
                </td>
                <td className="p-4 w-48">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        style={{ width: `${skill.proficiency}%` }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-on-surface">
                      {skill.proficiency}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-on-surface-variant font-mono">
                  {skill.yearsOfExp || "-"}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleToggleTop(skill.id, skill.isTopSkill)}
                    className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                    title="Toggle Core Specialization"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        skill.isTopSkill
                          ? "fill-secondary text-secondary"
                          : "text-on-surface-variant/40"
                      }`}
                    />
                  </button>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id, skill.name)}
                    className="p-2 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/15 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create / Edit Skill */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-8 border border-primary/20 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-on-surface">
                {editingSkill ? "Edit Skill" : "Add Technical Skill"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Skill Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingSkill?.name || ""}
                  placeholder="e.g. Next.js 15, Python NLP"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    defaultValue={editingSkill?.category || "FRONTEND"}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value} className="bg-surface text-on-surface">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Proficiency (1-100)%
                  </label>
                  <input
                    type="number"
                    name="proficiency"
                    min="1"
                    max="100"
                    defaultValue={editingSkill?.proficiency || 85}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm font-mono focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    name="yearsOfExp"
                    defaultValue={editingSkill?.yearsOfExp || "3+ yrs"}
                    placeholder="e.g. 3+ yrs / Active"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    name="icon"
                    defaultValue={editingSkill?.icon || "Code2"}
                    placeholder="e.g. Code2, Database"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isTopSkill"
                  name="isTopSkill"
                  defaultChecked={editingSkill?.isTopSkill || false}
                  className="w-4 h-4 rounded text-primary focus:ring-primary/50"
                />
                <label
                  htmlFor="isTopSkill"
                  className="text-xs font-bold uppercase tracking-wider text-on-surface cursor-pointer flex items-center gap-1"
                >
                  <span>Featured Core Specialization</span>
                  <Star className="w-3 h-3 text-secondary fill-secondary" />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glow-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{editingSkill ? "Save Changes" : "Create Skill"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
