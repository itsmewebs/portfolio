"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Layers,
} from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : (prev ?? 0) - 1));
  }, [images.length, selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : (prev ?? 0) + 1));
  }, [images.length, selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  if (!images || images.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>System Gallery &amp; Screenshots ({images.length})</span>
        </div>
        <span className="text-[11px] font-mono text-on-surface-variant">
          Click to expand in HD Lightbox
        </span>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((imgUrl, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-video rounded-2xl overflow-hidden glass-panel border border-outline/25 hover:border-primary/50 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <Image
              src={imgUrl}
              alt={`${title} screenshot ${idx + 1}`}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-9 h-9 rounded-full bg-primary/80 text-white flex items-center justify-center shadow-lg">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-background/70 backdrop-blur-md text-[10px] font-mono font-bold text-on-surface border border-outline/20">
              #{idx + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 bg-background/90 backdrop-blur-xl"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col items-center glass-panel rounded-3xl p-4 sm:p-6 border border-primary/30 shadow-2xl overflow-hidden"
            >
              {/* Header bar */}
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-outline/20 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-display font-bold text-on-surface">
                    {title}
                  </span>
                  <span className="font-mono text-on-surface-variant">
                    ({selectedIndex + 1} of {images.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="p-1.5 rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Image Frame */}
              <div className="relative w-full aspect-video sm:aspect-[16/9] max-h-[70vh] rounded-2xl overflow-hidden bg-black/40 border border-outline/20">
                <Image
                  src={images[selectedIndex]}
                  alt={`${title} expanded view ${selectedIndex + 1}`}
                  fill
                  priority
                  className="object-contain object-center"
                />
              </div>

              {/* Controls Footer */}
              <div className="w-full flex items-center justify-between pt-4 mt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="glow-btn-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        selectedIndex === i
                          ? "w-6 bg-primary"
                          : "w-2 bg-outline/40 hover:bg-outline"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="glow-btn-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
