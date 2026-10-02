const fs = require('fs');

let content = fs.readFileSync('src/components/MacBook.tsx', 'utf8');

const badStructure = `                {/* Terminal Window */}
                {isTerminalOpen && !isTerminalMinimized && (`;

const goodStructure = `                </div>
                {/* Terminal Window */}
                {isTerminalOpen && !isTerminalMinimized && (`;

content = content.replace(badStructure, goodStructure);

const oldEnding = `                )}
                </div>
                {/* macOS Navbar */}`;

const newEnding = `                )}
                {/* macOS Navbar */}`;

content = content.replace(oldEnding, newEnding);

fs.writeFileSync('src/components/MacBook.tsx', content);
console.log('Successfully moved terminal outside of the dock flex container');
