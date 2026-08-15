"use client";

import React, { useState } from "react";
import { toggleSubscriberStatus, deleteSubscriber } from "@/actions/newsletter";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  Search,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface SubscriberItem {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
}

interface SubscribersClientProps {
  initialSubscribers: SubscriberItem[];
}

export function SubscribersClient({ initialSubscribers }: SubscribersClientProps) {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(initialSubscribers);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await toggleSubscriberStatus(id);
      if (res.success && res.subscriber) {
        setSubscribers((prev) =>
          prev.map((s) => (s.id === id ? (res.subscriber as unknown as SubscriberItem) : s))
        );
        toast.success("Subscriber status updated");
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently remove "${email}" from subscribers?`)) {
      return;
    }

    setLoadingId(id);
    try {
      const res = await deleteSubscriber(id);
      if (res.success) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        toast.success(`Removed ${email}`);
      } else {
        toast.error("Failed to delete subscriber");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoadingId(null);
    }
  };

  const exportCSV = () => {
    const headers = "ID,Email,Name,Status,Subscribed Date\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.id}","${s.email}","${s.name || ""}","${s.isActive ? "Active" : "Inactive"}","${new Date(
            s.subscribedAt
          ).toISOString()}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `alinets-subscribers-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export downloaded");
  };

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const inactiveCount = subscribers.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-outline/25 space-y-1">
          <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-bold">
            <span>Total Subscribers</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-extrabold text-on-surface font-mono">
            {subscribers.length}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-outline/25 space-y-1">
          <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-bold">
            <span>Active Feed</span>
            <CheckCircle2 className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-3xl font-extrabold text-secondary font-mono">
            {activeCount}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-outline/25 space-y-1">
          <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase font-bold">
            <span>Unsubscribed / Inactive</span>
            <XCircle className="w-4 h-4 text-tertiary" />
          </div>
          <p className="text-3xl font-extrabold text-tertiary font-mono">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscribers by email or name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline/30 text-on-surface text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={exportCSV}
          disabled={subscribers.length === 0}
          className="glass-btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Subscribers Table */}
      <div className="glass-panel rounded-3xl border border-outline/25 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container border-b border-outline/20 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Subscriber Email</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Subscribed Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                    No subscribers found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-on-surface">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <span>{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-medium">
                      {sub.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {sub.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-secondary/15 text-secondary border border-secondary/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-tertiary/15 text-tertiary border border-tertiary/30">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-on-surface-variant" />
                        <span>{formatDate(sub.subscribedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={loadingId === sub.id}
                          onClick={() => handleToggle(sub.id)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline/30 transition-all disabled:opacity-50"
                        >
                          {sub.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          disabled={loadingId === sub.id}
                          onClick={() => handleDelete(sub.id, sub.email)}
                          className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-all disabled:opacity-50"
                          title="Delete subscriber"
                        >
                          {loadingId === sub.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
