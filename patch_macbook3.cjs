const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

const oldJsx = `              <div 
                ref={desktopRef} 
                className="absolute w-[94%] left-[3%] h-[88%] top-[6%] bg-cover bg-center overflow-hidden rounded-[2px]" 
                style={{ backgroundImage: "url('/macbook wallpaper.jpg')" }}
              >`;

const newJsx = `              <div 
                ref={desktopRef} 
                className="absolute w-[94%] left-[3%] h-[88%] top-[6%] bg-cover bg-center overflow-hidden rounded-[2px]" 
                style={{ backgroundImage: "url('/macbook wallpaper.jpg')" }}
              >
                {/* Dock */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[42px] px-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center space-x-2 z-10 shadow-lg">
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm relative group">
                    <img src="/react_transparent.png" alt="React" className="w-6 h-6 object-contain drop-shadow-sm" />
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-black/40 rounded-full"></div>
                  </div>
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm">
                    <img src="/javascript_transparent.png" alt="JS" className="w-6 h-6 object-contain drop-shadow-sm" />
                  </div>
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm">
                    <img src="/nodeJS_transparent.png" alt="Node" className="w-6 h-6 object-contain drop-shadow-sm" />
                  </div>
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm">
                    <img src="/docker_transparent.png" alt="Docker" className="w-6 h-6 object-contain drop-shadow-sm" />
                  </div>
                  <div className="w-8 h-8 bg-white/90 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm">
                    <img src="/github_transparent.png" alt="Github" className="w-6 h-6 object-contain drop-shadow-sm" />
                  </div>
                  <div className="w-px h-7 bg-white/30 mx-1"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-300 rounded-[8px] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-sm border border-gray-300">
                    <div className="w-4 h-5 border-2 border-blue-400 rounded-sm bg-white/50"></div>
                  </div>
                </div>`;

content = content.replace(oldJsx, newJsx);

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched dock');
