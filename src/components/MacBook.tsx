import { useEffect, useRef, useState } from "react"
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
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
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
      className="relative w-screen overflow-hidden bg-onyx py-24 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="macbook">
          <div className="screen">
            <div ref={screenCloseRef} className="screen-close pointer-events-none"></div>
            <div ref={screenOpenRef} className="screen-open">
              <div 
                ref={desktopRef} 
                className="absolute w-[94%] left-[3%] h-[88%] top-[6%] bg-cover bg-center overflow-hidden rounded-[2px]" 
                style={{ backgroundImage: "url('/macbook wallpaper.jpg')" }}
              >
                {/* Dock */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[42px] px-2 bg-white/30 border border-white/30 rounded-2xl flex items-center space-x-2 z-10 shadow-lg">
                  <div 
                    className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm relative group"
                    onClick={() => {
                      if (!isTerminalOpen) {
                        setIsTerminalOpen(true);
                        setIsTerminalMinimized(false);
                      } else if (isTerminalMinimized) {
                        setIsTerminalMinimized(false);
                      } else {
                        setIsTerminalMinimized(true);
                      }
                    }}
                  >
                    <img src="/me.jpeg" alt="Me" className="w-8 h-8 object-cover rounded-[8px]" />
                    {isTerminalOpen && !isTerminalMinimized && (
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-black/40 rounded-full"></div>
                    )}
                  </div>
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm">
                    <img src="/javascript_transparent.png" alt="JS" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm">
                    <img src="/nodeJS_transparent.png" alt="Node" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm">
                    <img src="/docker_transparent.png" alt="Docker" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm">
                    <img src="/github_transparent.png" alt="Github" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="w-px h-7 bg-white/30 mx-1"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-300 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm border border-gray-300">
                    <div className="w-4 h-5 border-2 border-blue-400 rounded-sm bg-white/50"></div>
                  </div>

                </div>
                {/* Terminal Window */}
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
                      className={`p-3 text-gray-200 text-[13px] font-mono leading-relaxed overflow-auto ${isTerminalMaximized ? "h-[calc(100%-28px)]" : "h-[calc(100%-28px)]"}`}
                    >
                      <div className="flex flex-col">
                        <div className="opacity-70 mb-1">Last login: {new Date().toDateString()} on ttys000</div>
                        <div className="flex items-center">
                          <span className="text-[#27c93f] font-bold mr-2">suman@macbook ~ %</span>
                          <span className="text-white">echo "Hello, World!"</span>
                        </div>
                        <div className="text-white mt-1 mb-1">Hello, World!</div>
                        <div className="flex items-center">
                          <span className="text-[#27c93f] font-bold mr-2">suman@macbook ~ %</span>
                          <span className="w-2 h-3.5 bg-gray-400 animate-[pulse_1s_ease-in-out_infinite] ml-1"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* macOS Navbar */}
                <div className="w-full h-6 bg-[#1a1a1a]/40 flex items-center justify-between px-3 text-white text-[11px] font-medium font-sans border-b border-white/10 shadow-sm relative z-10">
                  {/* Left items */}
                  <div className="flex items-center space-x-1">
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded flex items-center justify-center">
                      <svg viewBox="0 0 170 170" width="14" height="14" fill="currentColor" className="mb-[2px]">
                        <path d="M110.15 43.14c7.63-9.52 12.63-22.38 11.23-35.34-11.23 4.63-24.88 11.85-32.78 21.36-7 8.3-12.77 21.5-11.1 34.18 12.63 1 25.1-6.1 32.65-20.2z" />
                        <path d="M141.25 158.4c-12 17.5-24.36 34.62-43.5 35-18.7.4-24.75-11.1-46.12-11.1-21.5 0-28.2 10.74-45.75 11.5-18.33.74-32.3-18.15-44.55-35.75C-13.8 115 13.9 64.9 37.9 64.5c11.6-.25 22.37 7.78 29.77 7.78 7.26 0 20.37-9.65 33.92-8.3 14.5 1.13 25.4 7.27 32.64 17.77-27.76 16.14-23.16 54.95 3.37 65.5-5.9 14.82-14.33 28.5-26.35 46.15z" />
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
    </section>
  )
}

export default MacBook
