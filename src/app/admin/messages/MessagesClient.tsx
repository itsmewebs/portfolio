"use client";

import React, { useState } from "react";
import { MessageData } from "@/types";
import { toggleMessageRead, deleteMessage } from "@/actions/messages";
import { formatDate } from "@/lib/utils";
import {
  Mail,
  MailOpen,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  Inbox,
} from "lucide-react";

interface MessagesClientProps {
  initialMessages: MessageData[];
}

export function MessagesClient({ initialMessages }: MessagesClientProps) {
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(
    initialMessages[0] || null
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleToggleRead = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      const res = await toggleMessageRead(id, !current);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !current } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: !current });
        }
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to update" });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) {
      return;
    }

    setLoadingId(id);
    try {
      const res = await deleteMessage(id);
      if (res.success) {
        const remaining = messages.filter((m) => m.id !== id);
        setMessages(remaining);
        if (selectedMessage?.id === id) {
          setSelectedMessage(remaining[0] || null);
        }
        setStatusMessage({ type: "success", text: "Message removed from inbox." });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to delete" });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error deleting message" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {statusMessage && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "bg-secondary/15 border border-secondary/30 text-secondary"
              : "bg-error/15 border border-error/30 text-error"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center max-w-lg mx-auto border border-outline/25 my-8 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-high mx-auto flex items-center justify-center text-on-surface-variant mb-4">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-on-surface mb-1">
            Inbox is Empty
          </h3>
          <p className="text-xs text-on-surface-variant">
            No inquiries have been transmitted yet. Form submissions from alinets.com/contact will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Messages List */}
          <div className="lg:col-span-5 glass-panel rounded-3xl border border-outline/25 overflow-hidden shadow-xl max-h-[680px] flex flex-col">
            <div className="p-4 border-b border-outline/20 bg-surface-container-highest/30 flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              <span>Inbox ({messages.length})</span>
              <span className="text-[10px] text-tertiary font-bold">
                {messages.filter((m) => !m.isRead).length} Unread
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-outline/10 custom-scrollbar">
              {messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.isRead) {
                        handleToggleRead(msg.id, false);
                      }
                    }}
                    className={`p-4 cursor-pointer transition-colors relative ${
                      isSelected
                        ? "bg-primary/15 border-l-4 border-primary"
                        : "hover:bg-surface-container-high/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-xs font-bold ${msg.isRead ? "text-on-surface" : "text-primary"}`}>
                        {msg.senderName}
                      </p>
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant font-mono mb-1.5">
                      {msg.senderEmail}
                    </p>

                    <p className="text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    {!msg.isRead && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(219,39,119,0.8)]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Message Detail View */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <div className="glass-panel rounded-3xl p-8 border border-outline/25 shadow-2xl space-y-6">
                {/* Header Actions */}
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-outline/20 pb-6">
                  <div>
                    <span className="text-[10px] font-mono text-secondary uppercase tracking-widest font-bold">
                      Transmission Detail
                    </span>
                    <h3 className="font-display text-xl font-bold text-on-surface mt-1">
                      {selectedMessage.subject || "No Subject Specified"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleToggleRead(selectedMessage.id, selectedMessage.isRead)
                      }
                      disabled={loadingId === selectedMessage.id}
                      className="px-3.5 py-1.5 rounded-xl glass-panel text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1.5 transition-colors border border-outline/20"
                    >
                      {selectedMessage.isRead ? (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Mark Unread</span>
                        </>
                      ) : (
                        <>
                          <MailOpen className="w-3.5 h-3.5" />
                          <span>Mark Read</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={loadingId === selectedMessage.id}
                      className="px-3.5 py-1.5 rounded-xl bg-error/15 text-error border border-error/30 hover:bg-error/25 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {loadingId === selectedMessage.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Sender Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-container/60 border border-outline/20 text-xs">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase font-bold">Sender Name</p>
                      <p className="font-bold text-on-surface">{selectedMessage.senderName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase font-bold">Sender Email</p>
                      <a
                        href={`mailto:${selectedMessage.senderEmail}`}
                        className="text-secondary hover:underline font-mono"
                      >
                        {selectedMessage.senderEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:col-span-2">
                    <Calendar className="w-4 h-4 text-tertiary" />
                    <div>
                      <p className="text-on-surface-variant text-[10px] uppercase font-bold">Received On</p>
                      <p className="font-mono text-on-surface font-semibold">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Message Content
                  </p>
                  <div className="p-6 rounded-2xl bg-surface-container-lowest/60 border border-outline/20 text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-normal">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Reply Shortcut */}
                <div className="pt-2">
                  <a
                    href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || "Your message on alinets.com"
                    )}`}
                    className="glow-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Email Client</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-12 text-center border border-outline/25 text-on-surface-variant text-xs shadow-xl">
                Select a transmission on the left to read full contents.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
