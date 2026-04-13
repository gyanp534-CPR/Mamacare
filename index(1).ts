/**
 * MamaCare — Supabase Edge Function: razorpay-subscription
 * Handles Razorpay subscription create + payment verify
 *
 * Deploy:
 *   supabase functions deploy razorpay-subscription --no-verify-jwt
 *
 * Secrets:
 *   supabase secrets set RAZORPAY_KEY_ID=rzp_live_XXX
 *   supabase secrets set RAZORPAY_KEY_SECRET=XXX
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const KEY_ID     = Deno.env.get('RAZORPAY_KEY_ID')!;
    const KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const SUPA_URL   = Deno.env.get('SUPABASE_URL')!;
    const SUPA_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const body   = await req.json();
    const { action } = body;
    const supabase   = createClient(SUPA_URL, SUPA_KEY);

    // ── CREATE SUBSCRIPTION ──────────────────
    if (action === 'create') {
      const { plan_id, user_id } = body;
      const res = await fetch('https://api.razorpay.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${KEY_ID}:${KEY_SECRET}`),
        },
        body: JSON.stringify({
          plan_id,
          total_count: 12,     // 12 billing cycles
          quantity: 1,
          notes: { user_id },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.description || 'Subscription create failed');
      return new Response(JSON.stringify({ subscription_id: data.id }), {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    // ── VERIFY PAYMENT ───────────────────────
    if (action === 'verify') {
      const { payment_id, subscription_id, signature, user_id, plan } = body;
      // HMAC-SHA256 verification
      const payload = `${payment_id}|${subscription_id}`;
      const expected = createHmac('sha256', KEY_SECRET).update(payload).digest('hex');
      if (expected !== signature) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
        });
      }
      // Save subscription to Supabase
      const expiresAt = plan === 'yearly'
        ? new Date(Date.now() + 365 * 86400000).toISOString()
        : new Date(Date.now() + 32 * 86400000).toISOString();

      await supabase.from('subscriptions').upsert({
        user_id,
        plan: `premium_${plan}`,
        razorpay_subscription_id: subscription_id,
        razorpay_payment_id: payment_id,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt,
      }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }
});
