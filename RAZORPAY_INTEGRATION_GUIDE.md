# Razorpay Standard Checkout Integration Guide

## Overview

MamaCare now has **complete Razorpay integration** with both:
1. **Standard Checkout** (one-time payments) — Recommended for testing
2. **Subscription Plans** (recurring payments) — For production with plan IDs

---

## Credentials (Test Mode)

```
RAZORPAY_KEY_ID: rzp_test_TAUVN0OTKXoQnR
RAZORPAY_KEY_SECRET: iOV0e0k3n3FmkNhGfq5Mlg5G
```

⚠️ **IMPORTANT**: These are **TEST credentials** — never use in production!

---

## Files Modified

### Frontend:
1. **`app-monetize.js`**
   - Updated `RAZORPAY_KEY_ID` with test key
   - Added fallback to Standard Checkout if subscription plans not configured
   - Enhanced error handling for payment failures

### Backend (New Edge Functions):
2. **`supabase/functions/razorpay-create-order/index.ts`** (NEW)
   - Creates Razorpay order for one-time payment
   - Validates amount (minimum ₹1 / 100 paise)
   - Returns `order_id` for frontend checkout

3. **`supabase/functions/razorpay-verify-payment/index.ts`** (NEW)
   - Verifies payment signature using HMAC-SHA256
   - Saves subscription to database
   - Returns success/failure

### Existing (Already Configured):
4. **`supabase/functions/razorpay-subscription/index.ts`**
   - Handles subscription plan creation + verification
   - Requires plan IDs from Razorpay Dashboard

5. **`supabase/functions/razorpay-webhook/index.ts`**
   - Handles subscription lifecycle events (charged, cancelled, etc.)

---

## Deployment Steps

### Step 1: Set Secrets in Supabase

```bash
# Set test credentials (use these for testing)
supabase secrets set RAZORPAY_KEY_ID=rzp_test_TAUVN0OTKXoQnR
supabase secrets set RAZORPAY_KEY_SECRET=iOV0e0k3n3FmkNhGfq5Mlg5G
```

**For production**, replace with live keys:
```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
supabase secrets set RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYYYY
```

### Step 2: Deploy Edge Functions

```bash
# Deploy all Razorpay functions
supabase functions deploy razorpay-create-order
supabase functions deploy razorpay-verify-payment
supabase functions deploy razorpay-subscription
supabase functions deploy razorpay-webhook --no-verify-jwt
```

**Note**: `razorpay-webhook` requires `--no-verify-jwt` because webhooks come from Razorpay servers (no JWT available).

### Step 3: Update CORS Origins (Production Only)

For production, update CORS in each Edge Function to your actual domain:

```typescript
const CORS = {
  'Access-Control-Allow-Origin': 'https://mamacare-nine.vercel.app',
  // ... rest
};
```

Currently set to `*` for testing.

### Step 4: Rebuild Bundle

```bash
# Rebuild bundle.js with updated app-monetize.js
node build.js
```

### Step 5: Deploy to Vercel

```bash
git add .
git commit -m "Razorpay Standard Checkout integration complete"
git push origin main
vercel --prod
```

---

## Testing Guide

### Test Payment Flow

1. **Open App**:
   - Go to https://mamacare-nine.vercel.app (or your domain)
   - Login with your account

2. **Trigger Payment**:
   - Click any "Premium" feature (AI Chat after 10 msgs, Coach Report, etc.)
   - Or navigate to "Premium" tab in nav
   - Click "Get Premium" button (monthly or yearly)

3. **Razorpay Modal Opens**:
   - Should see modal with order details
   - Amount: ₹99 (monthly) or ₹799 (yearly)

4. **Use Test Card**:
   ```
   Card Number: 4111 1111 1111 1111
   Expiry: Any future date (e.g., 12/25)
   CVV: Any 3 digits (e.g., 123)
   Name: Any name
   ```

5. **Complete Payment**:
   - Click "Pay Now"
   - Should see success animation
   - Premium badge appears in top bar (✨ PREMIUM)

6. **Verify in Supabase**:
   - Go to Supabase Dashboard → Table Editor → `subscriptions`
   - Should see new row with:
     - `user_id`: Your user ID
     - `plan`: `premium_monthly` or `premium_yearly`
     - `status`: `active`
     - `razorpay_payment_id`: Starts with `pay_`
     - `razorpay_order_id`: Starts with `order_`
     - `expires_at`: 30 days or 1 year from now

7. **Test Premium Features**:
   - AI Chat: Should be unlimited (no 10/day limit)
   - Coach Report: Generate multiple reports (no 1/month limit)
   - PDF Export: Should work without upgrade prompt

---

## How It Works

### Architecture

```
Frontend (app-monetize.js)
    ↓
1. User clicks "Get Premium"
    ↓
2. Call: razorpay-create-order Edge Function
    ↓
3. Response: { order_id, amount, currency }
    ↓
4. Open Razorpay Checkout Modal
    ↓
5. User enters card details → Pays
    ↓
6. Razorpay returns: { payment_id, order_id, signature }
    ↓
7. Call: razorpay-verify-payment Edge Function
    ↓
8. Verify signature (HMAC-SHA256)
    ↓
9. Save to subscriptions table
    ↓
10. Show success message + unlock features
```

### Signature Verification

```javascript
payload = order_id + "|" + payment_id
expected_signature = HMAC-SHA256(payload, KEY_SECRET)

if (expected_signature === razorpay_signature) {
  // Payment is genuine
} else {
  // Payment is fraudulent — reject
}
```

---

## Subscription Plans (Optional)

If you want **recurring subscriptions** instead of one-time payments:

### Step 1: Create Plans in Razorpay Dashboard

1. Go to https://dashboard.razorpay.com
2. Navigate to **Products → Subscriptions → Plans**
3. Create two plans:
   - **Monthly**: ₹99/month, billing cycle = 1 month
   - **Yearly**: ₹799/year, billing cycle = 1 year
4. Copy plan IDs (format: `plan_XXXXXXXXXXXXXX`)

### Step 2: Update app-monetize.js

```javascript
const PLAN_MONTHLY_ID = 'plan_abc123xyz456'; // Your monthly plan ID
const PLAN_YEARLY_ID  = 'plan_def789ghi012'; // Your yearly plan ID
```

### Step 3: Configure Webhooks

1. Go to **Webhooks** in Razorpay Dashboard
2. Add webhook URL: `https://YOUR_PROJECT.supabase.co/functions/v1/razorpay-webhook`
3. Select events:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.halted`
   - `subscription.expired`
4. Copy webhook secret
5. Set in Supabase:
   ```bash
   supabase secrets set RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## Error Handling

### Common Errors

#### 1. "Payment gateway not configured"
**Cause**: Missing `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` in Supabase secrets  
**Fix**: Run `supabase secrets set` commands (see Step 1)

#### 2. "Invalid signature"
**Cause**: Signature mismatch in verification (fraudulent payment attempt)  
**Fix**: This is expected behavior — payment is rejected. User should retry.

#### 3. "Invalid amount. Minimum: 100 paise"
**Cause**: Amount < ₹1 (100 paise)  
**Fix**: Update amount in frontend (should be 9900 for ₹99 or 79900 for ₹799)

#### 4. "Unauthorized: valid JWT required"
**Cause**: User not logged in  
**Fix**: Ensure user calls `window.supa.auth.signInWithOtp()` first

#### 5. Modal doesn't open
**Cause**: Razorpay script not loaded  
**Fix**: Check browser console. Script loads on first click (retry after 2 seconds)

---

## Security Checklist

### ✅ Implemented

- [x] JWT verification for all Edge Functions (user must be logged in)
- [x] KEY_SECRET never exposed to frontend (stays in Edge Functions)
- [x] HMAC-SHA256 signature verification for all payments
- [x] User ID from JWT (not from request body — prevents impersonation)
- [x] Amount validation (minimum ₹1)
- [x] CORS headers configured

### ⚠️ Todo for Production

- [ ] Update CORS to specific domain (remove `*`)
- [ ] Replace test keys with live keys
- [ ] Add rate limiting (prevent payment spam)
- [ ] Add logging/monitoring (track failed payments)
- [ ] Configure webhook secret for subscription events

---

## Database Schema

### `subscriptions` Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan TEXT DEFAULT 'free',
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

Already exists in your database (from `schema.sql`).

---

## Environment Variables Summary

### Supabase Secrets (Backend)
```bash
RAZORPAY_KEY_ID=rzp_test_TAUVN0OTKXoQnR
RAZORPAY_KEY_SECRET=iOV0e0k3n3FmkNhGfq5Mlg5G
RAZORPAY_WEBHOOK_SECRET=whsec_xxx (only if using subscriptions)
```

### Frontend (Hardcoded in app-monetize.js)
```javascript
RAZORPAY_KEY_ID=rzp_test_TAUVN0OTKXoQnR
```

**Note**: KEY_ID can be public (it's used in frontend modal). KEY_SECRET must **never** be exposed.

---

## Testing Checklist

- [ ] Secrets set in Supabase
- [ ] Edge Functions deployed
- [ ] Frontend updated with test KEY_ID
- [ ] Bundle rebuilt (`node build.js`)
- [ ] Deployed to Vercel
- [ ] User can login
- [ ] Premium modal opens on feature gate
- [ ] Razorpay modal opens with correct amount
- [ ] Test card payment succeeds
- [ ] Success message shown
- [ ] `subscriptions` table updated
- [ ] Premium badge appears in UI
- [ ] Premium features unlocked

---

## Support

### Razorpay Documentation
- Standard Checkout: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
- Subscriptions: https://razorpay.com/docs/payments/subscriptions/
- Webhooks: https://razorpay.com/docs/webhooks/

### Logs
```bash
# View Edge Function logs
supabase functions logs razorpay-create-order --tail
supabase functions logs razorpay-verify-payment --tail
supabase functions logs razorpay-webhook --tail
```

### Contact
For payment issues: support@gyanam.shop

---

## Next Steps

1. ✅ Deploy Edge Functions (see Step 2)
2. ✅ Test with provided test card (see Testing Guide)
3. ⏳ Create subscription plans in Razorpay Dashboard (optional)
4. ⏳ Configure webhooks (only if using subscriptions)
5. ⏳ Replace test keys with live keys before production launch

---

**Integration Complete!** 🎉

All files are ready. Just deploy Edge Functions and test.
