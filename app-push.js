/**
 * MamaCare — app-push.js
 * Web Push Notifications (VAPID), Partner Companion, Doctor PDF,
 * Contraction Persistence, Offline Enhancements, Onboarding Streamline
 */
'use strict';

// ══════════════════════════════════════════════════════════════
// 1. WEB PUSH — VAPID SUBSCRIPTION
// ══════════════════════════════════════════════════════════════
// VAPID public key — replace with your own from web-push library
// Generate: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBkYIRuLPSmVmaHIHPA';

async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { error: 'Push not supported in this browser' };
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    // Check existing subscription
    let sub = await reg.pushManager.getSubscription();
    if (sub) return { subscription: sub };

    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return { error: 'Permission denied' };

    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Save subscription to Supabase for server-side push
    if (window.supa && window.user) {
      await window.supa.from('push_subscriptions').upsert({
        user_id: window.user.id,
        subscription: JSON.stringify(sub),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }
    return { subscription: sub };
  } catch (err) {
    console.warn('[Push] Subscribe error:', err);
    return { error: err.message };
  }
}

async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await sub.unsubscribe();
    if (window.supa && window.user) {
      await window.supa.from('push_subscriptions').delete().eq('user_id', window.user.id);
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

// ── Push Settings UI ──────────────────────────────────────────
function injectPushSettingsUI() {
  const existing = document.getElementById('pushSettingsCard');
  if (existing) return;

  const card = document.createElement('div');
  card.id = 'pushSettingsCard';
  card.className = 'card';
  card.innerHTML = `
    <div class="sec-label">Notifications</div>
    <div class="sec-title">🔔 Push Notifications</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:14px">
      App band hone ke baad bhi reminders milenge — medicine, paani, kick count, appointments.
    </p>
    <div id="pushStatusBadge" style="font-size:12.5px;padding:8px 12px;border-radius:10px;background:rgba(232,160,168,.1);margin-bottom:14px;display:flex;align-items:center;gap:8px;">
      <span id="pushStatusDot" style="width:8px;height:8px;border-radius:50%;background:#ccc;flex-shrink:0;"></span>
      <span id="pushStatusText">Status check kar rahe hain...</span>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-p btn-sm" id="pushEnableBtn" onclick="PUSH.enable()">🔔 Enable Push</button>
      <button class="btn btn-g btn-sm" id="pushDisableBtn" onclick="PUSH.disable()" style="display:none">🔕 Disable</button>
    </div>
    <div style="margin-top:16px;border-top:1px solid rgba(0,0,0,.06);padding-top:14px;">
      <div style="font-size:12.5px;font-weight:600;margin-bottom:10px;color:var(--text-main);">Reminder Schedule</div>
      <div style="display:flex;flex-direction:column;gap:8px;" id="pushReminderList">
        ${renderPushReminderRows()}
      </div>
    </div>`;

  // Inject into reminders page
  const remPage = document.getElementById('page-reminders');
  if (remPage) {
    remPage.insertBefore(card, remPage.firstChild);
  }
  refreshPushStatus();
}

function renderPushReminderRows() {
  const reminders = [
    { key: 'push_water',   icon: '💧', label: 'Water reminders (10am, 2pm, 6pm)', default: true },
    { key: 'push_kick',    icon: '👶', label: 'Kick count (morning & evening)',    default: true },
    { key: 'push_med',     icon: '💊', label: 'Medicine alerts',                   default: true },
    { key: 'push_appt',    icon: '📅', label: 'Appointment reminders',             default: true },
    { key: 'push_weekly',  icon: '🌸', label: 'Weekly baby development update',    default: true },
    { key: 'push_mood',    icon: '😊', label: 'Daily mood check-in',               default: false },
  ];
  return reminders.map(r => {
    const checked = localStorage.getItem(r.key) !== 'false' ? (r.default ? 'checked' : '') : '';
    return `<label style="display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;">
      <input type="checkbox" ${checked} onchange="PUSH.toggleReminder('${r.key}', this.checked)"
        style="width:16px;height:16px;accent-color:var(--rose);">
      <span>${r.icon} ${r.label}</span>
    </label>`;
  }).join('');
}

async function refreshPushStatus() {
  const dot  = document.getElementById('pushStatusDot');
  const text = document.getElementById('pushStatusText');
  const enBtn = document.getElementById('pushEnableBtn');
  const disBtn = document.getElementById('pushDisableBtn');
  if (!dot || !text) return;

  if (!('PushManager' in window)) {
    dot.style.background = '#ccc';
    text.textContent = 'Push notifications is browser mein supported nahi.';
    if (enBtn) enBtn.style.display = 'none';
    return;
  }
  if (Notification.permission === 'denied') {
    dot.style.background = '#e05c5c';
    text.textContent = 'Notifications blocked hain — browser settings mein allow karein.';
    if (enBtn) enBtn.style.display = 'none';
    return;
  }
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    dot.style.background = '#6ab89a';
    text.textContent = 'Push notifications active hain ✓';
    if (enBtn) enBtn.style.display = 'none';
    if (disBtn) disBtn.style.display = 'inline-flex';
  } else {
    dot.style.background = '#e8a020';
    text.textContent = 'Push notifications off hain — enable karein.';
    if (enBtn) enBtn.style.display = 'inline-flex';
    if (disBtn) disBtn.style.display = 'none';
  }
}

function togglePushReminder(key, enabled) {
  localStorage.setItem(key, enabled ? 'true' : 'false');
  // Re-schedule if push is active
  if (Notification.permission === 'granted') {
    schedulePushReminders();
  }
}

// Schedule all enabled local reminders (fallback when SW push not available)
function schedulePushReminders() {
  if (Notification.permission !== 'granted') return;
  if (localStorage.getItem('push_water') !== 'false') {
    if (window.scheduleDailyWaterReminders) window.scheduleDailyWaterReminders();
  }
  if (localStorage.getItem('push_mood') === 'true') {
    const moodTime = localStorage.getItem('mc_mood_reminder_time') || '09:00';
    if (window.scheduleNotification && window.getDelayUntil) {
      window.scheduleNotification({
        id: 'daily-mood',
        title: '😊 Mood Check-in — MamaCare',
        body: 'Aaj kaisi feel kar rahi hain? Ek minute mein log karein.',
        tag: 'daily-mood',
        delayMs: window.getDelayUntil(moodTime),
      });
    }
  }
  // Weekly development update — every Sunday 9am
  scheduleWeeklyUpdate();
}

function scheduleWeeklyUpdate() {
  if (localStorage.getItem('push_weekly') === 'false') return;
  if (Notification.permission !== 'granted') return;
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 9, 0, 0);
  const delay = nextSunday - now;
  if (delay > 0 && window.scheduleNotification) {
    window.scheduleNotification({
      id: 'weekly-update',
      title: '🌸 Weekly Baby Update — MamaCare',
      body: 'Is hafte aapka baby kya kar raha hai? App mein dekho!',
      tag: 'weekly-update',
      delayMs: delay,
    });
  }
}

window.PUSH = {
  enable: async () => {
    const result = await subscribeToPush();
    if (result.error) {
      alert('Push enable nahi hua: ' + result.error);
    } else {
      schedulePushReminders();
      refreshPushStatus();
    }
  },
  disable: async () => {
    await unsubscribeFromPush();
    refreshPushStatus();
  },
  toggleReminder: togglePushReminder,
  refresh: refreshPushStatus,
  scheduleAll: schedulePushReminders,
};

// ══════════════════════════════════════════════════════════════
// LOCAL NOTIFICATION SCHEDULING HELPERS
// (Used when server-side push is not available)
// ══════════════════════════════════════════════════════════════

// Returns ms until the next occurrence of HH:MM (today or tomorrow)
window.getDelayUntil = function(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
};

// Schedule a one-shot local notification via SW (falls back to setTimeout)
window.scheduleNotification = function({ id, title, body, tag, delayMs }) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  // Clear any existing timer for this id
  if (window._notifTimers && window._notifTimers[id]) {
    clearTimeout(window._notifTimers[id]);
  }
  if (!window._notifTimers) window._notifTimers = {};
  window._notifTimers[id] = setTimeout(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(title, {
          body,
          tag: tag || id,
          icon: '/mcAppIcons/android/mipmap-xxxhdpi/icon.png',
          badge: '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/180.png',
          vibrate: [200, 100, 200],
        });
      } else {
        new Notification(title, { body, tag: tag || id });
      }
    } catch (e) { /* ignore */ }
  }, delayMs);
};

// Schedule water reminders at 10am, 2pm, 6pm daily
window.scheduleDailyWaterReminders = function() {
  if (localStorage.getItem('push_water') === 'false') return;
  const times = [
    { id: 'water-10', time: '10:00', body: '💧 Paani peena mat bhoolo! Aaj ka goal: 10 glasses.' },
    { id: 'water-14', time: '14:00', body: '💧 Dopahar ka paani reminder — hydrated rehna zaroori hai!' },
    { id: 'water-18', time: '18:00', body: '💧 Shaam ka paani reminder — baby ke liye hydration important hai.' },
  ];
  times.forEach(({ id, time, body }) => {
    window.scheduleNotification({
      id,
      title: '💧 Water Reminder — MamaCare',
      body,
      tag: id,
      delayMs: window.getDelayUntil(time),
    });
  });
};

// Schedule medicine reminders for all saved medicines
window.scheduleMedicineReminders = function(medicines) {
  if (!medicines || !medicines.length) return;
  if (localStorage.getItem('push_med') === 'false') return;
  medicines.forEach((med, idx) => {
    if (!med.reminder_time) return;
    window.scheduleNotification({
      id: 'med-' + (med.id || idx),
      title: `💊 ${med.name} — MamaCare`,
      body: `${med.dose || ''} lene ka waqt ho gaya. ${med.notes ? '(' + med.notes + ')' : ''}`.trim(),
      tag: 'medicine-' + (med.id || idx),
      delayMs: window.getDelayUntil(med.reminder_time),
    });
  });
};

// ══════════════════════════════════════════════════════════════
// 2. PARTNER COMPANION EXPERIENCE
// ══════════════════════════════════════════════════════════════
function injectPartnerCompanionPage() {
  if (document.getElementById('page-partner-companion')) return;

  const page = document.createElement('main');
  page.className = 'page';
  page.id = 'page-partner-companion';
  page.innerHTML = `
    <div style="padding:4px 0 12px">
      <div class="sec-label">For Partners</div>
      <div class="sec-title">Partner Companion 👨‍👩‍👧</div>
    </div>

    <!-- Baby this week -->
    <div class="card" id="partnerBabyCard" style="background:linear-gradient(135deg,rgba(106,184,154,.1),rgba(232,160,168,.08));">
      <div class="sec-label">Baby This Week</div>
      <div id="partnerBabyInfo" style="font-size:13.5px;line-height:1.8;color:var(--text-main);">
        <div style="text-align:center;padding:16px;color:var(--muted);">Loading...</div>
      </div>
    </div>

    <!-- How she's feeling today -->
    <div class="card">
      <div class="sec-label">Today</div>
      <div class="sec-title">💗 Aaj Kaisi Hain</div>
      <div id="partnerMoodToday" style="font-size:13.5px;color:var(--muted);padding:8px 0;">
        Mood data load ho raha hai...
      </div>
    </div>

    <!-- Contraction timer for partner -->
    <div class="card" style="border:2px solid rgba(224,107,116,.25);">
      <div class="sec-label" style="color:var(--danger);">Labor</div>
      <div class="sec-title">⏱️ Contraction Timer</div>
      <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.6">
        Labor ke waqt contractions track karo — 5-1-1 rule ke liye.
      </p>
      <button class="btn btn-p" style="width:100%;font-size:15px;padding:14px;"
        onclick="if(window.goTo) window.goTo('contractions')">
        ⏱️ Open Contraction Timer
      </button>
    </div>

    <!-- Share a moment -->
    <div class="card">
      <div class="sec-label">Bond</div>
      <div class="sec-title">📸 Share a Moment</div>
      <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.6">
        Baby ke liye ek message ya photo journal mein add karo.
      </p>
      <textarea id="partnerMomentText" rows="3" placeholder="Baby ke liye kuch likho... 💌"
        style="width:100%;resize:vertical;"></textarea>
      <button class="btn btn-p btn-sm" style="margin-top:10px;width:100%;"
        onclick="PARTNER.savePartnerMoment()">💌 Journal Mein Save Karo</button>
      <div id="partnerMomentStatus" style="font-size:12px;color:var(--muted);margin-top:8px;"></div>
    </div>

    <!-- What to do this week -->
    <div class="card">
      <div class="sec-label">Your Role</div>
      <div class="sec-title">✅ Is Hafte Kya Karein</div>
      <div id="partnerWeeklyTips" style="font-size:13.5px;line-height:1.9;color:var(--text-main);">
        Loading...
      </div>
    </div>

    <!-- Emergency contacts quick dial -->
    <div class="card" style="background:rgba(224,107,116,.05);border-color:rgba(224,107,116,.2);">
      <div class="sec-label" style="color:var(--danger);">Emergency</div>
      <div class="sec-title">🚨 Quick Dial</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px;">
        <a href="tel:102" class="btn btn-p" style="text-align:center;text-decoration:none;">
          🚑 Ambulance — 102
        </a>
        <a href="tel:108" class="btn" style="background:#e05c5c;color:white;text-align:center;text-decoration:none;border-radius:14px;padding:12px;">
          🏥 Emergency — 108
        </a>
        <button class="btn btn-g" onclick="if(window.goTo) window.goTo('sos')">
          📍 Nearest Hospital Dhundo
        </button>
      </div>
    </div>`;

  const appShell = document.querySelector('.app-shell');
  const nav = document.getElementById('bottomNav');
  if (appShell && nav) appShell.insertBefore(page, nav);

  // Add to more menu
  const moreGrid = document.querySelector('#moreMenu .more-grid');
  if (moreGrid && !moreGrid.querySelector('[data-page="partner-companion"]')) {
    const item = document.createElement('div');
    item.className = 'more-item';
    item.dataset.page = 'partner-companion';
    item.innerHTML = `<div class="mi-icon">👨‍👩‍👧</div><div class="mi-label">Partner</div>`;
    item.addEventListener('click', () => {
      document.getElementById('moreMenu').style.display = 'none';
      if (window.goTo) window.goTo('partner-companion');
    });
    moreGrid.appendChild(item);
  }

  // Add to top tabs
  const topTabs = document.getElementById('topTabs');
  if (topTabs && !topTabs.querySelector('[data-page="partner-companion"]')) {
    const btn = document.createElement('button');
    btn.className = 'top-tab';
    btn.dataset.page = 'partner-companion';
    btn.innerHTML = '👨‍👩‍👧 Partner';
    btn.addEventListener('click', () => { if (window.MC?.goTo) window.MC.goTo('partner-companion'); });
    topTabs.appendChild(btn);
  }
}

async function loadPartnerCompanionData() {
  // Get current week
  const dueEl = document.getElementById('directDue');
  const due = dueEl?.value;
  let week = 20;
  if (due) {
    const lmp = new Date(new Date(due).getTime() - 280 * 86400000);
    week = Math.min(40, Math.max(1, Math.floor((Date.now() - lmp) / (7 * 86400000)) + 1));
  }

  // Baby info this week
  const babyEl = document.getElementById('partnerBabyInfo');
  if (babyEl) {
    const babyFacts = getPartnerBabyFact(week);
    babyEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="font-size:40px;">${babyFacts.emoji}</div>
        <div>
          <div style="font-weight:600;font-size:15px;">Week ${week}</div>
          <div style="font-size:12.5px;color:var(--muted);">${babyFacts.size}</div>
        </div>
      </div>
      <div style="font-size:13.5px;line-height:1.8;">${babyFacts.fact}</div>`;
  }

  // Weekly partner tips
  const tipsEl = document.getElementById('partnerWeeklyTips');
  if (tipsEl) {
    const tips = getPartnerWeeklyTips(week);
    tipsEl.innerHTML = tips.map(t => `
      <div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.05);">
        <span style="font-size:18px;flex-shrink:0;">${t.icon}</span>
        <div>
          <div style="font-weight:600;font-size:13px;">${t.title}</div>
          <div style="font-size:12.5px;color:var(--muted);line-height:1.6;">${t.desc}</div>
        </div>
      </div>`).join('');
  }

  // Today's mood from Supabase
  if (window.supa && window.user) {
    const today = new Date().toISOString().split('T')[0];
    const { data: moodData } = await window.supa
      .from('mood_logs')
      .select('mood, logged_at')
      .eq('user_id', window.user.id)
      .gte('logged_at', today)
      .order('logged_at', { ascending: false })
      .limit(1);

    const moodEl = document.getElementById('partnerMoodToday');
    if (moodEl) {
      if (moodData && moodData.length) {
        const moodMap = {
          happy: '😊 Khush', excited: '✨ Excited', calm: '😌 Calm',
          anxious: '😟 Anxious', sad: '😢 Udaas', tired: '😴 Thaki hui',
          nauseous: '🤢 Nausea', overwhelmed: '😰 Overwhelmed',
        };
        moodEl.innerHTML = `<div style="font-size:28px;margin-bottom:6px;">${moodData[0].mood}</div>
          <div style="font-size:13.5px;font-weight:600;">${moodMap[moodData[0].mood] || moodData[0].mood}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px;">Aaj log kiya</div>`;
      } else {
        moodEl.innerHTML = `<div style="color:var(--muted);font-size:13px;">Aaj ka mood abhi log nahi hua.</div>`;
      }
    }
  }
}

function getPartnerBabyFact(week) {
  const facts = {
    8:  { emoji: '🫐', size: 'Raspberry size (~1.6cm)', fact: 'Baby ke fingers form ho rahe hain. Heartbeat already 150+ bpm hai!' },
    12: { emoji: '🍋', size: 'Lime size (~5.4cm)', fact: 'First trimester almost done! Baby ab move kar sakta hai, though mama feel nahi karti abhi.' },
    16: { emoji: '🥑', size: 'Avocado size (~11.6cm)', fact: 'Baby ab expressions bana sakta hai — frown, squint. Bones harden ho rahi hain.' },
    20: { emoji: '🍌', size: 'Banana size (~16.4cm)', fact: 'Halfway there! Baby ab sounds sun sakta hai — apni awaaz se baat karo!' },
    24: { emoji: '🌽', size: 'Corn size (~30cm)', fact: 'Baby ke lungs develop ho rahe hain. Kicks feel hone lagte hain — haath rakh ke feel karo!' },
    28: { emoji: '🍆', size: 'Eggplant size (~37cm)', fact: 'Third trimester! Baby ab REM sleep mein dreams dekh sakta hai. Eyes open-close kar sakta hai.' },
    32: { emoji: '🍍', size: 'Pineapple size (~42cm)', fact: 'Baby ka brain rapidly develop ho raha hai. Position head-down hone lagti hai.' },
    36: { emoji: '🥥', size: 'Coconut size (~47cm)', fact: 'Almost ready! Baby ab fat store kar raha hai. Lungs mature ho rahe hain.' },
    40: { emoji: '🍉', size: 'Watermelon size (~51cm)', fact: 'Full term! Baby kisi bhi waqt aa sakta hai. Sab ready rakho!' },
  };
  const keys = Object.keys(facts).map(Number).sort((a, b) => a - b);
  const key = keys.reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev);
  return facts[key];
}

function getPartnerWeeklyTips(week) {
  if (week <= 12) return [
    { icon: '🤢', title: 'Morning Sickness Support', desc: 'Ginger tea, crackers bedside rakhein. Smells trigger kar sakte hain — strong perfume avoid karein.' },
    { icon: '😴', title: 'Rest Priority', desc: 'Fatigue extreme hoti hai first trimester mein. Ghar ke kaam mein help karein bina pooche.' },
    { icon: '🏥', title: 'First Appointment', desc: 'Pehle ultrasound mein saath jaayein — heartbeat sunna unforgettable moment hai.' },
    { icon: '📚', title: 'Learn Together', desc: 'Pregnancy books padhein — informed partner best support hota hai.' },
  ];
  if (week <= 27) return [
    { icon: '👋', title: 'Feel the Kicks', desc: 'Haath rakh ke kicks feel karein — baby aapki awaaz pehchanta hai. Baat karein!' },
    { icon: '🛒', title: 'Baby Shopping', desc: 'Nursery setup, essentials list — milke plan karein. Mama ko decide karne dein.' },
    { icon: '📸', title: 'Bump Photos', desc: 'Weekly photos lein — baad mein timelapse banao. Yeh memories priceless hain.' },
    { icon: '🧘', title: 'Prenatal Classes', desc: 'Birthing classes saath attend karein — labor mein aapka role important hai.' },
  ];
  return [
    { icon: '🏥', title: 'Hospital Bag Ready?', desc: 'Dono ke liye bag pack karein. Route plan karein — traffic mein time estimate karein.' },
    { icon: '⏱️', title: 'Contraction Timer', desc: 'Is app ka contraction timer use karo — 5-1-1 rule yaad rakho.' },
    { icon: '🤱', title: 'Labor Support', desc: 'Back massage, ice chips, breathing cues — aapki presence sabse important hai.' },
    { icon: '📞', title: 'On-Call Mode', desc: 'Phone always charged, work ko inform karein, car mein petrol full rakho.' },
  ];
}

async function savePartnerMoment() {
  const text = document.getElementById('partnerMomentText')?.value?.trim();
  const statusEl = document.getElementById('partnerMomentStatus');
  if (!text) { if (statusEl) statusEl.textContent = 'Kuch likho pehle!'; return; }

  if (window.saveOrQueue) {
    const result = await window.saveOrQueue('journal_entries', {
      entry_text: `💌 Partner message: ${text}`,
      mood: 'love',
      week_number: null,
      entry_date: new Date().toISOString().split('T')[0],
    });
    if (statusEl) {
      statusEl.textContent = result.queued ? '✅ Offline saved — sync hoga baad mein' : '✅ Journal mein save ho gaya!';
      statusEl.style.color = 'var(--green)';
    }
    document.getElementById('partnerMomentText').value = '';
  }
}

window.PARTNER = {
  loadData: loadPartnerCompanionData,
  savePartnerMoment,
};

// ══════════════════════════════════════════════════════════════
// 3. CONTRACTION TIMER — PERSISTENCE
// ══════════════════════════════════════════════════════════════
function saveContractionsToDB() {
  if (!window.contractionState) return;
  try {
    localStorage.setItem('mc_contractions', JSON.stringify(window.contractionState.contractions));
  } catch (e) { /* storage full */ }

  // Also sync to Supabase if online
  if (window.supa && window.user && navigator.onLine && window.contractionState.contractions.length) {
    const today = new Date().toISOString().split('T')[0];
    window.supa.from('contraction_sessions').upsert({
      user_id: window.user.id,
      session_date: today,
      contractions: JSON.stringify(window.contractionState.contractions),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,session_date' }).then(() => {});
  }
}

function loadContractionsFromDB() {
  // Load from localStorage first (instant)
  try {
    const saved = localStorage.getItem('mc_contractions');
    if (saved && window.contractionState) {
      const parsed = JSON.parse(saved);
      // Only restore today's contractions
      const today = new Date().toDateString();
      const todayContractions = parsed.filter(c => new Date(c.startTime).toDateString() === today);
      window.contractionState.contractions = todayContractions;
      if (window.renderContractionHistory) window.renderContractionHistory();
    }
  } catch (e) { /* ignore */ }
}

// Patch toggleContraction to auto-save
function patchContractionPersistence() {
  const origToggle = window.toggleContraction;
  if (!origToggle || window._contractionPatched) return;
  window._contractionPatched = true;
  window.toggleContraction = function() {
    origToggle();
    saveContractionsToDB();
  };
  const origClear = window.clearContractions;
  if (origClear) {
    window.clearContractions = function() {
      origClear();
      localStorage.removeItem('mc_contractions');
    };
  }
}

// ══════════════════════════════════════════════════════════════
// 4. DOCTOR PDF HEALTH SUMMARY
// ══════════════════════════════════════════════════════════════
async function generateDoctorPDF() {
  const btn = document.getElementById('doctorPDFBtn');
  if (btn) { btn.textContent = '⏳ Generating...'; btn.disabled = true; }

  try {
    // Gather data
    const profile = await getDoctorSummaryData();
    const html = buildDoctorSummaryHTML(profile);

    // Open in new window for print-to-PDF
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) {
      alert('Popup blocked! Browser settings mein popup allow karein.');
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  } catch (err) {
    console.error('[DoctorPDF]', err);
    alert('PDF generate nahi hua. Dobara try karein.');
  } finally {
    if (btn) { btn.textContent = '📄 Health Summary PDF'; btn.disabled = false; }
  }
}

async function getDoctorSummaryData() {
  const data = { profile: {}, weights: [], sleep: [], bp: [], sugar: [], meds: [], appts: [] };
  if (!window.supa || !window.user) return data;

  const uid = window.user.id;
  const [prof, wts, slp, bps, sug, meds, appts] = await Promise.all([
    window.supa.from('user_profile').select('*').eq('id', uid).maybeSingle(),
    window.supa.from('weight_logs').select('*').eq('user_id', uid).order('logged_at', { ascending: false }).limit(10),
    window.supa.from('sleep_logs').select('*').eq('user_id', uid).order('logged_at', { ascending: false }).limit(7),
    window.supa.from('bp_logs').select('*').eq('user_id', uid).order('logged_at', { ascending: false }).limit(10),
    window.supa.from('sugar_logs').select('*').eq('user_id', uid).order('logged_at', { ascending: false }).limit(10),
    window.supa.from('medicines').select('*').eq('user_id', uid),
    window.supa.from('appointments').select('*').eq('user_id', uid).order('date', { ascending: true }).limit(5),
  ]);

  data.profile = prof?.data || {};
  data.weights = wts?.data || [];
  data.sleep   = slp?.data || [];
  data.bp      = bps?.data || [];
  data.sugar   = sug?.data || [];
  data.meds    = meds?.data || [];
  data.appts   = appts?.data || [];
  return data;
}

function buildDoctorSummaryHTML(d) {
  const p = d.profile;
  const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const latestWt = d.weights[0];
  const avgSleep = d.sleep.length
    ? (d.sleep.reduce((a, s) => a + parseFloat(s.duration_hrs || 0), 0) / d.sleep.length).toFixed(1)
    : '—';

  const bpRows = d.bp.slice(0, 8).map(b =>
    `<tr><td>${new Date(b.logged_at).toLocaleDateString('en-IN')}</td><td>${b.systolic}/${b.diastolic}</td><td>W${b.week_number || '—'}</td><td>${b.notes || ''}</td></tr>`
  ).join('');

  const sugarRows = d.sugar.slice(0, 8).map(s =>
    `<tr><td>${new Date(s.logged_at).toLocaleDateString('en-IN')}</td><td>${s.fasting_mg || '—'}</td><td>${s.pp_mg || '—'}</td><td>${s.notes || ''}</td></tr>`
  ).join('');

  const wtRows = d.weights.slice(0, 8).map(w =>
    `<tr><td>${new Date(w.logged_at).toLocaleDateString('en-IN')}</td><td>W${w.week_number || '—'}</td><td>${w.weight_kg} kg</td></tr>`
  ).join('');

  const medRows = d.meds.map(m =>
    `<tr><td>${m.name}</td><td>${m.dose || '—'}</td><td>${m.frequency || '—'}</td><td>${m.reminder_time || '—'}</td></tr>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Pregnancy Health Summary — Mama Gyan</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 13px; color: #333; margin: 0; padding: 20px; }
  h1 { color: #c97b7b; font-size: 22px; margin-bottom: 4px; }
  h2 { color: #7a4a4a; font-size: 15px; margin: 20px 0 8px; border-bottom: 2px solid #f5d5d8; padding-bottom: 4px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .badge { background: #fce8e8; border-radius: 8px; padding: 6px 12px; font-size: 12px; color: #c97b7b; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .info-box { background: #fdf6f0; border-radius: 10px; padding: 12px; }
  .info-box label { font-size: 11px; color: #999; display: block; margin-bottom: 2px; }
  .info-box strong { font-size: 14px; color: #333; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { background: #fce8e8; color: #7a4a4a; padding: 8px; text-align: left; font-size: 12px; }
  td { padding: 7px 8px; border-bottom: 1px solid #f5e8e8; font-size: 12.5px; }
  tr:nth-child(even) td { background: #fdf9f9; }
  .disclaimer { font-size: 11px; color: #999; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px; }
  @media print { body { padding: 10px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>🌸 Pregnancy Health Summary</h1>
    <div style="font-size:12px;color:#999;">Generated by Mama Gyan App • ${now}</div>
  </div>
  <div class="badge">Confidential Medical Record</div>
</div>

<h2>Patient Information</h2>
<div class="grid2">
  <div class="info-box"><label>Name</label><strong>${p.name || '—'}</strong></div>
  <div class="info-box"><label>Blood Group</label><strong>${p.blood_group || '—'}</strong></div>
  <div class="info-box"><label>Due Date</label><strong>${p.due_date || '—'}</strong></div>
  <div class="info-box"><label>Pre-pregnancy Weight</label><strong>${p.pre_weight_kg ? p.pre_weight_kg + ' kg' : '—'}</strong></div>
  <div class="info-box"><label>Latest Weight</label><strong>${latestWt ? latestWt.weight_kg + ' kg (W' + (latestWt.week_number || '?') + ')' : '—'}</strong></div>
  <div class="info-box"><label>Avg Sleep (last 7 days)</label><strong>${avgSleep} hrs</strong></div>
</div>

<h2>Weight Tracking</h2>
<table><thead><tr><th>Date</th><th>Week</th><th>Weight</th></tr></thead>
<tbody>${wtRows || '<tr><td colspan="3" style="color:#999;text-align:center;">No data</td></tr>'}</tbody></table>

<h2>Blood Pressure Log</h2>
<table><thead><tr><th>Date</th><th>BP (mmHg)</th><th>Week</th><th>Notes</th></tr></thead>
<tbody>${bpRows || '<tr><td colspan="4" style="color:#999;text-align:center;">No data</td></tr>'}</tbody></table>

<h2>Blood Sugar Log</h2>
<table><thead><tr><th>Date</th><th>Fasting (mg/dL)</th><th>Post-meal (mg/dL)</th><th>Notes</th></tr></thead>
<tbody>${sugarRows || '<tr><td colspan="4" style="color:#999;text-align:center;">No data</td></tr>'}</tbody></table>

<h2>Current Medications</h2>
<table><thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Reminder Time</th></tr></thead>
<tbody>${medRows || '<tr><td colspan="4" style="color:#999;text-align:center;">No medicines logged</td></tr>'}</tbody></table>

<div class="disclaimer">
  ⚠️ This summary is generated from patient self-reported data via Mama Gyan app. 
  All clinical decisions should be based on direct examination and professional judgment.
  Data accuracy depends on patient input. | Mama Gyan v7.7 | mamagyan.app
</div>
</body></html>`;
}

// Inject PDF button into doctor portal
function injectDoctorPDFButton() {
  const doctorPage = document.getElementById('page-doctor');
  if (!doctorPage || doctorPage.querySelector('#doctorPDFBtn')) return;

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="sec-label">Export</div>
    <div class="sec-title">📄 Health Summary for Doctor</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:14px;">
      Apna complete pregnancy health data ek PDF mein export karo — doctor ko share karo.
      Weight, BP, sugar, medicines, appointments — sab included.
    </p>
    <button id="doctorPDFBtn" class="btn btn-p" style="width:100%;" onclick="generateDoctorPDF()">
      📄 Health Summary PDF Generate Karo
    </button>
    <p style="font-size:11.5px;color:var(--muted);margin-top:10px;line-height:1.6;">
      💡 Print dialog khulega — "Save as PDF" select karo ya directly print karo.
    </p>`;
  doctorPage.insertBefore(card, doctorPage.firstChild.nextSibling);
}

window.generateDoctorPDF = generateDoctorPDF;

// ══════════════════════════════════════════════════════════════
// 5. OFFLINE MODE ENHANCEMENTS
// ══════════════════════════════════════════════════════════════
function initOfflineIndicator() {
  // Inject offline banner
  if (!document.getElementById('offlineBanner')) {
    const banner = document.createElement('div');
    banner.id = 'offlineBanner';
    banner.style.cssText = `
      display:none;position:fixed;top:0;left:0;right:0;z-index:9999;
      background:linear-gradient(135deg,#e08c3a,#e0a03a);color:white;
      padding:10px 16px;text-align:center;font-size:13px;font-weight:500;
      box-shadow:0 2px 12px rgba(0,0,0,.2);`;
    banner.innerHTML = `
      📵 Offline Mode — Data locally save ho raha hai, sync hoga jab internet aayega
      <button onclick="document.getElementById('offlineBanner').style.display='none'"
        style="background:none;border:none;color:white;font-size:18px;cursor:pointer;margin-left:12px;vertical-align:middle;">✕</button>`;
    document.body.insertBefore(banner, document.body.firstChild);
  }

  function updateOnlineStatus() {
    const banner = document.getElementById('offlineBanner');
    if (!banner) return;
    if (!navigator.onLine) {
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
      // Show sync toast
      showSyncToast();
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

function showSyncToast() {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
    background:linear-gradient(135deg,#6ab89a,#5aa88a);color:white;
    padding:10px 20px;border-radius:20px;font-size:13px;font-weight:500;
    z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap;`;
  toast.textContent = '✅ Back online — syncing data...';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Offline-capable quick log — saves to IndexedDB immediately
async function offlineQuickLog(type, data) {
  const entry = { type, data, timestamp: Date.now(), synced: false };

  // Try Supabase first
  if (navigator.onLine && window.saveOrQueue) {
    return window.saveOrQueue(type, data);
  }

  // Queue offline
  if (window.OfflineQueue) {
    await window.OfflineQueue.enqueue({ table: type, data });
    return { queued: true };
  }
  return { error: 'Offline queue not available' };
}

window.offlineQuickLog = offlineQuickLog;

// ══════════════════════════════════════════════════════════════
// 6. STREAMLINED ONBOARDING (3 inputs)
// ══════════════════════════════════════════════════════════════
function injectStreamlinedOnboarding() {
  // Only inject if the original onboarding hasn't been shown
  if (localStorage.getItem('mc_onboard_done')) return;
  if (document.getElementById('quickOnboardOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'quickOnboardOverlay';
  overlay.style.cssText = `
    display:none;position:fixed;inset:0;z-index:2500;
    background:linear-gradient(135deg,#fdf6f0,#fce8e8 50%,#fdf0e8);
    overflow-y:auto;padding:20px;`;
  overlay.innerHTML = `
    <div style="max-width:400px;margin:40px auto;padding:20px 0;">
      <div style="text-align:center;margin-bottom:32px;">
        <div style="font-size:64px;margin-bottom:12px;">🌸</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;color:#c97b7b;margin:0 0 8px;">
          Welcome to Mama Gyan
        </h2>
        <p style="font-size:14px;color:#999;line-height:1.7;">3 quick details — aur aap ready hain!</p>
      </div>

      <div style="background:white;border-radius:24px;padding:24px;box-shadow:0 8px 32px rgba(232,160,168,.2);">
        <div style="margin-bottom:18px;">
          <label style="font-size:13px;font-weight:600;color:#7a4a4a;display:block;margin-bottom:8px;">
            😊 Aapka naam (optional)
          </label>
          <input type="text" id="qob-name" placeholder="Priya, Ananya..."
            style="width:100%;box-sizing:border-box;"/>
        </div>

        <div style="margin-bottom:18px;">
          <label style="font-size:13px;font-weight:600;color:#7a4a4a;display:block;margin-bottom:8px;">
            📅 Due date ya LMP
          </label>
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <button id="qob-tab-due" class="btn btn-p btn-sm" style="flex:1;"
              onclick="QONBOARD.switchTab('due')">Due Date</button>
            <button id="qob-tab-lmp" class="btn btn-g btn-sm" style="flex:1;"
              onclick="QONBOARD.switchTab('lmp')">LMP Date</button>
          </div>
          <input type="date" id="qob-due" placeholder="Due date"/>
          <input type="date" id="qob-lmp" style="display:none;" placeholder="Last period"
            onchange="QONBOARD.calcDue()"/>
          <div id="qob-week-preview" style="display:none;margin-top:8px;padding:10px 14px;
            background:rgba(232,160,168,.1);border-radius:12px;font-size:13px;color:#c97b7b;
            font-weight:600;text-align:center;"></div>
        </div>

        <div style="margin-bottom:24px;">
          <label style="font-size:13px;font-weight:600;color:#7a4a4a;display:block;margin-bottom:8px;">
            🌍 Language
          </label>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${['hinglish','hi','en','ta','bn','mr','te'].map((l, i) => {
              const labels = ['Hinglish','हिंदी','English','தமிழ்','বাংলা','मराठी','తెలుగు'];
              return `<button class="ob-lang-btn${i===0?' active':''}" data-lang="${l}"
                onclick="QONBOARD.setLang('${l}', this)">${labels[i]}</button>`;
            }).join('')}
          </div>
        </div>

        <button class="btn btn-p" style="width:100%;font-size:15px;padding:16px;"
          onclick="QONBOARD.complete()">
          🌸 Shuru Karein →
        </button>
      </div>

      <p style="text-align:center;font-size:12px;color:#bbb;margin-top:16px;">
        Aap baad mein settings mein sab change kar sakte hain
      </p>
    </div>`;

  document.body.appendChild(overlay);
}

let qobLang = 'hinglish';

window.QONBOARD = {
  show() {
    const el = document.getElementById('quickOnboardOverlay');
    if (el) el.style.display = 'block';
  },
  switchTab(tab) {
    const dueInput = document.getElementById('qob-due');
    const lmpInput = document.getElementById('qob-lmp');
    const dueBtn   = document.getElementById('qob-tab-due');
    const lmpBtn   = document.getElementById('qob-tab-lmp');
    if (tab === 'due') {
      dueInput.style.display = 'block'; lmpInput.style.display = 'none';
      dueBtn.className = 'btn btn-p btn-sm'; lmpBtn.className = 'btn btn-g btn-sm';
    } else {
      dueInput.style.display = 'none'; lmpInput.style.display = 'block';
      dueBtn.className = 'btn btn-g btn-sm'; lmpBtn.className = 'btn btn-p btn-sm';
    }
  },
  calcDue() {
    const lmp = document.getElementById('qob-lmp')?.value;
    if (!lmp) return;
    const due = new Date(new Date(lmp).getTime() + 280 * 86400000);
    const dueStr = due.toISOString().split('T')[0];
    document.getElementById('qob-due').value = dueStr;
    const days = Math.floor((Date.now() - new Date(lmp)) / 86400000);
    const week = Math.min(40, Math.max(1, Math.floor(days / 7) + 1));
    const prev = document.getElementById('qob-week-preview');
    if (prev) { prev.style.display = 'block'; prev.textContent = `Week ${week} — ${280 - days} days to go 🌸`; }
  },
  setLang(l, btn) {
    qobLang = l;
    document.querySelectorAll('#quickOnboardOverlay .ob-lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (window.applyLang) window.applyLang(l);
  },
  async complete() {
    const name = document.getElementById('qob-name')?.value?.trim();
    const due  = document.getElementById('qob-due')?.value;

    if (!due) {
      alert('Due date ya LMP zaroori hai!');
      return;
    }

    // Apply language
    if (window.applyLang) window.applyLang(qobLang);

    // Set due date in main app
    const directDue = document.getElementById('directDue');
    if (directDue) { directDue.value = due; directDue.dispatchEvent(new Event('change')); }

    // Save to Supabase
    if (window.supa && window.user) {
      await window.supa.from('user_profile').upsert({
        id: window.user.id,
        name: name || null,
        due_date: due,
        language: qobLang,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    }

    localStorage.setItem('mc_onboard_done', '1');
    if (name) localStorage.setItem('mc_user_name', name);

    const overlay = document.getElementById('quickOnboardOverlay');
    if (overlay) {
      overlay.style.transition = 'opacity .4s';
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 400);
    }

    // Welcome toast
    const greeting = name ? `Welcome, ${name}! 🌸` : 'Welcome to Mama Gyan! 🌸';
    showWelcomeToast(greeting);

    // Ask for push permission after onboarding
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'default') {
        showPushPrompt();
      }
    }, 2000);
  },
};

function showWelcomeToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;top:20px;left:50%;transform:translateX(-50%);
    background:linear-gradient(135deg,#e8a0a8,#c97b7b);color:white;
    padding:14px 24px;border-radius:20px;font-size:14px;font-weight:600;
    z-index:9999;box-shadow:0 8px 24px rgba(201,123,123,.4);
    white-space:nowrap;animation:fadeInDown .4s ease;`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .4s'; }, 3000);
  setTimeout(() => toast.remove(), 3500);
}

function showPushPrompt() {
  const prompt = document.createElement('div');
  prompt.style.cssText = `
    position:fixed;bottom:90px;left:12px;right:12px;z-index:1500;
    background:white;border-radius:20px;padding:18px 20px;
    box-shadow:0 8px 32px rgba(0,0,0,.15);border:1px solid rgba(232,160,168,.3);`;
  prompt.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:14px;">
      <div style="font-size:36px;flex-shrink:0;">🔔</div>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:14px;margin-bottom:4px;">Notifications Enable Karein?</div>
        <div style="font-size:12.5px;color:#999;line-height:1.6;margin-bottom:12px;">
          Medicine, paani, kick count reminders — app band hone ke baad bhi milenge.
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-p btn-sm" style="flex:1;" onclick="PUSH.enable();this.closest('div[style]').remove()">
            🔔 Enable
          </button>
          <button class="btn btn-g btn-sm" onclick="this.closest('div[style]').remove()">
            Baad mein
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(prompt);
  setTimeout(() => { if (prompt.parentNode) prompt.remove(); }, 15000);
}

window.showPushPrompt = showPushPrompt;

// ══════════════════════════════════════════════════════════════
// 7. PHOTO JOURNAL — CLOUD STORAGE (no base64 localStorage)
// ══════════════════════════════════════════════════════════════
async function uploadJournalPhoto(file) {
  if (!file) return null;

  // Compress image before upload
  const compressed = await compressImage(file, 800, 0.75);

  if (window.supa && window.user && navigator.onLine) {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `journal/${window.user.id}/${Date.now()}.${ext}`;
    const { data, error } = await window.supa.storage
      .from('user-photos')
      .upload(path, compressed, { contentType: compressed.type, upsert: false });

    if (!error && data) {
      const { data: urlData } = window.supa.storage.from('user-photos').getPublicUrl(path);
      return urlData?.publicUrl || null;
    }
    console.warn('[PhotoUpload] Supabase error:', error);
  }

  // Fallback: return object URL (session only, not persisted)
  return URL.createObjectURL(compressed);
}

function compressImage(file, maxWidth, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob || file), 'image/jpeg', quality);
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

window.uploadJournalPhoto = uploadJournalPhoto;

// ══════════════════════════════════════════════════════════════
// 8. INIT — wire everything up
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Offline indicator
  initOfflineIndicator();

  // Streamlined onboarding
  injectStreamlinedOnboarding();

  // Partner companion page
  injectPartnerCompanionPage();

  // Push settings UI (injected into reminders page after it loads)
  setTimeout(injectPushSettingsUI, 500);

  // Doctor PDF button
  setTimeout(injectDoctorPDFButton, 600);

  // Contraction persistence
  setTimeout(() => {
    loadContractionsFromDB();
    patchContractionPersistence();
  }, 800);

  // Wire partner companion data load into goTo
  const origGoTo = window.goTo;
  if (origGoTo && !window._partnerGoToPatched) {
    window._partnerGoToPatched = true;
    window.goTo = function(id) {
      origGoTo(id);
      if (id === 'partner-companion') window.PARTNER.loadData();
    };
  }

  // Show quick onboarding if needed (after auth)
  window.addEventListener('mc:loggedin', () => {
    if (!localStorage.getItem('mc_onboard_done')) {
      // Use quick onboard instead of the full wizard
      setTimeout(() => window.QONBOARD.show(), 800);
    }
    // Schedule push reminders on login
    if (Notification.permission === 'granted') {
      setTimeout(schedulePushReminders, 1000);
    }
    // Init all reminders (existing function)
    if (window.initAllReminders) setTimeout(window.initAllReminders, 1500);
  });
});

// Also hook into existing onLogin if it fires before our listener
const _origOnLogin = window.onMCLogin;
window.onMCLogin = function(u) {
  if (_origOnLogin) _origOnLogin(u);
  window.dispatchEvent(new CustomEvent('mc:loggedin', { detail: u }));
};

// Override ONBOARD.checkOnboarding to use the streamlined quick onboard
// This runs after app-onboard.js has set up window.ONBOARD
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.ONBOARD) {
      window.ONBOARD.checkOnboarding = async function(user) {
        if (localStorage.getItem('mc_onboard_done')) return;
        if (!user || !window.supa) return;
        const { data } = await window.supa.from('user_profile').select('name,due_date').eq('id', user.id).maybeSingle();
        if (!data?.due_date) {
          setTimeout(() => window.QONBOARD.show(), 800);
        }
      };
    }
  }, 200);
});
