import { useState } from "react";
import type { PointerEvent } from "react";
import type { FinderItem } from "./types";
import MarkdownViewer from "./MarkdownViewer";
import {
  ZoomIn,
  ZoomOut,
  Download,
  ExternalLink,
  Copy,
  Check,
  Mail,
} from "lucide-react";

interface DocumentPreviewWindowProps {
  item: FinderItem;
  onClose: () => void;
  onMinimize?: () => void;
  isMaximized: boolean;
  isMinimized?: boolean;
  onToggleMaximize: () => void;
  position: { x: number; y: number };
  isDragging: boolean;
  onTitlePointerDown?: (e: PointerEvent) => void;
  onTitlePointerMove?: (e: PointerEvent) => void;
  onTitlePointerUp?: (e: PointerEvent) => void;
  onFocus?: () => void;
  zIndex?: number;
}

export default function DocumentPreviewWindow({
  item,
  onClose,
  onMinimize,
  isMaximized,
  isMinimized = false,
  onToggleMaximize,
  position,
  isDragging,
  onTitlePointerDown,
  onTitlePointerMove,
  onTitlePointerUp,
  onFocus,
  zIndex = 35,
}: DocumentPreviewWindowProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);
  const [trafficHovered, setTrafficHovered] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("sumanmahanty990@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onFocus}
      style={{
        zIndex,
        ...(isMaximized
          ? { top: "24px", left: 0, width: "100%", height: "calc(100% - 24px)" }
          : { top: `${position.y}px`, left: `${position.x}px` }),
      }}
      className={`absolute shadow-[0_25px_70px_rgba(0,0,0,0.35)] rounded-xl border border-black/15 bg-white flex flex-col overflow-hidden select-none ${
        !isDragging ? "transition-all duration-300 ease-out" : ""
      } ${
        isMaximized ? "rounded-none w-full h-full" : "w-[560px] sm:w-[620px] h-[450px]"
      } ${
        isMinimized ? "opacity-0 scale-75 pointer-events-none translate-y-10" : "opacity-100 scale-100"
      }`}
    >
      {/* Window Title & Toolbar (Light macOS Theme) */}
      <div
        className={`h-[42px] bg-[#edeef1]/95 backdrop-blur-xl border-b border-black/10 px-3 flex items-center justify-between ${
          isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
      >
        {/* Left: Traffic Lights */}
        <div
          className="flex items-center space-x-2"
          onMouseEnter={() => setTrafficHovered(true)}
          onMouseLeave={() => setTrafficHovered(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#d63f39] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            title="Close"
          >
            {trafficHovered && <span className="text-[8px] font-bold text-black/70 leading-none">✕</span>}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onMinimize) onMinimize();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#c8911f] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            title="Minimize"
          >
            {trafficHovered && <span className="text-[9px] font-bold text-black/70 leading-none -translate-y-0.5">−</span>}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#179326] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            title="Zoom"
          >
            {trafficHovered && <span className="text-[7.5px] font-bold text-black/70 leading-none">+</span>}
          </button>
        </div>

        {/* Center: Document Title & Page Count */}
        <div className="flex items-center space-x-1.5 truncate max-w-[280px]">
          <span className="text-[12px] font-semibold text-neutral-800 truncate">
            {item.name}
          </span>
          <span className="text-[10px] text-neutral-500 font-normal">
            — Preview
          </span>
        </div>

        {/* Right: Zoom & Download Toolbar */}
        <div
          className="flex items-center space-x-1 text-neutral-600"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Zoom controls for PDF & Images */}
          {(item.type === "pdf" || item.type === "image") && (
            <div className="flex items-center bg-black/[0.05] rounded-md border border-black/[0.08] px-1 py-0.5 space-x-1 text-neutral-700">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                className="p-1 hover:text-black rounded hover:bg-black/[0.06] transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={12} />
              </button>
              <span className="text-[10px] font-mono w-9 text-center text-neutral-700 select-none">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                className="p-1 hover:text-black rounded hover:bg-black/[0.06] transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={12} />
              </button>
            </div>
          )}

          {/* Download Button */}
          {item.content && (
            <a
              href={item.content}
              download={item.name}
              className="p-1.5 rounded-md hover:bg-black/[0.06] hover:text-neutral-900 text-neutral-600 transition-colors cursor-pointer flex items-center"
              title="Download File"
            >
              <Download size={13} />
            </a>
          )}

          {/* External Tab */}
          {(item.content || item.externalUrl) && (
            <a
              href={item.externalUrl || item.content}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-black/[0.06] hover:text-neutral-900 text-neutral-600 transition-colors cursor-pointer flex items-center"
              title="Open in Browser"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Window Body: Rendering Engine */}
      <div className="flex-1 bg-[#f4f5f8] overflow-hidden relative flex flex-col items-center justify-center">
        {/* PDF VIEWER */}
        {item.type === "pdf" && item.content && (
          <div
            className="w-full h-full relative bg-[#e5e7eb] overflow-auto flex justify-center p-2"
          >
            <div
              style={{
                width: `${zoomLevel}%`,
                height: "100%",
                transition: "width 0.2s ease-out",
              }}
              className="relative max-w-full h-full shadow-xl rounded-sm border border-black/10 flex flex-col"
            >
              <iframe
                src={`${item.content}#toolbar=0&navpanes=0&view=FitH`}
                title={item.name}
                className="w-full h-full border-none bg-white rounded-sm"
              />
            </div>
          </div>
        )}

        {/* IMAGE VIEWER */}
        {item.type === "image" && item.content && (
          <div
            className="w-full h-full overflow-auto flex items-center justify-center p-4 bg-[#f0f1f5]"
          >
            <img
              src={item.content}
              alt={item.name}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transition: "transform 0.15s ease-out",
              }}
              className="max-w-full max-h-full object-contain rounded-md shadow-xl border border-black/10"
            />
          </div>
        )}

        {/* MARKDOWN DOCUMENT VIEWER */}
        {item.type === "markdown" && item.content && (
          <MarkdownViewer content={item.content} />
        )}

        {/* VCARD CONTACT VIEWER */}
        {item.type === "vcard" && (
          <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-[#f8f9fc] to-[#e8ebf0]">
            <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-400 to-[#007aff] p-1 shadow-md flex items-center justify-center">
                <img
                  src="/me.jpeg"
                  alt="Suman Mahanty"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900">Suman Mahanty</h3>
                <p className="text-xs text-[#007aff] font-semibold mt-0.5">Software Engineer • Bangalore</p>
              </div>

              <div className="w-full space-y-2 text-xs">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#f4f5f8] hover:bg-[#eaecee] border border-black/10 transition-colors text-neutral-800 cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Mail size={14} className="text-[#007aff]" />
                    <span className="font-mono text-[11.5px]">sumanmahanty990@gmail.com</span>
                  </div>
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={13} className="text-neutral-400" />}
                </button>

                <div className="flex space-x-2 pt-1">
                  <a
                    href="https://www.linkedin.com/in/suman990"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-1.5 p-2 rounded-lg bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/20 transition-colors shadow-2xs font-medium"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                    </svg>
                    <span className="text-[11px]">LinkedIn</span>
                  </a>

                  <a
                    href="https://github.com/Suman-990"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-1.5 p-2 rounded-lg bg-black/5 hover:bg-black/10 text-neutral-800 border border-black/15 transition-colors shadow-2xs font-medium"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                    <span className="text-[11px]">GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
