const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// The problem: bindStaticEvents is missing its closing }
// It ends with the "Close More Menu" listener but has no closing }
// Then AUTH section starts without the function being closed

// Find the pattern: two newlines before "// AUTH" comment
// and add a closing } for bindStaticEvents

const authMarker = '\n\n// ══════════════════════════════════════\n// AUTH\n// ══════════════════════════════════════';
const idx = content.indexOf(authMarker);

if (idx === -1) {
  console.log('AUTH marker not found, trying CRLF...');
  const authMarkerCRLF = '\r\n\r\n// ══════════════════════════════════════\r\n// AUTH\r\n// ══════════════════════════════════════';
  const idx2 = content.indexOf(authMarkerCRLF);
  console.log('CRLF idx:', idx2);
  if (idx2 !== -1) {
    // Check what's just before the AUTH marker
    console.log('Before AUTH:', JSON.stringify(content.slice(idx2-30, idx2+10)));
  }
} else {
  // Check what's just before the AUTH marker
  const before = content.slice(idx-50, idx+10);
  console.log('Before AUTH marker:', JSON.stringify(before));
  
  // Check if there's already a } before the AUTH marker
  const trimmed = content.slice(0, idx).trimEnd();
  const lastChar = trimmed[trimmed.length - 1];
  console.log('Last char before AUTH:', JSON.stringify(lastChar));
  
  if (lastChar === '}') {
    console.log('Already has closing brace - issue is elsewhere');
  } else {
    // Add closing brace
    const fixed = content.slice(0, idx) + '\n}\n' + content.slice(idx);
    fs.writeFileSync('app.js', fixed, 'utf8');
    console.log('Added closing } for bindStaticEvents');
  }
}
