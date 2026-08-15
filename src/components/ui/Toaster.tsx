"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="bottom-right"
      theme={(resolvedTheme as "light" | "dark") || "dark"}
      toastOptions={{
        className:
          "glass-panel text-on-surface border border-outline/25 backdrop-blur-xl shadow-2xl rounded-2xl p-4 text-xs font-sans",
      }}
    />
  );
}
