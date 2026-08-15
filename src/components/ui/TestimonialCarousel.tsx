"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, Building2, User } from "lucide-react";
import { TestimonialData } from "@/types";

interface TestimonialCarouselProps {
  testimonials: TestimonialData[] | {
    id: string;
    authorName: string;
    authorTitle: string;
    authorCompany: string;
    authorAvatar?: string | null;
    quote: string;
    rating: number;
  }[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const active = testimonials[current];

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="glass-panel rounded-3xl p-8 md:p-12 border border-primary/25 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Background glow highlights */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
            <Quote className="w-6 h-6" />
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 bg-surface-container-high/80 border border-outline/30 px-3 py-1.5 rounded-full">
            {Array.from({ length: active.rating || 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
            ))}
          </div>
        </div>

        {/* Dynamic Animated Quote Content */}
        <div className="min-h-[140px] flex items-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 w-full"
            >
              <p className="text-on-surface text-base md:text-xl font-normal leading-relaxed italic">
                &ldquo;{active.quote}&rdquo;
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-outline/20">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 flex-shrink-0 bg-surface-container-high">
                    {active.authorAvatar ? (
                      <Image
                        src={active.authorAvatar}
                        alt={active.authorName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-on-surface">
                      {active.authorName}
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {active.authorTitle}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/25 text-secondary text-xs font-semibold">
                  <Building2 className="w-3 h-3" />
                  <span>{active.authorCompany}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls & Dots */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-outline/20 relative z-10">
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    current === idx
                      ? "w-8 bg-primary shadow-sm"
                      : "w-2 bg-outline/40 hover:bg-outline"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
                }
                className="p-2 rounded-xl glass-panel text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
                className="p-2 rounded-xl glass-panel text-on-surface-variant hover:text-on-surface hover:border-primary/40 transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
