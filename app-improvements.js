/**
 * MamaCare — app-improvements.js
 * Implements: Contraction Timer, Empty States, Loading States,
 * Push Notifications setup, Privacy Policy, Input Validation helpers
 */
'use strict';

// ══════════════════════════════════════
// CONTRACTION TIMER
// ══════════════════════════════════════
let contractionState = {
  active: false,
  startTime: null,
  contractions: [],
  timerInterval: null,
};

function initContractionTimer() {
  injectContractionPage();
  renderContractionHistory();
}

function injectContractionPage() {
  if (document.getElementById('page-contractions')) return;
  const page = document.createElement('main');
  page.className = 'page';
  page.id = 'page-contractions';
  page.innerHTML = `
    <div style="padding:4px 0 12px">
      <div class="sec-label">Labor Prep</div>
      <div class="sec-title">Contraction Timer ⏱️</div>
    </div>
    <div class="card" style="text-align:center;">
      <div id="ctStatus" style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        Contraction shuru hone pe button dabao
      </div>
      <div id="ctTimer" style="font-family:'Cormorant Garamond',serif;font-size:4rem;color:var(--rose);margin:16px 0;min-height:72px;line-height:1;">
        00:00
      </div>
      <button id="ctBtn" class="btn btn-p" style="width:100%;font-size:16px;padding:16px;" onclick="toggleContraction()">
        🤰 Contraction Shuru
      </button>
      <div id="ctStats" class="g3" style="margin-top:16px;"></div>
    </div>
    <div class="card">
      <div class="sec-label">Pattern Analysis</div>
      <div id="ctPattern" style="font-size:13.5px;color:var(--text-muted);padding:8px 0;">
        3+ contractions ke baad pattern dikhega
      </div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div class="sec-label" style="margin:0;">History</div>
        <button class="btn btn-g btn-sm" onclick="clearContractions()">Clear</button>
      </div>
      <div id="ctHistory"></div>
    </div>
    <div class="card" style="background:rgba(224,107,116,0.06);border-color:rgba(224,107,116,0.2);">
      <div class="sec-label" style="color:var(--danger);">🚨 Hospital Kab Jaayein?</div>
      <div style="font-size:13.5px;line-height:1.8;color:var(--text-main);">
        <strong>5-1-1 Rule:</strong> Contractions <strong>5 min</strong> ke antar pe,
        <strong>1 min</strong> duration, <strong>1 ghante</strong> se zyada — hospital jaao.<br>
        <span style="color:var(--danger);font-weight:600;">Pehle baby ke liye: 3-1-1 rule follow karo.</span>
      </div>
    </div>`;
  document.querySelector('.app-shell')?.insertBefore(page, document.querySelector('nav#bottomNav'));

  // Add to more menu
  const moreGrid = document.querySelector('#moreMenu .more-grid');
  if (moreGrid && !moreGrid.querySelector('[data-page="contractions"]')) {
    const item = document.createElement('div');
    item.className = 'more-item';
    item.dataset.page = 'contractions';
    item.innerHTML = `<div class="mi-icon"><i data-lucide="timer"></i></div><div class="mi-label">Contractions</div>`;
    item.addEventListener('click', () => {
      document.getElementById('moreMenu').style.display = 'none';
      if (window.goTo) window.goTo('contractions');
    });
    moreGrid.appendChild(item);
  }
}

function toggleContraction() {
  const btn = document.getElementById('ctBtn');
  const status = document.getElementById('ctStatus');
  if (!contractionState.active) {
    // Start
    contractionState.active = true;
    contractionState.startTime = Date.now();
    btn.textContent = '⏹️ Contraction Khatam';
    btn.style.background = 'linear-gradient(135deg,#e05c5c,#e88)';
    status.textContent = 'Contraction chal rahi hai...';
    contractionState.timerInterval = setInterval(updateContractionTimer, 100);
  } else {
    // Stop
    const duration = Math.round((Date.now() - contractionState.startTime) / 1000);
    const last = contractionState.contractions[contractionState.contractions.length - 1];
    const gap = last ? Math.round((contractionState.startTime - last.endTime) / 1000) : null;
    contractionState.contractions.push({
      startTime: contractionState.startTime,
      endTime: Date.now(),
      duration,
      gap,
    });
    clearInterval(contractionState.timerInterval);
    contractionState.active = false;
    contractionState.startTime = null;
    btn.textContent = '🤰 Contraction Shuru';
    btn.style.background = '';
    document.getElementById('ctTimer').textContent = '00:00';
    status.textContent = `Contraction #${contractionState.contractions.length} recorded — ${duration}s`;
    renderContractionHistory();
    analyzeContractionPattern();
  }
}

function updateContractionTimer() {
  if (!contractionState.startTime) return;
  const elapsed = Math.floor((Date.now() - contractionState.startTime) / 1000);
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const s = (elapsed % 60).toString().padStart(2, '0');
  const el = document.getElementById('ctTimer');
  if (el) el.textContent = `${m}:${s}`;
}

function renderContractionHistory() {
  const el = document.getElementById('ctHistory');
  if (!el) return;
  const list = contractionState.contractions;
  if (!list.length) {
    el.innerHTML = '<p style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Abhi koi contraction record nahi hui.</p>';
    return;
  }
  el.innerHTML = list.slice().reverse().map((c, i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:white;border-radius:12px;margin-bottom:7px;font-size:13px;">
      <span style="font-weight:600;">#${list.length - i}</span>
      <span>⏱ ${c.duration}s</span>
      <span style="color:var(--text-muted);">${c.gap ? `Gap: ${Math.floor(c.gap/60)}m ${c.gap%60}s` : 'First'}</span>
      <span style="font-size:11px;color:var(--text-muted);">${new Date(c.startTime).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
    </div>`).join('');

  // Stats
  const statsEl = document.getElementById('ctStats');
  if (statsEl && list.length >= 2) {
    const avgDur = Math.round(list.reduce((a,c) => a + c.duration, 0) / list.length);
    const gaps = list.filter(c => c.gap).map(c => c.gap);
    const avgGap = gaps.length ? Math.round(gaps.reduce((a,g) => a+g, 0) / gaps.length) : 0;
    statsEl.innerHTML = `
      <div class="stat"><div class="stat-v">${list.length}</div><div class="stat-l">Total</div></div>
      <div class="stat"><div class="stat-v">${avgDur}s</div><div class="stat-l">Avg Duration</div></div>
      <div class="stat"><div class="stat-v">${avgGap ? Math.floor(avgGap/60)+'m' : '—'}</div><div class="stat-l">Avg Gap</div></div>`;
  }
}

function analyzeContractionPattern() {
  const el = document.getElementById('ctPattern');
  if (!el) return;
  const list = contractionState.contractions;
  if (list.length < 3) { el.textContent = '3+ contractions ke baad pattern dikhega'; return; }
  const recent = list.slice(-5);
  const avgDur = Math.round(recent.reduce((a,c) => a+c.duration, 0) / recent.length);
  const gaps = recent.filter(c => c.gap).map(c => c.gap);
  const avgGap = gaps.length ? Math.round(gaps.reduce((a,g) => a+g, 0) / gaps.length) : 0;
  const avgGapMin = Math.floor(avgGap / 60);
  let advice = '', color = 'var(--text-muted)';
  if (avgGapMin <= 5 && avgDur >= 60) {
    advice = '🚨 5-1-1 Rule: HOSPITAL JAAO ABHI!'; color = 'var(--danger)';
  } else if (avgGapMin <= 7 && avgDur >= 45) {
    advice = '⚠️ Contractions close ho rahi hain — hospital ke liye ready ho jaao.'; color = '#e08c3a';
  } else if (avgGapMin <= 10) {
    advice = '📞 Doctor ko call karo — contractions regular ho rahi hain.'; color = '#c9a020';
  } else {
    advice = '✅ Early labor — ghar pe aaram karo, track karte raho.'; color = 'var(--green)';
  }
  el.innerHTML = `<div style="color:${color};font-weight:600;font-size:14px;">${advice}</div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:6px;">Avg duration: ${avgDur}s | Avg gap: ${avgGapMin}m ${avgGap%60}s</div>`;
}

function clearContractions() {
  if (!confirm('Sab contractions clear karein?')) return;
  contractionState.contractions = [];
  renderContractionHistory();
  const el = document.getElementById('ctPattern');
  if (el) el.textContent = '3+ contractions ke baad pattern dikhega';
  const stats = document.getElementById('ctStats');
  if (stats) stats.innerHTML = '';
}

// ══════════════════════════════════════
// EMPTY STATES
// ══════════════════════════════════════
const EMPTY_STATES = {
  weightLog: `<div style="text-align:center;padding:24px 16px;">
    <div style="font-size:40px;margin-bottom:10px;">⚖️</div>
    <div style="font-weight:600;font-size:14px;color:var(--text-main);margin-bottom:6px;">Pehla weight log karo!</div>
    <div style="font-size:13px;color:var(--text-muted);line-height:1.6;">Upar weight daalo aur track karo — healthy gain ke liye guidance milegi.</div>
  </div>`,
  sleepLog: `<div style="text-align:center;padding:24px 16px;">
    <div style="font-size:40px;margin-bottom:10px;">🌙</div>
    <div style="font-weight:600;font-size:14px;color:var(--text-main);margin-bottom:6px;">Aaj ki neend log karo!</div>
    <div style="font-size:13px;color:var(--text-muted);line-height:1.6;">Bedtime aur wake time daalo — sleep quality track hogi.</div>
  </div>`,
  foodList: `<div style="text-align:center;padding:24px 16px;">
    <div style="font-size:40px;margin-bottom:10px;">🥗</div>
    <div style="font-weight:600;font-size:14px;color:var(--text-main);margin-bottom:6px;">Aaj kya khaya?</div>
    <div style="font-size:13px;color:var(--text-muted);line-height:1.6;">Khana log karo — calories aur nutrients track honge.</div>
  </div>`,
  medList: `<div style="text-align:center;padding:24px 16px;">
    <div style="font-size:40px;margin-bottom:10px;">💊</div>
    <div style="font-weight:600;font-size:14px;color:var(--text-main);margin-bottom:6px;">Koi medicine nahi hai</div>
    <div style="font-size:13px;color:var(--text-muted);line-height:1.6;">+ Add Med se apni medicines add karo — reminder milega.</div>
  </div>`,
  apptList: `<div style="text-align:center;padding:24px 16px;">
    <div style="font-size:40px;margin-bottom:10px;">🩺</div>
    <div style="font-weight:600;font-size:14px;color:var(--text-main);margin-bottom:6px;">Koi appointment nahi</div>
    <div style="font-size:13px;color:var(--text-muted);line-height:1.6;">Apna agla doctor visit add karo — yaad dilayenge.</div>
  </div>`,
  journalEntries: `<div style="text-align:center;padding:24px 16px;">
    <div style="font-size:40px;margin-bottom:10px;">📔</div>
    <div style="font-weight:600;font-size:14px;color:var(--text-main);margin-bottom:6px;">Pehli diary entry likho!</div>
    <div style="font-size:13px;color:var(--text-muted);line-height:1.6;">Aaj ki feelings, yaadein, aur khushi — sab yahan save karo.</div>
  </div>`,
};

function applyEmptyState(elementId) {
  const el = document.getElementById(elementId);
  if (el && (!el.innerHTML.trim() || el.innerHTML.includes('Koi entry nahi'))) {
    el.innerHTML = EMPTY_STATES[elementId] || '';
  }
}

// Patch empty state checks after data loads
function patchEmptyStates() {
  const targets = ['weightLog','sleepLog','foodList','medList','apptList','journalEntries'];
  targets.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const observer = new MutationObserver(() => {
        if (!el.innerHTML.trim()) applyEmptyState(id);
      });
      observer.observe(el, { childList: true });
    }
  });
}

// ══════════════════════════════════════
// LOADING STATE HELPERS
// ══════════════════════════════════════
function showLoading(elementId, msg = 'Loading...') {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">
    <div class="spinner" style="width:28px;height:28px;margin:0 auto 10px;"></div>${msg}</div>`;
}

function showError(elementId, msg = 'Kuch galat hua. Dobara try karein.') {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = `<div style="text-align:center;padding:16px;color:var(--danger);font-size:13px;">
    <i data-lucide="alert-circle" class="app-icon-inline"></i> ${msg}</div>`;
  if (window.lucide) lucide.createIcons();
}

// ══════════════════════════════════════
// INPUT VALIDATION HELPERS
// ══════════════════════════════════════
function validateWeight(kg) {
  if (!kg || isNaN(kg)) return 'Weight daalna zaroori hai';
  if (kg < 30 || kg > 200) return 'Weight 30-200 kg ke beech hona chahiye';
  return null;
}

function validateWeek(wk) {
  if (wk && (wk < 1 || wk > 42)) return 'Week 1-42 ke beech hona chahiye';
  return null;
}

function validateDate(dateStr) {
  if (!dateStr) return 'Date zaroori hai';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Valid date daalo';
  const now = new Date();
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
  const twoYearsAhead = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());
  if (d < fiveYearsAgo || d > twoYearsAhead) return 'Date valid range mein nahi hai';
  return null;
}

function showFieldError(inputEl, msg) {
  if (!inputEl) return;
  inputEl.style.borderColor = 'var(--danger)';
  inputEl.style.boxShadow = '0 0 0 3px rgba(224,107,116,0.15)';
  let errEl = inputEl.nextElementSibling;
  if (!errEl || !errEl.classList.contains('field-error')) {
    errEl = document.createElement('div');
    errEl.className = 'field-error';
    errEl.style.cssText = 'font-size:12px;color:var(--danger);margin-top:4px;';
    inputEl.parentNode.insertBefore(errEl, inputEl.nextSibling);
  }
  errEl.textContent = msg;
}

function clearFieldError(inputEl) {
  if (!inputEl) return;
  inputEl.style.borderColor = '';
  inputEl.style.boxShadow = '';
  const errEl = inputEl.nextElementSibling;
  if (errEl && errEl.classList.contains('field-error')) errEl.remove();
}

// ══════════════════════════════════════
// PUSH NOTIFICATIONS SETUP
// ══════════════════════════════════════
async function requestPushPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function scheduleMedicineReminders(medicines) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  medicines.forEach(med => {
    if (!med.reminder_time) return;
    const [h, m] = med.reminder_time.split(':').map(Number);
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target - now;
    if (delay < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        new Notification('💊 Medicine Reminder — Mama Gyan', {
          body: `${med.icon || '💊'} ${med.name} — ${med.dose || ''} lene ka waqt!`,
          icon: '/mcAppIcons/android/mipmap-xxxhdpi/icon.png',
          badge: '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/180.png',
          tag: `med-${med.id}`,
        });
      }, delay);
    }
  });
}

// ══════════════════════════════════════
// PRIVACY POLICY MODAL
// ══════════════════════════════════════
function injectPrivacyPolicy() {
  if (document.getElementById('privacyModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
<div id="privacyModal" style="display:none;position:fixed;inset:0;z-index:3000;background:rgba(74,53,53,0.6);backdrop-filter:blur(4px);overflow-y:auto;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:24px;padding:28px;position:relative;">
    <button onclick="document.getElementById('privacyModal').style.display='none'"
      style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-muted);">✕</button>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;margin-bottom:16px;color:var(--text-main);">Privacy Policy 🔒</h2>
    <div style="font-size:13.5px;line-height:1.8;color:var(--text-main);">
      <p style="margin-bottom:12px;"><strong>Mama Gyan</strong> aapki privacy ko seriously leta hai. Yeh policy DPDP Act 2023 ke anusaar hai.</p>
      <p style="margin-bottom:8px;font-weight:600;">Hum kya collect karte hain:</p>
      <ul style="margin-bottom:12px;padding-left:20px;">
        <li>Email address (login ke liye)</li>
        <li>Pregnancy health data (weight, sleep, nutrition, mood)</li>
        <li>Due date aur pregnancy week</li>
        <li>Journal entries aur diary</li>
      </ul>
      <p style="margin-bottom:8px;font-weight:600;">Hum data kaise use karte hain:</p>
      <ul style="margin-bottom:12px;padding-left:20px;">
        <li>Personalized pregnancy tracking provide karne ke liye</li>
        <li>AI-powered health guidance ke liye</li>
        <li>Aapka data kabhi third parties ko sell nahi kiya jaata</li>
      </ul>
      <p style="margin-bottom:8px;font-weight:600;">Aapke rights (DPDP Act 2023):</p>
      <ul style="margin-bottom:12px;padding-left:20px;">
        <li>Apna data access karne ka haq</li>
        <li>Data correction ka haq</li>
        <li>Data deletion ka haq — account delete karne pe sab data hata diya jaata hai</li>
      </ul>
      <p style="margin-bottom:12px;"><strong>Data Storage:</strong> Aapka data Supabase (secure cloud) mein store hota hai. Hum end-to-end encryption use karte hain.</p>
      <p style="font-size:12px;color:var(--text-muted);">Contact: privacy@mamagyan.app | Last updated: May 2026</p>
    </div>
    <button class="btn btn-p" style="width:100%;margin-top:16px;" onclick="document.getElementById('privacyModal').style.display='none'">Samajh Gaya ✓</button>
  </div>
</div>`);
}

function showPrivacyPolicy() {
  injectPrivacyPolicy();
  document.getElementById('privacyModal').style.display = 'block';
}

// ══════════════════════════════════════
// INIT — runs after DOM ready
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  injectPrivacyPolicy();
  initContractionTimer();
  patchEmptyStates();

  // Add privacy link to footer
  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('.privacy-link')) {
    const link = document.createElement('div');
    link.style.cssText = 'margin-top:8px;font-size:12px;';
    link.innerHTML = `<a href="#" class="privacy-link" onclick="showPrivacyPolicy();return false;" style="color:var(--rose);text-decoration:none;">Privacy Policy</a> | <a href="#" onclick="showPrivacyPolicy();return false;" style="color:var(--rose);text-decoration:none;">DPDP Consent</a>`;
    footer.appendChild(link);
  }

  // Register contraction timer in goTo loads
  const origGoTo = window.goTo;
  if (origGoTo) {
    window.goTo = function(id) {
      origGoTo(id);
      if (id === 'contractions') renderContractionHistory();
    };
  }
});

// Expose globally
window.toggleContraction = toggleContraction;
window.clearContractions = clearContractions;
window.renderContractionHistory = renderContractionHistory;
window.showPrivacyPolicy = showPrivacyPolicy;
window.showLoading = showLoading;
window.showError = showError;
window.validateWeight = validateWeight;
window.validateWeek = validateWeek;
window.validateDate = validateDate;
window.showFieldError = showFieldError;
window.clearFieldError = clearFieldError;
window.scheduleMedicineReminders = scheduleMedicineReminders;
window.requestPushPermission = requestPushPermission;
