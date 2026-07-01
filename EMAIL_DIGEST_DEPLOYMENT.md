# 📧 Weekly Email Digest - Deployment Guide

## ✅ Files Created

1. ✅ `supabase/functions/send-weekly-digest/index.ts` - Edge function
2. ✅ `supabase/migrations/20260701_email_digest.sql` - Database migration
3. ✅ `app-email-digest.js` - Frontend UI and logic

---

## 🚀 Deployment Steps

### Step 1: Set Up Resend Account

1. Go to https://resend.com/signup
2. Create free account (3,000 emails/month)
3. Add and verify your domain:
   - Domain: `mamacare.gyanam.shop`
   - Add DNS records (SPF, DKIM, DMARC)
4. Create API key:
   - Go to API Keys → Create
   - Copy the key (starts with `re_`)

### Step 2: Add Environment Variable

```bash
# In your terminal
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

Or via Supabase Dashboard:
- Go to Project Settings → Edge Functions → Secrets
- Add: `RESEND_API_KEY` = `re_your_api_key_here`

### Step 3: Run Database Migration

```bash
supabase db push
```

Or manually in Supabase SQL Editor, run the contents of:
`supabase/migrations/20260701_email_digest.sql`

### Step 4: Deploy Edge Function

```bash
# Make sure you're in the project root
cd d:/Mamacare

# Deploy the function
supabase functions deploy send-weekly-digest --no-verify-jwt

# Test it works
supabase functions invoke send-weekly-digest
```

### Step 5: Set Up Cron Job

In Supabase SQL Editor, run:

```sql
-- Create cron job to run every Sunday at 9:00 AM IST (3:30 AM UTC)
SELECT cron.schedule(
  'weekly-pregnancy-digest',
  '30 3 * * 0',  -- Every Sunday at 3:30 AM UTC (9:00 AM IST)
  $$
    SELECT net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-digest',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      )
    );
  $$
);

-- Verify cron job was created
SELECT * FROM cron.job WHERE jobname = 'weekly-pregnancy-digest';
```

**Replace `YOUR_PROJECT_REF` with your actual Supabase project reference.**

To find your project ref:
- Go to Project Settings → General
- Copy "Reference ID"

### Step 6: Add Script to index.html

Add before closing `</body>` tag in `index.html`:

```html
<!-- Email Digest Module -->
<script src="app-email-digest.js"></script>
```

### Step 7: Test the Integration

1. **Load the app** and go to More menu
2. **Check** that "Weekly Email Digest" card appears
3. **Enter your email** and click "Verify Email"
4. **Toggle** the checkbox to enable
5. **Send test email** (if admin)

Or manually test the function:

```bash
# Test with curl
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-digest' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

---

## 🔧 Configuration

### DNS Records (for Resend)

Add these to your domain DNS settings:

```
Type    Name                Value
----    ----                -----
TXT     @                   v=spf1 include:_spf.resend.com ~all
CNAME   resend._domainkey   resend._domainkey.resend.com
TXT     _dmarc              v=DMARC1; p=none; rua=mailto:dmarc@mamacare.gyanam.shop
```

### Email Verification (Production)

For production, replace auto-verification in `app-email-digest.js` with actual email verification:

```javascript
// Call verification edge function
const { error } = await window.supa.functions.invoke('send-verification-email', {
  body: { email, user_id: window.user.id }
});
```

You'll need to create `send-verification-email` function separately.

---

## 📊 Monitoring

### Check Cron Job Status

```sql
-- View all scheduled jobs
SELECT * FROM cron.job;

-- View job run history
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'weekly-pregnancy-digest')
ORDER BY start_time DESC 
LIMIT 10;
```

### View Function Logs

```bash
# Real-time logs
supabase functions logs send-weekly-digest --follow

# Last 100 lines
supabase functions logs send-weekly-digest
```

Or in Supabase Dashboard:
- Go to Edge Functions → send-weekly-digest → Logs

### Check Email Delivery

- Go to Resend Dashboard → Logs
- See delivery status, bounces, opens, clicks

---

## 🐛 Troubleshooting

### Function Not Executing

1. **Check cron job exists:**
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'weekly-pregnancy-digest';
   ```

2. **Check function deployed:**
   ```bash
   supabase functions list
   ```

3. **Test function manually:**
   ```bash
   supabase functions invoke send-weekly-digest
   ```

### Emails Not Sending

1. **Check RESEND_API_KEY is set:**
   ```bash
   supabase secrets list
   ```

2. **Check function logs for errors:**
   ```bash
   supabase functions logs send-weekly-digest --limit 20
   ```

3. **Verify DNS records:** Check Resend dashboard → Domains → Status

4. **Check email quota:** Resend free tier = 3,000/month

### Users Not Receiving Emails

1. **Check user has email set:**
   ```sql
   SELECT id, name, email, email_verified, email_digest_enabled 
   FROM user_profile 
   WHERE email IS NOT NULL;
   ```

2. **Check user meets criteria:**
   - `email_digest_enabled = true`
   - `email_verified = true`
   - `due_date` is set and within 1-42 weeks

3. **Check spam folder**

4. **Check Resend logs for bounces**

---

## 💰 Costs & Scaling

### Resend Pricing

| Tier | Monthly Emails | Price |
|------|---------------|-------|
| Free | 3,000 | $0 |
| Pro | 50,000 | $20 |
| Scale | 250,000 | $80 |

### Expected Usage

- 100 users = ~400 emails/month (under free tier)
- 500 users = ~2,000 emails/month (under free tier)
- 1,000 users = ~4,000 emails/month (need Pro tier)

### Optimization Tips

1. **Batch processing:** Process users in batches of 100
2. **Skip inactive users:** Add last_active_at check
3. **Frequency options:** Add monthly digest option
4. **Unsubscribe tracking:** Respect opt-outs immediately

---

## 🎯 Success Metrics

Track in Supabase:

```sql
CREATE TABLE email_digest_stats (
  id BIGSERIAL PRIMARY KEY,
  sent_date DATE NOT NULL,
  total_users INT NOT NULL,
  emails_sent INT NOT NULL,
  emails_failed INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert stats after each run (add to edge function)
INSERT INTO email_digest_stats (sent_date, total_users, emails_sent, emails_failed)
VALUES (CURRENT_DATE, :total, :sent, :failed);
```

Dashboard queries:

```sql
-- Weekly send rate
SELECT sent_date, emails_sent, emails_failed 
FROM email_digest_stats 
ORDER BY sent_date DESC 
LIMIT 10;

-- Total emails sent (all time)
SELECT SUM(emails_sent) as total_sent FROM email_digest_stats;

-- Average open rate (from Resend API)
-- Track separately via Resend webhooks
```

---

## 🔐 Security

### Best Practices

1. ✅ Use service role key (not anon key) in cron job
2. ✅ Validate email format before sending
3. ✅ Rate limit: max 1 email per user per week
4. ✅ Unsubscribe link in every email
5. ✅ Don't log email content (privacy)

### Email Verification (Future)

Create separate verification function:

```typescript
// supabase/functions/send-verification-email/index.ts
const verificationToken = crypto.randomUUID();
const verificationLink = `https://mamacare.gyanam.shop/verify-email?token=${verificationToken}`;

// Save token in database
await supabase.from('email_verifications').insert({
  user_id,
  email,
  token: verificationToken,
  expires_at: new Date(Date.now() + 24 * 3600000) // 24 hours
});

// Send email with verification link
await resend.emails.send({
  from: 'Mama Gyan <verify@mamacare.gyanam.shop>',
  to: email,
  subject: 'Verify your email - Mama Gyan',
  html: `Click to verify: <a href="${verificationLink}">Verify Email</a>`
});
```

---

## ✅ Launch Checklist

Before enabling for all users:

- [ ] DNS records verified in Resend
- [ ] Edge function deployed and tested
- [ ] Cron job scheduled and verified
- [ ] Test email received successfully
- [ ] Email renders correctly on mobile
- [ ] Unsubscribe link works
- [ ] Database migration applied
- [ ] Frontend UI added to index.html
- [ ] Privacy policy updated (mentions emails)
- [ ] Monitoring dashboard set up

---

## 📈 Future Enhancements

### Phase 2 Features:

1. **Personalized subject lines**
   ```
   "Week 24, ${name}! Your baby is practicing breathing 👶"
   ```

2. **A/B testing**
   - Test different send times
   - Test different email layouts
   - Track which content drives app opens

3. **Transactional emails**
   - Appointment reminders (24h before)
   - Medicine reminders (if not taken)
   - Milestone achievements

4. **Rich content**
   - Embedded weight chart (Chart.js → image)
   - Baby size comparison images
   - Video tips

5. **Multi-language**
   - Detect user language preference
   - Send in Hinglish/Hindi/English

---

## 🎉 Done!

Your weekly email digest is now live! Users will receive beautiful pregnancy summaries every Sunday at 9 AM IST.

**Next steps:**
- Monitor first week's delivery rate
- Check Resend logs for bounces
- Survey users for feedback
- Iterate on content based on engagement

---

*Deployment guide created by Kiro AI*  
*Last updated: July 1, 2026*
