"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-outline/20 flex items-center justify-center opacity-50" />
    );
  }

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="w-8 h-8 rounded-full glass-panel border border-outline/25 hover:border-primary/50 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all shadow-sm group"
        aria-label="Toggle theme"
        title={`Current: ${theme} mode. Click to switch.`}
      >
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
        )}
      </button>
    </div>
  );
}
