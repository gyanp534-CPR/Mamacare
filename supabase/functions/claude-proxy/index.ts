/**
 * MamaCare — Supabase Edge Function: claude-proxy
 * Proxies Anthropic Claude API calls securely.
 * JWT authentication required — no anonymous access.
 *
 * Deploy:
 *   supabase functions deploy claude-proxy
 *   (Remove --no-verify-jwt to enforce auth)
 *
 * Set secret:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Per-user rate limiting via in-memory map (resets on cold start)
// For production, use a Supabase table counter instead
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const DAILY_LIMIT = 15; // free tier: 15 calls/day per user

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    // ── 1. Verify JWT ──────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: valid JWT required.' }),
        { status: 401, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: invalid or expired token.' }),
        { status: 401, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // ── 2. Rate limiting ───────────────────────────────────────────
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const uid = user.id;
    const entry = rateLimitMap.get(uid);

    if (entry && now < entry.resetAt) {
      if (entry.count >= DAILY_LIMIT) {
        return new Response(
          JSON.stringify({ error: 'Daily AI limit reached. Upgrade to Premium for unlimited access.' }),
          { status: 429, headers: { ...CORS, 'Content-Type': 'application/json' } }
        );
      }
      entry.count++;
    } else {
      rateLimitMap.set(uid, { count: 1, resetAt: now + dayMs });
    }

    // ── 3. Validate API key ────────────────────────────────────────
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // ── 4. Parse & validate request body ──────────────────────────
    const body = await req.json();
    const { model = 'claude-sonnet-4-20250514', max_tokens = 1000, system, messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required.' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      );
    }

    // Cap max_tokens to prevent abuse
    const safeMaxTokens = Math.min(max_tokens, 2000);

    // ── 5. Call Anthropic ──────────────────────────────────────────
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: safeMaxTokens,
        ...(system ? { system } : {}),
        messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      console.error('Anthropic API error:', data);
      return new Response(JSON.stringify({ error: 'AI service error. Please try again.' }), {
        status: anthropicRes.status,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('claude-proxy error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});
