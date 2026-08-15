"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number; // in seconds
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1.5,
  suffix = "",
  prefix = "",
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (!isInView) return;

    let start = from;
    const end = to;
    if (start === end) return;

    const totalSteps = 60 * duration;
    const increment = (end - start) / totalSteps;
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, (duration * 1000) / totalSteps);

    return () => clearInterval(timer);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
