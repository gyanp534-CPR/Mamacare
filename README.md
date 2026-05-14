# MamaCare v7.7 🌸
**Complete Pregnancy Companion — Hindi/Hinglish/English + 5 more languages**

---

## 📁 GitHub File Structure

```
mamacare/                   ← Root folder (ye GitHub repo hai)
├── index.html              ← Main app (yahi browser mein open hoga)
├── app.js                  ← Core logic — Auth, Supabase, Navigation
├── app-baby.js             ← Baby tracker features
├── app-coach.js            ← AI coach features
├── app-extra.js            ← Additional modules
├── app-features.js         ← Feature modules
├── app-india.js            ← India-specific features
├── app-monetize.js         ← Premium subscription
├── app-onboard.js          ← Onboarding wizard
├── app-smart.js            ← AI features
├── app-tracker.js          ← Medical trackers
├── style.css               ← Styling
├── sw.js                   ← Service worker (PWA)
├── manifest.json           ← PWA manifest
├── schema.sql              ← Supabase database setup
├── vercel.json             ← Deployment config
└── README.md               ← Yeh file
```

> ⚠️ **Important:** Sab files ek hi folder mein hone chahiye.

---

## 🚀 Deploy Karne ke Steps

### Step 1 — Supabase Setup
1. [supabase.com](https://supabase.com) → apna project open karo
2. Left sidebar → **SQL Editor**
3. `schema.sql` ka poora content paste karo → **Run**
4. ✅ Sab tables + RLS ek click mein ready

### Step 2 — Auth Enable
1. Supabase → **Authentication** → **Email**
2. ✅ Enable **Email OTP** (Magic Link)
3. Site URL: `https://your-app.vercel.app` (baad mein update karo)

### Step 3 — Vercel Deploy
```
Option A — Drag & Drop:
  vercel.com → New Project → folder drag karo → Deploy

Option B — GitHub:
  1. GitHub pe repository banao (mamacare)
  2. Sab files upload karo
  3. vercel.com → Import Git Repository → Deploy
```

---

## ✨ Features

| Tab | Features |
|-----|----------|
| 😊 Mood | 10 mood states + AI companion + breathing |
| 📊 Dashboard | Week progress, today summary, milestones |
| 🗓️ Due Date | Calculator + week-by-week guide |
| ⚖️ Weight | Graph + gain tracking (Supabase sync) |
| 🧘 Yoga | 9 exercises + step-by-step instructions |
| 😴 Sleep | Tracker + 7-day chart + tips |
| 🍎 Nutrition | Food log + water tracker + meal plans |
| 💊 Meds | Daily tracker + taken/not taken |
| 🏥 Hospital Bag | 40+ items + checklist |
| 👶 Baby Names | 40+ names — Hindu/Muslim/Sikh/Modern |
| 📸 Journal | Diary + photo (saves to gallery) |
| 📅 Appointments | Tracker + test checklist |
| 📋 Birth Plan | Printable doctor document |
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
- **AI:** Claude API (Anthropic)
- **Hosting:** Vercel (free tier)

---

## 📋 Common Issues

| Error | Fix |
|-------|-----|
| Scripts not loading | Check all app-*.js files are in same folder |
| Login button not working | Supabase Auth → Email OTP enable karo |
| Data not saving | `schema.sql` run karo, RLS check karo |
| Icons not showing | Lucide CDN check karo in index.html |

---

*Made with 💗 — The Gyanam Project*
