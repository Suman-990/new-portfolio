const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

// Replace imports
content = content.replace(
  'import { useEffect, useRef } from "react"',
  'import { useEffect, useRef, useState } from "react"'
);

// Replace imgRef with desktopRef
content = content.replace(
  'const imgRef = useRef<HTMLImageElement | null>(null)',
  'const desktopRef = useRef<HTMLDivElement | null>(null)\n  const [time, setTime] = useState("");\n\n  useEffect(() => {\n    const updateTime = () => {\n      const now = new Date();\n      setTime(now.toLocaleTimeString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }));\n    };\n    updateTime();\n    const timer = setInterval(updateTime, 1000);\n    return () => clearInterval(timer);\n  }, []);'
);

// Replace applyProgress variables
content = content.replace(
  'const img = imgRef.current',
  'const desktop = desktopRef.current'
);
content = content.replace(
  'if (img) img.style.opacity = `${opacity}`',
  'if (desktop) desktop.style.opacity = `${opacity}`'
);

// Replace the return JSX part
const jsxToReplace = `<img ref={imgRef} src="/suman.png" alt="Suman Mahanty" />`;
const newJsx = `<div 
                ref={desktopRef} 
                className="absolute w-[94%] left-[3%] h-[88%] top-[6%] bg-cover bg-center overflow-hidden" 
                style={{ backgroundImage: "url('/macbook wallpaper.jpg')" }}
              >
                {/* macOS Navbar */}
                <div className="w-full h-6 bg-black/20 backdrop-blur-md flex items-center justify-between px-3 text-white text-[11px] font-medium font-sans border-b border-white/10 shadow-sm">
                  {/* Left items */}
                  <div className="flex items-center space-x-1">
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded text-sm mb-0.5 leading-none flex items-center justify-center"></div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded font-bold">Finder</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">File</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden sm:block">Edit</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden sm:block">View</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden md:block">Go</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden md:block">Window</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden md:block">Help</div>
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
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">
                      {time}
                    </div>
                  </div>
                </div>
              </div>`;

content = content.replace(jsxToReplace, newJsx);

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched MacBook.tsx');
