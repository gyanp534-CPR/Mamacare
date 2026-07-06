# 🔥 Critical Security Fixes - Implementation Plan

## Issues Identified

1. **XSS via Direct innerHTML** - User data not escaped
2. **CSP with unsafe-inline/unsafe-eval** - Policy is ineffective
3. **Contraction timer localStorage only** - Data loss on device switch
4. **No Razorpay subscription webhooks** - Forever-premium bug
5. **Cloudinary unsigned preset public** - Unlimited uploads
6. **Missing email_digest migration** - Silent failures
7. **bundle.js not used in index.html** - 16 HTTP requests instead of 1

---

## Fix Implementation

### Issue #01: XSS Protection

**Files to Fix:**
- `app.js` lines 1865, 2044
- Add global `escapeHTML()` function
- Route all user content through it

**Implementation:**
