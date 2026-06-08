# 🚀 MamaCare Edge Functions Deployment Instructions

## ⚠️ Important: Supabase CLI Required

To deploy the Edge Functions, you need the Supabase CLI installed on your system.

---

## Quick Start

### Option 1: Automated Deployment (Recommended)

Run the PowerShell deployment script:

```powershell
.\deploy-edge-functions.ps1
```

Or the batch script:

```cmd
deploy-edge-functions.bat
```

**The script will:**
1. ✅ Check if Supabase CLI is installed
2. ✅ Prompt for your production domain (if not set)
3. ✅ Update CORS in both Edge Functions
4. ✅ Verify Supabase authentication
5. ✅ Check project linking
6. ✅ Deploy both functions WITHOUT `--no-verify-jwt`
7. ✅ Provide next steps

---

### Option 2: Manual Deployment

#### Step 1: Install Supabase CLI

**Using NPM:**
```bash
npm install -g supabase
```

**Using Scoop (Windows):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Direct Download:**
- https://github.com/supabase/cli/releases
- Download the Windows executable
- Add to PATH

#### Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser for authentication.

#### Step 3: Link Your Project

```bash
supabase link
```

Follow the prompts to select your project.

#### Step 4: Update CORS Domain

**Before deploying**, replace the placeholder domain in both files:

**File 1:** `supabase/functions/claude-proxy/index.ts` (line 18)
```typescript
// BEFORE:
'Access-Control-Allow-Origin': 'https://your-domain.vercel.app',

// AFTER (replace with YOUR domain):
'Access-Control-Allow-Origin': 'https://mamacare.vercel.app',
```

**File 2:** `supabase/functions/razorpay-subscription/index.ts` (line 19)
```typescript
// BEFORE:
'Access-Control-Allow-Origin': 'https://your-domain.vercel.app',

// AFTER (replace with YOUR domain):
'Access-Control-Allow-Origin': 'https://mamacare.vercel.app',
```

#### Step 5: Set Secrets (If Not Already Set)

```bash
# For Claude AI proxy
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here

# For Razorpay subscription
supabase secrets set RAZORPAY_KEY_ID=rzp_live_your-key
supabase secrets set RAZORPAY_KEY_SECRET=your-secret-key
```

#### Step 6: Deploy Edge Functions

**Deploy claude-proxy:**
```bash
supabase functions deploy claude-proxy
```

⚠️ **DO NOT** use `--no-verify-jwt` flag (security requirement)

**Deploy razorpay-subscription:**
```bash
supabase functions deploy razorpay-subscription
```

⚠️ **DO NOT** use `--no-verify-jwt` flag (security requirement)

---

## Verification

After deployment, verify that both functions are live:

### Check Deployment Status

```bash
supabase functions list
```

You should see both functions with status "ACTIVE".

### Test JWT Authentication

Both functions should now require authentication:

```bash
# Should return 401 Unauthorized
curl -X POST https://your-project.supabase.co/functions/v1/claude-proxy \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

Expected response: `401 Unauthorized` (meaning JWT is required ✓)

### Run Automated Verification

```bash
node verify-security.js <your-domain> <your-supabase-url>
```

Example:
```bash
node verify-security.js mamacare.vercel.app abc123.supabase.co
```

This will test:
- ✓ JWT authentication required
- ✓ CORS domain-locked
- ✓ Rate limiting configured
- ✓ Security headers present

---

## What Changed?

### Before Deployment (Insecure)

❌ **No Authentication**
```bash
# Anyone could call the functions
supabase functions deploy razorpay-subscription --no-verify-jwt
```

❌ **Wildcard CORS**
```typescript
'Access-Control-Allow-Origin': '*'  // Any domain can call
```

❌ **In-Memory Rate Limiting**
```typescript
const rateLimitMap = new Map();  // Resets on cold start
```

### After Deployment (Secure) ✅

✅ **JWT Authentication Required**
```bash
# Functions require valid JWT token
supabase functions deploy razorpay-subscription  # (no --no-verify-jwt)
```

✅ **Domain-Locked CORS**
```typescript
'Access-Control-Allow-Origin': 'https://mamacare.vercel.app'
```

✅ **Database-Backed Rate Limiting**
```typescript
// Persistent rate limiting in ai_usage table
await supabase.from('ai_usage').upsert({...})
```

---

## Troubleshooting

### Issue: "supabase: command not found"

**Solution:** Install Supabase CLI (see Step 1 above)

### Issue: "Not logged in"

**Solution:**
```bash
supabase login
```

### Issue: "Project not linked"

**Solution:**
```bash
supabase link
```

### Issue: "ANTHROPIC_API_KEY not set"

**Solution:**
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key
```

### Issue: "RAZORPAY_KEY_ID not set"

**Solution:**
```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_live_your-key
supabase secrets set RAZORPAY_KEY_SECRET=your-secret
```

### Issue: "TypeScript compilation error"

**Solution:** Check the Edge Function files for syntax errors:
- `supabase/functions/claude-proxy/index.ts`
- `supabase/functions/razorpay-subscription/index.ts`

### Issue: "CORS still shows placeholder"

**Solution:** You forgot to update the CORS domain. Edit both files and replace `https://your-domain.vercel.app` with your actual domain, then redeploy.

### Issue: "401 Unauthorized when calling from frontend"

**Solution:** This is expected! The frontend needs to send the JWT token:

```javascript
// Ensure Authorization header is sent
const { data: { session } } = await supabase.auth.getSession();

const response = await supabase.functions.invoke('claude-proxy', {
  body: { messages: [...] },
  headers: {
    Authorization: `Bearer ${session.access_token}`
  }
});
```

---

## Security Checklist

After deployment, verify these security features are active:

### 1. JWT Authentication ✓
- [ ] Functions return 401 without JWT token
- [ ] Functions accept requests with valid JWT
- [ ] Frontend sends Authorization header

### 2. CORS Protection ✓
- [ ] Functions reject requests from unauthorized domains
- [ ] Functions accept requests from production domain only
- [ ] No wildcard (`*`) in Access-Control-Allow-Origin

### 3. Rate Limiting ✓
- [ ] Database table `ai_usage` exists
- [ ] Rate limits persist across cold starts
- [ ] Premium users bypass rate limits

### 4. Payment Security ✓
- [ ] Razorpay signature verification works
- [ ] User ID comes from JWT (not request body)
- [ ] Subscriptions saved to database

### 5. Headers ✓
- [ ] Content-Security-Policy present
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff

---

## Next Steps After Deployment

### 1. Database Migration

Run the security schema updates in Supabase Dashboard:

**SQL Editor → New Query → Paste and Run:**
```sql
-- Copy contents of schema_security_updates.sql
```

This creates:
- `ai_usage` table (rate limiting)
- `audit_log` table (security audit)

### 2. Frontend Deployment

Deploy to Vercel to activate security headers:

```bash
vercel --prod
```

Or push to git if auto-deployment is configured.

### 3. End-to-End Testing

Test the complete flow:
1. Login to the app
2. Use AI coach feature (should work)
3. Try 16 AI calls (15th should work, 16th should fail with 429)
4. Try payment flow (should create subscription)

### 4. Monitor Logs

Check Supabase Dashboard → Logs → Edge Functions for:
- 401 errors (unauthorized access attempts - good!)
- 429 errors (rate limit triggered - good!)
- 500 errors (server errors - investigate!)

---

## Rollback Plan

If deployment causes issues:

### Rollback Edge Functions

```bash
# List previous versions
supabase functions versions list claude-proxy

# Deploy specific version
supabase functions deploy claude-proxy --version <version-id>
```

### Temporary Fix: Allow Anonymous Access

⚠️ **NOT RECOMMENDED** - Only for emergency debugging:

```bash
# INSECURE - only for testing
supabase functions deploy claude-proxy --no-verify-jwt
```

Remember to redeploy properly afterward!

---

## Support

**Documentation:**
- `SECURITY_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `SECURITY_FIXES_COMPLETE.md` - Technical details
- `CURRENT_STATUS.md` - Project status

**Scripts:**
- `deploy-edge-functions.ps1` - Automated deployment (PowerShell)
- `deploy-edge-functions.bat` - Automated deployment (Batch)
- `verify-security.js` - Security verification
- `deploy-security-fixes.js` - Full deployment helper

**Supabase Resources:**
- CLI Documentation: https://supabase.com/docs/guides/cli
- Edge Functions Guide: https://supabase.com/docs/guides/functions
- JWT Authentication: https://supabase.com/docs/guides/functions/auth

---

## Summary

✅ **Code Ready:** All security fixes implemented  
⏳ **Action Required:** Deploy using one of the methods above  
🎯 **Goal:** Both functions deployed WITH JWT authentication  
⚠️ **Critical:** Do NOT use `--no-verify-jwt` flag  
🔒 **Security:** All 5 vulnerabilities will be fixed after deployment

---

**Ready to deploy?**

```powershell
# Easiest way - run the automated script:
.\deploy-edge-functions.ps1
```

Or follow the manual steps above if you prefer more control.
