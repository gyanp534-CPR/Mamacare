const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
let depth = 0;
let inStr = false, strCh = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    const prev = j > 0 ? line[j-1] : '';
    if (inStr) {
      if (c === strCh && prev !== '\\') inStr = false;
    } else if (c === '"' || c === "'") {
      inStr = true; strCh = c;
    } else if (c === '{') depth++;
    else if (c === '}') depth--;
  }
  // Show depth at end of each line in range 200-290
  if (i >= 199 && i <= 289) {
    process.stdout.write(`L${i+1}:${depth} `);
  }
  // Alert if depth goes negative
  if (depth < 0) {
    console.log(`\nNEGATIVE DEPTH at line ${i+1}: "${line.trim()}"`);
    break;
  }
}
console.log('\nFinal depth:', depth);
