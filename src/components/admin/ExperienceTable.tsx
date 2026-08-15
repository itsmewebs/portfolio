"use client";

import React, { useState } from "react";
import { ExperienceData } from "@/types";
import { createExperience, updateExperience, deleteExperience } from "@/actions/experience";
import { parseArray } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Edit2,
  Briefcase,
  GraduationCap,
  Award,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface ExperienceTableProps {
  initialExperiences: ExperienceData[];
}

export function ExperienceTable({ initialExperiences }: ExperienceTableProps) {
  const [experiences, setExperiences] = useState<ExperienceData[]>(initialExperiences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const types = [
    { value: "CAREER", label: "Career & Roles", icon: Briefcase },
    { value: "ACADEMIC", label: "Academic Degree", icon: GraduationCap },
    { value: "CERTIFICATION", label: "Certifications", icon: Award },
  ];

  const handleOpenAdd = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: ExperienceData) => {
    setEditingExperience(exp);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete milestone "${title}"?`)) return;
    try {
      const res = await deleteExperience(id);
      if (res.success) {
        setExperiences((prev) => prev.filter((e) => e.id !== id));
        toast.success(`Milestone "${title}" deleted.`);
      } else {
        toast.error("Failed to delete milestone.");
      }
    } catch {
      toast.error("Network error deleting milestone.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (editingExperience) {
        const res = await updateExperience(editingExperience.id, formData);
        if (res.success && res.experience) {
          setExperiences((prev) =>
            prev.map((e) =>
              e.id === editingExperience.id ? (res.experience as unknown as ExperienceData) : e
            )
          );
          toast.success("Milestone updated successfully!");
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update milestone.");
        }
      } else {
        const res = await createExperience(formData);
        if (res.success && res.experience) {
          setExperiences((prev) => [res.experience as unknown as ExperienceData, ...prev]);
          toast.success("Milestone created successfully!");
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create milestone.");
        }
      }
    } catch {
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered =
    typeFilter === "ALL"
      ? experiences
      : experiences.filter((e) => e.type === typeFilter);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container/60 p-4 rounded-2xl border border-outline/20">
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-surface-container-high text-on-surface text-xs font-semibold px-3 py-2 rounded-xl border border-outline/25 focus:outline-none focus:border-secondary"
          >
            <option value="ALL">All Milestones ({experiences.length})</option>
            {types.map((t) => (
              <option key={t.value} value={t.value} className="bg-surface text-on-surface">
                {t.label} ({experiences.filter((e) => e.type === t.value).length})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="glow-btn-primary px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Experience Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-outline/25 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container-high/80 text-on-surface-variant uppercase font-mono tracking-wider border-b border-outline/20">
            <tr>
              <th className="p-4">Title &amp; Position</th>
              <th className="p-4">Organization</th>
              <th className="p-4">Period</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/10">
            {filtered.map((exp) => (
              <tr key={exp.id} className="hover:bg-surface-container-high/40 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-on-surface">{exp.title}</p>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 max-w-sm">
                    {exp.description}
                  </p>
                </td>
                <td className="p-4 text-on-surface-variant font-semibold">
                  {exp.organization}
                  {exp.location && <span className="text-[11px] block text-on-surface-variant/60">{exp.location}</span>}
                </td>
                <td className="p-4 font-mono text-secondary font-bold">
                  {exp.period}
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container border border-outline/25 text-on-surface-variant">
                    {exp.type}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id, exp.title)}
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

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-8 border border-primary/20 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-on-surface">
                {editingExperience ? "Edit Milestone" : "Add Journey Milestone"}
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
                  Milestone Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingExperience?.title || ""}
                  placeholder="e.g. Senior Network & Systems Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Organization *
                  </label>
                  <input
                    type="text"
                    name="organization"
                    required
                    defaultValue={editingExperience?.organization || ""}
                    placeholder="e.g. Enterprise Network Solutions"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={editingExperience?.location || "Kuwait"}
                    placeholder="e.g. Kuwait"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Period (e.g. 2023 - Present) *
                  </label>
                  <input
                    type="text"
                    name="period"
                    required
                    defaultValue={editingExperience?.period || ""}
                    placeholder="e.g. 2023 - Present"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Type *
                  </label>
                  <select
                    name="type"
                    defaultValue={editingExperience?.type || "CAREER"}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  >
                    {types.map((t) => (
                      <option key={t.value} value={t.value} className="bg-surface text-on-surface">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={editingExperience?.description || ""}
                  placeholder="Describe your responsibilities, key achievements, and methodologies..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Applied Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  defaultValue={
                    editingExperience?.skills ? parseArray(editingExperience.skills).join(", ") : ""
                  }
                  placeholder="e.g. HR Operations, Workforce Analytics, Next.js"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
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
                  <span>{editingExperience ? "Save Changes" : "Create Milestone"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
