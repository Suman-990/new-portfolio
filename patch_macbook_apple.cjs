const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

const oldAppleCode = '<div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded text-[13px] mb-[1px] leading-none flex items-center justify-center"></div>';
const newAppleCode = `<div className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded flex items-center justify-center">
                      <svg viewBox="0 0 384 512" width="13" height="13" fill="currentColor">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24.7 184.7 8 262c-23.7 110.1 27.6 220.1 76.4 220.1 22.3 0 36.7-14.7 66.8-14.7 30 0 42.1 14.7 68.1 14.7 51.5 0 92.4-106.6 92.4-106.6-45.5-19.1-84.1-59.5-84.1-106.8zm-72-171c14.7-19.1 25.1-43.9 21.5-69.5-22.1 1.4-48 13.6-64.6 33-14.1 15.8-26.1 41.5-22 66.8 24.8 2.2 49.3-12.8 65.1-30.3z"/>
                      </svg>
                    </div>`;

content = content.replace(oldAppleCode, newAppleCode);
fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully patched Apple logo');
