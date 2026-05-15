/**
 * MamaCare — app-monetize.js v6.1
 * Premium Subscription + Razorpay Integration
 *
 * Plans:
 *  Free    — Basic tracking, AI Chat (10 msgs/day), 1 Coach report/month
 *  Premium — ₹99/month or ₹799/year — Unlimited AI, Reports, Partner, Export
 *
 * Setup:
 *  1. Razorpay Dashboard → Products → Subscriptions → Create Plans
 *     - monthly: plan_XXXX (₹99/month)
 *     - yearly:  plan_XXXX (₹799/year)
 *  2. Update RAZORPAY_KEY_ID and PLAN_IDS below
 *  3. Deploy razorpay-webhook Edge Function for payment verification
 */

'use strict';

// ── CONFIG (update these in your Razorpay dashboard) ──
const RAZORPAY_KEY_ID   = 'rzp_live_XXXXXXXXXXXXXX'; // Replace with your key
const PLAN_MONTHLY_ID   = 'plan_XXXXXXXXXXXXXX';      // ₹99/month plan ID
const PLAN_YEARLY_ID    = 'plan_XXXXXXXXXXXXXX';      // ₹799/year plan ID

// Feature limits for free tier
const FREE_LIMITS = {
  aiChatPerDay:    10,
  coachPerMonth:   1,
  pdfReports:      2,   // total lifetime
  partnerAccess:   false,
  dataExport:      false,
};

// ════════════════════════════════════════
// SUBSCRIPTION STATE
// ════════════════════════════════════════
let premiumStatus = null; // null = not loaded, false = free, object = premium

async function loadPremiumStatus() {
  if (!window.user || !window.supa) { premiumStatus = false; return false; }
  const { data } = await window.supa
    .from('subscriptions')
    .select('*')
    .eq('user_id', window.user.id)
    .maybeSingle();

  if (!data || data.plan === 'free') { premiumStatus = false; return false; }

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    premiumStatus = false;
    return false;
  }
  premiumStatus = data;
  return true;
}

function isPremium() { return !!premiumStatus; }

// ════════════════════════════════════════
// FEATURE GATES
// ════════════════════════════════════════

/**
 * Gate a feature — runs callback if premium, shows upgrade prompt if free
 * @param {string} featureName - display name
 * @param {Function} callback - function to run if premium
 * @param {string} [reason] - why premium is needed
 */
function gateFeature(featureName, callback, reason = '') {
  if (isPremium()) { callback(); return; }
  showUpgradePrompt(featureName, reason);
}

// AI Coach — free users get 1/month
async function checkCoachGate() {
  if (isPremium()) return true;
  const key = `mc_coach_${new Date().getMonth()}_${new Date().getFullYear()}`;
  const count = parseInt(localStorage.getItem(key) || '0');
  if (count >= FREE_LIMITS.coachPerMonth) {
    showUpgradePrompt('AI Coach', 'Free plan mein sirf 1 report/month milti hai. Unlimited ke liye Premium lo!');
    return false;
  }
  localStorage.setItem(key, count + 1);
  return true;
}

// AI Chat daily limit
async function checkChatGate() {
  if (isPremium()) return true;
  const key = `mc_chat_${new Date().toISOString().split('T')[0]}`;
  const count = parseInt(localStorage.getItem(key) || '0');
  if (count >= FREE_LIMITS.aiChatPerDay) {
    showUpgradePrompt('AI Chat', `Free plan mein ${FREE_LIMITS.aiChatPerDay} messages/day hain. Unlimited ke liye Premium lo!`);
    return false;
  }
  localStorage.setItem(key, count + 1);
  return true;
}

// Increment chat counter (call after successful chat)
function incrementChatCount() {
  const key = `mc_chat_${new Date().toISOString().split('T')[0]}`;
  const count = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, count + 1);
}

// ════════════════════════════════════════
// UPGRADE PROMPT
// ════════════════════════════════════════
function showUpgradePrompt(featureName, reason = '') {
  const existing = document.getElementById('premiumPromptOverlay');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', `
    <div id="premiumPromptOverlay" style="position:fixed;inset:0;z-index:3000;background:rgba(74,44,42,.5);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;padding:16px;animation:fadeIn .2s ease">
      <div style="background:rgba(253,246,240,.98);border-radius:24px 24px 20px 20px;width:100%;max-width:460px;padding:28px;box-shadow:0 -8px 40px rgba(200,100,100,.2);border:1.5px solid rgba(232,160,168,.3);animation:slideUp .3s ease">
        <div style="text-align:center;margin-bottom:18px">
          <div style="font-size:40px;margin-bottom:8px">✨</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:var(--warm);margin-bottom:6px">Premium Feature</div>
          <div style="font-weight:600;font-size:14px;color:var(--accent)">${featureName}</div>
          ${reason ? `<p style="font-size:13px;color:var(--muted);margin-top:6px;line-height:1.6">${reason}</p>` : ''}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          <div style="background:white;border-radius:16px;padding:16px;border:2px solid rgba(232,160,168,.2);text-align:center">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px">Monthly</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--accent)">₹99</div>
            <div style="font-size:11px;color:var(--muted)">/month</div>
            <button class="btn btn-p btn-sm" style="width:100%;margin-top:10px" onclick="PREMIUM.subscribe('monthly')">Get Premium</button>
          </div>
          <div style="background:linear-gradient(135deg,rgba(232,160,168,.12),rgba(247,196,168,.1));border-radius:16px;padding:16px;border:2px solid var(--rose);text-align:center;position:relative">
            <div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--rose);color:white;font-size:10px;font-weight:700;padding:3px 10px;border-radius:50px;white-space:nowrap">BEST VALUE</div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px">Yearly</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--accent)">₹799</div>
            <div style="font-size:11px;color:var(--muted)">/year <span style="color:var(--green);font-weight:600">(₹67/mo)</span></div>
            <button class="btn btn-p btn-sm" style="width:100%;margin-top:10px" onclick="PREMIUM.subscribe('yearly')">Get Premium</button>
          </div>
        </div>
        <div style="font-size:12.5px;color:var(--muted);line-height:2;margin-bottom:14px;text-align:center">
          ✅ Unlimited AI Chat &nbsp;✅ Unlimited Coach Reports<br>
          ✅ PDF Downloads &nbsp;✅ Partner Access<br>
          ✅ Data Export &nbsp;✅ Priority Support
        </div>
        <button class="btn btn-g" style="width:100%" onclick="document.getElementById('premiumPromptOverlay').remove()">Baad mein (Free mein rehna)</button>
      </div>
    </div>
    <style>@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}</style>
  `);
}

// ════════════════════════════════════════
// RAZORPAY CHECKOUT
// ════════════════════════════════════════
async function subscribe(plan) {
  if (!window.user) { alert('Pehle login karein'); return; }

  // Check Razorpay script loaded
  if (!window.Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => subscribe(plan);
    document.head.appendChild(script);
    return;
  }

  const planId  = plan === 'yearly' ? PLAN_YEARLY_ID : PLAN_MONTHLY_ID;
  const amount  = plan === 'yearly' ? 79900 : 9900; // paise
  const planLabel = plan === 'yearly' ? '₹799/year' : '₹99/month';

  // Create Razorpay subscription via Edge Function
  let subscriptionId = null;
  try {
    const { data, error } = await window.supa.functions.invoke('razorpay-subscription', {
      body: { action: 'create', plan_id: planId, user_id: window.user.id }
    });
    if (error) throw error;
    subscriptionId = data?.subscription_id;
  } catch (err) {
    console.error('Subscription create error:', err);
    // Fallback: one-time payment order
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amount,
    currency: 'INR',
    name: 'MamaCare Premium',
    description: `Premium ${planLabel}`,
    image: '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/1024.png',
    ...(subscriptionId ? { subscription_id: subscriptionId } : {}),
    handler: async (response) => {
      await verifyPayment(response, plan, subscriptionId);
    },
    prefill: {
      email: window.user.email,
    },
    notes: {
      user_id: window.user.id,
      plan: plan,
    },
    theme: { color: '#e8a0a8' },
    modal: {
      ondismiss: () => {},
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
  document.getElementById('premiumPromptOverlay')?.remove();
}

async function verifyPayment(response, plan, subscriptionId) {
  try {
    // Verify via Edge Function
    const { data, error } = await window.supa.functions.invoke('razorpay-subscription', {
      body: {
        action: 'verify',
        payment_id: response.razorpay_payment_id,
        subscription_id: subscriptionId || response.razorpay_subscription_id,
        signature: response.razorpay_signature,
        user_id: window.user.id,
        plan,
      }
    });
    if (error) throw error;

    // Update local state
    premiumStatus = { plan: `premium_${plan}`, status: 'active' };

    // Show success
    showPremiumSuccess(plan);
    loadPremiumBadge();
  } catch (err) {
    console.error('Payment verify error:', err);
    alert('Payment verify nahi ho saka. Support se contact karein: support@gyanam.shop');
  }
}

function showPremiumSuccess(plan) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;inset:0;z-index:4000;display:flex;align-items:center;justify-content:center;background:rgba(74,44,42,.5);backdrop-filter:blur(4px)';
  t.innerHTML = `
    <div style="background:white;border-radius:28px;padding:40px 32px;max-width:340px;text-align:center;animation:fadeUp .4s ease">
      <div style="font-size:60px;margin-bottom:12px">🎉</div>
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:var(--warm);margin-bottom:8px">Welcome to Premium!</h2>
      <p style="font-size:13.5px;color:var(--muted);line-height:1.7;margin-bottom:20px">Aapka MamaCare Premium ${plan === 'yearly' ? '1 saal ke liye' : 'mahine ke liye'} activate ho gaya! Saari features unlock hain 🌸</p>
      <button class="btn btn-p" style="width:100%" onclick="this.closest('div[style]').remove()">App Use Karein →</button>
    </div>`;
  document.body.appendChild(t);
}

// ════════════════════════════════════════
// PREMIUM BADGE IN TOP BAR
// ════════════════════════════════════════
function loadPremiumBadge() {
  const topUser = document.querySelector('.top-user');
  if (!topUser) return;
  const existing = document.getElementById('premiumBadge');
  if (existing) existing.remove();
  if (isPremium()) {
    const badge = document.createElement('span');
    badge.id = 'premiumBadge';
    badge.style.cssText = 'font-size:10px;padding:3px 9px;border-radius:50px;background:linear-gradient(135deg,#d4a853,#e8a0a8);color:white;font-weight:700;letter-spacing:.04em;cursor:pointer';
    badge.textContent = '✨ PREMIUM';
    badge.onclick = () => { if (window.MC?.goTo) window.MC.goTo('premium'); };
    topUser.insertBefore(badge, topUser.firstChild);
  }
}

// ════════════════════════════════════════
// PREMIUM PAGE (injected)
// ════════════════════════════════════════
function injectPremiumPage() {
  if (document.getElementById('page-premium')) return;
  const footer = document.querySelector('footer');
  const html = `
<div class="page" id="page-premium">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Subscription</div>
    <div class="sec-title">MamaCare Premium ✨</div>
  </div>

  <!-- Current Status -->
  <div class="card" id="premiumStatusCard" style="text-align:center;padding:28px">
    <div style="font-size:48px;margin-bottom:12px" id="premiumStatusIcon">⭐</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:8px" id="premiumStatusTitle">Free Plan</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.7" id="premiumStatusDesc">Basic features available. Premium ke saath sab unlock karo!</p>
  </div>

  <!-- Plans -->
  <div class="card" id="premiumPlansSection">
    <div class="sec-label">Choose Plan</div>
    <div class="sec-title">Plans & Pricing</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:white;border-radius:18px;padding:18px;border:2px solid rgba(232,160,168,.2);text-align:center">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:6px">Monthly</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;color:var(--accent)">₹99</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px">/month</div>
        <button class="btn btn-p" style="width:100%" onclick="PREMIUM.subscribe('monthly')">Subscribe</button>
      </div>
      <div style="background:linear-gradient(135deg,rgba(232,160,168,.1),rgba(247,196,168,.08));border-radius:18px;padding:18px;border:2px solid var(--rose);text-align:center;position:relative">
        <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--rose);color:white;font-size:10px;font-weight:700;padding:4px 12px;border-radius:50px;white-space:nowrap">BEST VALUE</div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:6px">Yearly</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;color:var(--accent)">₹799</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:2px">/year</div>
        <div style="font-size:11px;color:var(--green);font-weight:600;margin-bottom:14px">₹67/month — 33% savings</div>
        <button class="btn btn-p" style="width:100%" onclick="PREMIUM.subscribe('yearly')">Subscribe</button>
      </div>
    </div>
    <div style="font-size:12px;color:var(--muted);text-align:center;line-height:1.6">🔒 Secure payment via Razorpay | Cancel anytime</div>
  </div>

  <!-- Feature Comparison -->
  <div class="card">
    <div class="sec-label">Compare</div>
    <div class="sec-title">Free vs Premium</div>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:rgba(232,160,168,.08)">
          <th style="padding:10px 12px;text-align:left;font-weight:600">Feature</th>
          <th style="padding:10px 12px;text-align:center">Free</th>
          <th style="padding:10px 12px;text-align:center;color:var(--accent)">Premium</th>
        </tr>
      </thead>
      <tbody>
        ${[
          ['All Trackers (Weight, Sleep, etc)', '✅', '✅'],
          ['AI Chat', '10 msgs/day', '♾️ Unlimited'],
          ['AI Coach Report', '1/month', '♾️ Unlimited'],
          ['PDF Health Reports', '2 total', '♾️ Unlimited'],
          ['Partner Access', '❌', '✅'],
          ['Data Export (CSV)', '❌', '✅'],
          ['Kick + BP + Sugar Tracker', '✅', '✅'],
          ['Contraction Timer', '✅', '✅'],
          ['Priority Support', '❌', '✅ Email'],
          ['Ad-free', '✅', '✅'],
        ].map(([f,fr,pr]) => `
          <tr style="border-bottom:1px solid rgba(232,160,168,.1)">
            <td style="padding:10px 12px">${f}</td>
            <td style="padding:10px 12px;text-align:center;color:var(--muted)">${fr}</td>
            <td style="padding:10px 12px;text-align:center;color:var(--green);font-weight:500">${pr}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- FAQ -->
  <div class="card">
    <div class="sec-title">❓ Aksar Pooche Jaate Hain</div>
    ${[
      ['Cancel kaise karein?', 'Razorpay portal (razorpay.com) → My Subscriptions → Cancel. Billing period ke end tak access rahega.'],
      ['Refund milega?', '7 din ke andar request pe full refund. support@gyanam.shop pe email karein.'],
      ['Data safe hai?', 'Bilkul. Supabase encrypted database. Kisi third party ko share nahi hota.'],
      ['Family ke saath share?', 'Abhi individual subscription hai. Family plan coming soon!'],
    ].map(([q,a]) => `
      <div style="padding:12px 0;border-bottom:1px solid rgba(232,160,168,.1)">
        <div style="font-weight:600;font-size:13px;margin-bottom:4px">${q}</div>
        <div style="font-size:12.5px;color:var(--muted);line-height:1.6">${a}</div>
      </div>`).join('')}
  </div>
</div>`;
  if (footer) footer.insertAdjacentHTML('beforebegin', html);
  else document.body.insertAdjacentHTML('beforeend', html);

  // Add Premium tab to nav
  const topTabs = document.getElementById('topTabs');
  if (topTabs && !document.querySelector('[data-page="premium"]')) {
    const btn = document.createElement('button');
    btn.className = 'top-tab'; btn.dataset.page = 'premium'; btn.textContent = '✨ Premium';
    btn.addEventListener('click', () => { if (window.MC?.goTo) window.MC.goTo('premium'); });
    topTabs.appendChild(btn);
  }
}

function updatePremiumPage() {
  const icon  = document.getElementById('premiumStatusIcon');
  const title = document.getElementById('premiumStatusTitle');
  const desc  = document.getElementById('premiumStatusDesc');
  const plans = document.getElementById('premiumPlansSection');
  if (!icon) return;
  if (isPremium()) {
    icon.textContent  = '👑';
    title.textContent = 'Premium Active! 👑';
    if (desc) desc.textContent = 'Saari features unlock hain. Thank you for supporting MamaCare! 💗';
    if (plans) plans.style.display = 'none';
  } else {
    icon.textContent  = '⭐';
    title.textContent = 'Free Plan';
    if (desc) desc.textContent = 'AI Chat (10/day), 1 Coach report/month. Premium se sab unlock karo!';
    if (plans) plans.style.display = 'block';
  }
}

// Data Export (Premium feature)
async function exportData() {
  if (!isPremium()) {
    showUpgradePrompt('Data Export', 'Apna poora health data CSV mein download karo — Premium feature hai.');
    return;
  }
  if (!window.user) return;
  const uid = window.user.id;
  const [wt, sl, fd, md, mo, ap] = await Promise.all([
    window.supa.from('weight_logs').select('*').eq('user_id', uid),
    window.supa.from('sleep_logs').select('*').eq('user_id', uid),
    window.supa.from('food_logs').select('*').eq('user_id', uid),
    window.supa.from('mood_logs').select('*').eq('user_id', uid),
    window.supa.from('medicines').select('*').eq('user_id', uid),
    window.supa.from('appointments').select('*').eq('user_id', uid),
  ]);
  const blob = new Blob([JSON.stringify({
    exported_at: new Date().toISOString(),
    weight_logs: wt.data, sleep_logs: sl.data, food_logs: fd.data,
    mood_logs: md.data, medicines: mo.data, appointments: ap.data,
  }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mamacare-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  injectPremiumPage();
});

window.PREMIUM = {
  load: loadPremiumStatus,
  isPremium,
  gateFeature,
  checkCoachGate,
  checkChatGate,
  incrementChatCount,
  subscribe,
  showUpgradePrompt,
  exportData,
  loadBadge: loadPremiumBadge,
  updatePage: updatePremiumPage,
};
