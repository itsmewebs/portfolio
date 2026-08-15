import React from "react";
import { prisma } from "@/lib/prisma";
import { MessagesClient } from "./MessagesClient";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-tertiary uppercase tracking-wider mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Communications Dispatch</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-on-surface">
          Contact Form Transmissions
        </h2>
        <p className="text-on-surface-variant text-xs md:text-sm mt-1">
          Manage inquiries and project opportunities submitted via alinets.com/contact.
        </p>
      </div>

      <MessagesClient initialMessages={messages} />
    </div>
  );
}
