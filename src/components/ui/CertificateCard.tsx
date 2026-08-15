"use client";

import React from "react";
import { CertificateData } from "@/types";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface CertificateCardProps {
  cert: CertificateData;
}

export function CertificateCard({ cert }: CertificateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-panel rounded-3xl p-6 border border-outline/25 hover:border-primary/40 transition-all flex flex-col justify-between h-full group relative overflow-hidden"
    >
      <div className="space-y-4">
        {/* Top bar with Issuer & Verified Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-mono font-bold text-secondary">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified</span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
            {cert.title}
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            {cert.issuer}
          </p>
        </div>

        {cert.credentialId && (
          <p className="text-[11px] font-mono text-on-surface-variant">
            ID: <span className="text-on-surface font-semibold">{cert.credentialId}</span>
          </p>
        )}
      </div>

      {/* Bottom Bar: Issued Date & Credential Link */}
      <div className="pt-4 mt-4 border-t border-outline/20 flex items-center justify-between text-xs">
        <span className="text-[11px] font-mono text-on-surface-variant">
          Issued {cert.issueDate}
        </span>

        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1 transition-colors"
          >
            <span>Verify</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
