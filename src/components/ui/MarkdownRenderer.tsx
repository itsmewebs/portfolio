"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-on-surface prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-outline/20 prose-h2:pb-2 prose-h2:mt-8 prose-h3:text-xl prose-p:text-on-surface-variant prose-p:leading-relaxed prose-p:text-base prose-a:text-secondary prose-a:underline hover:prose-a:text-primary prose-strong:text-on-surface prose-code:text-primary prose-code:bg-surface-container prose-code:border prose-code:border-outline/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:font-mono prose-code:text-xs prose-pre:bg-surface-container-high prose-pre:border prose-pre:border-outline/25 prose-pre:rounded-2xl prose-pre:p-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/10 prose-blockquote:rounded-r-2xl prose-blockquote:p-4 prose-blockquote:text-on-surface prose-blockquote:italic prose-hr:border-outline/20 prose-ul:text-on-surface-variant prose-ol:text-on-surface-variant prose-li:my-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
