# 🚀 Three High-Impact Features - Deployment Guide

## Overview

This guide covers deployment of three essential features:
1. **Onboarding Flow v2** - Enhanced first-time user experience
2. **Referral Program** - Viral growth mechanism
3. **Weekly Email Digest** - Retention through weekly summaries

---

## 1️⃣ Onboarding Flow v2

### Files Created:
- `app-onboarding-v2.js` - Main onboarding logic
- `style.css` - Onboarding styles (appended)

### Features:
- ✅ 5-step beautiful onboarding
- ✅ Due date/LMP capture
- ✅ Feature showcase
- ✅ Notification permission request
- ✅ Confetti celebration
- ✅ Progress indicator

### Integration Steps:

#### 1. Add to bundle build list
Edit `build.js` and add to `sourceFiles`:
```javascript
const sourceFiles = [
  'app-templates.js',
  'app.js',
  // ... other files
  'app-onboarding-v2.js',  // ADD THIS
  'app-enhancements.js',
  // ... rest
];
```

#### 2. Rebuild bundle
```bash
node build.js
```

#### 3. Test locally
- Open `index.html`
- Clear localStorage: `localStorage.clear()`
- Reload page
- Should see onboarding on first visit

### Auto-trigger Logic:
Onboarding shows automatically when:
- User has no `due_date` in profile
- OR `onboarding_completed` is false

### Manual trigger:
```javascript
// Force show onboarding
ONBOARDING_V2.show();
```

---

## 2️⃣ Referral Program

### Files Created:
- `app-referral.js` - Referral logic and UI
- `style.css` - Referral styles (appended)

### Features:
- ✅ Unique referral code per user
- ✅ 7 days premium per referral (up to 12 referrals)
- ✅ Bonus milestones (3, 5, 10 referrals)
- ✅ WhatsApp/Email/Native sharing
- ✅ Progress tracking dashboard

### Database Setup:

#### 1. Add columns to `user_profile` table
```sql
ALTER TABLE user_profile 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_referral_code ON user_profile(referral_code);
```

#### 2. Add to bundle
```javascript
// In build.js
const sourceFiles = [
  // ...
  'app-referral.js',  // ADD THIS
  // ...
];
```

#### 3. Add page to HTML
Edit `index.html` and add:
```html
<main class="page" id="page-referral">
  <!-- Referral content will be injected here -->
</main>
```

#### 4. Add navigation
In `app.js` or `app-smart.js`, add referral link:
```javascript
{
  label: 'Invite Friends',
  icon: '<i data-lucide="gift"></i>',
  page: 'referral',
  badge: '🎁'
}
```

### Integration with Auth:

#### Track referral on signup
In `app.js`, inside `sendOTP()` or after user creation:
```javascript
// After successful signup
const referralCode = localStorage.getItem('mc_referral_code');
if (referralCode) {
  await REFERRAL.track(referralCode);
  localStorage.removeItem('mc_referral_code');
}
```

### URL Parameter Handling:
Already implemented! When user visits:
```
https://mamacare.gyanam.shop?ref=EMMA1234
```
The code is saved to localStorage and applied on signup.

---

## 3️⃣ Weekly Email Digest

### Files Created:
- `supabase/functions/send-weekly-digest/index.ts`

### Features:
- ✅ Weekly pregnancy summary email
- ✅ Weight change tracking
- ✅ Mood summary
- ✅ Upcoming appointments
- ✅ Baby development facts
- ✅ Personalized tips by week

### Setup Steps:

#### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 3,000 emails/month)
3. Verify your domain:
   ```
   Domain: mamacare.gyanam.shop
   Add these DNS records:
   - MX record
   - DKIM record
   - SPF record
   ```
4. Create API key and save it

#### 2. Deploy Edge Function
```bash
# Login to Supabase
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx

# Deploy function
supabase functions deploy send-weekly-digest
```

#### 3. Set up Cron Job
In Supabase Dashboard:
1. Go to **Database** → **Extensions**
2. Enable `pg_cron`
3. Run this SQL:

```sql
-- Schedule weekly digest every Sunday at 9 AM IST (3:30 AM UTC)
SELECT cron.schedule(
  'send-weekly-digest',
  '30 3 * * 0',  -- Every Sunday at 3:30 AM UTC = 9 AM IST
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-digest',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'
      ),
      body := jsonb_build_object('trigger', 'cron')
    ) AS request_id;
  $$
);
```

Replace:
- `YOUR_PROJECT_REF` with your Supabase project ref
- `YOUR_ANON_KEY` with your anon key

#### 4. Add UI for Email Preferences

In `app.js` or create `app-email-settings.js`:
```javascript
// In settings page
<div class="card">
  <div class="sec-label">Email Preferences</div>
  <label class="toggle-row">
    <span>Weekly pregnancy digest</span>
    <input type="checkbox" id="emailDigestToggle" />
  </label>
  <p style="font-size: 13px; color: var(--muted); margin-top: 8px;">
    Get a weekly summary of your pregnancy progress every Sunday
  </p>
</div>

<script>
// Toggle handler
document.getElementById('emailDigestToggle').addEventListener('change', async (e) => {
  const enabled = e.target.checked;
  
  await window.supa
    .from('user_profile')
    .update({ email_digest_enabled: enabled })
    .eq('id', window.user.id);
  
  if (window.showToast) {
    window.showToast(
      enabled ? 'Weekly digest enabled! 📧' : 'Weekly digest disabled',
      'success'
    );
  }
});
</script>
```

#### 5. Test Email Delivery
```bash
# Manual test (one-time)
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-digest' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"test": true}'
```

Check your inbox!

---

## 🎨 UI/UX Enhancements

### Toast Notifications
All three features use toast notifications. Add this utility:

```javascript
// In app.js
window.showToast = function(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};
```

### Toast CSS (add to style.css):
```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  font-size: 14px;
  font-weight: 600;
  z-index: 10000;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-success {
  border-left: 4px solid #6AB89A;
}

.toast-error {
  border-left: 4px solid #e05c5c;
}

.toast-info {
  border-left: 4px solid #1e88e5;
}
```

---

## 📊 Analytics Tracking

### Events to Track:

```javascript
// Onboarding
trackEvent('onboarding_started');
trackEvent('onboarding_completed', { has_due_date, notifications_enabled });
trackEvent('onboarding_skipped', { step });

// Referral
trackEvent('referral_code_copied', { code });
trackEvent('referral_link_copied');
trackEvent('referral_shared', { platform: 'whatsapp' | 'email' | 'native' });
trackEvent('referral_tracked', { referrer_id, new_count });

// Email Digest
trackEvent('email_digest_enabled');
trackEvent('email_digest_disabled');
trackEvent('email_digest_sent', { week, user_id });
```

---

## 🔧 Troubleshooting

### Onboarding not showing?
```javascript
// Check profile
const profile = JSON.parse(localStorage.getItem('mc_profile') || '{}');
console.log('Onboarding completed:', profile.onboarding_completed);
console.log('Has due date:', profile.due_date);

// Force show
ONBOARDING_V2.show();
```

### Referral code not generating?
```javascript
// Check database
const { data } = await window.supa
  .from('user_profile')
  .select('referral_code, referral_count')
  .eq('id', window.user.id)
  .single();
  
console.log('Referral data:', data);
```

### Email digest not sending?
```bash
# Check function logs
supabase functions logs send-weekly-digest

# Check cron job
SELECT * FROM cron.job WHERE jobname = 'send-weekly-digest';

# Manual trigger
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-weekly-digest' \
  -H 'Authorization: Bearer YOUR_KEY'
```

---

## 🚀 Deployment Checklist

### Before Deploy:
- [ ] Rebuild bundle: `node build.js`
- [ ] Test onboarding flow locally
- [ ] Test referral code generation
- [ ] Test email template rendering
- [ ] Update database schema (referral columns)
- [ ] Set up Resend account and verify domain
- [ ] Deploy Supabase Edge Function
- [ ] Set up cron job for weekly digest
- [ ] Add navigation links to new features
- [ ] Test all sharing buttons
- [ ] Verify toast notifications work
- [ ] Check mobile responsiveness

### Deploy:
```bash
# Commit changes
git add .
git commit -m "feat: Add onboarding v2, referral program, and email digest"
git push origin main

# Vercel will auto-deploy
```

### After Deploy:
- [ ] Test onboarding on production
- [ ] Generate referral code on production
- [ ] Share referral link and verify tracking
- [ ] Enable email digest for test user
- [ ] Wait for Sunday or manually trigger email
- [ ] Monitor Supabase function logs
- [ ] Check Resend dashboard for email delivery
- [ ] Track analytics events

---

## 📈 Expected Impact

| Feature | Metric | Expected Impact |
|---------|--------|-----------------|
| Onboarding v2 | Activation rate | +40% |
| Onboarding v2 | Feature discovery | +50% |
| Referral Program | Organic signups | +30% month-over-month |
| Referral Program | User engagement | +25% (gamification) |
| Email Digest | Week-over-week retention | +60% |
| Email Digest | Re-engagement | +45% |

---

## 🎯 Next Steps

### Week 1:
- Deploy all three features
- Monitor analytics
- Collect user feedback
- Fix any bugs

### Week 2:
- A/B test onboarding variations
- Optimize email template
- Add more sharing options

### Week 3:
- Launch referral contest (top 10 referrers get prizes)
- Add email digest customization (choose topics)
- Create onboarding video

---

## 💡 Pro Tips

1. **Onboarding**: Show feature showcase with real screenshots
2. **Referral**: Add leaderboard to gamify competition
3. **Email**: Personalize subject line with user's name
4. **Analytics**: Track funnel drop-offs at each step
5. **Testing**: Use your own email for digest testing

---

## 📞 Support

If you encounter issues:
1. Check function logs: `supabase functions logs send-weekly-digest`
2. Verify database schema: `\d user_profile`
3. Test manually: `curl` commands above
4. Check Resend dashboard for email status

---

## 🎉 Success Metrics

### Week 1 Goals:
- ✅ 100% of new users complete onboarding
- ✅ 50 referral codes generated
- ✅ 10 successful referral conversions
- ✅ 200+ weekly digest emails sent
- ✅ 30%+ email open rate

### Month 1 Goals:
- ✅ 90%+ users see onboarding
- ✅ 500+ referral signups
- ✅ 1,000+ weekly digests sent
- ✅ 25%+ email click-through rate
- ✅ 15%+ premium conversion from referrals

---

*Deployment guide created by Kiro AI Assistant*  
*Features: Onboarding v2 | Referral Program | Email Digest*  
*Version: 1.0*  
*Date: July 9, 2026*
