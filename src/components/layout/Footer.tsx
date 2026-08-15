import React from "react";
import Link from "next/link";
import { Terminal, Github, Linkedin, Twitter, Mail, ShieldCheck, Sparkles } from "lucide-react";

interface FooterProps {
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  contactEmail?: string | null;
  footerText?: string | null;
}

export function Footer({
  githubUrl = "https://github.com/alinets",
  linkedinUrl = "https://linkedin.com/in/alinets",
  twitterUrl = "https://twitter.com/alinets",
  contactEmail = "contact@alinets.com",
  footerText,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-outline/20 bg-surface-container-lowest/80 backdrop-blur-md relative z-10 mt-auto transition-colors">
      <div className="max-w-container-max mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 font-display text-lg font-bold text-on-surface">
              <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span>alinets<span className="text-secondary">.com</span></span>
              <span className="text-[10px] font-mono text-primary font-bold px-2 py-0.5 rounded-full bg-primary/15 border border-primary/20">
                v7.0 Zenith
              </span>
            </Link>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              ICT Specialist &times; Web Developer &times; Network Infrastructure Architect. Engineering enterprise systems, Cisco topologies, and cloud microservices.
            </p>
          </div>

          {/* Nav Col */}
          <div className="md:col-span-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            <Link href="/projects" className="hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="/services" className="hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/skills" className="hover:text-primary transition-colors">
              Skills &amp; Tech
            </Link>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog &amp; Research
            </Link>
            <Link href="/testimonials" className="hover:text-primary transition-colors">
              Endorsements
            </Link>
            <Link href="/bookmarks" className="hover:text-primary transition-colors">
              Reading List
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              About &amp; ICT
            </Link>
            <Link href="/resume" className="hover:text-primary transition-colors">
              Resume / CV
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/admin" className="hover:text-secondary transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </Link>
          </div>

          {/* Socials Col */}
          <div className="md:col-span-3 flex items-center md:justify-end gap-3">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-tertiary hover:border-tertiary/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-outline/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <p>© {currentYear} Ali. Hosted on alinets.com. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-secondary" />
            <span>{footerText || "Engineered with Next.js 15, Neon PostgreSQL, Prisma ORM & Zenith Design v7.0."}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
