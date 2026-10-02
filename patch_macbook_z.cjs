const fs = require('fs');

// Patch MacBook.css
let cssContent = fs.readFileSync('src/components/MacBook.css', 'utf8');
cssContent = cssContent.replace('transform: translateZ(-580px) rotateX(0deg);', 'transform: scale(0.9118) rotateX(0deg);');
cssContent = cssContent.replace('-webkit-transform: translateZ(-580px) rotateX(0deg);', '-webkit-transform: scale(0.9118) rotateX(0deg);');
fs.writeFileSync('src/components/MacBook.css', cssContent);

// Patch MacBook.tsx
let tsxContent = fs.readFileSync('src/components/MacBook.tsx', 'utf8');
tsxContent = tsxContent.replace('openEl.style.transform = `translateZ(-580px) rotateX(${openRotate}deg)`', 'openEl.style.transform = `scale(0.9118) rotateX(${openRotate}deg)`');
fs.writeFileSync('src/components/MacBook.tsx', tsxContent);

console.log('Successfully patched Z-translation to scale');
