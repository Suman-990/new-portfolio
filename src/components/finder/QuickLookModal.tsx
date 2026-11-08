import { useEffect } from "react";
import type { FinderItem } from "./types";
import { FinderItemIcon } from "./FinderIcons";
import { X, Eye } from "lucide-react";

interface QuickLookModalProps {
  item: FinderItem | null;
  onClose: () => void;
  onOpenWithPreview: (item: FinderItem) => void;
}

export default function QuickLookModal({
  item,
  onClose,
  onOpenWithPreview,
}: QuickLookModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs select-none animate-in fade-in zoom-in-95 duration-150"
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[420px] bg-white/95 backdrop-blur-2xl border border-black/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-10 px-3 border-b border-black/10 flex items-center justify-between bg-[#f6f6f8]">
          <button
            type="button"
            onClick={onClose}
            className="w-5 h-5 rounded-full hover:bg-black/5 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>

          <span className="text-[11.5px] font-semibold text-neutral-900 truncate max-w-[200px]">
            {item.name}
          </span>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenWithPreview(item);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#007aff] hover:bg-[#006ee6] text-white text-[10.5px] font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Eye size={10} />
            <span>Open</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col items-center justify-center space-y-4">
          {item.type === "image" && item.content ? (
            <div className="w-full h-44 rounded-xl overflow-hidden bg-neutral-100 border border-black/10 flex items-center justify-center p-2">
              <img
                src={item.content}
                alt={item.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="p-4 bg-neutral-50 rounded-2xl border border-black/10 shadow-xs flex items-center justify-center">
              <FinderItemIcon
                type={item.type}
                thumbnail={item.thumbnail}
                className="w-20 h-20"
              />
            </div>
          )}

          <div className="text-center w-full">
            <h4 className="text-sm font-semibold text-neutral-900 truncate">
              {item.name}
            </h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {item.kind || item.type.toUpperCase()} • {item.size || "Unknown"}
            </p>
            {item.description && (
              <p className="text-[11px] text-neutral-700 mt-2 px-2.5 py-1.5 bg-neutral-50 rounded-lg border border-black/5 line-clamp-3">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer tip */}
        <div className="h-7 bg-[#f6f6f8] border-t border-black/10 px-3 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>Quick Look</span>
          <span>Press Space or Esc to close</span>
        </div>
      </div>
    </div>
  );
}
