import { useState } from "react";
import type { FinderItem } from "../types";
import { FinderItemIcon } from "../FinderIcons";
import { ArrowUpDown } from "lucide-react";

interface ListViewProps {
  items: FinderItem[];
  selectedItemId: string | null;
  onSelectItem: (item: FinderItem) => void;
  onOpenItem: (item: FinderItem) => void;
}

type SortField = "name" | "dateModified" | "size" | "kind";

export default function ListView({
  items,
  selectedItemId,
  onSelectItem,
  onOpenItem,
}: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const valA = a[sortField] || "";
    const valB = b[sortField] || "";
    const cmp = valA.localeCompare(valB);
    return sortAsc ? cmp : -cmp;
  });

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-8 select-none">
        <p className="text-xs">No items in this folder</p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto select-none font-sans text-xs bg-white"
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-black/10 text-neutral-500 text-[10.5px] font-semibold bg-[#f6f6f8] sticky top-0 z-10 backdrop-blur-md">
            <th
              className="py-1.5 px-3 cursor-pointer hover:text-neutral-900"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center space-x-1">
                <span>Name</span>
                <ArrowUpDown size={10} className="text-neutral-400" />
              </div>
            </th>
            <th
              className="py-1.5 px-3 cursor-pointer hover:text-neutral-900 hidden sm:table-cell"
              onClick={() => handleSort("dateModified")}
            >
              <div className="flex items-center space-x-1">
                <span>Date Modified</span>
                <ArrowUpDown size={10} className="text-neutral-400" />
              </div>
            </th>
            <th
              className="py-1.5 px-3 cursor-pointer hover:text-neutral-900 hidden md:table-cell"
              onClick={() => handleSort("size")}
            >
              <div className="flex items-center space-x-1">
                <span>Size</span>
                <ArrowUpDown size={10} className="text-neutral-400" />
              </div>
            </th>
            <th
              className="py-1.5 px-3 cursor-pointer hover:text-neutral-900 hidden lg:table-cell"
              onClick={() => handleSort("kind")}
            >
              <div className="flex items-center space-x-1">
                <span>Kind</span>
                <ArrowUpDown size={10} className="text-neutral-400" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => {
            const isSelected = selectedItemId === item.id;

            return (
              <tr
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSelected) {
                    onOpenItem(item);
                  } else {
                    onSelectItem(item);
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onOpenItem(item);
                }}
                className={`border-b border-black/[0.04] transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#007aff] text-white font-medium"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {/* Name */}
                <td className="py-1.5 px-3 flex items-center space-x-2.5 truncate max-w-[220px]">
                  <FinderItemIcon
                    type={item.type}
                    thumbnail={item.thumbnail}
                    className="w-4 h-4 shrink-0"
                  />
                  <span className={`truncate text-[11.5px] ${isSelected ? "text-white" : "text-neutral-900 font-normal"}`}>
                    {item.name}
                  </span>
                  {item.tags && item.tags.length > 0 && (
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 shadow-xs ${
                        item.tags[0] === "Featured"
                          ? "bg-red-500"
                          : item.tags[0] === "Production"
                          ? "bg-emerald-500"
                          : "bg-[#007aff]"
                      }`}
                    />
                  )}
                </td>

                {/* Date Modified */}
                <td className="py-1.5 px-3 text-[11px] hidden sm:table-cell truncate">
                  <span className={isSelected ? "text-white/85" : "text-neutral-500"}>{item.dateModified}</span>
                </td>

                {/* Size */}
                <td className="py-1.5 px-3 text-[11px] hidden md:table-cell truncate">
                  <span className={isSelected ? "text-white/85" : "text-neutral-500"}>{item.size || "--"}</span>
                </td>

                {/* Kind */}
                <td className="py-1.5 px-3 text-[11px] hidden lg:table-cell truncate">
                  <span className={isSelected ? "text-white/85" : "text-neutral-500"}>{item.kind || item.type}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
