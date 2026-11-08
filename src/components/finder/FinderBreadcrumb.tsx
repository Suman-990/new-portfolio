import { Fragment } from "react";
import { ChevronRight, HardDrive } from "lucide-react";

interface FinderBreadcrumbProps {
  pathSegments: { label: string; folderId?: string }[];
  itemCount: number;
  onNavigate: (folderId: string) => void;
}

export default function FinderBreadcrumb({
  pathSegments,
  itemCount,
  onNavigate,
}: FinderBreadcrumbProps) {
  return (
    <div className="h-6 bg-[#f6f6f8] border-t border-black/10 px-3 flex items-center justify-between text-[10.5px] text-neutral-600 select-none">
      {/* Path Breadcrumbs */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
        <HardDrive size={10} className="text-neutral-500 shrink-0 mr-0.5" />
        <span className="text-neutral-500 font-mono shrink-0">Macintosh HD</span>
        <ChevronRight size={10} className="text-neutral-400 shrink-0" />
        <span className="text-neutral-500 font-mono shrink-0">Users</span>
        <ChevronRight size={10} className="text-neutral-400 shrink-0" />
        <span className="text-neutral-500 font-mono shrink-0">suman</span>

        {pathSegments.map((segment, idx) => (
          <Fragment key={`${segment.label}-${idx}`}>
            <ChevronRight size={10} className="text-neutral-400 shrink-0" />
            {segment.folderId ? (
              <button
                type="button"
                onClick={() => onNavigate(segment.folderId!)}
                className="text-neutral-700 hover:text-black hover:underline cursor-pointer truncate font-medium"
              >
                {segment.label}
              </button>
            ) : (
              <span className="text-neutral-900 font-semibold truncate">
                {segment.label}
              </span>
            )}
          </Fragment>
        ))}
      </div>

      {/* Item count */}
      <div className="shrink-0 pl-2 text-[10px] text-neutral-500 font-mono">
        {itemCount} {itemCount === 1 ? "item" : "items"}, 412.8 GB available
      </div>
    </div>
  );
}
