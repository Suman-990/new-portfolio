const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

const notchCode = `                  {/* Camera Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-4 bg-black rounded-b-lg flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-[#1a1a1a]">
                      <div className="w-0.5 h-0.5 bg-[#0e3b66] rounded-full"></div>
                    </div>
                  </div>
`;

content = content.replace(notchCode, '');

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched MacBook.tsx to remove notch');
