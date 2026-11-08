import type { FinderItem } from "../types";
import { FinderItemIcon } from "../FinderIcons";

interface IconGridViewProps {
  items: FinderItem[];
  selectedItemId: string | null;
  onSelectItem: (item: FinderItem) => void;
  onOpenItem: (item: FinderItem) => void;
}

export default function IconGridView({
  items,
  selectedItemId,
  onSelectItem,
  onOpenItem,
}: IconGridViewProps) {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-8 select-none">
        <p className="text-xs">No items in this folder</p>
      </div>
    );
  }

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="flex-1 p-4 overflow-y-auto select-none bg-white"
      onClick={() => {
        // Deselect when clicking on empty canvas
      }}
    >
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-5 gap-x-3 items-start">
        {items.map((item) => {
          const isSelected = selectedItemId === item.id;

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(item);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onOpenItem(item);
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Icon Container */}
              <div
                className={`relative p-2 rounded-xl transition-all duration-150 flex items-center justify-center ${
                  isSelected
                    ? "bg-blue-50/80 shadow-xs ring-1 ring-[#007aff]/60"
                    : "group-hover:bg-black/[0.04]"
                }`}
              >
                <FinderItemIcon
                  type={item.type}
                  thumbnail={item.thumbnail}
                  className="w-12 h-12 sm:w-14 sm:h-14 transition-transform group-hover:scale-105"
                />

                {/* Tag color dot */}
                {item.tags && item.tags.length > 0 && (
                  <span
                    className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs ${
                      item.tags[0] === "Featured"
                        ? "bg-red-500"
                        : item.tags[0] === "Production"
                        ? "bg-emerald-500"
                        : "bg-[#007aff]"
                    }`}
                  />
                )}
              </div>

              {/* Title Label */}
              <div className="mt-1 text-center max-w-[95px]">
                <span
                  className={`text-[11px] leading-tight line-clamp-2 px-1.5 py-0.5 rounded transition-colors break-words ${
                    isSelected
                      ? "bg-[#007aff] text-white font-medium shadow-sm"
                      : "text-neutral-800 group-hover:text-neutral-900"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
