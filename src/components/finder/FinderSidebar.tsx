import {
  Clock,
  FileText,
  FolderGit2,
  Laptop,
  ArrowDownCircle,
  HardDrive,
} from "lucide-react";
import { SIDEBAR_SECTIONS } from "./finderData";

interface FinderSidebarProps {
  activeFolderId: string;
  onSelectFolder: (folderId: string) => void;
}

export default function FinderSidebar({
  activeFolderId,
  onSelectFolder,
}: FinderSidebarProps) {
  const renderIcon = (iconName: string, isActive: boolean, color?: string) => {
    const iconClass = isActive ? "text-white" : "text-[#007aff]";
    switch (iconName) {
      case "Clock":
        return <Clock size={13} className={iconClass} />;
      case "FileText":
        return <FileText size={13} className={iconClass} />;
      case "FolderGit2":
        return <FolderGit2 size={13} className={iconClass} />;
      case "Laptop":
        return <Laptop size={13} className={iconClass} />;
      case "ArrowDownCircle":
        return <ArrowDownCircle size={13} className={iconClass} />;
      case "Circle":
        return (
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shadow-xs shrink-0"
            style={{ backgroundColor: color || "#94a3b8" }}
          />
        );
      default:
        return <FileText size={13} className={iconClass} />;
    }
  };

  return (
    <aside
      className="w-full h-full sm:w-[170px] bg-[#f0f1f5]/95 backdrop-blur-2xl border-r border-black/10 flex flex-col justify-between py-2.5 px-2 select-none shrink-0 overflow-y-auto"
    >
      <div className="space-y-4">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.id} className="space-y-1">
            <div className="px-2 text-[10px] font-semibold text-neutral-500 tracking-wider uppercase">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeFolderId === item.folderId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectFolder(item.folderId)}
                      className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-[11.5px] transition-colors cursor-pointer text-left ${
                        isActive
                          ? "bg-[#007aff] text-white font-medium shadow-sm"
                          : "text-neutral-700 hover:bg-black/[0.05] hover:text-neutral-900 active:bg-black/10"
                      }`}
                    >
                      <span className="shrink-0 flex items-center">
                        {renderIcon(item.icon, isActive, "color" in item ? item.color : undefined)}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Storage Disk Status */}
      <div className="pt-3 border-t border-black/10 px-2 flex items-center space-x-1.5 text-[10px] text-neutral-500">
        <HardDrive size={11} className="text-neutral-500 shrink-0" />
        <span className="truncate font-mono">Macintosh HD (412 GB free)</span>
      </div>
    </aside>
  );
}
