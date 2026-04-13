/**
 * MamaCare — app-smart.js v6.2
 * AI Features:
 *  1. Symptom AI (contextual, urgency-aware)
 *  2. Nutrition AI (food → nutrients estimate)
 *  3. Birth Plan AI Generator
 *  4. Smart Nudges (personalized reminders)
 *  5. Doctor Portal (basic)
 *  6. Milestone Share Cards (canvas)
 *  7. Partner View (fixed)
 */
'use strict';

// ════════════════════════════════════════
// 1. SYMPTOM AI
// ════════════════════════════════════════
let symptomAIChatHist = [];

async function sendSymptomAI() {
  const inp = document.getElementById('symptomAIInput');
  const txt = inp?.value?.trim();
  if (!txt) return;
  inp.value = '';
  appendSymptomMsg(txt, 'user');
  symptomAIChatHist.push({ role: 'user', content: txt });
  const typing = appendSymptomMsg('...💭', 'bot', true);

  // Get pregnancy context
  const dueEl = document.getElementById('directDue');
  const due   = dueEl?.value;
  let week = '—';
  if (due) {
    const days = Math.floor((new Date() - new Date(new Date(due).getTime() - 280*86400000)) / 86400000);
    week = Math.min(40, Math.floor(days/7) + 1);
  }

  try {
    const { data, error } = await window.supa.functions.invoke('claude-proxy', {
      body: {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: `You are MamaCare Symptom Assistant — a pregnancy-aware medical triage AI. Current pregnancy week: ${week}.

Your job:
1. Assess urgency: NORMAL / WATCH / SEE DOCTOR TODAY / EMERGENCY 911
2. Explain what's likely causing this symptom (1-2 sentences)
3. Give 2-3 safe pregnancy relief tips
4. ALWAYS: if there's any serious warning sign, clearly state it

Format your response as:
🔴/💛/✅ **URGENCY: [level]**
[Brief explanation]
💊 Relief: [tips]
⚠️ Warning sign: [when to call doctor immediately]

Speak in Hinglish. Be warm but medically accurate. Never downplay serious symptoms.`,
        messages: symptomAIChatHist,
      }
    });
    typing.remove();
    if (error) throw error;
    const reply = data?.content?.[0]?.text || '🌸 Kuch issue hua. Dobara try karo.';
    appendSymptomMsg(reply, 'bot');
    symptomAIChatHist.push({ role: 'assistant', content: reply });
  } catch (e) {
    typing.remove();
    appendSymptomMsg('🌸 Connection issue. Dobara try karo.', 'bot');
    console.error('SymptomAI error:', e);
  }
}

function appendSymptomMsg(text, role, isTyping = false) {
  const box = document.getElementById('symptomAIChatBox');
  if (!box) return null;
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  // Convert **bold** markdown
  div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  if (isTyping) div.style.cssText = 'font-style:italic;color:var(--muted)';
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

// ════════════════════════════════════════
// 2. NUTRITION AI
// ════════════════════════════════════════
async function analyzeFood() {
  const inp = document.getElementById('nutritionAIInput');
  const txt = inp?.value?.trim();
  if (!txt) return;
  inp.value = '';
  const loadEl = document.getElementById('nutritionAIResult');
  if (loadEl) loadEl.innerHTML = '<div class="loading">Analyzing...</div>';

  try {
    const { data, error } = await window.supa.functions.invoke('claude-proxy', {
      body: {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: `You are a pregnancy nutrition analyzer. User will tell you what they ate. Estimate nutritional content and assess for pregnancy.

Respond ONLY in this JSON format (no markdown, no backticks):
{
  "items": [{"name":"string","calories":number,"protein_g":number,"iron_mg":number,"calcium_mg":number,"folate_mcg":number,"notes":"string"}],
  "totals": {"calories":number,"protein_g":number,"iron_mg":number,"calcium_mg":number,"folate_mcg":number},
  "assessment": "2-3 sentence pregnancy nutrition assessment in Hinglish",
  "missing": ["what pregnancy nutrients are lacking today"],
  "suggestions": ["1-2 food additions to complete nutrition today"]
}`,
        messages: [{ role: 'user', content: `I ate: ${txt}` }],
      }
    });
    if (error) throw error;
    const raw = data?.content?.[0]?.text || '{}';
    let result;
    try { result = JSON.parse(raw.replace(/```json|```/g, '').trim()); }
    catch { throw new Error('Parse failed'); }
    renderNutritionAIResult(result, txt);
  } catch (e) {
    if (loadEl) loadEl.innerHTML = '<p style="color:var(--muted);font-size:13px">Analysis failed. Dobara try karo.</p>';
    console.error('NutritionAI error:', e);
  }
}

function renderNutritionAIResult(r, query) {
  const el = document.getElementById('nutritionAIResult');
  if (!el) return;
  const t = r.totals || {};
  el.innerHTML = `
    <div style="background:rgba(106,184,154,.08);border-radius:13px;padding:13px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--green);margin-bottom:8px">📊 "${query}" — Nutrients</div>
      <div class="g2" style="gap:8px">
        ${[['🔥 Calories', t.calories+' kcal'],['💪 Protein', t.protein_g+'g'],['🩸 Iron', t.iron_mg+'mg'],['🦴 Calcium', t.calcium_mg+'mg'],['🟢 Folate', t.folate_mcg+'mcg']].map(([l,v]) =>
          `<div style="background:white;border-radius:10px;padding:9px;text-align:center"><div style="font-size:12px;color:var(--muted)">${l}</div><div style="font-weight:600;font-size:13.5px;color:var(--warm)">${v}</div></div>`).join('')}
      </div>
    </div>
    ${r.assessment ? `<p style="font-size:13px;color:var(--warm);line-height:1.7;margin-bottom:10px">${r.assessment}</p>` : ''}
    ${r.missing?.length ? `<div style="background:#fff5f5;border-radius:10px;padding:10px 13px;margin-bottom:8px;font-size:12.5px"><strong style="color:#e05c5c">⚠️ Missing:</strong> ${r.missing.join(', ')}</div>` : ''}
    ${r.suggestions?.length ? `<div style="background:rgba(212,168,83,.08);border-radius:10px;padding:10px 13px;font-size:12.5px"><strong style="color:var(--gold)">💡 Add karo:</strong> ${r.suggestions.join(' · ')}</div>` : ''}`;
}

// ════════════════════════════════════════
// 3. BIRTH PLAN AI
// ════════════════════════════════════════
let bpAIAnswers = {};
const BP_AI_QUESTIONS = [
  { id: 'pain', q: 'Pain management ke baare mein aapki preference kya hai?', options: ['Natural — no medication', 'Epidural preferred', 'Gas & air', 'Open to all options', 'TENS machine'] },
  { id: 'position', q: 'Pushing ke time position preference?', options: ['Traditional (back)', 'Squatting', 'Side-lying', 'Hands & knees', 'Doctor decide kare'] },
  { id: 'cord', q: 'Cord cutting ke baare mein?', options: ['Partner cuts cord', 'Delayed clamping (60s+)', 'Doctor decides'] },
  { id: 'skin', q: 'Baby ke janam ke baad immediately?', options: ['Skin-to-skin right away', 'Delayed bath (24hrs)', 'Vernix removal delay', 'Doctor priority first'] },
  { id: 'feeding', q: 'Feeding plan?', options: ['Exclusive breastfeeding', 'Combination', 'Formula', 'See how it goes'] },
  { id: 'people', q: 'Delivery room mein kaun ho?', options: ['Sirf husband/partner', 'Maa bhi', 'Sirf medical staff', 'Doula bhi'] },
];
let bpAIStep = 0;

function startBirthPlanAI() {
  bpAIAnswers = {};
  bpAIStep = 0;
  document.getElementById('bpAIResult').style.display = 'none';
  showBPAIQuestion();
}

function showBPAIQuestion() {
  const el = document.getElementById('bpAIQuestions');
  if (!el) return;
  if (bpAIStep >= BP_AI_QUESTIONS.length) {
    generateBirthPlanFromAI();
    return;
  }
  const q = BP_AI_QUESTIONS[bpAIStep];
  const total = BP_AI_QUESTIONS.length;
  el.innerHTML = `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:8px"><span>Question ${bpAIStep+1} of ${total}</span><span>${Math.round((bpAIStep/total)*100)}%</span></div>
      <div style="height:5px;background:#f0e0e0;border-radius:50px;overflow:hidden"><div style="height:100%;width:${Math.round((bpAIStep/total)*100)}%;background:linear-gradient(90deg,var(--rose),var(--peach));border-radius:50px"></div></div>
    </div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.15rem;color:var(--warm);margin-bottom:14px;line-height:1.5">${q.q}</div>
    <div style="display:flex;flex-direction:column;gap:7px">
      ${q.options.map(opt => `<button onclick="SMART.bpAISelect('${q.id}','${opt}')" style="padding:11px 16px;border-radius:14px;border:1.5px solid var(--blush);background:white;font-size:13px;color:var(--warm);cursor:pointer;text-align:left;transition:.2s;font-family:'DM Sans',sans-serif" onmouseover="this.style.borderColor='var(--rose)'" onmouseout="this.style.borderColor='var(--blush)'">${opt}</button>`).join('')}
    </div>
    ${bpAIStep > 0 ? `<button class="btn btn-g btn-sm" style="margin-top:10px" onclick="SMART.bpAIBack()">← Back</button>` : ''}`;
}

function bpAISelect(id, val) {
  bpAIAnswers[id] = val;
  bpAIStep++;
  showBPAIQuestion();
}
function bpAIBack() { bpAIStep = Math.max(0, bpAIStep - 1); showBPAIQuestion(); }

async function generateBirthPlanFromAI() {
  const el = document.getElementById('bpAIQuestions');
  if (el) el.innerHTML = '<div class="loading">AI aapka birth plan likh raha hai...</div>';
  const answers = Object.entries(bpAIAnswers).map(([k,v]) => `${k}: ${v}`).join('\n');
  const dueEl = document.getElementById('directDue');
  const week  = dueEl?.value ? Math.min(40, Math.floor((new Date()-new Date(new Date(dueEl.value).getTime()-280*86400000))/86400000/7)+1) : '—';

  try {
    const { data, error } = await window.supa.functions.invoke('claude-proxy', {
      body: {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        system: 'You are a professional birth plan writer for Indian women. Write a warm, comprehensive, doctor-ready birth plan in Hinglish. Use clear headings, be specific based on preferences given. End with a note that this is a preference, not a demand — medical emergencies override preferences.',
        messages: [{ role: 'user', content: `Week ${week} mein hun. Meri preferences:\n${answers}\n\nMere liye ek complete birth plan likho doctor ke liye.` }],
      }
    });
    if (error) throw error;
    const plan = data?.content?.[0]?.text || '';
    const resultEl = document.getElementById('bpAIResult');
    const resultText = document.getElementById('bpAIResultText');
    if (el) el.innerHTML = '';
    if (resultEl) resultEl.style.display = 'block';
    if (resultText) {
      resultText.innerHTML = plan.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
    }
  } catch (e) {
    if (el) el.innerHTML = '<p style="color:var(--muted);font-size:13px">Generation failed. Dobara try karo.</p>';
  }
}

function printAIBirthPlan() {
  const content = document.getElementById('bpAIResultText')?.innerHTML || '';
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Birth Plan</title><style>body{font-family:'Georgia',serif;padding:30px;max-width:600px;margin:0 auto;color:#333;line-height:1.8}h1,h2{color:#e8a0a8}p{font-size:14px}@media print{.btn{display:none}}</style></head><body><h1>🌸 My Birth Plan</h1>${content}<br/><p style="font-size:12px;color:#999">Generated by MamaCare | mamacare.gyanam.shop</p><button onclick="window.print()" class="btn" style="background:#e8a0a8;color:white;border:none;padding:10px 24px;border-radius:50px;cursor:pointer">Print</button></body></html>`);
  w.document.close();
}

// ════════════════════════════════════════
// 4. SMART NUDGES
// ════════════════════════════════════════
async function checkSmartNudges() {
  if (!window.user || !window.supa) return;
  const today = new Date().toISOString().split('T')[0];
  const uid   = window.user.id;
  const nudgeEl = document.getElementById('smartNudgeBanner');
  if (!nudgeEl) return;

  const nudges = [];
  try {
    // Check last weight log
    const { data: wt } = await window.supa.from('weight_logs').select('logged_at').eq('user_id', uid).order('logged_at', { ascending: false }).limit(1);
    if (!wt?.length) nudges.push({ icon:'⚖️', msg:'Pehla weight log karo — tracking shuru karo!' });
    else {
      const daysSince = Math.floor((new Date() - new Date(wt[0].logged_at)) / 86400000);
      if (daysSince >= 7) nudges.push({ icon:'⚖️', msg:`${daysSince} din se weight log nahi — weekly track karo!` });
    }
    // Check kick count today (week 28+)
    const dueEl = document.getElementById('directDue');
    if (dueEl?.value) {
      const week = Math.min(40, Math.floor((new Date()-new Date(new Date(dueEl.value).getTime()-280*86400000))/86400000/7)+1);
      if (week >= 28) {
        const { data: kc } = await window.supa.from('kick_logs').select('session_date').eq('user_id', uid).eq('session_date', today).maybeSingle();
        if (!kc) nudges.push({ icon:'👶', msg:'Aaj ki kick count nahi ki — baby movements check karo!' });
      }
    }
    // Check appointment upcoming
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const { data: appts } = await window.supa.from('appointments').select('title,appt_date').eq('user_id', uid).eq('appt_date', tomorrow).limit(1);
    if (appts?.length) nudges.push({ icon:'📅', msg:`Kal appointment hai: "${appts[0].title}" — taiyaar ho jaao!` });
    // Medicine today
    const { data: meds } = await window.supa.from('medicines').select('id').eq('user_id', uid).eq('is_active', true);
    if (meds?.length) {
      const { data: taken } = await window.supa.from('medicine_logs').select('id').eq('user_id', uid).eq('taken_date', today);
      const remaining = meds.length - (taken?.length || 0);
      if (remaining > 0) nudges.push({ icon:'💊', msg:`${remaining} medicine${remaining>1?'s':''} aaj baaki hain!` });
    }
  } catch(e) { return; }

  if (!nudges.length) { nudgeEl.style.display = 'none'; return; }
  const n = nudges[0]; // Show most urgent
  nudgeEl.style.display = 'block';
  nudgeEl.innerHTML = `<span style="font-size:18px">${n.icon}</span> <span style="font-size:13px">${n.msg}</span> <button onclick="document.getElementById('smartNudgeBanner').style.display='none'" style="margin-left:auto;background:none;border:none;font-size:16px;cursor:pointer;color:var(--muted)">×</button>`;
}

// ════════════════════════════════════════
// 5. DOCTOR PORTAL
// ════════════════════════════════════════
async function loadDoctorPortal() {
  if (!window.user) return;
  const { data: prof } = await window.supa.from('user_profile').select('doctor_email,doctor_name').eq('id', window.user.id).maybeSingle();
  if (prof?.doctor_email) {
    document.getElementById('currentDoctorInfo').innerHTML = `<p style="font-size:13px;color:var(--muted)">Linked Doctor: <strong>${prof.doctor_name || prof.doctor_email}</strong></p>`;
  }
}

async function linkDoctor() {
  if (!window.user) return;
  const email = document.getElementById('doctorEmailInput')?.value?.trim();
  const name  = document.getElementById('doctorNameInput')?.value?.trim();
  if (!email || !email.includes('@')) { alert('Valid email daalo'); return; }
  const token = btoa(window.user.id + ':doctor:' + Date.now());
  await window.supa.from('user_profile').update({ doctor_email: email, doctor_name: name || null, doctor_token: token }).eq('id', window.user.id);
  const link = `${window.location.origin}?doctor_view=${token}`;
  document.getElementById('doctorLinkBox').style.display = 'block';
  document.getElementById('doctorLinkText').value = link;
  document.getElementById('currentDoctorInfo').innerHTML = `<p style="font-size:13px;color:var(--green)">✅ Doctor linked: ${name || email}</p>`;
}

function copyDoctorLink() {
  const txt = document.getElementById('doctorLinkText')?.value;
  if (!txt) return;
  navigator.clipboard.writeText(txt).then(() => {
    const btn = document.getElementById('copyDoctorLinkBtn');
    if (btn) { btn.textContent = '✅ Copied!'; setTimeout(() => btn.textContent = 'Copy', 2000); }
  });
}

// Check if doctor view
function checkDoctorView() {
  const params = new URLSearchParams(window.location.search);
  const token  = params.get('doctor_view');
  if (!token) return;
  document.body.insertAdjacentHTML('afterbegin', `
    <div style="background:linear-gradient(135deg,#7ab8d4,#6ab89a);color:white;padding:10px 20px;text-align:center;font-size:13px;font-weight:500;position:sticky;top:0;z-index:999">
      👨‍⚕️ Doctor View Mode — Read Only
    </div>`);
}
checkDoctorView();

// ════════════════════════════════════════
// 6. MILESTONE SHARE CARDS
// ════════════════════════════════════════
function generateMilestoneCard() {
  const week    = document.getElementById('shareWeekInput')?.value || '20';
  const message = document.getElementById('shareMessageInput')?.value || `Week ${week} mein hun! 🌸`;
  const emoji   = document.getElementById('shareEmojiInput')?.value || '🌸';
  const canvas  = document.getElementById('milestoneCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  canvas.width  = 800;
  canvas.height = 800;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 800, 800);
  grad.addColorStop(0, '#fdf6f0');
  grad.addColorStop(0.5, '#fce8e8');
  grad.addColorStop(1, '#fdf0e8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 800);

  // Border
  ctx.strokeStyle = '#e8a0a8';
  ctx.lineWidth = 8;
  ctx.roundRect(20, 20, 760, 760, 30);
  ctx.stroke();

  // Inner border
  ctx.strokeStyle = '#f5d5d8';
  ctx.lineWidth = 3;
  ctx.roundRect(40, 40, 720, 720, 20);
  ctx.stroke();

  // Emoji
  ctx.font = '140px serif';
  ctx.textAlign = 'center';
  ctx.fillText(emoji, 400, 280);

  // Week text
  ctx.fillStyle = '#c97b7b';
  ctx.font = 'bold 72px serif';
  ctx.fillText(`Week ${week}`, 400, 390);

  // Divider
  ctx.strokeStyle = '#e8a0a8';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(200, 420); ctx.lineTo(600, 420); ctx.stroke();

  // Message
  ctx.fillStyle = '#4a2c2a';
  ctx.font = '32px Arial';
  // Word wrap
  const words = message.split(' ');
  let line = '', y = 480;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > 660 && line !== '') {
      ctx.fillText(line, 400, y); line = word + ' '; y += 44;
    } else line = test;
  }
  ctx.fillText(line, 400, y);

  // Branding
  ctx.fillStyle = '#9a7070';
  ctx.font = '22px Arial';
  ctx.fillText('🌸 MamaCare — mamacare.gyanam.shop', 400, 740);

  // Show preview
  canvas.style.display = 'block';
  document.getElementById('cardDownloadBtn').style.display = 'block';
}

function downloadMilestoneCard() {
  const canvas = document.getElementById('milestoneCanvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `mamacare-week-${document.getElementById('shareWeekInput')?.value || 'bump'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function shareMilestoneCard() {
  const canvas = document.getElementById('milestoneCanvas');
  if (!canvas) return;
  canvas.toBlob(blob => {
    const file = new File([blob], 'mamacare-milestone.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      navigator.share({ title: 'MamaCare Milestone!', files: [file] });
    } else {
      downloadMilestoneCard();
    }
  });
}

// ════════════════════════════════════════
// 7. PARTNER VIEW (FIXED)
// ════════════════════════════════════════
async function loadPartnerViewData(token) {
  if (!window.supa) return;
  // Find user by token
  const { data: profile } = await window.supa
    .from('user_profile')
    .select('id,name,due_date,partner_perms')
    .eq('partner_token', token)
    .maybeSingle();
  if (!profile) { document.body.innerHTML = '<div style="text-align:center;padding:40px;font-family:sans-serif;color:#666">Invalid or expired link.</div>'; return; }
  const perms  = (profile.partner_perms || '').split(',');
  const uid    = profile.id;
  const dueStr = profile.due_date;
  const name   = profile.name || 'Maa';
  const due    = dueStr ? new Date(dueStr) : null;
  const now    = new Date();
  const week   = due ? Math.min(40, Math.floor((now - new Date(due.getTime()-280*86400000))/86400000/7)+1) : '—';
  const daysLeft = due ? Math.max(0, Math.round((due-now)/86400000)) : '—';

  // Build partner view
  document.body.innerHTML = `
    <div style="font-family:'DM Sans',sans-serif;background:#fdf6f0;min-height:100vh;padding:20px">
      <div style="max-width:480px;margin:0 auto">
        <div style="background:linear-gradient(135deg,rgba(232,160,168,.2),rgba(247,196,168,.15));border-radius:20px;padding:24px;text-align:center;margin-bottom:18px;border:1.5px solid rgba(232,160,168,.25)">
          <div style="font-size:40px;margin-bottom:8px">🌸</div>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.7rem;font-weight:300;color:#4a2c2a;margin-bottom:4px">${name} ki Pregnancy</h2>
          <p style="font-size:12px;color:#9a7070">Read-only partner view</p>
          <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
            <div style="background:white;border-radius:13px;padding:12px;text-align:center"><div style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#c97b7b">${week}</div><div style="font-size:11px;color:#9a7070">Week</div></div>
            <div style="background:white;border-radius:13px;padding:12px;text-align:center"><div style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#c97b7b">${daysLeft}</div><div style="font-size:11px;color:#9a7070">Days Left</div></div>
            <div style="background:white;border-radius:13px;padding:12px;text-align:center"><div style="font-size:1.3rem;color:#c97b7b">${week<=13?'🌱':week<=27?'🌸':'🌟'}</div><div style="font-size:11px;color:#9a7070">${week<=13?'1st Tri':week<=27?'2nd Tri':'3rd Tri'}</div></div>
          </div>
        </div>
        <div id="partnerDataSections"></div>
        <div style="text-align:center;padding:20px;font-size:12px;color:#9a7070">🌸 MamaCare — mamacare.gyanam.shop</div>
      </div>
    </div>`;

  // Load permitted sections
  const container = document.getElementById('partnerDataSections');
  if (!container) return;

  if (perms.includes('mood')) {
    const { data: moods } = await window.supa.from('mood_logs').select('mood_type,logged_at').eq('user_id', uid).order('logged_at', { ascending: false }).limit(5);
    if (moods?.length) {
      const moodIcons = { anxious:'😰',sad:'😢',angry:'😤',tired:'😴',nauseous:'🤢',overwhelmed:'🌊',scared:'😨',lonely:'🥺',happy:'😊',excited:'🥰' };
      container.insertAdjacentHTML('beforeend', `<div style="background:white;border-radius:18px;padding:18px;margin-bottom:14px;border:1.5px solid rgba(232,160,168,.15)"><h3 style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin-bottom:10px;color:#4a2c2a">😊 Recent Moods</h3>${moods.map(m=>`<div style="display:inline-block;margin:4px;padding:6px 12px;background:#fce8e8;border-radius:50px;font-size:13px">${moodIcons[m.mood_type]||'💗'} ${m.mood_type}</div>`).join('')}</div>`);
    }
  }
  if (perms.includes('weight')) {
    const { data: wts } = await window.supa.from('weight_logs').select('weight_kg,logged_at').eq('user_id', uid).order('logged_at', { ascending: false }).limit(1);
    if (wts?.length) container.insertAdjacentHTML('beforeend', `<div style="background:white;border-radius:18px;padding:18px;margin-bottom:14px;border:1.5px solid rgba(232,160,168,.15)"><h3 style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin-bottom:8px;color:#4a2c2a">⚖️ Latest Weight</h3><div style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#c97b7b">${wts[0].weight_kg} kg</div></div>`);
  }
  if (perms.includes('kicks')) {
    const today2 = new Date().toISOString().split('T')[0];
    const { data: kicks } = await window.supa.from('kick_logs').select('kick_count,session_date').eq('user_id', uid).eq('session_date', today2).maybeSingle();
    container.insertAdjacentHTML('beforeend', `<div style="background:white;border-radius:18px;padding:18px;margin-bottom:14px;border:1.5px solid rgba(232,160,168,.15)"><h3 style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin-bottom:8px;color:#4a2c2a">👶 Today's Kicks</h3><div style="font-family:'Cormorant Garamond',serif;font-size:2.5rem;color:${kicks?.kick_count>=10?'#6ab89a':'#c97b7b'}">${kicks?.kick_count||0} <span style="font-size:1rem">kicks</span></div>${kicks?.kick_count>=10?'<div style="color:#6ab89a;font-size:13px;margin-top:4px">✅ 10+ kicks — Normal!</div>':'<div style="color:#9a7070;font-size:12px;margin-top:4px">Goal: 10 kicks in 2 hours</div>'}</div>`);
  }
  if (perms.includes('appointments')) {
    const today3 = new Date().toISOString().split('T')[0];
    const { data: appts } = await window.supa.from('appointments').select('title,appt_date,doctor_name').eq('user_id', uid).gte('appt_date', today3).order('appt_date').limit(3);
    if (appts?.length) container.insertAdjacentHTML('beforeend', `<div style="background:white;border-radius:18px;padding:18px;margin-bottom:14px;border:1.5px solid rgba(232,160,168,.15)"><h3 style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin-bottom:10px;color:#4a2c2a">📅 Upcoming Appointments</h3>${appts.map(a=>`<div style="padding:8px 0;border-bottom:1px solid #f5d5d8;font-size:13px"><strong>${a.title}</strong> — ${new Date(a.appt_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}${a.doctor_name?' · '+a.doctor_name:''}</div>`).join('')}</div>`);
  }
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
function initSmart() {
  // Check partner view
  const params = new URLSearchParams(window.location.search);
  const partnerToken = params.get('partner_view');
  if (partnerToken) { loadPartnerViewData(partnerToken); return; }
  // Smart nudges
  setTimeout(checkSmartNudges, 3000);
  setInterval(checkSmartNudges, 15 * 60 * 1000); // Check every 15 min
  addSmartTabs();
}

function addSmartTabs() {
  const topTabs = document.getElementById('topTabs');
  if (!topTabs) return;
  [
    { page:'symptom-ai',  label:'🩺 Symptom AI'  },
    { page:'nutrition-ai',label:'🍎 Nutrition AI' },
    { page:'birthplan-ai',label:'📋 Plan AI'      },
    { page:'share-cards', label:'📸 Share Cards'  },
    { page:'doctor',      label:'👨‍⚕️ Doctor'       },
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
      { page:'symptom-ai',   icon:'🩺', label:'Symptom AI'   },
      { page:'nutrition-ai', icon:'🍎', label:'Nutrition AI'  },
      { page:'birthplan-ai', icon:'📋', label:'Plan AI'       },
      { page:'share-cards',  icon:'📸', label:'Share Cards'   },
      { page:'doctor',       icon:'👨‍⚕️', label:'Doctor Portal' },
    ].forEach(t => {
      if (!document.querySelector(`#moreMenu [data-page="${t.page}"]`)) {
        const div = document.createElement('div');
        div.className = 'more-item'; div.dataset.page = t.page;
        div.innerHTML = `<div class="mi-icon">${t.icon}</div><div class="mi-label">${t.label}</div>`;
        div.addEventListener('click', () => { document.getElementById('moreMenu').style.display='none'; if(window.MC?.goTo) window.MC.goTo(t.page); if(t.page==='doctor') loadDoctorPortal(); });
        moreGrid.appendChild(div);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  injectSmartPages();
  // Smart nudge banner injection
  const topBar = document.getElementById('topBar');
  if (topBar && !document.getElementById('smartNudgeBanner')) {
    topBar.insertAdjacentHTML('afterend', `<div id="smartNudgeBanner" style="display:none;background:linear-gradient(135deg,rgba(212,168,83,.12),rgba(232,160,168,.1));padding:10px 16px;display:none;align-items:center;gap:10px;font-size:13px;color:var(--warm);border-bottom:1px solid rgba(232,160,168,.15)"></div>`);
  }
});

function injectSmartPages() {
  if (document.getElementById('page-symptom-ai')) return;
  const footer = document.querySelector('footer');
  const html = `
<!-- SYMPTOM AI -->
<div class="page" id="page-symptom-ai">
  <div style="padding:20px 0 8px"><div class="sec-label">AI Assistant</div><div class="sec-title">Symptom AI 🩺</div></div>
  <div class="card" style="background:rgba(212,168,83,.06)"><p style="font-size:13px;color:var(--muted);line-height:1.7">⚠️ Ye AI triage tool hai — doctor ka substitute nahi. Emergency mein turant 108 call karo.</p></div>
  <div class="card">
    <div class="chat-box" id="symptomAIChatBox" style="min-height:220px">
      <div class="msg bot">Namaste! 🌸 Koi bhi symptom describe karo — main urgency assess karungi aur relief tips duungi.</div>
    </div>
    <div class="chat-row" style="margin-top:10px">
      <input id="symptomAIInput" type="text" placeholder="e.g. Kaafi swelling hai pair mein..." onkeydown="if(event.key==='Enter')SMART.sendSymptomAI()"/>
      <button class="btn btn-p btn-sm" onclick="SMART.sendSymptomAI()">Send 🩺</button>
    </div>
  </div>
</div>

<!-- NUTRITION AI -->
<div class="page" id="page-nutrition-ai">
  <div style="padding:20px 0 8px"><div class="sec-label">AI Assistant</div><div class="sec-title">Nutrition AI 🍎</div></div>
  <div class="card">
    <div class="sec-label">Aaj kya khaya?</div>
    <div class="sec-title">Food → Nutrients Analyzer</div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:12px;line-height:1.6">Jo khaaya wo describe karo — AI estimate karega calories, protein, iron, calcium, folate.</p>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <input id="nutritionAIInput" type="text" placeholder="e.g. Dal chawal + palak sabzi + dahi..." style="flex:1" onkeydown="if(event.key==='Enter')SMART.analyzeFood()"/>
      <button class="btn btn-p btn-sm" onclick="SMART.analyzeFood()">Analyze 🍽️</button>
    </div>
    <div id="nutritionAIResult"></div>
  </div>
  <div class="card" style="background:rgba(106,184,154,.06)">
    <div class="sec-title">💡 Try Karo</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${['2 roti + dal + curd','Poha + chai + banana','Rajma chawal + salad','Idli sambar + coconut chutney'].map(s=>
        `<button class="btn btn-g btn-sm" onclick="document.getElementById('nutritionAIInput').value='${s}'" style="text-align:left">${s}</button>`).join('')}
    </div>
  </div>
</div>

<!-- BIRTH PLAN AI -->
<div class="page" id="page-birthplan-ai">
  <div style="padding:20px 0 8px"><div class="sec-label">AI Generator</div><div class="sec-title">Birth Plan AI 📋</div></div>
  <div class="card">
    <div style="text-align:center;padding:12px 0 18px">
      <div style="font-size:44px;margin-bottom:10px">📋</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;margin-bottom:8px">AI-Generated Birth Plan</div>
      <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:16px">5-6 questions ke baad Claude AI aapka personalized birth plan likh dega — Hindi mein, doctor-ready.</p>
      <button class="btn btn-p" onclick="SMART.startBirthPlanAI()">✨ Generate My Birth Plan</button>
    </div>
    <div id="bpAIQuestions"></div>
    <div id="bpAIResult" style="display:none">
      <div class="sec-label">Your Birth Plan</div>
      <div id="bpAIResultText" style="font-size:13.5px;color:var(--warm);line-height:1.9;padding:14px;background:var(--cream);border-radius:14px;margin-bottom:12px"></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-p" onclick="SMART.printAIBirthPlan()">🖨️ Print</button>
        <button class="btn btn-g" onclick="SMART.startBirthPlanAI()">🔄 Regenerate</button>
      </div>
    </div>
  </div>
</div>

<!-- SHARE CARDS -->
<div class="page" id="page-share-cards">
  <div style="padding:20px 0 8px"><div class="sec-label">Share</div><div class="sec-title">Milestone Cards 📸</div></div>
  <div class="card">
    <div class="sec-label">Customize</div>
    <div class="g2" style="margin-bottom:10px">
      <div><label>Week Number</label><input type="number" id="shareWeekInput" value="20" min="1" max="40"/></div>
      <div><label>Emoji</label><input type="text" id="shareEmojiInput" value="🌸" maxlength="4"/></div>
    </div>
    <div style="margin-bottom:14px"><label>Message</label><input type="text" id="shareMessageInput" placeholder="Week 20 mein hun! Baby kick kar raha hai 💗"/></div>
    <button class="btn btn-p btn-sm" onclick="SMART.generateMilestoneCard()">✨ Generate Card</button>
  </div>
  <div class="card" style="text-align:center">
    <canvas id="milestoneCanvas" style="display:none;max-width:100%;border-radius:16px;margin-bottom:14px"></canvas>
    <div id="cardDownloadBtn" style="display:none">
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-p" onclick="SMART.downloadMilestoneCard()">⬇️ Download</button>
        <button class="btn btn-g" onclick="SMART.shareMilestoneCard()">📱 Share</button>
      </div>
    </div>
  </div>
  <div class="card" style="background:rgba(232,160,168,.06)">
    <div class="sec-title">Quick Templates</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${[
        ['20','🌸','Halfway there! Baby kicks feel kar rahi hun 💗'],
        ['28','🌟','Teen-teesra mahina shuru! Almost there!'],
        ['36','🥥','Full term approaching! Hospital bag ready hai 🏥'],
        ['40','🎊','Due date! Baby se milne wali hun! 💗'],
      ].map(([wk,em,msg]) => `<button class="btn btn-g btn-sm" style="text-align:left" onclick="document.getElementById('shareWeekInput').value='${wk}';document.getElementById('shareEmojiInput').value='${em}';document.getElementById('shareMessageInput').value='${msg}'">Week ${wk}: ${msg}</button>`).join('')}
    </div>
  </div>
</div>

<!-- DOCTOR PORTAL -->
<div class="page" id="page-doctor">
  <div style="padding:20px 0 8px"><div class="sec-label">Medical</div><div class="sec-title">Doctor Portal 👨‍⚕️</div></div>
  <div class="card" style="text-align:center;padding:24px">
    <div style="font-size:44px;margin-bottom:10px">👨‍⚕️</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;margin-bottom:8px">Apne Doctor ko Connect Karo</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.7">Doctor aapka weight, BP, sugar, mood, appointments ek jagah dekh sakenge — read-only access.</p>
  </div>
  <div id="currentDoctorInfo" class="card"></div>
  <div class="card">
    <div class="sec-label">Link Doctor</div>
    <div style="margin-bottom:10px"><label>Doctor ka Naam</label><input type="text" id="doctorNameInput" placeholder="Dr. Sharma..."/></div>
    <div style="margin-bottom:14px"><label>Doctor ka Email</label><input type="email" id="doctorEmailInput" placeholder="doctor@hospital.com"/></div>
    <button class="btn btn-p btn-sm" onclick="SMART.linkDoctor()">🔗 Generate Doctor Link</button>
    <div id="doctorLinkBox" style="display:none;margin-top:12px;background:var(--cream);border-radius:12px;padding:14px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:6px">Doctor ke liye link (WhatsApp ya email pe bhejo):</div>
      <div style="display:flex;gap:8px">
        <input id="doctorLinkText" type="text" readonly style="flex:1;font-size:11px"/>
        <button id="copyDoctorLinkBtn" class="btn btn-p btn-sm" onclick="SMART.copyDoctorLink()">Copy</button>
      </div>
    </div>
  </div>
  <div class="card" style="background:rgba(106,184,154,.06)">
    <div class="sec-title">Doctor Dashboard mein kya dikhega?</div>
    <div style="font-size:13px;line-height:2;color:var(--muted)">
      ✅ Current week + due date<br>
      ✅ Weight trend (last 30 days)<br>
      ✅ BP logs + sugar readings<br>
      ✅ Sleep pattern<br>
      ✅ Medicine compliance<br>
      ✅ Upcoming appointments<br>
      ✅ Mood pattern (last 7 days)
    </div>
  </div>
</div>
`;
  if (footer) footer.insertAdjacentHTML('beforebegin', html);
  else document.body.insertAdjacentHTML('beforeend', html);
}

window.SMART = {
  initSmart, checkSmartNudges,
  sendSymptomAI,
  analyzeFood,
  startBirthPlanAI, bpAISelect, bpAIBack, generateBirthPlanFromAI, printAIBirthPlan,
  generateMilestoneCard, downloadMilestoneCard, shareMilestoneCard,
  loadDoctorPortal, linkDoctor, copyDoctorLink,
};
