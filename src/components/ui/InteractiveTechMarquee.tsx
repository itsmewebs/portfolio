"use client";

import React from "react";
import {
  Code2,
  Database,
  BrainCircuit,
  Server,
  Layers,
  Cpu,
  Sparkles,
  ShieldCheck,
  Terminal,
  Box,
} from "lucide-react";

export function InteractiveTechMarquee() {
  const items = [
    { label: "Next.js 15 App Router", icon: Code2, color: "text-primary border-primary/30" },
    { label: "Cisco Routing & Switching (CCNA)", icon: Server, color: "text-secondary border-secondary/30" },
    { label: "PostgreSQL & Prisma ORM", icon: Database, color: "text-primary border-primary/30" },
    { label: "TCP/IP & OSPF / BGP Routing", icon: Layers, color: "text-secondary border-secondary/30" },
    { label: "802.1Q VLANs & Subnetting", icon: ShieldCheck, color: "text-tertiary border-tertiary/30" },
    { label: "TypeScript & React 19", icon: Terminal, color: "text-primary border-primary/30" },
    { label: "Linux Server Administration", icon: Cpu, color: "text-secondary border-secondary/30" },
    { label: "Docker & Nginx Reverse Proxy", icon: Box, color: "text-primary border-primary/30" },
    { label: "WireGuard VPN & Security", icon: ShieldCheck, color: "text-tertiary border-tertiary/30" },
    { label: "ICT Systems Architecture", icon: Sparkles, color: "text-secondary border-secondary/30" },
  ];

  return (
    <div className="w-full overflow-hidden py-4 border-y border-outline/20 bg-surface-container-lowest/40 backdrop-blur-md relative mask-radial">
      {/* Subtle edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee gap-4 items-center">
        {items.concat(items).map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 rounded-full glass-panel border ${item.color} text-xs font-semibold text-on-surface hover:scale-105 transition-transform select-none shadow-sm`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
