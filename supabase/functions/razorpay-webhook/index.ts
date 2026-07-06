/**
 * MamaCare — Supabase Edge Function: razorpay-webhook
 * Handles Razorpay subscription lifecycle webhooks
 *
 * SETUP:
 * 1. Deploy: supabase functions deploy razorpay-webhook --no-verify-jwt
 * 2. Get function URL: https://YOUR_PROJECT.supabase.co/functions/v1/razorpay-webhook
 * 3. Go to Razorpay Dashboard → Webhooks → Add Webhook URL
 * 4. Select events:
 *    - subscription.activated
 *    - subscription.charged
 *    - subscription.cancelled
 *    - subscription.halted
 *    - subscription.expired
 *    - subscription.pending
 * 5. Set secret in Razorpay and save webhook secret
 * 6. supabase secrets set RAZORPAY_WEBHOOK_SECRET=whsec_XXX
 *
 * CRITICAL: This endpoint must use --no-verify-jwt because Razorpay
 * cannot send a Supabase JWT. Instead, we verify HMAC signature.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*', // Webhooks come from Razorpay servers
  'Access-Control-Allow-Headers': 'content-type, x-razorpay-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    // ── 1. Verify Razorpay Webhook Signature ──────────────────────
    const WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
    if (!WEBHOOK_SECRET) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 401,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    const rawBody = await req.text();
    const expectedSignature = createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    // ── 2. Parse Webhook Payload ──────────────────────────────────
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const subscription = payload.payload.subscription.entity;
    const payment = payload.payload.payment?.entity;

    console.log(`Webhook received: ${event} for subscription ${subscription.id}`);

    // Extract user_id from subscription notes
    const user_id = subscription.notes?.user_id;
    if (!user_id) {
      console.error('No user_id in subscription notes');
      return new Response(JSON.stringify({ error: 'Missing user_id in notes' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    // ── 3. Initialize Supabase Client ─────────────────────────────
    const SUPA_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPA_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPA_URL, SUPA_SERVICE_KEY);

    // ── 4. Handle Different Subscription Events ───────────────────
    let status: string;
    let expiresAt: string | null = null;

    switch (event) {
      case 'subscription.activated':
        status = 'active';
        // Calculate expiry based on plan interval
        const intervalMonths = subscription.total_count || 1;
        expiresAt = new Date(
          Date.now() + intervalMonths * 30 * 86400000
        ).toISOString();
        console.log(`Subscription activated for user ${user_id}, expires: ${expiresAt}`);
        break;

      case 'subscription.charged':
        status = 'active';
        // Extend expiry by one billing cycle
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('expires_at')
          .eq('user_id', user_id)
          .single();

        if (existingSub?.expires_at) {
          const currentExpiry = new Date(existingSub.expires_at);
          const newExpiry = new Date(currentExpiry.getTime() + 30 * 86400000);
          expiresAt = newExpiry.toISOString();
        } else {
          expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
        }
        console.log(`Subscription charged for user ${user_id}, new expiry: ${expiresAt}`);
        break;

      case 'subscription.cancelled':
        status = 'cancelled';
        // Keep existing expiry date - user retains access until end of paid period
        console.log(`Subscription cancelled for user ${user_id}`);
        break;

      case 'subscription.halted':
        status = 'halted';
        expiresAt = new Date().toISOString(); // Expire immediately
        console.log(`Subscription halted for user ${user_id} (payment failure)`);
        break;

      case 'subscription.expired':
        status = 'expired';
        expiresAt = new Date().toISOString();
        console.log(`Subscription expired for user ${user_id}`);
        break;

      case 'subscription.pending':
        status = 'pending';
        console.log(`Subscription pending for user ${user_id}`);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...CORS, 'Content-Type': 'application/json' }
        });
    }

    // ── 5. Update Subscription in Database ────────────────────────
    const updateData: any = {
      user_id,
      razorpay_subscription_id: subscription.id,
      status,
    };

    if (payment?.id) {
      updateData.razorpay_payment_id = payment.id;
    }

    if (expiresAt) {
      updateData.expires_at = expiresAt;
    }

    if (event === 'subscription.activated') {
      updateData.started_at = new Date().toISOString();
      // Extract plan from subscription plan_id (e.g., "plan_abc123" -> check Razorpay Dashboard)
      // For now, default to premium_monthly - adjust based on your actual plan IDs
      updateData.plan = subscription.plan_id.includes('year') ? 'premium_yearly' : 'premium_monthly';
    }

    const { error } = await supabase
      .from('subscriptions')
      .upsert(updateData, { onConflict: 'user_id' });

    if (error) {
      console.error('Database update error:', error);
      return new Response(JSON.stringify({ error: 'Database error', details: error.message }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Successfully updated subscription for user ${user_id}`);

    return new Response(JSON.stringify({ received: true, event, user_id, status }), {
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Internal error', 
        message: err instanceof Error ? err.message : 'Unknown' 
      }),
      {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      }
    );
  }
});
