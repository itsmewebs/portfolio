import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorScheme: "primary" | "secondary" | "tertiary";
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  colorScheme,
  subtitle,
}: StatCardProps) {
  const schemeStyles = {
    primary: {
      bg: "bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(208,188,255,0.15)]",
      valColor: "text-on-surface",
    },
    secondary: {
      bg: "bg-secondary/10 border-secondary/20 text-secondary shadow-[0_0_15px_rgba(76,215,246,0.15)]",
      valColor: "text-on-surface",
    },
    tertiary: {
      bg: "bg-tertiary/10 border-tertiary/20 text-tertiary shadow-[0_0_15px_rgba(255,176,205,0.15)]",
      valColor: "text-on-surface",
    },
  };

  const style = schemeStyles[colorScheme];

  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] border border-outline/25 shadow-md">
      <div
        className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border flex-shrink-0 ${style.bg}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          {title}
        </p>
        <p className={`font-display text-2xl md:text-3xl font-extrabold mt-1 ${style.valColor}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-on-surface-variant/70 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
