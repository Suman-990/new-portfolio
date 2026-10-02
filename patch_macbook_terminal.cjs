const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

// Add states
if (!content.includes('const [isTerminalOpen')) {
  content = content.replace(
    'const [time, setTime] = useState("");',
    'const [time, setTime] = useState("");\n  const [isTerminalOpen, setIsTerminalOpen] = useState(false);\n  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);\n  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);'
  );
}

// Replace dock icon and add terminal rendering
const oldDockIcon = `                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm relative group">
                    <img src="/react_transparent.png" alt="React" className="w-6 h-6 object-contain" />
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-black/40 rounded-full"></div>
                  </div>`;

const newDockIcon = `                  <div 
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
                  </div>`;

content = content.replace(oldDockIcon, newDockIcon);

const dockEnd = `                </div>
                {/* macOS Navbar */}`;

const terminalUI = `
                {/* Terminal Window */}
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
                )}
`;

content = content.replace(dockEnd, terminalUI + dockEnd);

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched MacBook.tsx to add terminal');
