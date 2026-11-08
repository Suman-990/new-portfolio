import { useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Columns3,
  Eye,
  Search,
  X,
  Share2,
  PanelLeft,
} from "lucide-react";
import type { FinderViewMode } from "./types";

interface FinderToolbarProps {
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  viewMode: FinderViewMode;
  onViewModeChange: (mode: FinderViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickLook: () => void;
  onClose: (e: MouseEvent) => void;
  onMinimize: (e: MouseEvent) => void;
  onMaximize: (e: MouseEvent) => void;
  isMaximized: boolean;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onTitlePointerDown?: (e: PointerEvent) => void;
  onTitlePointerMove?: (e: PointerEvent) => void;
  onTitlePointerUp?: (e: PointerEvent) => void;
}

export default function FinderToolbar({
  title,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onQuickLook,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  isSidebarOpen = true,
  onToggleSidebar,
  onTitlePointerDown,
  onTitlePointerMove,
  onTitlePointerUp,
}: FinderToolbarProps) {
  const [trafficHovered, setTrafficHovered] = useState(false);

  return (
    <div
      className={`h-[40px] sm:h-[44px] bg-[#edeef1]/95 backdrop-blur-xl border-b border-black/10 px-2 sm:px-3 flex items-center justify-between select-none ${
        isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      }`}
      onPointerDown={onTitlePointerDown}
      onPointerMove={onTitlePointerMove}
      onPointerUp={onTitlePointerUp}
    >
      {/* Left Section: Traffic Lights & Navigation */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {/* Traffic Lights */}
        <div
          className="flex items-center space-x-1.5 sm:space-x-2 relative group"
          onMouseEnter={() => setTrafficHovered(true)}
          onMouseLeave={() => setTrafficHovered(false)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose(e);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#d63f39] flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Close"
          >
            {trafficHovered && (
              <span className="text-[8px] font-bold text-black/70 leading-none select-none">✕</span>
            )}
          </button>

          {/* Minimize */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(e);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#c8911f] flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Minimize"
          >
            {trafficHovered && (
              <span className="text-[9px] font-bold text-black/70 leading-none -translate-y-0.5 select-none">−</span>
            )}
          </button>

          {/* Zoom */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(e);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#179326] flex items-center justify-center cursor-pointer transition-transform active:scale-90"
            title="Zoom"
          >
            {trafficHovered && (
              <span className="text-[7.5px] font-bold text-black/70 leading-none select-none">+</span>
            )}
          </button>
        </div>

        {/* Sidebar Toggle Button (macOS native style) */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSidebar();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isSidebarOpen
                ? "text-[#007aff] bg-black/[0.06]"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04]"
            }`}
            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <PanelLeft size={13} />
          </button>
        )}

        {/* Back / Forward History */}
        <div className="flex items-center space-x-0.5 sm:space-x-1">
          <button
            type="button"
            disabled={!canGoBack}
            onClick={(e) => {
              e.stopPropagation();
              onGoBack();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`p-1 rounded transition-colors ${
              canGoBack
                ? "text-neutral-700 hover:bg-black/[0.06] active:bg-black/10 cursor-pointer"
                : "text-neutral-300 cursor-not-allowed"
            }`}
            title="Back"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            type="button"
            disabled={!canGoForward}
            onClick={(e) => {
              e.stopPropagation();
              onGoForward();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`p-1 rounded transition-colors ${
              canGoForward
                ? "text-neutral-700 hover:bg-black/[0.06] active:bg-black/10 cursor-pointer"
                : "text-neutral-300 cursor-not-allowed"
            }`}
            title="Forward"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Current Folder Title */}
        <div className="flex items-center space-x-1 pl-0.5">
          <span className="text-[11.5px] sm:text-[12.5px] font-semibold text-neutral-800 tracking-tight truncate max-w-[70px] xs:max-w-[120px] sm:max-w-none">
            {title}
          </span>
        </div>
      </div>

      {/* Center Section: View Mode Switcher */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        <div
          className="flex items-center bg-black/[0.06] border border-black/[0.08] p-0.5 rounded-lg"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onViewModeChange("icons")}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[11px] font-medium flex items-center space-x-1 transition-all ${
              viewMode === "icons"
                ? "bg-white text-neutral-900 shadow-sm font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            title="Icon Grid View"
          >
            <LayoutGrid size={12} />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[11px] font-medium flex items-center space-x-1 transition-all ${
              viewMode === "list"
                ? "bg-white text-neutral-900 shadow-sm font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            title="List View"
          >
            <List size={12} />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("columns")}
            className={`hidden sm:flex px-2 py-1 rounded-md text-[11px] font-medium items-center space-x-1 transition-all ${
              viewMode === "columns"
                ? "bg-white text-neutral-900 shadow-sm font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            title="Miller Column View"
          >
            <Columns3 size={12} />
          </button>
        </div>

        {/* Quick Look Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickLook();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1 sm:p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 bg-white/80 hover:bg-white border border-black/10 shadow-sm transition-colors cursor-pointer"
          title="Quick Look (Spacebar)"
        >
          <Eye size={12} />
        </button>
      </div>

      {/* Right Section: Search & Share */}
      <div className="flex items-center space-x-1.5 shrink-0">
        <div
          className="relative flex items-center"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Search size={11} className="absolute left-1.5 sm:left-2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="w-14 xs:w-20 sm:w-36 pl-5 sm:pl-6 pr-4 sm:pr-6 py-0.5 text-[10px] sm:text-[11px] bg-white text-neutral-900 placeholder-neutral-400 rounded-md border border-black/15 shadow-sm focus:outline-none focus:border-[#007aff] focus:w-24 xs:focus:w-28 sm:focus:w-44 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X size={9} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (navigator.share) {
              navigator.share({
                title: "Suman Mahanty Portfolio",
                url: window.location.href,
              }).catch(() => {});
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="hidden sm:flex p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-black/[0.06] transition-colors cursor-pointer"
          title="Share"
        >
          <Share2 size={13} />
        </button>
      </div>
    </div>
  );
}
