/**
 * MamaCare — app-india.js v6.2
 * India-specific features:
 *  1. Government Schemes Guide
 *  2. Ayurvedic & Home Remedies
 *  3. Offline Emergency Card
 *  4. Daily Symptom Diary
 *  5. Global Search Bar
 */
'use strict';

// ════════════════════════════════════════
// 1. GOVERNMENT SCHEMES
// ════════════════════════════════════════
const GOV_SCHEMES = [
  {
    name: 'PMMVY — Pradhan Mantri Matru Vandana Yojana',
    icon: '🏛️',
    benefit: '₹5,000 cash benefit in 3 installments for first live birth',
    eligibility: 'All pregnant & lactating women (first live birth) registered at AWC/ANM',
    howto: [
      'Nearest Anganwadi Center (AWC) ya PHC mein jaao',
      'Form 1-A bharo (bank account zaroori)',
      '1st installment: LMP registration pe (₹1000)',
      '2nd installment: Pehli antenatal checkup pe (₹2000)',
      '3rd installment: Child birth registration + first vaccination pe (₹2000)',
    ],
    docs: ['Aadhar Card', 'Bank Passbook', 'MCP Card', 'Ration Card (optional)'],
    link: 'https://pmmvy.wcd.gov.in',
    badge: '₹5,000',
    color: '#6ab89a',
  },
  {
    name: 'JSY — Janani Suraksha Yojana',
    icon: '🏥',
    benefit: 'Cash incentive for institutional delivery + free delivery services',
    eligibility: 'BPL, SC/ST women in rural areas; all women in LPS states (UP, Bihar, MP, Raj, Jharkhand, Odisha, J&K, UK, Chhattisgarh)',
    howto: [
      'Government hospital ya empanelled private hospital mein deliver karo',
      'ANM/ASHA worker se contact karo pehle se',
      'Rural: ₹1400 (LPS) / ₹700 (HPS) cash benefit',
      'Urban: ₹1000 (LPS) / ₹600 (HPS)',
      'ASHA ko bhi ₹600-300 incentive milti hai assistance ke liye',
    ],
    docs: ['Aadhar Card', 'BPL Card (if applicable)', 'Bank Account'],
    link: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309',
    badge: '₹1400',
    color: '#7ab8d4',
  },
  {
    name: 'PM-JAY — Ayushman Bharat',
    icon: '💊',
    benefit: '₹5 lakh/year health insurance per family for secondary & tertiary care',
    eligibility: 'SECC 2011 database mein listed BPL families',
    howto: [
      'pmjay.gov.in pe check karo ya helpline 14555 pe call karo',
      'Nearest Common Service Center (CSC) ya empanelled hospital mein verification karo',
      'Aadhar se e-card generate hoga',
      'Card lekar kisi bhi empanelled hospital mein cashless treatment lo',
    ],
    docs: ['Aadhar Card', 'Ration Card', 'SECC verification'],
    link: 'https://pmjay.gov.in',
    badge: '₹5L/year',
    color: '#e8a0a8',
  },
  {
    name: 'JSSK — Janani Shishu Suraksha Karyakram',
    icon: '🌸',
    benefit: 'FREE delivery, C-section, medicines, diagnostics, blood, diet & transport at govt hospitals',
    eligibility: 'All pregnant women delivering at government hospitals',
    howto: [
      'Sirf government hospital mein jaao — sab kuch free hai',
      'Free normal & C-section delivery',
      'Free medicines, blood transfusion, diagnostics',
      'Free diet (3 days normal, 7 days C-section)',
      'Free transport (home → hospital → home)',
      'Newborn sick care bhi free (30 days tak)',
    ],
    docs: ['Koi documents required nahi — sab free'],
    link: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=842&lid=310',
    badge: 'FREE',
    color: '#d4a853',
  },
  {
    name: 'PMGKAY — Free Ration',
    icon: '🌾',
    benefit: '5 kg free grain per person per month for Antyodaya/PHH card holders',
    eligibility: 'Ration card holders',
    howto: [
      'Nearest PDS shop se collect karo',
      'Ration card dikhao',
      'Pregnancy mein extra iron & folic acid bhi Anganwadi se milti hai',
    ],
    docs: ['Ration Card', 'Aadhar Card'],
    link: 'https://dfpd.gov.in',
    badge: 'Free Ration',
    color: '#b8a8d0',
  },
  {
    name: 'Iron & Folic Acid Supplementation',
    icon: '💊',
    benefit: 'FREE Iron-Folic Acid tablets throughout pregnancy via Anganwadi/ANM',
    eligibility: 'All pregnant women',
    howto: [
      'Nearest Anganwadi Center ya PHC mein register karo',
      '180 IFA tablets free milti hain',
      'Calcium tablets bhi free available',
      'MCP (Mother & Child Protection) card banwao — ye important record hai',
    ],
    docs: ['Aadhar Card'],
    link: '',
    badge: 'FREE',
    color: '#6ab89a',
  },
];

// ════════════════════════════════════════
// 2. AYURVEDIC TIPS
// ════════════════════════════════════════
const AYURVEDIC_TIPS = {
  1: {
    title: 'Pehli Trimester (Week 1–13)',
    safe: [
      { name: 'Adrak (Ginger)', use: 'Nausea ke liye — 1 inch fresh ginger chai mein ya paani mein ubal ke. Clinical evidence confirmed.', icon: '🫚' },
      { name: 'Saunf (Fennel)', use: 'Digestive — 1 tsp seeds paani mein ubal ke peo. Bloating + gas relief.', icon: '🌿' },
      { name: 'Nimbu (Lemon)', use: 'Nausea — lemon smell ya nimbu paani. Safe and effective.', icon: '🍋' },
      { name: 'Coconut Water', use: 'Electrolytes + hydration — khaali pet peo. Natural ORS.', icon: '🥥' },
      { name: 'Mishri + Saunf', use: 'Morning nausea — khali pet 1 tsp mishri + saunf chaba ke khaao.', icon: '🫚' },
    ],
    avoid: [
      { name: 'Papaya (raw/semi-ripe)', reason: 'Latex content — uterine contractions trigger kar sakta hai' },
      { name: 'Pineapple (excess)', reason: 'Bromelain enzyme — in small amounts ok but avoid excess' },
      { name: 'Methi (excess)', reason: 'Uterotonic properties — thoda ok, bahut zyada avoid' },
      { name: 'Kesar (Saffron)', reason: ' 2nd trimester se ½ strand milk mein ok — 1st mein avoid' },
    ],
  },
  2: {
    title: 'Doosri Trimester (Week 14–27)',
    safe: [
      { name: 'Kesar (Saffron)', use: '1-2 strands warm milk mein roz — complexion, mood, immunity. Traditional belief + mild antidepressant properties.', icon: '🌸' },
      { name: 'Haldi (Turmeric)', use: '½ tsp warm milk mein — anti-inflammatory, immunity. Avoid high doses.', icon: '🟡' },
      { name: 'Ajwain (Carom)', use: 'Digestive, gas, heartburn. ½ tsp roasted seeds chew karo.', icon: '🌿' },
      { name: 'Dates (Khajoor)', use: '2-3 roz — natural iron + labor preparation. Week 36+ mein cervical ripening evidence.', icon: '🌴' },
      { name: 'Amla (Indian Gooseberry)', use: 'Vit C — immunity + iron absorption + constipation. Fresh ya murabba.', icon: '🟢' },
    ],
    avoid: [
      { name: 'Aloe Vera (internal)', reason: 'Anthraquinone glycosides — purgative effect, miscarriage risk' },
      { name: 'Ashwagandha', reason: 'Uterine stimulant — avoid in pregnancy completely' },
      { name: 'Triphala', reason: 'Strong bowel stimulant — avoid in pregnancy' },
      { name: 'Neem (internal)', reason: 'Spermicidal + uterotonic — avoid' },
    ],
  },
  3: {
    title: 'Teesri Trimester (Week 28–40)',
    safe: [
      { name: 'Dates (Week 36+)', use: '6 dates roz — cervical ripening studies: shorter labor, less augmentation needed', icon: '🌴' },
      { name: 'Raspberry Leaf Tea', use: 'Week 32+ — uterine toning. 1 cup/day only. Do not use earlier.', icon: '🍃' },
      { name: 'Sesame Seeds (Til)', use: 'Iron + calcium — til ke laddoo. Traditional winter pregnancy food.', icon: '⚫' },
      { name: 'Gondh Laddoo', use: 'Post-delivery — energy, milk production, back strength. Traditional postpartum food.', icon: '🟤' },
      { name: 'Ghee (Moderate)', use: 'Joint lubrication, baby brain development. 1-2 tsp daily ok. Excess avoid (calories).', icon: '🧈' },
    ],
    avoid: [
      { name: 'Castor Oil (internal)', reason: 'Can cause severe contractions and fetal distress — dangerous' },
      { name: 'Evening Primrose Oil (early)', reason: 'Only under doctor guidance for cervical ripening — not self-medicate' },
      { name: 'Very spicy food', reason: 'Heartburn already worse in 3rd tri — avoid triggers' },
    ],
  },
  postpartum: {
    title: 'Postpartum Recovery',
    safe: [
      { name: 'Panjiri', use: 'Traditional postpartum food — atta, ghee, gondh, dry fruits. Energy + galactagogue.', icon: '🍪' },
      { name: 'Ajwain + Gur Water', use: 'Uterine healing + digestive. 1 tsp ajwain + gur in warm water, 2-3 days postpartum.', icon: '🫚' },
      { name: 'Methi (Fenugreek)', use: 'Milk supply booster — methi laddoo or methi ki sabzi. Evidence-backed galactagogue.', icon: '🌿' },
      { name: 'Satavari (Shatavari)', use: 'Ayurvedic galactagogue — powder in warm milk. Safe for breastfeeding.', icon: '🌿' },
      { name: 'Mustard Oil Massage', use: 'Traditional baby massage — warming, bone development (traditional belief). Use gentle pressure.', icon: '🫙' },
    ],
    avoid: [
      { name: 'Papaya (breastfeeding)', reason: 'Some concern about latex compounds in breast milk — avoid raw papaya' },
      { name: 'Peppermint tea (excess)', reason: 'Can reduce milk supply — limit' },
    ],
  }
};

// ════════════════════════════════════════
// 3. EMERGENCY CARD
// ════════════════════════════════════════
async function generateEmergencyCard() {
  if (!window.user) return;
  const { data } = await window.supa.from('user_profile').select('*').eq('id', window.user.id).maybeSingle();
  if (!data) return;
  const ec = data.emergency_contacts?.[0] || {};
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Emergency Card</title>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Arial,sans-serif;background:#fdf6f0;padding:16px;min-height:100vh}
      .card{background:white;border-radius:20px;padding:20px;max-width:380px;margin:0 auto;border:2px solid #e8a0a8;box-shadow:0 8px 24px rgba(200,100,100,.15)}
      h2{color:#e8a0a8;font-size:1.2rem;border-bottom:2px solid #e8a0a8;padding-bottom:8px;margin-bottom:14px}
      .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f5d5d8;font-size:14px}
      .label{color:#9a7070;font-size:12px}
      .val{font-weight:600;color:#4a2c2a}
      .red{background:#e05c5c;color:white;padding:12px 16px;border-radius:12px;margin-top:12px;font-size:13px;line-height:1.6}
      .btn{background:#e8a0a8;color:white;border:none;padding:10px 24px;border-radius:50px;cursor:pointer;font-weight:600;margin-top:14px;width:100%;font-size:14px}
      @media print{.btn{display:none}body{padding:4px}.card{border:2px solid #e8a0a8;box-shadow:none}}
    </style>
    </head><body>
    <div class="card">
      <h2>🌸 MamaCare — Emergency Card</h2>
      <div class="row"><span class="label">Name</span><span class="val">${data.name || data.email || '—'}</span></div>
      <div class="row"><span class="label">Blood Group</span><span class="val" style="color:#e05c5c;font-size:1.1rem">${data.blood_group || '—'}</span></div>
      <div class="row"><span class="label">Due Date</span><span class="val">${data.due_date ? new Date(data.due_date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—'}</span></div>
      <div class="row"><span class="label">Current Week</span><span class="val">${data.due_date ? 'Week ' + Math.min(40, Math.floor((new Date() - new Date(new Date(data.due_date).getTime() - 280*86400000))/86400000/7)+1) : '—'}</span></div>
      <div class="row"><span class="label">OB/Doctor</span><span class="val">${data.partner_email || '—'}</span></div>
      <div class="row"><span class="label">Emergency Contact</span><span class="val">${ec.name || '—'}</span></div>
      <div class="row"><span class="label">Emergency Phone</span><span class="val" style="color:#e05c5c">${ec.phone || '—'}</span></div>
      <div class="row"><span class="label">Allergies</span><span class="val">${data.allergies || 'None known'}</span></div>
      <div class="row"><span class="label">Special Notes</span><span class="val">${data.medical_notes || 'None'}</span></div>
      <div class="red">🚨 In emergency: Call 108 (Ambulance)<br>📍 ${ec.phone ? 'Contact: ' + ec.name + ' — ' + ec.phone : 'See emergency contacts above'}</div>
      <button class="btn" onclick="window.print()">🖨️ Print Card</button>
    </div>
    </body></html>`);
  w.document.close();
}

// ════════════════════════════════════════
// 4. DAILY SYMPTOM DIARY
// ════════════════════════════════════════
async function saveDailySymptoms() {
  if (!window.user) return;
  const today = new Date().toISOString().split('T')[0];
  const data = {
    user_id: window.user.id,
    diary_date: today,
    swelling:   parseInt(document.getElementById('symp_swelling')?.value) || 0,
    heartburn:  parseInt(document.getElementById('symp_heartburn')?.value) || 0,
    fatigue:    parseInt(document.getElementById('symp_fatigue')?.value) || 0,
    nausea:     parseInt(document.getElementById('symp_nausea')?.value) || 0,
    back_pain:  parseInt(document.getElementById('symp_backpain')?.value) || 0,
    headache:   parseInt(document.getElementById('symp_headache')?.value) || 0,
    note:       document.getElementById('symp_note')?.value?.trim() || null,
  };
  await window.supa.from('symptom_diary').upsert(data, { onConflict: 'user_id,diary_date' });
  flashIndia('sympdiary-save');
  document.getElementById('sympDiarySuccess').style.display = 'block';
  setTimeout(() => { const el = document.getElementById('sympDiarySuccess'); if(el) el.style.display='none'; }, 2500);
  loadSymptomTrend();
}

async function loadSymptomTrend() {
  if (!window.user) return;
  const { data } = await window.supa.from('symptom_diary').select('*').eq('user_id', window.user.id)
    .order('diary_date', { ascending: false }).limit(7);
  renderSymptomTrend(data || []);
}

function renderSymptomTrend(logs) {
  const el = document.getElementById('symptomTrendList');
  if (!el || !logs.length) return;
  el.innerHTML = logs.map(d => {
    const keys   = ['swelling','heartburn','fatigue','nausea','back_pain','headache'];
    const labels  = ['💊 Swelling','🔥 Heartburn','😴 Fatigue','🤢 Nausea','🤸 Back Pain','🤕 Headache'];
    const scores  = keys.map((k,i) => d[k] > 0 ? `${labels[i]}: ${'●'.repeat(d[k])}${'○'.repeat(5-d[k])}` : '').filter(Boolean);
    return `<div style="background:white;border-radius:13px;padding:13px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-weight:600;font-size:13px">${new Date(d.diary_date).toLocaleDateString('hi-IN',{day:'numeric',month:'short'})}</span>
        <span style="font-size:11px;color:var(--muted)">${scores.length} symptoms</span>
      </div>
      ${scores.map(s => `<div style="font-size:11.5px;color:var(--muted);margin-bottom:2px">${s}</div>`).join('')}
      ${d.note ? `<div style="font-size:12px;color:var(--warm);margin-top:5px;font-style:italic">"${d.note}"</div>` : ''}
    </div>`;
  }).join('');
}

// ════════════════════════════════════════
// 5. SEARCH
// ════════════════════════════════════════
const SEARCH_INDEX = [
  { term:'mood', page:'mood', label:'😊 Mood Tracker' },
  { term:'weight', page:'weight', label:'⚖️ Weight Log' },
  { term:'sleep', page:'sleep', label:'😴 Sleep Tracker' },
  { term:'food nutrition', page:'nutrition', label:'🍎 Nutrition' },
  { term:'medicine tablet', page:'medicine', label:'💊 Medicine Tracker' },
  { term:'hospital bag pack', page:'bag', label:'🏥 Hospital Bag' },
  { term:'baby name', page:'names', label:'👶 Baby Names' },
  { term:'journal diary', page:'journal', label:'📸 Journal' },
  { term:'appointment doctor', page:'appointments', label:'📅 Appointments' },
  { term:'birth plan delivery', page:'birth', label:'📋 Birth Plan' },
  { term:'postpartum recovery', page:'postpartum', label:'🤰 Postpartum' },
  { term:'symptom pain', page:'symptoms', label:'🩺 Symptoms' },
  { term:'sos emergency hospital', page:'sos', label:'🚨 SOS' },
  { term:'kick counter movement', page:'kick', label:'👶 Kick Counter' },
  { term:'contraction labor', page:'contraction', label:'⏱️ Contraction Timer' },
  { term:'blood pressure bp hypertension', page:'bp', label:'❤️ BP Tracker' },
  { term:'sugar diabetes gestational', page:'sugar', label:'🩸 Sugar Tracker' },
  { term:'yoga exercise prenatal', page:'yoga', label:'🧘 Yoga' },
  { term:'due date week pregnant', page:'due', label:'🗓️ Due Date' },
  { term:'relax meditation music', page:'relax', label:'🎵 Relax' },
  { term:'reminder notification', page:'reminders', label:'🔔 Reminders' },
  { term:'partner share', page:'partner', label:'👨‍👩‍👧 Partner' },
  { term:'report pdf health', page:'report', label:'📊 Reports' },
  { term:'coach ai weekly', page:'coach', label:'🤖 AI Coach' },
  { term:'premium subscription', page:'premium', label:'✨ Premium' },
  { term:'baby feed breast bottle', page:'baby-feed', label:'🍼 Feed Log' },
  { term:'baby sleep nap', page:'baby-sleep', label:'😴 Baby Sleep' },
  { term:'vaccine vaccination immunization', page:'vaccines', label:'💉 Vaccines' },
  { term:'milestone development', page:'milestones', label:'🏆 Milestones' },
  { term:'government scheme pmmvy jsy free', page:'india', label:'🏛️ Govt Schemes' },
  { term:'ayurveda home remedy herbs', page:'ayurveda', label:'🌿 Ayurvedic Tips' },
  { term:'symptom diary daily log', page:'sympdiary', label:'📝 Symptom Diary' },
  { term:'emergency card blood group', page:'emergencycard', label:'🆘 Emergency Card' },
  { term:'dashboard overview stats', page:'dashboard', label:'📊 Dashboard' },
];

function handleSearch(q) {
  q = q.trim().toLowerCase();
  const dropdown = document.getElementById('searchDropdown');
  if (!q || !dropdown) { dropdown.style.display = 'none'; return; }
  const results = SEARCH_INDEX.filter(s => s.term.includes(q) || s.label.toLowerCase().includes(q)).slice(0, 7);
  if (!results.length) { dropdown.style.display = 'none'; return; }
  dropdown.innerHTML = results.map(r =>
    `<div onclick="INDIA.searchGo('${r.page}')" style="padding:10px 16px;cursor:pointer;border-bottom:1px solid rgba(232,160,168,.1);font-size:13.5px;color:var(--warm)" onmouseover="this.style.background='var(--blush)'" onmouseout="this.style.background='white'">${r.label}</div>`
  ).join('');
  dropdown.style.display = 'block';
}

function searchGo(page) {
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) dropdown.style.display = 'none';
  const input = document.getElementById('globalSearch');
  if (input) input.value = '';
  if (window.MC?.goTo) window.MC.goTo(page);
}

function injectSearchBar() {
  const topUser = document.querySelector('.top-user');
  if (!topUser || document.getElementById('globalSearchWrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'globalSearchWrap';
  wrap.style.cssText = 'position:relative;flex-shrink:0;display:none';
  wrap.innerHTML = `
    <input id="globalSearch" type="text" placeholder="🔍 Search features..." style="width:180px;padding:6px 14px;border-radius:50px;border:1.5px solid var(--blush);font-size:12px;background:white;outline:none" oninput="INDIA.handleSearch(this.value)" onfocus="this.style.width='220px'" onblur="setTimeout(()=>{document.getElementById('searchDropdown').style.display='none';this.style.width='180px'},200)"/>
    <div id="searchDropdown" style="display:none;position:absolute;top:34px;left:0;right:0;background:white;border:1.5px solid rgba(232,160,168,.2);border-radius:14px;box-shadow:0 8px 24px rgba(200,100,100,.12);z-index:200;overflow:hidden;min-width:260px"></div>`;
  topUser.insertBefore(wrap, topUser.firstChild);
  // Show on desktop
  const style = document.createElement('style');
  style.textContent = '@media(min-width:768px){#globalSearchWrap{display:block!important}}';
  document.head.appendChild(style);
}

// ════════════════════════════════════════
// RENDER FUNCTIONS
// ════════════════════════════════════════
function renderGovSchemes() {
  const el = document.getElementById('govSchemesGrid');
  if (!el) return;
  el.innerHTML = GOV_SCHEMES.map(s => `
    <div class="card" style="border-left:3px solid ${s.color}">
      <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:12px">
        <span style="font-size:30px">${s.icon}</span>
        <div style="flex:1">
          <div style="font-weight:600;font-size:14px;color:var(--warm);margin-bottom:3px">${s.name}</div>
          <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:50px;background:${s.color};color:white">${s.badge}</span>
        </div>
      </div>
      <p style="font-size:13px;color:var(--muted);line-height:1.65;margin-bottom:10px"><strong>Benefit:</strong> ${s.benefit}</p>
      <p style="font-size:12.5px;color:var(--muted);line-height:1.6;margin-bottom:10px"><strong>Eligibility:</strong> ${s.eligibility}</p>
      <div style="background:var(--cream);border-radius:10px;padding:11px 13px;margin-bottom:10px">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:${s.color};margin-bottom:5px">How to Apply</div>
        ${s.howto.map((step,i) => `<div style="font-size:12.5px;color:var(--muted);padding:3px 0;line-height:1.55">${i+1}. ${step}</div>`).join('')}
      </div>
      <div style="font-size:12px;color:var(--muted)"><strong>Documents:</strong> ${s.docs.join(' · ')}</div>
      ${s.link ? `<a href="${s.link}" target="_blank" style="display:block;margin-top:10px;font-size:12px;color:var(--blue);text-decoration:none">🔗 Official Website →</a>` : ''}
    </div>`).join('');
}

function renderAyurvedaTri(tri) {
  document.querySelectorAll('.ayur-tab').forEach(b => b.classList.remove('active'));
  document.querySelector(`.ayur-tab[data-tri="${tri}"]`)?.classList.add('active');
  const data = AYURVEDIC_TIPS[tri];
  const el   = document.getElementById('ayurvedaContent');
  if (!el || !data) return;
  el.innerHTML = `
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--warm);margin-bottom:14px">${data.title}</div>
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--green);margin-bottom:8px">✅ Safe & Beneficial</div>
      ${data.safe.map(t => `<div style="background:white;border-radius:13px;padding:12px 14px;margin-bottom:7px;border-left:3px solid var(--green)"><div style="font-weight:600;font-size:13.5px;margin-bottom:3px">${t.icon} ${t.name}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${t.use}</div></div>`).join('')}
    </div>
    <div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#e05c5c;margin-bottom:8px">⚠️ Avoid in Pregnancy</div>
      ${data.avoid.map(t => `<div style="background:#fff5f5;border-radius:13px;padding:12px 14px;margin-bottom:7px;border-left:3px solid #e05c5c"><div style="font-weight:600;font-size:13.5px;margin-bottom:3px">❌ ${t.name}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${t.reason}</div></div>`).join('')}
    </div>`;
}

function flashIndia(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

// ════════════════════════════════════════
// INIT & INJECT
// ════════════════════════════════════════
function initIndia() {
  injectSearchBar();
  loadSymptomTrend();
  addIndiaTabs();
  setTimeout(() => {
    renderGovSchemes();
    renderAyurvedaTri(1);
  }, 100);
}

function addIndiaTabs() {
  const topTabs = document.getElementById('topTabs');
  if (!topTabs) return;
  [
    { page:'india',       label:'🏛️ Schemes' },
    { page:'ayurveda',    label:'🌿 Ayurveda'  },
    { page:'sympdiary',   label:'📝 Diary'     },
    { page:'emergencycard', label:'🆘 Emergency Card' },
  ].forEach(t => {
    if (!document.querySelector(`[data-page="${t.page}"]`)) {
      const btn = document.createElement('button');
      btn.className = 'top-tab'; btn.dataset.page = t.page; btn.textContent = t.label;
      btn.addEventListener('click', () => { if(window.MC?.goTo) window.MC.goTo(t.page); });
      topTabs.appendChild(btn);
    }
  });
  const moreGrid = document.querySelector('#moreMenu .more-grid');
  if (moreGrid) {
    [
      { page:'india', icon:'🏛️', label:'Schemes' },
      { page:'ayurveda', icon:'🌿', label:'Ayurveda' },
      { page:'sympdiary', icon:'📝', label:'Diary' },
      { page:'emergencycard', icon:'🆘', label:'Emergency Card' },
    ].forEach(t => {
      if (!document.querySelector(`#moreMenu [data-page="${t.page}"]`)) {
        const div = document.createElement('div');
        div.className='more-item'; div.dataset.page=t.page;
        div.innerHTML=`<div class="mi-icon">${t.icon}</div><div class="mi-label">${t.label}</div>`;
        div.addEventListener('click',()=>{ document.getElementById('moreMenu').style.display='none'; if(window.MC?.goTo) window.MC.goTo(t.page); });
        moreGrid.appendChild(div);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  injectIndiaPages();
});

function injectIndiaPages() {
  if (document.getElementById('page-india')) return;
  const footer = document.querySelector('footer');
  const html = `
<!-- GOVT SCHEMES -->
<div class="page" id="page-india">
  <div style="padding:20px 0 8px"><div class="sec-label">India</div><div class="sec-title">Government Schemes 🏛️</div></div>
  <div class="card" style="background:linear-gradient(135deg,rgba(106,184,154,.1),rgba(122,184,212,.08))">
    <p style="font-size:13px;color:var(--muted);line-height:1.7">💡 Ye sab schemes sirf aapke liye hain — ek baar register karo aur benefits lo. Kaafi log in schemes ke baare mein nahi jaante!</p>
  </div>
  <div id="govSchemesGrid"></div>
  <div class="card">
    <div class="sec-title">📞 Helplines</div>
    ${[['PMMVY Helpline','011-23382393'],['ASHA/ANM Contact','Local AWC/PHC pe jaao'],['Ambulance','108'],['Women Helpline','1091'],['Child Helpline','1098'],['PM-JAY Helpline','14555']].map(([n,v])=>
      `<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(232,160,168,.1);font-size:13px"><span>${n}</span><strong>${v}</strong></div>`).join('')}
  </div>
</div>

<!-- AYURVEDA -->
<div class="page" id="page-ayurveda">
  <div style="padding:20px 0 8px"><div class="sec-label">Traditional Wisdom</div><div class="sec-title">Ayurvedic Tips 🌿</div></div>
  <div class="card" style="background:rgba(212,168,83,.06)">
    <p style="font-size:13px;color:var(--muted);line-height:1.7">⚠️ <strong>Important:</strong> Ye tips traditional knowledge aur evidence-based research pe based hain. Koi bhi herb/supplement doctor se discuss karein pehle. Har pregnancy different hoti hai.</p>
  </div>
  <div class="card">
    <div class="tab-row">
      <button class="tab-btn ayur-tab active" data-tri="1" onclick="INDIA.renderAyurvedaTri(1)">🌱 1st Tri</button>
      <button class="tab-btn ayur-tab" data-tri="2" onclick="INDIA.renderAyurvedaTri(2)">🌸 2nd Tri</button>
      <button class="tab-btn ayur-tab" data-tri="3" onclick="INDIA.renderAyurvedaTri(3)">🌟 3rd Tri</button>
      <button class="tab-btn ayur-tab" data-tri="postpartum" onclick="INDIA.renderAyurvedaTri('postpartum')">🤰 Postpartum</button>
    </div>
    <div id="ayurvedaContent"></div>
  </div>
</div>

<!-- SYMPTOM DIARY -->
<div class="page" id="page-sympdiary">
  <div style="padding:20px 0 8px"><div class="sec-label">Daily</div><div class="sec-title">Symptom Diary 📝 <span class="sync-badge" id="sympdiary-save">☁️ Synced</span></div></div>
  <div class="card">
    <div class="sec-label">Aaj (${new Date().toLocaleDateString('hi-IN',{day:'numeric',month:'long'})})</div>
    <div class="sec-title">Kaisi feel kar rahi hain?</div>
    <p style="font-size:12.5px;color:var(--muted);margin-bottom:16px">0 = nahi, 5 = bahut zyada</p>
    ${[
      ['symp_swelling',  '🦵 Swelling'],
      ['symp_heartburn', '🔥 Heartburn'],
      ['symp_fatigue',   '😴 Fatigue'],
      ['symp_nausea',    '🤢 Nausea'],
      ['symp_backpain',  '🤸 Back Pain'],
      ['symp_headache',  '🤕 Headache'],
    ].map(([id,label]) => `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:13.5px;color:var(--warm);width:130px">${label}</span>
        <input type="range" id="${id}" min="0" max="5" value="0" style="flex:1;accent-color:var(--rose);margin:0 12px"/>
        <span style="font-size:13px;font-weight:600;color:var(--accent);width:16px;text-align:center" id="${id}_val">0</span>
      </div>`).join('')}
    <div style="margin-bottom:14px;margin-top:4px"><label>Note (optional)</label><textarea id="symp_note" placeholder="Kuch aur feel hua aaj..." style="min-height:60px"></textarea></div>
    <button class="btn btn-p btn-sm" onclick="INDIA.saveDailySymptoms()">💾 Save Today's Log</button>
    <div id="sympDiarySuccess" style="display:none;color:var(--green);font-size:12.5px;margin-top:8px">✅ Log saved!</div>
  </div>
  <div class="card"><div class="sec-label">History</div><div class="sec-title">Last 7 Days Trend</div><div id="symptomTrendList"></div></div>
</div>

<!-- EMERGENCY CARD -->
<div class="page" id="page-emergencycard">
  <div style="padding:20px 0 8px"><div class="sec-label">Safety</div><div class="sec-title">Emergency Card 🆘</div></div>
  <div class="card" style="text-align:center;padding:28px">
    <div style="font-size:52px;margin-bottom:12px">🆘</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:8px">Offline Emergency Card</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:20px">Aapka blood group, doctor contact, emergency numbers — ek page mein. Print karo, wallet mein rakho. Internet ke bina bhi kaam karta hai.</p>
    <button class="btn btn-p" onclick="INDIA.generateEmergencyCard()">🖨️ Generate & Print Card</button>
  </div>
  <div class="card" style="background:rgba(232,160,168,.06)">
    <div class="sec-title">Card mein kya hoga?</div>
    <div style="font-size:13px;line-height:2;color:var(--muted)">
      👤 Naam + Blood Group<br>
      🗓️ Due Date + Current Week<br>
      🏥 Doctor ka naam + contact<br>
      📞 Emergency Contact (pati/maa)<br>
      💊 Known Allergies<br>
      🚑 Ambulance: 108
    </div>
  </div>
  <div class="card">
    <div class="sec-title">📝 Update Card Info</div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:12px">Blood group aur allergies profile mein update karo — card automatically update hoga.</p>
    <button class="btn btn-g btn-sm" onclick="MC.goTo('sos')">👉 SOS Page se Emergency Contacts Update Karo</button>
  </div>
</div>
`;
  if (footer) footer.insertAdjacentHTML('beforebegin', html);
  else document.body.insertAdjacentHTML('beforeend', html);

  // Range input live value display
  ['symp_swelling','symp_heartburn','symp_fatigue','symp_nausea','symp_backpain','symp_headache'].forEach(id => {
    const input = document.getElementById(id);
    const valEl = document.getElementById(id + '_val');
    if (input && valEl) input.addEventListener('input', () => { valEl.textContent = input.value; });
  });
}

window.INDIA = {
  initIndia, renderGovSchemes, renderAyurvedaTri,
  saveDailySymptoms, loadSymptomTrend,
  generateEmergencyCard,
  handleSearch, searchGo,
};
