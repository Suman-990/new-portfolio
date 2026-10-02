const fs = require('fs');

let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

if (!content.includes('const terminalRef = useRef<HTMLDivElement>(null);')) {
  content = content.replace(
    'const [isDragging, setIsDragging] = useState(false);',
    'const [isDragging, setIsDragging] = useState(false);\n  const terminalRef = useRef<HTMLDivElement>(null);'
  );
}

const oldStart = `{/* Terminal Window */}
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
                    </div>
                    
                    {/* Body */}
                    <div 
                      className={\`bg-[#232323] p-[18px] text-white text-[14px] font-light leading-relaxed overflow-auto \${isTerminalMaximized ? "h-[calc(100%-36px)] rounded-none" : "h-[14rem] rounded-b-md"}\`}
                    >
                      <pre className="m-0 whitespace-pre-wrap font-inherit">
                        <div className="opacity-50"># run this command:</div>
                        <div>
                          <span className="opacity-70 mr-2">$</span>
                          <span className="text-[#32c146]">echo hi</span>
                        </div>
                        <div>hi</div>
                        <div>
                          <span className="opacity-70 mr-2">$</span>
                          <span className="animate-[pulse_1s_ease-in-out_infinite]">_</span>
                        </div>
                      </pre>
                    </div>
                  </div>
                )}`;

const newStart = `{/* Terminal Window */}
                {isTerminalOpen && (
                  <div 
                    ref={terminalRef}
                    className={\`absolute z-20 shadow-2xl rounded-lg border border-white/20 bg-black/70 backdrop-blur-xl \${!isDragging ? "transition-all duration-300 ease-out" : ""} \${
                      isTerminalMaximized 
                        ? "rounded-none" 
                        : "w-[480px] h-[360px]"
                    } \${isTerminalMinimized ? "opacity-0 scale-75 pointer-events-none translate-y-10" : "opacity-100 scale-100"}\`}
                    style={{ 
                      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                      ...(isTerminalMaximized ? { top: '24px', left: 0, width: '100%', height: 'calc(100% - 24px)' } : { top: \`\${position.y}px\`, left: \`\${position.x}px\` })
                    }}
                  >
                    {/* Bar */}
                    <div 
                      className={\`h-7 flex items-center px-3 relative border-b border-white/10 \${isTerminalMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"}\`}
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
                            
                            const maxX = desktopRef.current.clientWidth - terminalRef.current.clientWidth;
                            const maxY = desktopRef.current.clientHeight - terminalRef.current.clientHeight;
                            
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
                      className={\`p-3 text-gray-200 text-[13px] font-mono leading-relaxed overflow-auto \${isTerminalMaximized ? "h-[calc(100%-28px)]" : "h-[calc(100%-28px)]"}\`}
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
                )}`;

if (content.indexOf(oldStart) !== -1) {
  content = content.replace(oldStart, newStart);
  fs.writeFileSync('src/components/MacBook.tsx', content);
  console.log('Successfully applied macOS terminal design and limits');
} else {
  console.log('Failed to find old code.');
}
