const fs = require('fs');
let content = fs.readFileSync('src/components/MacBook.css', 'utf8');
content = content.replace(/\.macbook \.screen-open img \{[\s\S]*?\}/, '');
fs.writeFileSync('src/components/MacBook.css', content);
console.log('Removed global img styling from MacBook.css');
