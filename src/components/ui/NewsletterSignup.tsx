"use client";

import React, { useState } from "react";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Mail, Send, CheckCircle2, Sparkles, Loader2, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface NewsletterSignupProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function NewsletterSignup({
  title = "Subscribe to Engineering & Research Dispatch",
  subtitle = "Direct updates on Next.js 15 architectures, HR tech automation pipelines, workforce data science models, and open-source releases.",
  compact = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", email);
    if (name.trim()) formData.append("name", name.trim());

    try {
      const res = await subscribeToNewsletter(formData);
      if (res.success) {
        setIsSubscribed(true);
        setMessage(res.message || "Thank you for subscribing!");
        toast.success("Subscription Activated!", {
          description: res.message,
        });

        try {
          confetti({
            particleCount: 50,
            spread: 75,
            origin: { y: 0.7 },
            colors: ["#7c3aed", "#0284c7", "#db2777", "#a078ff"],
          });
        } catch {}
      } else {
        toast.error(res.error || "Subscription failed");
      }
    } catch {
      toast.error("Network error processing subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-3xl p-8 text-center border border-secondary/30 shadow-xl max-w-xl mx-auto space-y-3"
      >
        <div className="w-12 h-12 rounded-full bg-secondary/15 border border-secondary/30 text-secondary flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-display text-xl font-bold text-on-surface">
          Transmission Channel Connected
        </h4>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {message}
        </p>
      </motion.div>
    );
  }

  return (
    <div
      className={`glass-panel rounded-3xl border border-primary/25 relative overflow-hidden shadow-2xl ${
        compact ? "p-6" : "p-8 md:p-12"
      }`}
    >
      <div className="absolute -right-24 -bottom-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold uppercase tracking-wider">
          <Bell className="w-3.5 h-3.5" />
          <span>Periodic Research Briefings</span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          {title}
        </h3>

        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="pt-2 space-y-3 max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container border border-outline/30 text-on-surface text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 placeholder:text-on-surface-variant/70 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="glow-btn-primary px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50 flex-shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] font-mono text-on-surface-variant/80">
            Zero spam. Unsubscribe with 1-click anytime. No tracking pixels.
          </p>
        </form>
      </div>
    </div>
  );
}
