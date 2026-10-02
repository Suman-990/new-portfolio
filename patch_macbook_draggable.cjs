const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

// 1. Add drag state and SVG for Apple logo
if (!content.includes('const [position, setPosition]')) {
  content = content.replace(
    'const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);',
    'const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);\n  const [position, setPosition] = useState({ x: 88, y: 164 });\n  const [isDragging, setIsDragging] = useState(false);'
  );
}

// 2. Fix the Apple logo SVG
const oldAppleLogo = `<svg viewBox="0 0 384 512" width="13" height="13" fill="currentColor">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24.7 184.7 8 262c-23.7 110.1 27.6 220.1 76.4 220.1 22.3 0 36.7-14.7 66.8-14.7 30 0 42.1 14.7 68.1 14.7 51.5 0 92.4-106.6 92.4-106.6-45.5-19.1-84.1-59.5-84.1-106.8zm-72-171c14.7-19.1 25.1-43.9 21.5-69.5-22.1 1.4-48 13.6-64.6 33-14.1 15.8-26.1 41.5-22 66.8 24.8 2.2 49.3-12.8 65.1-30.3z"/>
                      </svg>`;
const newAppleLogo = `<svg viewBox="0 0 170 170" width="14" height="14" fill="currentColor" className="mb-[2px]">
                        <path d="M110.15 43.14c7.63-9.52 12.63-22.38 11.23-35.34-11.23 4.63-24.88 11.85-32.78 21.36-7 8.3-12.77 21.5-11.1 34.18 12.63 1 25.1-6.1 32.65-20.2z" />
                        <path d="M141.25 158.4c-12 17.5-24.36 34.62-43.5 35-18.7.4-24.75-11.1-46.12-11.1-21.5 0-28.2 10.74-45.75 11.5-18.33.74-32.3-18.15-44.55-35.75C-13.8 115 13.9 64.9 37.9 64.5c11.6-.25 22.37 7.78 29.77 7.78 7.26 0 20.37-9.65 33.92-8.3 14.5 1.13 25.4 7.27 32.64 17.77-27.76 16.14-23.16 54.95 3.37 65.5-5.9 14.82-14.33 28.5-26.35 46.15z" />
                      </svg>`;
content = content.replace(oldAppleLogo, newAppleLogo);

// 3. Make Terminal draggable
const oldTerminal = `                {/* Terminal Window */}
                {isTerminalOpen && !isTerminalMinimized && (
                  <div 
                    className={\`absolute z-20 shadow-2xl transition-all duration-200 \${
                      isTerminalMaximized 
                        ? "top-6 left-0 w-full h-[calc(100%-24px)] rounded-none" 
                        : "top-[15%] left-[10%] w-[80%] rounded-md"
                    }\`}
                    style={{ fontFamily: "'Proxima Nova', 'Helvetica Neue', helvetica, arial, sans-serif" }}
                  >
                    {/* Bar */}
                    <div className={\`bg-[#191919] h-9 flex items-center px-[18px] space-x-[8px] \${isTerminalMaximized ? "rounded-none" : "rounded-t-md"}\`}>
                      <div 
                        className="w-3 h-3 rounded-full bg-[#f55551] cursor-pointer hover:brightness-110"
                        onClick={() => setIsTerminalOpen(false)}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full bg-[#f6b73e] cursor-pointer hover:brightness-110"
                        onClick={() => setIsTerminalMinimized(true)}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full bg-[#32c146] cursor-pointer hover:brightness-110"
                        onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                      ></div>
                    </div>`;

const newTerminal = `                {/* Terminal Window */}
                {isTerminalOpen && !isTerminalMinimized && (
                  <div 
                    className={\`absolute z-20 shadow-2xl \${!isDragging ? "transition-all duration-200" : ""} \${
                      isTerminalMaximized 
                        ? "rounded-none" 
                        : "w-[80%] rounded-md"
                    }\`}
                    style={{ 
                      fontFamily: "'Proxima Nova', 'Helvetica Neue', helvetica, arial, sans-serif",
                      ...(isTerminalMaximized ? { top: '24px', left: 0, width: '100%', height: 'calc(100% - 24px)' } : { top: \`\${position.y}px\`, left: \`\${position.x}px\` })
                    }}
                  >
                    {/* Bar */}
                    <div 
                      className={\`bg-[#191919] h-9 flex items-center px-[18px] space-x-[8px] \${isTerminalMaximized ? "rounded-none cursor-default" : "rounded-t-md cursor-grab active:cursor-grabbing"}\`}
                      onPointerDown={(e) => {
                        if (isTerminalMaximized) return;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setIsDragging(true);
                      }}
                      onPointerMove={(e) => {
                        if (isDragging && !isTerminalMaximized) {
                          setPosition(p => ({ 
                            x: p.x + (e.movementX / 0.9118), 
                            y: p.y + (e.movementY / 0.9118) 
                          }));
                        }
                      }}
                      onPointerUp={(e) => {
                        setIsDragging(false);
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full bg-[#f55551] cursor-pointer hover:brightness-110"
                        onClick={(e) => { e.stopPropagation(); setIsTerminalOpen(false); }}
                        onPointerDown={(e) => e.stopPropagation()}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full bg-[#f6b73e] cursor-pointer hover:brightness-110"
                        onClick={(e) => { e.stopPropagation(); setIsTerminalMinimized(true); }}
                        onPointerDown={(e) => e.stopPropagation()}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full bg-[#32c146] cursor-pointer hover:brightness-110"
                        onClick={(e) => { e.stopPropagation(); setIsTerminalMaximized(!isTerminalMaximized); }}
                        onPointerDown={(e) => e.stopPropagation()}
                      ></div>
                    </div>`;

content = content.replace(oldTerminal, newTerminal);

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched dragging and apple logo');
