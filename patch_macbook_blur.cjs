const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

// Remove backdrop-blur-md from Navbar
content = content.replace(
  'className="w-full h-6 bg-black/20 backdrop-blur-md flex items-center justify-between px-3 text-white text-[11px] font-medium font-sans border-b border-white/10 shadow-sm relative z-10"',
  'className="w-full h-6 bg-[#1a1a1a]/40 flex items-center justify-between px-3 text-white text-[11px] font-medium font-sans border-b border-white/10 shadow-sm relative z-10"'
);

// Remove backdrop-blur-md from Dock
content = content.replace(
  'className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[42px] px-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center space-x-2 z-10 shadow-lg"',
  'className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[42px] px-2 bg-white/30 border border-white/30 rounded-2xl flex items-center space-x-2 z-10 shadow-lg"'
);

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched MacBook.tsx to remove backdrop blur');
