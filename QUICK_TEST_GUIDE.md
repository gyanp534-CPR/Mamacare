# 🧪 Quick Test Guide - 4 New Features

## Before Testing
1. Make sure you're running the app locally or on staging
2. Have a test user account with some existing data (weight, mood, appointments)
3. Have Chrome DevTools open to check for console errors

---

## ✅ Test Checklist

### 1. PDF Health Report

**Navigate**: Dashboard → "Premium & Postpartum" → "PDF Report 👑"

**Test Steps**:
1. [ ] Page loads without errors
2. [ ] Click "Generate PDF Report" button
3. [ ] Loading indicator shows
4. [ ] PDF downloads to your device
5. [ ] Open PDF - verify it contains:
   - [ ] Your profile info
   - [ ] Weight chart (if you have weight logs)
   - [ ] Sleep logs
   - [ ] Mood history
   - [ ] Kick counts
   - [ ] Medications
   - [ ] Upcoming appointments
6. [ ] Test without Premium (should show upgrade prompt)

**Expected Behavior**:
- Premium users: PDF downloads successfully
- Free users: Alert "PDF Health Reports are a Premium feature. Upgrade to unlock!"

---

### 2. ASHA/ANM Chatbot Mode

**Navigate**: Dashboard → "Premium & Postpartum" → "ASHA Mode"  
**OR**: More Menu (grid icon) → "ASHA Assistant"

**Test Steps**:
1. [ ] Page loads with language selector (Hinglish, Hindi, English)
2. [ ] Info card explains it's for health workers
3. [ ] 8 quick topic buttons visible
4. [ ] Click a quick topic button (e.g., "Anemia Detection")
5. [ ] AI response appears in chat
6. [ ] Response includes: Urgency, Assessment, Action, Red Flags, Counseling
7. [ ] Switch language to Hindi - UI updates
8. [ ] Type custom query: "High BP in pregnancy kya kare?"
9. [ ] Click Send - AI responds appropriately
10. [ ] Clear conversation button works

**Expected Behavior**:
- Responses are in selected language
- Responses follow ASHA format (urgency assessment + action steps)
- No errors in console

---

### 3. Breastfeeding Tracker

**Navigate**: Dashboard → "Premium & Postpartum" → "Breastfeeding"  
**OR**: More Menu → "Breastfeeding"

**Test Steps**:
1. [ ] Page loads with "Start New Feed" buttons (Left/Right/Both)
2. [ ] Click "Start Feed - Left Breast"
3. [ ] Timer starts (00:00, 00:01, 00:02...)
4. [ ] Active session card shows with timer
5. [ ] Click "Switch" - breast changes to Right
6. [ ] Timer continues running
7. [ ] Click "End Feed"
8. [ ] Modal appears asking for:
   - [ ] Latch quality (Good/Okay/Poor)
   - [ ] Notes (optional)
9. [ ] Save feed
10. [ ] Today's summary updates:
    - [ ] Total feeds count
    - [ ] Total duration
    - [ ] Last feed time
11. [ ] Feed appears in history list
12. [ ] Log multiple feeds over different times
13. [ ] Weekly chart renders (if Chart.js loaded)
14. [ ] Click "Export CSV" - file downloads

**Expected Behavior**:
- Timer counts up in real-time
- Switch button changes breast without stopping timer
- Feed saves to database
- Today's stats update immediately
- History shows all feeds in reverse chronological order

---

### 4. Weekly Email Digest (Backend)

**Note**: This is a backend feature, so testing is different

**Setup Required First**:
1. Deploy Edge Function to Supabase:
```bash
supabase functions deploy weekly-digest
```

2. Set Resend API key:
```bash
supabase secrets set RESEND_API_KEY=re_xxxxx
```

3. Run database migration:
```sql
ALTER TABLE user_profile 
ADD COLUMN IF NOT EXISTS email_digest_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS digest_day VARCHAR(10) DEFAULT 'sunday',
ADD COLUMN IF NOT EXISTS digest_time VARCHAR(5) DEFAULT '08:00';
```

**Test Manually**:
```bash
# Test Edge Function locally
supabase functions serve weekly-digest

# Send test request
curl -X POST http://localhost:54321/functions/v1/weekly-digest \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

**Test Steps**:
1. [ ] Edge Function deploys without errors
2. [ ] Function runs successfully
3. [ ] Check your test email inbox
4. [ ] Email received with:
   - [ ] Beautiful gradient header
   - [ ] Pregnancy week shown
   - [ ] Weight trend (if data exists)
   - [ ] Mood summary
   - [ ] Sleep quality
   - [ ] Upcoming appointments
5. [ ] Links in email work (link to app)

**Expected Behavior**:
- Email arrives within 1-2 minutes
- HTML renders correctly (not plain text)
- All data sections populate (or show "No data" gracefully)

---

## 🐛 Common Issues & Fixes

### PDF Generation Fails
**Issue**: "Failed to generate PDF"  
**Fix**: Check if jsPDF loaded correctly. Open DevTools → Network → check for jsPDF CDN request

### ASHA Chatbot No Response
**Issue**: Click Send but no response  
**Fix**: 
- Check console for Claude API errors
- Verify Supabase Edge Function `claude-proxy` is deployed
- Check API key is set in Supabase secrets

### Breastfeeding Timer Not Starting
**Issue**: Click button but timer stays 00:00  
**Fix**: Check console errors. Verify `BF` object is defined: `console.log(window.BF)`

### Email Not Received
**Issue**: Edge Function runs but no email  
**Fix**:
- Check Resend dashboard for delivery status
- Verify `RESEND_API_KEY` is set correctly
- Check user's email is verified in Supabase auth

---

## ✅ Success Criteria

All features are working if:
- [ ] PDF downloads with real data
- [ ] ASHA chatbot responds in all 3 languages
- [ ] Breastfeeding timer runs and saves feeds
- [ ] Weekly email arrives in inbox
- [ ] No console errors
- [ ] Navigation works from dashboard and more menu
- [ ] All features are mobile-responsive

---

## 📸 Screenshots to Take

For documentation/marketing:
1. PDF Report page with "Generate" button
2. Downloaded PDF open in PDF viewer
3. ASHA chatbot with Hindi response
4. Breastfeeding timer running (active session)
5. Breastfeeding feed history with chart
6. Weekly email in inbox (desktop + mobile)
7. Dashboard "Premium & Postpartum" section with 3 new features

---

## 🚀 Ready to Launch?

After all tests pass:
1. [ ] Create git commit: `feat: add 4 new features (pdf, asha, breastfeeding, email digest)`
2. [ ] Push to main branch
3. [ ] Deploy to production (Vercel)
4. [ ] Deploy Edge Function to production Supabase
5. [ ] Set up cron job in Supabase for weekly emails
6. [ ] Send push notification announcing features
7. [ ] Monitor Sentry for errors
8. [ ] Track analytics for feature adoption

---

**Testing Time Estimate**: 30-45 minutes for full manual testing  
**Last Updated**: June 27, 2026
