/**
 * MamaCare — app-baby.js v6.2
 * Baby's First Year Tracker
 * Feed Log | Diaper Log | Baby Sleep | Baby Weight | Vaccinations | Milestones
 */
'use strict';

// ════════════════════════════════════════
// VACCINATION SCHEDULE (India IAP 2023)
// ════════════════════════════════════════
const VACCINE_SCHEDULE = [
  { id:'bcg',       name:'BCG',               age_label:'Birth',         age_days:0,    desc:'TB prevention — left upper arm' },
  { id:'opv0',      name:'OPV 0',             age_label:'Birth',         age_days:0,    desc:'Polio drops — oral' },
  { id:'hepb1',     name:'Hep B 1',           age_label:'Birth',         age_days:0,    desc:'Hepatitis B — right thigh' },
  { id:'opv1',      name:'OPV 1',             age_label:'6 Weeks',       age_days:42,   desc:'Polio drops 1st dose' },
  { id:'penta1',    name:'Pentavalent 1',      age_label:'6 Weeks',       age_days:42,   desc:'DTP+HepB+Hib — thigh' },
  { id:'ipv1',      name:'IPV 1',             age_label:'6 Weeks',       age_days:42,   desc:'Injectable polio 1' },
  { id:'rota1',     name:'Rotavirus 1',        age_label:'6 Weeks',       age_days:42,   desc:'Diarrhea prevention — oral' },
  { id:'pcv1',      name:'PCV 1',             age_label:'6 Weeks',       age_days:42,   desc:'Pneumococcal 1 — thigh' },
  { id:'opv2',      name:'OPV 2',             age_label:'10 Weeks',      age_days:70,   desc:'Polio drops 2nd dose' },
  { id:'penta2',    name:'Pentavalent 2',      age_label:'10 Weeks',      age_days:70,   desc:'DTP+HepB+Hib — thigh' },
  { id:'ipv2',      name:'IPV 2',             age_label:'10 Weeks',      age_days:70,   desc:'Injectable polio 2' },
  { id:'rota2',     name:'Rotavirus 2',        age_label:'10 Weeks',      age_days:70,   desc:'Rotavirus 2nd dose' },
  { id:'opv3',      name:'OPV 3',             age_label:'14 Weeks',      age_days:98,   desc:'Polio drops 3rd dose' },
  { id:'penta3',    name:'Pentavalent 3',      age_label:'14 Weeks',      age_days:98,   desc:'DTP+HepB+Hib — thigh' },
  { id:'ipv3',      name:'IPV 3',             age_label:'14 Weeks',      age_days:98,   desc:'Injectable polio 3' },
  { id:'rota3',     name:'Rotavirus 3',        age_label:'14 Weeks',      age_days:98,   desc:'Rotavirus 3rd dose' },
  { id:'pcv2',      name:'PCV 2',             age_label:'14 Weeks',      age_days:98,   desc:'Pneumococcal 2' },
  { id:'mr1',       name:'MR 1',              age_label:'9 Months',      age_days:270,  desc:'Measles+Rubella — upper arm' },
  { id:'je1',       name:'JE 1',              age_label:'9 Months',      age_days:270,  desc:'Japanese Encephalitis 1' },
  { id:'pcvboost',  name:'PCV Booster',        age_label:'9 Months',      age_days:270,  desc:'Pneumococcal booster' },
  { id:'vitA1',     name:'Vitamin A 1',        age_label:'9 Months',      age_days:270,  desc:'100,000 IU — oral' },
  { id:'mr2',       name:'MR 2 + DTP Boost',  age_label:'16–24 Months',  age_days:540,  desc:'MR 2nd dose + DTP booster' },
  { id:'opvboost',  name:'OPV Booster',        age_label:'16–24 Months',  age_days:540,  desc:'Polio booster' },
  { id:'typhoid',   name:'Typhoid Conjugate',  age_label:'9–12 Months',   age_days:300,  desc:'Typhoid — optional but recommended' },
  { id:'hepA1',     name:'Hepatitis A 1',      age_label:'12 Months',     age_days:365,  desc:'Hep A — optional' },
  { id:'varicella', name:'Varicella 1',        age_label:'12–15 Months',  age_days:390,  desc:'Chickenpox — optional' },
];

// ════════════════════════════════════════
// MILESTONES
// ════════════════════════════════════════
const MILESTONE_LIST = [
  { id:'smile',       name:'First Smile',         age:'4–8 weeks',   icon:'😊', category:'social'   },
  { id:'hold_head',   name:'Head Control',         age:'2–4 months',  icon:'🙆', category:'motor'    },
  { id:'giggle',      name:'First Giggle',         age:'3–4 months',  icon:'😄', category:'social'   },
  { id:'roll',        name:'Rolls Over',           age:'4–6 months',  icon:'🔄', category:'motor'    },
  { id:'sits',        name:'Sits Unsupported',     age:'6–8 months',  icon:'🪑', category:'motor'    },
  { id:'babble',      name:'Babbling (baba/mama)', age:'6–9 months',  icon:'🗣️', category:'language' },
  { id:'wave',        name:'Waves Bye-bye',        age:'9–10 months', icon:'👋', category:'social'   },
  { id:'crawl',       name:'Crawling',             age:'8–10 months', icon:'🐛', category:'motor'    },
  { id:'pincer',      name:'Pincer Grasp',         age:'9–10 months', icon:'🤌', category:'motor'    },
  { id:'stand',       name:'Pulls to Stand',       age:'10–12 months',icon:'🧍', category:'motor'    },
  { id:'first_word',  name:'First Word',           age:'10–14 months',icon:'💬', category:'language' },
  { id:'first_step',  name:'First Steps',          age:'11–14 months',icon:'👣', category:'motor'    },
  { id:'first_food',  name:'First Solid Food',     age:'~6 months',   icon:'🥣', category:'feeding'  },
  { id:'tooth',       name:'First Tooth',          age:'6–10 months', icon:'🦷', category:'physical' },
  { id:'recognize',   name:'Recognizes Face',      age:'1–3 months',  icon:'👀', category:'social'   },
];

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
let babyDOB = null; // date of birth string
let vaccineTaken = {}; // { vaccine_id: { date, batch, hospital } }
let milestonesDone = {}; // { milestone_id: { date, note, photo_url } }
let babyWeightChart = null;
let babySleepChart = null;

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
async function initBaby() {
  if (!window.user) return;
  // Load profile for DOB
  const { data: prof } = await window.supa.from('user_profile').select('baby_dob,baby_name,baby_gender').eq('id', window.user.id).maybeSingle();
  if (prof?.baby_dob) {
    babyDOB = prof.baby_dob;
    updateBabyAgeDisplay();
  }
  await loadVaccinations();
  await loadMilestones();
  await loadBabyWeights();
  await loadBabySleepLogs();
  renderBabyFeedLog();
  renderBabyDiaperLog();
  addBabyTabs();
}

function updateBabyAgeDisplay() {
  if (!babyDOB) return;
  const days = Math.floor((new Date() - new Date(babyDOB)) / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const el = document.getElementById('babyAgeDisplay');
  if (el) el.textContent = months >= 1 ? `${months} months, ${days - Math.floor(months*30.44)} days old` : `${weeks} weeks, ${days % 7} days old`;
}

// ════════════════════════════════════════
// FEED LOG
// ════════════════════════════════════════
async function addBabyFeed() {
  if (!window.user || !babyDOB) { alert('Baby ka DOB pehle set karo'); return; }
  const type     = document.getElementById('feedType').value;
  const side     = document.getElementById('feedSide')?.value || null;
  const duration = parseInt(document.getElementById('feedDuration').value) || null;
  const amount   = parseFloat(document.getElementById('feedAmount').value) || null;
  await window.supa.from('baby_feeds').insert({
    user_id: window.user.id,
    feed_type: type,
    side,
    duration_min: duration,
    amount_ml: amount,
    fed_at: new Date().toISOString(),
  });
  document.getElementById('feedDuration').value = '';
  document.getElementById('feedAmount').value = '';
  renderBabyFeedLog();
  flashBaby('feed-save');
}

async function renderBabyFeedLog() {
  if (!window.user || !babyDOB) return;
  const today = new Date().toISOString().split('T')[0];
  const { data } = await window.supa.from('baby_feeds').select('*').eq('user_id', window.user.id)
    .gte('fed_at', today + 'T00:00:00').order('fed_at', { ascending: false });
  const el = document.getElementById('babyFeedList');
  if (!el) return;
  const list = data || [];
  // Stats
  const breastCount  = list.filter(f => f.feed_type === 'breast').length;
  const bottleTotal  = list.reduce((a,f) => a + (f.amount_ml || 0), 0);
  document.getElementById('feedStatsToday').innerHTML = `
    <div class="stat"><div class="stat-v">${list.length}</div><div class="stat-l">Feeds Today</div></div>
    <div class="stat"><div class="stat-v">${breastCount}</div><div class="stat-l">Breast</div></div>
    <div class="stat"><div class="stat-v">${bottleTotal || '—'}</div><div class="stat-l">Total ml</div></div>`;
  el.innerHTML = list.length ? list.slice(0,10).map(f => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 13px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px">
      <span>${f.feed_type === 'breast' ? '🤱' : '🍼'} ${f.feed_type}</span>
      <span style="color:var(--muted)">${f.side ? f.side + ' side · ' : ''}${f.duration_min ? f.duration_min + 'min' : ''}${f.amount_ml ? f.amount_ml + 'ml' : ''}</span>
      <span style="font-size:11px;color:var(--muted)">${new Date(f.fed_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
    </div>`).join('') : '<p style="font-size:13px;color:var(--muted);text-align:center;padding:12px">Aaj koi feed log nahi.</p>';
}

// ════════════════════════════════════════
// DIAPER LOG
// ════════════════════════════════════════
async function addBabyDiaper(type) {
  if (!window.user || !babyDOB) { alert('Baby DOB set karo pehle'); return; }
  await window.supa.from('baby_diapers').insert({ user_id: window.user.id, diaper_type: type, changed_at: new Date().toISOString() });
  renderBabyDiaperLog();
  // Haptic
  if (navigator.vibrate) navigator.vibrate(60);
}

async function renderBabyDiaperLog() {
  if (!window.user || !babyDOB) return;
  const today = new Date().toISOString().split('T')[0];
  const { data } = await window.supa.from('baby_diapers').select('*').eq('user_id', window.user.id)
    .gte('changed_at', today + 'T00:00:00').order('changed_at', { ascending: false });
  const list = data || [];
  const wet   = list.filter(d => d.diaper_type === 'wet').length;
  const dirty = list.filter(d => d.diaper_type === 'dirty').length;
  const mixed = list.filter(d => d.diaper_type === 'mixed').length;
  const el = document.getElementById('diaperStats');
  if (el) el.innerHTML = `
    <div class="stat"><div class="stat-v">${list.length}</div><div class="stat-l">Total</div></div>
    <div class="stat"><div class="stat-v">${wet + mixed}</div><div class="stat-l">💧 Wet</div></div>
    <div class="stat"><div class="stat-v">${dirty + mixed}</div><div class="stat-l">💩 Dirty</div></div>`;
  const tip = document.getElementById('diaperTip');
  if (tip) {
    const ageDay = babyDOB ? Math.floor((new Date() - new Date(babyDOB)) / 86400000) : 0;
    const expectedWet = ageDay < 5 ? ageDay + 1 : 6;
    if ((wet + mixed) < expectedWet) tip.textContent = `⚠️ Aaj sirf ${wet+mixed} wet diapers — normal hai ${expectedWet}. Hydration check karo!`;
    else tip.textContent = `✅ Wet diapers normal range mein hain!`;
  }
}

// ════════════════════════════════════════
// BABY SLEEP
// ════════════════════════════════════════
let babySleepStart = null;
async function toggleBabySleep() {
  const btn = document.getElementById('babySleepBtn');
  if (!babySleepStart) {
    babySleepStart = new Date();
    if (btn) { btn.textContent = '☀️ Wake Up!'; btn.style.background = 'linear-gradient(135deg,#d4a853,#e8a0a8)'; }
    document.getElementById('babySleepStatus').textContent = '😴 Baby so raha hai...';
    babySleepTick();
  } else {
    const end  = new Date();
    const dur  = Math.round((end - babySleepStart) / 60000); // minutes
    const isDay = babySleepStart.getHours() >= 7 && babySleepStart.getHours() < 19;
    if (window.user) {
      await window.supa.from('baby_sleeps').insert({
        user_id: window.user.id,
        sleep_start: babySleepStart.toISOString(),
        sleep_end: end.toISOString(),
        duration_min: dur,
        sleep_type: isDay ? 'nap' : 'night',
        sleep_date: babySleepStart.toISOString().split('T')[0],
      });
    }
    babySleepStart = null;
    clearInterval(babySleepInterval);
    if (btn) { btn.textContent = '😴 Sleep Start'; btn.style.background = ''; }
    document.getElementById('babySleepStatus').textContent = `✅ ${dur} minutes logged!`;
    loadBabySleepLogs();
  }
}

let babySleepInterval = null;
function babySleepTick() {
  babySleepInterval = setInterval(() => {
    if (!babySleepStart) { clearInterval(babySleepInterval); return; }
    const elapsed = Math.floor((new Date() - babySleepStart) / 60000);
    document.getElementById('babySleepStatus').textContent = `😴 Soo raha hai... ${elapsed} min`;
  }, 30000);
}

async function loadBabySleepLogs() {
  if (!window.user) return;
  const { data } = await window.supa.from('baby_sleeps').select('*').eq('user_id', window.user.id)
    .order('sleep_date', { ascending: false }).limit(14);
  renderBabySleepUI(data || []);
}

function renderBabySleepUI(logs) {
  // Today totals
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.sleep_date === today);
  const totalMin = todayLogs.reduce((a,l) => a + (l.duration_min||0), 0);
  const nightMin = todayLogs.filter(l=>l.sleep_type==='night').reduce((a,l)=>a+(l.duration_min||0),0);
  const napMin   = todayLogs.filter(l=>l.sleep_type==='nap').reduce((a,l)=>a+(l.duration_min||0),0);
  const statsEl  = document.getElementById('babySleepStats');
  if (statsEl) statsEl.innerHTML = `
    <div class="stat"><div class="stat-v">${Math.floor(totalMin/60)}h ${totalMin%60}m</div><div class="stat-l">Total Today</div></div>
    <div class="stat"><div class="stat-v">${Math.floor(nightMin/60)}h</div><div class="stat-l">🌙 Night</div></div>
    <div class="stat"><div class="stat-v">${Math.floor(napMin/60)}h</div><div class="stat-l">☀️ Naps</div></div>`;
  const logEl = document.getElementById('babySleepLog');
  if (logEl) logEl.innerHTML = logs.slice(0,8).map(l => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 13px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px">
      <span>${l.sleep_type === 'nap' ? '☀️ Nap' : '🌙 Night'}</span>
      <span style="font-weight:600">${Math.floor(l.duration_min/60)}h ${l.duration_min%60}m</span>
      <span style="font-size:11px;color:var(--muted)">${new Date(l.sleep_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
    </div>`).join('');
  // Chart
  const ctx = document.getElementById('babySleepChart')?.getContext('2d');
  if (!ctx || logs.length < 2) return;
  if (babySleepChart) { babySleepChart.destroy(); babySleepChart = null; }
  const last7 = logs.slice(0,7).reverse();
  babySleepChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: last7.map(l => new Date(l.sleep_date).toLocaleDateString('en-IN',{day:'numeric',month:'numeric'})),
      datasets: [{
        label: 'Sleep (hours)',
        data: last7.map(l => Math.round(l.duration_min/6)/10),
        backgroundColor: 'rgba(184,168,208,.75)',
        borderRadius: 8,
      }]
    },
    options: { responsive:true, plugins:{legend:{display:false}}, scales:{y:{ticks:{font:{size:11}}},x:{ticks:{font:{size:10}}}} }
  });
}

// ════════════════════════════════════════
// BABY WEIGHT (WHO curve)
// ════════════════════════════════════════
async function addBabyWeight() {
  if (!window.user) return;
  const wt = parseFloat(document.getElementById('babyWtInput').value);
  const ht = parseFloat(document.getElementById('babyHtInput').value) || null;
  if (!wt || wt < 1 || wt > 30) { alert('Valid weight daalo (1-30 kg)'); return; }
  const days = babyDOB ? Math.floor((new Date() - new Date(babyDOB)) / 86400000) : null;
  await window.supa.from('baby_weights').insert({
    user_id: window.user.id, weight_kg: wt, height_cm: ht,
    age_days: days, logged_at: new Date().toISOString(),
  });
  document.getElementById('babyWtInput').value = '';
  document.getElementById('babyHtInput').value = '';
  loadBabyWeights();
  flashBaby('babywt-save');
}

async function loadBabyWeights() {
  if (!window.user) return;
  const { data } = await window.supa.from('baby_weights').select('*').eq('user_id', window.user.id)
    .order('logged_at').limit(24);
  renderBabyWeightChart(data || []);
}

function renderBabyWeightChart(wts) {
  const ctx = document.getElementById('babyWeightChart')?.getContext('2d');
  if (!ctx) return;
  if (babyWeightChart) { babyWeightChart.destroy(); babyWeightChart = null; }
  if (!wts.length) return;
  // WHO median reference points (age_months vs kg) — boys median
  const WHO_MEDIAN = [[0,3.3],[1,4.5],[2,5.6],[3,6.4],[4,7.0],[6,7.9],[9,9.2],[12,10.2],[18,11.5],[24,12.5]];
  babyWeightChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Baby Weight',
          data: wts.map(w => ({ x: Math.round((w.age_days||0)/30.44), y: w.weight_kg })),
          borderColor: '#e8a0a8', backgroundColor: 'rgba(232,160,168,.12)',
          tension:.4, pointRadius:5, fill:true,
        },
        {
          label: 'WHO Median',
          data: WHO_MEDIAN.map(([x,y]) => ({ x, y })),
          borderColor: '#6ab89a', borderDash: [6,4],
          tension:.3, pointRadius:0, fill:false,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { type:'linear', title:{ display:true, text:'Age (months)', font:{size:11} }, ticks:{font:{size:10}} },
        y: { title:{ display:true, text:'Weight (kg)', font:{size:11} }, ticks:{font:{size:10}} }
      },
      plugins: { legend:{ position:'top', labels:{font:{size:11}} } }
    }
  });
}

// ════════════════════════════════════════
// VACCINATIONS
// ════════════════════════════════════════
async function loadVaccinations() {
  if (!window.user) return;
  const { data } = await window.supa.from('baby_vaccinations').select('*').eq('user_id', window.user.id);
  vaccineTaken = {};
  (data || []).forEach(v => { vaccineTaken[v.vaccine_id] = v; });
  renderVaccinations();
}

function renderVaccinations() {
  const el = document.getElementById('vaccinationList');
  if (!el) return;
  const today = new Date();
  const dob   = babyDOB ? new Date(babyDOB) : null;
  // Group by age label
  const groups = {};
  VACCINE_SCHEDULE.forEach(v => {
    if (!groups[v.age_label]) groups[v.age_label] = [];
    groups[v.age_label].push(v);
  });
  el.innerHTML = Object.entries(groups).map(([ageLabel, vaccines]) => {
    const dueDate = dob ? new Date(dob.getTime() + vaccines[0].age_days * 86400000) : null;
    const isPast  = dueDate && dueDate < today;
    const isDue   = dueDate && !isPast;
    const allDone = vaccines.every(v => vaccineTaken[v.id]);
    return `
      <div class="card" style="border-left:3px solid ${allDone ? 'var(--green)' : isPast ? '#e05c5c' : 'var(--blush)'}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
          <div style="font-weight:600;font-size:14px">${ageLabel}</div>
          <div style="display:flex;align-items:center;gap:8px">
            ${dueDate ? `<span style="font-size:11px;color:var(--muted)">${dueDate.toLocaleDateString('hi-IN',{day:'numeric',month:'short',year:'numeric'})}</span>` : ''}
            <span class="pill ${allDone ? 'pill-g' : isPast ? 'pill-r' : 'pill-b'}">${allDone ? '✅ Done' : isPast ? '⚠️ Overdue' : '📅 Upcoming'}</span>
          </div>
        </div>
        ${vaccines.map(v => {
          const done = vaccineTaken[v.id];
          return `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:${done ? '#e8f5e9' : 'white'};border-radius:10px;margin-bottom:5px">
            <input type="checkbox" ${done ? 'checked' : ''} onchange="BABY.toggleVaccine('${v.id}',this)" style="width:15px;height:15px;accent-color:var(--green);cursor:pointer;flex-shrink:0"/>
            <div style="flex:1">
              <div style="font-weight:600;font-size:13px">${v.name}</div>
              <div style="font-size:11.5px;color:var(--muted)">${v.desc}</div>
              ${done ? `<div style="font-size:11px;color:var(--green);margin-top:2px">✅ ${done.given_date} ${done.hospital ? '· '+done.hospital : ''}</div>` : ''}
            </div>
            ${!done ? `<button onclick="BABY.showVaccineForm('${v.id}')" class="btn btn-p btn-sm" style="font-size:11px;padding:5px 10px">Mark Done</button>` : ''}
          </div>`;
        }).join('')}
      </div>`;
  }).join('');
}

async function toggleVaccine(id, checkbox) {
  if (!window.user) return;
  if (checkbox.checked) {
    showVaccineForm(id);
  } else {
    await window.supa.from('baby_vaccinations').delete().eq('user_id', window.user.id).eq('vaccine_id', id);
    delete vaccineTaken[id];
    renderVaccinations();
  }
}

function showVaccineForm(id) {
  const vax = VACCINE_SCHEDULE.find(v => v.id === id);
  if (!vax) return;
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;z-index:3000;background:rgba(74,44,42,.5);display:flex;align-items:flex-end;justify-content:center;padding:16px';
  modal.innerHTML = `
    <div style="background:white;border-radius:24px 24px 20px 20px;width:100%;max-width:440px;padding:24px;animation:slideUp .3s ease">
      <div style="font-weight:600;font-size:15px;margin-bottom:16px">✅ ${vax.name} Mark as Done</div>
      <div style="margin-bottom:10px"><label>Date Given</label><input type="date" id="vaxDate" value="${new Date().toISOString().split('T')[0]}"/></div>
      <div style="margin-bottom:10px"><label>Hospital/Clinic</label><input type="text" id="vaxHosp" placeholder="Apollo, PHC..."/></div>
      <div style="margin-bottom:16px"><label>Batch Number (optional)</label><input type="text" id="vaxBatch" placeholder="BN-XXXX"/></div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-g" style="flex:1" onclick="this.closest('div[style]').remove()">Cancel</button>
        <button class="btn btn-p" style="flex:2" onclick="BABY.saveVaccine('${id}',this)">Save ✅</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function saveVaccine(id, btn) {
  if (!window.user) return;
  const date  = document.getElementById('vaxDate').value;
  const hosp  = document.getElementById('vaxHosp').value;
  const batch = document.getElementById('vaxBatch').value;
  btn.disabled = true;
  await window.supa.from('baby_vaccinations').upsert({
    user_id: window.user.id, vaccine_id: id, given_date: date, hospital: hosp, batch_number: batch,
  }, { onConflict: 'user_id,vaccine_id' });
  vaccineTaken[id] = { given_date: date, hospital: hosp, batch_number: batch };
  document.querySelector('div[style*="position:fixed;inset:0;z-index:3000"]')?.remove();
  renderVaccinations();
}

// ════════════════════════════════════════
// MILESTONES
// ════════════════════════════════════════
async function loadMilestones() {
  if (!window.user) return;
  const { data } = await window.supa.from('baby_milestones').select('*').eq('user_id', window.user.id);
  milestonesDone = {};
  (data || []).forEach(m => { milestonesDone[m.milestone_id] = m; });
  renderMilestones();
}

function renderMilestones() {
  const el = document.getElementById('milestoneGrid');
  if (!el) return;
  el.innerHTML = MILESTONE_LIST.map(m => {
    const done = milestonesDone[m.id];
    return `
      <div onclick="BABY.toggleMilestone('${m.id}')" style="background:${done ? 'linear-gradient(135deg,rgba(106,184,154,.12),rgba(235,248,240,.6))' : 'white'};border-radius:18px;padding:16px;border:1.5px solid ${done ? 'var(--green)' : 'rgba(232,160,168,.15)'};cursor:pointer;transition:.2s;text-align:center">
        <div style="font-size:32px;margin-bottom:6px">${m.icon}</div>
        <div style="font-weight:600;font-size:13px;margin-bottom:3px">${m.name}</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:8px">${m.age}</div>
        ${done
          ? `<div style="font-size:11px;color:var(--green);font-weight:600">✅ ${done.milestone_date}</div>`
          : `<div style="font-size:11px;color:var(--muted)">Tap to mark done</div>`}
      </div>`;
  }).join('');
}

async function toggleMilestone(id) {
  if (!window.user) return;
  if (milestonesDone[id]) {
    if (!confirm('Ye milestone un-mark karein?')) return;
    await window.supa.from('baby_milestones').delete().eq('user_id', window.user.id).eq('milestone_id', id);
    delete milestonesDone[id];
  } else {
    const ms = MILESTONE_LIST.find(m => m.id === id);
    const date = prompt(`${ms?.icon} ${ms?.name} — Date (YYYY-MM-DD):`, new Date().toISOString().split('T')[0]);
    if (!date) return;
    await window.supa.from('baby_milestones').upsert({ user_id: window.user.id, milestone_id: id, milestone_date: date }, { onConflict: 'user_id,milestone_id' });
    milestonesDone[id] = { milestone_date: date };
    // Celebrate!
    showMilestoneCelebration(ms);
  }
  renderMilestones();
}

function showMilestoneCelebration(ms) {
  if (!ms) return;
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:5000;background:white;border-radius:24px;padding:32px;text-align:center;animation:fadeUp .4s ease;box-shadow:0 20px 60px rgba(200,100,100,.25);max-width:300px;width:90%';
  div.innerHTML = `<div style="font-size:60px;margin-bottom:12px">${ms.icon}</div><div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;margin-bottom:8px">🎉 ${ms.name}!</div><p style="font-size:13px;color:var(--muted)">Aapke baby ne yeh milestone achieve kiya!</p><button class="btn btn-p" style="margin-top:14px;width:100%" onclick="this.closest('div[style]').remove()">Celebrate! 🎊</button>`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 5000);
}

// ════════════════════════════════════════
// BABY DOB SETUP
// ════════════════════════════════════════
async function saveBabyDOB() {
  if (!window.user) return;
  const dob    = document.getElementById('babyDOBInput').value;
  const name   = document.getElementById('babyNameInput').value.trim();
  const gender = document.getElementById('babyGenderInput').value;
  if (!dob) { alert('Baby ki DOB daalo'); return; }
  babyDOB = dob;
  await window.supa.from('user_profile').update({ baby_dob: dob, baby_name: name || null, baby_gender: gender || null }).eq('id', window.user.id);
  updateBabyAgeDisplay();
  document.getElementById('babySetupCard').style.display = 'none';
  document.getElementById('babyDashboard').style.display = 'block';
  await loadVaccinations();
  await loadMilestones();
  await loadBabyWeights();
  loadBabySleepLogs();
  renderBabyFeedLog();
  renderBabyDiaperLog();
}

// ════════════════════════════════════════
// VACCINATION PDF
// ════════════════════════════════════════
function printVaccinationCard() {
  const done = VACCINE_SCHEDULE.filter(v => vaccineTaken[v.id]);
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Vaccination Card</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;max-width:600px;margin:0 auto;color:#333}
    h2{color:#e8a0a8;border-bottom:2px solid #e8a0a8;padding-bottom:8px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{background:#fce8e8;padding:8px;text-align:left}td{padding:8px;border-bottom:1px solid #f0e0e0}
    @media print{button{display:none}}</style></head><body>
    <h2>🌸 Baby Vaccination Card — MamaCare</h2>
    <p style="font-size:13px;color:#666">Baby DOB: ${babyDOB || '—'} | Generated: ${new Date().toLocaleDateString('en-IN')}</p>
    <table><tr><th>Vaccine</th><th>Age</th><th>Date Given</th><th>Hospital</th><th>Batch</th></tr>
    ${done.map(v => `<tr><td>${v.name}</td><td>${v.age_label}</td><td>${vaccineTaken[v.id].given_date}</td><td>${vaccineTaken[v.id].hospital||'—'}</td><td>${vaccineTaken[v.id].batch_number||'—'}</td></tr>`).join('')}
    </table>
    <button onclick="window.print()" style="margin-top:16px;padding:10px 24px;background:#e8a0a8;border:none;border-radius:50px;cursor:pointer;color:white;font-weight:600">🖨️ Print</button>
    </body></html>`);
  w.document.close();
}

// ════════════════════════════════════════
// NAV + PAGE INJECT
// ════════════════════════════════════════
function addBabyTabs() {
  const topTabs = document.getElementById('topTabs');
  if (topTabs && !document.querySelector('[data-page="baby"]')) {
    const btn = document.createElement('button');
    btn.className = 'top-tab'; btn.dataset.page = 'baby'; btn.textContent = '👶 Baby';
    btn.addEventListener('click', () => { if (window.MC?.goTo) window.MC.goTo('baby'); });
    topTabs.insertBefore(btn, topTabs.firstChild);
  }
  const moreGrid = document.querySelector('#moreMenu .more-grid');
  if (moreGrid && !document.querySelector('#moreMenu [data-page="baby"]')) {
    ['baby-feed','baby-sleep','vaccines','milestones'].forEach((page, i) => {
      const icons   = ['🍼','😴','💉','🏆'];
      const labels  = ['Feed Log','Baby Sleep','Vaccines','Milestones'];
      const div = document.createElement('div');
      div.className = 'more-item'; div.dataset.page = page;
      div.innerHTML = `<div class="mi-icon">${icons[i]}</div><div class="mi-label">${labels[i]}</div>`;
      div.addEventListener('click', () => { document.getElementById('moreMenu').style.display='none'; if(window.MC?.goTo) window.MC.goTo(page); });
      moreGrid.appendChild(div);
    });
  }
}

function flashBaby(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

document.addEventListener('DOMContentLoaded', () => {
  injectBabyPages();
});

function injectBabyPages() {
  if (document.getElementById('page-baby')) return;
  const footer = document.querySelector('footer');
  const html = `
<!-- BABY HUB PAGE -->
<div class="page" id="page-baby">
  <div style="padding:20px 0 8px">
    <div class="sec-label">After Delivery</div>
    <div class="sec-title">Baby's First Year 👶</div>
  </div>

  <!-- SETUP -->
  <div class="card" id="babySetupCard">
    <div style="text-align:center;padding:14px 0 20px">
      <div style="font-size:48px;margin-bottom:12px">👶</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:8px">Baby ka Setup Karo</div>
      <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:20px">Delivery ho gayi? Baby tracker shuru karo!</p>
    </div>
    <div class="g2" style="margin-bottom:10px">
      <div><label>Baby ka Naam</label><input type="text" id="babyNameInput" placeholder="Arjun, Anaya..."/></div>
      <div><label>Date of Birth</label><input type="date" id="babyDOBInput"/></div>
    </div>
    <div style="margin-bottom:14px"><label>Gender</label>
      <select id="babyGenderInput"><option value="">-- Select --</option><option value="boy">👦 Boy</option><option value="girl">👧 Girl</option></select>
    </div>
    <button class="btn btn-p" style="width:100%" onclick="BABY.saveBabyDOB()">🌸 Baby Tracker Shuru Karo</button>
  </div>

  <!-- DASHBOARD -->
  <div id="babyDashboard" style="display:none">
    <div class="card" style="background:linear-gradient(135deg,rgba(232,160,168,.12),rgba(247,196,168,.08));text-align:center;padding:22px">
      <div style="font-size:44px;margin-bottom:8px">👶</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:4px" id="babyAgeDisplay">Loading...</div>
    </div>
    <div class="g2" style="margin-bottom:18px">
      <div onclick="MC.goTo('baby-feed')" class="card" style="cursor:pointer;text-align:center;padding:20px">
        <div style="font-size:32px">🍼</div><div style="font-size:13px;font-weight:500;margin-top:6px">Feed Log</div>
      </div>
      <div onclick="MC.goTo('baby-sleep')" class="card" style="cursor:pointer;text-align:center;padding:20px">
        <div style="font-size:32px">😴</div><div style="font-size:13px;font-weight:500;margin-top:6px">Sleep</div>
      </div>
      <div onclick="MC.goTo('vaccines')" class="card" style="cursor:pointer;text-align:center;padding:20px">
        <div style="font-size:32px">💉</div><div style="font-size:13px;font-weight:500;margin-top:6px">Vaccines</div>
      </div>
      <div onclick="MC.goTo('milestones')" class="card" style="cursor:pointer;text-align:center;padding:20px">
        <div style="font-size:32px">🏆</div><div style="font-size:13px;font-weight:500;margin-top:6px">Milestones</div>
      </div>
    </div>
    <!-- Diaper counter -->
    <div class="card">
      <div class="sec-label">Diaper Count</div>
      <div class="sec-title">Aaj ke Diapers 👶 <span class="sync-badge" id="diaper-save">☁️ Synced</span></div>
      <div class="g3" id="diaperStats" style="margin-bottom:14px"></div>
      <div id="diaperTip" style="font-size:12.5px;color:var(--muted);margin-bottom:14px"></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-p" onclick="BABY.addBabyDiaper('wet')" style="flex:1">💧 Wet</button>
        <button class="btn btn-p" onclick="BABY.addBabyDiaper('dirty')" style="flex:1">💩 Dirty</button>
        <button class="btn btn-g" onclick="BABY.addBabyDiaper('mixed')" style="flex:1">💧💩 Both</button>
      </div>
    </div>
    <!-- Baby weight -->
    <div class="card">
      <div class="sec-label">Growth</div>
      <div class="sec-title">Baby Weight 📈 <span class="sync-badge" id="babywt-save">☁️ Synced</span></div>
      <div class="g2" style="margin-bottom:10px">
        <div><label>Weight (kg)</label><input type="number" id="babyWtInput" placeholder="3.5" step="0.1" min="1" max="30"/></div>
        <div><label>Height (cm)</label><input type="number" id="babyHtInput" placeholder="50" step="0.5" min="30" max="120"/></div>
      </div>
      <button class="btn btn-p btn-sm" onclick="BABY.addBabyWeight()">+ Log Weight</button>
      <canvas id="babyWeightChart" style="max-height:220px;margin-top:14px"></canvas>
    </div>
  </div>
</div>

<!-- FEED LOG PAGE -->
<div class="page" id="page-baby-feed">
  <div style="padding:20px 0 8px"><div class="sec-label">Baby Nutrition</div><div class="sec-title">Feed Log 🍼 <span class="sync-badge" id="feed-save">☁️ Synced</span></div></div>
  <div class="g3" id="feedStatsToday" style="margin-bottom:14px"></div>
  <div class="card">
    <div class="sec-label">Log Feed</div>
    <div class="g2" style="margin-bottom:10px">
      <div><label>Type</label>
        <select id="feedType">
          <option value="breast">🤱 Breast</option>
          <option value="bottle_breast">🍼 Bottle (BM)</option>
          <option value="formula">🍼 Formula</option>
          <option value="solid">🥣 Solid</option>
        </select>
      </div>
      <div><label>Side</label>
        <select id="feedSide"><option value="">—</option><option value="left">Left</option><option value="right">Right</option><option value="both">Both</option></select>
      </div>
    </div>
    <div class="g2" style="margin-bottom:10px">
      <div><label>Duration (min)</label><input type="number" id="feedDuration" placeholder="15"/></div>
      <div><label>Amount (ml)</label><input type="number" id="feedAmount" placeholder="90"/></div>
    </div>
    <button class="btn btn-p btn-sm" onclick="BABY.addBabyFeed()">+ Log Feed</button>
  </div>
  <div class="card"><div class="sec-label">Today</div><div class="sec-title">Feed History</div><div id="babyFeedList"></div></div>
</div>

<!-- BABY SLEEP PAGE -->
<div class="page" id="page-baby-sleep">
  <div style="padding:20px 0 8px"><div class="sec-label">Baby Rest</div><div class="sec-title">Baby Sleep Tracker 😴</div></div>
  <div class="card" style="text-align:center;padding:28px">
    <div class="g3" id="babySleepStats" style="margin-bottom:18px"></div>
    <div id="babySleepStatus" style="font-size:13px;color:var(--muted);margin-bottom:16px">Session start karo jab baby so jaye</div>
    <button id="babySleepBtn" class="btn btn-p" onclick="BABY.toggleBabySleep()" style="padding:14px 36px;font-size:14px">😴 Sleep Start</button>
  </div>
  <div class="card"><canvas id="babySleepChart" style="max-height:180px"></canvas></div>
  <div class="card"><div class="sec-label">Log</div><div class="sec-title">Sleep History</div><div id="babySleepLog"></div></div>
</div>

<!-- VACCINES PAGE -->
<div class="page" id="page-vaccines">
  <div style="padding:20px 0 8px;display:flex;justify-content:space-between;align-items:flex-end">
    <div><div class="sec-label">Immunization</div><div class="sec-title">Vaccination Tracker 💉</div></div>
    <button class="btn btn-g btn-sm" onclick="BABY.printVaccinationCard()">🖨️ Print Card</button>
  </div>
  <div class="card" style="background:rgba(106,184,154,.06)">
    <p style="font-size:13px;color:var(--muted);line-height:1.7">📋 IAP 2023 schedule. Checkmark lagao jab vaccine ho jaaye — date, hospital, batch note karo.</p>
  </div>
  <div id="vaccinationList"></div>
</div>

<!-- MILESTONES PAGE -->
<div class="page" id="page-milestones">
  <div style="padding:20px 0 8px"><div class="sec-label">Development</div><div class="sec-title">Baby Milestones 🏆</div></div>
  <div class="card" style="background:linear-gradient(135deg,rgba(212,168,83,.08),rgba(232,160,168,.06))">
    <p style="font-size:13px;color:var(--muted);line-height:1.7">🌟 Har milestone ek celebration hai! Tap karo mark karne ke liye. Dates save ho jaati hain.</p>
  </div>
  <div id="milestoneGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px"></div>
</div>
`;
  if (footer) footer.insertAdjacentHTML('beforebegin', html);
  else document.body.insertAdjacentHTML('beforeend', html);
}

window.BABY = {
  initBaby, saveBabyDOB, updateBabyAgeDisplay,
  addBabyFeed, renderBabyFeedLog,
  addBabyDiaper, renderBabyDiaperLog,
  toggleBabySleep, loadBabySleepLogs,
  addBabyWeight, loadBabyWeights,
  loadVaccinations, toggleVaccine, showVaccineForm, saveVaccine, printVaccinationCard,
  loadMilestones, toggleMilestone,
};
