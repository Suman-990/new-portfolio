import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  Copy,
  Check,
  FileText,
  Terminal,
  Info,
  Sparkles,
  AlertTriangle,
  Star,
  ExternalLink,
  Clock,
} from "lucide-react";

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
          className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200/80 text-[#007aff] font-mono text-[11px] font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const isExternal = linkMatch[2].startsWith("http");
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 text-[#007aff] font-medium underline underline-offset-2 hover:text-[#0051a8] transition-colors"
        >
          <span>{linkMatch[1]}</span>
          {isExternal && <ExternalLink size={10} className="inline ml-0.5 opacity-70" />}
        </a>
      );
    }
    return part;
  });
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-xl overflow-hidden border border-neutral-800/90 shadow-md bg-[#16181d] text-neutral-200">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1e222a] border-b border-neutral-800/80 select-none">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
          </div>
          <span className="text-[10px] font-mono font-medium tracking-wider text-neutral-400 uppercase flex items-center gap-1 pl-1">
            <Terminal size={11} className="text-[#007aff]" />
            {lang || "CODE"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10.5px] font-mono bg-white/5 hover:bg-white/10 active:bg-white/15 text-neutral-300 transition-colors cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={11} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto text-[11.5px] font-mono leading-relaxed bg-[#121418] custom-scrollbar">
        <pre className="text-neutral-200 selection:bg-[#007aff]/30">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-3.5 overflow-x-auto rounded-xl border border-neutral-200 shadow-xs bg-white">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-neutral-50/90 border-b border-neutral-200">
            {headers.map((h, idx) => (
              <th
                key={idx}
                className="px-3.5 py-2 font-semibold text-neutral-700 uppercase tracking-wider text-[10.5px]"
              >
                {parseInlineMarkdown(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={`hover:bg-neutral-50/60 transition-colors ${
                rIdx % 2 === 1 ? "bg-neutral-50/30" : "bg-white"
              }`}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3.5 py-2 text-neutral-700 leading-snug">
                  {parseInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlertBlock({
  kind,
  content,
}: {
  kind: "NOTE" | "TIP" | "IMPORTANT" | "WARNING";
  content: string;
}) {
  const config = {
    NOTE: {
      bg: "bg-blue-50/70 border-blue-200 text-blue-900",
      badgeBg: "bg-blue-100 text-blue-700",
      icon: <Info size={14} className="text-[#007aff]" />,
      label: "Note",
    },
    TIP: {
      bg: "bg-emerald-50/70 border-emerald-200 text-emerald-950",
      badgeBg: "bg-emerald-100 text-emerald-700",
      icon: <Sparkles size={14} className="text-emerald-600" />,
      label: "Key Takeaway",
    },
    IMPORTANT: {
      bg: "bg-purple-50/70 border-purple-200 text-purple-950",
      badgeBg: "bg-purple-100 text-purple-700",
      icon: <Star size={14} className="text-purple-600" />,
      label: "Architecture",
    },
    WARNING: {
      bg: "bg-amber-50/70 border-amber-200 text-amber-950",
      badgeBg: "bg-amber-100 text-amber-700",
      icon: <AlertTriangle size={14} className="text-amber-600" />,
      label: "Important",
    },
  }[kind];

  return (
    <div
      className={`my-3 p-3.5 rounded-xl border shadow-2xs space-y-1.5 ${config.bg}`}
    >
      <div className="flex items-center space-x-1.5 text-xs font-semibold">
        {config.icon}
        <span className={`px-1.5 py-0.5 rounded text-[10.5px] uppercase tracking-wider font-bold ${config.badgeBg}`}>
          {config.label}
        </span>
      </div>
      <div className="text-[12px] leading-relaxed pl-5 text-neutral-800">
        {parseInlineMarkdown(content)}
      </div>
    </div>
  );
}

type ParsedBlock =
  | { type: "code"; lang: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "alert"; kind: "NOTE" | "TIP" | "IMPORTANT" | "WARNING"; content: string }
  | { type: "blockquote"; content: string }
  | { type: "h1"; content: string }
  | { type: "h2"; content: string }
  | { type: "h3"; content: string }
  | { type: "h4"; content: string }
  | { type: "hr" }
  | { type: "meta"; key: string; value: string }
  | { type: "bullet_list"; items: string[] }
  | { type: "numbered_list"; items: string[] }
  | { type: "paragraph"; content: string }
  | { type: "spacer" };

function parseMarkdownBlocks(rawContent: string): ParsedBlock[] {
  const lines = rawContent.split("\n");
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Empty lines
    if (!line) {
      blocks.push({ type: "spacer" });
      i++;
      continue;
    }

    // 2. Fenced Code Block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // Skip closing ```
      blocks.push({
        type: "code",
        lang,
        code: codeLines.join("\n"),
      });
      continue;
    }

    // 3. Tables (starts with | and has |)
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (r: string) =>
          r
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());

        const headers = parseRow(tableLines[0]);
        // Second line is usually separator |---|---|
        const hasSeparator = tableLines[1].includes("---");
        const dataLines = hasSeparator ? tableLines.slice(2) : tableLines.slice(1);
        const rows = dataLines.map(parseRow);
        blocks.push({ type: "table", headers, rows });
        continue;
      }
    }

    // 4. Alert Callouts: > [!NOTE], > [!TIP], etc.
    const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (alertMatch) {
      let kind = alertMatch[1].toUpperCase() as "NOTE" | "TIP" | "IMPORTANT" | "WARNING";
      if (kind === ("CAUTION" as string)) kind = "WARNING";
      const alertLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        alertLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      blocks.push({
        type: "alert",
        kind,
        content: alertLines.join(" "),
      });
      continue;
    }

    // 5. Standard Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      blocks.push({
        type: "blockquote",
        content: quoteLines.join(" "),
      });
      continue;
    }

    // 6. Horizontal Rule
    if (line === "---" || line === "***" || line === "___") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // 7. Headings
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", content: line.slice(2).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", content: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", content: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", content: line.slice(5).trim() });
      i++;
      continue;
    }

    // 8. Key-Value Metadata Pill: **Key:** Value
    const metaMatch = line.match(/^\*\*([^*]+):\*\*\s*(.+)$/);
    if (metaMatch) {
      blocks.push({
        type: "meta",
        key: metaMatch[1].trim(),
        value: metaMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 9. Bullet List Items: - item or * item
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const bulletItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
      ) {
        bulletItems.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push({ type: "bullet_list", items: bulletItems });
      continue;
    }

    // 10. Numbered List Items: 1. item
    if (/^\d+\.\s+/.test(line)) {
      const numberedItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        numberedItems.push(lines[i].trim().replace(/^\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "numbered_list", items: numberedItems });
      continue;
    }

    // 11. Normal Paragraph
    blocks.push({ type: "paragraph", content: line });
    i++;
  }

  return blocks;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const [copiedDoc, setCopiedDoc] = useState(false);

  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  // Statistics
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 180));
  }, [wordCount]);

  const handleCopyDocument = () => {
    navigator.clipboard.writeText(content);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-3 sm:p-6 bg-[#f8f9fb]">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-black/10 p-5 sm:p-8 space-y-3.5 text-neutral-800 font-sans leading-relaxed text-xs sm:text-[13px]">
        {/* Document Meta Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/10 text-neutral-500 text-[11px] select-none">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#007aff] font-medium border border-blue-100">
              <FileText size={11} />
              Markdown Spec
            </span>
            <span className="inline-flex items-center gap-1 text-neutral-400">
              <Clock size={11} />
              {readingTime} min read • {wordCount} words
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyDocument}
            className="flex items-center space-x-1 px-2 py-1 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/80 transition-colors cursor-pointer text-[10.5px]"
            title="Copy entire markdown content"
          >
            {copiedDoc ? (
              <>
                <Check size={11} className="text-emerald-500" />
                <span className="text-emerald-600 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copy Raw</span>
              </>
            )}
          </button>
        </div>

        {/* Parsed Blocks */}
        {blocks.map((block, idx) => {
          switch (block.type) {
            case "spacer":
              return <div key={idx} className="h-1.5" />;

            case "hr":
              return (
                <div key={idx} className="py-2">
                  <hr className="border-t border-black/10" />
                </div>
              );

            case "h1":
              return (
                <div key={idx} className="border-b border-black/10 pb-2 mb-2 pt-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-[#007aff] inline-block shrink-0" />
                    <span>{parseInlineMarkdown(block.content)}</span>
                  </h1>
                </div>
              );

            case "h2":
              return (
                <h2
                  key={idx}
                  className="text-base sm:text-lg font-bold text-neutral-900 mt-5 mb-2 tracking-tight flex items-center gap-2"
                >
                  <span className="text-[#007aff] text-xs font-mono">✦</span>
                  <span>{parseInlineMarkdown(block.content)}</span>
                </h2>
              );

            case "h3":
              return (
                <h3
                  key={idx}
                  className="text-sm font-semibold text-neutral-900 mt-3.5 mb-1 tracking-tight text-[#007aff] flex items-center gap-1.5"
                >
                  <span>{parseInlineMarkdown(block.content)}</span>
                </h3>
              );

            case "h4":
              return (
                <h4
                  key={idx}
                  className="text-xs font-semibold text-neutral-800 mt-2.5 mb-1 uppercase tracking-wider"
                >
                  {parseInlineMarkdown(block.content)}
                </h4>
              );

            case "meta":
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-neutral-50 border border-black/10 px-2.5 py-1 rounded-lg text-[11.5px] text-neutral-700 my-1 mr-2 shadow-2xs"
                >
                  <span className="font-semibold text-neutral-900">{block.key}:</span>
                  <span>{parseInlineMarkdown(block.value)}</span>
                </div>
              );

            case "bullet_list":
              return (
                <div key={idx} className="space-y-1.5 my-2 pl-1">
                  {block.items.map((item, bIdx) => (
                    <div key={bIdx} className="flex items-start space-x-2 pl-1">
                      <span className="text-[#007aff] text-xs mt-0.5 shrink-0 select-none font-bold">
                        •
                      </span>
                      <div className="text-neutral-700 leading-relaxed">
                        {parseInlineMarkdown(item)}
                      </div>
                    </div>
                  ))}
                </div>
              );

            case "numbered_list":
              return (
                <div key={idx} className="space-y-2 my-2 pl-1">
                  {block.items.map((item, nIdx) => (
                    <div key={nIdx} className="flex items-start space-x-2.5">
                      <span className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-[#007aff] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {nIdx + 1}
                      </span>
                      <div className="text-neutral-700 leading-relaxed">
                        {parseInlineMarkdown(item)}
                      </div>
                    </div>
                  ))}
                </div>
              );

            case "code":
              return <CodeBlock key={idx} lang={block.lang} code={block.code} />;

            case "table":
              return <TableBlock key={idx} headers={block.headers} rows={block.rows} />;

            case "alert":
              return <AlertBlock key={idx} kind={block.kind} content={block.content} />;

            case "blockquote":
              return (
                <blockquote
                  key={idx}
                  className="border-l-3 border-[#007aff] bg-blue-50/40 pl-3.5 py-2 my-2.5 rounded-r-lg text-neutral-700 italic text-[12px] leading-relaxed"
                >
                  {parseInlineMarkdown(block.content)}
                </blockquote>
              );

            case "paragraph":
              return (
                <p key={idx} className="text-neutral-700 leading-relaxed my-1">
                  {parseInlineMarkdown(block.content)}
                </p>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
