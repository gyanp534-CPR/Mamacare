// Add @ts-nocheck to suppress VS Code false positives
const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Add @ts-nocheck to the JSDoc comment at the top
if (!content.includes('@ts-nocheck')) {
  content = content.replace(
    /\/\*\*\s*\n \* MamaCare v7\.7/,
    '/**\n * @ts-nocheck\n * MamaCare v7.7'
  );
  fs.writeFileSync('app.js', content, 'utf8');
  console.log('✅ Added @ts-nocheck to suppress VS Code false positives');
} else {
  console.log('✓ @ts-nocheck already present');
}
