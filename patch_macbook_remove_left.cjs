const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

const oldJsx = `                  {/* Left items */}
                  <div className="flex items-center space-x-1">
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded text-[13px] mb-[1px] leading-none flex items-center justify-center"></div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded font-bold">Finder</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">File</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden sm:block">Edit</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden sm:block">View</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden md:block">Go</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden md:block">Window</div>
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded hidden md:block">Help</div>
                  </div>`;

const newJsx = `                  {/* Left items */}
                  <div className="flex items-center space-x-1">
                    <div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded text-[13px] mb-[1px] leading-none flex items-center justify-center"></div>
                  </div>`;

content = content.replace(oldJsx, newJsx);

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched MacBook.tsx to remove left options');
