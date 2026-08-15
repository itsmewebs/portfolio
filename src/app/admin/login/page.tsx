"use client";

import React, { useState } from "react";
import { loginAction } from "@/actions/auth";
import { Terminal, Lock, Mail, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password);

    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setStatus("error");
        setErrorMessage(res.error);
      }
    } catch {
      // In Next.js, successful server action redirect throws an internal error which executes the redirect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-display text-2xl font-bold text-primary mb-2 transition-transform hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(208,188,255,0.3)]">
              <Terminal className="w-5 h-5" />
            </div>
            <span>
              alinets<span className="text-secondary">.com</span>
            </span>
          </Link>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">
            Executive Command Center &amp; CMS v7.0 Zenith
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-outline/25 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-2 text-primary">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="font-display text-xl font-bold text-on-surface">
              Admin Authentication
            </h2>
          </div>
          <p className="text-on-surface-variant text-xs mb-6 leading-relaxed">
            Enter your credentials to access site settings, project CRUD, blog authoring, and telemetry.
          </p>

          {status === "error" && (
            <div className="mb-5 p-3.5 rounded-xl bg-error/15 border border-error/30 text-error flex items-center gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container/70 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 font-mono text-xs"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container/70 border border-outline/25 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-xs font-mono"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="glow-btn-primary w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider mt-4 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Command Center</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
