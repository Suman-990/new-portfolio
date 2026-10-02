const fs = require('fs');

let tsxContent = fs.readFileSync('src/components/MacBook.tsx', 'utf8');
tsxContent = tsxContent.replace(
  'className="screen-close"',
  'className="screen-close pointer-events-none"'
);
fs.writeFileSync('src/components/MacBook.tsx', tsxContent);

console.log('Successfully patched pointer events');
