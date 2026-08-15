"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TestimonialData } from "@/types";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialFeatured,
} from "@/actions/testimonials";
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Quote,
  Loader2,
  X,
  Check,
  Building2,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface TestimonialTableProps {
  initialTestimonials: TestimonialData[];
}

export function TestimonialTable({ initialTestimonials }: TestimonialTableProps) {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TestimonialData) => {
    setEditingTestimonial(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      const res = await deleteTestimonial(id);
      if (res.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        toast.success(`Testimonial from "${name}" deleted.`);
      } else {
        toast.error("Failed to delete testimonial.");
      }
    } catch {
      toast.error("Network error deleting testimonial.");
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await toggleTestimonialFeatured(id, !current);
      if (res.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isFeatured: !current } : t))
        );
        toast.success(!current ? "Marked as Featured Testimonial" : "Removed from Featured");
      }
    } catch {
      toast.error("Failed to toggle featured status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (editingTestimonial) {
        const res = await updateTestimonial(editingTestimonial.id, formData);
        if (res.success && res.testimonial) {
          setTestimonials((prev) =>
            prev.map((t) =>
              t.id === editingTestimonial.id
                ? (res.testimonial as unknown as TestimonialData)
                : t
            )
          );
          toast.success("Testimonial updated successfully!");
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update testimonial.");
        }
      } else {
        const res = await createTestimonial(formData);
        if (res.success && res.testimonial) {
          setTestimonials((prev) => [res.testimonial as unknown as TestimonialData, ...prev]);
          toast.success("Testimonial created successfully!");
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create testimonial.");
        }
      }
    } catch {
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-surface-container/60 p-4 rounded-2xl border border-outline/20">
        <p className="text-xs text-on-surface-variant font-mono">
          Showing {testimonials.length} Testimonials
        </p>

        <button
          onClick={handleOpenAdd}
          className="glow-btn-primary px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-outline/25 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container-high/80 text-on-surface-variant uppercase font-mono tracking-wider border-b border-outline/20">
            <tr>
              <th className="p-4">Author</th>
              <th className="p-4">Company &amp; Role</th>
              <th className="p-4">Quote</th>
              <th className="p-4 text-center">Rating</th>
              <th className="p-4 text-center">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/10">
            {testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-surface-container-high/40 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/30 flex-shrink-0 bg-surface-container shadow-sm">
                      {t.authorAvatar ? (
                        <Image
                          src={t.authorAvatar}
                          alt={t.authorName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 m-auto text-on-surface-variant" />
                      )}
                    </div>
                    <span className="font-bold text-on-surface">{t.authorName}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-on-surface">{t.authorCompany}</p>
                  <p className="text-[11px] text-on-surface-variant">{t.authorTitle}</p>
                </td>
                <td className="p-4">
                  <p className="text-on-surface-variant line-clamp-2 max-w-sm italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </td>
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-0.5">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleToggleFeatured(t.id, t.isFeatured)}
                    className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        t.isFeatured
                          ? "fill-secondary text-secondary"
                          : "text-on-surface-variant/40"
                      }`}
                    />
                  </button>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.authorName)}
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
                {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
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
                  Author Name *
                </label>
                <input
                  type="text"
                  name="authorName"
                  required
                  defaultValue={editingTestimonial?.authorName || ""}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Position / Role *
                  </label>
                  <input
                    type="text"
                    name="authorTitle"
                    required
                    defaultValue={editingTestimonial?.authorTitle || ""}
                    placeholder="e.g. HR Director"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    name="authorCompany"
                    required
                    defaultValue={editingTestimonial?.authorCompany || ""}
                    placeholder="e.g. Enterprise Systems Corp"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  name="authorAvatar"
                  defaultValue={editingTestimonial?.authorAvatar || ""}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Quote *
                </label>
                <textarea
                  name="quote"
                  required
                  rows={4}
                  defaultValue={editingTestimonial?.quote || ""}
                  placeholder="Enter endorsement or quote..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    defaultValue={editingTestimonial?.rating || 5}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container/80 border border-outline/25 text-on-surface text-sm font-mono focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    defaultChecked={editingTestimonial?.isFeatured || false}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/50"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-xs font-bold uppercase tracking-wider text-on-surface cursor-pointer flex items-center gap-1"
                  >
                    <span>Featured Showcase</span>
                    <Star className="w-3 h-3 text-secondary fill-secondary" />
                  </label>
                </div>
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
                  <span>{editingTestimonial ? "Save Changes" : "Create Testimonial"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
