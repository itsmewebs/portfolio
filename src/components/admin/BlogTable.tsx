"use client";

import React, { useState } from "react";
import { BlogPostData } from "@/types";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/actions/blog";
import { parseArray, formatDate } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Sparkles,
  BookOpen,
  Eye,
  Clock,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface BlogTableProps {
  initialPosts: BlogPostData[];
}

export function BlogTable({ initialPosts }: BlogTableProps) {
  const [posts, setPosts] = useState<BlogPostData[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostData | null>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [contentPreview, setContentPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "ALL", label: "All Publications" },
    { id: "ENGINEERING", label: "Engineering" },
    { id: "NETWORKING", label: "Networking & Cisco" },
    { id: "CLOUD_DEVOPS", label: "Cloud & DevOps" },
    { id: "WEB_DEV", label: "Web Development" },
    { id: "THOUGHTS", label: "Thoughts" },
  ];

  const filteredPosts =
    selectedCategory === "ALL"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const openCreateModal = () => {
    setEditingPost(null);
    setContentPreview("");
    setActiveTab("write");
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPostData) => {
    setEditingPost(post);
    setContentPreview(post.content);
    setActiveTab("write");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (editingPost) {
        const res = await updateBlogPost(editingPost.id, formData);
        if (res.success && res.post) {
          toast.success("Blog post updated successfully");
          setPosts(posts.map((p) => (p.id === editingPost.id ? (res.post as unknown as BlogPostData) : p)));
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update blog post");
        }
      } else {
        const res = await createBlogPost(formData);
        if (res.success && res.post) {
          toast.success("Blog post created successfully");
          setPosts([res.post as unknown as BlogPostData, ...posts]);
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create blog post");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred saving article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await deleteBlogPost(id);
      if (res.success) {
        toast.success("Article deleted");
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        toast.error("Failed to delete article");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting article");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container/60 p-4 rounded-2xl border border-outline/20">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === c.id
                  ? "bg-primary text-on-primary font-bold shadow-md"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          onClick={openCreateModal}
          className="glow-btn-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-3xl border border-outline/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline/20 bg-surface-container-highest/40 text-[11px] font-mono uppercase text-on-surface-variant">
                <th className="py-3.5 px-4">Title &amp; Slug</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Reading Time</th>
                <th className="py-3.5 px-4">Reads</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    No publications in this category. Click &quot;New Article&quot; to publish one.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface line-clamp-1">{post.title}</span>
                        {post.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/30 flex-shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-on-surface-variant line-clamp-1">
                        /blog/{post.slug}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-surface-container border border-outline/25 text-on-surface-variant font-bold">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                      {post.readingTime}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-tertiary font-bold">
                      {post.views}
                    </td>

                    <td className="py-3.5 px-4">
                      {post.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-secondary">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-on-surface-variant">
                          <XCircle className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-2 rounded-xl hover:bg-surface-container-high text-primary transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2 rounded-xl hover:bg-error/15 text-error transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel border border-primary/30 rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-outline/20 pb-4">
              <h3 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>{editingPost ? "Edit Publication" : "Write New Publication"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container-high"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    Article Title *
                  </label>
                  <input
                    name="title"
                    defaultValue={editingPost?.title || ""}
                    required
                    placeholder="e.g. Architecting Predictive HR Models"
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    URL Slug (Optional, auto-generated)
                  </label>
                  <input
                    name="slug"
                    defaultValue={editingPost?.slug || ""}
                    placeholder="architecting-predictive-hr-models"
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                  Summary / Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  defaultValue={editingPost?.excerpt || ""}
                  required
                  rows={2}
                  placeholder="Short engaging synopsis displayed on cards..."
                  className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    defaultValue={editingPost?.category || "ENGINEERING"}
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="ENGINEERING" className="bg-surface text-on-surface">Engineering</option>
                    <option value="NETWORKING" className="bg-surface text-on-surface">Networking &amp; Cisco</option>
                    <option value="CLOUD_DEVOPS" className="bg-surface text-on-surface">Cloud &amp; DevOps</option>
                    <option value="WEB_DEV" className="bg-surface text-on-surface">Web Development</option>
                    <option value="THOUGHTS" className="bg-surface text-on-surface">Thoughts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    Reading Time
                  </label>
                  <input
                    name="readingTime"
                    defaultValue={editingPost?.readingTime || "5 min read"}
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    name="tags"
                    defaultValue={
                      editingPost ? parseArray(editingPost.tags).join(", ") : "Next.js, Python, HR"
                    }
                    placeholder="Next.js, Python, Analytics"
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                  Cover Image URL
                </label>
                <input
                  name="coverImage"
                  defaultValue={editingPost?.coverImage || ""}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Markdown Content Editor / Preview Tabs */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono font-semibold text-on-surface-variant">
                    Article Markdown Body *
                  </label>
                  <div className="flex gap-1 bg-surface-container p-0.5 rounded-xl border border-outline/20">
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold ${
                        activeTab === "write" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Write Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold ${
                        activeTab === "preview" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Preview HTML
                    </button>
                  </div>
                </div>

                {activeTab === "write" ? (
                  <textarea
                    name="content"
                    value={contentPreview}
                    onChange={(e) => setContentPreview(e.target.value)}
                    required
                    rows={10}
                    placeholder="## Introduction&#10;&#10;Write article in standard markdown with code blocks, quotes, and links..."
                    className="w-full bg-surface-container/80 font-mono border border-outline/25 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                ) : (
                  <div className="w-full bg-surface-container border border-outline/25 rounded-xl p-4 min-h-[220px] max-h-[300px] overflow-y-auto custom-scrollbar">
                    <MarkdownRenderer content={contentPreview || "*Nothing to preview yet.*"} />
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    name="isPublished"
                    defaultChecked={editingPost ? editingPost.isPublished : true}
                    className="w-4 h-4 rounded text-primary focus:ring-0"
                  />
                  <span>Published (Visible on site)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={editingPost ? editingPost.isFeatured : false}
                    className="w-4 h-4 rounded text-primary focus:ring-0"
                  />
                  <span>Featured Spotlight Post</span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-outline/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glow-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  {isSubmitting ? "Saving..." : editingPost ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
