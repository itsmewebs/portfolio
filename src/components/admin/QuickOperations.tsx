"use client";

import React, { useState } from "react";
import { Download, Trash2, Database, ShieldCheck, RefreshCw, CheckCircle2, Server, ArrowUpRight, Cpu } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface QuickOperationsProps {
  totalRecords: number;
}

export function QuickOperations({ totalRecords }: QuickOperationsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) throw new Error("Failed to generate export file");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alinets-backup-v7-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Complete platform JSON backup downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Export operation failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm("Purge activity logs older than 30 days?")) return;
    setIsClearing(true);
    try {
      const res = await fetch("/api/admin/clear-logs", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Old logs cleared successfully");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to clear logs");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred clearing logs");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-outline/25 space-y-6 shadow-xl relative overflow-hidden">
      {/* Ambient decorative glow background */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Neon DB Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline/20 pb-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Platform Maintenance &amp; Operations</span>
          </div>
          <h3 className="font-display text-xl font-bold text-on-surface">
            System Operations &amp; Data Governance
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Trigger administrative routines, offline data archives, and database health telemetry.
          </p>
        </div>

        {/* Database Telemetry Status Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-sm flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span>Neon PostgreSQL Online &bull; {totalRecords.toLocaleString()} Records</span>
        </div>
      </div>

      {/* 3 Interactive Action / Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {/* Export Data Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="p-5 rounded-2xl bg-surface-container/60 hover:bg-surface-container dark:bg-surface-container/40 dark:hover:bg-surface-container/80 border border-outline/25 hover:border-primary/50 transition-all text-left group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/25 transition-all shadow-[0_0_12px_rgba(124,58,237,0.2)]">
              {isExporting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
              <span>JSON Archive</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Export Database</p>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              Download full system database records as an offline JSON snapshot
            </p>
          </div>
        </button>

        {/* Purge Old Logs Button */}
        <button
          onClick={handleClearLogs}
          disabled={isClearing}
          className="p-5 rounded-2xl bg-surface-container/60 hover:bg-surface-container dark:bg-surface-container/40 dark:hover:bg-surface-container/80 border border-outline/25 hover:border-tertiary/50 transition-all text-left group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center group-hover:scale-110 group-hover:bg-tertiary/25 transition-all shadow-[0_0_12px_rgba(219,39,119,0.2)]">
              {isClearing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10px] font-mono font-bold text-tertiary bg-tertiary/10 border border-tertiary/25 px-2 py-0.5 rounded-full uppercase">
              30-Day Purge
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Purge Audit Trail</p>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              Clean and prune legacy activity entries older than 30 days
            </p>
          </div>
        </button>

        {/* System Security & Integrity */}
        <div className="p-5 rounded-2xl bg-surface-container/60 dark:bg-surface-container/40 border border-outline/25 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shadow-[0_0_12px_rgba(2,132,199,0.2)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-secondary bg-secondary/10 border border-secondary/25 px-2 py-0.5 rounded-full uppercase">
              v7.0 Zenith
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Security &amp; Encryption</p>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              NextAuth v5 session guards &amp; Bcrypt password hashes active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
