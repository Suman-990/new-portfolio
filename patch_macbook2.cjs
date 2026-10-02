const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

const oldTimeFunc = `    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }));
    };`;

const newTimeFunc = `    const updateTime = () => {
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
      setTime(\`\${dayName} \${monthName} \${date} \${hours}:\${minutes} \${ampm}\`);
    };`;

content = content.replace(oldTimeFunc, newTimeFunc);

const oldJsx = `{/* macOS Navbar */}
                <div className="w-full h-6 bg-black/20 backdrop-blur-md flex items-center justify-between px-3 text-white text-[11px] font-medium font-sans border-b border-white/10 shadow-sm relative z-10">`;

const newJsx = `{/* macOS Navbar */}
                <div className="w-full h-6 bg-black/20 backdrop-blur-md flex items-center justify-between px-3 text-white text-[11px] font-medium font-sans border-b border-white/10 shadow-sm relative z-10">
                  {/* Camera Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-4 bg-black rounded-b-lg flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-[#1a1a1a]">
                      <div className="w-0.5 h-0.5 bg-[#0e3b66] rounded-full"></div>
                    </div>
                  </div>`;

content = content.replace(oldJsx, newJsx);

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched MacBook.tsx again');
