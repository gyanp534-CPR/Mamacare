# ✅ MamaCare Security Deployment - READY TO DEPLOY

**Status:** All code changes complete | Ready for deployment  
**Date:** June 4, 2026

---

## 🎯 What You Asked For

You requested:
> Deploy Edge Functions  
> Deploy both functions **WITHOUT** `--no-verify-jwt` flag

---

## ⚠️ Prerequisite: Supabase CLI Not Installed

I attempted to deploy the Edge Functions but discovered that **Supabase CLI is not installed** on your system.

```
Error: supabase : The term 'supabase' is not recognized
```

---

## 🚀 How to Deploy (3 Options)

### Option 1: Automated Script (EASIEST) ⭐

I've created an automated deployment script that will:
- Check if Supabase CLI is installed
- Guide you through installation if needed
- Prompt for your production domain
- Update CORS automatically
- Deploy both functions

**Run this:**
```powershell
.\deploy-edge-functions.ps1
```

Or on Windows CMD:
```cmd
deploy-edge-functions.bat
```

---

### Option 2: Manual Deployment (FULL CONTROL)

#### Step 1: Install Supabase CLI

**NPM:**
```bash
npm install -g supabase
```

**Scoop (Windows):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Direct Download:**
- https://github.com/supabase/cli/releases

#### Step 2: Login & Link

```bash
supabase login
supabase link
```

#### Step 3: Update CORS Domain

Before deploying, replace `https://your-domain.vercel.app` in:
- `supabase/functions/claude-proxy/index.ts` (line 18)
- `supabase/functions/razorpay-subscription/index.ts` (line 19)

With your actual domain (e.g., `https://mamacare.vercel.app`)

#### Step 4: Deploy Functions

```bash
# Deploy WITHOUT --no-verify-jwt (security requirement)
supabase functions deploy claude-proxy
supabase functions deploy razorpay-subscription
```

---

### Option 3: Using Supabase Dashboard

If you prefer not to use CLI:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions**
4. Click **Create New Function** or **Edit Existing**
5. Copy/paste the TypeScript code
6. Deploy from dashboard

⚠️ **Note:** You still need to update CORS domains in the code before pasting.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Supabase CLI installed (`supabase --version`)
- [ ] Logged in to Supabase (`supabase login`)
- [ ] Project linked (`supabase link`)
- [ ] CORS domains updated (replace `your-domain.vercel.app`)
- [ ] API keys set as secrets:
  - [ ] `ANTHROPIC_API_KEY` (for Claude proxy)
  - [ ] `RAZORPAY_KEY_ID` (for payments)
  - [ ] `RAZORPAY_KEY_SECRET` (for payments)

**Check secrets:**
```bash
supabase secrets list
```

**Set secrets (if missing):**
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key
supabase secrets set RAZORPAY_KEY_ID=rzp_live_your-key
supabase secrets set RAZORPAY_KEY_SECRET=your-secret
```

---

## 📁 Files Created for Deployment

I've created these files to help you deploy:

| File | Purpose |
|------|---------|
| `deploy-edge-functions.ps1` | PowerShell automated deployment script |
| `deploy-edge-functions.bat` | Batch automated deployment script |
| `DEPLOYMENT_INSTRUCTIONS.md` | Complete step-by-step deployment guide |
| `DEPLOYMENT_READY.md` | This file (quick start) |
| `verify-security.js` | Post-deployment verification script |
| `SECURITY_DEPLOYMENT_GUIDE.md` | Full security deployment documentation |

---

## ⚡ Quick Start (TL;DR)

**If you have NPM installed:**

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login and link
supabase login
supabase link

# 3. Run automated deployment
.\deploy-edge-functions.ps1
```

**If you don't have NPM:**

1. Download Supabase CLI: https://github.com/supabase/cli/releases
2. Install it and add to PATH
3. Run: `.\deploy-edge-functions.ps1`

---

## 🔒 What Gets Deployed

### Edge Function 1: claude-proxy

**Security Features:**
- ✅ JWT authentication required
- ✅ Database-backed rate limiting (15 calls/day for free users)
- ✅ Premium users get unlimited access
- ✅ Domain-locked CORS
- ✅ Max token limits to prevent abuse

**File:** `supabase/functions/claude-proxy/index.ts`

### Edge Function 2: razorpay-subscription

**Security Features:**
- ✅ JWT authentication required
- ✅ User ID from JWT (not request body)
- ✅ HMAC-SHA256 signature verification
- ✅ Domain-locked CORS
- ✅ Subscription data saved to database

**File:** `supabase/functions/razorpay-subscription/index.ts`

---

## 🧪 Post-Deployment Verification

After deployment, run:

```bash
node verify-security.js <your-domain> <your-supabase-url>
```

Example:
```bash
node verify-security.js mamacare.vercel.app abc123.supabase.co
```

Expected output:
```
Test 1: Security Headers (X-Frame-Options)... ✓ PASS
Test 2: Security Headers (CSP)... ✓ PASS
Test 3: Razorpay Auth Required... ✓ PASS
Test 4: Claude Proxy Auth Required... ✓ PASS
Test 5: CORS Not Wildcard... ✓ PASS
Test 6: XSS Protection (DOMPurify loaded)... ✓ PASS

Results: 6/6 tests passed
✓ All security fixes verified successfully!
```

---

## 🎯 Success Criteria

Deployment is successful when:

1. ✅ Both functions deploy without errors
2. ✅ Functions return **401** when called without JWT
3. ✅ Functions return **200** when called with valid JWT
4. ✅ CORS blocks requests from unauthorized domains
5. ✅ Rate limiting works (16th call returns **429**)
6. ✅ Payment flow works with signature verification

---

## 📊 Current Status

| Task | Status | Notes |
|------|--------|-------|
| Security code fixes | ✅ Complete | All 5 vulnerabilities fixed |
| CORS domain update | ⏳ Pending | Replace placeholder with actual domain |
| Supabase CLI install | ⏳ Required | Not detected on system |
| Edge Functions deploy | ⏳ Pending | Waiting for CLI |
| Database migration | ⏳ Pending | Run schema_security_updates.sql |
| Frontend deploy | ⏳ Pending | Deploy to Vercel |
| Verification | ⏳ Pending | Run verify-security.js |

---

## ⚠️ Critical Notes

### 1. DO NOT Use `--no-verify-jwt`

This flag was used previously (INSECURE):
```bash
# ❌ OLD (INSECURE)
supabase functions deploy razorpay-subscription --no-verify-jwt
```

Must be deployed WITHOUT this flag (SECURE):
```bash
# ✅ NEW (SECURE)
supabase functions deploy razorpay-subscription
```

### 2. Update CORS Before Deploying

The functions still have placeholder CORS:
```typescript
'Access-Control-Allow-Origin': 'https://your-domain.vercel.app'
```

**This must be replaced** with your actual domain, or the frontend won't work.

The automated script will prompt for this. If deploying manually, edit the files first.

### 3. Database Migration Required

After deploying Edge Functions, run:
```sql
-- In Supabase Dashboard → SQL Editor
-- Copy contents of schema_security_updates.sql
```

This creates the `ai_usage` table needed for rate limiting.

---

## 🆘 Need Help?

### Documentation
- **Full Guide:** `DEPLOYMENT_INSTRUCTIONS.md`
- **Security Details:** `SECURITY_DEPLOYMENT_GUIDE.md`
- **Troubleshooting:** See DEPLOYMENT_INSTRUCTIONS.md section

### Common Issues

**"supabase command not found"**
→ Install Supabase CLI (see Option 2, Step 1)

**"Not logged in"**
→ Run `supabase login`

**"Project not linked"**
→ Run `supabase link`

**"CORS error in frontend"**
→ Update CORS domain in both Edge Functions

**"401 Unauthorized"**
→ Good! Means JWT auth is working. Frontend needs to send token.

---

## 📞 Next Steps

**Immediate (5-10 minutes):**
1. Install Supabase CLI
2. Run `.\deploy-edge-functions.ps1`
3. Follow prompts

**After Deployment (10 minutes):**
1. Run database migration (schema_security_updates.sql)
2. Deploy frontend to Vercel
3. Run verification script

**Verification (5 minutes):**
1. Test auth (should require JWT)
2. Test rate limiting (should work)
3. Test payment flow (should verify signature)

---

## 🎉 Final Result

Once deployed, you will have:

✅ **Secure AI Proxy**
- JWT authentication
- Rate limiting (15/day free, unlimited premium)
- Domain-locked CORS
- Token limits

✅ **Secure Payment Endpoint**
- JWT authentication
- Signature verification
- User ID from JWT (not body)
- Domain-locked CORS

✅ **Security Headers**
- CSP, X-Frame-Options, etc.
- XSS protection via DOMPurify
- MIME sniffing protection

✅ **Audit Trail**
- Database-backed rate limiting
- Audit log table ready
- RLS policies enforced

---

**Ready to deploy?**

```powershell
# Easiest way - automated script:
.\deploy-edge-functions.ps1

# Or follow manual steps in DEPLOYMENT_INSTRUCTIONS.md
```

---

**Estimated Time:**
- CLI Installation: 2-5 minutes
- Deployment: 3-5 minutes
- Verification: 2-3 minutes
- **Total: 10-15 minutes**

**Let's secure your app! 🔒🚀**
