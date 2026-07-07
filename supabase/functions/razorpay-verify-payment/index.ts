/**
 * MamaCare — Supabase Edge Function: razorpay-verify-payment
 * Verifies Razorpay payment signature for Standard Checkout
 *
 * Deploy:
 *   supabase functions deploy razorpay-verify-payment
 *
 * Secrets:
 *   supabase secrets set RAZORPAY_KEY_SECRET=iOV0e0k3n3FmkNhGfq5Mlg5G
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*', // Update with your domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    // ── 1. Verify JWT ──────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: valid JWT required.' }),
        { status: 401, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const SUPA_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPA_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SUPA_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify the JWT and get authenticated user
    const supabaseAuth = createClient(SUPA_URL, SUPA_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: invalid or expired token.' }),
        { status: 401, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // ── 2. Parse Request ───────────────────────────────────────────
    const body = await req.json();
    const { payment_id, order_id, signature, plan } = body;

    if (!payment_id || !order_id || !signature) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: payment_id, order_id, signature' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // ── 3. Verify Signature ────────────────────────────────────────
    const KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;

    if (!KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // Generate expected signature: HMAC-SHA256(order_id|payment_id, KEY_SECRET)
    const payload = `${order_id}|${payment_id}`;
    const expectedSignature = createHmac('sha256', KEY_SECRET)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Signature mismatch', {
        expected: expectedSignature,
        received: signature,
      });
      return new Response(
        JSON.stringify({ error: 'Invalid signature. Payment verification failed.' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Payment verified: ${payment_id} for user ${user.id}`);

    // ── 4. Save Subscription to Database ───────────────────────────
    const supabase = createClient(SUPA_URL, SUPA_SERVICE_KEY);

    // Calculate expiry based on plan
    const expiresAt = plan === 'yearly'
      ? new Date(Date.now() + 365 * 86400000).toISOString() // 1 year
      : new Date(Date.now() + 32 * 86400000).toISOString();  // ~1 month

    const { error: dbError } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: user.id,
          plan: `premium_${plan}`,
          razorpay_payment_id: payment_id,
          razorpay_order_id: order_id,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt,
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save subscription', details: dbError.message }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // ── 5. Return Success ──────────────────────────────────────────
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified and subscription activated',
        plan: `premium_${plan}`,
        expires_at: expiresAt,
      }),
      {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      }
    );

  } catch (err) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      }
    );
  }
});
