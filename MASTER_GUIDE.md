# 📘 MamaCare v8.1 — Master Documentation Guide

**Complete Reference for Development, Deployment, and Features**

---

## 📑 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Architecture](#architecture)
4. [Features & Modules](#features--modules)
5. [Security](#security)
6. [Deployment](#deployment)
7. [Development Guide](#development-guide)
8. [Troubleshooting](#troubleshooting)
9. [Future Roadmap](#future-roadmap)
10. [Documentation Index](#documentation-index)

---

## Quick Start

### For Users
1. Visit the deployed app at `https://mamacare-nine.vercel.app/`
2. Sign up with email (OTP-based authentication)
3. Complete onboarding (name, due date, language)
4. Start tracking your pregnancy journey!

### For Developers
```bash
# Clone the repository
git clone <repo-url>
cd mamacare

# Install dependencies (for Supabase CLI only)
npm install -g supabase

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and keys

# Open index.html in browser
# OR deploy to Vercel
vercel --prod
```

📖 **Detailed Instructions:** See `README.md`

---

## Project Overview

### What is MamaCare?

MamaCare is a comprehensive pregnancy companion app designed specifically for Indian mothers, offering:
- **Multi-language Support** — Hinglish, Hindi, English, Tamil, Bengali, Marathi, Telugu
- **Holistic Tracking** — Weight, mood, sleep, nutrition, medications, appointments
- **AI Coach** — Claude-powered pregnancy advice and emotional support
- **Yoga & Wellness** — 9 animated yoga poses with built-in timer
- **Emergency Features** — SOS with GPS hospital finder
- **Premium Features** — Ad-free, unlimited AI, priority support via Razorpay

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Vanilla HTML/CSS/JS | No framework, lightweight |
| **Backend** | Supabase | PostgreSQL + Auth + RLS |
| **AI** | Claude API (Anthropic) | Conversational coach |
| **Payments** | Razorpay | Indian payment gateway |
| **Charts** | Chart.js | Data visualization |
| **Icons** | Lucide Icons | SVG icon library |
| **Security** | DOMPurify, JWT, CSP | XSS protection, auth |
| **Hosting** | Vercel | Static hosting + serverless |
| **PWA** | Service Worker | Offline capability |

### Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| 8.1 | June 2026 | Security hardening, yoga animations, OTP fixes |
| 8.0 | May 2026 | Multi-language, AI coach, premium features |
| 7.x | Apr 2026 | Core tracking features |

---

## Architecture

### File Structure

```
mamacare/
├── index.html              # Main entry point
├── app.js                  # Core: Auth, navigation, state
├── app-*.js               # Feature modules (11 files)
│   ├── app-baby.js        # Baby tracker
│   ├── app-coach.js       # AI coach
│   ├── app-enhancements.js # Latest features
│   ├── app-extra.js       # Additional features
│   ├── app-features.js    # Core features
│   ├── app-improvements.js # UI/UX improvements
│   ├── app-india.js       # India-specific (hospital finder, etc.)
│   ├── app-monetize.js    # Premium subscription
│   ├── app-onboard.js     # Onboarding wizard
│   ├── app-push.js        # Push notifications
│   ├── app-smart.js       # AI features
│   └── app-tracker.js     # Medical trackers
├── style.css              # All styling (including yoga)
├── sw.js                  # Service worker (PWA)
├── manifest.json          # PWA manifest
├── vercel.json            # Deployment + security headers
├── schema.sql             # Database setup
├── schema_security_updates.sql # Security migrations
└── supabase/functions/    # Edge functions
    ├── claude-proxy/      # AI rate limiting
    └── razorpay-subscription/ # Payment handling
```

### Data Flow

```
User Browser
    ↓
index.html → app.js (Auth, State)
    ↓
app-*.js modules (Features)
    ↓
Supabase Client (PostgreSQL)
    ↓
Supabase Edge Functions
    ↓
External APIs (Claude, Razorpay)
```

### Database Schema

**Core Tables:**
- `users` — User profiles (RLS enabled)
- `weight_logs` — Daily weight tracking
- `mood_logs` — Mood check-ins with notes
- `sleep_logs` — Sleep duration tracking
- `food_logs` — Nutrition tracking
- `medicine_logs` — Medication adherence
- `appointments` — Doctor appointments
- `journal_entries` — Diary with photos
- `subscriptions` — Premium status

**Security Tables:**
- `ai_usage` — Rate limiting (15 calls/day for free users)
- `audit_log` — Security event tracking

📖 **Full Schema:** See `schema.sql` and `schema_security_updates.sql`

---

## Features & Modules

### 1. Authentication (`app.js`)
- **Email OTP** — Magic link-based login
- **Android Paste Fix** — OTP paste handler for Android
- **Secure Session** — JWT-based with Supabase Auth
- **RLS Enforcement** — Row-level security on all tables

### 2. Dashboard (`app.js`)
- **Week Progress** — Current pregnancy week
- **Today Summary** — Quick stats (weight, mood, sleep)
- **Milestones** — Week-by-week baby development
- **Quick Actions** — Shortcuts to common tasks

### 3. Weight Tracker (`app-tracker.js`)
- **Daily Logging** — Track weight with date picker
- **Chart Visualization** — 7-day line graph
- **Gain Analysis** — Compare with healthy range
- **Synced Storage** — Supabase database

### 4. Mood Tracker (`app.js`)
- **10 Mood States** — From anxious to joyful
- **AI Companion** — Context-aware responses
- **Breathing Exercise** — Guided 4-7-8 technique
- **Mood History** — Past week overview

### 5. Yoga Section (`app.js`, `style.css`)
✨ **Recently Enhanced with Animated Demonstrations**

**Features:**
- **9 Animated Poses** — SVG animations showing movement
- **Interactive Modal** — Full-screen with timer
- **Built-in Timer** — Play/Pause/Reset functionality
- **Category Filters** — By trimester, type (breathing, strength, etc.)
- **Step-by-Step Instructions** — Numbered guides
- **Benefits & Cautions** — Color-coded sections
- **Responsive Design** — Mobile, tablet, desktop optimized

**Poses:**
1. Cat-Cow Stretch — Back pain relief
2. Butterfly Pose — Pelvic floor prep
3. Prenatal Squats — Labor prep
4. Ujjayi Pranayama — Stress relief
5. Kegel Exercises — Pelvic floor strength
6. Side-Lying Leg Lifts — Hip strength
7. Prenatal Walking — Overall fitness
8. Child's Pose — Relaxation
9. Lamaze Breathing — Labor breathing

📖 **User Guide:** `YOGA_FEATURES_GUIDE.md` | **Quick Start:** `QUICK_START.md`

### 6. AI Coach (`app-coach.js`, `app-smart.js`)
- **Claude Integration** — Powered by Anthropic
- **Context-Aware** — Knows pregnancy week, history
- **Rate Limited** — 15 calls/day (free), unlimited (premium)
- **Secure Proxy** — JWT + database tracking
- **Conversation History** — Saved in localStorage

### 7. Nutrition (`app-tracker.js`)
- **Food Logging** — Name + time tracking
- **Water Tracker** — 8 glasses/day goal with visual progress
- **Indian Meal Plans** — Trimester-specific (vegetarian/non-veg)
- **Reminders** — Push notifications at 10am, 2pm, 6pm

### 8. Medication Tracker (`app-tracker.js`)
- **Medicine List** — Name + time + frequency
- **Daily Checkoff** — Mark as taken/not taken
- **Push Reminders** — Scheduled notifications
- **History View** — Past adherence

### 9. Sleep Tracker (`app-tracker.js`)
- **Duration Logging** — Hours per night
- **7-Day Chart** — Bar graph visualization
- **Sleep Tips** — Trimester-specific advice
- **Goal Tracking** — 7-9 hours recommended

### 10. Appointments (`app-tracker.js`)
- **Appointment Calendar** — Date + doctor + notes
- **Test Checklist** — Common prenatal tests
- **Reminders** — Upcoming appointments

### 11. Hospital Bag Checklist (`app-india.js`)
- **40+ Items** — Categorized (mom, baby, documents)
- **Custom Items** — Add your own
- **Progress Tracking** — Visual percentage
- **Printable** — Export checklist

### 12. Baby Names (`app-baby.js`)
- **40+ Names** — Hindu, Muslim, Sikh, Modern
- **Search & Filter** — By religion, meaning
- **Favorites** — Save your top picks
- **Meaning Display** — Name meanings in multiple languages

### 13. Photo Journal (`app-features.js`)
- **Diary Entries** — Text + photo
- **Camera Integration** — Take or upload photos
- **Base64 Storage** — Currently localStorage (⚠️ 5-10MB limit)
- **Future:** Cloud storage migration planned

### 14. Birth Plan (`app-features.js`)
- **Customizable Template** — Pain management, delivery preferences
- **Doctor Communication** — Printable PDF format
- **Multiple Languages** — Available in all 7 languages

### 15. Postpartum Guide (`app-features.js`)
- **4-Phase Recovery** — Week 1, Month 1-2, Month 3-6, Beyond
- **Physical Recovery** — What to expect
- **Mental Health** — Postpartum depression awareness
- **Baby Care** — Newborn basics

### 16. Symptoms Guide (`app-features.js`)
- **12 Common Symptoms** — Nausea, back pain, swelling, etc.
- **Causes & Relief** — Evidence-based advice
- **When to Call Doctor** — Red flags
- **Trimester-Specific** — Symptom timeline

### 17. SOS Emergency (`app-india.js`)
- **GPS Hospital Finder** — Nearest maternity hospitals
- **Emergency Numbers** — India-specific (102, 108, 1298)
- **One-Tap Dialing** — Direct call from app
- **Location Sharing** — Share with partner/family

### 18. Premium Subscription (`app-monetize.js`)
- **Razorpay Integration** — Indian payment gateway
- **3 Plans** — Monthly (₹99), Quarterly (₹249), Yearly (₹799)
- **Benefits:** Ad-free, unlimited AI, priority support
- **JWT Secured** — Auth bypass fixed
- **Subscription Status** — Synced with database

### 19. Push Notifications (`app-push.js`)
✨ **Recently Fixed & Enhanced**

**Types:**
- **Medicine Reminders** — At scheduled times
- **Water Reminders** — 10am, 2pm, 6pm daily
- **Weekly Baby Update** — Sundays at 9am
- **Appointment Reminders** — Day before
- **Custom Reminders** — User-defined

**Implementation:**
- Browser Notification API (not FCM)
- Permission prompt on login
- Persistent scheduling (survives refresh)
- Background service worker support

---

## Security

### Vulnerabilities Fixed (June 2026)

MamaCare underwent a comprehensive security audit and all critical vulnerabilities have been patched:

#### 1. XSS Protection ✅
- **Problem:** 273 instances of `innerHTML` usage
- **Solution:** DOMPurify sanitization wrapper
- **Implementation:** `setHTML()` function in `app.js`
- **Status:** Mitigated (manual audit recommended for direct assignments)

#### 2. Razorpay Auth Bypass ✅
- **Problem:** Payment endpoint accessible without authentication
- **Solution:** JWT verification required, user.id enforcement
- **Implementation:** Updated Edge Function, removed `--no-verify-jwt` flag
- **Status:** Fixed and deployed

#### 3. Rate Limit Bypass ✅
- **Problem:** In-memory rate limiting reset on cold start
- **Solution:** Database-backed persistent tracking (ai_usage table)
- **Implementation:** `claude-proxy` Edge Function
- **Status:** Fixed and deployed

#### 4. Wildcard CORS ✅
- **Problem:** `Access-Control-Allow-Origin: *` allowed any domain
- **Solution:** Domain-locked to `https://mamacare-nine.vercel.app/`
- **Implementation:** Both Edge Functions
- **Status:** Fixed and deployed

#### 5. Missing Security Headers ✅
- **Problem:** No CSP, X-Frame-Options, etc.
- **Solution:** Full security header suite in `vercel.json`
- **Implementation:** CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Status:** Fixed and deployed

📖 **Full Details:** `SECURITY_FIXES_COMPLETE.md` | **Deployment Guide:** `SECURITY_DEPLOYMENT_GUIDE.md`

### Security Best Practices

✅ **Implemented:**
- JWT authentication on all Edge Functions
- Row-level security (RLS) on all database tables
- Input sanitization via DOMPurify
- Secure headers (CSP, X-Frame-Options, etc.)
- Rate limiting on AI calls
- Domain-locked CORS
- Audit logging infrastructure

⚠️ **Recommendations:**
- Regular security audits
- Input validation on server side
- CAPTCHA for registration
- 2FA for premium users
- Penetration testing

---

## Deployment

### Prerequisites

1. **Supabase Account** — Free tier: supabase.com
2. **Vercel Account** — Free tier: vercel.com
3. **Razorpay Account** (optional) — For payments: razorpay.com
4. **Anthropic API Key** (optional) — For AI: anthropic.com
5. **Supabase CLI** — `npm install -g supabase`

### Step-by-Step Deployment

#### 1. Supabase Setup

```bash
# Create project at supabase.com
# Note your project URL and anon key

# Run database migrations
# In Supabase Dashboard → SQL Editor:
# 1. Paste and run schema.sql
# 2. Paste and run schema_security_updates.sql
```

#### 2. Environment Configuration

Create `.env.local` with:
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLAUDE_API_KEY=sk-ant-xxx (optional)
VITE_RAZORPAY_KEY_ID=rzp_live_xxx (optional)
```

#### 3. Update CORS Domains

```bash
# Run interactive configuration script
node deploy-security-fixes.js

# Enter your production domain when prompted
# Example: https://mamacare.vercel.app
```

This updates:
- `supabase/functions/claude-proxy/index.ts`
- `supabase/functions/razorpay-subscription/index.ts`

#### 4. Deploy Edge Functions

```bash
# Login to Supabase (first time only)
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy functions (WITHOUT --no-verify-jwt)
supabase functions deploy claude-proxy
supabase functions deploy razorpay-subscription

# Set environment secrets
supabase secrets set CLAUDE_API_KEY=sk-ant-xxx
supabase secrets set RAZORPAY_KEY_SECRET=your-secret
```

#### 5. Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

**Option B: GitHub Integration**
```bash
# Push to GitHub
git remote add origin <repo-url>
git push -u origin main

# On vercel.com:
# New Project → Import Git Repository → Deploy
```

#### 6. Configure Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 7. Verify Deployment

```bash
# Run automated verification
node verify-security.js https://your-domain.vercel.app https://xxx.supabase.co

# Expected: 7/7 tests passing
```

**Manual Tests:**
1. Open app, sign up → OTP should arrive
2. Try pasting OTP → Should work on Android
3. Add medicine → Reminder should schedule
4. Try yoga section → Animations should play
5. Try AI coach → Should respect rate limit
6. Check browser console → No CORS errors

📖 **Troubleshooting:** `SECURITY_DEPLOYMENT_GUIDE.md` (Section 5)

---

## Development Guide

### Local Development

```bash
# 1. Clone and open
git clone <repo-url>
cd mamacare

# 2. Set up .env.local (see Deployment section)

# 3. Open in browser
# Simply open index.html in Chrome/Firefox/Safari
# OR use a local server:
python -m http.server 8000
# Open http://localhost:8000

# 4. For Edge Functions local testing:
supabase start
supabase functions serve
```

### Code Organization

**Modular Architecture:**
- Each `app-*.js` file is a self-contained module
- Modules expose functions to global `window` object
- No build step required (vanilla JS)
- ES6+ features (arrow functions, template literals, destructuring)

**Key Conventions:**
- Use `$()` shorthand for `document.querySelector()`
- Use `setHTML()` wrapper for XSS-safe innerHTML
- Use `db()` wrapper for Supabase queries
- Prefix UI functions with `show*()`, `render*()`, `update*()`
- Prefix data functions with `load*()`, `save*()`, `sync*()`

### Adding a New Feature

```javascript
// 1. Add to appropriate app-*.js file (or create new)
window.myNewFeature = () => {
  console.log('New feature');
};

// 2. Add HTML in index.html
<div class="section" data-section="myfeature">
  <h2>My Feature</h2>
  <!-- content -->
</div>

// 3. Add CSS in style.css
.myfeature-specific-class {
  /* styles */
}

// 4. Add navigation (if needed)
<button onclick="showSection('myfeature')">My Feature</button>

// 5. Add database table (if needed)
-- In schema.sql or new migration
CREATE TABLE my_feature_data (...);
```

### Testing Checklist

Before committing:
- [ ] No JavaScript console errors
- [ ] No TypeScript false positives (use `@ts-nocheck` if needed)
- [ ] Works on mobile (Chrome DevTools responsive mode)
- [ ] Works offline (basic functionality)
- [ ] No CORS errors
- [ ] Supabase RLS working (can't access other users' data)
- [ ] Push notifications fire correctly
- [ ] All forms validate properly

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/contraction-timer

# Make changes, commit frequently
git add app-features.js
git commit -m "Add contraction timer feature"

# Push and create PR
git push origin feature/contraction-timer
```

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| **OTP not arriving** | Check Supabase Auth → Email settings → SMTP configured |
| **OTP paste not working** | Update to latest `app.js` (Android fix included) |
| **Push notifications not firing** | Check permission granted, `app-push.js` up to date |
| **Data not saving** | Check browser console for Supabase errors, verify RLS |
| **Yoga animations stuttering** | Use modern browser, close other tabs, check GPU |
| **401 on AI/payments** | Ensure Edge Functions deployed WITHOUT `--no-verify-jwt` |
| **CORS error** | Verify domain in Edge Function matches deployment URL |
| **Rate limit not working** | Check `ai_usage` table exists, Edge Function updated |
| **Icons not showing** | Check Lucide CDN in `index.html`, internet connection |

### Debugging Tips

**Frontend Issues:**
```javascript
// Enable verbose logging
localStorage.setItem('debugMode', 'true');

// Check Supabase connection
console.log('Supabase URL:', window.supabase.supabaseUrl);

// Check auth state
const { data: { user } } = await window.supabase.auth.getUser();
console.log('Current user:', user);
```

**Backend Issues:**
```bash
# Check Edge Function logs
supabase functions logs claude-proxy
supabase functions logs razorpay-subscription

# Test Edge Function locally
curl -X POST http://localhost:54321/functions/v1/claude-proxy \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

**Database Issues:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS policies
SELECT * FROM pg_policies;

-- Check user data
SELECT * FROM users WHERE id = 'user-uuid';
```

### Support Resources

1. **Documentation Files** — See [Documentation Index](#documentation-index)
2. **Supabase Docs** — https://supabase.com/docs
3. **Vercel Docs** — https://vercel.com/docs
4. **Claude API** — https://docs.anthropic.com
5. **Razorpay Docs** — https://razorpay.com/docs

---

## Future Roadmap

### Version 8.2 (Next — Q3 2026)

**High Priority:**
- [ ] **Contraction Timer** — Essential for labor tracking
  - Start/stop/reset
  - Duration and frequency tracking
  - Alert when contractions are 5-1-1 (5 min apart, 1 min long, for 1 hour)
  - History view

- [ ] **Cloud Photo Storage** — Fix localStorage limitations
  - Migrate from base64 to Cloudinary/Supabase Storage
  - Compression and optimization
  - Unlimited photo uploads (premium)
  - Gallery view

- [ ] **Language Completion** — Complete translations
  - Tamil (currently 60% complete)
  - Bengali (currently 60% complete)
  - Marathi (currently 70% complete)
  - Telugu (currently 60% complete)
  - Professional translation review

- [ ] **Loading & Empty States** — Better UX feedback
  - Skeleton loaders for all async operations
  - Empty state illustrations and encouraging copy
  - Error state handling

### Version 8.3 (Q4 2026)

**Medium Priority:**
- [ ] **Doctor Integration** — PDF health summary
  - Export all tracked data
  - Formatted for doctors
  - Print-ready

- [ ] **Telemedicine Integration** — In-app consultations
  - Practo/mfine/DocPrime API
  - Book appointments
  - Video consultation links

- [ ] **Partner Experience** — Companion features
  - Partner accounts
  - Shared timeline
  - Task reminders for partner
  - Partner education content

- [ ] **Bottom Navigation Simplification** — UX improvement
  - Reduce from 16 to 5-6 primary tabs
  - Move less-used features to "More" menu
  - Customizable tabs

- [ ] **Onboarding Streamline** — Reduce drop-off
  - 3-step wizard (name, due date, language)
  - Skip optional fields
  - Progressive disclosure

### Version 9.0 (Q1 2027)

**Transformative Features:**
- [ ] **AI-Powered Personalization** — Adaptive experience
  - Recommend features based on trimester and usage
  - Personalized tips and reminders
  - Smart notifications

- [ ] **Offline Mode Enhancement** — True offline capability
  - Service worker improvements
  - Sync queue for offline changes
  - Conflict resolution

- [ ] **Wearable Integration** — Fitness tracker sync
  - Fitbit, Apple Watch, Mi Band
  - Sleep, steps, heart rate
  - Automatic data sync

- [ ] **Social Features** — Community support
  - Anonymous forums by trimester
  - Share milestones (optional)
  - Partner/family sharing

- [ ] **Voice Interaction** — Voice commands
  - Log data via voice
  - Ask AI questions
  - Accessibility for low literacy

### Long-Term Vision

- **International Expansion** — More languages, regions
- **Healthcare Provider Dashboard** — For doctors/clinics
- **Insurance Integration** — Claims, coverage info
- **Postpartum Extension** — 2-year baby tracking
- **Fertility Tracking** — Pre-conception features

---

## Documentation Index

### Core Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Quick start guide | Everyone |
| `MASTER_GUIDE.md` | This file — comprehensive reference | Developers |
| `CURRENT_STATUS.md` | Project status, next steps | Developers, PMs |

### Security Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `SECURITY_FIXES_COMPLETE.md` | Technical details of security fixes | Developers |
| `SECURITY_DEPLOYMENT_GUIDE.md` | Step-by-step deployment with security | DevOps |
| `DEPLOYMENT_SUMMARY.md` | Auto-generated deployment log | DevOps |

### Feature Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `YOGA_FEATURES_GUIDE.md` | Complete yoga section user guide | Users, Developers |
| `YOGA_ENHANCEMENTS.md` | Technical yoga implementation details | Developers |
| `QUICK_START.md` | Yoga quick start for users | Users |
| `ANIMATION_REFERENCE.md` | SVG animation technical specs | Developers |
| `CLOUDINARY_SETUP.md` | Photo storage setup (future) | DevOps |

### Development Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `IMPLEMENTATION_SUMMARY.md` | Feature implementation analysis | Developers, PMs |
| `CHANGES_IMPLEMENTED.md` | Change log with impact assessment | Developers |
| `DIAGNOSTICS_EXPLANATION.md` | VS Code false positives explanation | Developers |
| `FIXES_COMPLETE.md` | Bug fix testing checklist | QA, Developers |
| `FINAL_STATUS.md` | Bug fix final status | Developers |
| `VERIFICATION_CHECKLIST.md` | Comprehensive testing checklist | QA |

### Scripts & Tools

| File | Purpose | Usage |
|------|---------|-------|
| `deploy-security-fixes.js` | Interactive deployment helper | `node deploy-security-fixes.js` |
| `verify-security.js` | Automated security verification | `node verify-security.js <domain> <supabase-url>` |
| `verify_all.js` | Bug fix verification | `node verify_all.js` |
| `fix_xss_vulnerabilities.js` | XSS scanner | `node fix_xss_vulnerabilities.js` |
| `apply_fixes.js` | Automated bug fix application | `node apply_fixes.js` |
| `add_ts_nocheck.js` | TypeScript suppression | `node add_ts_nocheck.js` |

### Configuration Files

| File | Purpose |
|------|---------|
| `vercel.json` | Deployment config + security headers |
| `manifest.json` | PWA manifest (name, icons, shortcuts) |
| `sw.js` | Service worker (offline, caching) |
| `jsconfig.json` | VS Code TypeScript config |
| `.env.local` | Environment variables (not in git) |
| `schema.sql` | Database schema |
| `schema_security_updates.sql` | Security migrations |

---

## Contributing

### Code Style

- Use ES6+ features
- Prefer arrow functions
- Use template literals for strings
- Comment complex logic
- Keep functions small (<50 lines)
- Use meaningful variable names

### Pull Request Process

1. Create feature branch
2. Make changes with clear commits
3. Update relevant documentation
4. Test thoroughly (see checklist)
5. Create PR with description
6. Address review feedback
7. Merge when approved

### Reporting Issues

When reporting bugs, include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots (if relevant)

---

## License

[Your License Here]

---

## Credits

**Developed by:** The Gyanam Project  
**AI Integration:** Anthropic Claude  
**Design Inspiration:** Modern pregnancy apps + Indian cultural context  
**Icons:** Lucide Icons  
**Charts:** Chart.js  
**Security:** DOMPurify

---

## Contact

For questions, feature requests, or support:
- **Email:** [Your Email]
- **GitHub:** [Your GitHub]
- **Website:** https://mamacare-nine.vercel.app/

---

**Last Updated:** June 25, 2026  
**Version:** 8.1  
**Status:** Production Ready ✅

---

*MamaCare — Supporting Indian mothers through their pregnancy journey, one feature at a time* 🌸💗
