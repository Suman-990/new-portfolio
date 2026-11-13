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
  MapPin,
  Phone,
  GraduationCap,
  Trophy,
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
    navigator.clipboard.writeText("sumanmahanty.99@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onFocus}
      style={{
        zIndex,
        ...(isMaximized
          ? { top: "24px", left: 0, width: "100%", height: "calc(100% - 24px - 36px)" }
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
        <div className="flex items-center space-x-1 truncate max-w-[95px] xs:max-w-[140px] sm:max-w-[280px]">
          <span className="text-[11.5px] sm:text-[12px] font-semibold text-neutral-800 truncate">
            {item.name}
          </span>
          <span className="text-[10px] text-neutral-500 font-normal hidden xs:inline">
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
            <div className="hidden sm:flex items-center bg-black/[0.05] rounded-md border border-black/[0.08] px-1 py-0.5 space-x-1 text-neutral-700">
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
          <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#f8f9fc] to-[#e8ebf0] overflow-y-auto">
            <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col items-center text-center space-y-3.5 my-auto">
              <div className="relative">
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
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Available for opportunities" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Suman Mahanty</h3>
                <p className="text-xs text-[#007aff] font-semibold mt-0.5">
                  Full Stack & Backend Software Engineer
                </p>
                <p className="text-[11px] text-neutral-500 mt-1 flex items-center justify-center gap-1">
                  <MapPin size={11} className="text-rose-500 shrink-0" />
                  <span>Jamshedpur, Jharkhand, India</span>
                </p>
              </div>

              {/* Education & Achievements Pills */}
              <div className="w-full space-y-1.5 pt-1">
                <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50/80 border border-blue-100 text-[10.5px] text-[#007aff] font-medium">
                  <GraduationCap size={12} className="shrink-0" />
                  <span className="truncate">Arka Jain University • BCA (CGPA 9.1/10)</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50/80 border border-amber-100 text-[10.5px] text-amber-700 font-medium">
                  <Trophy size={12} className="shrink-0 text-amber-600" />
                  <span className="truncate">Top 0.02% LeetCode • GDG TechSprint Winner</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2 text-xs pt-1">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#f4f5f8] hover:bg-[#eaecee] border border-black/10 transition-colors text-neutral-800 cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Mail size={13} className="text-[#007aff] shrink-0" />
                    <span className="font-mono text-[11px] truncate">sumanmahanty.99@gmail.com</span>
                  </div>
                  {copied ? (
                    <Check size={13} className="text-emerald-500 shrink-0 ml-1" />
                  ) : (
                    <Copy size={12} className="text-neutral-400 shrink-0 ml-1" />
                  )}
                </button>

                <a
                  href="tel:+919064961649"
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-[#f4f5f8] hover:bg-[#eaecee] border border-black/10 transition-colors text-neutral-800 cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center space-x-2">
                    <Phone size={13} className="text-emerald-600 shrink-0" />
                    <span className="font-mono text-[11px]">+91 9064961649</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-sans">Call</span>
                </a>

                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  <a
                    href="https://www.linkedin.com/in/suman990"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1 p-2 rounded-lg bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/20 transition-colors shadow-2xs font-medium"
                    title="LinkedIn Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                    </svg>
                    <span className="text-[10.5px]">LinkedIn</span>
                  </a>

                  <a
                    href="https://github.com/Suman-990"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1 p-2 rounded-lg bg-black/5 hover:bg-black/10 text-neutral-800 border border-black/15 transition-colors shadow-2xs font-medium"
                    title="GitHub Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                    <span className="text-[10.5px]">GitHub</span>
                  </a>

                  <a
                    href="https://leetcode.com/u/Suman_990/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1 p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/20 transition-colors shadow-2xs font-medium"
                    title="LeetCode Profile"
                  >
                    <span className="text-[11px] font-bold">LC</span>
                    <span className="text-[10.5px]">LeetCode</span>
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
