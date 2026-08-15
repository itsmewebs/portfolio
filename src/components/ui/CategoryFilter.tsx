"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFilterProps {
  currentCategory: string;
}

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = [
    { id: "ALL", label: "All Systems" },
    { id: "WEB_DEV", label: "Web Development" },
    { id: "NETWORKING", label: "Computer Networks" },
    { id: "CLOUD_DEVOPS", label: "Cloud & DevOps" },
    { id: "CYBER_SEC", label: "Network Security" },
  ];

  const handleSelect = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "ALL") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 py-4">
      {categories.map((cat) => {
        const isActive =
          (cat.id === "ALL" && !currentCategory) || currentCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
              isActive
                ? "bg-primary text-on-primary border-primary shadow-md"
                : "glass-panel text-on-surface-variant hover:text-on-surface hover:border-primary/40"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
