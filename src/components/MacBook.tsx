import VSCodeWindow from "./VSCodeWindow";
import InteractiveTerminal, { type HistoryEntry } from "./InteractiveTerminal";
import InteractiveKeyboard from "./InteractiveKeyboard";
import FinderWindow from "./finder/FinderWindow";
import DocumentPreviewWindow from "./finder/DocumentPreviewWindow";
import type { FinderItem, FinderViewMode } from "./finder/types";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, Minimize2 } from "lucide-react";
import { FloatingDockDesktop } from "./ui/floating-dock";
import "./MacBook.css";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Eases the hinge in/out of its open and closed extremes instead of
// tracking scroll position linearly, so the motion settles rather than
// snapping the moment scroll direction reverses.
function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function MacBook() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const screenCloseRef = useRef<HTMLDivElement | null>(null);
  const screenOpenRef = useRef<HTMLDivElement | null>(null);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const [dateTime, setDateTime] = useState({ date: "", time: "" });

  // Focused Mode State (fullscreen theater mode for MacBook screen)
  const [isFocusedMode, setIsFocusedMode] = useState(false);

  // Window Focus State
  type WindowId = "finder" | "preview" | "vscode" | "shell";
  const [focusedWindow, setFocusedWindow] = useState<WindowId>("finder");

  // Finder Window State
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isFinderMaximized, setIsFinderMaximized] = useState(false);
  const [isFinderMinimized, setIsFinderMinimized] = useState(false);
  const [isFinderDragging, setIsFinderDragging] = useState(false);
  const [finderPosition, setFinderPosition] = useState({ x: 30, y: 32 });

  // Lifted Finder State for persistence across modes
  const [finderFolderId, setFinderFolderId] = useState<string>("documents");
  const [finderSelectedId, setFinderSelectedId] = useState<string | null>("resume-pdf");
  const [finderViewMode, setFinderViewMode] = useState<FinderViewMode>("icons");
  const [finderSearchQuery, setFinderSearchQuery] = useState<string>("");

  // Document Preview Window State (macOS Preview.app)
  const [previewItem, setPreviewItem] = useState<FinderItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [isPreviewMinimized, setIsPreviewMinimized] = useState(false);
  const [isPreviewDragging, setIsPreviewDragging] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 90, y: 36 });

  // Terminal Window State
  const [isShellOpen, setIsShellOpen] = useState(false);
  const [isShellMaximized, setIsShellMaximized] = useState(false);
  const [isShellMinimized, setIsShellMinimized] = useState(false);
  const [isShellDragging, setIsShellDragging] = useState(false);
  const [shellPosition, setShellPosition] = useState({ x: 120, y: 80 });
  const [terminalHistory, setTerminalHistory] = useState<HistoryEntry[]>([]);
  const shellRef = useRef<HTMLDivElement>(null);

  // VS Code Window State
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);
  const [isVSCodeMaximized, setIsVSCodeMaximized] = useState(false);
  const [isVSCodeMinimized, setIsVSCodeMinimized] = useState(false);
  const [isVSCodeDragging, setIsVSCodeDragging] = useState(false);
  const [vsCodePosition, setVsCodePosition] = useState({ x: 50, y: 40 });
  const vsCodeRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const getZIndex = (win: WindowId) => {
    if (focusedWindow === win) return 35;
    if (win === "preview") return 30;
    if (win === "finder") return 25;
    if (win === "vscode") return 22;
    if (win === "shell") return 20;
    return 20;
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const date = now.getDate();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setDateTime({
        date: `${dayName} ${monthName} ${date}`,
        time: `${hours}:${minutes} ${ampm}`,
      });
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Esc key to exit focused screen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocusedMode) {
        setIsFocusedMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusedMode]);

  // Lock body scroll when in focused mode
  useEffect(() => {
    if (isFocusedMode) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isFocusedMode]);

  // Clamp window positions back into standard laptop screen boundaries when leaving focused mode
  useEffect(() => {
    if (!isFocusedMode) {
      const maxX = desktopRef.current?.clientWidth ? desktopRef.current.clientWidth - 150 : 640;
      const maxY = desktopRef.current?.clientHeight ? desktopRef.current.clientHeight - 150 : 380;
      setFinderPosition((p) => ({
        x: Math.min(Math.max(0, p.x), maxX),
        y: Math.min(Math.max(24, p.y), maxY),
      }));
      setPreviewPosition((p) => ({
        x: Math.min(Math.max(0, p.x), maxX),
        y: Math.min(Math.max(24, p.y), maxY),
      }));
      setShellPosition((p) => ({
        x: Math.min(Math.max(0, p.x), maxX),
        y: Math.min(Math.max(24, p.y), maxY),
      }));
      setVsCodePosition((p) => ({
        x: Math.min(Math.max(0, p.x), maxX),
        y: Math.min(Math.max(24, p.y), maxY),
      }));
    }
  }, [isFocusedMode]);

  // Lid state tracking for interactive dragging & scroll scrubbing
  const currentProgressRef = useRef(1);
  const isLidDraggingRef = useRef(false);
  const isLidClosedRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartProgressRef = useRef(1);
  const hasMovedRef = useRef(false);
  const snapRafRef = useRef<number | null>(null);

  const applyProgress = (progress: number) => {
    const closeEl = screenCloseRef.current;
    const openEl = screenOpenRef.current;
    const desktop = desktopRef.current;
    if (!closeEl || !openEl) return;

    const clamped = clamp(progress, 0, 1);
    const eased = smoothstep(clamped);

    // Rotate fully to -90deg (flat horizontal) when progress is 0, up to 0deg (upright) at 1
    const openRotate = lerp(-90, 0, eased);

    // Fade out screen frame and desktop content as it reaches fully shut (below 0.18 progress)
    const openOpacity = smoothstep(clamp(clamped / 0.18, 0, 1));
    const desktopOpacity = lerp(0, 1, eased);

    // Fade in aluminum closed lid cap when closing (below 0.28 progress)
    const closeOpacity = 1 - smoothstep(clamp(clamped / 0.28, 0, 1));

    closeEl.style.opacity = `${closeOpacity}`;
    closeEl.style.pointerEvents = closeOpacity > 0.05 ? "auto" : "none";

    openEl.style.transform = `scale(0.9118) rotateX(${openRotate}deg)`;
    openEl.style.opacity = `${openOpacity}`;
    openEl.style.pointerEvents = openOpacity > 0.05 ? "auto" : "none";

    if (desktop) desktop.style.opacity = `${desktopOpacity}`;
  };

  const animateLidTo = (target: number) => {
    if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current);
    let startTime: number | null = null;
    const startVal = currentProgressRef.current;
    const duration = 280;

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = clamp(elapsed / duration, 0, 1);
      const easedT = 1 - Math.pow(1 - t, 3);
      const val = lerp(startVal, target, easedT);
      currentProgressRef.current = val;
      applyProgress(val);

      if (t < 1) {
        snapRafRef.current = requestAnimationFrame(step);
      } else {
        snapRafRef.current = null;
      }
    };
    snapRafRef.current = requestAnimationFrame(step);
  };

  const handleLidPointerDown = (e: React.PointerEvent) => {
    if (snapRafRef.current) {
      cancelAnimationFrame(snapRafRef.current);
      snapRafRef.current = null;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    isLidDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartYRef.current = e.clientY;
    dragStartProgressRef.current = currentProgressRef.current;
  };

  const handleLidPointerMove = (e: React.PointerEvent) => {
    if (!isLidDraggingRef.current) return;
    const deltaY = e.clientY - dragStartYRef.current;
    if (Math.abs(deltaY) > 4) {
      hasMovedRef.current = true;
    }
    // ~140px on mobile, ~250px on desktop drag distance for complete 0 <-> 1 range
    const sensitivity = isMobile ? 140 : 250;
    const newProgress = clamp(dragStartProgressRef.current - deltaY / sensitivity, 0, 1);
    currentProgressRef.current = newProgress;
    applyProgress(newProgress);
  };

  const handleLidPointerUp = (e: React.PointerEvent) => {
    if (!isLidDraggingRef.current) return;
    isLidDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    // If it was a quick click/tap on the closed lid without dragging: open it!
    if (!hasMovedRef.current && isLidClosedRef.current) {
      isLidClosedRef.current = false;
      animateLidTo(1);
      return;
    }

    // If dragged almost closed (< 0.25): snap shut and stay closed on scroll
    if (currentProgressRef.current < 0.25) {
      isLidClosedRef.current = true;
      animateLidTo(0);
    } else {
      // If dragged open (>= 0.25): snap open to 1 and resume normal scroll animation
      isLidClosedRef.current = false;
      animateLidTo(1);
    }
  };

  // Lid openness (0 = shut, 1 = wide open) is driven off how far the
  // section's top/bottom edges have travelled through the *entire* viewport
  // height, preserving scroll-scrubbed motion only while the lid is open
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;

    const measure = () => {
      rafId = 0;
      // Do not override while the user is actively dragging the lid
      if (isLidDraggingRef.current) return;

      // When the lid has been closed, maintain it closed even when scrolling
      if (isLidClosedRef.current) {
        applyProgress(0);
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight;

      const openStart = viewportH;
      const openEnd = viewportH * 0.15;
      const openProgress = 1 - clamp((rect.top - openEnd) / (openStart - openEnd), 0, 1);

      const closeStart = viewportH * 0.85;
      const closeEnd = 0;
      const closeProgress = clamp((rect.bottom - closeEnd) / (closeStart - closeEnd), 0, 1);

      const scrollProgress = Math.min(openProgress, closeProgress);
      currentProgressRef.current = scrollProgress;
      applyProgress(scrollProgress);
    };

    const requestMeasure = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(measure);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", requestMeasure, { passive: true });
          window.addEventListener("lenis-scroll", requestMeasure, { passive: true });
          window.addEventListener("resize", requestMeasure);
          requestMeasure();
        } else {
          window.removeEventListener("scroll", requestMeasure);
          window.removeEventListener("lenis-scroll", requestMeasure);
          window.removeEventListener("resize", requestMeasure);
        }
      },
      { rootMargin: "0px" },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("lenis-scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
      if (rafId) cancelAnimationFrame(rafId);
      if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current);
    };
  }, []);

  const getScale = () => (isFocusedMode ? 1.0 : 0.9118);

  const onFinderPointerDown = (e: React.PointerEvent) => {
    if (isFinderMaximized || isMobile) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsFinderDragging(true);
    setFocusedWindow("finder");
  };

  const onFinderPointerMove = (e: React.PointerEvent) => {
    if (isFinderDragging && !isFinderMaximized && !isMobile && desktopRef.current) {
      setFinderPosition((p) => {
        const scale = getScale();
        const newX = p.x + (e.movementX / scale);
        const newY = p.y + (e.movementY / scale);

        const maxX = desktopRef.current!.clientWidth - 660;
        const maxY = desktopRef.current!.clientHeight - 450;

        return {
          x: Math.max(0, Math.min(newX, Math.max(0, maxX))),
          y: Math.max(24, Math.min(newY, Math.max(24, maxY))),
        };
      });
    }
  };

  const onFinderPointerUp = (e: React.PointerEvent) => {
    setIsFinderDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onPreviewPointerDown = (e: React.PointerEvent) => {
    if (isPreviewMaximized || isMobile) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPreviewDragging(true);
    setFocusedWindow("preview");
  };

  const onPreviewPointerMove = (e: React.PointerEvent) => {
    if (isPreviewDragging && !isPreviewMaximized && !isMobile && desktopRef.current) {
      setPreviewPosition((p) => {
        const scale = getScale();
        const newX = p.x + (e.movementX / scale);
        const newY = p.y + (e.movementY / scale);

        const maxX = desktopRef.current!.clientWidth - 560;
        const maxY = desktopRef.current!.clientHeight - 450;

        return {
          x: Math.max(0, Math.min(newX, Math.max(0, maxX))),
          y: Math.max(24, Math.min(newY, Math.max(24, maxY))),
        };
      });
    }
  };

  const onPreviewPointerUp = (e: React.PointerEvent) => {
    setIsPreviewDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onVSCodePointerDown = (e: React.PointerEvent) => {
    if (isVSCodeMaximized || isMobile) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsVSCodeDragging(true);
    setFocusedWindow("vscode");
  };

  const onVSCodePointerMove = (e: React.PointerEvent) => {
    if (isVSCodeDragging && !isVSCodeMaximized && !isMobile && desktopRef.current && vsCodeRef.current) {
      setVsCodePosition((p) => {
        const scale = getScale();
        const newX = p.x + (e.movementX / scale);
        const newY = p.y + (e.movementY / scale);

        const maxX = desktopRef.current!.clientWidth - vsCodeRef.current!.clientWidth;
        const maxY = desktopRef.current!.clientHeight - vsCodeRef.current!.clientHeight;

        return {
          x: Math.max(0, Math.min(newX, Math.max(0, maxX))),
          y: Math.max(24, Math.min(newY, Math.max(24, maxY))),
        };
      });
    }
  };

  const onVSCodePointerUp = (e: React.PointerEvent) => {
    setIsVSCodeDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onShellPointerDown = (e: React.PointerEvent) => {
    if (isShellMaximized || isMobile) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsShellDragging(true);
    setFocusedWindow("shell");
  };

  const onShellPointerMove = (e: React.PointerEvent) => {
    if (isShellDragging && !isShellMaximized && !isMobile && desktopRef.current && shellRef.current) {
      setShellPosition((p) => {
        const scale = getScale();
        const newX = p.x + (e.movementX / scale);
        const newY = p.y + (e.movementY / scale);

        const maxX = desktopRef.current!.clientWidth - shellRef.current!.clientWidth;
        const maxY = desktopRef.current!.clientHeight - shellRef.current!.clientHeight;

        return {
          x: Math.max(0, Math.min(newX, Math.max(0, maxX))),
          y: Math.max(24, Math.min(newY, Math.max(24, maxY))),
        };
      });
    }
  };

  const onShellPointerUp = (e: React.PointerEvent) => {
    setIsShellDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const isElementScrollable = (target: HTMLElement | null, desktop: HTMLElement | null): boolean => {
    let el = target;
    while (el && el !== desktop) {
      if (el.tagName === "IFRAME") {
        return true;
      }

      const style = window.getComputedStyle(el);
      const isScrollableY =
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight + 2;
      const isScrollableX =
        (style.overflowX === "auto" || style.overflowX === "scroll") &&
        el.scrollWidth > el.clientWidth + 2;

      if (isScrollableY || isScrollableX) {
        return true;
      }

      el = el.parentElement;
    }
    return false;
  };

  const handleDesktopWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isElementScrollable(e.target as HTMLElement, desktopRef.current)) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const desktop = desktopRef.current;
    if (!desktop) return;

    const onWheel = (e: WheelEvent) => {
      if (isElementScrollable(e.target as HTMLElement, desktop)) {
        e.stopPropagation();
      }
    };

    desktop.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      desktop.removeEventListener("wheel", onWheel);
    };
  }, [isFinderOpen, isShellOpen, isPreviewOpen, isVSCodeOpen, isFocusedMode]);

  const renderDesktopContent = (isFocused: boolean) => {
    return (
      <div
        ref={desktopRef}
        onWheel={handleDesktopWheel}
        className={
          isFocused
            ? "relative w-full h-full bg-cover bg-center overflow-hidden rounded-2xl select-none"
            : "absolute w-[94%] left-[3%] h-[88%] top-[6%] bg-cover bg-center overflow-hidden rounded-[2px]"
        }
        style={{ backgroundImage: "url('/macbook wallpaper.jpg')" }}
      >
        {/* Dock with macOS Magnification Hover Animation */}
        <FloatingDockDesktop
          items={[
            {
              title: "Finder",
              icon: <img src="/finder_icon.jpeg" alt="Finder" className="w-full h-full object-cover rounded-[7px]" />,
              active: isFinderOpen && !isFinderMinimized,
              onClick: () => {
                if (!isFinderOpen) {
                  setIsFinderOpen(true);
                  setIsFinderMinimized(false);
                  setFocusedWindow("finder");
                } else if (isFinderMinimized) {
                  setIsFinderMinimized(false);
                  setFocusedWindow("finder");
                } else if (focusedWindow !== "finder") {
                  setFocusedWindow("finder");
                } else {
                  setIsFinderMinimized(true);
                }
              },
            },
            {
              title: "divider-finder",
              isDivider: true,
              icon: null,
            },
            ...(isPreviewOpen
              ? [
                  {
                    title: previewItem?.name || "Preview",
                    icon: <img src="/finder_icon.jpeg" alt="Preview" className="w-full h-full object-cover rounded-[7px] brightness-125 saturate-150" />,
                    active: isPreviewOpen && !isPreviewMinimized,
                    onClick: () => {
                      if (isPreviewMinimized) {
                        setIsPreviewMinimized(false);
                        setFocusedWindow("preview");
                      } else if (focusedWindow !== "preview") {
                        setFocusedWindow("preview");
                      } else {
                        setIsPreviewMinimized(true);
                      }
                    },
                  },
                ]
              : []),
            {
              title: "VS Code",
              icon: <img src="/Visual_Studio_Code_1.35_icon.svg.webp" alt="VS Code" className="w-full h-full object-contain p-0.5 rounded-[4px]" />,
              active: isVSCodeOpen && !isVSCodeMinimized,
              onClick: () => {
                if (!isVSCodeOpen) {
                  setIsVSCodeOpen(true);
                  setIsVSCodeMinimized(false);
                  setFocusedWindow("vscode");
                } else if (isVSCodeMinimized) {
                  setIsVSCodeMinimized(false);
                  setFocusedWindow("vscode");
                } else if (focusedWindow !== "vscode") {
                  setFocusedWindow("vscode");
                } else {
                  setIsVSCodeMinimized(true);
                }
              },
            },
            {
              title: "Terminal",
              icon: <img src="/terminal-icon.webp" alt="Terminal" className="w-full h-full object-cover rounded-[7px]" />,
              active: isShellOpen && !isShellMinimized,
              onClick: () => {
                if (!isShellOpen) {
                  setIsShellOpen(true);
                  setIsShellMinimized(false);
                  setFocusedWindow("shell");
                } else if (isShellMinimized) {
                  setIsShellMinimized(false);
                  setFocusedWindow("shell");
                } else if (focusedWindow !== "shell") {
                  setFocusedWindow("shell");
                } else {
                  setIsShellMinimized(true);
                }
              },
            },
            {
              title: isFocusedMode ? "Exit Fullscreen" : "Focus Mode",
              icon: (
                <div
                  className={`w-full h-full rounded-[7px] flex items-center justify-center p-1 transition-all ${
                    isFocusedMode
                      ? "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                      : "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-md"
                  } border border-white/20`}
                >
                  {isFocusedMode ? (
                    <Minimize2 className="w-[58%] h-[58%] text-white drop-shadow" />
                  ) : (
                    <Maximize2 className="w-[58%] h-[58%] text-white drop-shadow" />
                  )}
                </div>
              ),
              active: isFocusedMode,
              onClick: () => {
                setIsFocusedMode((prev) => !prev);
              },
            },
            {
              title: "LeetCode",
              icon: <img src="/leetcode.webp" alt="LeetCode" className="w-full h-full object-contain p-0.5" />,
              href: "https://leetcode.com/u/Suman_990/",
            },
            {
              title: "LinkedIn",
              icon: <img src="/LinkedIn_icon.svg.webp" alt="LinkedIn" className="w-full h-full object-contain p-0.5 rounded-[6px]" />,
              href: "https://www.linkedin.com/in/suman990",
            },
            {
              title: "GitHub",
              icon: <img src="/github_transparent.png" alt="Github" className="w-full h-full object-contain p-0.5" />,
              href: "https://github.com/Suman-990",
            },
          ]}
          baseSize={isFocused ? (isMobile ? 26 : 38) : (isMobile ? 20 : 32)}
          magnifiedSize={isFocused ? (isMobile ? 36 : 58) : (isMobile ? 28 : 52)}
          distanceLimit={isFocused ? (isMobile ? 70 : 140) : (isMobile ? 45 : 110)}
          className={`absolute ${isFocused ? "bottom-2 sm:bottom-3" : "bottom-1 sm:bottom-2"} left-1/2 -translate-x-1/2 ${
            isFocused ? "h-[42px] sm:h-[50px]" : "h-[32px] sm:h-[44px]"
          } z-40 bg-white/30 border border-white/30 rounded-2xl shadow-lg px-1.5 sm:px-3 pb-1 sm:pb-1.5 gap-1 sm:gap-2.5 overflow-visible items-end max-w-[96%]`}
        />

        {/* macOS Finder Window */}
        {isFinderOpen && (
          <FinderWindow
            isMaximized={isFinderMaximized || isMobile}
            isMinimized={isFinderMinimized}
            position={finderPosition}
            isDragging={isFinderDragging}
            zIndex={getZIndex("finder")}
            onClose={() => {
              setIsFinderOpen(false);
              setIsFinderMinimized(false);
            }}
            onMinimize={() => setIsFinderMinimized(true)}
            onMaximize={() => setIsFinderMaximized(!isFinderMaximized)}
            onFocus={() => setFocusedWindow("finder")}
            onTitlePointerDown={onFinderPointerDown}
            onTitlePointerMove={onFinderPointerMove}
            onTitlePointerUp={onFinderPointerUp}
            onOpenDocument={(item: FinderItem) => {
              setPreviewItem(item);
              setIsPreviewOpen(true);
              setIsPreviewMinimized(false);
              setFocusedWindow("preview");
            }}
            activeFolderId={finderFolderId}
            onActiveFolderChange={setFinderFolderId}
            selectedItemId={finderSelectedId}
            onSelectedItemIdChange={setFinderSelectedId}
            viewMode={finderViewMode}
            onViewModeChange={setFinderViewMode}
            searchQuery={finderSearchQuery}
            onSearchChange={setFinderSearchQuery}
          />
        )}

        {/* macOS Preview.app Window (For PDF Resume, Images & Documents) */}
        {isPreviewOpen && previewItem && (
          <DocumentPreviewWindow
            item={previewItem}
            isMaximized={isPreviewMaximized || isMobile}
            isMinimized={isPreviewMinimized}
            position={previewPosition}
            isDragging={isPreviewDragging}
            zIndex={getZIndex("preview")}
            onClose={() => {
              setIsPreviewOpen(false);
              setIsPreviewMinimized(false);
              setPreviewItem(null);
            }}
            onMinimize={() => setIsPreviewMinimized(true)}
            onToggleMaximize={() => setIsPreviewMaximized(!isPreviewMaximized)}
            onFocus={() => setFocusedWindow("preview")}
            onTitlePointerDown={onPreviewPointerDown}
            onTitlePointerMove={onPreviewPointerMove}
            onTitlePointerUp={onPreviewPointerUp}
          />
        )}

        {/* VS Code Window */}
        {isVSCodeOpen && (
          <div 
            ref={vsCodeRef}
            onClick={() => setFocusedWindow("vscode")}
            className={`absolute shadow-2xl rounded-xl ${!isVSCodeDragging ? "transition-all duration-300 ease-out" : ""} ${
              isVSCodeMaximized || isMobile
                ? "rounded-none" 
                : isFocused ? "w-[840px] h-[540px]" : "w-[700px] h-[460px]"
            } ${isVSCodeMinimized ? "opacity-0 scale-75 pointer-events-none translate-y-10" : "opacity-100 scale-100"}`}
            style={{ 
              zIndex: getZIndex("vscode"),
              ...(isVSCodeMaximized || isMobile ? { top: '24px', left: 0, width: '100%', height: isFocused ? 'calc(100% - 24px - 46px)' : 'calc(100% - 24px - 36px)' } : { top: `${vsCodePosition.y}px`, left: `${vsCodePosition.x}px` })
            }}
          >
            <VSCodeWindow 
              className="!w-full !max-w-none !h-full !rounded-none !shadow-none !border-none"
              isDragging={isVSCodeDragging}
              onClose={(e: React.MouseEvent) => { e.stopPropagation(); setIsVSCodeOpen(false); setIsVSCodeMinimized(false); }}
              onMinimize={(e: React.MouseEvent) => { e.stopPropagation(); setIsVSCodeMinimized(true); }}
              onMaximize={(e: React.MouseEvent) => { e.stopPropagation(); setIsVSCodeMaximized(!isVSCodeMaximized); }}
              onTitlePointerDown={onVSCodePointerDown}
              onTitlePointerMove={onVSCodePointerMove}
              onTitlePointerUp={onVSCodePointerUp}
            />
          </div>
        )}

        {/* Terminal Window */}
        {isShellOpen && (
          <div 
            ref={shellRef}
            onClick={() => setFocusedWindow("shell")}
            className={`absolute shadow-2xl rounded-lg border border-white/20 bg-black/70 backdrop-blur-xl ${!isShellDragging ? "transition-all duration-300 ease-out" : ""} ${
              isShellMaximized || isMobile
                ? "rounded-none" 
                : isFocused ? "w-[580px] h-[420px]" : "w-[480px] h-[360px]"
            } ${isShellMinimized ? "opacity-0 scale-75 pointer-events-none translate-y-10" : "opacity-100 scale-100"}`}
            style={{ 
              zIndex: getZIndex("shell"),
              fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
              ...(isShellMaximized || isMobile ? { top: '24px', left: 0, width: '100%', height: isFocused ? 'calc(100% - 24px - 46px)' : 'calc(100% - 24px - 36px)' } : { top: `${shellPosition.y}px`, left: `${shellPosition.x}px` })
            }}
          >
            {/* Bar */}
            <div 
              className={`h-7 flex items-center px-3 relative border-b border-white/10 ${isShellMaximized || isMobile ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
              onPointerDown={onShellPointerDown}
              onPointerMove={onShellPointerMove}
              onPointerUp={onShellPointerUp}
            >
              <div className="flex space-x-2 absolute left-3">
                <div 
                  className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:brightness-110"
                  onClick={(e) => { e.stopPropagation(); setIsShellOpen(false); setIsShellMinimized(false); }}
                  onPointerDown={(e) => e.stopPropagation()}
                />
                <div 
                  className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:brightness-110"
                  onClick={(e) => { e.stopPropagation(); setIsShellMinimized(true); }}
                  onPointerDown={(e) => e.stopPropagation()}
                />
                <div 
                  className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:brightness-110"
                  onClick={(e) => { e.stopPropagation(); setIsShellMaximized(!isShellMaximized); }}
                  onPointerDown={(e) => e.stopPropagation()}
                />
              </div>
              <div className="w-full text-center text-gray-400 text-[11px] font-sans font-semibold tracking-wide pointer-events-none">
                suman — -zsh — 80x24
              </div>
            </div>
            
            {/* Body */}
            <div 
              className={`bg-transparent overflow-hidden rounded-b-lg ${isShellMaximized ? "h-[calc(100%-28px)] rounded-none" : "h-[calc(100%-28px)]"}`}
            >
              <InteractiveTerminal
                history={terminalHistory}
                onHistoryChange={setTerminalHistory}
                isFocusedMode={isFocusedMode}
                onToggleFocus={() => setIsFocusedMode((prev) => !prev)}
              />
            </div>
          </div>
        )}

        {/* macOS Navbar */}
        <div className="w-full h-6 bg-[#1a1a1a]/60 backdrop-blur-md flex items-center justify-between px-2 sm:px-3 text-white text-[10.5px] sm:text-[11px] font-medium font-sans border-b border-white/10 shadow-sm relative z-40">
          {/* Left items */}
          <div className="flex items-center space-x-1 sm:space-x-2 truncate">
            <div className="cursor-pointer hover:bg-white/20 h-full px-1.5 sm:px-2 flex items-center justify-center transition-colors shrink-0">
              <svg viewBox="0 0 384 512" width="10" height="10" fill="currentColor" className="mb-[1px]">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
            </div>

            <span className="font-bold text-[11px] sm:text-[11.5px] px-1 sm:px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors shrink-0">
              {focusedWindow === "finder"
                ? "Finder"
                : focusedWindow === "preview"
                ? "Preview"
                : focusedWindow === "vscode"
                ? "Code"
                : "Terminal"}
            </span>

            <div className="hidden sm:flex items-center space-x-1 text-[11px] text-neutral-300">
              <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">File</span>
              <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
              <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">View</span>
              <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">Go</span>
              <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">Window</span>
              <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">Help</span>
            </div>
          </div>
          {/* Right items */}
          <div className="flex items-center space-x-1 shrink-0">
            <div className="cursor-pointer hover:bg-white/20 px-1 sm:px-1.5 py-0.5 rounded flex items-center hidden sm:flex">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>
            </div>
            <div className="cursor-pointer hover:bg-white/20 px-1 sm:px-1.5 py-0.5 rounded flex items-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
            </div>
            <div className="cursor-pointer hover:bg-white/20 px-1 sm:px-1.5 py-0.5 rounded flex items-center hidden sm:flex">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div className="cursor-pointer hover:bg-white/20 px-1 sm:px-1.5 py-0.5 rounded flex items-center hidden sm:flex">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <div className="cursor-pointer hover:bg-white/20 px-1 sm:px-2 py-0.5 rounded whitespace-nowrap text-[10px] sm:text-[11px]">
              <span className="hidden xs:inline">{dateTime.date} </span>
              <span>{dateTime.time}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full py-14 sm:py-20 xl:py-24 bg-transparent"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-8 flex flex-col xl:flex-row items-center xl:items-start justify-center xl:justify-between gap-10 xl:gap-8">
        {/* Left Side: MacBook (Full size, no downscaling) */}
        <div className="shrink-0 w-full max-w-[860px] xl:w-[860px]">
          <div className="macbook">
            <div className="screen">
              <div 
                ref={screenCloseRef} 
                className="screen-close cursor-grab active:cursor-grabbing pointer-events-auto touch-none select-none z-40 transition-opacity"
                title="Click or drag up to open the MacBook lid"
                onPointerDown={handleLidPointerDown}
                onPointerMove={handleLidPointerMove}
                onPointerUp={handleLidPointerUp}
                onPointerCancel={handleLidPointerUp}
              />
              <div ref={screenOpenRef} className="screen-open">
                {/* Physical Top Bezel / Lid Drag Handle */}
                <div
                  className="absolute top-0 left-0 right-0 h-9 z-50 cursor-grab active:cursor-grabbing touch-none select-none flex items-center justify-center group"
                  title="Drag down to close the MacBook lid, or drag up to open"
                  onPointerDown={handleLidPointerDown}
                  onPointerMove={handleLidPointerMove}
                  onPointerUp={handleLidPointerUp}
                  onPointerCancel={handleLidPointerUp}
                >
                  {/* Subtle affordance line on hover */}
                  <div className="w-16 h-1 rounded-full bg-white/0 group-hover:bg-white/25 transition-all pointer-events-none mt-1 shadow-sm" />
                </div>

                {isFocusedMode ? (
                  <div 
                    className="absolute w-[94%] left-[3%] h-[88%] top-[6%] bg-[#080d1a]/92 backdrop-blur-md rounded-[2px] flex flex-col items-center justify-center p-6 text-center text-white border border-cyan-500/25 overflow-hidden"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold tracking-wide text-white mb-1">
                      Focused Screen Active
                    </h4>
                    <p className="text-[10.5px] text-neutral-400 max-w-xs mb-3">
                      Retina display expanded into focused screen mode.
                    </p>
                    <button
                      onClick={() => setIsFocusedMode(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-[11px] font-medium text-cyan-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Minimize2 className="w-3 h-3" />
                      <span>Restore to Laptop</span>
                    </button>
                  </div>
                ) : (
                  renderDesktopContent(false)
                )}
              </div>
            </div>
            <div className="body"></div>
          </div>
        </div>

        {/* Right Column: Interactive Playground Info & 3D Keyboard */}
        <div className="w-full xl:w-[380px] 2xl:w-[440px] shrink-0 flex flex-col space-y-4 pt-4 xl:pt-8 items-center xl:items-start text-center xl:text-left pointer-events-auto">
          <div className="inline-flex items-center space-x-2 text-[12px] font-mono tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>guest@suman-macbook:~$</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-paper font-sans">
            Interactive Playground
          </h2>

          <div className="text-[12px] text-gray-400 font-mono flex items-center pt-1">
            <span className="text-yellow-400 mr-2 font-semibold">Tip:</span>
            Click dock icons to explore, or drag the lid to open/close.
          </div>

          {/* Interactive 3D Keyboard */}
          <div className="pt-8 sm:pt-16 xl:pt-28 w-full flex justify-center xl:justify-start overflow-x-auto sm:overflow-visible no-scrollbar py-2">
            <InteractiveKeyboard />
          </div>
        </div>
      </div>

      {/* Full-Screen Focused Screen Portal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isFocusedMode && (
              <motion.div
                key="macbook-focused-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsFocusedMode(false);
                  }
                }}
                className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden select-none"
                onWheel={(e) => e.stopPropagation()}
              >
                {/* Full-Screen Retina Display Frame with authentic 16:10 MacBook ratio */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="relative rounded-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] border border-white/20 flex flex-col bg-cover bg-center select-none"
                  style={{
                    aspectRatio: isMobile ? undefined : "16 / 10",
                    width: isMobile ? "96vw" : "min(96vw, calc(92vh * 16 / 10), 1480px)",
                    height: isMobile ? "86vh" : undefined,
                    maxHeight: "92vh",
                    backgroundImage: "url('/macbook wallpaper.jpg')",
                  }}
                >
                  {renderDesktopContent(true)}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}

export default MacBook;
