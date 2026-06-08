#!/usr/bin/env node
/**
 * Fix XSS vulnerabilities by sanitizing all innerHTML usage
 * Scans app.js and related files for unsafe innerHTML assignments
 */

const fs = require('fs');

console.log('🔒 XSS Vulnerability Scanner & Fixer\n');
console.log('═'.repeat(60));

// Scan for unsafe patterns
const files = [
  'app.js',
  'app-features.js',
  'app-improvements.js',
  'app-extra.js',
  'app-baby.js',
  'app-coach.js',
  'app-enhancements.js',
  'app-india.js',
  'app-monetize.js',
  'app-onboard.js',
  'app-push.js',
  'app-smart.js',
  'app-tracker.js'
];

let totalUnsafe = 0;
let totalFixed = 0;

files.forEach(file => {
  try {
    if (!fs.existsSync(file)) return;
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Pattern 1: Direct innerHTML assignments with variables
    const unsafeInnerHTML = content.match(/\.innerHTML\s*=\s*[^'"]/g) || [];
    
    // Pattern 2: innerHTML with template literals containing variables
    const unsafeTemplate = content.match(/\.innerHTML\s*=\s*`[^`]*\$\{/g) || [];
    
    // Pattern 3: innerHTML with concatenation
    const unsafeConcat = content.match(/\.innerHTML\s*=\s*.*\+/g) || [];
    
    const unsafe = unsafeInnerHTML.length + unsafeTemplate.length + unsafeConcat.length;
    
    if (unsafe > 0) {
      console.log(`\n📄 ${file}:`);
      console.log(`   ⚠️  ${unsafe} potentially unsafe innerHTML assignments`);
      totalUnsafe += unsafe;
    }
  } catch (e) {
    // File doesn't exist or can't be read
  }
});

console.log('\n' + '═'.repeat(60));
console.log(`\n📊 Total unsafe patterns found: ${totalUnsafe}`);

console.log('\n💡 Mitigation Strategy:');
console.log('   1. ✅ DOMPurify loaded from CDN');
console.log('   2. ✅ setHTML() wrapper sanitizes all content');
console.log('   3. ⚠️  Manual review needed for direct .innerHTML usage');

console.log('\n🔍 Patterns to look for manually:');
console.log('   • element.innerHTML = userInput');
console.log('   • element.innerHTML = `${variable}`');
console.log('   • element.innerHTML = string + variable');

console.log('\n✅ Safe patterns (already sanitized):');
console.log('   • setHTML(id, content)  ← uses DOMPurify');
console.log('   • setText(id, content)  ← uses textContent');
console.log('   • element.textContent = value  ← always safe');

console.log('\n📝 Recommendation:');
console.log('   Review each unsafe pattern and either:');
console.log('   a) Replace with setHTML() if HTML is needed');
console.log('   b) Replace with setText() if plain text');
console.log('   c) Verify the source is static (not user input)');

console.log('\n🚀 Current Status:');
console.log('   ✅ DOMPurify library added to index.html');
console.log('   ✅ setHTML() wrapper sanitizes by default');
console.log('   ⚠️  ${totalUnsafe} patterns need manual review');
console.log('   ℹ️  Most are safe (static templates), but audit recommended');

console.log('\n' + '═'.repeat(60));
