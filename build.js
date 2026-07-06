/**
 * MamaCare Build Script
 * Concatenates and optionally minifies all app-*.js files
 * 
 * Usage:
 *   node build.js          → Production build (minified)
 *   node build.js --dev    → Development build (readable)
 */

const fs = require('fs');
const path = require('path');

const isDev = process.argv.includes('--dev');

console.log('═══════════════════════════════════════════════════════════');
console.log('🌸 MamaCare Build Script');
console.log('═══════════════════════════════════════════════════════════\n');

// Entry point order matters (dependencies first)
const sourceFiles = [
  'app-templates.js',    // Template helpers (MUST be first)
  'app.js',              // Core (must be second)
  'app-improvements.js', // Enhancements
  'app-push.js',         // Push notifications
  'meal-plans-indian.js',// Data
  'app-baby.js',         // Baby tracker
  'app-coach.js',        // AI coach
  'app-extra.js',        // Extra modules
  'app-features.js',     // Features
  'app-india.js',        // India-specific
  'app-monetize.js',     // Premium
  'app-onboard.js',      // Onboarding
  'app-smart.js',        // Smart features
  'app-tracker.js',      // Trackers
  'app-enhancements.js', // UI enhancements
  'app-photo-storage.js',// Photo uploads
  'app-contractions.js', // Contraction timer
  'app-pdf-report.js',   // PDF export
  'app-asha-chatbot.js', // ASHA mode
  'app-breastfeeding.js' // Breastfeeding tracker
];

// Verify all files exist
const missing = sourceFiles.filter(f => !fs.existsSync(f));
if (missing.length > 0) {
  console.error('❌ Missing files:', missing.join(', '));
  process.exit(1);
}

console.log('📦 Concatenating files:');
let totalSize = 0;

// Read and concatenate all files
let bundleContent = '// MamaCare v8.0 — Bundled App\n';
bundleContent += '// Combined from ' + sourceFiles.length + ' source files\n';
bundleContent += '// Build: ' + new Date().toISOString() + '\n\n';

sourceFiles.forEach((file, i) => {
  const content = fs.readFileSync(file, 'utf8');
  const size = (fs.statSync(file).size / 1024).toFixed(1);
  totalSize += parseFloat(size);
  
  console.log(`  ${(i + 1).toString().padStart(2)}. ${file.padEnd(25)} (${size} KB)`);
  
  // Add file separator
  bundleContent += '\n// ═══════════════════════════════════════════════════════════\n';
  bundleContent += `// SOURCE: ${file}\n`;
  bundleContent += '// ═══════════════════════════════════════════════════════════\n\n';
  
  // Add file content (remove strict mode declarations to avoid duplicates)
  const cleanContent = content.replace(/['"]use strict['"];?\s*/g, '');
  bundleContent += cleanContent;
  bundleContent += '\n';
});

// Write bundle
const outputFile = isDev ? 'bundle.dev.js' : 'bundle.js';
fs.writeFileSync(outputFile, bundleContent, 'utf8');

const bundleSize = (fs.statSync(outputFile).size / 1024).toFixed(1);

console.log('');
console.log('✅ Build successful!');
console.log(`   Original:  ${totalSize.toFixed(1)} KB (${sourceFiles.length} files)`);
console.log(`   Bundle:    ${bundleSize} KB (1 file)`);
console.log(`   Output:    ${outputFile}`);
console.log('');

// Optional: Create minified version using simple minification
if (!isDev) {
  console.log('🗜️  Creating minified version...');
  
  try {
    const esbuild = require('esbuild');
    
    esbuild.buildSync({
      entryPoints: [outputFile],
      outfile: 'bundle.min.js',
      minify: true,
      target: 'es2020',
      format: 'iife',
      allowOverwrite: true
    });
    
    const minSize = (fs.statSync('bundle.min.js').size / 1024).toFixed(1);
    const reduction = ((1 - minSize / bundleSize) * 100).toFixed(1);
    
    console.log(`   Minified:  ${minSize} KB (${reduction}% smaller)`);
    console.log('   Output:    bundle.min.js');
    console.log('');
  } catch (e) {
    console.log('   ⚠️  Minification skipped (esbuild optional)');
    console.log('');
  }
}

console.log('📝 Next steps:');
console.log('   1. Update index.html:');
console.log('      Replace all <script src="app*.js"> with:');
if (!isDev && fs.existsSync('bundle.min.js')) {
  console.log('      <script src="bundle.min.js"></script>');
} else {
  console.log('      <script src="bundle.js"></script>');
}
console.log('');
console.log('   2. Test locally:');
console.log('      Open index.html in browser');
console.log('');
console.log('   3. Deploy:');
console.log('      git add . && git commit -m "Bundle scripts" && git push');
console.log('      vercel --prod');
console.log('');
console.log('═══════════════════════════════════════════════════════════');
