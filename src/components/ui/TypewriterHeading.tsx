"use client";

import React, { useState, useEffect } from "react";

interface TypewriterHeadingProps {
  greeting: string;
  tagline: string;
}

export function TypewriterHeading({ greeting, tagline }: TypewriterHeadingProps) {
  const [displayedTagline, setDisplayedTagline] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedTagline("");
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index <= tagline.length) {
        setDisplayedTagline(tagline.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [tagline]);

  return (
    <div className="space-y-3">
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.15]">
        <span>{greeting}</span>{" "}
        <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
          {displayedTagline}
        </span>
        {isTyping && (
          <span className="inline-block w-1.5 h-10 ml-1.5 align-middle bg-secondary animate-pulse" />
        )}
      </h1>
    </div>
  );
}
