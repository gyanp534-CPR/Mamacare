/**
 * MamaCare — Supabase Edge Function: razorpay-create-order
 * Creates Razorpay order for Standard Checkout (one-time payment)
 *
 * Deploy:
 *   supabase functions deploy razorpay-create-order
 *
 * Secrets:
 *   supabase secrets set RAZORPAY_KEY_ID=rzp_test_TAUVN0OTKXoQnR
 *   supabase secrets set RAZORPAY_KEY_SECRET=iOV0e0k3n3FmkNhGfq5Mlg5G
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || amount < 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Minimum: 100 paise (₹1)' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // ── 3. Create Razorpay Order ───────────────────────────────────
    const KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!;
    const KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;

    if (!KEY_ID || !KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const orderPayload = {
      amount,
      currency,
      receipt: receipt || `order_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        ...notes,
      },
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${KEY_ID}:${KEY_SECRET}`),
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Razorpay API error:', errorData);
      throw new Error(errorData.error?.description || 'Order creation failed');
    }

    const orderData = await response.json();

    console.log(`Order created: ${orderData.id} for user ${user.id}`);

    // ── 4. Return Order Details ────────────────────────────────────
    return new Response(
      JSON.stringify({
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
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
