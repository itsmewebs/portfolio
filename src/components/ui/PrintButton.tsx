"use client";

import React from "react";
import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="glow-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
      aria-label="Print or Save PDF Resume"
    >
      <Printer className="w-4 h-4" />
      <span>Print / Save PDF</span>
    </button>
  );
}
