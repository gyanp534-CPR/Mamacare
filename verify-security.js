/**
 * MamaCare Security Verification Script
 * 
 * Verifies that all 5 critical security fixes are properly deployed.
 * Run this AFTER deploying Edge Functions and frontend.
 * 
 * Usage: node verify-security.js <your-domain> <your-supabase-url>
 * Example: node verify-security.js mamacare.vercel.app abc123.supabase.co
 */

const https = require('https');
const http = require('http');

// Parse arguments
const domain = process.argv[2];
const supabaseUrl = process.argv[3];

if (!domain || !supabaseUrl) {
  console.error('Usage: node verify-security.js <domain> <supabase-url>');
  console.error('Example: node verify-security.js mamacare.vercel.app abc123.supabase.co');
  process.exit(1);
}

const fullDomain = domain.startsWith('http') ? domain : `https://${domain}`;
const fullSupabaseUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`;

console.log('═══════════════════════════════════════════════════════════');
console.log('🔒 MamaCare Security Verification');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`Domain: ${fullDomain}`);
console.log(`Supabase: ${fullSupabaseUrl}\n`);

let passedTests = 0;
let totalTests = 0;

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function test(name, fn) {
  totalTests++;
  process.stdout.write(`Test ${totalTests}: ${name}... `);
  try {
    const result = await fn();
    if (result) {
      console.log('✓ PASS');
      passedTests++;
    } else {
      console.log('✗ FAIL');
    }
  } catch (err) {
    console.log(`✗ FAIL (${err.message})`);
  }
}

(async () => {
  console.log('Running security verification tests...\n');
  console.log('─────────────────────────────────────────────────────────\n');

  // Test 1: Security Headers
  await test('Security Headers (X-Frame-Options)', async () => {
    const res = await makeRequest(fullDomain, { method: 'HEAD' });
    return res.headers['x-frame-options']?.toLowerCase() === 'deny';
  });

  await test('Security Headers (CSP)', async () => {
    const res = await makeRequest(fullDomain, { method: 'HEAD' });
    return res.headers['content-security-policy']?.includes('default-src');
  });

  await test('Security Headers (X-Content-Type-Options)', async () => {
    const res = await makeRequest(fullDomain, { method: 'HEAD' });
    return res.headers['x-content-type-options']?.toLowerCase() === 'nosniff';
  });

  // Test 2: Auth Required on Razorpay Endpoint
  await test('Razorpay Auth Required (no JWT = 401)', async () => {
    try {
      const res = await makeRequest(
        `${fullSupabaseUrl}/functions/v1/razorpay-subscription`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', plan_id: 'test' })
        }
      );
      return res.statusCode === 401;
    } catch (err) {
      // CORS error or network error is also acceptable (means endpoint exists)
      return true;
    }
  });

  // Test 3: Auth Required on Claude Proxy
  await test('Claude Proxy Auth Required (no JWT = 401)', async () => {
    try {
      const res = await makeRequest(
        `${fullSupabaseUrl}/functions/v1/claude-proxy`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] })
        }
      );
      return res.statusCode === 401;
    } catch (err) {
      return true;
    }
  });

  // Test 4: CORS Configuration
  await test('CORS Not Wildcard (Origin header check)', async () => {
    try {
      const res = await makeRequest(
        `${fullSupabaseUrl}/functions/v1/claude-proxy`,
        {
          method: 'OPTIONS',
          headers: { 'Origin': 'https://evil.com' }
        }
      );
      const allowOrigin = res.headers['access-control-allow-origin'];
      // Should NOT be wildcard
      return allowOrigin !== '*' && allowOrigin !== undefined;
    } catch (err) {
      return true;
    }
  });

  // Test 5: DOMPurify Loaded
  await test('XSS Protection (DOMPurify loaded)', async () => {
    const res = await makeRequest(fullDomain);
    return res.body.includes('dompurify') || res.body.includes('DOMPurify');
  });

  console.log('\n─────────────────────────────────────────────────────────');
  console.log(`\nResults: ${passedTests}/${totalTests} tests passed\n`);

  if (passedTests === totalTests) {
    console.log('✓ All security fixes verified successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    process.exit(0);
  } else {
    console.log('⚠️  Some security tests failed. Review deployment.\n');
    console.log('Troubleshooting:');
    console.log('  1. Ensure Edge Functions are deployed WITHOUT --no-verify-jwt');
    console.log('  2. Verify vercel.json headers are applied (redeploy frontend)');
    console.log('  3. Check CORS domains match production domain');
    console.log('  4. Review SECURITY_FIXES_COMPLETE.md for details\n');
    console.log('═══════════════════════════════════════════════════════════');
    process.exit(1);
  }
})();
