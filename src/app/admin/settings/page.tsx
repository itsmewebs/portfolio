import React from "react";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Configuration</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-on-surface">
          Site Narrative &amp; Branding Settings
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1">
          Modify the live home page headline copy, About narrative, branding tags, and social URLs dynamically without editing code.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
