import type { ReactNode } from "react";

interface MarkdownViewerProps {
  content: string;
}

function parseInlineMarkdown(text: string): ReactNode[] {
  // Regex to match **bold**, *italic*, `code`, and [label](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-neutral-600">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[#007aff] font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-[#007aff] font-medium underline hover:text-[#0051a8] transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const lines = content.split("\n");

  return (
    <div
      className="w-full h-full overflow-y-auto p-4 sm:p-6 bg-[#f8f9fb]"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-black/10 p-6 sm:p-8 space-y-3.5 text-neutral-800 font-sans leading-relaxed text-xs sm:text-[13px]">
        {lines.map((rawLine, idx) => {
          const line = rawLine.trim();

          // Empty line spacing
          if (!line) {
            return <div key={idx} className="h-1.5" />;
          }

          // Horizontal rule
          if (line === "---" || line === "***") {
            return <hr key={idx} className="border-t border-black/10 my-3" />;
          }

          // Level 1 Header
          if (line.startsWith("# ")) {
            return (
              <div key={idx} className="border-b border-black/10 pb-2 mb-3 pt-1">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  {parseInlineMarkdown(line.slice(2))}
                </h1>
              </div>
            );
          }

          // Level 2 Header
          if (line.startsWith("## ")) {
            return (
              <h2
                key={idx}
                className="text-base sm:text-lg font-bold text-[#007aff] mt-4 mb-1.5 tracking-tight flex items-center gap-1.5"
              >
                <span>{parseInlineMarkdown(line.slice(3))}</span>
              </h2>
            );
          }

          // Level 3 Header
          if (line.startsWith("### ")) {
            return (
              <h3
                key={idx}
                className="text-sm font-semibold text-neutral-900 mt-3 mb-1 tracking-tight"
              >
                {parseInlineMarkdown(line.slice(4))}
              </h3>
            );
          }

          // Bullet list item
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2 my-1">
                <span className="text-[#007aff] text-xs mt-0.5 shrink-0 select-none font-bold">
                  •
                </span>
                <div className="text-neutral-700 leading-relaxed">
                  {parseInlineMarkdown(line.slice(2))}
                </div>
              </div>
            );
          }

          // Blockquote
          if (line.startsWith("> ")) {
            return (
              <blockquote
                key={idx}
                className="border-l-3 border-[#007aff] bg-blue-50/50 pl-3 py-1.5 my-2 rounded-r text-neutral-700 italic text-[12px]"
              >
                {parseInlineMarkdown(line.slice(2))}
              </blockquote>
            );
          }

          // Key-value metadata line, e.g. **Period:** October 2026 – Present
          const isMetaLine = line.startsWith("**") && line.includes(":**");
          if (isMetaLine) {
            return (
              <div
                key={idx}
                className="bg-neutral-50 border border-black/5 px-2.5 py-1 rounded-md text-[12px] text-neutral-700 w-fit my-1.5 shadow-2xs"
              >
                {parseInlineMarkdown(line)}
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={idx} className="text-neutral-700 leading-relaxed">
              {parseInlineMarkdown(line)}
            </p>
          );
        })}
      </div>
    </div>
  );
}
