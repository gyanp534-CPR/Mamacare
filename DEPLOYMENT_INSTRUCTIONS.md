# 🚀 MamaCare v8.1 — Deployment Instructions

**Version:** 8.1 (Contraction Timer Release)  
**Date:** June 25, 2026  
**Status:** Ready for Deployment

---

## 📋 Pre-Deployment Checklist

### Code Readiness
- [x] All features implemented and tested
- [x] No console errors
- [x] Mobile responsive
- [x] Cross-browser compatible
- [x] Documentation complete
- [x] Security fixes deployed
- [ ] Final QA testing completed
- [ ] User acceptance testing (optional)

### Environment Setup
- [ ] Supabase project configured
- [ ] Environment variables ready
- [ ] Vercel account ready
- [ ] Domain name configured (optional)
- [ ] SSL certificate ready (Vercel provides)

---

## 🎯 What's New in v8.1

### ⏱️ Contraction Timer (NEW)
- Real-time contraction tracking
- Automatic 5-1-1 labor pattern detection
- Complete history with CSV export
- Labor stages educational guide
- Mobile-optimized interface

### Recent Improvements
- ✅ Security vulnerabilities fixed (XSS, Auth, CORS, Rate Limit, CSP)
- ✅ Yoga section with animated SVG poses
- ✅ OTP paste handler for Android
- ✅ Push notification scheduling
- ✅ PWA manifest enhancements

---

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Environment Variables

Create or update `.env.local` in project root:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Claude AI (for AI coach feature)
VITE_CLAUDE_API_KEY=sk-ant-api03-...

# Optional: Razorpay (for premium subscriptions)
VITE_RAZORPAY_KEY_ID=rzp_live_...
VITE_RAZORPAY_KEY_SECRET=your-secret-here
```

**How to get these:**

1. **Supabase:**
   - Go to https://supabase.com/dashboard
   - Select your project → Settings → API
   - Copy "Project URL" and "anon public" key

2. **Claude API:**
   - Go to https://console.anthropic.com
   - Generate API key
   - (Optional: Feature works without it)

3. **Razorpay:**
   - Go to https://dashboard.razorpay.com
   - Settings → API Keys
   - (Optional: Premium feature only)

---

### Step 2: Database Setup

#### 2.1 Run Main Schema

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `schema.sql`
3. Paste and click **"Run"**
4. Verify tables created successfully

#### 2.2 Run Security Updates

1. Still in SQL Editor
2. Copy contents of `schema_security_updates.sql`
3. Paste and click **"Run"**
4. Verify `ai_usage` and `audit_log` tables created

#### 2.3 Enable Email Auth

1. Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set Site URL to your deployment URL (do this after Step 4)

**Expected Result:**
- 15+ tables created
- Row Level Security (RLS) enabled on all tables
- Email auth ready

---

### Step 3: Configure CORS for Edge Functions

If using AI Coach or Premium features:

#### Option A: Using the Deploy Script (Recommended)

```bash
node deploy-security-fixes.js
```

When prompted, enter your production domain:
```
https://mamacare.vercel.app
```

This updates CORS in:
- `supabase/functions/claude-proxy/index.ts`
- `supabase/functions/razorpay-subscription/index.ts`

#### Option B: Manual Configuration

Edit both files and replace:
```typescript
'Access-Control-Allow-Origin': 'https://your-domain.vercel.app'
```

With your actual domain.

---

### Step 4: Deploy Edge Functions (Optional)

**Required for:** AI Coach, Premium Subscriptions

#### 4.1 Install Supabase CLI

```bash
npm install -g supabase
```

#### 4.2 Login and Link Project

```bash
# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

To find your project ref:
- Supabase Dashboard → Settings → General → Reference ID

#### 4.3 Set Environment Secrets

```bash
# Claude API Key (for AI coach)
supabase secrets set CLAUDE_API_KEY=sk-ant-api03-...

# Razorpay Secret (for subscriptions)
supabase secrets set RAZORPAY_KEY_SECRET=your-secret-here
```

#### 4.4 Deploy Functions

```bash
# Deploy Claude proxy (AI coach)
supabase functions deploy claude-proxy

# Deploy Razorpay subscription handler
supabase functions deploy razorpay-subscription
```

**Important:** Do NOT use `--no-verify-jwt` flag! JWT verification is required for security.

**Verify deployment:**
```bash
# Check function logs
supabase functions logs claude-proxy
supabase functions logs razorpay-subscription
```

---

### Step 5: Deploy Frontend to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Follow prompts:
- Project name: `mamacare`
- Framework: `Other`
- Build command: (leave empty)
- Output directory: `.`

#### Option B: Vercel Git Integration

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Deploy MamaCare v8.1 with Contraction Timer"
   git branch -M main
   git remote add origin https://github.com/yourusername/mamacare.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repo
   - Click "Deploy"

3. **Configure Environment Variables in Vercel:**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_CLAUDE_API_KEY` (optional)
     - `VITE_RAZORPAY_KEY_ID` (optional)

4. **Redeploy:**
   - Vercel → Deployments → Latest → "Redeploy"

#### Option C: Drag and Drop

1. Build your project (if needed):
   ```bash
   # Not needed for this project - it's static HTML
   ```

2. Go to https://vercel.com/new
3. Click "Browse" and select project folder
4. Click "Upload"
5. Wait for deployment
6. Add environment variables (Settings → Environment Variables)
7. Redeploy

**Expected Result:**
- Live URL: `https://mamacare-xxx.vercel.app`
- SSL certificate automatically provisioned
- Global CDN distribution

---

### Step 6: Update Supabase Site URL

After deployment, update Supabase auth settings:

1. Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to your Vercel URL:
   ```
   https://mamacare-xxx.vercel.app
   ```
3. Set **Redirect URLs** (same as Site URL)
4. Click "Save"

This ensures OTP emails contain correct links.

---

### Step 7: Verify Deployment

Run automated verification:

```bash
node verify-security.js https://your-domain.vercel.app https://your-project.supabase.co
```

**Expected output:**
```
✅ Security headers present
✅ XSS protection enabled
✅ CORS configured
✅ Auth endpoints secured
✅ Rate limiting active
✅ All checks passed (7/7)
```

#### Manual Verification Checklist

- [ ] **App loads** — No white screen, no console errors
- [ ] **Authentication works** — Can sign up and receive OTP
- [ ] **OTP paste works** — Can paste 6-digit code (Android)
- [ ] **Dashboard loads** — Shows personalized content
- [ ] **Contraction Timer** — Navigate to feature, timer works
- [ ] **Start/Stop timer** — Button clicks work, time displays
- [ ] **History saves** — Contractions persist after refresh
- [ ] **CSV export** — Downloads valid file
- [ ] **Mobile responsive** — Works on phone screen
- [ ] **PWA install** — Shows install prompt (mobile)
- [ ] **Notifications** — Can enable and receive notifications
- [ ] **Yoga animations** — Poses animate smoothly
- [ ] **All features accessible** — No broken links

---

### Step 8: Configure Custom Domain (Optional)

#### 8.1 Add Domain to Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `mamacare.com` (example)
3. Follow DNS configuration instructions

#### 8.2 Update DNS Records

Add these records to your domain registrar:

**For apex domain (mamacare.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 8.3 Update Supabase Configuration

After domain propagates (5-30 minutes):

1. Update Site URL in Supabase to new domain
2. Redeploy Edge Functions with new CORS domain:
   ```bash
   # Update CORS in Edge Function files
   # Then redeploy
   supabase functions deploy claude-proxy
   supabase functions deploy razorpay-subscription
   ```

3. Verify again:
   ```bash
   node verify-security.js https://mamacare.com https://your-project.supabase.co
   ```

---

### Step 9: Set Up Monitoring (Recommended)

#### 9.1 Vercel Analytics

- Vercel Dashboard → Your Project → Analytics
- Enable (free tier available)
- Monitor page views, performance, errors

#### 9.2 Supabase Monitoring

- Supabase Dashboard → Reports
- Monitor database size, API requests, storage
- Set up email alerts for quota limits

#### 9.3 Error Tracking

Add Sentry or similar (optional):

```html
<!-- In index.html <head> -->
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'your-sentry-dsn' });
</script>
```

---

### Step 10: Post-Deployment Tasks

#### 10.1 Test Everything Again

Run through complete test checklist:
- [ ] User registration and login
- [ ] All 18+ features
- [ ] Contraction timer (new feature)
- [ ] Data persistence
- [ ] Export functions
- [ ] Mobile experience
- [ ] PWA installation
- [ ] Notifications

#### 10.2 Update Documentation

- [ ] Update README with live URL
- [ ] Add deployment date to CURRENT_STATUS.md
- [ ] Create CHANGELOG.md entry for v8.1
- [ ] Tag Git release: `git tag v8.1`

#### 10.3 Announce Release

- [ ] Share with beta testers
- [ ] Collect initial feedback
- [ ] Monitor error logs
- [ ] Prepare bug fix plan

---

## 🔄 Updating Existing Deployment

### For Code Changes (HTML/CSS/JS)

```bash
# Option 1: Vercel CLI
vercel --prod

# Option 2: Git push (if connected to Vercel)
git add .
git commit -m "Update: [description]"
git push origin main
# Vercel auto-deploys on push
```

### For Database Changes

1. Create new migration file: `migration_vX.X.sql`
2. Run in Supabase SQL Editor
3. Document changes in `schema.sql`

### For Edge Function Changes

```bash
# Update function code
# Then redeploy specific function
supabase functions deploy claude-proxy

# Or redeploy all
supabase functions deploy --project-ref your-ref
```

---

## 🐛 Troubleshooting Deployment

### Issue: App shows blank white screen

**Solutions:**
1. Check browser console for errors
2. Verify all scripts load (Network tab)
3. Check if Supabase URL/keys are correct
4. Ensure vercel.json is properly configured

### Issue: Authentication doesn't work

**Solutions:**
1. Verify Supabase Email auth is enabled
2. Check Site URL is set correctly
3. Check SMTP configuration (if using custom email)
4. Verify browser allows third-party cookies

### Issue: OTP not arriving

**Solutions:**
1. Check spam folder
2. Verify email address is correct
3. Check Supabase email quota (free tier: 3/hour)
4. Configure custom SMTP in Supabase settings

### Issue: Edge Functions return 401

**Solutions:**
1. Verify deployed WITHOUT `--no-verify-jwt`
2. Check JWT secret is correctly configured
3. Verify user is authenticated before calling
4. Check Edge Function logs for details

### Issue: CORS errors

**Solutions:**
1. Verify CORS domain matches deployment URL
2. Check HTTPS (not HTTP)
3. Redeploy Edge Functions after domain change
4. Verify OPTIONS preflight allows requests

### Issue: Rate limiting not working

**Solutions:**
1. Verify `ai_usage` table exists
2. Check Edge Function code uses database
3. Verify table has RLS policies
4. Check Edge Function logs for errors

### Issue: Data not saving

**Solutions:**
1. Check browser console for Supabase errors
2. Verify RLS policies allow user access
3. Check if user is authenticated
4. Verify table exists and schema is correct

### Issue: Contraction timer not loading

**Solutions:**
1. Verify `app-contractions.js` is loaded
2. Check script tag in `index.html`
3. Verify navigation integration in `app.js`
4. Check browser console for JavaScript errors

---

## 📊 Performance Optimization

### After Deployment

1. **Enable Compression**
   - Vercel automatically handles this
   - Gzip/Brotli compression enabled

2. **Optimize Images**
   - Use WebP format where supported
   - Compress images before upload
   - Consider Cloudinary for dynamic optimization

3. **Cache Strategy**
   - Static assets cached by Vercel CDN
   - Service worker caches app shell
   - LocalStorage for user data

4. **Lazy Loading**
   - Scripts load on demand
   - Images load as needed
   - Consider code splitting for large modules

---

## 🔒 Security Hardening

### Post-Deployment Security

1. **Review RLS Policies**
   ```sql
   -- Check all tables have RLS enabled
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

2. **Audit API Keys**
   - Rotate keys if exposed
   - Use environment variables only
   - Never commit keys to Git

3. **Monitor Logs**
   - Check for unusual activity
   - Set up alerts for errors
   - Review failed auth attempts

4. **Regular Updates**
   - Update dependencies monthly
   - Monitor security advisories
   - Apply patches promptly

---

## 📱 PWA Configuration

### After First Deployment

1. **Test PWA Installation**
   - Mobile: Chrome → Menu → "Add to Home Screen"
   - Desktop: Chrome → Address bar → Install icon

2. **Verify Service Worker**
   - DevTools → Application → Service Workers
   - Should show "activated and running"

3. **Test Offline**
   - Enable offline mode in DevTools
   - App should still load basic shell

4. **Update Manifest**
   - Verify icons display correctly
   - Test shortcuts work
   - Check theme color

---

## 🌍 Multi-Region Setup (Future)

For global reach:

### Vercel Edge Network
- Automatic global CDN
- No configuration needed
- Serves from nearest location

### Supabase Regions
- Select region closest to users (Project Settings)
- Consider multi-region for disaster recovery
- Currently: us-east-1, eu-west-1, ap-southeast-1

---

## 📈 Scaling Considerations

### When to Scale

Monitor these metrics:
- **API requests** > 500k/month → Consider paid plan
- **Database size** > 500MB → Review data retention
- **Storage** > 1GB → Implement cleanup
- **Edge Functions** > 2M invocations → Optimize calls

### Scaling Options

1. **Vercel Pro** ($20/month)
   - More bandwidth
   - Advanced analytics
   - Priority support

2. **Supabase Pro** ($25/month)
   - 8GB database
   - 100GB bandwidth
   - Daily backups

3. **Optimize Code**
   - Reduce API calls
   - Batch operations
   - Implement caching

---

## ✅ Deployment Success Checklist

- [ ] Code deployed to Vercel
- [ ] Database schema updated
- [ ] Edge Functions deployed (if needed)
- [ ] Environment variables configured
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Authentication working
- [ ] All features tested
- [ ] Mobile responsive verified
- [ ] PWA installable
- [ ] Monitoring enabled
- [ ] Documentation updated
- [ ] Team notified
- [ ] Users can access

---

## 🎉 Post-Launch

### Day 1
- [ ] Monitor error logs closely
- [ ] Watch user sign-ups
- [ ] Check performance metrics
- [ ] Respond to feedback quickly

### Week 1
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Update documentation
- [ ] Plan next features

### Month 1
- [ ] Analyze usage patterns
- [ ] Optimize based on data
- [ ] Plan v8.2 features
- [ ] Consider marketing

---

## 📞 Support Resources

### Documentation
- Main guide: `MASTER_GUIDE.md`
- Security: `SECURITY_DEPLOYMENT_GUIDE.md`
- Features: `CONTRACTION_TIMER_GUIDE.md`, `YOGA_FEATURES_GUIDE.md`
- Status: `CURRENT_STATUS.md`

### External Resources
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Lucide Icons:** https://lucide.dev
- **Chart.js:** https://www.chartjs.org/docs

### Community
- Vercel Discord: https://vercel.com/discord
- Supabase Discord: https://discord.supabase.com

---

## 🚨 Rollback Plan

If deployment fails:

### Rollback Code
```bash
# Vercel CLI
vercel rollback

# Or via Dashboard
# Vercel → Project → Deployments → Previous → "Promote to Production"
```

### Rollback Database
```sql
-- Restore from backup (Supabase Pro only)
-- Or manually revert changes
```

### Rollback Edge Functions
```bash
# Redeploy previous version
git checkout v8.0
supabase functions deploy claude-proxy
```

---

**Deployment Status:** Ready for Production ✅  
**Estimated Time:** 30-45 minutes  
**Difficulty:** Medium  
**Risk Level:** Low (with rollback plan)

---

*Last Updated: June 25, 2026*  
*MamaCare v8.1 — Deployment Guide*
