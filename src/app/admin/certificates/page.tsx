import React from "react";
import { prisma } from "@/lib/prisma";
import { CertificateTable } from "@/components/admin/CertificateTable";
import { Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-tertiary uppercase tracking-wider mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>Professional Credentials</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-on-surface">
          Certificates &amp; Verified Licenses
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1">
          Manage academic and industry certifications displayed on the About page and auto-generated Resume.
        </p>
      </div>

      <CertificateTable initialCertificates={certificates} />
    </div>
  );
}
