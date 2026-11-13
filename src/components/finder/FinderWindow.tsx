import { useState, useMemo, useEffect } from "react";
import type { PointerEvent } from "react";
import type { FinderItem, FinderViewMode } from "./types";
import { INITIAL_FINDER_ITEMS } from "./finderData";
import FinderToolbar from "./FinderToolbar";
import FinderSidebar from "./FinderSidebar";
import FinderBreadcrumb from "./FinderBreadcrumb";
import IconGridView from "./views/IconGridView";
import ListView from "./views/ListView";
import ColumnView from "./views/ColumnView";
import QuickLookModal from "./QuickLookModal";

interface FinderWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  isMinimized?: boolean;
  position: { x: number; y: number };
  isDragging: boolean;
  onTitlePointerDown?: (e: PointerEvent) => void;
  onTitlePointerMove?: (e: PointerEvent) => void;
  onTitlePointerUp?: (e: PointerEvent) => void;
  onOpenDocument: (item: FinderItem) => void;
  onFocus?: () => void;
  zIndex?: number;
  activeFolderId?: string;
  onActiveFolderChange?: (folderId: string) => void;
  selectedItemId?: string | null;
  onSelectedItemIdChange?: (id: string | null) => void;
  viewMode?: FinderViewMode;
  onViewModeChange?: (mode: FinderViewMode) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function FinderWindow({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  isMinimized = false,
  position,
  isDragging,
  onTitlePointerDown,
  onTitlePointerMove,
  onTitlePointerUp,
  onOpenDocument,
  onFocus,
  zIndex = 25,
  activeFolderId: externalActiveFolderId,
  onActiveFolderChange,
  selectedItemId: externalSelectedItemId,
  onSelectedItemIdChange,
  viewMode: externalViewMode,
  onViewModeChange,
  searchQuery: externalSearchQuery,
  onSearchChange,
}: FinderWindowProps) {
  const [internalActiveFolderId, setInternalActiveFolderId] = useState<string>("documents");
  const activeFolderId = externalActiveFolderId !== undefined ? externalActiveFolderId : internalActiveFolderId;
  const setActiveFolderId = onActiveFolderChange || setInternalActiveFolderId;

  const [internalSelectedItemId, setInternalSelectedItemId] = useState<string | null>("resume-pdf");
  const selectedItemId = externalSelectedItemId !== undefined ? externalSelectedItemId : internalSelectedItemId;
  const setSelectedItemId = onSelectedItemIdChange || setInternalSelectedItemId;

  const [internalViewMode, setInternalViewMode] = useState<FinderViewMode>("icons");
  const viewMode = externalViewMode !== undefined ? externalViewMode : internalViewMode;
  const setViewMode = onViewModeChange || setInternalViewMode;

  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;

  const [history, setHistory] = useState<string[]>(["documents"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isQuickLookOpen, setIsQuickLookOpen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const check = () => {
      const mobile = typeof window !== "undefined" && window.innerWidth < 640;
      setIsMobileScreen(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Filter items based on active folder, tag, or search query
  const displayedItems = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return INITIAL_FINDER_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (activeFolderId.startsWith("tag:")) {
      const targetTag = activeFolderId.replace("tag:", "");
      return INITIAL_FINDER_ITEMS.filter(
        (item) => item.tags && item.tags.includes(targetTag)
      );
    }

    if (activeFolderId === "recents") {
      // Return top 8 most recent files
      return INITIAL_FINDER_ITEMS.filter((item) => item.type !== "folder").slice(0, 8);
    }

    return INITIAL_FINDER_ITEMS.filter((item) => item.parentId === activeFolderId);
  }, [activeFolderId, searchQuery]);

  const selectedItem = useMemo(() => {
    return (
      INITIAL_FINDER_ITEMS.find((item) => item.id === selectedItemId) ||
      displayedItems[0] ||
      null
    );
  }, [selectedItemId, displayedItems]);

  // Navigate to folder
  const navigateToFolder = (folderId: string) => {
    if (folderId === activeFolderId) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setActiveFolderId(folderId);
    setSelectedItemId(null);
    setSearchQuery("");
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setActiveFolderId(history[newIdx]);
      setSelectedItemId(null);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setActiveFolderId(history[newIdx]);
      setSelectedItemId(null);
    }
  };

  const handleOpenItem = (item: FinderItem) => {
    if (item.type === "folder") {
      navigateToFolder(item.targetFolderId || item.id);
    } else if (item.type === "link" && item.externalUrl) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      onOpenDocument(item);
    }
  };

  // Keyboard shortcut listener for Spacebar (Quick Look)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && selectedItem && !isQuickLookOpen) {
        // Prevent default spacebar scrolling
        e.preventDefault();
        setIsQuickLookOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, isQuickLookOpen]);

  // Build folder title and breadcrumbs
  const currentFolderTitle = useMemo(() => {
    if (searchQuery.trim()) return `Search Results for "${searchQuery}"`;
    if (activeFolderId.startsWith("tag:")) return `Tag: ${activeFolderId.replace("tag:", "")}`;
    if (activeFolderId === "recents") return "Recents";
    if (activeFolderId === "documents") return "Documents";
    if (activeFolderId === "projects") return "Projects";
    if (activeFolderId === "desktop") return "Desktop";
    if (activeFolderId === "downloads") return "Downloads";

    const parentFolder = INITIAL_FINDER_ITEMS.find((i) => i.id === activeFolderId);
    return parentFolder ? parentFolder.name : "Finder";
  }, [activeFolderId, searchQuery]);

  const breadcrumbs = useMemo(() => {
    const segments: { label: string; folderId?: string }[] = [];
    if (activeFolderId.startsWith("project-")) {
      segments.push({ label: "Projects", folderId: "projects" });
      segments.push({ label: currentFolderTitle });
    } else {
      segments.push({ label: currentFolderTitle });
    }
    if (selectedItem && selectedItem.type !== "folder") {
      segments.push({ label: selectedItem.name });
    }
    return segments;
  }, [activeFolderId, currentFolderTitle, selectedItem]);

  return (
    <div
      onClick={onFocus}
      style={{
        zIndex,
        ...(isMaximized
          ? { top: "24px", left: 0, width: "100%", height: "calc(100% - 24px - 36px)" }
          : { top: `${position.y}px`, left: `${position.x}px` }),
      }}
      className={`absolute shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] rounded-xl border border-black/15 bg-white flex flex-col overflow-hidden select-none ${
        !isDragging ? "transition-all duration-300 ease-out" : ""
      } ${
        isMaximized ? "rounded-none w-full h-full" : "w-[660px] sm:w-[720px] h-[450px]"
      } ${
        isMinimized ? "opacity-0 scale-75 pointer-events-none translate-y-10" : "opacity-100 scale-100"
      }`}
    >
      {/* Top macOS Toolbar */}
      <FinderToolbar
        title={currentFolderTitle}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickLook={() => {
          if (selectedItem) setIsQuickLookOpen(true);
        }}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        isMaximized={isMaximized}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onTitlePointerDown={onTitlePointerDown}
        onTitlePointerMove={onTitlePointerMove}
        onTitlePointerUp={onTitlePointerUp}
      />

      {/* Main Container: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        {isSidebarOpen && (
          isMobileScreen ? (
            <div className="absolute inset-0 z-30 flex">
              <div
                className="absolute inset-0 bg-black/25 backdrop-blur-xs"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className="relative z-10 w-[180px] h-full shadow-2xl">
                <FinderSidebar
                  activeFolderId={activeFolderId}
                  onSelectFolder={(folderId) => {
                    navigateToFolder(folderId);
                    setIsSidebarOpen(false);
                  }}
                />
              </div>
            </div>
          ) : (
            <FinderSidebar
              activeFolderId={activeFolderId}
              onSelectFolder={(folderId) => navigateToFolder(folderId)}
            />
          )
        )}

        {/* Dynamic Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {viewMode === "icons" && (
            <IconGridView
              items={displayedItems}
              selectedItemId={selectedItemId}
              onSelectItem={(item) => setSelectedItemId(item.id)}
              onOpenItem={handleOpenItem}
            />
          )}

          {viewMode === "list" && (
            <ListView
              items={displayedItems}
              selectedItemId={selectedItemId}
              onSelectItem={(item) => setSelectedItemId(item.id)}
              onOpenItem={handleOpenItem}
            />
          )}

          {viewMode === "columns" && (
            <ColumnView
              items={displayedItems}
              allItems={INITIAL_FINDER_ITEMS}
              selectedItem={selectedItem}
              onSelectItem={(item) => setSelectedItemId(item.id)}
              onOpenItem={handleOpenItem}
            />
          )}
        </div>
      </div>

      {/* Bottom Path / Status Breadcrumb */}
      <FinderBreadcrumb
        pathSegments={breadcrumbs}
        itemCount={displayedItems.length}
        onNavigate={(folderId) => navigateToFolder(folderId)}
      />

      {/* Spacebar Quick Look Modal */}
      {isQuickLookOpen && selectedItem && (
        <QuickLookModal
          item={selectedItem}
          onClose={() => setIsQuickLookOpen(false)}
          onOpenWithPreview={(item) => {
            setIsQuickLookOpen(false);
            onOpenDocument(item);
          }}
        />
      )}
    </div>
  );
}
