# MamaCare v8.1 🌸
**Complete Pregnancy Companion — Hindi/Hinglish/English + 5 more languages**

> **Latest Update (June 2026):** Security-hardened, OTP fixes, animated yoga poses, push notifications ✨

---

## 📁 GitHub File Structure

```
mamacare/                   ← Root folder (ye GitHub repo hai)
├── index.html              ← Main app (yahi browser mein open hoga)
├── app.js                  ← Core logic — Auth, Supabase, Navigation
├── app-baby.js             ← Baby tracker features
├── app-coach.js            ← AI coach features
├── app-enhancements.js     ← Latest enhancements
├── app-extra.js            ← Additional modules
├── app-features.js         ← Feature modules
├── app-improvements.js     ← UI/UX improvements
├── app-india.js            ← India-specific features
├── app-monetize.js         ← Premium subscription
├── app-onboard.js          ← Onboarding wizard
├── app-push.js             ← Push notifications & reminders
├── app-smart.js            ← AI features
├── app-tracker.js          ← Medical trackers
├── style.css               ← Styling (with animated yoga poses)
├── sw.js                   ← Service worker (PWA)
├── manifest.json           ← PWA manifest (enhanced)
├── schema.sql              ← Supabase database setup
├── schema_security_updates.sql  ← Security migrations
├── vercel.json             ← Deployment config (with security headers)
├── supabase/functions/     ← Edge functions (secured)
└── README.md               ← Yeh file
```

> ⚠️ **Important:** Sab files ek hi folder mein hone chahiye.

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Quick start guide (this file) |
| `CURRENT_STATUS.md` | Project status & next steps |
| `SECURITY_DEPLOYMENT_GUIDE.md` | Security deployment instructions |
| `SECURITY_FIXES_COMPLETE.md` | Security vulnerability fixes |
| `YOGA_FEATURES_GUIDE.md` | Yoga section user guide |
| `QUICK_START.md` | Yoga quick start |
| `VERIFICATION_CHECKLIST.md` | Testing checklist |

---

## 🚀 Deploy Karne ke Steps

### Step 1 — Supabase Setup
1. [supabase.com](https://supabase.com) → apna project open karo
2. Left sidebar → **SQL Editor**
3. `schema.sql` ka poora content paste karo → **Run**
4. `schema_security_updates.sql` bhi run karo (for security features)
5. ✅ Sab tables + RLS ek click mein ready

### Step 2 — Auth Enable
1. Supabase → **Authentication** → **Email**
2. ✅ Enable **Email OTP** (Magic Link)
3. Site URL: `https://your-app.vercel.app` (baad mein update karo)

### Step 3 — Edge Functions Deploy (Optional - for AI & subscriptions)
```bash
# Install Supabase CLI first
npm install -g supabase

# Deploy edge functions
supabase functions deploy claude-proxy
supabase functions deploy razorpay-subscription
```

### Step 4 — Vercel Deploy
```
Option A — Drag & Drop:
  vercel.com → New Project → folder drag karo → Deploy

Option B — GitHub:
  1. GitHub pe repository banao (mamacare)
  2. Sab files upload karo
  3. vercel.com → Import Git Repository → Deploy
```

### Step 5 — Security Configuration
See `SECURITY_DEPLOYMENT_GUIDE.md` for complete security setup

---

## ✨ Features

| Tab | Features |
|-----|----------|
| 😊 Mood | 10 mood states + AI companion + breathing |
| 📊 Dashboard | Week progress, today summary, milestones |
| 🗓️ Due Date | Calculator + week-by-week guide |
| ⚖️ Weight | Graph + gain tracking (Supabase sync) |
| 🧘 Yoga | 9 exercises + animated poses + step-by-step instructions + timer |
| 😴 Sleep | Tracker + 7-day chart + tips |
| 🍎 Nutrition | Food log + water tracker + meal plans |
| 💊 Meds | Daily tracker + taken/not taken |
| 🏥 Hospital Bag | 40+ items + checklist |
| 👶 Baby Names | 40+ names — Hindu/Muslim/Sikh/Modern |
| 📸 Journal | Diary + photo (saves to gallery) |
| 📅 Appointments | Tracker + test checklist |
| 📋 Birth Plan | Printable doctor document |
| ⏱️ **Contractions** | **Timer + 5-1-1 alerts + history + CSV export** |
| 🤰 Postpartum | 4-phase recovery guide |
| 🩺 Symptoms | 12 symptoms — causes + relief |
| 🚨 SOS | GPS hospital finder + emergency numbers |

---

## 🌍 Languages
Hinglish • हिंदी • English • தமிழ் • বাংলা • मराठी • తెలుగు

---

## 🔧 Tech Stack
- **Frontend:** Vanilla HTML + CSS + JS (no framework)
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Charts:** Chart.js
- **Icons:** Lucide Icons
- **AI:** Claude API (Anthropic) — Rate limited & secured
- **Payments:** Razorpay (India) — JWT authenticated
- **Security:** DOMPurify, CSP headers, JWT verification
- **Hosting:** Vercel (free tier)

---

## 🔒 Security Features
- ✅ XSS Protection (DOMPurify sanitization)
- ✅ JWT Authentication on all endpoints
- ✅ Database-backed rate limiting
- ✅ Domain-locked CORS
- ✅ Full CSP and security headers

---

## 📋 Common Issues

| Error | Fix |
|-------|-----|
| Scripts not loading | Check all app-*.js files are in same folder |
| Login button not working | Supabase Auth → Email OTP enable karo |
| OTP paste not working | Update to latest app.js (Android paste handler added) |
| Push notifications not firing | Check notification permissions + updated app-push.js |
| Data not saving | `schema.sql` run karo, RLS check karo |
| Icons not showing | Lucide CDN check karo in index.html |
| Animations not smooth | Use modern browser (Chrome, Firefox, Safari, Edge) |
| 401 errors on AI/payments | Edge functions need JWT authentication (no --no-verify-jwt) |

---

## 📚 Documentation & Guides

For detailed guides, see:
- **CURRENT_STATUS.md** - Overall project status
- **SECURITY_DEPLOYMENT_GUIDE.md** - Security deployment steps
- **YOGA_FEATURES_GUIDE.md** - Yoga section features
- **QUICK_START.md** - Quick start for yoga
- **VERIFICATION_CHECKLIST.md** - Testing checklist

---

*Made with 💗 — The Gyanam Project*
