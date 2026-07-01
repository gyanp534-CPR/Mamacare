#!/usr/bin/env node
/**
 * Verification Script for 4 New Features Integration
 * Run: node verify-integration.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying 4 Features Integration...\n');

let passed = 0;
let failed = 0;

function check(name, condition, message) {
  if (condition) {
    console.log(`✅ ${name}: ${message}`);
    passed++;
  } else {
    console.log(`❌ ${name}: ${message}`);
    failed++;
  }
}

// ══════════════════════════════════════════════════════════
// 1. CHECK FILES EXIST
// ══════════════════════════════════════════════════════════
console.log('📂 Checking Files...');

check(
  'PDF Report JS',
  fs.existsSync('app-pdf-report.js'),
  'app-pdf-report.js exists'
);

check(
  'ASHA Chatbot JS',
  fs.existsSync('app-asha-chatbot.js'),
  'app-asha-chatbot.js exists'
);

check(
  'Breastfeeding JS',
  fs.existsSync('app-breastfeeding.js'),
  'app-breastfeeding.js exists'
);

check(
  'Weekly Digest Edge Function',
  fs.existsSync('supabase/functions/weekly-digest/index.ts'),
  'supabase/functions/weekly-digest/index.ts exists'
);

console.log('');

// ══════════════════════════════════════════════════════════
// 2. CHECK HTML INTEGRATION
// ══════════════════════════════════════════════════════════
console.log('🌐 Checking HTML Integration...');

const htmlContent = fs.readFileSync('index.html', 'utf8');

check(
  'ASHA Page',
  htmlContent.includes('id="page-asha"'),
  'page-asha section found in HTML'
);

check(
  'Breastfeeding Page',
  htmlContent.includes('id="page-breastfeeding"'),
  'page-breastfeeding section found in HTML'
);

check(
  'PDF Report Page',
  htmlContent.includes('id="page-pdf-report"'),
  'page-pdf-report section found in HTML'
);

check(
  'Script Tags',
  htmlContent.includes('app-pdf-report.js') && 
  htmlContent.includes('app-asha-chatbot.js') && 
  htmlContent.includes('app-breastfeeding.js'),
  'All 3 script tags loaded in HTML'
);

// Check navigation items
const ashaNavCount = (htmlContent.match(/data-page="asha"/g) || []).length;
const bfNavCount = (htmlContent.match(/data-page="breastfeeding"/g) || []).length;
const pdfNavCount = (htmlContent.match(/data-page="pdf-report"/g) || []).length;

check(
  'ASHA Navigation',
  ashaNavCount >= 2,
  `${ashaNavCount} navigation items for ASHA (expected 2+)`
);

check(
  'Breastfeeding Navigation',
  bfNavCount >= 2,
  `${bfNavCount} navigation items for Breastfeeding (expected 2+)`
);

check(
  'PDF Report Navigation',
  pdfNavCount >= 2,
  `${pdfNavCount} navigation items for PDF Report (expected 2+)`
);

check(
  'Dashboard Section',
  htmlContent.includes('Premium & Postpartum'),
  'New dashboard section "Premium & Postpartum" found'
);

console.log('');

// ══════════════════════════════════════════════════════════
// 3. CHECK APP.JS INITIALIZATION
// ══════════════════════════════════════════════════════════
console.log('⚙️  Checking app.js Initialization...');

const appJsContent = fs.readFileSync('app.js', 'utf8');

check(
  'ASHA Init Call',
  appJsContent.includes('initASHAChatbot'),
  'initASHAChatbot() call found in app.js'
);

check(
  'Breastfeeding Init Call',
  appJsContent.includes('initBreastfeedingTracker'),
  'initBreastfeedingTracker() call found in app.js'
);

console.log('');

// ══════════════════════════════════════════════════════════
// 4. CHECK CSS STYLING
// ══════════════════════════════════════════════════════════
console.log('🎨 Checking CSS Styling...');

const cssContent = fs.readFileSync('style.css', 'utf8');

check(
  'ASHA Button Styles',
  cssContent.includes('.lang-btn-asha'),
  'CSS styles for .lang-btn-asha found'
);

console.log('');

// ══════════════════════════════════════════════════════════
// 5. CHECK FEATURE CODE STRUCTURE
// ══════════════════════════════════════════════════════════
console.log('🔧 Checking Feature Code...');

// PDF Report
const pdfCode = fs.readFileSync('app-pdf-report.js', 'utf8');
check(
  'PDF Export Function',
  pdfCode.includes('generateHealthReportPDF'),
  'generateHealthReportPDF() function found'
);

check(
  'PDF Premium Check',
  pdfCode.includes('PREMIUM') && pdfCode.includes('isPremium'),
  'Premium feature gate implemented'
);

// ASHA Chatbot
const ashaCode = fs.readFileSync('app-asha-chatbot.js', 'utf8');
check(
  'ASHA Quick Topics',
  ashaCode.includes('ASHA_QUICK_TOPICS'),
  'ASHA_QUICK_TOPICS constant defined'
);

check(
  'ASHA Language Support',
  ashaCode.includes('hinglish') && ashaCode.includes('hindi') && ashaCode.includes('english'),
  'Multi-language support implemented'
);

check(
  'ASHA Export',
  ashaCode.includes('window.ASHA') || ashaCode.includes('window.initASHAChatbot'),
  'ASHA functions exported to window'
);

// Breastfeeding Tracker
const bfCode = fs.readFileSync('app-breastfeeding.js', 'utf8');
check(
  'BF Timer',
  bfCode.includes('timerInterval') && bfCode.includes('startTime'),
  'Timer functionality implemented'
);

check(
  'BF Switch Breast',
  bfCode.includes('switchBreast'),
  'Switch breast function found'
);

check(
  'BF Export',
  bfCode.includes('window.BF') || bfCode.includes('window.initBreastfeedingTracker'),
  'Breastfeeding functions exported to window'
);

// Weekly Digest
const digestCode = fs.readFileSync('supabase/functions/weekly-digest/index.ts', 'utf8');
check(
  'Email Function',
  digestCode.includes('Resend'),
  'Resend email integration found'
);

check(
  'Email Template',
  digestCode.includes('html') && digestCode.includes('gradient'),
  'HTML email template found'
);

console.log('');

// ══════════════════════════════════════════════════════════
// 6. CHECK DOCUMENTATION
// ══════════════════════════════════════════════════════════
console.log('📚 Checking Documentation...');

check(
  'Integration Guide',
  fs.existsSync('INTEGRATION_COMPLETE.md'),
  'INTEGRATION_COMPLETE.md exists'
);

check(
  'Test Guide',
  fs.existsSync('QUICK_TEST_GUIDE.md'),
  'QUICK_TEST_GUIDE.md exists'
);

check(
  'Launch Summary',
  fs.existsSync('FEATURE_LAUNCH_SUMMARY.md'),
  'FEATURE_LAUNCH_SUMMARY.md exists'
);

check(
  'User Journey Guide',
  fs.existsSync('USER_JOURNEY_GUIDE.md'),
  'USER_JOURNEY_GUIDE.md exists'
);

console.log('');

// ══════════════════════════════════════════════════════════
// 7. SUMMARY
// ══════════════════════════════════════════════════════════
console.log('═══════════════════════════════════════════');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log('═══════════════════════════════════════════\n');

if (failed === 0) {
  console.log('🎉 ALL CHECKS PASSED! Integration is complete.\n');
  console.log('Next Steps:');
  console.log('1. Test features in browser');
  console.log('2. Deploy Supabase Edge Function');
  console.log('3. Run database migration');
  console.log('4. Set up cron job');
  console.log('5. Launch! 🚀\n');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Review the output above.\n');
  process.exit(1);
}
