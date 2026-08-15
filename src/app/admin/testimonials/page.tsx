import React from "react";
import { prisma } from "@/lib/prisma";
import { TestimonialTable } from "@/components/admin/TestimonialTable";
import { Quote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
          <Quote className="w-3.5 h-3.5" />
          <span>Social Proof Registry</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-on-surface">
          Testimonials &amp; Endorsements
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1">
          Manage leadership and collaborator testimonials displayed in the home page carousel.
        </p>
      </div>

      <TestimonialTable initialTestimonials={testimonials} />
    </div>
  );
}
