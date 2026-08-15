import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseArray<T = string>(value: string | undefined | null): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed as T[];
    }
  } catch {
    // If not JSON, handle comma-separated string
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) as unknown as T[];
  }
  return [];
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(d);
}

export function getWordCount(content: string): number {
  if (!content) return 0;
  // Strip markdown formatting symbols
  const cleanText = content
    .replace(/```[\s\S]*?```/g, " ") // remove code blocks
    .replace(/[#*`_~>\[\]()!-]/g, " ")
    .trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  return words.length;
}

export function calculateReadingTime(content: string): string {
  const words = getWordCount(content);
  if (words === 0) return "1 min read";
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

