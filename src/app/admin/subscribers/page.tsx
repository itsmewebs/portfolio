import React from "react";
import { prisma } from "@/lib/prisma";
import { SubscribersClient } from "./SubscribersClient";
import { Mail, Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-outline/20 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
          <Bell className="w-3.5 h-3.5" />
          <span>Audience &amp; Dispatch Channels</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-on-surface">
          Newsletter Subscribers
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1">
          Monitor and manage audience members subscribed to technical engineering and data science briefings.
        </p>
      </div>

      <SubscribersClient initialSubscribers={subscribers} />
    </div>
  );
}
