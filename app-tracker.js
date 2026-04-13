/**
 * MamaCare — app-tracker.js v6.1
 * NEW MEDICAL TRACKERS:
 *  1. Kick Counter    (kick_logs — schema already exists)
 *  2. Contraction Timer
 *  3. Blood Pressure Log
 *  4. Blood Sugar Log
 *
 * Load AFTER app.js in index.html
 */

'use strict';

// ════════════════════════════════════════
// 1. KICK COUNTER
// ════════════════════════════════════════
let kickSession = { active: false, count: 0, startTime: null };
let kickChart   = null;

async function initKickCounter() {
  if (!window.user) return;
  await loadKickHistory();
  renderKickStats();
}

async function loadKickHistory() {
  const { data } = await window.supa
    .from('kick_logs')
    .select('*')
    .eq('user_id', window.user.id)
    .order('session_date', { ascending: false })
    .limit(14);
  renderKickHistory(data || []);
  renderKickChart(data || []);
}

function kickStart() {
  if (kickSession.active) return kickStop();
  kickSession = { active: true, count: 0, startTime: new Date() };
  const btn = document.getElementById('kickStartBtn');
  if (btn) { btn.textContent = '⏹ Session Stop Karo'; btn.style.background = 'linear-gradient(135deg,#e05c5c,#c94040)'; }
  document.getElementById('kickCount').textContent = '0';
  document.getElementById('kickTimer').textContent = '0:00';
  document.getElementById('kickStatus').textContent = 'Session chal rahi hai... baby movements tap karo 👇';
  startKickClock();
  checkKickAlert();
}

let kickClockInterval = null;
function startKickClock() {
  kickClockInterval = setInterval(() => {
    if (!kickSession.active) { clearInterval(kickClockInterval); return; }
    const elapsed = Math.floor((new Date() - kickSession.startTime) / 1000);
    const m = Math.floor(elapsed / 60), s = elapsed % 60;
    const el = document.getElementById('kickTimer');
    if (el) el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
    // 2-hour warning
    if (elapsed >= 7200 && kickSession.count < 10) {
      document.getElementById('kickStatus').innerHTML = '⚠️ 2 ghante ho gaye — 10 kicks nahi aaye. <strong style="color:#e05c5c">Doctor ko call karein!</strong>';
    }
  }, 1000);
}

function kickTap() {
  if (!kickSession.active) { kickStart(); return; }
  kickSession.count++;
  const el = document.getElementById('kickCount');
  if (el) {
    el.textContent = kickSession.count;
    el.style.transform = 'scale(1.3)';
    setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
  }
  // Haptic feedback
  if (navigator.vibrate) navigator.vibrate(80);
  if (kickSession.count === 10) {
    const elapsed = Math.floor((new Date() - kickSession.startTime) / 1000);
    const m = Math.floor(elapsed / 60), s = elapsed % 60;
    document.getElementById('kickStatus').innerHTML = `🎉 <strong>10 kicks complete!</strong> Time: ${m}m ${s}s — Baby bilkul healthy hai!`;
  }
  checkKickAlert();
}

function checkKickAlert() {
  const el = document.getElementById('kickAlertBanner');
  if (!el) return;
  const hour = new Date().getHours();
  if (hour >= 9 && hour < 11) el.style.display = 'block';
  else if (hour >= 18 && hour < 20) el.style.display = 'block';
  else el.style.display = 'none';
}

async function kickStop() {
  if (!kickSession.active || !window.user) return;
  clearInterval(kickClockInterval);
  kickSession.active = false;
  const endTime = new Date();
  const btn = document.getElementById('kickStartBtn');
  if (btn) { btn.textContent = '▶️ Session Shuru Karo'; btn.style.background = ''; }
  // Save to Supabase
  const today = new Date().toISOString().split('T')[0];
  await window.supa.from('kick_logs').upsert({
    user_id: window.user.id,
    session_date: today,
    kick_count: kickSession.count,
    session_start: kickSession.startTime.toISOString(),
    session_end: endTime.toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,session_date' });
  document.getElementById('kickStatus').textContent = `✅ Session saved — ${kickSession.count} kicks logged.`;
  await loadKickHistory();
}

function renderKickHistory(logs) {
  const el = document.getElementById('kickHistory');
  if (!el) return;
  if (!logs.length) { el.innerHTML = '<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi session nahi. Upar se shuru karo!</p>'; return; }
  el.innerHTML = logs.slice(0, 10).map(l => {
    const ok = l.kick_count >= 10;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:white;border-radius:12px;margin-bottom:7px;font-size:13px">
      <span>${new Date(l.session_date).toLocaleDateString('hi-IN',{day:'numeric',month:'short'})}</span>
      <span style="font-weight:600">${l.kick_count} kicks</span>
      <span class="pill ${ok ? 'pill-g' : 'pill-r'}">${ok ? '✅ Good' : '⚠️ Low'}</span>
    </div>`;
  }).join('');
}

function renderKickChart(logs) {
  const ctx = document.getElementById('kickChart')?.getContext('2d');
  if (!ctx || !logs.length) return;
  if (kickChart) { kickChart.destroy(); kickChart = null; }
  const last7 = logs.slice(0, 7).reverse();
  kickChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: last7.map(l => new Date(l.session_date).toLocaleDateString('en-IN',{day:'numeric',month:'numeric'})),
      datasets: [{
        label: 'Kicks',
        data: last7.map(l => l.kick_count),
        backgroundColor: last7.map(l => l.kick_count >= 10 ? 'rgba(106,184,154,.8)' : 'rgba(220,80,80,.65)'),
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, ticks: { stepSize: 5 } },
        x: { ticks: { font: { size: 10 } } }
      }
    }
  });
}

function renderKickStats() {
  // Daily reminder status
  const hour = new Date().getHours();
  const el = document.getElementById('kickDailyStatus');
  if (el) el.textContent = hour < 18 ? '🌅 Subah ka session (10am)' : '🌆 Shaam ka session (6pm)';
}

// ════════════════════════════════════════
// 2. CONTRACTION TIMER
// ════════════════════════════════════════
let contractions = [];
let contractionActive = false;
let contractionStart = null;

function contractionTap() {
  if (!contractionActive) {
    // Start contraction
    contractionActive = true;
    contractionStart = new Date();
    const btn = document.getElementById('contractionBtn');
    if (btn) { btn.textContent = '⏹ Contraction Khatam'; btn.style.background = 'linear-gradient(135deg,#e05c5c,#c94040)'; }
    document.getElementById('contractionStatus').textContent = '🔴 Contraction chal rahi hai...';
    contractionTick();
  } else {
    // End contraction
    contractionActive = false;
    const end = new Date();
    const duration = Math.floor((end - contractionStart) / 1000);
    const gap = contractions.length
      ? Math.floor((contractionStart - new Date(contractions[contractions.length - 1].end)) / 1000)
      : null;
    contractions.push({ start: contractionStart.toISOString(), end: end.toISOString(), duration, gap });
    clearInterval(contractionTickInterval);
    const btn = document.getElementById('contractionBtn');
    if (btn) { btn.textContent = '🫁 Contraction Shuru'; btn.style.background = ''; }
    renderContractions();
    checkContractionPattern();
  }
}

let contractionTickInterval = null;
function contractionTick() {
  contractionTickInterval = setInterval(() => {
    if (!contractionActive) { clearInterval(contractionTickInterval); return; }
    const dur = Math.floor((new Date() - contractionStart) / 1000);
    document.getElementById('contractionStatus').textContent = `🔴 Contraction: ${dur}s`;
  }, 1000);
}

function resetContractions() {
  if (!confirm('Sab contractions reset karein?')) return;
  contractions = [];
  contractionActive = false;
  clearInterval(contractionTickInterval);
  document.getElementById('contractionStatus').textContent = 'Tap karo jab contraction shuru ho';
  const btn = document.getElementById('contractionBtn');
  if (btn) { btn.textContent = '🫁 Contraction Shuru'; btn.style.background = ''; }
  renderContractions();
}

function renderContractions() {
  const el = document.getElementById('contractionList');
  if (!el) return;
  if (!contractions.length) { el.innerHTML = '<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi contraction log nahi.</p>'; return; }
  el.innerHTML = contractions.slice().reverse().map((c, i) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:white;border-radius:12px;margin-bottom:6px;font-size:13px">
      <span style="font-weight:600">#${contractions.length - i}</span>
      <span>⏱ ${c.duration}s</span>
      <span style="color:var(--muted)">${c.gap !== null ? `Gap: ${Math.floor(c.gap/60)}m ${c.gap%60}s` : 'First'}</span>
    </div>`).join('');
  // Stats
  if (contractions.length >= 2) {
    const avgDur  = Math.round(contractions.reduce((a,c) => a+c.duration, 0) / contractions.length);
    const gaps    = contractions.filter(c => c.gap !== null).map(c => c.gap);
    const avgGap  = gaps.length ? Math.round(gaps.reduce((a,b)=>a+b,0)/gaps.length) : null;
    const statsEl = document.getElementById('contractionStats');
    if (statsEl) statsEl.innerHTML = `
      <div class="stat"><div class="stat-v">${contractions.length}</div><div class="stat-l">Count</div></div>
      <div class="stat"><div class="stat-v">${avgDur}s</div><div class="stat-l">Avg Duration</div></div>
      <div class="stat"><div class="stat-v">${avgGap ? Math.floor(avgGap/60)+'m' : '—'}</div><div class="stat-l">Avg Gap</div></div>`;
  }
}

function checkContractionPattern() {
  if (contractions.length < 3) return;
  const recent = contractions.slice(-3);
  const gaps   = recent.filter(c => c.gap !== null).map(c => c.gap);
  const avgGap = gaps.length ? gaps.reduce((a,b)=>a+b,0)/gaps.length : 999;
  const avgDur = recent.reduce((a,c)=>a+c.duration,0)/recent.length;
  const alertEl = document.getElementById('contractionAlert');
  if (!alertEl) return;
  // 5-1-1 rule: 5 min apart, 1 min each, for 1 hour
  if (avgGap <= 300 && avgDur >= 45) {
    alertEl.style.display = 'block';
    alertEl.innerHTML = `🚨 <strong>HOSPITAL JAANE KA TIME!</strong><br>Contractions ${Math.floor(avgGap/60)} min apart, ${Math.round(avgDur)}s long — 5-1-1 rule. Turant hospital chalo!`;
  } else if (avgGap <= 600) {
    alertEl.style.display = 'block';
    alertEl.innerHTML = `⚠️ Contractions ${Math.floor(avgGap/60)} min apart ho rahi hain. Doctor ko call karo!`;
    alertEl.style.background = 'rgba(212,168,83,.12)';
  } else {
    alertEl.style.display = 'none';
  }
}

// Save session to Supabase
async function saveContractionSession() {
  if (!window.user || !contractions.length) return;
  await window.supa.from('contraction_sessions').insert({
    user_id: window.user.id,
    contractions: contractions,
    session_date: new Date().toISOString().split('T')[0],
  });
  alert('Session saved! ✅');
}

// ════════════════════════════════════════
// 3. BLOOD PRESSURE LOG
// ════════════════════════════════════════
let bpChart = null;

async function loadBP() {
  if (!window.user) return;
  const { data } = await window.supa
    .from('bp_logs')
    .select('*')
    .eq('user_id', window.user.id)
    .order('logged_at', { ascending: false })
    .limit(30);
  renderBPList(data || []);
  renderBPChart(data || []);
}

async function addBP() {
  const sys = parseInt(document.getElementById('bpSys').value);
  const dia = parseInt(document.getElementById('bpDia').value);
  const pul = parseInt(document.getElementById('bpPulse').value) || null;
  if (!sys || !dia || sys < 60 || sys > 220 || dia < 40 || dia > 140) {
    alert('Valid BP daalo (e.g. 120/80)'); return;
  }
  if (!window.user) return;
  await window.supa.from('bp_logs').insert({
    user_id: window.user.id, systolic: sys, diastolic: dia, pulse: pul,
    bp_date: new Date().toISOString().split('T')[0],
    notes: document.getElementById('bpNotes')?.value || null,
  });
  document.getElementById('bpSys').value = '';
  document.getElementById('bpDia').value = '';
  document.getElementById('bpPulse').value = '';
  if (document.getElementById('bpNotes')) document.getElementById('bpNotes').value = '';
  flashBPAlert(sys, dia);
  loadBP();
}

function flashBPAlert(sys, dia) {
  const el = document.getElementById('bpAlert');
  if (!el) return;
  if (sys >= 160 || dia >= 110) {
    el.style.background = '#ffebee'; el.style.borderColor = '#e05c5c';
    el.innerHTML = `🚨 <strong>SEVERE HYPERTENSION!</strong> BP ${sys}/${dia} — Turant hospital jaao! Preeclampsia emergency.`;
  } else if (sys >= 140 || dia >= 90) {
    el.style.background = '#fff3e0'; el.style.borderColor = 'var(--gold)';
    el.innerHTML = `⚠️ <strong>HIGH BP!</strong> ${sys}/${dia} — Doctor ko call karo. Preeclampsia risk.`;
  } else if (sys >= 130 || dia >= 80) {
    el.style.background = 'rgba(212,168,83,.1)'; el.style.borderColor = 'var(--gold)';
    el.innerHTML = `💛 BP ${sys}/${dia} — Thoda elevated. Rest karo, doctor se discuss karo.`;
  } else {
    el.style.background = '#e8f5e9'; el.style.borderColor = 'var(--green)';
    el.innerHTML = `✅ BP ${sys}/${dia} — Normal range. Achha hai!`;
  }
  el.style.display = 'block';
}

function bpCategory(sys, dia) {
  if (sys >= 160 || dia >= 110) return { label: '🚨 Severe', color: '#e05c5c', bg: '#ffebee' };
  if (sys >= 140 || dia >= 90)  return { label: '⚠️ High',   color: '#e07040', bg: '#fff3e0' };
  if (sys >= 130 || dia >= 80)  return { label: '💛 Watch',  color: '#d4a853', bg: '#fffde0' };
  if (sys < 90  || dia < 60)   return { label: '💙 Low',    color: '#7ab8d4', bg: '#e3f2fd' };
  return { label: '✅ Normal', color: '#6ab89a', bg: '#e8f5e9' };
}

function renderBPList(logs) {
  const el = document.getElementById('bpList');
  if (!el) return;
  if (!logs.length) { el.innerHTML = '<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi entry nahi.</p>'; return; }
  const last = logs[0];
  const cat  = bpCategory(last.systolic, last.diastolic);
  document.getElementById('bpLatest').innerHTML = `
    <div style="text-align:center;padding:16px 0">
      <div style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;color:${cat.color}">${last.systolic}/${last.diastolic}</div>
      <div style="font-size:12px;color:var(--muted)">mmHg | Pulse: ${last.pulse || '—'} bpm</div>
      <span style="font-size:12px;padding:4px 14px;border-radius:50px;background:${cat.bg};color:${cat.color};font-weight:600;margin-top:6px;display:inline-block">${cat.label}</span>
    </div>`;
  el.innerHTML = logs.slice(0, 14).map(l => {
    const c = bpCategory(l.systolic, l.diastolic);
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 13px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px">
      <span style="font-weight:600;color:${c.color}">${l.systolic}/${l.diastolic}</span>
      <span style="font-size:12px;color:var(--muted)">${new Date(l.logged_at).toLocaleDateString('en-IN')}</span>
      <span class="pill" style="background:${c.bg};color:${c.color}">${c.label}</span>
    </div>`;
  }).join('');
}

function renderBPChart(logs) {
  const ctx = document.getElementById('bpChart')?.getContext('2d');
  if (!ctx || logs.length < 2) return;
  if (bpChart) { bpChart.destroy(); bpChart = null; }
  const rev = logs.slice(0, 14).reverse();
  bpChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rev.map(l => new Date(l.logged_at).toLocaleDateString('en-IN',{day:'numeric',month:'numeric'})),
      datasets: [
        { label: 'Systolic',  data: rev.map(l=>l.systolic),  borderColor:'#e05c5c', backgroundColor:'rgba(220,80,80,.08)', tension:.4, pointRadius:4, fill:false },
        { label: 'Diastolic', data: rev.map(l=>l.diastolic), borderColor:'#7ab8d4', backgroundColor:'rgba(122,184,212,.08)', tension:.4, pointRadius:4, fill:false },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top', labels: { font: { size: 11 } } } },
      scales: {
        y: { min: 50, max: 180, ticks: { font: { size: 11 } } },
        x: { ticks: { font: { size: 10 } } }
      }
    }
  });
}

async function deleteBP(id) {
  await window.supa.from('bp_logs').delete().eq('id', id);
  loadBP();
}

// ════════════════════════════════════════
// 4. BLOOD SUGAR LOG
// ════════════════════════════════════════
let sugarChart = null;

async function loadSugar() {
  if (!window.user) return;
  const { data } = await window.supa
    .from('sugar_logs')
    .select('*')
    .eq('user_id', window.user.id)
    .order('logged_at', { ascending: false })
    .limit(30);
  renderSugarList(data || []);
  renderSugarChart(data || []);
}

async function addSugar() {
  const val = parseFloat(document.getElementById('sugarVal').value);
  const type = document.getElementById('sugarType').value;
  if (!val || val < 2 || val > 30) { alert('Valid sugar reading daalo (mmol/L mein)'); return; }
  if (!window.user) return;
  await window.supa.from('sugar_logs').insert({
    user_id: window.user.id, reading: val, reading_type: type,
    sugar_date: new Date().toISOString().split('T')[0],
    notes: document.getElementById('sugarNotes')?.value || null,
  });
  document.getElementById('sugarVal').value = '';
  if (document.getElementById('sugarNotes')) document.getElementById('sugarNotes').value = '';
  flashSugarAlert(val, type);
  loadSugar();
}

function sugarCategory(val, type) {
  // Thresholds in mmol/L
  const limits = {
    fasting:   { ok: 5.3, warn: 6.0 },
    post_meal: { ok: 7.8, warn: 8.5 },
    random:    { ok: 7.8, warn: 9.0 },
  };
  const lim = limits[type] || limits.random;
  if (val > lim.warn)  return { label: '🚨 High',   color: '#e05c5c', bg: '#ffebee' };
  if (val > lim.ok)    return { label: '⚠️ Watch',  color: '#e07040', bg: '#fff3e0' };
  if (val < 3.3)       return { label: '💙 Low',    color: '#7ab8d4', bg: '#e3f2fd' };
  return { label: '✅ Normal', color: '#6ab89a', bg: '#e8f5e9' };
}

function flashSugarAlert(val, type) {
  const el = document.getElementById('sugarAlert');
  if (!el) return;
  const c = sugarCategory(val, type);
  el.style.background = c.bg; el.style.borderColor = c.color;
  const typeLabels = { fasting: 'Fasting', post_meal: 'Post-meal', random: 'Random' };
  if (c.label.includes('High')) {
    el.innerHTML = `${c.label} — ${typeLabels[type]}: ${val} mmol/L. Doctor ko batao aur treatment follow karo!`;
  } else if (c.label.includes('Watch')) {
    el.innerHTML = `${c.label} — ${typeLabels[type]}: ${val} mmol/L. Diet check karo, doctor se discuss karo.`;
  } else {
    el.innerHTML = `${c.label} — ${typeLabels[type]}: ${val} mmol/L. Normal range! 🎉`;
  }
  el.style.display = 'block';
}

function renderSugarList(logs) {
  const el = document.getElementById('sugarList');
  if (!el) return;
  if (!logs.length) { el.innerHTML = '<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi entry nahi.</p>'; return; }
  const last = logs[0]; const cat = sugarCategory(last.reading, last.reading_type);
  document.getElementById('sugarLatest').innerHTML = `
    <div style="text-align:center;padding:14px 0">
      <div style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;color:${cat.color}">${last.reading} <span style="font-size:1rem">mmol/L</span></div>
      <div style="font-size:12px;color:var(--muted)">Type: ${last.reading_type}</div>
      <span style="font-size:12px;padding:4px 14px;border-radius:50px;background:${cat.bg};color:${cat.color};font-weight:600;margin-top:6px;display:inline-block">${cat.label}</span>
    </div>`;
  el.innerHTML = logs.slice(0, 14).map(l => {
    const c = sugarCategory(l.reading, l.reading_type);
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 13px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px">
      <span style="font-weight:600;color:${c.color}">${l.reading} mmol/L</span>
      <span style="font-size:11px;color:var(--muted)">${l.reading_type}</span>
      <span style="font-size:12px;color:var(--muted)">${new Date(l.logged_at).toLocaleDateString('en-IN')}</span>
    </div>`;
  }).join('');
}

function renderSugarChart(logs) {
  const ctx = document.getElementById('sugarChart')?.getContext('2d');
  if (!ctx || logs.length < 2) return;
  if (sugarChart) { sugarChart.destroy(); sugarChart = null; }
  const rev = logs.slice(0,14).reverse();
  sugarChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rev.map(l => new Date(l.logged_at).toLocaleDateString('en-IN',{day:'numeric',month:'numeric'})),
      datasets: [{
        label: 'Blood Sugar (mmol/L)',
        data: rev.map(l => l.reading),
        borderColor: '#d4a853',
        backgroundColor: 'rgba(212,168,83,.1)',
        tension: .4, pointRadius: 5, fill: true,
        pointBackgroundColor: rev.map(l => sugarCategory(l.reading, l.reading_type).color),
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 2, max: 14, ticks: { font: { size: 11 } } },
        x: { ticks: { font: { size: 10 } } }
      }
    }
  });
}

// ════════════════════════════════════════
// INIT — called from app.js onLogin
// ════════════════════════════════════════
function initTrackers() {
  initKickCounter();
  loadBP();
  loadSugar();
  // Inject tabs into nav
  addTrackerTabs();
}

function addTrackerTabs() {
  const topTabs = document.getElementById('topTabs');
  if (topTabs && !document.querySelector('[data-page="kick"]')) {
    [
      { page: 'kick',        label: '👶 Kicks'      },
      { page: 'contraction', label: '⏱️ Contractions'},
      { page: 'bp',          label: '❤️ BP'          },
      { page: 'sugar',       label: '🩸 Sugar'       },
    ].forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'top-tab'; btn.dataset.page = t.page; btn.textContent = t.label;
      btn.addEventListener('click', () => { if (window.MC?.goTo) window.MC.goTo(t.page); });
      topTabs.appendChild(btn);
    });
  }
  const moreGrid = document.querySelector('#moreMenu .more-grid');
  if (moreGrid && !document.querySelector('[data-page="kick"]')) {
    [
      { page: 'kick',        icon: '👶', label: 'Kicks'        },
      { page: 'contraction', icon: '⏱️', label: 'Contractions' },
      { page: 'bp',          icon: '❤️', label: 'BP Tracker'   },
      { page: 'sugar',       icon: '🩸', label: 'Sugar'        },
    ].forEach(t => {
      const div = document.createElement('div');
      div.className = 'more-item'; div.dataset.page = t.page;
      div.innerHTML = `<div class="mi-icon">${t.icon}</div><div class="mi-label">${t.label}</div>`;
      div.addEventListener('click', () => {
        document.getElementById('moreMenu').style.display = 'none';
        if (window.MC?.goTo) window.MC.goTo(t.page);
        if (t.page === 'kick') initKickCounter();
        if (t.page === 'bp')   loadBP();
        if (t.page === 'sugar') loadSugar();
      });
      moreGrid.appendChild(div);
    });
  }
}

// ════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Inject tracker pages
  injectTrackerPages();
});

function injectTrackerPages() {
  const footer = document.querySelector('footer');
  const html = `
<!-- KICK COUNTER PAGE -->
<div class="page" id="page-kick">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Baby Movements</div>
    <div class="sec-title">Kick Counter 👶 <span class="sync-badge" id="kick-save">☁️ Synced</span></div>
  </div>
  <div id="kickAlertBanner" style="display:none;background:rgba(232,160,168,.1);border:1.5px solid var(--rose);border-radius:14px;padding:13px 16px;margin-bottom:14px;font-size:13px;color:var(--warm)">
    ⏰ <strong>Kick count karne ka time!</strong> Baby ke movements track karo.
  </div>
  <div class="card" style="text-align:center;padding:28px">
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;margin-bottom:16px" id="kickDailyStatus">🌅 Subah ka session (10am)</div>
    <div style="margin-bottom:20px">
      <div id="kickCount" style="font-family:'Cormorant Garamond',serif;font-size:5rem;color:var(--accent);line-height:1;transition:transform .2s">0</div>
      <div id="kickTimer" style="font-size:1.4rem;color:var(--muted);margin-top:4px">0:00</div>
    </div>
    <button id="kickTapBtn" onclick="TRACKER.kickTap()" style="width:140px;height:140px;border-radius:50%;background:linear-gradient(145deg,var(--rose),var(--peach));border:none;color:white;font-size:40px;cursor:pointer;box-shadow:0 8px 28px rgba(200,100,100,.35);margin-bottom:18px;animation:sosPulse 2.5s infinite">👶</button>
    <div id="kickStatus" style="font-size:13px;color:var(--muted);margin-bottom:16px">Tap karo jab baby kick kare!</div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button id="kickStartBtn" class="btn btn-p" onclick="TRACKER.kickStart()">▶️ Session Shuru Karo</button>
      <button class="btn btn-g" onclick="TRACKER.kickStop()">⏹ Stop & Save</button>
    </div>
    <p style="font-size:12px;color:var(--muted);margin-top:12px;line-height:1.6">💡 Week 28+ se roz do baar count karo — subah aur shaam. 10 kicks 2 ghante mein normal hai.</p>
  </div>
  <div class="card"><div class="sec-label">7-Day Pattern</div><div class="sec-title">Kick History</div><canvas id="kickChart" style="max-height:180px"></canvas></div>
  <div class="card"><div class="sec-label">Log</div><div class="sec-title">Recent Sessions</div><div id="kickHistory"></div></div>
  <div class="card" style="background:rgba(232,160,168,.06)">
    <div class="sec-title">❓ Kab Doctor Ko Call Karein?</div>
    <div style="font-size:13px;color:var(--muted);line-height:2">
      🔴 2 ghante mein 10 kicks nahi<br>
      🔴 Baby movement suddenly bahut kam ho gayi<br>
      🔴 Kal active tha, aaj bilkul nahi<br>
      🔴 Week 28+ mein har din count karo
    </div>
  </div>
</div>

<!-- CONTRACTION TIMER PAGE -->
<div class="page" id="page-contraction">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Labor</div>
    <div class="sec-title">Contraction Timer ⏱️</div>
  </div>
  <div id="contractionAlert" style="display:none;padding:14px 16px;border-radius:14px;border:2px solid #e05c5c;margin-bottom:14px;font-size:13.5px;font-weight:500;line-height:1.6"></div>
  <div class="card" style="text-align:center;padding:28px">
    <div class="g3" id="contractionStats" style="margin-bottom:20px">
      <div class="stat"><div class="stat-v">0</div><div class="stat-l">Count</div></div>
      <div class="stat"><div class="stat-v">—</div><div class="stat-l">Avg Duration</div></div>
      <div class="stat"><div class="stat-v">—</div><div class="stat-l">Avg Gap</div></div>
    </div>
    <div id="contractionStatus" style="font-size:13px;color:var(--muted);margin-bottom:18px">Tap karo jab contraction shuru ho</div>
    <button id="contractionBtn" class="btn btn-p" onclick="TRACKER.contractionTap()" style="padding:16px 40px;font-size:15px;margin-bottom:14px">🫁 Contraction Shuru</button>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-g" onclick="TRACKER.saveContractionSession()">💾 Save Session</button>
      <button class="btn btn-g" onclick="TRACKER.resetContractions()">🔄 Reset</button>
    </div>
  </div>
  <div class="card"><div class="sec-label">Log</div><div class="sec-title">Contractions</div><div id="contractionList"></div></div>
  <div class="card" style="background:rgba(232,160,168,.06)">
    <div class="sec-title">📏 5-1-1 Rule</div>
    <div style="font-size:13px;color:var(--muted);line-height:2">
      ✅ <strong>Hospital kab jaana hai:</strong><br>
      • Contractions <strong>5 min apart</strong><br>
      • Duration <strong>1 min</strong> each<br>
      • Pattern <strong>1 ghante</strong> se<br>
      • Ya water break ho
    </div>
  </div>
</div>

<!-- BLOOD PRESSURE PAGE -->
<div class="page" id="page-bp">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Health</div>
    <div class="sec-title">BP Tracker ❤️ <span class="sync-badge" id="bp-save">☁️ Synced</span></div>
  </div>
  <div id="bpAlert" style="display:none;padding:13px 16px;border-radius:14px;border:2px solid;margin-bottom:14px;font-size:13.5px;font-weight:500;line-height:1.6"></div>
  <div class="card">
    <div class="sec-label">Latest Reading</div>
    <div id="bpLatest" style="text-align:center;padding:8px 0"><p style="color:var(--muted);font-size:13px">Pehli entry karo neeche se.</p></div>
  </div>
  <div class="card">
    <div class="sec-label">Log New Reading</div>
    <div class="g3" style="margin-bottom:10px">
      <div><label>Systolic</label><input type="number" id="bpSys" placeholder="120" min="60" max="220"/></div>
      <div><label>Diastolic</label><input type="number" id="bpDia" placeholder="80" min="40" max="140"/></div>
      <div><label>Pulse</label><input type="number" id="bpPulse" placeholder="72" min="40" max="200"/></div>
    </div>
    <div style="margin-bottom:10px"><label>Notes (optional)</label><input type="text" id="bpNotes" placeholder="Lying down, after walk..."/></div>
    <button class="btn btn-p btn-sm" onclick="TRACKER.addBP()">+ Log BP</button>
  </div>
  <div class="card"><div class="sec-label">Trend</div><div class="sec-title">14-Day Chart</div><canvas id="bpChart" style="max-height:200px"></canvas></div>
  <div class="card"><div class="sec-label">History</div><div class="sec-title">Log</div><div id="bpList"></div></div>
  <div class="card" style="background:#fff5f5">
    <div class="sec-title">⚠️ Preeclampsia Warning Signs</div>
    <div style="font-size:13px;color:var(--muted);line-height:2">
      🔴 BP ≥ 140/90 + severe headache<br>
      🔴 Vision changes / blurring<br>
      🔴 Sudden severe face/hand swelling<br>
      🔴 Upper right abdominal pain<br>
      → <strong>IMMEDIATE hospital emergency!</strong>
    </div>
  </div>
</div>

<!-- BLOOD SUGAR PAGE -->
<div class="page" id="page-sugar">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Health</div>
    <div class="sec-title">Sugar Tracker 🩸 <span class="sync-badge" id="sugar-save">☁️ Synced</span></div>
  </div>
  <div id="sugarAlert" style="display:none;padding:13px 16px;border-radius:14px;border:2px solid;margin-bottom:14px;font-size:13.5px;font-weight:500;line-height:1.6"></div>
  <div class="card">
    <div class="sec-label">Latest Reading</div>
    <div id="sugarLatest" style="text-align:center;padding:8px 0"><p style="color:var(--muted);font-size:13px">Pehli entry karo neeche se.</p></div>
  </div>
  <div class="card">
    <div class="sec-label">Log New Reading</div>
    <div class="g2" style="margin-bottom:10px">
      <div><label>Reading (mmol/L)</label><input type="number" id="sugarVal" placeholder="5.4" step="0.1" min="2" max="30"/></div>
      <div><label>Type</label>
        <select id="sugarType">
          <option value="fasting">Fasting (subah khali pet)</option>
          <option value="post_meal">Post-meal (khaane ke 2 hrs baad)</option>
          <option value="random">Random</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom:10px"><label>Notes (optional)</label><input type="text" id="sugarNotes" placeholder="Before lunch, after walk..."/></div>
    <button class="btn btn-p btn-sm" onclick="TRACKER.addSugar()">+ Log Sugar</button>
    <p style="font-size:12px;color:var(--muted);margin-top:8px">💡 mg/dL mein hai? Divide by 18 karo mmol/L ke liye (e.g. 126 mg/dL = 7.0 mmol/L)</p>
  </div>
  <div class="card"><div class="sec-label">Trend</div><div class="sec-title">14-Day Chart</div><canvas id="sugarChart" style="max-height:200px"></canvas></div>
  <div class="card"><div class="sec-label">History</div><div class="sec-title">Log</div><div id="sugarList"></div></div>
  <div class="card" style="background:rgba(212,168,83,.06)">
    <div class="sec-title">🩺 GDM Normal Ranges</div>
    <div style="font-size:13px;color:var(--muted);line-height:2">
      ✅ Fasting: &lt; 5.3 mmol/L<br>
      ✅ 1hr post-meal: &lt; 7.8 mmol/L<br>
      ✅ 2hr post-meal: &lt; 6.7 mmol/L<br>
      ⚠️ High values → doctor ko immediately batao
    </div>
  </div>
</div>
`;
  if (footer) footer.insertAdjacentHTML('beforebegin', html);
  else document.body.insertAdjacentHTML('beforeend', html);
}

window.TRACKER = {
  kickTap, kickStart, kickStop, initKickCounter,
  contractionTap, resetContractions, saveContractionSession,
  addBP, loadBP, deleteBP,
  addSugar, loadSugar,
  initTrackers,
};
