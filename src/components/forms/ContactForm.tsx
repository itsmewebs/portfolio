"use client";

import React, { useState } from "react";
import { submitContactMessage } from "@/actions/contact";
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, MessageSquare, Tag, Compass } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState("Project Collaboration");
  const [customSubject, setCustomSubject] = useState("");

  const presetTopics = [
    "Project Collaboration",
    "Computer Networks & Infrastructure",
    "Full-Stack Web Engineering",
    "Cloud & DevOps Architecture",
    "Career & Enterprise Opportunity",
    "Technical Consultation",
    "General Inquiry",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // If custom subject is empty, use selected topic
    const finalSubject = customSubject.trim()
      ? `[${selectedTopic}] ${customSubject.trim()}`
      : `[${selectedTopic}] Inquiry from ${formData.get("senderName")}`;
    formData.set("subject", finalSubject);

    try {
      const result = await submitContactMessage(formData);
      if (result.success) {
        setStatus("success");
        setSuccessMessage(result.message || "Message dispatched successfully!");
        form.reset();
        setMessageLength(0);
        setCustomSubject("");

        // Trigger celebratory confetti
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#7c3aed", "#0284c7", "#db2777", "#a078ff"],
        });

        toast.success("Transmission Dispatched!", {
          description: "Your inquiry has been recorded and transmitted directly to Ali.",
        });
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Failed to transmit message.");
        toast.error("Transmission Error", {
          description: result.error || "Failed to dispatch message.",
        });
      }
    } catch {
      setStatus("error");
      const err = "An unexpected network error occurred. Please try again.";
      setErrorMessage(err);
      toast.error("Network Error", { description: err });
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-8 md:p-10 border border-primary/25 relative overflow-hidden shadow-2xl">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-2 text-primary">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Direct Transmission &bull; v7.0 Zenith</span>
      </div>

      <h3 className="font-display text-2xl font-bold text-on-surface mb-2">
        Initiate Contact
      </h3>
      <p className="text-on-surface-variant text-xs md:text-sm mb-6 leading-relaxed">
        Whether you are interested in discussing HR tech systems, data science collaborations, full-stack architectures, or professional opportunities—send a direct message.
      </p>

      {status === "success" && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary flex items-center gap-3 text-xs md:text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 p-4 rounded-xl bg-error/15 border border-error/30 text-error flex items-center gap-3 text-xs md:text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} method="POST" className="space-y-5">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              name="senderName"
              required
              placeholder="e.g. Sarah Jenkins"
              className="w-full px-4 py-3 rounded-xl bg-surface-container/80 dark:bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 placeholder:text-on-surface-variant/60 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              name="senderEmail"
              required
              placeholder="e.g. sarah@enterprise.com"
              className="w-full px-4 py-3 rounded-xl bg-surface-container/80 dark:bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 placeholder:text-on-surface-variant/60 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Inquiry Classification & Discovery Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              Inquiry Classification *
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container/80 dark:bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all shadow-sm cursor-pointer"
            >
              {presetTopics.map((topic) => (
                <option key={topic} value={topic} className="bg-surface dark:bg-surface-container text-on-surface py-1">
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-secondary" />
              Discovery Source (Optional)
            </label>
            <select
              name="discoverySource"
              className="w-full px-4 py-3 rounded-xl bg-surface-container/80 dark:bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all shadow-sm cursor-pointer"
            >
              <option value="LinkedIn" className="bg-surface dark:bg-surface-container text-on-surface">LinkedIn Professional Network</option>
              <option value="GitHub" className="bg-surface dark:bg-surface-container text-on-surface">GitHub Open Source</option>
              <option value="Network / Colleague" className="bg-surface dark:bg-surface-container text-on-surface">Professional Tech Network</option>
              <option value="Search Engine" className="bg-surface dark:bg-surface-container text-on-surface">Search Engine (Google / Bing)</option>
              <option value="Technical Publication" className="bg-surface dark:bg-surface-container text-on-surface">Technical Blog / Research Article</option>
              <option value="Colleague / Friend" className="bg-surface dark:bg-surface-container text-on-surface">Colleague Referral</option>
              <option value="Other" className="bg-surface dark:bg-surface-container text-on-surface">Other Channel</option>
            </select>
          </div>
        </div>

        {/* Subject Header */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Subject Heading (Optional)
          </label>
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            placeholder="e.g. Predictive Analytics System Development for HR Operations"
            className="w-full px-4 py-3 rounded-xl bg-surface-container/80 dark:bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 placeholder:text-on-surface-variant/60 transition-all shadow-sm"
          />
        </div>

        {/* Message Body with Character Counter */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-tertiary" />
              Message Content *
            </label>
            <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">
              {messageLength} / 2000 characters
            </span>
          </div>
          <textarea
            name="message"
            required
            maxLength={2000}
            rows={5}
            onChange={(e) => setMessageLength(e.target.value.length)}
            placeholder="Describe your inquiry, project scope, or opportunity..."
            className="w-full px-4 py-3 rounded-xl bg-surface-container/80 dark:bg-surface-container border border-outline/30 text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 placeholder:text-on-surface-variant/60 transition-all resize-none shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="glow-btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Dispatch Transmission</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
