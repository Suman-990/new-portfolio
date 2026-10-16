import VSCodeWindow from "./VSCodeWindow";
import InteractiveTerminal from "./InteractiveTerminal";
import InteractiveKeyboard from "./InteractiveKeyboard";
import { useEffect, useRef, useState } from "react";
import { AsciiArt } from "./ui/ascii-art";
import { FloatingDockDesktop } from "./ui/floating-dock";
import "./MacBook.css"

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Eases the hinge in/out of its open and closed extremes instead of
// tracking scroll position linearly, so the motion settles rather than
// snapping the moment scroll direction reverses.
function smoothstep(t: number) {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

function MacBook() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const screenCloseRef = useRef<HTMLDivElement | null>(null)
  const screenOpenRef = useRef<HTMLDivElement | null>(null)
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const [time, setTime] = useState("");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  
  const [isShellOpen, setIsShellOpen] = useState(false)
  const [isShellMaximized, setIsShellMaximized] = useState(false)
  const [isShellMinimized, setIsShellMinimized] = useState(false)
  const [isShellDragging, setIsShellDragging] = useState(false)
  const [shellPosition, setShellPosition] = useState({ x: 120, y: 80 })
  const shellRef = useRef<HTMLDivElement>(null)
  
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false)
  const [isVSCodeMaximized, setIsVSCodeMaximized] = useState(false)
  const [isVSCodeMinimized, setIsVSCodeMinimized] = useState(false)
  const [isVSCodeDragging, setIsVSCodeDragging] = useState(false)
  const [vsCodePosition, setVsCodePosition] = useState({ x: 50, y: 40 })
  const vsCodeRef = useRef<HTMLDivElement>(null);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 88, y: 164 });
  const [isDragging, setIsDragging] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const date = now.getDate();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTime(`${dayName} ${monthName} ${date} ${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Lid openness (0 = shut, 1 = wide open) is driven off how far the
  // section's top/bottom edges have travelled through the *entire* viewport
  // height, not just a narrow band around it — so the shut lid is visible
  // the moment the section appears at the bottom of the screen, the opening
  // plays out gradually over nearly a full screen's worth of scrolling, and
  // it closes again the same way as it leaves at the top. A tight
  // entry/exit band here is what previously made the open happen almost
  // instantly off-screen.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let rafId = 0

    const applyProgress = (progress: number) => {
      const closeEl = screenCloseRef.current
      const openEl = screenOpenRef.current
      const desktop = desktopRef.current
      if (!closeEl || !openEl) return

      const eased = smoothstep(progress)
      // Stops just short of true edge-on (-90deg): a tall plane rotated
      // exactly to grazing incidence under perspective is a singularity —
      // small angle changes there swing its projected position wildly. -82
      // already reads as fully shut.
      const openRotate = lerp(-82, 0, eased)
      const opacity = lerp(0.2, 1, eased)

      // The aluminum lid cap (screen-close) was built for an instant hover
      // snap — its transform-origin sits 580px behind the element, which
      // projects it wildly off-position at in-between rotation angles
      // (fine for a 1s auto-playing transition the eye can't pause on, not
      // for a scroll-scrubbed one the user can stop anywhere in). Keep it
      // pinned at its resting "shut" pose and just crossfade it instead —
      // it only needs to read as "closed" near progress 0 anyway, since a
      // laptop lid's edge isn't visible once it's lifted even slightly.
      const closeOpacity = 1 - smoothstep(clamp(progress / 0.3, 0, 1))

      closeEl.style.opacity = `${closeOpacity}`
      openEl.style.transform = `scale(0.9118) rotateX(${openRotate}deg)`
      if (desktop) desktop.style.opacity = `${opacity}`
    }

    const measure = () => {
      rafId = 0
      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight

      // Opening ramps 0 -> 1 as the section's top travels from the bottom
      // edge of the viewport up to near the top edge.
      const openStart = viewportH
      const openEnd = viewportH * 0.15
      const openProgress = 1 - clamp((rect.top - openEnd) / (openStart - openEnd), 0, 1)

      // Closing ramps 1 -> 0 as the section's bottom travels from near the
      // top edge of the viewport up past it entirely.
      const closeStart = viewportH * 0.85
      const closeEnd = 0
      const closeProgress = clamp((rect.bottom - closeEnd) / (closeStart - closeEnd), 0, 1)

      applyProgress(Math.min(openProgress, closeProgress))
    }

    const requestMeasure = () => {
      if (rafId) return
      rafId = requestAnimationFrame(measure)
    }

    // Only pay for scroll/resize listeners while the section is anywhere
    // near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", requestMeasure, { passive: true })
          window.addEventListener("resize", requestMeasure)
          requestMeasure()
        } else {
          window.removeEventListener("scroll", requestMeasure)
          window.removeEventListener("resize", requestMeasure)
        }
      },
      { rootMargin: "0px" },
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", requestMeasure)
      window.removeEventListener("resize", requestMeasure)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 bg-transparent"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-8 flex flex-col xl:flex-row items-center xl:items-start justify-center xl:justify-between gap-12 xl:gap-8">
        {/* Left Side: MacBook (Full size, no downscaling) */}
        <div className="shrink-0 w-full max-w-[860px] xl:w-[860px]">
          <div className="macbook">
          <div className="screen">
            <div ref={screenCloseRef} className="screen-close pointer-events-none"></div>
            <div ref={screenOpenRef} className="screen-open">
              <div 
                ref={desktopRef} 
                className="absolute w-[94%] left-[3%] h-[88%] top-[6%] bg-cover bg-center overflow-hidden rounded-[2px]" 
                style={{ backgroundImage: "url('/macbook wallpaper.jpg')" }}
              >
                {/* Dock with macOS Magnification Hover Animation */}
                <FloatingDockDesktop
                  items={[
                    {
                      title: "ASCII Portrait",
                      icon: <img src="/me.jpeg" alt="Me" className="w-full h-full object-cover rounded-[7px]" />,
                      active: isTerminalOpen && !isTerminalMinimized,
                      onClick: () => {
                        if (!isTerminalOpen) {
                          setIsTerminalOpen(true);
                          setIsTerminalMinimized(false);
                        } else if (isTerminalMinimized) {
                          setIsTerminalMinimized(false);
                        } else {
                          setIsTerminalMinimized(true);
                        }
                      },
                    },
                    {
                      title: "VS Code",
                      icon: <img src="/Visual_Studio_Code_1.35_icon.svg.webp" alt="VS Code" className="w-full h-full object-contain p-0.5 rounded-[4px]" />,
                      active: isVSCodeOpen && !isVSCodeMinimized,
                      onClick: () => {
                        if (!isVSCodeOpen) {
                          setIsVSCodeOpen(true);
                          setIsVSCodeMinimized(false);
                        } else if (isVSCodeMinimized) {
                          setIsVSCodeMinimized(false);
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
                        } else if (isShellMinimized) {
                          setIsShellMinimized(false);
                        } else {
                          setIsShellMinimized(true);
                        }
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
                    {
                      title: "divider",
                      isDivider: true,
                      icon: null,
                    },
                    {
                      title: "Finder",
                      icon: <img src="/finder_icon.jpeg" alt="Finder" className="w-full h-full object-cover rounded-[7px]" />,
                    },
                  ]}
                  baseSize={32}
                  magnifiedSize={52}
                  distanceLimit={110}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[44px] z-10 bg-white/30 border border-white/30 rounded-2xl shadow-lg px-2.5 pb-1.5 gap-2 overflow-visible items-end"
                />
                {/* Terminal Window */}
                {isVSCodeOpen && (
                  <div 
                    ref={vsCodeRef}
                    className={`absolute z-30 shadow-2xl rounded-xl ${!isVSCodeDragging ? "transition-all duration-300 ease-out" : ""} ${
                      isVSCodeMaximized 
                        ? "rounded-none" 
                        : "w-[700px] h-[460px]"
                    } ${isVSCodeMinimized ? "opacity-0 scale-75 pointer-events-none translate-y-10" : "opacity-100 scale-100"}`}
                    style={{ 
                      ...(isVSCodeMaximized ? { top: '24px', left: 0, width: '100%', height: 'calc(100% - 24px)' } : { top: `${vsCodePosition.y}px`, left: `${vsCodePosition.x}px` })
                    }}
                  >
                    <VSCodeWindow 
                      className="!w-full !max-w-none !h-full !rounded-none !shadow-none !border-none"
                      isDragging={isVSCodeDragging}
                      onClose={(e: any) => { e.stopPropagation(); setIsVSCodeOpen(false); setIsVSCodeMinimized(false); }}
                      onMinimize={(e: any) => { e.stopPropagation(); setIsVSCodeMinimized(true); }}
                      onMaximize={(e: any) => { e.stopPropagation(); setIsVSCodeMaximized(!isVSCodeMaximized); }}
                      onTitlePointerDown={(e: any) => {
                        if (isVSCodeMaximized) return;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setIsVSCodeDragging(true);
                      }}
                      onTitlePointerMove={(e: any) => {
                        if (isVSCodeDragging && !isVSCodeMaximized && desktopRef.current && vsCodeRef.current) {
                          setVsCodePosition(p => {
                            let newX = p.x + (e.movementX / 0.9118);
                            let newY = p.y + (e.movementY / 0.9118);
                            
                            const maxX = desktopRef.current!.clientWidth - vsCodeRef.current!.clientWidth;
                            const maxY = desktopRef.current!.clientHeight - vsCodeRef.current!.clientHeight;
                            
                            return {
                              x: Math.max(0, Math.min(newX, maxX)),
                              y: Math.max(24, Math.min(newY, maxY))
                            };
                          });
                        }
                      }}
                      onTitlePointerUp={(e: any) => {
                        setIsVSCodeDragging(false);
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      }}
                    />
                  </div>
                )}
                {isShellOpen && (
                  <div 
                    ref={shellRef}
                    className={`absolute z-20 shadow-2xl rounded-lg border border-white/20 bg-black/70 backdrop-blur-xl ${!isShellDragging ? "transition-all duration-300 ease-out" : ""} ${
                      isShellMaximized 
                        ? "rounded-none" 
                        : "w-[480px] h-[360px]"
                    } ${isShellMinimized ? "opacity-0 scale-75 pointer-events-none translate-y-10" : "opacity-100 scale-100"}`}
                    style={{ 
                      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                      ...(isShellMaximized ? { top: '24px', left: 0, width: '100%', height: 'calc(100% - 24px)' } : { top: `${shellPosition.y}px`, left: `${shellPosition.x}px` })
                    }}
                  >
                    {/* Bar */}
                    <div 
                      className={`h-7 flex items-center px-3 relative border-b border-white/10 ${isShellMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
                      onPointerDown={(e) => {
                        if (isShellMaximized) return;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setIsShellDragging(true);
                      }}
                      onPointerMove={(e) => {
                        if (isShellDragging && !isShellMaximized && desktopRef.current && shellRef.current) {
                          setShellPosition(p => {
                            let newX = p.x + (e.movementX / 0.9118);
                            let newY = p.y + (e.movementY / 0.9118);
                            
                            const maxX = desktopRef.current!.clientWidth - shellRef.current!.clientWidth;
                            const maxY = desktopRef.current!.clientHeight - shellRef.current!.clientHeight;
                            
                            return {
                              x: Math.max(0, Math.min(newX, maxX)),
                              y: Math.max(24, Math.min(newY, maxY))
                            };
                          });
                        }
                      }}
                      onPointerUp={(e) => {
                        setIsShellDragging(false);
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      }}
                    >
                      <div className="flex space-x-2 absolute left-3">
                        <div 
                          className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:brightness-110"
                          onClick={(e) => { e.stopPropagation(); setIsShellOpen(false); setIsShellMinimized(false); }}
                          onPointerDown={(e) => e.stopPropagation()}
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:brightness-110"
                          onClick={(e) => { e.stopPropagation(); setIsShellMinimized(true); }}
                          onPointerDown={(e) => e.stopPropagation()}
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:brightness-110"
                          onClick={(e) => { e.stopPropagation(); setIsShellMaximized(!isShellMaximized); }}
                          onPointerDown={(e) => e.stopPropagation()}
                        ></div>
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
                        onOpenAsciiTerminal={() => {
                          setIsTerminalOpen(true);
                          setIsTerminalMinimized(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                {isTerminalOpen && (
                  <div 
                    ref={terminalRef}
                    className={`absolute z-20 shadow-2xl rounded-lg border border-white/20 bg-black/70 backdrop-blur-xl ${!isDragging ? "transition-all duration-300 ease-out" : ""} ${
                      isTerminalMaximized 
                        ? "rounded-none" 
                        : "w-[480px] h-[360px]"
                    } ${isTerminalMinimized ? "opacity-0 scale-75 pointer-events-none translate-y-10" : "opacity-100 scale-100"}`}
                    style={{ 
                      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                      ...(isTerminalMaximized ? { top: '24px', left: 0, width: '100%', height: 'calc(100% - 24px)' } : { top: `${position.y}px`, left: `${position.x}px` })
                    }}
                  >
                    {/* Bar */}
                    <div 
                      className={`h-7 flex items-center px-3 relative border-b border-white/10 ${isTerminalMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
                      onPointerDown={(e) => {
                        if (isTerminalMaximized) return;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setIsDragging(true);
                      }}
                      onPointerMove={(e) => {
                        if (isDragging && !isTerminalMaximized && desktopRef.current && terminalRef.current) {
                          setPosition(p => {
                            let newX = p.x + (e.movementX / 0.9118);
                            let newY = p.y + (e.movementY / 0.9118);
                            
                            const maxX = desktopRef.current!.clientWidth - terminalRef.current!.clientWidth;
                            const maxY = desktopRef.current!.clientHeight - terminalRef.current!.clientHeight;
                            
                            return {
                              x: Math.max(0, Math.min(newX, maxX)),
                              y: Math.max(24, Math.min(newY, maxY))
                            };
                          });
                        }
                      }}
                      onPointerUp={(e) => {
                        setIsDragging(false);
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      }}
                    >
                      <div className="flex space-x-2 absolute left-3">
                        <div 
                          className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:brightness-110"
                          onClick={(e) => { e.stopPropagation(); setIsTerminalOpen(false); setIsTerminalMinimized(false); }}
                          onPointerDown={(e) => e.stopPropagation()}
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:brightness-110"
                          onClick={(e) => { e.stopPropagation(); setIsTerminalMinimized(true); }}
                          onPointerDown={(e) => e.stopPropagation()}
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:brightness-110"
                          onClick={(e) => { e.stopPropagation(); setIsTerminalMaximized(!isTerminalMaximized); }}
                          onPointerDown={(e) => e.stopPropagation()}
                        ></div>
                      </div>
                      <div className="w-full text-center text-gray-400 text-[11px] font-sans font-semibold tracking-wide pointer-events-none">
                        suman — -zsh — 80x24
                      </div>
                    </div>
                    
                    {/* Body */}
                    <div 
                      className={`bg-transparent overflow-hidden rounded-b-lg ${isTerminalMaximized ? "h-[calc(100%-28px)] rounded-none" : "h-[calc(100%-28px)]"}`}
                    >
                      <AsciiArt
                        src="/suman.png"
                        resolution={140}
                        color="#e5e5e5"
                        animationStyle="typewriter"
                        
                        animateOnView={false}
                        className="w-full h-full"
                        objectFit="contain"
                      />
                    </div>
                  </div>
                )}
                {/* macOS Navbar */}
                <div className="w-full h-6 bg-[#1a1a1a]/40 flex items-center justify-between px-3 text-white text-[11px] font-medium font-sans border-b border-white/10 shadow-sm relative z-10">
                  {/* Left items */}
                  <div className="flex items-center space-x-1">
                    <div className="cursor-pointer hover:bg-white/20 h-full px-3 flex items-center justify-center transition-colors">
                      <svg viewBox="0 0 384 512" width="12" height="12" fill="currentColor" className="mb-[1px]">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                      </svg>
                    </div>
                    
                  </div>
                  {/* Right items */}
                  <div className="flex items-center space-x-1">
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded flex items-center hidden sm:flex">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>
                    </div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded flex items-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                    </div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded flex items-center hidden sm:flex">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded flex items-center hidden sm:flex">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded whitespace-nowrap">
                      {time}
                    </div>
                  </div>
                </div>
              </div>
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
          Click the dock icons at the bottom of the screen to start exploring.
        </div>

        {/* Interactive 3D Keyboard */}
        <div className="pt-14 sm:pt-20 xl:pt-28 w-full flex justify-center xl:justify-start overflow-visible">
          <InteractiveKeyboard />
        </div>
      </div>
    </div>
    </section>
  )
}

export default MacBook
