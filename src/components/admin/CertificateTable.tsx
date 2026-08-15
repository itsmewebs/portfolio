"use client";

import React, { useState } from "react";
import { CertificateData } from "@/types";
import {
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/actions/certificates";
import {
  Plus,
  Trash2,
  Edit2,
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface CertificateTableProps {
  initialCertificates: CertificateData[];
}

export function CertificateTable({ initialCertificates }: CertificateTableProps) {
  const [certificates, setCertificates] = useState<CertificateData[]>(initialCertificates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingCert(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificateData) => {
    setEditingCert(cert);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (editingCert) {
        const res = await updateCertificate(editingCert.id, formData);
        if (res.success && res.certificate) {
          toast.success("Certificate updated successfully");
          setCertificates(
            certificates.map((c) =>
              c.id === editingCert.id ? (res.certificate as unknown as CertificateData) : c
            )
          );
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update certificate");
        }
      } else {
        const res = await createCertificate(formData);
        if (res.success && res.certificate) {
          toast.success("Certificate added successfully");
          setCertificates([...certificates, res.certificate as unknown as CertificateData]);
          setIsModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create certificate");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred saving certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete certificate "${title}"?`)) return;

    try {
      const res = await deleteCertificate(id);
      if (res.success) {
        toast.success("Certificate deleted");
        setCertificates(certificates.filter((c) => c.id !== id));
      } else {
        toast.error("Failed to delete certificate");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting certificate");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-surface-container/60 p-4 rounded-2xl border border-outline/20">
        <p className="text-xs text-on-surface-variant font-mono">
          Total Credentials: <span className="text-primary font-bold">{certificates.length}</span>
        </p>

        <button
          onClick={openCreateModal}
          className="glow-btn-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Certificate</span>
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-outline/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline/20 bg-surface-container-highest/40 text-[11px] font-mono uppercase text-on-surface-variant">
                <th className="py-3.5 px-4">Certification Title</th>
                <th className="py-3.5 px-4">Issuer</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Credential ID</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              {certificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    No certificates recorded yet. Click &quot;New Certificate&quot; to add one.
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-on-surface">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{cert.title}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                      {cert.issuer}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-secondary font-bold">
                      {cert.issueDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-surface-container border border-outline/25 text-on-surface-variant font-bold">
                        {cert.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                      {cert.credentialId || "—"}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="p-2 rounded-xl hover:bg-surface-container-high text-primary transition-colors"
                        title="Edit Certificate"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id, cert.title)}
                        className="p-2 rounded-xl hover:bg-error/15 text-error transition-colors"
                        title="Delete Certificate"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel border border-primary/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full my-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-outline/20 pb-4">
              <h3 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span>{editingCert ? "Edit Certification" : "Add New Certification"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container-high"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                  Certificate Title *
                </label>
                <input
                  name="title"
                  defaultValue={editingCert?.title || ""}
                  required
                  placeholder="e.g. IBM Certified Data Science Professional"
                  className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    Issuer / Institution *
                  </label>
                  <input
                    name="issuer"
                    defaultValue={editingCert?.issuer || ""}
                    required
                    placeholder="e.g. Meta / IBM"
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    Issue Date *
                  </label>
                  <input
                    name="issueDate"
                    defaultValue={editingCert?.issueDate || "2024"}
                    required
                    placeholder="e.g. Nov 2024 or 2024"
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    defaultValue={editingCert?.category || "TECH"}
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="TECH" className="bg-surface text-on-surface">Web &amp; Software Development</option>
                    <option value="NETWORKING" className="bg-surface text-on-surface">Computer Networks &amp; Cisco</option>
                    <option value="CLOUD" className="bg-surface text-on-surface">Cloud &amp; DevOps</option>
                    <option value="DATA_AI" className="bg-surface text-on-surface">Data &amp; Telemetry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                    Credential ID (Optional)
                  </label>
                  <input
                    name="credentialId"
                    defaultValue={editingCert?.credentialId || ""}
                    placeholder="e.g. IBM-DS-992481"
                    className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-on-surface-variant mb-1">
                  Verification URL (Optional)
                </label>
                <input
                  name="credentialUrl"
                  defaultValue={editingCert?.credentialUrl || ""}
                  placeholder="https://www.coursera.org/verify/..."
                  className="w-full bg-surface-container/80 border border-outline/25 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="certFeatured"
                  defaultChecked={editingCert ? editingCert.isFeatured : true}
                  className="w-4 h-4 rounded text-primary focus:ring-0"
                />
                <label htmlFor="certFeatured" className="text-xs font-semibold cursor-pointer">
                  Featured on About &amp; Home pages
                </label>
              </div>

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
                  {isSubmitting ? "Saving..." : editingCert ? "Update" : "Save Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
