/**
 * MamaCare Security Deployment Script
 * 
 * This script helps you complete the security fix deployment:
 * 1. Updates CORS domains in Edge Functions
 * 2. Generates deployment commands
 * 3. Provides verification steps
 * 
 * Usage: node deploy-security-fixes.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('═══════════════════════════════════════════════════════════');
console.log('🔒 MamaCare Security Deployment Helper');
console.log('═══════════════════════════════════════════════════════════\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  // Step 1: Get production domain
  console.log('Step 1: Configure CORS Domain');
  console.log('─────────────────────────────────────────────────────────\n');
  
  const domain = await question('Enter your production domain (e.g., mamacare.vercel.app): ');
  const fullDomain = domain.startsWith('http') ? domain : `https://${domain}`;
  
  console.log(`\n✓ Using domain: ${fullDomain}\n`);

  // Step 2: Update Edge Functions
  console.log('Step 2: Updating Edge Functions CORS...');
  console.log('─────────────────────────────────────────────────────────\n');

  const files = [
    'supabase/functions/claude-proxy/index.ts',
    'supabase/functions/razorpay-subscription/index.ts'
  ];

  let updatedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${file} (not found)`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const placeholder = 'https://your-domain.vercel.app';
    
    if (content.includes(placeholder)) {
      content = content.replace(
        new RegExp(placeholder, 'g'),
        fullDomain
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated ${file}`);
      updatedCount++;
    } else {
      console.log(`✓ ${file} already configured`);
    }
  }

  console.log(`\n✓ Updated ${updatedCount} file(s)\n`);

  // Step 3: Database Migration
  console.log('Step 3: Database Migration');
  console.log('─────────────────────────────────────────────────────────');
  console.log('\nYou need to run the database migration in Supabase:\n');
  console.log('Option A - Supabase Dashboard:');
  console.log('  1. Go to https://supabase.com/dashboard');
  console.log('  2. Select your project');
  console.log('  3. Go to SQL Editor');
  console.log('  4. Click "New Query"');
  console.log('  5. Paste contents of schema_security_updates.sql');
  console.log('  6. Click "Run"\n');
  
  console.log('Option B - Command Line:');
  console.log('  psql -h <your-db-host> -U postgres -d postgres -f schema_security_updates.sql\n');

  const migrated = await question('Have you run the migration? (y/n): ');
  if (migrated.toLowerCase() !== 'y') {
    console.log('\n⚠️  Please run the migration before deploying Edge Functions.\n');
    rl.close();
    return;
  }

  // Step 4: Deploy Edge Functions
  console.log('\nStep 4: Deploy Edge Functions');
  console.log('─────────────────────────────────────────────────────────');
  console.log('\nRun these commands:\n');
  console.log('  supabase functions deploy claude-proxy');
  console.log('  supabase functions deploy razorpay-subscription\n');
  console.log('⚠️  Note: Do NOT use --no-verify-jwt flag (security requirement)\n');

  // Step 5: Deploy Frontend
  console.log('Step 5: Deploy Frontend');
  console.log('─────────────────────────────────────────────────────────');
  console.log('\nDeploy to Vercel to activate security headers:\n');
  console.log('  vercel --prod\n');
  console.log('Or push to git if connected to Vercel:\n');
  console.log('  git add .');
  console.log('  git commit -m "🔒 Security fixes: CORS, auth, rate limit"');
  console.log('  git push origin main\n');

  // Step 6: Verification
  console.log('Step 6: Verification Commands');
  console.log('─────────────────────────────────────────────────────────');
  console.log('\nAfter deployment, verify security fixes:\n');
  
  console.log('Test 1: Security Headers');
  console.log(`  curl -I ${fullDomain} | grep -i "x-frame-options\\|content-security"\n`);
  
  console.log('Test 2: Auth Required (should return 401)');
  console.log('  curl -X POST https://<your-project>.supabase.co/functions/v1/razorpay-subscription \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"action":"create","plan_id":"test"}\'\n');
  
  console.log('Test 3: CORS Blocked (from wrong origin)');
  console.log('  Open browser console on different domain and try:');
  console.log('  fetch("https://<your-project>.supabase.co/functions/v1/claude-proxy", {method: "POST"})\n');

  // Generate summary file
  const summary = `# Security Deployment Summary

## Configuration Applied
- **Domain:** ${fullDomain}
- **Date:** ${new Date().toISOString()}
- **Files Updated:** ${updatedCount}

## Deployment Checklist

### ✓ Completed
- [x] CORS domains updated in Edge Functions
- [x] Security headers configured in vercel.json
- [x] XSS protection added (DOMPurify)
- [x] JWT authentication required on endpoints
- [x] Database-backed rate limiting implemented

### ⏳ Pending
- [ ] Database migration executed (schema_security_updates.sql)
- [ ] Edge Functions deployed (claude-proxy, razorpay-subscription)
- [ ] Frontend deployed to Vercel
- [ ] Security verification tests completed

## Deployment Commands

### Deploy Edge Functions
\`\`\`bash
supabase functions deploy claude-proxy
supabase functions deploy razorpay-subscription
\`\`\`

### Deploy Frontend
\`\`\`bash
vercel --prod
# OR
git push origin main
\`\`\`

## Verification Tests

### 1. Security Headers
\`\`\`bash
curl -I ${fullDomain} | grep -i "x-frame-options\\|content-security"
\`\`\`
Expected: X-Frame-Options: DENY

### 2. Auth Required
\`\`\`bash
curl -X POST https://<project>.supabase.co/functions/v1/razorpay-subscription \\
  -H "Content-Type: application/json" \\
  -d '{"action":"create","plan_id":"test"}'
\`\`\`
Expected: 401 Unauthorized

### 3. Rate Limit Persistence
- Make 15 AI calls
- Wait for cold start (close all tabs, wait 15 min)
- Try 16th call
Expected: 429 Too Many Requests (should NOT reset)

## Next Steps
1. Complete pending deployment tasks
2. Run verification tests
3. Monitor for errors in production
4. Consider additional security improvements (see SECURITY_FIXES_COMPLETE.md)

## Support
- Documentation: SECURITY_FIXES_COMPLETE.md
- Database schema: schema_security_updates.sql
- Verification: Deploy and test each endpoint
`;

  fs.writeFileSync('DEPLOYMENT_SUMMARY.md', summary, 'utf8');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✓ Configuration complete!');
  console.log('✓ Deployment summary saved to DEPLOYMENT_SUMMARY.md');
  console.log('═══════════════════════════════════════════════════════════\n');

  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
