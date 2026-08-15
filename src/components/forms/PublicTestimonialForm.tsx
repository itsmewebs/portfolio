"use client";

import React, { useState } from "react";
import { submitPublicTestimonial } from "@/actions/testimonials";
import { Star, Send, Loader2, CheckCircle2, Sparkles, Building2, User, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function PublicTestimonialForm() {
  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorCompany, setAuthorCompany] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorTitle.trim() || !authorCompany.trim() || !quote.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("authorName", authorName);
    formData.append("authorTitle", authorTitle);
    formData.append("authorCompany", authorCompany);
    formData.append("quote", quote);
    formData.append("rating", rating.toString());

    try {
      const res = await submitPublicTestimonial(formData);
      if (res.success) {
        setSubmitted(true);
        toast.success("Recommendation submitted successfully!");
        try {
          confetti({
            particleCount: 45,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#7c3aed", "#0284c7", "#db2777", "#a078ff"],
          });
        } catch {}
      } else {
        toast.error(res.error || "Failed to submit recommendation");
      }
    } catch {
      toast.error("Network error submitting testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-3xl p-10 text-center max-w-xl mx-auto border border-primary/30 shadow-2xl space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-secondary/15 border border-secondary/30 text-secondary flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-display text-2xl font-bold text-on-surface">
          Thank You for Your Endorsement!
        </h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Your feedback has been received and logged in the command center audit trail. It will appear on the public portfolio after administrative verification.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setAuthorName("");
            setAuthorTitle("");
            setAuthorCompany("");
            setQuote("");
            setRating(5);
          }}
          className="glass-btn-secondary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 mt-4"
        >
          <span>Submit Another Note</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
      {/* Left Column: Interactive Form */}
      <div className="lg:col-span-7 glass-panel rounded-3xl p-8 border border-outline/25 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colleague &amp; Partner Feedback</span>
          </span>
          <h3 className="font-display text-2xl font-bold text-on-surface">
            Submit an Endorsement
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Share your experience collaborating with Ali on HR operations, full-stack systems, or data analytics projects.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Job Title / Role *
              </label>
              <input
                type="text"
                required
                value={authorTitle}
                onChange={(e) => setAuthorTitle(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Organization / Company *
            </label>
            <input
              type="text"
              required
              value={authorCompany}
              onChange={(e) => setAuthorCompany(e.target.value)}
              placeholder="e.g. Enterprise Tech / Partner Org"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Experience Rating
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container border border-outline/30">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        (hoverRating !== null ? hoverRating >= star : rating >= star)
                          ? "fill-primary text-primary"
                          : "text-outline/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-on-surface ml-2">
                {hoverRating !== null ? `${hoverRating} / 5` : `${rating} / 5 Stars`}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Your Recommendation / Testimonial *
            </label>
            <textarea
              required
              rows={4}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Describe Ali's technical rigor, problem-solving mindset, collaborative synergy, or business impact..."
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="glow-btn-primary w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Transmitting Recommendation...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Endorsement</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Live Card Preview */}
      <div className="lg:col-span-5 space-y-4">
        <div className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
          <Quote className="w-3.5 h-3.5 text-primary" />
          <span>Real-Time Card Preview</span>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-primary/30 shadow-xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Quote className="w-5 h-5" />
            </div>

            <div className="flex items-center gap-1 bg-surface-container-high/80 border border-outline/30 px-2.5 py-1 rounded-full">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
          </div>

          <p className="text-on-surface text-sm md:text-base font-normal leading-relaxed italic min-h-[80px]">
            &ldquo;{quote.trim() || "Your endorsement feedback will preview dynamically here in real-time as you type..."}&rdquo;
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-4 mt-4 border-t border-outline/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                {(authorName.trim() ? authorName.trim()[0] : "U").toUpperCase()}
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-on-surface">
                  {authorName.trim() || "Your Name"}
                </h4>
                <p className="text-[11px] text-on-surface-variant font-medium">
                  {authorTitle.trim() || "Your Job Title"}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/25 text-secondary text-[11px] font-semibold">
              <Building2 className="w-3 h-3" />
              <span>{authorCompany.trim() || "Organization"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
