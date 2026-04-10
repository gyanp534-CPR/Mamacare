# MamaCare v6 🌸
**Complete Pregnancy Companion — Hindi/Hinglish/English + 5 more languages**

---

## 📁 GitHub File Structure

```
mamacare/                   ← Root folder (ye GitHub repo hai)
├── index.html              ← Main app (yahi browser mein open hoga)
├── app.js                  ← Sab JS logic — Auth, Supabase, Features
├── schema.sql              ← Supabase database setup (ek baar run karo)
├── favicon.svg             ← App icon (browser tab pe dikhega)
└── README.md               ← Yeh file
```

> ⚠️ **Important:** `index.html` aur `app.js` ek hi folder mein hone chahiye.
> `app-extra.js` v6 mein nahi hai — sab kuch `app.js` mein merge ho gaya.

---

## 🚀 Deploy Karne ke Steps

### Step 1 — Supabase Setup
1. [supabase.com](https://supabase.com) → apna project open karo
2. Left sidebar → **SQL Editor**
3. `schema.sql` ka poora content paste karo → **Run**
4. ✅ Sab 13 tables + RLS ek click mein ready

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
  2. Teeno files upload karo
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
- **AI:** Claude API (Anthropic)
- **Hosting:** Vercel (free tier)

---

## 📋 Common Issues

| Error | Fix |
|-------|-----|
| `MC is not defined` | `app.js` load nahi hua — check file name |
| `favicon 404` | `favicon.svg` same folder mein rakho |
| Login button kaam nahi | Supabase Auth → Email OTP enable karo |
| Data save nahi | `schema.sql` run karo, RLS check karo |

---

*Made with 💗 — The Gyanam Project*
