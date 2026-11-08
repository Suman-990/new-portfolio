import type { FinderItem } from "../types";
import { FinderItemIcon } from "../FinderIcons";
import { ChevronRight, ExternalLink, Eye } from "lucide-react";

interface ColumnViewProps {
  items: FinderItem[];
  allItems: FinderItem[];
  selectedItem: FinderItem | null;
  onSelectItem: (item: FinderItem) => void;
  onOpenItem: (item: FinderItem) => void;
}

export default function ColumnView({
  items,
  allItems,
  selectedItem,
  onSelectItem,
  onOpenItem,
}: ColumnViewProps) {
  // If selected item is a folder, find its children
  const folderChildren = selectedItem && selectedItem.type === "folder"
    ? allItems.filter((i) => i.parentId === selectedItem.id)
    : [];

  return (
    <div
      className="flex-1 flex overflow-x-auto select-none font-sans text-xs divide-x divide-black/10 bg-white"
    >
      {/* Column 1: Current Folder Items */}
      <div
        className="w-[180px] sm:w-[220px] shrink-0 p-1.5 overflow-y-auto space-y-0.5 bg-white"
      >
        {items.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              onDoubleClick={() => onOpenItem(item)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#007aff] text-white font-medium shadow-sm"
                  : "text-neutral-700 hover:bg-black/[0.05]"
              }`}
            >
              <div className="flex items-center space-x-2 truncate pr-1">
                <FinderItemIcon
                  type={item.type}
                  thumbnail={item.thumbnail}
                  className="w-4 h-4 shrink-0"
                />
                <span className="truncate text-[11.5px]">{item.name}</span>
              </div>
              {item.type === "folder" && (
                <ChevronRight size={11} className={isSelected ? "text-white" : "text-neutral-400"} />
              )}
            </button>
          );
        })}
      </div>

      {/* Column 2: If folder selected, show its contents */}
      {selectedItem && selectedItem.type === "folder" && (
        <div
          className="w-[180px] sm:w-[220px] shrink-0 p-1.5 overflow-y-auto space-y-0.5 bg-[#f9fafb]"
        >
          {folderChildren.length > 0 ? (
            folderChildren.map((subItem) => (
              <button
                key={subItem.id}
                type="button"
                onClick={() => onSelectItem(subItem)}
                onDoubleClick={() => onOpenItem(subItem)}
                className="w-full flex items-center justify-between px-2 py-1 rounded text-left transition-colors cursor-pointer text-neutral-700 hover:bg-black/[0.05]"
              >
                <div className="flex items-center space-x-2 truncate pr-1">
                  <FinderItemIcon
                    type={subItem.type}
                    thumbnail={subItem.thumbnail}
                    className="w-4 h-4 shrink-0"
                  />
                  <span className="truncate text-[11.5px]">{subItem.name}</span>
                </div>
                {subItem.type === "folder" && (
                  <ChevronRight size={11} className="text-neutral-400" />
                )}
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-neutral-400 text-[11px]">
              Empty folder
            </div>
          )}
        </div>
      )}

      {/* Column 3: Inspector / Preview Details Pane */}
      {selectedItem && (
        <div
          className="flex-1 min-w-[200px] p-4 flex flex-col items-center justify-between overflow-y-auto bg-[#f4f5f8] border-l border-black/10 text-neutral-800"
        >
          <div className="w-full flex flex-col items-center space-y-3 pt-2">
            {/* Big Icon / Preview */}
            <div className="p-3 bg-white rounded-2xl border border-black/10 shadow-xs flex items-center justify-center">
              <FinderItemIcon
                type={selectedItem.type}
                thumbnail={selectedItem.thumbnail}
                className="w-20 h-20"
              />
            </div>

            {/* Title & Metadata */}
            <div className="text-center w-full px-2">
              <h4 className="text-[13px] font-semibold text-neutral-900 break-words">
                {selectedItem.name}
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {selectedItem.kind || selectedItem.type.toUpperCase()} • {selectedItem.size || "Unknown size"}
              </p>
            </div>

            {/* Information Grid */}
            <div className="w-full border-t border-black/10 pt-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-neutral-500">
                <span>Modified:</span>
                <span className="text-neutral-800">{selectedItem.dateModified}</span>
              </div>
              {selectedItem.tags && (
                <div className="flex justify-between text-neutral-500">
                  <span>Tag:</span>
                  <span className="text-[#007aff] font-medium">{selectedItem.tags.join(", ")}</span>
                </div>
              )}
              {selectedItem.description && (
                <div className="pt-2 text-neutral-700 text-[10.5px] leading-relaxed bg-white p-2.5 rounded-lg border border-black/10 shadow-2xs">
                  {selectedItem.description}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full pt-4">
            <button
              type="button"
              onClick={() => onOpenItem(selectedItem)}
              className="w-full py-1.5 px-3 rounded-lg bg-[#007aff] hover:bg-[#006ee6] active:bg-[#005cd4] text-white font-medium text-[11.5px] flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer transition-all"
            >
              {selectedItem.type === "link" ? (
                <>
                  <ExternalLink size={12} />
                  <span>Open URL</span>
                </>
              ) : selectedItem.type === "folder" ? (
                <>
                  <span>Open Folder</span>
                </>
              ) : (
                <>
                  <Eye size={12} />
                  <span>Open Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
