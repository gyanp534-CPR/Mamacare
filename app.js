/**
 * MamaCare v7.7 — app.js (FULLY CONNECTED & STABLE)
 * Fixes: Centralized Event Listeners, Stabilized Routing, Failsafe DB
 */
'use strict';

// ══════════════════════════════════════
// SUPABASE CONFIG (WITH FAILSAFE)
// ══════════════════════════════════════
const SUPA_URL = 'https://denspwxohwxconxfbaor.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbnNwd3hvaHd4Y29ueGZiYW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjkwNjIsImV4cCI6MjA5MTMwNTA2Mn0.LgZFCpyPi1W521PkYLRO--nLV6fpAnNgg1G40SMmAVU';

let supa = null;
try {
  supa = supabase.createClient(SUPA_URL, SUPA_KEY);
  window.supa = supa;
} catch(err) {
  console.warn("Database connection delayed. UI will load offline.", err);
}

// ══════════════════════════════════════
// VITAL HELPER: DRAW ICONS AFTER DOM UPDATE
// ══════════════════════════════════════
function renderIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

// ══════════════════════════════════════
// LANGUAGE STRINGS
// ══════════════════════════════════════
const LANG = {
  hinglish:{
    moodHero:'Pregnancy mein <em>mood swings</em><br>normal hain, aap akeli nahi <i data-lucide="heart-handshake" style="display:inline; width:28px; height:28px; color:var(--accent);"></i>',
    moodStep:'Abhi kaisi feel kar rahi hain?',breathTitle:'4-4-4 Box Breathing',
    breathStart:'Shuru Karein',breathStop:'Band Karein',
    affirmTitle:'Aaj ki Affirmation',affirmBtn:'Nayi',
    chatTitle:'MamaCare AI Companion',chatHint:'Apni baat likhein...',chatSend:'Send',
    chatGreeting:'Namaste! Main MamaCare hun. Aaj kaisi feel kar rahi hain? Kuch bhi share karein.',
    lmpLbl:'Last Menstrual Period (LMP)',dueLbl:'Ya Due Date daalo',
    startLbl:'Shuruat',endLbl:'Due Date',thisWeekLbl:'Is Hafte',
    wtKg:'Weight (kg)',wtWk:'Week',preWt:'Pre-pregnancy weight (kg)',wtAdd:'+ Log',
    bedLbl:'Bedtime',wakeLbl:'Wake time',qualLbl:'Quality',issueLbl:'Issue',sleepAdd:'+ Log Sleep',
    waterGoal:'Goal: 8–10 glasses — tap to fill',
    foodAdd:'+ Add',mealTitle:'Expert Diet Guide',
    medAdd:'+ Add Medicine',medSave:'Save',
    bagReset:'Reset',bagAdd:'+ Add Item',
    jWkLbl:'Week',jDtLbl:'Date',jMoodLbl:'Mood',jTxtLbl:'Likhein...',
    jPhotoLbl:'Photo (gallery mein save hogi)',jPhotoBtn:'Photo chuniye',
    jSave:'Save Entry',jTimeline:'Meri Diary',
    apptAdd:'+ Save',apptTitle:'Upcoming Appointments',
    bpNote:'💡 Doctor ko delivery se pehle dijiye. Medical emergency mein doctor ka decision final hoga.',
    ppCongrats:'Congratulations, Maa! <i data-lucide="heart" class="app-icon-inline" style="color:var(--accent); fill:var(--accent)"></i>',
    ppSub:'Khud ka khayal rakhna utna hi zaroori hai jitna baby ka.',
    sympHint:'Symptom search karein...',sympDisc:'⚠️ General info ke liye — severe symptoms mein doctor se milein.',
    sosDesc:'Emergency mein yeh button dabao — GPS nearest hospital dhundega',
    logoutQ:'Logout karna chahte ho?',synced:'Synced',savedOff:'Saved',
    m_anxious:'Anxious',m_sad:'Udaas',m_angry:'Gussa',m_tired:'Thakaan',
    m_nauseous:'Nausea',m_overwhelmed:'Overwhelmed',m_scared:'Dara hua',
    m_lonely:'Akela',m_happy:'Khush',m_excited:'Excited',
    t1:'Pehli',t2:'Doosri',t3:'Teesri',tri:'Trimester',wk:'Week',
    days:'days baaki',done:'complete',baby:'Baby',body:'Body',tip:'Tip',mTip:'Mood Tip',
  },
  en:{
    moodHero:'Pregnancy <em>mood swings</em><br>are completely normal <i data-lucide="heart-handshake" style="display:inline; width:28px; height:28px; color:var(--accent);"></i>',
    moodStep:'How are you feeling right now?',breathTitle:'4-4-4 Box Breathing',
    breathStart:'Start Breathing',breathStop:'Stop',
    affirmTitle:"Today's Affirmation",affirmBtn:'New',
    chatTitle:'MamaCare AI Companion',chatHint:'Share anything...',chatSend:'Send',
    chatGreeting:"Hello! I'm MamaCare. How are you feeling today?",
    lmpLbl:'Last Menstrual Period',dueLbl:'Or enter Due Date',startLbl:'Start',endLbl:'Due Date',
    thisWeekLbl:'This Week',wtKg:'Weight (kg)',wtWk:'Week',preWt:'Pre-pregnancy weight',wtAdd:'+ Log',
    bedLbl:'Bedtime',wakeLbl:'Wake time',qualLbl:'Quality',issueLbl:'Issue',sleepAdd:'+ Log Sleep',
    waterGoal:'Goal: 8–10 glasses daily',foodAdd:'+ Add',mealTitle:'Expert Meal Guide',
    medAdd:'+ Add Medicine',medSave:'Save',bagReset:'Reset',bagAdd:'+ Add',
    jWkLbl:'Week',jDtLbl:'Date',jMoodLbl:'Mood',jTxtLbl:'Write anything...',
    jPhotoLbl:'Photo (saved to gallery)',jPhotoBtn:'Select Photo',jSave:'Save Entry',jTimeline:'My Diary',
    apptAdd:'+ Save',apptTitle:'Upcoming Appointments',
    bpNote:'💡 Share with your doctor before delivery.',
    ppCongrats:'Congratulations, Mama! <i data-lucide="heart" class="app-icon-inline" style="color:var(--accent); fill:var(--accent)"></i>',ppSub:'Taking care of yourself matters as much as caring for baby.',
    sympHint:'Search symptoms...',sympDisc:'⚠️ General info only — consult doctor for serious symptoms.',
    sosDesc:'Press this button in emergency — GPS finds nearest hospital',
    logoutQ:'Are you sure you want to logout?',synced:'Synced',savedOff:'Saved',
    m_anxious:'Anxious',m_sad:'Sad',m_angry:'Angry',m_tired:'Tired',
    m_nauseous:'Nauseous',m_overwhelmed:'Overwhelmed',m_scared:'Scared',
    m_lonely:'Lonely',m_happy:'Happy',m_excited:'Excited',
    t1:'First',t2:'Second',t3:'Third',tri:'Trimester',wk:'Week',
    days:'days left',done:'complete',baby:'Baby',body:'Body',tip:'Tip',mTip:'Mood Tip',
  }
  // (Keep your other languages here if needed)
};

// ══════════════════════════════════════
// STATE
// ══════════════════════════════════════
let user = null;
let lang = localStorage.getItem('mc_lang') || 'hinglish';
let T = LANG[lang] || LANG.hinglish;
let chatHist = [];
let breathTimer = null, breathOn = false, breathRounds = 0;
let affIdx = 0;
let jMood = 'smile'; // Lucide icon name 
let photoFile = null;
let mealTab = 'breakfast';
let yogaFilterKey = 'all';
let nameFilterKey = 'all';
let sympFilterKey = 'all';
let wtChart = null, slChart = null;
let waterCount = 0;
let foodLogs = [], medicines = [], medTaken = {};
let bagItems = [], savedNames = [], journalList = [], apptList = [];

// ══════════════════════════════════════
// HELPERS
// ══════════════════════════════════════
const $ = id => document.getElementById(id);
const setText = (id, v) => { const e=$(id); if(e) e.textContent=v; };
const setHTML = (id, v) => { const e=$(id); if(e) e.innerHTML=v; };
function flash(id, msg) {
  const e = $(id); if(!e) return;
  if(msg) e.innerHTML = `<i data-lucide="cloud-lightning" class="app-icon-inline"></i> ${msg}`;
  e.classList.add('show');
  renderIcons();
  setTimeout(()=>e.classList.remove('show'), 2000);
}
const fmtDate = d => { try { return new Date(d).toLocaleDateString('hi-IN',{day:'numeric',month:'long',year:'numeric'}); } catch { return d||''; }};
const todayStr = () => new Date().toISOString().split('T')[0];

// ══════════════════════════════════════
// LANGUAGE 
// ══════════════════════════════════════
function applyLang(l) {
  lang = l; T = LANG[l] || LANG.hinglish;
  localStorage.setItem('mc_lang', l);
  document.getElementById('htmlRoot').lang = {hi:'hi',mr:'hi',ta:'ta',bn:'bn',te:'te'}[l]||'en';

  const M = {
    moodHeroText:       {html: T.moodHero},
    moodStepLabel:      {text: T.moodStep},
    moodSelectTitle:    {text: T.moodStep},
    breathTitle:        {text: T.breathTitle},
    breathBtn:          {html: `<i data-lucide="wind" class="app-icon-inline"></i> ${T.breathStart}`},
    affirmTitle:        {text: T.affirmTitle},
    affirmBtn:          {html: `<i data-lucide="sparkles" class="app-icon-inline"></i> ${T.affirmBtn}`},
    chatTitle:          {text: T.chatTitle},
    chatInput:          {ph: T.chatHint},
    chatSendBtn:        {html: `<i data-lucide="send" class="app-icon-inline"></i> ${T.chatSend}`},
    lmpLabel:           {text: T.lmpLbl},
    dueDateLabel:       {text: T.dueLbl},
    startLabel:         {text: T.startLbl},
    endLabel:           {text: T.endLbl},
    thisWeekLabel:      {text: T.thisWeekLbl},
    wtKgLabel:          {text: T.wtKg},
    wtWeekLabel:        {text: T.wtWk},
    preWeightLabel:     {text: T.preWt},
    wtAddBtn:           {html: `<i data-lucide="plus" class="app-icon-inline"></i> ${T.wtAdd}`},
    bedtimeLabel:       {text: T.bedLbl},
    wakeLabel:          {text: T.wakeLbl},
    qualityLabel:       {text: T.qualLbl},
    issueLabel:         {text: T.issueLbl},
    sleepLogBtn:        {html: `<i data-lucide="moon" class="app-icon-inline"></i> ${T.sleepAdd}`},
    waterGoalText:      {text: T.waterGoal},
    foodAddBtn:         {html: `<i data-lucide="plus" class="app-icon-inline"></i> ${T.foodAdd}`},
    mealPlanTitle:      {text: T.mealTitle},
    addMedBtn:          {html: `<i data-lucide="plus" class="app-icon-inline"></i> ${T.medAdd}`},
    saveMedBtn:         {text: T.medSave},
    bagResetBtn:        {html: `<i data-lucide="rotate-ccw" class="app-icon-inline"></i> ${T.bagReset}`},
    bagAddBtn:          {html: `<i data-lucide="plus" class="app-icon-inline"></i> ${T.bagAdd}`},
    jWeekLabel:         {text: T.jWkLbl},
    jDateLabel:         {text: T.jDtLbl},
    jMoodLabel:         {text: T.jMoodLbl},
    jTextLabel:         {text: T.jTxtLbl},
    jPhotoLabel:        {text: T.jPhotoLbl},
    photoUploadText:    {text: T.jPhotoBtn},
    saveJournalBtn:     {html: `<i data-lucide="heart" class="app-icon-inline" style="fill:currentColor"></i> ${T.jSave}`},
    journalTimelineTitle:{text: T.jTimeline},
    addApptBtn:         {html: `<i data-lucide="calendar-plus" class="app-icon-inline"></i> ${T.apptAdd}`},
    apptUpcomingTitle:  {text: T.apptTitle},
    bpNote:             {text: T.bpNote},
    ppCongrats:         {text: T.ppCongrats},
    ppSubtext:          {text: T.ppSub},
    sympDisclaimer:     {text: T.sympDisc},
    symptomSearch:      {ph: T.sympHint},
    sosDesc:            {text: T.sosDesc},
  };
  Object.entries(M).forEach(([id, op]) => {
    const el = $(id); if(!el) return;
    if(op.html) el.innerHTML = op.html;
    else if(op.text !== undefined) el.textContent = op.text;
    else if(op.ph) el.placeholder = op.ph;
  });

  renderMoodGrid();
  renderYogaGrid();
  renderIcons();
  if(user && supa) { supa.from('user_profile').update({language:l}).eq('id',user.id).then(()=>{}); }
}

// ══════════════════════════════════════
// 🔌 DYNAMIC EVENT BINDERS (NEW FIX)
// ══════════════════════════════════════
function bindStaticEvents() {
  const bind = (id, evt, fn) => { const el = $(id); if (el) el.addEventListener(evt, fn); };

  // Auth 
  bind('authEmail', 'keydown', e => { if(e.key==='Enter') sendOTP(); });
  bind('authSendBtn', 'click', sendOTP);
  bind('authVerifyBtn', 'click', verifyOTP);
  for(let i=0; i<=5; i++) bind('otp'+i, 'input', function() { otpInput(this, i); });
  bind('authBackBtn', 'click', e => { e.preventDefault(); showStep(1); });
  bind('authResendBtn', 'click', e => { e.preventDefault(); sendOTP(); });

  // Top Bar & Logout
  bind('logoutBtn', 'click', logout);

  // Mood & Chat
  bind('breathBtn', 'click', startBreathing);
  bind('affirmBtn', 'click', newAffirmation);
  bind('chatInput', 'keydown', e => { if(e.key==='Enter') sendChat(); });
  bind('chatSendBtn', 'click', sendChat);

  // Due Date
  bind('lmpDate', 'change', calcDue);
  bind('directDue', 'change', calcFromDue);

  // Weight
  bind('preWeight', 'change', savePreWeight);
  bind('logWeightBtn', 'click', addWeight);

  // Sleep
  bind('logSleepBtn', 'click', logSleep);

  // Nutrition
  bind('addFoodBtn', 'click', addFood);

  // Medicines
  bind('toggleMedFormBtn', 'click', toggleAddMedForm);
  bind('saveMedBtn', 'click', addMedicine);

  // Hospital Bag
  bind('resetBagBtn', 'click', resetBag);
  bind('addCustomBagBtn', 'click', addCustomBagItem);

  // Names & Symptoms
  bind('nameSearch', 'keyup', renderNames);
  bind('symptomSearch', 'keyup', filterSymptoms);

  // Journal
  bind('triggerPhotoBtn', 'click', () => $('photoUpload')?.click());
  bind('photoUpload', 'change', function() { handlePhoto(this); });
  bind('saveJournalBtn', 'click', saveJournalEntry);

  // Appointments
  bind('saveApptBtn', 'click', addAppointment);

  // SOS
  bind('findHospBtn', 'click', findHospital);
  bind('addContactBtn', 'click', addEC);

  // ALL Navigation Routing
  document.querySelectorAll('.top-tab, .bn-item, .more-item, .feature-item').forEach(btn => {
    if (btn.id === 'moreBtn') return; 
    if (btn.dataset.page) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(btn.dataset.page);
      });
    }
  });

  // More Menu Toggle
  const moreBtn = $('moreBtn');
  if (moreBtn) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const m = $('moreMenu');
      if (m) m.style.display = m.style.display === 'block' ? 'none' : 'block';
    });
  }

  // Language Bar 
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      applyLang(b.dataset.lang);
    });
  });

  // Close More Menu on outside click
  document.addEventListener('click', e => {
    const m = $('moreMenu');
    if (m && !m.contains(e.target) && e.target.id !== 'moreBtn') {
      m.style.display = 'none';
    }
  });
}

// ══════════════════════════════════════
// AUTH
// ══════════════════════════════════════
async function sendOTP() {
  if(!supa) { alert("Database connecting... Please wait."); return; }
  const email = $('authEmail')?.value?.trim();
  if(!email||!email.includes('@')) { setHTML('authMsg','<span style="color:#e05c5c">Valid email daalo <i data-lucide="alert-circle" class="app-icon-inline"></i></span>'); renderIcons(); return; }
  const btn=$('authSendBtn'); btn.disabled=true; btn.textContent='Sending...';
  const {error} = await supa.auth.signInWithOtp({email, options:{shouldCreateUser:true}});
  btn.disabled=false; btn.innerHTML='Magic Link Bhejo <i data-lucide="wand-2" class="app-icon-inline"></i>';
  if(error) setHTML('authMsg',`<span style="color:#e05c5c">${error.message}</span>`);
  else { setHTML('authOTPMsg',`<strong>${email}</strong> pe OTP bheja! Spam bhi check karein.`); showStep(2); }
  renderIcons();
}

function showStep(n) {
  if($('authStep1')) $('authStep1').style.display = n===1?'block':'none';
  if($('authStep2')) $('authStep2').style.display = n===2?'block':'none';
}

async function verifyOTP() {
  if(!supa) return;
  const email=$('authEmail')?.value?.trim();
  const token=[0,1,2,3,4,5].map(i=>$('otp'+i)?.value||'').join('');
  if(token.length!==6){setHTML('authMsg','<span style="color:#e05c5c">6-digit code daalo</span>');return;}
  const btn=$('authVerifyBtn'); btn.disabled=true; btn.textContent='Verifying...';
  const {data,error}=await supa.auth.verifyOtp({email,token,type:'email'});
  btn.disabled=false; btn.textContent='Verify & Login';
  if(error) setHTML('authMsg','<span style="color:#e05c5c">Wrong code. Try again.</span>');
  else if(data.user) onLogin(data.user);
}

function otpInput(el, idx) {
  el.value=el.value.replace(/\D/g,'');
  if(el.value&&idx<5) $('otp'+(idx+1))?.focus();
  if(idx===5&&el.value) verifyOTP();
}

async function onLogin(u) {
  user=u; window.user=u;
  if ($('authScreen')) $('authScreen').style.display='none';
  if ($('langBar'))    $('langBar').style.display='flex';
  if ($('topBar'))     $('topBar').style.display='block';
  if ($('bottomNav'))  $('bottomNav').classList.add('nav-visible');
  
  const em=u.email||''; setText('topUserEmail', em.length>22?em.slice(0,19)+'...':em);
  
  if(supa) {
    const {data:prof}=await supa.from('user_profile').select('*').eq('id',u.id).maybeSingle();
    if(prof){
      if(prof.language&&LANG[prof.language]){
        lang=prof.language;
        document.querySelectorAll('.lang-btn').forEach(b=>{b.classList.toggle('active',b.dataset.lang===lang);});
      }
      if(prof.due_date){if($('directDue')) $('directDue').value=prof.due_date; calcFromDue();}
      if(prof.lmp_date) if($('lmpDate')) $('lmpDate').value=prof.lmp_date;
      if(prof.pre_weight) if($('preWeight')) $('preWeight').value=prof.pre_weight;
    }
  }
  
  applyLang(lang);
  const cb=$('chatBox'); if(cb){cb.innerHTML=''; addBotMsg(T.chatGreeting);}
  affIdx=Math.floor(Math.random()*AFFIRMATIONS.length);
  setText('affirmText',AFFIRMATIONS[affIdx]);
  
  initYogaFilters(); initNutrition(); initBirthPlan(); initPostpartum();
  initSOS(); initSymptoms(); initAppointmentChecklist(); initJournal();
  initSupplementGuide(); renderDashboard();
  
  // Call plugins if they exist
  if (window.TRACKER)  window.TRACKER.initTrackers();
  if (window.ONBOARD)  window.ONBOARD.checkOnboarding(u);
  if (window.PREMIUM)  { window.PREMIUM.load().then(() => { window.PREMIUM.loadBadge(); window.PREMIUM.updatePage(); }); }
  if (window.BABY)     window.BABY.initBaby();
  if (window.INDIA)    window.INDIA.initIndia();
  if (window.SMART)    window.SMART.initSmart();
  
  renderIcons();
}

async function logout(){
  if(!confirm(T.logoutQ)) return;
  if(supa) await supa.auth.signOut();
  user=null; window.user=null;

  chatHist=[]; waterCount=0;
  foodLogs=[]; medicines=[]; medTaken={};
  bagItems=[]; savedNames=[]; journalList=[]; apptList=[];

  if ($('authScreen')) $('authScreen').style.display='flex';
  if ($('langBar'))    $('langBar').style.display='none';
  if ($('topBar'))     $('topBar').style.display='none';
  if ($('bottomNav'))  $('bottomNav').classList.remove('nav-visible');
  
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  if ($('page-dashboard')) $('page-dashboard').classList.add('active');
}

// Initialization Entry Point
window.addEventListener('DOMContentLoaded', async () => {
  bindStaticEvents(); // Wire up all the clean HTML IDs
  
  if(supa) {
    const {data:{session}}=await supa.auth.getSession();
    if(session?.user) onLogin(session.user);
    else applyLang(lang);
  } else {
    applyLang(lang);
  }
});

// ══════════════════════════════════════
// CENTRALIZED NAVIGATION (FIXED ROUTING)
// ══════════════════════════════════════
function goTo(id) {
  try {
    // 1. Hide all pages, remove active states
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.top-tab, .bn-item').forEach(t => t.classList.remove('active'));
    
    // 2. Show target page
    const target = document.getElementById(`page-${id}`);
    if(target) target.classList.add('active');
    
    // 3. Highlight current tabs
    const tab = document.querySelector(`.top-tab[data-page="${id}"]`); 
    if(tab) tab.classList.add('active');
    
    const bn = document.querySelector(`#bottomNav .bn-item[data-page="${id}"]`); 
    if(bn) bn.classList.add('active');
    
    // 4. Cleanup
    const more = document.getElementById('moreMenu');
    if(more) more.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 5. Fire specific page load scripts
    const loads = {
      dashboard: renderDashboard,
      weight: loadWeights,
      sleep: loadSleepLogs,
      nutrition: () => { loadFoodLog(); loadWater(); },
      medicine: () => { loadMedicines(); switchMedTab('meds'); },
      bag: loadBag,
      names: loadNames,
      journal: loadJournal,
      appointments: loadAppointments,
      kick: () => { if(window.TRACKER) window.TRACKER.initKickCounter(); },
      bp: () => { if(window.TRACKER) window.TRACKER.loadBP(); },
      sugar: () => { if(window.TRACKER) window.TRACKER.loadSugar(); },
      premium: () => { if(window.PREMIUM) window.PREMIUM.updatePage(); },
      baby: () => { if(window.BABY) window.BABY.initBaby(); },
      vaccines: () => { if(window.BABY) window.BABY.loadVaccinations(); },
      milestones: () => { if(window.BABY) window.BABY.loadMilestones(); },
      'baby-feed': () => { if(window.BABY) window.BABY.renderBabyFeedLog(); },
      'baby-sleep': () => { if(window.BABY) window.BABY.loadBabySleepLogs(); },
      india: () => { if(window.INDIA) window.INDIA.renderGovSchemes(); },
      ayurveda: () => { if(window.INDIA) window.INDIA.renderAyurvedaTri(1); },
      sympdiary: () => { if(window.INDIA) window.INDIA.loadSymptomTrend(); },
      doctor: () => { if(window.SMART) window.SMART.loadDoctorPortal(); },
      contractions: () => { if(window.renderContractionHistory) window.renderContractionHistory(); },
    };
    
    if(loads[id]) loads[id]();
    renderIcons();
    
  } catch(err) {
    console.error('Navigation Error:', err);
  }
}

// ══════════════════════════════════════
// MOOD
// ══════════════════════════════════════
const MOODS={
  anxious:{e:'<i data-lucide="cloud-lightning"></i>',key:'m_anxious',why:'Estrogen + progesterone rapidly change → amygdala hyper-reactive. HCG bhi anxiety badhata hai.',tips:[['4-4-4 Breathing','Vagus nerve activate → cortisol 23% kam. Inhale 4, hold 4, exhale 4.'],['5-4-3-2-1 Grounding','5 dekho, 4 chho, 3 suno, 2 sungo, 1 taste. Anxiety override hoti hai.'],['Body Scan','Aankhein band. Pair se sir tak muscles dheel do consciously.'],['Write Fears','Worst case likho, then "how would I cope?" — 93% fears sach nahi hote.'],['Partner Talk','"Bas sunna chahti hun" ya "Solution chahiye" — clear karein kya chahiye.'],['CBT Therapy','4-6 sessions mein significant improvement. Pregnancy mein safe hai.']]},
  sad:{e:'<i data-lucide="cloud-rain"></i>',key:'m_sad',why:'Serotonin/dopamine levels change + sleep deprivation + identity shift = sadness.',tips:[['Cry Freely','Tears mein natural stress hormones release hote hain — rone do.'],['Sunlight','Subah 10-20 min direct sun → serotonin naturally badhti hai.'],['10-min Walk','Dopamine release karta hai. Inactivity depression maintain karti hai.'],['One Phone Call','"Main theek nahi hun" kehna strength hai. Ek call kaafi hai.'],['Journal','Unsent letter — feelings likh do bina bheje. Processing hoti hai.'],['Doctor','2+ weeks sadness + appetite/sleep issues → prenatal depression — treat karo.']]},
  angry:{e:'<i data-lucide="flame"></i>',key:'m_angry',why:'Progesterone drop + estrogen surge → amygdala 40% more sensitive. Physical discomfort compound karta hai.',tips:[['STOP Method','Stop. Take breath. Observe sensations. Proceed. 10 sec gap creates space.'],['Cold Water','Haath thande paani mein 15 sec → diving reflex heart rate instantly kam karta hai.'],['10-min Walk','Adrenaline naturally discharge hota hai safely.'],['Trigger Diary','Time, hunger level, sleep quality note karo — pattern identify karo.'],['Partner Script','"Mere hormones bahut unbalanced hain — yeh personal nahi hai."'],['Humor','Absurdity mein humor dhundho — release hota hai.']]},
  tired:{e:'<i data-lucide="battery-low"></i>',key:'m_tired',why:'Progesterone sedative effect + 50% blood volume increase + organ development = energy drain.',tips:[['20-min Power Nap','Slow wave se pehle uthna — no grogginess. 1-3pm ideal time.'],['Iron Check','Normal Hb > 11g/dL. Palak + nimbu saath = iron absorption 3x.'],['Hydration','1L dehydration = 20% energy drop. Min 2.5-3L fluid daily.'],['Cancel Plans','Social obligations cancel karna aaj valid hai.'],['Thyroid Check','Hypothyroidism common in pregnancy — TSH test karwao if severe.'],['Cold Shower','2 min cold water → cortisol + adrenaline natural boost.']]},
  nauseous:{e:'<i data-lucide="waves"></i>',key:'m_nauseous',why:'HCG hormone week 8-10 pe peak. Smell sensitivity dramatically badhti hai.',tips:[['Ginger','1g daily ginger → nausea 40% reduce (clinical evidence). Gingerols block 5-HT3.'],['Small Meals','Khali pet = bile + worst nausea. Har 2 hrs mein thoda khaao.'],['Vitamin B6','Pyridoxine 10-25mg 3x daily — clinically proven. Banana, sweet potato.'],['Acupressure P6','Wrist ke andar 3 fingers down — firm pressure 2-3 min. Sea-bands bhi kaam karte hain.'],['Cold Foods','Garam khaane ki smell trigger hai. Cold dahi/fruits better tolerated.'],['Hyperemesis Alert','3+ vomits/day, weight loss, unable to keep fluids → IMMEDIATE doctor.']]},
  overwhelmed:{e:'<i data-lucide="tornado"></i>',key:'m_overwhelmed',why:'Cognitive overload + hormones + identity restructuring (matrescence). Brain literally reorganize ho raha hai.',tips:[['Brain Dump','Sab unfiltered likho. Working memory free → anxiety 30% kam.'],['2-List Method','List A: Serious consequences if not done. List B: Rest. Sirf A ke 2-3 items aaj.'],['Reduce Decisions','Daily choices pre-plan karo — decision fatigue real hai.'],['Say No','"Main abhi available nahi hun" complete sentence hai.'],['Specific Ask','"Kya tum groceries la sakte ho?" vs "Help karo" → 3x more effective.'],['Matrescence','"Kaun hun main ab?" — identity shift normal hai. Acknowledge karo.']]},
  scared:{e:'<i data-lucide="alert-triangle"></i>',key:'m_scared',why:'Amygdala hyperactive in pregnancy — evolutionary programming, sometimes maladaptive today.',tips:[['Learn About It','Specific fears ke baare mein padho — unknown zyada scary hota hai.'],['Birth Plan','Options jaanno → helplessness kam → fear reduce.'],['Positive Stories','Curated positive birth stories sirf — negative ones avoid.'],['Fear Exercise','Worst case → how would I cope → reality check. 90% fears unrealistic.'],['EMDR/CBT','Tokophobia treatable hai — 4-6 sessions. Seeking help = smart.'],['Partner Brief','Vague "main scared hun" se specific fears → practical support possible.']]},
  lonely:{e:'<i data-lucide="user-minus"></i>',key:'m_lonely',why:'Social circles shift + maternity leave isolation + relationship dynamics change.',tips:[['Pregnancy Groups','Same stage ke log — WhatsApp local groups, BabyCenter India.'],['Acknowledge Shift','Matrescence identity transition existential loneliness cause karta hai.'],['Schedule Calls','Calendar pe weekly call block karo — spontaneous socializing mushkil.'],['Talk to Baby','Week 18 se baby sun sakta hai — bond banao. Oxytocin release.'],['Community Role','Support groups mein dene wali position lo — meaning + connection.'],['Partner Ritual','Weekly 30 min shared activity. Physical presence = loneliness ka antidote.']]},
  happy:{e:'<i data-lucide="smile"></i>',key:'m_happy',why:'Second trimester "pregnancy glow" real hai — estrogen skin hydration badhata hai.',tips:[['Gratitude Log','3 specific moments aaj — brain positive bias develop karta hai.'],['Bump Photos','Same spot, time, outfit — timelapse baad mein banao.'],['Energy Banking','Khushi journal mein likho — dark days mein kaam aata hai.'],['Baby Bonding','Music, naam, poetry — fetal brain development + attachment.'],['Celebrate','Har trimester ek celebration — milestones acknowledge karo.'],['Share Joy','Neuroscience: khushi share karne se genuinely badhti hai.']]},
  excited:{e:'<i data-lucide="sparkles"></i>',key:'m_excited',why:'Dopamine + oxytocin baby ke thought pe release hote hain — brain pregnancy ke liye rewire ho raha hai.',tips:[['Nest Building','Nursery, names, layette — oxytocin boost. Biologically programmed.'],['Partner Bond','Movements feel karo saath, appointments attend karo milke.'],['Future Vision','Baby ke liye hopes likhna — beautiful attachment exercise.'],['Body Gratitude','Stretch marks, weight — sab badges of honor hain.'],['Learn Now','Newborn care, breastfeeding, infant CPR — best time while excited.'],['Document All','Pregnancy diary — feelings, cravings, kicks — bachche ko baad mein dikhao.']]},
};

function renderMoodGrid(){
  const g=$('moodGrid'); if(!g) return;
  const moods=Object.keys(MOODS);
  g.innerHTML=moods.map(m=>`<button class="mood-btn" data-mood="${m}"><span class="mi" style="color:var(--accent)">${MOODS[m].e}</span><span>${T[MOODS[m].key]||m}</span></button>`).join('');
  g.querySelectorAll('.mood-btn').forEach(b=>b.addEventListener('click',()=>{
    g.querySelectorAll('.mood-btn').forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');
    showMoodTips(b.dataset.mood);
    if(user && supa) supa.from('mood_logs').insert({user_id:user.id,mood_type:b.dataset.mood}).then(()=>{});
  }));
  renderIcons();
}

function showMoodTips(mood){
  const d=MOODS[mood]; if(!d) return;
  const card=$('moodTipsCard');
  if(!card) return;
  $('moodTipsContent').innerHTML=`
    <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;background:linear-gradient(135deg,#fce8e8,#fdf5ee);margin-bottom:14px">
      <span style="font-size:34px; color:var(--accent)">${d.e}</span>
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--warm)">${T[d.key]||mood}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px;line-height:1.55">${d.why}</div>
      </div>
    </div>
    <div class="g2">${d.tips.map(([l,t])=>`<div style="background:white;border-radius:13px;padding:12px 14px;border-left:3px solid var(--rose)"><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);margin-bottom:3px;font-weight:600">${l}</div><div style="font-size:12.5px;color:var(--warm);line-height:1.65">${t}</div></div>`).join('')}</div>`;
  card.style.display='block';
  card.style.animation='none'; void card.offsetWidth; card.style.animation='fadeUp .35s ease';
  card.scrollIntoView({behavior:'smooth',block:'nearest'});
  renderIcons();
}

// ══════════════════════════════════════
// BREATHING & AFFIRMATIONS
// ══════════════════════════════════════
function startBreathing(){
  if(breathOn){clearTimeout(breathTimer);breathOn=false;$('breathBtn').innerHTML=`<i data-lucide="wind" class="app-icon-inline"></i> ${T.breathStart}`;setText('breathStatus','');setText('breathCount','');$('breathLabel').textContent='Start';$('breathRing').style.transform='scale(1)';renderIcons();return;}
  breathOn=true;breathRounds=0;$('breathBtn').innerHTML=`<i data-lucide="square" class="app-icon-inline" style="fill:currentColor"></i> ${T.breathStop}`;
  renderIcons();
  const phases=[{l:'Inhale',d:4000,s:'1.45'},{l:'Hold',d:4000,s:'1.45'},{l:'Exhale',d:4000,s:'1'},{l:'Pause',d:2000,s:'1'}];
  let i=0;
  function next(){
    if(!breathOn) return;
    if(i>=phases.length){breathRounds++;setText('breathCount',`Round ${breathRounds}/4 ✓`);if(breathRounds>=4){$('breathRing').style.transform='scale(1)';$('breathLabel').innerHTML='<i data-lucide="check"></i>';setText('breathStatus','Bahut achha!');breathOn=false;$('breathBtn').innerHTML=`<i data-lucide="wind" class="app-icon-inline"></i> ${T.breathStart}`;renderIcons();return;}i=0;}
    const p=phases[i];
    $('breathRing').style.transition=`transform ${p.d}ms ease-in-out`;
    $('breathRing').style.transform=`scale(${p.s})`;
    $('breathLabel').textContent=p.l;
    i++;breathTimer=setTimeout(next,p.d);
  }next();
}

const AFFIRMATIONS=[
  'Mera sharir ek miracle perform kar raha hai — har din ek naya wonder.',
  'Har anubhav mujhe ek powerful maa bana raha hai.',
  'Meri feelings valid hain. Main inhe feel karne ka haq rakhti hun.',
  'Main perfect nahi hun, lekin main apne baby ke liye bilkul sahi hun.',
  'Mera body jaanta hai kya karna hai — evolution ka result hun main.',
  'Aaj jo feel ho raha hai, kal aisa nahi rahega. Yeh bhi guzar jaayega.',
  'Main aur mera baby dono safe hain. Sab theek hai.',
  'Help maangna strength hai, kamzori nahi.',
  'Mere aas paas premi log hain — main akeli nahi hun.',
  'Mera baby already mujhse pyaar karta hai.',
  'Main jitna kar sakti hun, utna kaafi hai.',
  'Stretch marks aur weight — yeh mere body ki bahaduri ki kahani hai.',
  'Main ek nayi insaan bana rahi hun — duniya ka sabse bada kaam.',
  'Mushkilein temporary hain, meri strength permanent hai.',
  'Anxiety feel karna means I care — yeh amazing maa hone ka sign hai.',
  'Pregnancy journey meri apni hai — main ise apne terms par ji rahi hun.',
];

function newAffirmation(){
  affIdx=(affIdx+1)%AFFIRMATIONS.length;
  const el=$('affirmText'); if(!el) return;
  el.style.opacity='0';
  setTimeout(()=>{el.textContent=AFFIRMATIONS[affIdx];el.style.opacity='1';el.style.transition='opacity .3s';},250);
}

// ══════════════════════════════════════
// AI CHAT
// ══════════════════════════════════════
function addBotMsg(txt){
  const d=document.createElement('div');d.className='msg bot';d.innerHTML=`<i data-lucide="flower-2" class="app-icon-inline" style="color:var(--accent); margin-right:4px"></i> ${txt}`;
  const b=$('chatBox');if(b){b.appendChild(d);b.scrollTop=b.scrollHeight;}
  renderIcons();
}
function addUserMsg(txt){
  const d=document.createElement('div');d.className='msg user';d.textContent=txt;
  const b=$('chatBox');if(b){b.appendChild(d);b.scrollTop=b.scrollHeight;}
}

async function sendChat(){
  const inp=$('chatInput'); const txt=inp.value.trim(); if(!txt) return;
  if(window.PREMIUM && !(await window.PREMIUM.checkChatGate())) return;

  const sendBtn=$('chatSendBtn');
  if(sendBtn) sendBtn.disabled=true;

  inp.value=''; addUserMsg(txt); chatHist.push({role:'user',content:txt});
  if(chatHist.length>20) chatHist=chatHist.slice(-20);

  const typing=document.createElement('div');typing.className='msg bot';typing.style.cssText='font-style:italic;color:var(--muted)';typing.textContent='...💭';
  $('chatBox').appendChild(typing);$('chatBox').scrollTop=9999;
  try{
    if(!supa) throw new Error("DB Offline");
    const langName={hinglish:'Hinglish (natural Hindi-English mix)',hi:'Hindi',en:'English',ta:'Tamil',bn:'Bengali',mr:'Marathi',te:'Telugu'}[lang]||'Hinglish';
    const {data,error}=await supa.functions.invoke('claude-proxy',{body:{
      model:'claude-sonnet-4-20250514',max_tokens:1000,
      system:`You are MamaCare AI — warm, empathetic pregnancy support companion. Speak in ${langName}. Tone: caring elder sister + certified nurse-midwife. 2-4 sentences max. Validate feelings first. Soft emojis naturally. Recommend doctor for medical concerns.`,
      messages:chatHist
    }});
    typing.remove();
    if(error) throw error;
    const reply=data?.content?.[0]?.text||'Network Error';addBotMsg(reply);chatHist.push({role:'assistant',content:reply});
  }catch(e){typing.remove();addBotMsg('Network issue. Try again later.');console.error('Chat error:',e);}
  finally{
    if(sendBtn) sendBtn.disabled=false;
  }
}

// ══════════════════════════════════════
// DUE DATE
// ══════════════════════════════════════
const WD={
  4:{b:'Embryo implanting. HCG shuru.',body:'Test positive! Light cramping normal.',tip:'Folic acid 400mcg shuru karein.'},
  6:{b:'Heartbeat! 100 bpm. Eyes, nose outline.',body:'Morning sickness shuru ho sakti.',tip:'Small frequent meals. Ginger tea.'},
  8:{b:'Fingers visible. 16mm. Critical organ development.',body:'Extreme fatigue. Breast tenderness.',tip:'Koi OTC medicine bina doctor ke mat lo.'},
  10:{b:'Officially fetus! Face human-like.',body:'Nausea soon reduces.',tip:'Pehli prenatal appointment — blood tests, dating scan.'},
  12:{b:'5.4cm, reflexes, kidneys working.',body:'Nausea improving.',tip:'NT scan + blood test 11-13 weeks.'},
  14:{b:'8.7cm. Sex possibly visible.',body:'Honeymoon trimester!',tip:'Prenatal yoga ab safe hai.'},
  16:{b:'Ears working — aapki awaaz sun sakta hai!',body:'Bump visible.',tip:'Quad screen blood test.'},
  18:{b:'Vernix developing. Taste buds!',body:'First kicks soon!',tip:'Anatomy scan 18-22 weeks book karein.'},
  20:{b:'50% done! 25cm, 300g.',body:'Round ligament pain common.',tip:'Anatomy scan — every organ check.'},
  24:{b:'30cm, 600g. Fingerprints! Viable.',body:'Stretch marks. Braxton Hicks.',tip:'Glucose test 24-28 weeks.'},
  28:{b:'1.1kg! Eyes open. Dreaming!',body:'Fatigue returns. Heartburn.',tip:'Kick counting — 10 in 2 hrs daily.'},
  32:{b:'1.7kg, 42cm. Head-down position.',body:'Shortness of breath.',tip:'Hospital bag packing shuru karo.'},
  36:{b:'2.6kg, 47cm. Lungs almost ready.',body:'Baby drops. Easier breathing.',tip:'Birth plan finalize karo.'},
  38:{b:'FULL TERM! 3.1kg+.',body:'Labor signs watch karein.',tip:'Signs: contractions, water break, bloody show.'},
  40:{b:'Due date! 3.4kg average.',body:'4% only on exact date. OK until W42.',tip:'Induction/membrane sweep discuss karo.'},
};
function getWD(w){const ks=Object.keys(WD).map(Number).sort((a,b)=>a-b);return WD[ks.reduce((a,b)=>Math.abs(b-w)<Math.abs(a-w)?b:a)];}
function getSizeEmoji(w){return w<=4?'<i data-lucide="sprout" class="app-icon-inline"></i> Sesame seed':w<=6?'<i data-lucide="citrus" class="app-icon-inline"></i> Lemon seed':w<=8?'<i data-lucide="cherry" class="app-icon-inline"></i> Raspberry':w<=10?'<i data-lucide="cherry" class="app-icon-inline"></i> Strawberry':w<=12?'<i data-lucide="citrus" class="app-icon-inline"></i> Lime':w<=16?'<i data-lucide="egg" class="app-icon-inline"></i> Avocado':w<=20?'<i data-lucide="banana" class="app-icon-inline"></i> Banana':w<=24?'<i data-lucide="wheat" class="app-icon-inline"></i> Corn':w<=28?'<i data-lucide="carrot" class="app-icon-inline"></i> Eggplant':w<=32?'<i data-lucide="apple" class="app-icon-inline"></i> Pineapple':w<=36?'<i data-lucide="circle" class="app-icon-inline"></i> Coconut':'<i data-lucide="circle" class="app-icon-inline"></i> Watermelon';}
function getMoodTipW(w){return w<=6?'Test positive! Excitement + anxiety dono normal hain.':w<=13?'First trimester anxiety peak — emotions ko safe space do.':w<=27?'Golden period — energy wapas, kicks soon. Enjoy!':w<=36?'Delivery anxiety normal — birth classes bahut help karte hain.':'Excited + scared + exhausted + ready — sab ek saath. Almost there!';}

function calcDue(){
  const lmpEl=$('lmpDate'); const dueEl=$('directDue');
  if(!lmpEl||!dueEl) return;
  const lmp=new Date(lmpEl.value); if(isNaN(lmp.getTime())) return;
  const due=new Date(lmp.getTime()+280*86400000);
  dueEl.value=due.toISOString().split('T')[0];
  if(user && supa) supa.from('user_profile').upsert({id:user.id,email:user.email,lmp_date:lmpEl.value,due_date:dueEl.value}).then(()=>{});
  flash('due-save',T.synced); showTimeline(due);
}

function calcFromDue(){
  const dueEl=$('directDue'); const lmpEl=$('lmpDate');
  if(!dueEl) return;
  const due=new Date(dueEl.value); if(isNaN(due.getTime())) return;
  const lmp=new Date(due.getTime()-280*86400000);
  if(lmpEl) lmpEl.value=lmp.toISOString().split('T')[0];
  if(user && supa) supa.from('user_profile').upsert({id:user.id,email:user.email,lmp_date:lmp.toISOString().split('T')[0],due_date:dueEl.value}).then(()=>{});
  flash('due-save',T.synced); showTimeline(due);
}

function showTimeline(due){
  const now=new Date(),elapsed=Math.max(0,Math.floor((now-new Date(due.getTime()-280*86400000))/86400000));
  const week=Math.min(40,Math.floor(elapsed/7)+1),pct=Math.min(100,Math.round(elapsed/280*100));
  const daysLeft=Math.max(0,Math.round((due-now)/86400000)),tri=week<=13?1:week<=27?2:3;
  const tn=[T.t1,T.t2,T.t3][tri-1];
  $('dueResult').innerHTML=`<div class="g3"><div class="stat"><div class="stat-v">${T.wk} ${week}</div><div class="stat-l">Current</div></div><div class="stat"><div class="stat-v">${daysLeft}</div><div class="stat-l">${T.days}</div></div><div class="stat"><div class="stat-v">${pct}%</div><div class="stat-l">${T.done}</div></div></div><p style="font-size:13px;color:var(--muted);margin-top:10px;padding:9px 13px;background:rgba(232,160,168,.08);border-radius:10px"><i data-lucide="calendar" class="app-icon-inline"></i> Due: <strong>${fmtDate(due.toISOString().split('T')[0])}</strong> | ${getSizeEmoji(week)}</p>`;
  $('timelineCard').style.display='block'; setText('pctText',pct+'%');
  setTimeout(()=>$('timelineFill').style.width=pct+'%',100);
  $('triCards').innerHTML=[{n:`${T.t1} ${T.tri}`,w:'Week 1–13',d:'Organ formation, nausea, fatigue'},{n:`${T.t2} ${T.tri}`,w:'Week 14–27',d:'Energy boost, baby kicks!'},{n:`${T.t3} ${T.tri}`,w:'Week 28–40',d:'Growth, delivery prep'}].map((t,i)=>`<div class="tri-c${tri===i+1?' current':''}"><div style="font-size:10px;font-weight:600;color:var(--accent);margin-bottom:3px">${t.w}</div><div style="font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:4px">${t.n}</div><div style="font-size:11.5px;color:var(--muted);line-height:1.5">${t.d}</div>${tri===i+1?'<div style="font-size:11px;color:var(--accent);font-weight:600;margin-top:5px"><i data-lucide="arrow-left" class="app-icon-inline"></i> You are here</div>':''}</div>`).join('');
  const wd=getWD(week);
  $('weekDetailCard').style.display='block';
  setText('weekDetailTitle',`${T.wk} ${week} of 40`);
  $('weekDetailGrid').innerHTML=`<div class="g3"><div style="background:white;border-radius:13px;padding:13px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);margin-bottom:5px;font-weight:600"><i data-lucide="baby" class="app-icon-inline"></i> ${T.baby}</div><p style="font-size:12.5px;line-height:1.65">${wd.b}</p></div><div style="background:white;border-radius:13px;padding:13px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--blue);margin-bottom:5px;font-weight:600"><i data-lucide="heart-pulse" class="app-icon-inline"></i> ${T.body}</div><p style="font-size:12.5px;line-height:1.65">${wd.body}</p></div><div style="background:white;border-radius:13px;padding:13px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--green);margin-bottom:5px;font-weight:600"><i data-lucide="lightbulb" class="app-icon-inline"></i> ${T.tip}</div><p style="font-size:12.5px;line-height:1.65">${wd.tip}</p></div></div>`;
  $('weekMoodTip').innerHTML=`<strong style="color:var(--accent)"><i data-lucide="smile" class="app-icon-inline"></i> ${T.mTip}:</strong> ${getMoodTipW(week)}`;
  renderIcons();
}

// ══════════════════════════════════════
// WEIGHT
// ══════════════════════════════════════
async function loadWeights(){
  if(!user || !supa) return;
  const {data}=await supa.from('weight_logs').select('*').eq('user_id',user.id).order('logged_at');
  renderWeights(data||[]);
}
function savePreWeight(){const v=parseFloat($('preWeight').value);if(v&&user&&supa)supa.from('user_profile').upsert({id:user.id,email:user.email,pre_weight:v}).then(()=>{});}
async function addWeight(){
  const kg=parseFloat($('wtInput').value),wk=parseInt($('wtWeek').value);
  if(!kg||kg<30||kg>200){alert('Valid weight daalo (30-200kg)');return;}
  if(!user || !supa) return;
  await supa.from('weight_logs').insert({user_id:user.id,weight_kg:kg,week_number:wk||null});
  $('wtInput').value='';flash('wt-save',T.synced);loadWeights();
}
async function deleteWeight(id){if(supa) await supa.from('weight_logs').delete().eq('id',id);loadWeights();}
function renderWeights(ws){
  const pre=parseFloat($('preWeight')?.value)||0,last=ws[ws.length-1];
  const gain=ws.length>=2?(last.weight_kg-ws[0].weight_kg).toFixed(1):'—';
  const tg=pre&&last?(last.weight_kg-pre).toFixed(1):'—';
  if ($('wtStats')) $('wtStats').innerHTML=`<div class="stat"><div class="stat-v">${last?last.weight_kg+'kg':'—'}</div><div class="stat-l">Current</div></div><div class="stat"><div class="stat-v">${gain!=='—'?(parseFloat(gain)>=0?'+':'')+gain+'kg':'—'}</div><div class="stat-l">Change</div></div><div class="stat"><div class="stat-v">${tg!=='—'?(parseFloat(tg)>=0?'+':'')+tg+'kg':'—'}</div><div class="stat-l">Total Gain</div></div>`;
  if ($('weightLog')) $('weightLog').innerHTML=ws.length?ws.slice().reverse().map(w=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px"><span>W${w.week_number||'?'} — <strong>${w.weight_kg}kg</strong></span><span style="display:flex;align-items:center;gap:8px"><span style="font-size:12px;color:var(--muted)">${new Date(w.logged_at).toLocaleDateString('en-IN')}</span><button onclick="MC.deleteWeight('${w.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px"><i data-lucide="x" class="app-icon-inline"></i></button></span></div>`).join(''):'<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi entry nahi.</p>';
  if(wtChart){wtChart.destroy();wtChart=null;}
  if(ws.length>=2){const ctx=$('weightChart')?.getContext('2d');if(ctx)wtChart=new Chart(ctx,{type:'line',data:{labels:ws.map(w=>`W${w.week_number||'?'}`),datasets:[{label:'kg',data:ws.map(w=>w.weight_kg),borderColor:'#e8a0a8',backgroundColor:'rgba(232,160,168,.12)',tension:.4,pointBackgroundColor:'#c97b7b',pointRadius:5,fill:true}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{grid:{color:'rgba(200,100,100,.06)'},ticks:{font:{size:11}}}}}});}
  renderIcons();
}

// ══════════════════════════════════════
// YOGA
// ══════════════════════════════════════
const YCATS=[{k:'all',l:'All'},{k:'1',l:'1st Tri'},{k:'2',l:'2nd Tri'},{k:'3',l:'3rd Tri'},{k:'breathing',l:'Breathing'},{k:'stretch',l:'Stretch'},{k:'strength',l:'Strength'},{k:'cardio',l:'Cardio'},{k:'pelvic',l:'Pelvic'}];
const YOGA=[
  {icon:'<i data-lucide="activity"></i>',name:'Cat-Cow Stretch',cat:['all','1','2','3','stretch'],dur:'5-10 min',lvl:'Beginner',short:'Spine flexibility, back pain relief.',why:'Relaxin hormone ligaments loosen karta hai — controlled spinal movement essential.',steps:['Tabletop: haath shoulders ke neeche, ghutne hips ke neeche.','Cow (inhale): peth neeche, sar upar, tailbone upar.','Cat (exhale): peth andar, sar neeche, kamar round.','10-15 reps, saans ke saath sync. No jerks.','Slow, comfortable range only.'],benefits:'Lower back pain relief | Hip flexibility | Stress reduction',avoid:'Wrist pain mein fists use karo.'},
  {icon:'<i data-lucide="flower-2"></i>',name:'Butterfly Pose',cat:['all','1','2','3','stretch'],dur:'5-8 min',lvl:'Beginner',short:'Hips open — delivery ke liye best prep.',why:'Pelvic floor + hip flexors delivery mein key role.',steps:['Seedhe baitho — wall support optional.','Dono talne milaao. Gothne naturally side mein.','Spine straight. Deep breathing.','Exhale pe gothic gently neeche — force mat karo!','3-5 min comfortable position mein.'],benefits:'Hip flexor stretch | Pelvic floor prep | Sciatic relief',avoid:'SPD mein cautiously. Force nahi.'},
  {icon:'<i data-lucide="arrow-down-to-line"></i>',name:'Prenatal Squats',cat:['all','2','3','strength'],dur:'3-5 min',lvl:'Intermediate',short:'Labor prep — pelvic opening + pushing strength.',why:'Deep squats pelvis 28% open karte hain — baby descent space.',steps:['Feet shoulder-width, toes 45° outward.','Chair support initially. Slowly lower.','Heels ground — blanket under heels agar uthein.','Namaste haath — counter balance.','30-60 sec hold. 5-8 reps. Slowly up.'],benefits:'Pelvic opening | Leg strength | Lower back relief',avoid:'Placenta previa mein avoid. Knee pain pe stop.'},
  {icon:'<i data-lucide="wind"></i>',name:'Ujjayi Pranayama',cat:['all','1','2','3','breathing'],dur:'10 min',lvl:'Beginner',short:'Ocean breath — cortisol reduce, BP normalize.',why:'Parasympathetic NS activate. Labor pain 20-30% reduce.',steps:['Baitho — spine straight. Mouth close.','Naak se saans — throat thoda constrict (ocean sound).','Exhale bhi naak se — same sound.','4 counts inhale, 6 counts exhale.','Kabhi bhi anxiety/pain pe immediately use karo.'],benefits:'Anxiety 40% reduction | BP normalize | Labor pain management',avoid:'No contraindications.'},
  {icon:'<i data-lucide="circle-dot"></i>',name:'Kegel Exercises',cat:['all','1','2','3','pelvic'],dur:'Daily',lvl:'Beginner',short:'Pelvic floor — delivery prep + incontinence prevention.',why:'Strong pelvic floor: shorter pushing, less tearing, faster recovery.',steps:['Identify muscles: urine mid-stream rokne ki feeling (identify only).','Comfortable position — baith ke ya lait ke.','Contract — andar + upar pull. Stomach nahi!','5-10 sec hold. Fully release.','10-15 reps, 3 sets daily.'],benefits:'Incontinence prevention | Shorter pushing stage | Faster recovery',avoid:'No contraindications — most important exercise!'},
  {icon:'<i data-lucide="move-horizontal"></i>',name:'Side-Lying Leg Lifts',cat:['all','2','3','strength'],dur:'5-8 min',lvl:'Beginner',short:'Hip strength without back pressure.',why:'Back pe litnaa IVC compress kar sakta hai after W12.',steps:['Baayi karwat pe aao.','Ghutne thoda bend, pillow for support.','Ooper wala paer straight — hip height tak.','15-20 reps. Dono sides.','Clam shells variation bhi try karo.'],benefits:'Glute strength | Pelvic stability | Safe for all trimesters',avoid:'Hip pain pe range reduce karo.'},
  {icon:'<i data-lucide="footprints"></i>',name:'Prenatal Walking',cat:['all','1','2','3','cardio'],dur:'20-30 min daily',lvl:'Beginner',short:'Best overall exercise — cardio, mood, sleep, labor prep.',why:'ACOG recommends 150 min moderate cardio/week. GD 27% reduce.',steps:['Comfortable shoes, no heels.','Talk test pace — conversation possible.','5 min warm up + 5 min cool down.','Paani bottle saath.','Heart rate under 140 bpm.'],benefits:'Cardio | Mood boost | GD prevention | Better sleep',avoid:'Uneven terrain 3rd trimester mein.'},
  {icon:'<i data-lucide="moon-star"></i>',name:"Child's Pose",cat:['all','1','2','3','stretch'],dur:'3-5 min',lvl:'Beginner',short:'Instant lower back relief + grounding.',why:'Forward fold parasympathetic NS activate, oxytocin release.',steps:['Ghutne wide open (mat width se zyada), toes touch.','Haath aage — slowly forward.','Forehead mat ya block pe. Neck relaxed.','BELLY KO SPACE MILEGI — ghutne wide hain.','5-10 deep breaths then slowly up.'],benefits:'Lower back relief | Hip flexors | Calming | Baby awareness',avoid:'Knee discomfort mein cushion rakho.'},
  {icon:'<i data-lucide="lungs"></i>',name:'Lamaze Breathing',cat:['all','3','breathing'],dur:'Daily 10-15 min',lvl:'Intermediate',short:'Labor pain management — clinically proven.',why:'Gate control theory: breathing competes with pain signals. 40-50% reduction.',steps:['Pattern 1 Early: "hee-hee-hee-who" — slow, steady.','Pattern 2 Active: accelerated with contraction peak.','Pattern 3 Transition: "hee-hee-who" — puffs then blow.','Pattern 4 Pushing: deep breath → hold → push 6-8 sec.','Partner ko sikhao. Daily practice essential.'],benefits:'Pain management | Oxygen to baby | Focus during contractions',avoid:'Hyperventilation pe pause karo.'},
];

function initYogaFilters(){
  const fr=$('yogaFilterRow');if(!fr||fr.children.length) return;
  fr.innerHTML=YCATS.map(c=>`<button class="tab-btn${c.k==='all'?' active':''}" data-ycat="${c.k}">${c.l}</button>`).join('');
  fr.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{fr.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');yogaFilterKey=b.dataset.ycat;renderYogaGrid();}));
  const av=$('avoidList');if(av)av.innerHTML=[['Flat back (W12+)','IVC compression — dizziness, reduced blood flow.'],['Intense ab crunches','Diastasis recti risk.'],['Contact sports/skiing','Fall + impact risk.'],['Hot yoga/sauna','Overheating danger.'],['Breath holding','Fetal oxygenation reduce hoti hai.'],['Heavy lifting >10kg','Intra-abdominal pressure.'],['High altitude','Oxygen reduction.'],['Exercise through pain','Pain = stop signal.']].map(([t,d])=>`<div style="background:white;border-radius:12px;padding:12px;border-left:3px solid #e05c5c"><div style="font-weight:600;font-size:13px;margin-bottom:2px"><i data-lucide="alert-triangle" class="app-icon-inline" style="color:#e05c5c"></i> ${t}</div><div style="font-size:12px;color:var(--muted);line-height:1.55">${d}</div></div>`).join('');
  renderYogaGrid();
}

function getYogaPoseAnimation(poseName){
  const animations={
    'Cat-Cow Stretch':`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="catcow-anim">
        <ellipse cx="100" cy="80" rx="35" ry="40" fill="none" stroke="#D88C9A" stroke-width="3"/>
        <circle cx="100" cy="50" r="20" fill="none" stroke="#D88C9A" stroke-width="3"/>
        <line x1="70" y1="110" x2="50" y2="160" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="130" y1="110" x2="150" y2="160" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="80" y1="115" x2="60" y2="165" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="120" y1="115" x2="140" y2="165" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <path d="M 100 120 Q 110 140 100 160" stroke="#D88C9A" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
      <style>
        @keyframes catcow { 0%,100%{transform:scaleY(0.9)} 50%{transform:scaleY(1.1)} }
        #catcow-anim { animation: catcow 2s ease-in-out infinite; transform-origin: 100px 100px; }
      </style>
    </svg>`,
    'Butterfly Pose':`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="butterfly-anim">
        <circle cx="100" cy="60" r="18" fill="none" stroke="#D88C9A" stroke-width="3"/>
        <line x1="100" y1="78" x2="100" y2="120" stroke="#D88C9A" stroke-width="3"/>
        <path d="M 100 120 L 70 150 L 70 160" stroke="#D88C9A" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 100 120 L 130 150 L 130 160" stroke="#D88C9A" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 70 150 Q 60 145 50 150" stroke="#D88C9A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 130 150 Q 140 145 150 150" stroke="#D88C9A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
      <style>
        @keyframes butterfly { 0%,100%{transform:rotateX(0deg)} 50%{transform:rotateX(15deg)} }
        #butterfly-anim { animation: butterfly 2.5s ease-in-out infinite; transform-origin: 100px 100px; }
      </style>
    </svg>`,
    'Prenatal Squats':`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="squat-anim">
        <circle cx="100" cy="50" r="16" fill="none" stroke="#D88C9A" stroke-width="3"/>
        <line x1="100" y1="66" x2="100" y2="100" stroke="#D88C9A" stroke-width="3"/>
        <line x1="75" y1="100" x2="60" y2="150" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="125" y1="100" x2="140" y2="150" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="60" y1="150" x2="60" y2="165" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="140" y1="150" x2="140" y2="165" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
      </g>
      <style>
        @keyframes squat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(30px)} }
        #squat-anim { animation: squat 2s ease-in-out infinite; transform-origin: 100px 100px; }
      </style>
    </svg>`,
    'Ujjayi Pranayama':`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="breath-anim">
        <circle cx="100" cy="100" r="50" fill="none" stroke="#D88C9A" stroke-width="2" opacity="0.3"/>
        <circle cx="100" cy="100" r="35" fill="none" stroke="#D88C9A" stroke-width="2.5"/>
        <circle cx="100" cy="100" r="20" fill="none" stroke="#D88C9A" stroke-width="2" opacity="0.5"/>
        <path d="M 100 50 Q 120 70 100 100 Q 80 70 100 50" fill="#D88C9A" opacity="0.2"/>
      </g>
      <style>
        @keyframes breathe { 0%,100%{r:35} 50%{r:50} }
        #breath-anim circle:nth-child(2) { animation: breathe 4s ease-in-out infinite; }
      </style>
    </svg>`,
    'Kegel Exercises':`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="kegel-anim">
        <ellipse cx="100" cy="100" rx="40" ry="50" fill="none" stroke="#D88C9A" stroke-width="3"/>
        <path d="M 70 80 Q 70 100 75 120" stroke="#D88C9A" stroke-width="2.5" fill="none"/>
        <path d="M 130 80 Q 130 100 125 120" stroke="#D88C9A" stroke-width="2.5" fill="none"/>
        <circle cx="100" cy="100" r="15" fill="none" stroke="#D88C9A" stroke-width="2" opacity="0.5"/>
      </g>
      <style>
        @keyframes kegel { 0%,100%{opacity:0.5} 50%{opacity:1} }
        #kegel-anim circle { animation: kegel 1.5s ease-in-out infinite; }
      </style>
    </svg>`,
    'Side-Lying Leg Lifts':`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="sidelift-anim">
        <circle cx="80" cy="80" r="16" fill="none" stroke="#D88C9A" stroke-width="3"/>
        <line x1="80" y1="96" x2="80" y2="130" stroke="#D88C9A" stroke-width="3"/>
        <line x1="60" y1="130" x2="50" y2="170" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="80" y1="130" x2="80" y2="170" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="100" y1="110" x2="140" y2="80" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="140" y1="80" x2="140" y2="130" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
      </g>
      <style>
        @keyframes sidelift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        #sidelift-anim line:nth-child(5) { animation: sidelift 2s ease-in-out infinite; }
      </style>
    </svg>`,
    'Prenatal Walking':`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="walk-anim">
        <circle cx="100" cy="50" r="16" fill="none" stroke="#D88C9A" stroke-width="3"/>
        <line x1="100" y1="66" x2="100" y2="110" stroke="#D88C9A" stroke-width="3"/>
        <line x1="80" y1="110" x2="70" y2="160" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="120" y1="110" x2="130" y2="160" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="70" y1="160" x2="70" y2="175" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
        <line x1="130" y1="160" x2="130" y2="175" stroke="#D88C9A" stroke-width="3" stroke-linecap="round"/>
      </g>
      <style>
        @keyframes walk { 0%{transform:translateX(-5px)} 50%{transform:translateX(5px)} 100%{transform:translateX(-5px)} }
        #walk-anim { animation: walk 1.5s ease-in-out infinite; }
      </style>
    </svg>`,
    "Child's Pose":`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="child-anim">
        <circle cx="100" cy="70" r="14" fill="none" stroke="#D88C9A" stroke-width="3"/>
        <path d="M 100 84 Q 90 100 85 130" stroke="#D88C9A" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 100 84 Q 110 100 115 130" stroke="#D88C9A" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 85 130 L 75 160" stroke="#D88C9A" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 115 130 L 125 160" stroke="#D88C9A" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
      <style>
        @keyframes child { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        #child-anim { animation: child 2.5s ease-in-out infinite; }
      </style>
    </svg>`,
    'Lamaze Breathing':`<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
      <g id="lamaze-anim">
        <circle cx="100" cy="100" r="45" fill="none" stroke="#D88C9A" stroke-width="2.5"/>
        <circle cx="100" cy="100" r="30" fill="none" stroke="#D88C9A" stroke-width="2" opacity="0.6"/>
        <circle cx="100" cy="100" r="15" fill="none" stroke="#D88C9A" stroke-width="1.5" opacity="0.3"/>
        <path d="M 100 55 L 100 145" stroke="#D88C9A" stroke-width="1" opacity="0.4"/>
        <path d="M 55 100 L 145 100" stroke="#D88C9A" stroke-width="1" opacity="0.4"/>
      </g>
      <style>
        @keyframes lamaze { 0%,100%{r:45} 25%{r:55} 50%{r:45} 75%{r:35} }
        #lamaze-anim circle:nth-child(1) { animation: lamaze 4s ease-in-out infinite; }
      </style>
    </svg>`
  };
  return animations[poseName]||`<div style="text-align:center;padding:40px;color:var(--text-muted)">Visual demonstration</div>`;
}

function renderYogaGrid(){
  const g=$('yogaGrid');if(!g)return;
  const filtered=yogaFilterKey==='all'?YOGA:YOGA.filter(y=>y.cat.includes(yogaFilterKey));
  g.innerHTML=filtered.map((y,idx)=>`
    <div class="yoga-card-enhanced" data-yoga-id="${idx}">
      <div class="yoga-card-header">
        <div class="yoga-icon-large">${y.icon}</div>
        <div class="yoga-card-meta">
          <div style="font-weight:700;font-size:14.5px;color:var(--text-main)">${y.name}</div>
          <div style="display:flex;gap:6px;margin-top:6px">
            <span class="yoga-pill yoga-pill-time"><i data-lucide="clock" class="app-icon-inline" style="width:12px;height:12px"></i> ${y.dur}</span>
            <span class="yoga-pill yoga-pill-level">${y.lvl}</span>
          </div>
        </div>
      </div>
      
      <div class="yoga-card-preview" onclick="startYogaPose(${idx})" style="cursor:pointer">
        <div class="yoga-demo-placeholder">
          ${getYogaPoseAnimation(y.name)}
        </div>
      </div>
      
      <div style="font-size:13px;color:var(--text-muted);line-height:1.6;margin:12px 0">${y.short}</div>
      
      <div class="yoga-card-actions">
        <button class="yoga-btn-start" onclick="startYogaPose(${idx})">
          <i data-lucide="play" class="app-icon-inline"></i> Start Pose
        </button>
        <button class="yoga-btn-info" onclick="toggleYogaDetail(${idx})">
          <i data-lucide="info" class="app-icon-inline"></i> Details
        </button>
      </div>
      
      <div class="yoga-detail-expanded" id="yoga-detail-${idx}" style="display:none">
        <div class="yoga-detail-section">
          <div style="font-weight:700;color:var(--green);margin-bottom:8px;display:flex;align-items:center;gap:6px">
            <i data-lucide="lightbulb" class="app-icon-inline"></i> Why This Pose
          </div>
          <p style="font-size:12.5px;color:var(--text-muted);line-height:1.65">${y.why}</p>
        </div>
        
        <div class="yoga-detail-section">
          <div style="font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:6px">
            <i data-lucide="list" class="app-icon-inline"></i> Step-by-Step
          </div>
          ${y.steps.map((s,i)=>`
            <div class="yoga-step-enhanced">
              <div class="yoga-step-num">${i+1}</div>
              <div style="font-size:12.5px;line-height:1.65;color:var(--text-main)">${s}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="yoga-detail-section">
          <div style="font-weight:700;color:var(--green);margin-bottom:8px;display:flex;align-items:center;gap:6px">
            <i data-lucide="heart" class="app-icon-inline"></i> Benefits
          </div>
          <div style="font-size:12.5px;color:var(--text-muted);line-height:1.65">${y.benefits}</div>
        </div>
        
        <div class="yoga-detail-section yoga-avoid-section">
          <div style="font-weight:700;color:#c94040;margin-bottom:8px;display:flex;align-items:center;gap:6px">
            <i data-lucide="alert-triangle" class="app-icon-inline"></i> Caution
          </div>
          <div style="font-size:12.5px;color:#c94040;line-height:1.65">${y.avoid}</div>
        </div>
      </div>
    </div>
  `).join('');
  renderIcons();
}

function toggleYogaDetail(idx){
  const detail=$(`yoga-detail-${idx}`);
  if(detail) detail.style.display=detail.style.display==='none'?'block':'none';
}

function startYogaPose(idx){
  const filtered=yogaFilterKey==='all'?YOGA:YOGA.filter(y=>y.cat.includes(yogaFilterKey));
  const pose=filtered[idx];
  if(!pose) return;
  
  const modal=document.createElement('div');
  modal.className='yoga-modal';
  modal.innerHTML=`
    <div class="yoga-modal-content">
      <button class="yoga-modal-close" onclick="this.closest('.yoga-modal').remove()">
        <i data-lucide="x" class="app-icon-inline"></i>
      </button>
      
      <div class="yoga-modal-header">
        <div style="font-size:56px;margin-bottom:12px">${pose.icon}</div>
        <div style="font-size:20px;font-weight:700;color:var(--text-main);margin-bottom:4px">${pose.name}</div>
        <div style="font-size:13px;color:var(--text-muted)">${pose.dur} • ${pose.lvl}</div>
      </div>
      
      <div class="yoga-demo-large">
        ${getYogaPoseAnimation(pose.name)}
      </div>
      
      <div class="yoga-timer-section">
        <div style="font-weight:700;margin-bottom:12px;color:var(--text-main)">Hold for:</div>
        <div class="yoga-timer-display" id="yogaTimer">0:00</div>
        <div class="yoga-timer-controls">
          <button class="yoga-timer-btn" onclick="startYogaTimer()">
            <i data-lucide="play" class="app-icon-inline"></i> Start
          </button>
          <button class="yoga-timer-btn" onclick="pauseYogaTimer()">
            <i data-lucide="pause" class="app-icon-inline"></i> Pause
          </button>
          <button class="yoga-timer-btn" onclick="resetYogaTimer()">
            <i data-lucide="rotate-ccw" class="app-icon-inline"></i> Reset
          </button>
        </div>
      </div>
      
      <div class="yoga-steps-modal">
        <div style="font-weight:700;margin-bottom:12px;color:var(--text-main);display:flex;align-items:center;gap:6px">
          <i data-lucide="list" class="app-icon-inline"></i> Instructions
        </div>
        ${pose.steps.map((s,i)=>`
          <div class="yoga-step-modal">
            <div class="yoga-step-num-modal">${i+1}</div>
            <div style="font-size:13.5px;line-height:1.7;color:var(--text-main)">${s}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="yoga-benefits-modal">
        <div style="font-weight:700;margin-bottom:10px;color:var(--green);display:flex;align-items:center;gap:6px">
          <i data-lucide="heart" class="app-icon-inline"></i> Benefits
        </div>
        <div style="font-size:13px;color:var(--text-muted);line-height:1.7">${pose.benefits}</div>
      </div>
      
      <button class="yoga-btn-done" onclick="this.closest('.yoga-modal').remove()">
        <i data-lucide="check" class="app-icon-inline"></i> Done
      </button>
    </div>
  `;
  document.body.appendChild(modal);
  renderIcons();
}

let yogaTimerInterval=null;
let yogaTimerSeconds=0;

function startYogaTimer(){
  if(yogaTimerInterval) return;
  yogaTimerInterval=setInterval(()=>{
    yogaTimerSeconds++;
    const mins=Math.floor(yogaTimerSeconds/60);
    const secs=yogaTimerSeconds%60;
    const timer=$('yogaTimer');
    if(timer) timer.textContent=`${mins}:${secs.toString().padStart(2,'0')}`;
  },1000);
}

function pauseYogaTimer(){
  if(yogaTimerInterval){
    clearInterval(yogaTimerInterval);
    yogaTimerInterval=null;
  }
}

function resetYogaTimer(){
  pauseYogaTimer();
  yogaTimerSeconds=0;
  const timer=$('yogaTimer');
  if(timer) timer.textContent='0:00';
}

// ══════════════════════════════════════
// SLEEP
// ══════════════════════════════════════
const SLEEP_TIPS=[
  {t:'Left Side (SOS)',b:'Second tri se left side sona best — IVC compression avoid, baby ko optimal blood flow.'},
  {t:'Pillow Support',b:'Ghuthno ke beech, pet ke neeche, head ke liye — 3 pillows. Sleep quality significantly improve.'},
  {t:'Screen-Free 60 Min',b:'Blue light melatonin 50% suppress karta hai. Sone se 1 hr pehle phone/TV band.'},
  {t:'Magnesium Glycinate',b:'200-400mg before bed: leg cramps + sleep quality. Doctor se discuss.'},
  {t:'Room Temperature',b:'18-20°C ideal. Pregnancy mein body temp already higher.'},
  {t:'Heartburn Hack',b:'Sone se 2-3 hrs pehle heavy meal avoid. Bed head 30° elevate.'},
  {t:'Night Urination',b:'Sone se 2 hrs pehle fluids reduce. Dimmer night light — melatonin maintain.'},
  {t:'Consistent Schedule',b:'Same time sona + uthna — circadian rhythm. #1 sleep quality factor.'},
];

async function loadSleepLogs(){
  if(!user || !supa) return;
  const {data}=await supa.from('sleep_logs').select('*').eq('user_id',user.id).order('logged_at',{ascending:false}).limit(30);
  renderSleepUI(data||[]);
}

async function logSleep(){
  const s=$('sleepStart')?.value,e=$('sleepEnd')?.value;
  if(!s||!e){alert('Bedtime aur wake time daalo');return;}
  if(!user || !supa) return;
  let mins=(parseInt(e.split(':')[0])*60+parseInt(e.split(':')[1]))-(parseInt(s.split(':')[0])*60+parseInt(s.split(':')[1]));
  if(mins<0)mins+=1440;
  const hrs=Math.round(mins/60*10)/10;
  await supa.from('sleep_logs').insert({user_id:user.id,bedtime:s,wake_time:e,duration_hrs:hrs,quality:parseInt($('sleepQuality').value),issue:$('sleepIssue').value||null});
  flash('sleep-save',T.synced);loadSleepLogs();
}

async function deleteSleep(id){if(supa) await supa.from('sleep_logs').delete().eq('id',id);loadSleepLogs();}

function renderSleepUI(logs){
  const avg7=logs.length?(logs.slice(0,7).reduce((a,s)=>a+parseFloat(s.duration_hrs),0)/Math.min(7,logs.length)).toFixed(1):0;
  if($('sleepStats')) $('sleepStats').innerHTML=`<div class="stat"><div class="stat-v">${logs[0]?.duration_hrs||'—'}h</div><div class="stat-l">Last Night</div></div><div class="stat"><div class="stat-v">${avg7}h</div><div class="stat-l">7-Day Avg</div></div><div class="stat"><div class="stat-v" style="font-size:1.4rem">${['','<i data-lucide="frown" style="color:#e05c5c"></i>','<i data-lucide="meh" style="color:var(--gold)"></i>','<i data-lucide="smile" style="color:var(--green)"></i>'][logs[0]?.quality||0]||'—'}</div><div class="stat-l">Quality</div></div>`;
  if($('sleepLog')) $('sleepLog').innerHTML=logs.length?logs.slice(0,14).map(s=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px"><span>${new Date(s.logged_at).toLocaleDateString('en-IN')} — <strong>${s.duration_hrs}h</strong></span><span style="display:flex;align-items:center;gap:6px"><span class="pill ${parseFloat(s.duration_hrs)>=7?'pill-g':parseFloat(s.duration_hrs)>=5?'pill-b':'pill-r'}">${parseFloat(s.duration_hrs)>=7?'Good':parseFloat(s.duration_hrs)>=5?'OK':'Short'}</span><button onclick="MC.deleteSleep('${s.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px"><i data-lucide="x" class="app-icon-inline"></i></button></span></div>`).join(''):'<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi entry nahi.</p>';
  if($('sleepTipsGrid')) $('sleepTipsGrid').innerHTML=SLEEP_TIPS.map(t=>`<div style="background:white;border-radius:14px;padding:13px;border-left:3px solid var(--lavender)"><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--lavender);margin-bottom:3px;font-weight:600">${t.t}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${t.b}</div></div>`).join('');
  if(slChart){slChart.destroy();slChart=null;}
  const last7=logs.slice(0,7).reverse();
  if(last7.length){const ctx=$('sleepChart')?.getContext('2d');if(ctx)slChart=new Chart(ctx,{type:'bar',data:{labels:last7.map(s=>new Date(s.logged_at).toLocaleDateString('en-IN',{day:'numeric',month:'numeric'})),datasets:[{label:'hrs',data:last7.map(s=>s.duration_hrs),backgroundColor:last7.map(s=>parseFloat(s.duration_hrs)>=7?'rgba(106,184,154,.75)':parseFloat(s.duration_hrs)>=5?'rgba(232,160,168,.75)':'rgba(220,80,80,.65)'),borderRadius:8}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{min:0,max:12,ticks:{font:{size:11},callback:v=>v+'h'}},x:{ticks:{font:{size:10}}}}}});}
  renderIcons();
}

// ══════════════════════════════════════
// NUTRITION
// ══════════════════════════════════════
const MEAL_PLANS={
  1:{focus:'Folic Acid, B6 (nausea), Iron, Zinc. Small frequent meals.',meals:[{t:'<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',i:['Dalia + fruits (fiber)','Banana + wheat toast (B6)','Ginger lemon water (nausea)']},{t:'<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning',i:['Walnuts + 2 dates (iron)','Coconut water (electrolytes)']},{t:'<i data-lucide="sun" class="app-icon-inline"></i> Lunch',i:['Dal + rice + palak (iron+folate)','Curd (calcium+probiotics)','Salad + nimbu (Vit C = iron 3x)']},{t:'<i data-lucide="moon" class="app-icon-inline"></i> Dinner',i:['Khichdi / idli (easy digest)','Vegetable soup','Warm haldi milk (calcium)']}],avoid:['Raw papaya/pineapple','Unpasteurized dairy','High mercury fish','Raw sprouts']},
  2:{focus:'Calcium, Vit D, Omega-3, Protein. Baby bones + brain developing.',meals:[{t:'<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',i:['2 eggs + wheat toast (choline)','OJ/mosambi (Vit C)','Mixed nuts']},{t:'<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning',i:['Greek yogurt + berries','Ragi ladoo (iron+calcium)']},{t:'<i data-lucide="sun" class="app-icon-inline"></i> Lunch',i:['Fish/tofu curry (omega-3)','Rajma/chhole (protein+iron)','Brown rice + salad']},{t:'<i data-lucide="moon" class="app-icon-inline"></i> Dinner',i:['Paneer/chicken (protein)','Methi saag (iron+folate)','Sweet potato (beta-carotene)']}],avoid:['Junk/processed foods','Excess sweets (GD risk)','Caffeine >200mg/day','Smoked meats']},
  3:{focus:'Vit K, Iron, Calcium, Fiber (constipation). Very small meals — stomach cramped.',meals:[{t:'<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',i:['Oats + flaxseeds (omega-3+fiber)','2-3 dates (iron + labor prep)','Warm milk (calcium)']},{t:'<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning',i:['Dry fruits mix','Tender coconut water']},{t:'<i data-lucide="sun" class="app-icon-inline"></i> Lunch',i:['Palak paneer (iron+calcium)','Dal makhani (protein)','Small rice/roti portion']},{t:'<i data-lucide="moon" class="app-icon-inline"></i> Dinner',i:['Light khichdi / soup','Boiled vegetables','Avoid heavy — heartburn worse!']}],avoid:['Gas foods (beans, broccoli)','Spicy food (heartburn)','Large meals','Lying down after eating']},
  4:{focus:'<i data-lucide="baby" class="app-icon-inline"></i> Postpartum Recovery + Breastfeeding: Protein, Iron, Calcium, Omega-3, Hydration.',meals:[{t:'<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',i:['Methi paratha + ghee (milk supply)','2 boiled eggs (protein)','Warm turmeric milk (healing)']},{t:'<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning',i:['Dry fruits ladoo (energy)','Coconut water (hydration)','Almonds + dates']},{t:'<i data-lucide="sun" class="app-icon-inline"></i> Lunch',i:['Dal + rice + ghee (strength)','Chicken/fish curry (protein+omega-3)','Spinach sabzi (iron)','Curd (probiotics)']},{t:'<i data-lucide="coffee" class="app-icon-inline"></i> Evening',i:['Ajwain water (digestion)','Ragi porridge (calcium+iron)','Gond ladoo (healing)']},{t:'<i data-lucide="moon" class="app-icon-inline"></i> Dinner',i:['Moong dal khichdi + ghee','Paneer bhurji (protein+calcium)','Warm soup (hydration)']}],avoid:['Spicy/oily foods (baby colic)','Caffeine (passes to milk)','Alcohol','Gas-forming foods (cabbage)','Cold foods (traditional)']},
};

function initNutrition(){
  document.querySelectorAll('#mealTimeBtns .tab-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#mealTimeBtns .tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');mealTab=b.dataset.meal;renderFoodLog();}));
  document.querySelectorAll('#triMealTabs .tab-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#triMealTabs .tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderMealPlan(parseInt(b.dataset.tri));}));
  renderMealPlan(1);
}

function renderMealPlan(tri){
  const plan = window.MEAL_PLANS_INDIAN ? window.MEAL_PLANS_INDIAN[tri] : MEAL_PLANS[tri];
  const el=$('mealPlanContent');if(!el||!plan) return;
  const triEmoji = tri === 1 ? '<i data-lucide="sprout" class="app-icon-inline"></i>' : tri === 2 ? '<i data-lucide="flower-2" class="app-icon-inline"></i>' : tri === 3 ? '<i data-lucide="flower" class="app-icon-inline"></i>' : '<i data-lucide="baby" class="app-icon-inline"></i>';
  el.innerHTML=`
    <div style="background:linear-gradient(135deg,rgba(216,140,154,0.12),rgba(246,200,181,0.08));border-radius:16px;padding:18px;margin-bottom:20px;border-left:4px solid var(--rose)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="font-size:28px">${triEmoji}</span>
        <strong style="font-size:15px;color:var(--rose)">Focus Nutrients</strong>
      </div>
      <p style="font-size:14px;color:var(--text-main);line-height:1.7;margin:0">${plan.focus}</p>
    </div>
    ${plan.meals.map((m,i)=>`
      <div style="background:white;border-radius:18px;padding:20px;margin-bottom:16px;border:1.5px solid rgba(216,140,154,0.15);box-shadow:0 4px 16px rgba(216,140,154,0.08);transition:all 0.3s ease;animation:fadeInUp 0.4s ease-out ${i*0.1}s backwards" onmouseover="this.style.transform='translateX(6px)';this.style.boxShadow='0 8px 24px rgba(216,140,154,0.15)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(216,140,154,0.08)'">
        <div style="font-weight:700;font-size:15px;margin-bottom:14px;color:var(--rose);display:flex;align-items:center;gap:8px">${m.t}</div>
        <ul style="list-style:none;padding:0;margin:0">
          ${m.i.map(item=>`<li style="padding:10px 0 10px 32px;position:relative;font-size:14px;line-height:1.6;color:var(--text-main);border-bottom:1px solid rgba(216,140,154,0.08)"><span style="position:absolute;left:0;width:22px;height:22px;background:linear-gradient(135deg,var(--rose-light),var(--peach));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--rose)">✓</span>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
    <div style="background:linear-gradient(135deg,rgba(224,107,116,0.08),rgba(224,107,116,0.04));border-radius:16px;padding:18px;border-left:4px solid var(--danger)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <i data-lucide="alert-triangle" style="width:20px;height:20px;color:var(--danger)"></i>
        <strong style="font-size:14px;color:var(--danger)">Avoid This ${tri===4?'Period':'Trimester'}</strong>
      </div>
      <ul style="list-style:none;padding:0;margin:0">
        ${plan.avoid.map(a=>`<li style="padding:8px 0 8px 28px;position:relative;font-size:13.5px;color:var(--text-main);line-height:1.6"><span style="position:absolute;left:0;"><i data-lucide="alert-triangle" style="width:16px;height:16px;color:var(--danger)"></i></span>${a}</li>`).join('')}
      </ul>
    </div>
  `;
  renderIcons();
}

async function loadWater(){
  if(!user || !supa) return;
  const {data}=await supa.from('water_logs').select('glasses_count').eq('user_id',user.id).eq('log_date',todayStr()).maybeSingle();
  waterCount=data?.glasses_count||0;renderWater();
}

function renderWater(){
  const el=$('waterTrack');if(!el) return;el.innerHTML='';
  for(let i=0;i<10;i++){
    const g=document.createElement('span');
    g.style.cssText=`font-size:25px;cursor:pointer;transition:.2s;filter:${i<waterCount?'none':'grayscale(1)'};opacity:${i<waterCount?'1':'0.3'}; color:var(--blue)`;
    g.innerHTML='<i data-lucide="droplet" style="fill:currentColor"></i>';
    g.onclick=async()=>{
      waterCount=i<waterCount?i:i+1;
      if(user && supa){await supa.from('water_logs').upsert({user_id:user.id,log_date:todayStr(),glasses_count:waterCount});flash('nutri-save',T.synced);}
      renderWater();updateNutriBars();
    };
    el.appendChild(g);
  }
  const msg=$('waterMsg');if(msg)msg.innerHTML=waterCount>=10?'<i data-lucide="check-circle-2" class="app-icon-inline" style="color:var(--green)"></i> Goal complete!':waterCount>=6?`<i data-lucide="check" class="app-icon-inline" style="color:var(--green)"></i> ${waterCount}/10 — Good!`:`<i data-lucide="droplet" class="app-icon-inline"></i> ${waterCount}/10 — ${10-waterCount} more needed`;
  updateNutriBars();
  renderIcons();
}

function updateNutriBars(){
  const el=$('nutriBars');if(!el) return;
  const cal=foodLogs.reduce((a,f)=>a+(f.calories||0),0),goal=2200;
  el.innerHTML=`<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:3px"><span><i data-lucide="flame" class="app-icon-inline" style="color:#e07040"></i> Calories</span><span>${cal}/${goal} kcal</span></div><div style="height:8px;background:#f0e0e0;border-radius:50px;overflow:hidden"><div style="height:100%;width:${Math.min(100,Math.round(cal/goal*100))}%;background:linear-gradient(90deg,var(--rose),var(--peach));border-radius:50px;transition:width .5s"></div></div></div><div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:3px"><span><i data-lucide="droplet" class="app-icon-inline" style="color:#4a98c4"></i> Water</span><span>${waterCount}/10</span></div><div style="height:8px;background:#f0e0e0;border-radius:50px;overflow:hidden"><div style="height:100%;width:${waterCount*10}%;background:linear-gradient(90deg,#7ab8d4,#4a98c4);border-radius:50px;transition:width .5s"></div></div></div><p style="font-size:12px;color:var(--muted);margin-top:9px"><i data-lucide="info" class="app-icon-inline"></i> Pregnancy mein ~300 extra calories needed daily.</p>`;
  renderIcons();
}

async function loadFoodLog(){
  if(!user || !supa) return;
  const {data}=await supa.from('food_logs').select('*').eq('user_id',user.id).eq('food_date',todayStr()).order('logged_at');
  foodLogs=data||[];renderFoodLog();updateNutriBars();
}

function renderFoodLog(){
  const list=$('foodList');if(!list) return;
  const filtered=mealTab==='all'?foodLogs:foodLogs.filter(f=>f.meal_type===mealTab);
  list.innerHTML=filtered.length?filtered.slice().reverse().map(f=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px"><span>${f.food_name}</span><span style="display:flex;align-items:center;gap:7px"><span style="font-size:12px;color:var(--muted)">${f.calories} cal</span><button onclick="MC.deleteFood('${f.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px"><i data-lucide="x" class="app-icon-inline"></i></button></span></div>`).join(''):'<p style="font-size:13px;color:var(--muted);text-align:center;padding:12px">Koi food log nahi.</p>';
  renderIcons();
}

async function addFood(){
  const name=$('foodInput')?.value.trim();if(!name) return;
  if(!user || !supa) return;
  const {data}=await supa.from('food_logs').insert({user_id:user.id,food_name:name,calories:parseInt($('foodCalSel').value),meal_type:mealTab,food_date:todayStr()}).select().single();
  if(data){foodLogs.push(data);$('foodInput').value='';renderFoodLog();updateNutriBars();flash('nutri-save',T.synced);}
}

async function deleteFood(id){if(supa) await supa.from('food_logs').delete().eq('id',id);foodLogs=foodLogs.filter(f=>f.id!==id);renderFoodLog();updateNutriBars();}

// ══════════════════════════════════════
// MEDICINES
// ══════════════════════════════════════
async function loadMedicines(){
  if(!user || !supa) return;
  const {data:meds}=await supa.from('medicines').select('*').eq('user_id',user.id).eq('is_active',true).order('time_of_day');
  const {data:logs}=await supa.from('medicine_logs').select('medicine_id').eq('user_id',user.id).eq('taken_date',todayStr());
  medicines=meds||[];medTaken={};(logs||[]).forEach(l=>medTaken[l.medicine_id]=true);
  renderMedicines();
}

function renderMedicines(){
  const taken=Object.keys(medTaken).length,total=medicines.length,pct=total?Math.round(taken/total*100):0;
  if ($('medStats')) $('medStats').innerHTML=`<div class="stat"><div class="stat-v">${taken}</div><div class="stat-l">Liya</div></div><div class="stat"><div class="stat-v">${total-taken}</div><div class="stat-l">Baaki</div></div><div class="stat"><div class="stat-v">${pct}%</div><div class="stat-l">Done</div></div>`;
  if ($('medProgressBar')) $('medProgressBar').style.width=pct+'%';
  if ($('medList')) $('medList').innerHTML=medicines.length?medicines.map(m=>`<div style="display:flex;align-items:center;gap:12px;background:white;border-radius:14px;padding:13px;margin-bottom:8px"><div style="width:42px;height:42px;border-radius:12px;background:${medTaken[m.id]?'#e8f5e9':'#fce8e8'};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${m.icon}</div><div style="flex:1"><div style="font-weight:600;font-size:13.5px">${m.name}</div><div style="font-size:12px;color:var(--muted);margin-top:1px">${m.dose||''}${m.notes?' • '+m.notes:''}</div><div style="font-size:11.5px;color:var(--accent);margin-top:2px"><i data-lucide="clock" class="app-icon-inline" style="width:12px;height:12px"></i> ${m.time_of_day||'—'}</div></div><div style="display:flex;gap:6px"><button onclick="MC.toggleMedTaken('${m.id}')" style="padding:6px 13px;border-radius:50px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid ${medTaken[m.id]?'var(--green)':'var(--blush)'};background:${medTaken[m.id]?'var(--green)':'white'};color:${medTaken[m.id]?'white':'var(--muted)'};font-family:'DM Sans',sans-serif">${medTaken[m.id]?'✓ Liya':'Liya?'}</button><button onclick="MC.deleteMed('${m.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:20px"><i data-lucide="x" class="app-icon-inline"></i></button></div></div>`).join(''):'<p style="font-size:13px;color:var(--muted);padding:10px 0">Koi medicine nahi. Neeche se add karein.</p>';
  renderIcons();
}

async function toggleMedTaken(id){
  if(!user || !supa) return;
  if(medTaken[id]){await supa.from('medicine_logs').delete().eq('user_id',user.id).eq('medicine_id',id).eq('taken_date',todayStr());delete medTaken[id];}
  else{await supa.from('medicine_logs').upsert({user_id:user.id,medicine_id:id,taken_date:todayStr()});medTaken[id]=true;}
  flash('med-save',T.synced);renderMedicines();
}

async function addMedicine(){
  const name=$('medName')?.value.trim();if(!name){alert('Name daalo');return;}
  if(!user || !supa) return;
  await supa.from('medicines').insert({user_id:user.id,name,dose:$('medDose').value||'1 tablet',time_of_day:$('medTime').value||'08:00',icon:$('medIcon').value,notes:$('medNotes').value,is_active:true});
  ['medName','medDose','medNotes'].forEach(id=>{const e=$(id);if(e)e.value='';});
  toggleAddMedForm();flash('med-save',T.synced);loadMedicines();
}

async function deleteMed(id){if(!confirm('Delete karein?'))return;if(supa) await supa.from('medicines').delete().eq('id',id);loadMedicines();}
function toggleAddMedForm(){const f=$('addMedForm');if(f)f.style.display=f.style.display==='none'?'block':'none';}

function initSupplementGuide(){
  const el=$('suppGuide');if(!el)return;
  el.innerHTML=[{i:'<i data-lucide="pill" style="color:var(--rose)"></i>',n:'Folic Acid (400-800mcg)',w:'Pre-conception to W12',r:'Neural tube defects 70% prevent.'},{i:'<i data-lucide="apple" style="color:var(--green)"></i>',n:'Iron + Vit C',w:'Throughout, esp 2nd+3rd',r:'Anaemia prevent. Vit C se iron 3x.'},{i:'<i data-lucide="bone" style="color:var(--muted)"></i>',n:'Calcium (1000mg)',w:'2nd trimester+',r:"Baby bones. Maa ki bones protect."},{i:'<i data-lucide="sun" style="color:var(--gold)"></i>',n:'Vitamin D (600 IU)',w:'Throughout',r:'Calcium absorption.'},{i:'<i data-lucide="fish" style="color:var(--blue)"></i>',n:'DHA/Omega-3 (200mg)',w:'2nd trimester+',r:'Baby brain + vision.'},{i:'<i data-lucide="leaf" style="color:var(--green)"></i>',n:'Magnesium (350mg)',w:'3rd trimester esp',r:'Leg cramps + sleep.'}].map(s=>`<div style="display:flex;gap:12px;padding:11px 0;border-bottom:1px solid var(--blush);align-items:flex-start"><span style="font-size:22px;flex-shrink:0">${s.i}</span><div><div style="font-weight:600;font-size:13px">${s.n}</div><div style="font-size:11.5px;color:var(--accent);margin-top:1px"><i data-lucide="clock" class="app-icon-inline" style="width:12px;height:12px"></i> ${s.w}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.6;margin-top:2px">${s.r}</div></div></div>`).join('')+'<p style="font-size:12px;color:var(--muted);margin-top:10px;padding:9px;background:#ffebee;border-radius:9px"><i data-lucide="alert-triangle" class="app-icon-inline" style="color:#e05c5c"></i> Doctor ki salah ke bina koi supplement mat lo.</p>';
  renderIcons();
}

// ══════════════════════════════════════
// HOSPITAL BAG
// ══════════════════════════════════════
const BAG_DEFAULT={'Maa ke Liye':['Maternity nightgown (2-3)','Comfortable underwear (3-4, dark)','Non-slip chappal','Nursing bra (2)','Toiletries','Sanitary pads heavy (10-15)','Phone charger + power bank','Snacks','Water bottle (1L)'],'Baby ke Liye':['Onesies (5-6, newborn)','Soft blanket (2-3)','Baby cap (2-3)','Socks (3-4)','Mittens (2-3)','Diapers newborn (15-20)','Baby wipes unscented','Going home outfit','Baby car seat'],'Documents':['Health insurance card','Previous scan reports','Doctor contact','Blood group card','Birth plan copy','Emergency contacts list'],"Partner ke Liye":['Clothes (2 days)','Toiletries','Snacks + water','Cash + cards','Camera charged','Contact list for announcements']};

async function loadBag(){
  if(!user || !supa)return;
  const {data}=await supa.from('hospital_bag').select('*').eq('user_id',user.id);
  if(data&&data.length>0){bagItems=data;}
  else{const defaults=Object.entries(BAG_DEFAULT).flatMap(([cat,items])=>items.map(name=>({user_id:user.id,item_name:name,category:cat,is_checked:false,is_custom:false})));const {data:ins}=await supa.from('hospital_bag').insert(defaults).select();bagItems=ins||[];}
  initBagTabs();renderBag();
}

function initBagTabs(){
  const row=$('bagCatTabs');if(!row||row.children.length)return;
  const cats=['All',...Object.keys(BAG_DEFAULT)];
  row.innerHTML=cats.map((c,i)=>`<button class="tab-btn${i===0?' active':''}" data-bc="${c}">${c==='All'?'📦 All':c}</button>`).join('');
  row.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{row.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderBag(b.dataset.bc==='All'?null:b.dataset.bc);}));
  const sel=$('customBagCatSel');if(sel)sel.innerHTML=Object.keys(BAG_DEFAULT).map(c=>`<option>${c}</option>`).join('');
}

function renderBag(filterCat=null){
  const total=bagItems.length,done=bagItems.filter(i=>i.is_checked).length;
  if ($('bagPct')) $('bagPct').textContent=total?Math.round(done/total*100)+'%':'0%';
  if ($('bagBar')) $('bagBar').style.width=total?Math.round(done/total*100)+'%':'0%';
  if ($('bagCount')) $('bagCount').textContent=`${done}/${total}`;
  const cats=filterCat?[filterCat]:[...new Set(bagItems.map(i=>i.category))];
  if ($('bagContainer')) $('bagContainer').innerHTML=cats.map(cat=>{
    const items=bagItems.filter(i=>i.category===cat);const catDone=items.filter(i=>i.is_checked).length;
    return`<div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:10px"><div style="font-weight:600;font-size:13.5px">${cat}</div><div style="font-size:12px;color:var(--muted)">${catDone}/${items.length}</div></div>`+items.map(item=>`<div onclick="MC.toggleBagItem('${item.id}')" style="display:flex;align-items:center;gap:9px;padding:8px 10px;background:white;border-radius:10px;margin-bottom:5px;cursor:pointer;opacity:${item.is_checked?'.6':'1'}"><input type="checkbox" ${item.is_checked?'checked':''} onclick="event.stopPropagation();MC.toggleBagItem('${item.id}')" style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0"/><span style="font-size:13px;${item.is_checked?'text-decoration:line-through;color:var(--muted)':''}">${item.item_name}</span></div>`).join('')+'</div>';
  }).join('');
  renderIcons();
}

async function toggleBagItem(id){
  const item=bagItems.find(i=>i.id===id);if(!item)return;
  item.is_checked=!item.is_checked;
  if(supa) await supa.from('hospital_bag').update({is_checked:item.is_checked}).eq('id',id);
  flash('bag-save',T.synced);
  const activeTab=document.querySelector('#bagCatTabs .tab-btn.active');
  renderBag(activeTab?.dataset.bc==='All'?null:activeTab?.dataset.bc);
}

async function addCustomBagItem(){
  const name=$('customBagItem')?.value.trim();if(!name)return;
  const cat=$('customBagCatSel')?.value||'Misc';
  if(!user || !supa) return;
  const {data}=await supa.from('hospital_bag').insert({user_id:user.id,item_name:name,category:cat,is_checked:false,is_custom:true}).select().single();
  if(data){bagItems.push(data);$('customBagItem').value='';renderBag();flash('bag-save',T.synced);}
}

async function resetBag(){
  if(!confirm('Sab uncheck karein?'))return;
  if(user && supa) await supa.from('hospital_bag').update({is_checked:false}).eq('user_id',user.id);
  bagItems.forEach(i=>i.is_checked=false);renderBag();
}

// ══════════════════════════════════════
// BABY NAMES
// ══════════════════════════════════════
const NAME_DB=[
  {n:'Aarav',m:'Peaceful',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Vivaan',m:'Full of life',o:'Sanskrit',g:'boy',r:['hindu','modern']},{n:'Arjun',m:'Bright, white',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Reyansh',m:'Ray of light',o:'Sanskrit',g:'boy',r:['hindu','modern']},{n:'Aryan',m:'Noble',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Dev',m:'Divine',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Dhruv',m:'Polar star',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Shaurya',m:'Bravery',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Rudra',m:'Form of Shiva',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Vihaan',m:'Dawn',o:'Sanskrit',g:'boy',r:['hindu','modern']},{n:'Kabir',m:'Great, wise',o:'Arabic',g:'boy',r:['hindu','muslim']},{n:'Ayaan',m:'Gift of God',o:'Arabic',g:'boy',r:['muslim']},{n:'Zayan',m:'Beauty',o:'Arabic',g:'boy',r:['muslim','modern']},{n:'Rayan',m:'Gates of heaven',o:'Arabic',g:'boy',r:['muslim']},{n:'Ibrahim',m:'Father of many',o:'Arabic',g:'boy',r:['muslim']},{n:'Yusuf',m:'God increases',o:'Arabic',g:'boy',r:['muslim']},{n:'Zaid',m:'Growth',o:'Arabic',g:'boy',r:['muslim']},{n:'Gurpreet',m:'Beloved of Guru',o:'Punjabi',g:'boy',r:['sikh']},{n:'Harjot',m:"God's light",o:'Punjabi',g:'boy',r:['sikh']},{n:'Veer',m:'Brave hero',o:'Sanskrit',g:'boy',r:['sikh','hindu']},
  {n:'Anaya',m:'Free, gift',o:'Sanskrit',g:'girl',r:['hindu','modern']},{n:'Aarohi',m:'Rising',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Ahana',m:'Inner light',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Diya',m:'Lamp, light',o:'Sanskrit',g:'girl',r:['hindu','modern']},{n:'Navya',m:'Young, new',o:'Sanskrit',g:'girl',r:['hindu','modern']},{n:'Avni',m:'Earth',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Kavya',m:'Poetry',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Siya',m:'Pure, Sita',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Zara',m:'Princess, dawn',o:'Arabic',g:'girl',r:['muslim','modern']},{n:'Inaya',m:'Care of God',o:'Arabic',g:'girl',r:['muslim']},{n:'Aisha',m:'Alive',o:'Arabic',g:'girl',r:['muslim']},{n:'Pari',m:'Angel',o:'Persian',g:'girl',r:['muslim','modern']},{n:'Noor',m:'Divine light',o:'Arabic',g:'girl',r:['muslim','modern']},{n:'Fatima',m:'Captivating',o:'Arabic',g:'girl',r:['muslim']},{n:'Simran',m:"God's remembrance",o:'Punjabi',g:'girl',r:['sikh']},{n:'Harleen',m:'Absorbed in God',o:'Punjabi',g:'girl',r:['sikh']},{n:'Manpreet',m:'Heart fulfilled',o:'Punjabi',g:'girl',r:['sikh']},
  {n:'Arya',m:'Noble',o:'Sanskrit',g:'unisex',r:['modern','hindu']},{n:'Kiran',m:'Ray of light',o:'Sanskrit',g:'unisex',r:['hindu','sikh']},{n:'Reva',m:'Star',o:'Sanskrit',g:'unisex',r:['hindu','modern']},{n:'Myra',m:'Sweet',o:'Modern',g:'girl',r:['modern']},{n:'Kiara',m:'Bright, clear',o:'Modern',g:'girl',r:['modern']},{n:'Rumi',m:'Beauty, poet',o:'Persian',g:'unisex',r:['modern']},
];
const NAME_FILTERS=[{k:'all',l:'All'},{k:'boy',l:'Boy'},{k:'girl',l:'Girl'},{k:'unisex',l:'Unisex'},{k:'hindu',l:'Hindu'},{k:'muslim',l:'Muslim'},{k:'sikh',l:'Sikh'},{k:'modern',l:'Modern'}];

async function loadNames(){
  if(!user || !supa)return;
  const {data}=await supa.from('saved_names').select('baby_name').eq('user_id',user.id);
  savedNames=(data||[]).map(d=>d.baby_name);
  initNameFilters();renderNames();renderSavedNames();
}

function initNameFilters(){
  const el=$('nameFilterBtns');if(!el||el.children.length)return;
  el.innerHTML=NAME_FILTERS.map(f=>`<button class="tab-btn${f.k==='all'?' active':''}" data-nf="${f.k}">${f.l}</button>`).join('');
  el.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{el.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');nameFilterKey=b.dataset.nf;renderNames();}));
}

function renderNames(){
  const q=($('nameSearch')?.value||'').toLowerCase();
  const filtered=NAME_DB.filter(n=>{const mq=!q||n.n.toLowerCase().includes(q)||n.m.toLowerCase().includes(q);const mf=nameFilterKey==='all'||n.g===nameFilterKey||n.r.includes(nameFilterKey);return mq&&mf;});
  const g=$('nameGrid');if(!g)return;
  g.innerHTML=filtered.map(n=>{const sv=savedNames.includes(n.n);return`<div onclick="MC.toggleSaveName('${n.n}')" style="background:white;border-radius:16px;padding:14px;border:1.5px solid ${sv?'var(--accent)':'var(--blush)'};cursor:pointer;transition:.2s;position:relative" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'"><div style="position:absolute;top:10px;right:10px;font-size:17px; color:${sv?'var(--rose)':'var(--muted)'}"><i data-lucide="heart" style="${sv?'fill:currentColor':''}"></i></div><div style="font-family:'Cormorant Garamond',serif;font-size:1.25rem;color:var(--warm);margin-bottom:2px">${n.n}</div><div style="font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:5px">${n.m}</div><span class="pill ${n.g==='boy'?'pill-b':n.g==='girl'?'pill-p':'pill-o'}">${n.g}</span><span class="pill pill-g">${n.o}</span></div>`;}).join('')||'<p style="color:var(--muted);font-size:13px;padding:12px;grid-column:1/-1">Koi naam nahi mila.</p>';
  renderIcons();
}

async function toggleSaveName(name){
  if(!user || !supa)return;
  if(savedNames.includes(name)){await supa.from('saved_names').delete().eq('user_id',user.id).eq('baby_name',name);savedNames=savedNames.filter(n=>n!==name);}
  else{await supa.from('saved_names').insert({user_id:user.id,baby_name:name});savedNames.push(name);}
  flash('names-save',T.synced);renderNames();renderSavedNames();
}

function renderSavedNames(){
  const card=$('savedNamesCard'),list=$('savedNamesList');if(!card||!list)return;
  card.style.display=savedNames.length?'block':'none';
  list.innerHTML=savedNames.map(n=>`<div style="display:inline-flex;align-items:center;gap:5px;padding:6px 13px;background:white;border-radius:50px;border:1.5px solid var(--blush);font-size:13px;font-weight:500"><i data-lucide="heart" class="app-icon-inline" style="color:var(--rose); fill:currentColor"></i> ${n}<button onclick="MC.toggleSaveName('${n}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px;line-height:1;margin-left:2px"><i data-lucide="x" class="app-icon-inline"></i></button></div>`).join('');
  renderIcons();
}

// ══════════════════════════════════════
// JOURNAL
// ══════════════════════════════════════
function initJournal(){
  const d=$('jDate');if(d)d.value=todayStr();
  document.querySelectorAll('.jmood').forEach(el=>{el.addEventListener('click',()=>{document.querySelectorAll('.jmood').forEach(e=>{e.style.borderColor='transparent';e.style.background='transparent';});el.style.borderColor='var(--rose)';el.style.background='var(--blush)';jMood=el.dataset.jm;});});
  const first=document.querySelector('.jmood');if(first){first.style.borderColor='var(--rose)';first.style.background='var(--blush)';}
}

function handlePhoto(input){
  const file=input.files[0];if(!file)return;photoFile=file;
  const reader=new FileReader();reader.onload=e=>{const p=$('photoPreview');if(p){p.src=e.target.result;p.style.display='block';}};reader.readAsDataURL(file);
}

async function saveJournalEntry(){
  const text=$('jText')?.value.trim(),week=$('jWeek')?.value,date=$('jDate')?.value;
  if(!text&&!photoFile){alert('Kuch likhein ya photo chuniye!');return;}
  if(!user || !supa)return;
  await supa.from('journal_entries').insert({user_id:user.id,week_number:week||null,entry_date:date||todayStr(),mood:jMood,content_text:text||null});
  if(photoFile){const url=URL.createObjectURL(photoFile);const a=document.createElement('a');a.href=url;a.download=`mamacare-w${week||'bump'}-${date||todayStr()}.jpg`;a.click();URL.revokeObjectURL(url);photoFile=null;const p=$('photoPreview');if(p){p.style.display='none';p.src='';};if($('photoUpload'))$('photoUpload').value='';}
  if($('jText'))$('jText').value='';if($('jWeek'))$('jWeek').value='';
  flash('journal-save',T.synced);loadJournal();
}

async function loadJournal(){
  if(!user || !supa)return;
  const {data}=await supa.from('journal_entries').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
  journalList=data||[];renderJournal();
}

async function deleteJournalEntry(id){if(!confirm('Delete karein?'))return;if(supa) await supa.from('journal_entries').delete().eq('id',id);journalList=journalList.filter(e=>e.id!==id);renderJournal();}

function renderJournal(){
  const html = journalList.length ? journalList.map(e=>{
    const moodIcon = e.mood || 'smile';
    return `<div style="background:white;border-radius:14px;padding:14px;margin-bottom:9px;border:1.5px solid rgba(232,160,168,.15)"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:${e.content_text?'8px':'0'}"><div style="display:flex;align-items:center;gap:8px"><i data-lucide="${moodIcon}" style="width:18px;height:18px;color:var(--accent)"></i><span style="font-size:12px;color:var(--muted)">${fmtDate(e.entry_date)}</span></div><div style="display:flex;align-items:center;gap:8px">${e.week_number?`<span style="font-size:11px;background:var(--blush);color:var(--accent);padding:2px 9px;border-radius:50px;font-weight:500">W${e.week_number}</span>`:''}<button onclick="MC.deleteJournalEntry('${e.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px"><i data-lucide="trash-2" class="app-icon-inline"></i></button></div></div>${e.content_text?`<p style="font-size:13px;line-height:1.7;color:var(--warm)">${e.content_text.replace(/\n/g,'<br>')}</p>`:''}</div>`;
  }).join('') : '<p style="text-align:center;color:var(--muted);font-size:13px;padding:18px">Koi entry nahi. Pehli yaad likho! <i data-lucide="flower-2" class="app-icon-inline" style="color:var(--rose)"></i></p>';
  const el=$('journalEntries'); if(el){ el.innerHTML=html; }
  const el2=$('journalEntries2'); if(el2){ el2.innerHTML=html; }
  renderIcons();
}

function switchMedTab(tab) {
  const medPane = document.getElementById('medPane');
  const ayurPane = document.getElementById('ayurvedaPane');
  const tabMeds = document.getElementById('medTabMeds');
  const tabAyur = document.getElementById('medTabAyurveda');
  if (tab === 'meds') {
    if(medPane) medPane.style.display = '';
    if(ayurPane) ayurPane.style.display = 'none';
    if(tabMeds) tabMeds.classList.add('active');
    if(tabAyur) tabAyur.classList.remove('active');
  } else {
    if(medPane) medPane.style.display = 'none';
    if(ayurPane) ayurPane.style.display = '';
    if(tabMeds) tabMeds.classList.remove('active');
    if(tabAyur) tabAyur.classList.add('active');
    if(window.INDIA) window.INDIA.renderAyurvedaTri(1);
  }
}

function switchJournalTab(tab) {
  const diary = document.getElementById('journalDiaryPane');
  const journal = document.getElementById('journalJournalPane');
  const tabDiary = document.getElementById('journalTabDiary');
  const tabJournal = document.getElementById('journalTabJournal');
  if (tab === 'diary') {
    if(diary) diary.style.display = '';
    if(journal) journal.style.display = 'none';
    if(tabDiary) tabDiary.classList.add('active');
    if(tabJournal) tabJournal.classList.remove('active');
  } else {
    if(diary) diary.style.display = 'none';
    if(journal) journal.style.display = '';
    if(tabDiary) tabDiary.classList.remove('active');
    if(tabJournal) tabJournal.classList.add('active');
    renderJournal();
  }
}

// ══════════════════════════════════════
// APPOINTMENTS
// ══════════════════════════════════════
async function loadAppointments(){
  if(!user || !supa)return;
  const {data}=await supa.from('appointments').select('*').eq('user_id',user.id).order('appt_date');
  apptList=data||[];renderAppointments();
}

async function addAppointment(){
  const title=$('apptTitle')?.value.trim(),date=$('apptDate')?.value;
  if(!title||!date){alert('Title aur date zaroori hai');return;}
  if(!user || !supa)return;
  await supa.from('appointments').insert({user_id:user.id,title,doctor_name:$('apptDoctor')?.value,hospital:$('apptHospital')?.value,appt_date:date,appt_time:$('apptTime')?.value||null,notes:$('apptNotes')?.value,is_completed:false});
  ['apptTitle','apptDoctor','apptHospital','apptNotes'].forEach(id=>{const e=$(id);if(e)e.value='';});
  flash('appt-save',T.synced);loadAppointments();
}

async function toggleApptDone(id){
  const appt=apptList.find(a=>a.id===id);if(!appt)return;
  appt.is_completed=!appt.is_completed;
  if(supa) await supa.from('appointments').update({is_completed:appt.is_completed}).eq('id',id);
  renderAppointments();
}

async function deleteAppt(id){if(!confirm('Delete karein?'))return;if(supa) await supa.from('appointments').delete().eq('id',id);apptList=apptList.filter(a=>a.id!==id);renderAppointments();}

function renderAppointments(){
  const el=$('apptList');if(!el)return;
  const upcoming=apptList.filter(a=>!a.is_completed);const done=apptList.filter(a=>a.is_completed);
  if(!apptList.length){el.innerHTML='<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi appointment nahi. Upar se add karein!</p>';return;}
  el.innerHTML=[...upcoming,...done].map(a=>{const d=new Date(a.appt_date);return`<div class="appt-item" style="opacity:${a.is_completed?'.6':'1'}"><div class="appt-date-box" style="${a.is_completed?'background:var(--blush); color:var(--muted)':''}"><div class="appt-day">${d.getDate()}</div><div class="appt-mon">${d.toLocaleDateString('en-IN',{month:'short'})}</div></div><div class="appt-info"><div class="appt-title" style="${a.is_completed?'text-decoration:line-through':''}">${a.title}</div><div class="appt-sub">${[a.doctor_name,a.hospital,a.appt_time].filter(Boolean).join(' • ')}</div>${a.notes?`<div style="font-size:12px;color:var(--muted);margin-top:3px">${a.notes}</div>`:''}</div><div style="display:flex;gap:5px;align-items:center;flex-shrink:0"><button onclick="MC.toggleApptDone('${a.id}')" style="padding:5px 11px;border-radius:50px;font-size:11.5px;cursor:pointer;border:1.5px solid ${a.is_completed?'var(--green)':'var(--blush)'};background:${a.is_completed?'var(--green)':'white'};color:${a.is_completed?'white':'var(--muted)'};font-family:'DM Sans',sans-serif">${a.is_completed?'<i data-lucide="check" class="app-icon-inline"></i>':'Done?'}</button><button onclick="MC.deleteAppt('${a.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px"><i data-lucide="x" class="app-icon-inline"></i></button></div></div>`;}).join('');
  renderIcons();
}

function initAppointmentChecklist(){
  const el=$('apptChecklist');if(!el)return;
  const TESTS=[
    {w:'8-12',  t:'Dating scan + NT scan',       d:'Baby size confirm, chromosomal screen'},
    {w:'16-20', t:'Anatomy scan (Level 2)',      d:'All major organs, gender'},
    {w:'24-28', t:'Glucose tolerance test',      d:'Gestational diabetes screen'},
    {w:'28+',   t:'Blood tests — Hb, iron',      d:'Anaemia check'},
    {w:'32-36', t:'Group B Strep test',          d:'Antibiotic if needed during labor'},
    {w:'36+',   t:'Weekly NST',                  d:'Non-stress test if high risk'},
    {w:'40+',   t:'Post-dates monitoring',       d:'Induction discussion if needed'},
  ];
  el.innerHTML=TESTS.map(function(t){return'<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid rgba(232,160,168,.12);align-items:flex-start"><span style="font-size:11px;background:var(--blush);color:var(--accent);padding:3px 8px;border-radius:50px;font-weight:600;white-space:nowrap;flex-shrink:0">W'+t.w+'</span><div><div style="font-weight:600;font-size:13px">'+t.t+'</div><div style="font-size:12px;color:var(--muted);margin-top:2px">'+t.d+'</div></div></div>';}).join('');
}

// ══════════════════════════════════════
// BIRTH PLAN
// ══════════════════════════════════════
const BP_SECTIONS=[
  {id:'personal',title:'<i data-lucide="user" class="app-icon-inline"></i> Patient Info',fields:[{id:'bp_name',l:'Naam',ph:'Full name'},{id:'bp_doc',l:'Doctor',ph:'Dr. ...'},{id:'bp_hosp',l:'Hospital',ph:'Hospital naam'},{id:'bp_due2',l:'Due Date',t:'date'},{id:'bp_blood',l:'Blood Group',ph:'e.g. B+'},{id:'bp_allergy',l:'Allergies',ph:'Medicines, food...'}]},
  {id:'env',title:'<i data-lucide="building" class="app-icon-inline"></i> Labor Environment',opts:[{id:'bp_env',q:'Preference:',opts:['Dim lighting','Music (my playlist)','Quiet room','Partner always present','Limit visitors']}]},
  {id:'pain',title:'<i data-lucide="activity" class="app-icon-inline"></i> Pain Management',opts:[{id:'bp_pain',q:'Pain relief:',opts:['Natural — no medication','Epidural','Gas & air','TENS machine','Open to all options']},{id:'bp_move',q:'Movement:',opts:['Walk during labor','Birth ball','Hydrotherapy/shower','Bed preferred']}]},
  {id:'delivery',title:'<i data-lucide="baby" class="app-icon-inline"></i> Delivery',opts:[{id:'bp_push',q:'Pushing position:',opts:['Traditional (back)','Squatting','Side-lying','Hands and knees','Doctor decides']},{id:'bp_cord',q:'Cord cutting:',opts:['Partner cuts cord','Delayed clamping (60s+)','Doctor decides']}]},
  {id:'newborn',title:'<i data-lucide="heart" class="app-icon-inline"></i> After Birth',opts:[{id:'bp_skin',q:'Immediately:',opts:['Skin-to-skin right away','Delayed vernix removal','Delayed bathing (24hrs)']},{id:'bp_feed',q:'Feeding:',opts:['Exclusive breastfeeding','Combination','Formula','Lactation consultant']}]},
  {id:'notes',title:'<i data-lucide="file-text" class="app-icon-inline"></i> Special Notes',textarea:{id:'bp_notes2',l:'Special requests, cultural considerations:',ph:'Hindi mein communication prefer karein...'}}
];

function initBirthPlan(){
  const form=$('birthPlanForm');if(!form)return;
  form.innerHTML=BP_SECTIONS.map(sec=>`
    <div class="bp-section">
      <div class="bp-section-title">${sec.title}</div>
      ${sec.fields?`<div class="g2">${sec.fields.map(f=>`<div><label>${f.l}</label><input type="${f.t||'text'}" id="${f.id}" placeholder="${f.ph||''}" onchange="MC.saveBirthPlan()"/></div>`).join('')}</div>`:''}
      ${sec.opts?sec.opts.map(opt=>`
        <div style="margin-bottom:16px">
          <label style="margin-bottom:10px;display:block;font-size:14px;font-weight:600;color:var(--text-main)">${opt.q}</label>
          <div class="bp-opts" id="${opt.id}" style="display:flex;flex-wrap:wrap;gap:10px">
            ${opt.opts.map(o=>`
              <div class="bp-option">
                <input type="checkbox" id="${opt.id}_${o.replace(/\s/g,'_')}" onchange="MC.saveBirthPlan()">
                <label for="${opt.id}_${o.replace(/\s/g,'_')}">${o}</label>
              </div>
            `).join('')}
          </div>
        </div>
      `).join(''):''}
      ${sec.textarea?`<div><label>${sec.textarea.l}</label><textarea id="${sec.textarea.id}" placeholder="${sec.textarea.ph}" oninput="MC.saveBirthPlan()"></textarea></div>`:''}
    </div>
  `).join('');
  loadBirthPlan();
}

async function loadBirthPlan(){
  if(!user || !supa)return;
  const {data}=await supa.from('birth_plan').select('plan_data').eq('user_id',user.id).maybeSingle();
  if(data?.plan_data){
    const pd=data.plan_data;
    Object.entries(pd).forEach(([k,v])=>{
      const el=$(k);if(el&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA'))el.value=v||'';
    });
    Object.entries(pd).forEach(([k,v])=>{if(Array.isArray(v))v.forEach(txt=>{document.querySelectorAll(`#${k} .bp-opt`).forEach(b=>{if(b.textContent===txt)b.classList.add('sel');});});});
  }
}

async function saveBirthPlan(){
  if(!user || !supa)return;
  const data={};
  document.querySelectorAll('#birthPlanForm input,#birthPlanForm textarea').forEach(el=>{data[el.id]=el.value;});
  document.querySelectorAll('.bp-opts').forEach(g=>{data[g.id]=Array.from(g.querySelectorAll('.bp-opt.sel')).map(b=>b.textContent);});
  await supa.from('birth_plan').upsert({user_id:user.id,plan_data:data});
  flash('bp-save',T.synced);
}

// ══════════════════════════════════════
// POSTPARTUM
// ══════════════════════════════════════
const PP={
  1:{title:'Week 1–2: Acute Recovery',secs:[{i:'<i data-lucide="activity"></i>',t:'Physical Recovery',items:['Vaginal birth: perineal soreness, swelling. Ice packs 24hrs, warm sitz bath after.','C-section: incision care — dry, no lifting >4kg. 6-8 weeks healing.','Lochia (bleeding): bright red → pink → yellow-white. 4-6 weeks total.','Afterpains (cramping): especially during breastfeeding — uterus contracting back.','Constipation common: high fiber, water, stool softeners if needed.']},{i:'<i data-lucide="baby"></i>',t:'Breastfeeding Start',items:['First milk = colostrum — thick, yellowish, GOLD. Baby ko sirf yahi chahiye.','Milk comes in day 3-5 — engorgement, tenderness normal.','Latch pain initially OK, but sharp pain each feed → lactation consultant.','Feed on demand: 8-12 times/24hrs newborn mein.']},{i:'<i data-lucide="moon"></i>',t:'Sleep & Rest',items:['"Sleep when baby sleeps" — practical aur necessary hai.','Night sweats common — hormonal, normal.','Visitors limit karein — rest priority hai.','Sleep deprivation peak — maximum impact first 2 weeks.']}]},
  2:{title:'Week 3–6: Gradual Recovery',secs:[{i:'<i data-lucide="dumbbell"></i>',t:'Physical Changes',items:['Bleeding usually stops/very light by week 3-4.','Energy slowly improving — fatigue still significant.','Hair loss (telogen effluvium) week 3+ — normal, peaks at 3-4 months.','C-section scar itching as healing — normal. Massage from week 6.']},{i:'<i data-lucide="brain"></i>',t:'Emotional Adjustment',items:['Baby blues (day 3-14) vs Postpartum Depression — important distinction.','Identity shift (matrescence) — "kaun hun main ab?" normal hai.','Partner relationship changes — communication essential.','Guilt about not "loving it all" — completely valid.']},{i:'<i data-lucide="move"></i>',t:'Gentle Exercise',items:['Week 4-6: Kegel exercises resume.','Week 6 clearance: walking, light stretching.','No running/high-impact for 12 weeks minimum.','Diastasis recti check at 6-week appointment.']}]},
  3:{title:'Week 6–12: Finding Routine',secs:[{i:'<i data-lucide="check-circle"></i>',t:'6-Week Checkup — ESSENTIAL',items:['Physical exam: uterus, incision/perineum.','Mental health screen (Edinburgh Scale).','Contraception discussion — fertility returns before first period.','BP check — postpartum preeclampsia possible up to 6 weeks.','Discuss everything — no question too small.']},{i:'<i data-lucide="footprints"></i>',t:'Exercise Returns',items:['Doctor clearance then gradually increase.','Pelvic floor physio BEFORE running — highly recommended.','Swimming: 6 weeks if healed.','Core slowly — diastasis recti healing important.']},{i:'<i data-lucide="flower-2"></i>',t:'Self-Care',items:['Daily shower — even 5 min alone significant for mental health.','Continue prenatal vitamins if breastfeeding.','One adult conversation/day matters — social connection.','House can wait — presence matters more.']}]},
  4:{title:'3–6 Months: New Normal',secs:[{i:'<i data-lucide="smile"></i>',t:'Baby Development',items:['3 months: smiles, head control, recognizing faces.','4 months: laughing, reaching — solid food prep begins.','6 months: solids typically started (WHO recommendation).','4-month sleep regression — normal, temporary.']},{i:'<i data-lucide="briefcase"></i>',t:'Work Return',items:['Childcare, pumping schedule if breastfeeding.','Separation anxiety — both maa aur baby ke liye normal.','Gradual return if possible — first week shorter.']},{i:'<i data-lucide="heart"></i>',t:'Identity & Relationship',items:['Partner intimacy: communication essential.','Mom guilt: universal, not useful. You are doing enough.','Community: other parents best support.','Identity integration takes 12-18 months — normal.']}]},
};

function initPostpartum(){
  document.querySelectorAll('#ppWeekTabs .tab-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#ppWeekTabs .tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderPPWeek(parseInt(b.dataset.ppw));}));
  renderPPWeek(1);
  if($('ppWarnings')) $('ppWarnings').innerHTML=['Heavy bleeding after 24hrs (soaking pad/hr)','Fever >38°C — infection sign','Wound redness, pus, or opening','Leg pain/swelling — DVT blood clot','Severe headache + vision changes (postpartum preeclampsia)','Difficulty breathing, chest pain','Thoughts of harming yourself or baby — IMMEDIATE help','Inability to urinate'].map(w=>`<p style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(232,160,168,.1);font-size:13px"><i data-lucide="alert-circle" class="app-icon-inline" style="color:#e05c5c"></i> <span>${w}</span></p>`).join('');
  if($('ppMentalHealth')) $('ppMentalHealth').innerHTML=`<div class="g2"><div style="background:#e8f5e9;border-radius:14px;padding:14px"><div style="font-weight:600;font-size:13px;color:var(--green);margin-bottom:7px"><i data-lucide="smile" class="app-icon-inline"></i> Baby Blues (Normal)</div><div style="font-size:12.5px;line-height:1.7">Day 2-14. Crying, mood swings, overwhelm. 70-80% women. Hormonal shift — estrogen/progesterone drop. <strong>Passes on its own with rest + support.</strong></div></div><div style="background:#ffebee;border-radius:14px;padding:14px"><div style="font-weight:600;font-size:13px;color:#c62828;margin-bottom:7px"><i data-lucide="frown" class="app-icon-inline"></i> Postpartum Depression</div><div style="font-size:12.5px;line-height:1.7">2+ weeks persistent. Hopelessness, inability to function. 10-15% women. NOT weakness — medical condition. <strong>Treatment safe, effective. Please seek help.</strong></div></div></div><div style="background:rgba(232,160,168,.08);border-radius:10px;padding:11px 13px;margin-top:12px;font-size:13px;color:var(--muted)"><i data-lucide="phone" class="app-icon-inline"></i> iCall: 9152987821 | Vandrevala: 1860-2662-345 (24/7)</div>`;
  if($('ppBreastfeeding')) $('ppBreastfeeding').innerHTML=[['<i data-lucide="baby" class="app-icon-inline"></i> Correct Latch','Poora areola andar hona chahiye — sirf nipple nahi. Chin breast pe touch kare, nose clear.'],['<i data-lucide="clock" class="app-icon-inline"></i> Frequency','8-12 times/day. On-demand — cues dekho, clock nahi.'],['<i data-lucide="trending-up" class="app-icon-inline"></i> Supply','Supply = demand. Frequent feeding = more milk. Stress supply reduce karta hai.'],['<i data-lucide="alert-triangle" class="app-icon-inline"></i> Problems','Cracked nipples: lanolin cream + breastmilk apply. Mastitis: fever + hard lump + redness = immediate doctor.'],['<i data-lucide="milk" class="app-icon-inline"></i> Formula OK','Fed is best. No guilt for any feeding choice. Formula-fed babies thrive equally.']].map(([t,b])=>`<div style="background:white;border-radius:13px;padding:13px;margin-bottom:8px"><div style="font-weight:600;font-size:13.5px;margin-bottom:5px">${t}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${b}</div></div>`).join('');
  renderIcons();
}

function renderPPWeek(w){
  const data=PP[w];const el=$('ppWeekContent');if(!el||!data)return;
  el.innerHTML=`<div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--warm);margin-bottom:14px">${data.title}</div>`+
    data.secs.map(s=>`<div style="background:white;border-radius:14px;padding:15px;margin-bottom:11px"><div style="font-weight:600;font-size:13.5px;margin-bottom:9px;display:flex;align-items:center;gap:6px">${s.i} ${s.t}</div>${s.items.map(item=>`<p style="font-size:13px;color:var(--muted);line-height:1.7;padding:5px 0;border-bottom:1px solid rgba(232,160,168,.08)">• ${item}</p>`).join('')}</div>`).join('');
  renderIcons();
}

// ══════════════════════════════════════
// SYMPTOM CHECKER
// ══════════════════════════════════════
const SYMPTOMS=[
  {name:'Morning Sickness / Nausea',cat:'common',tri:'1',urg:'normal',icon:'<i data-lucide="waves"></i>',desc:'80% women ko hoti hai. HCG hormone responsible.',causes:['HCG rapid increase','Estrogen surge','Smell sensitivity','Slow gastric emptying'],relief:['Ginger therapy (1g daily — 40% reduction)','Small meals every 2 hrs','Vit B6 10-25mg 3x daily','Acupressure P6 wrist point','Cold foods better tolerated'],warn:'Hyperemesis: 3+ vomits/day, weight loss, unable to keep fluids → IMMEDIATE doctor'},
  {name:'Extreme Fatigue',cat:'common',tri:'1,3',urg:'normal',icon:'<i data-lucide="battery-low"></i>',desc:'Progesterone sedative effect + blood volume 50% increase.',causes:['Progesterone surge','Blood volume increase','Iron deficiency','Poor sleep'],relief:['20-min power nap (not longer)','Iron + Hb check','Hydration 2.5-3L daily','Reduce unnecessary commitments'],warn:'Extreme fatigue + breathlessness + pallor → Anaemia check karwao'},
  {name:'Back Pain',cat:'common',tri:'2,3',urg:'normal',icon:'<i data-lucide="activity"></i>',desc:'Relaxin hormone + shifting gravity + uterus weight.',causes:['Relaxin loosening ligaments','Posture changes','Sciatica','Muscle weakness'],relief:['Prenatal yoga — cat-cow','Pregnancy pillow between knees','Warm compress (not hot)','Supportive footwear only'],warn:'Severe sudden pain + bleeding → immediate care (placental abruption possible)'},
  {name:'Swelling (Oedema)',cat:'common',tri:'3',urg:'watch',icon:'<i data-lucide="droplet"></i>',desc:'Ankles, feet, hands mein mild swelling — normal fluid retention.',causes:['Blood volume increase','Pelvic vein pressure','Sodium retention','Heat'],relief:['Legs elevated (Viparita Karani)','Compression socks','Left side sleeping','Reduce sodium','Swimming'],warn:'Sudden severe face/hand swelling + headache + vision → PREECLAMPSIA EMERGENCY'},
  {name:'Heartburn / Acidity',cat:'common',tri:'2,3',urg:'normal',icon:'<i data-lucide="flame"></i>',desc:'Progesterone relaxes lower esophageal sphincter + uterus pressure.',causes:['LES relaxation','Stomach compressed','Reduced motility'],relief:['Small frequent meals','Avoid triggers: spicy, coffee, citrus','No lying down 2-3hrs after eating','Elevate bed head','Cold milk, coconut water'],warn:'Severe pain, difficulty swallowing → doctor'},
  {name:'Leg Cramps',cat:'common',tri:'2,3',urg:'normal',icon:'<i data-lucide="zap"></i>',desc:'50% pregnant women. Usually at night.',causes:['Calcium/magnesium deficiency','Dehydration','Nerve pressure','Circulation'],relief:['Magnesium 300mg nightly','Calf stretches before bed','3L hydration daily','When cramp: toes up + massage'],warn:'Persistent calf pain + swelling + redness → DVT rule out'},
  {name:'Braxton Hicks',cat:'common',tri:'3',urg:'normal',icon:'<i data-lucide="heart-pulse"></i>',desc:'Practice contractions. Week 28+ common.',causes:['Uterus practice','Dehydration trigger','Physical activity','Full bladder'],relief:['Change position','Drink water','Warm bath (not hot)','Rest + breathe'],warn:'Before W37: regular painful contractions → preterm labor. Any time: 5 min apart for 1 hr → hospital'},
  {name:'Gestational Diabetes',cat:'serious',tri:'2,3',urg:'serious',icon:'<i data-lucide="activity-square"></i>',desc:'7-8% pregnancies. Placental hormones block insulin.',causes:['Placental hormones','Pre-existing resistance','Risk: overweight, family history'],relief:['Low glycemic diet','30 min walking daily','Blood sugar monitoring','Insulin if needed'],warn:'Uncontrolled GDM → large baby, difficult delivery, baby hypoglycemia. Follow treatment plan.'},
  {name:'Preeclampsia Signs',cat:'serious',tri:'3',urg:'emergency',icon:'<i data-lucide="siren"></i>',desc:'High BP + protein in urine. 5-8% pregnancies.',causes:['Abnormal placentation','Immune factors','Risk: first pregnancy, twins, existing hypertension'],relief:['Low-dose aspirin 81mg if high risk (doctor prescribed)','Regular BP monitoring','Regular prenatal care'],warn:'🚨 BP >140/90 + severe headache + vision changes + severe swelling + upper right pain → IMMEDIATE HOSPITAL'},
  {name:'Stretch Marks',cat:'cosmetic',tri:'2,3',urg:'normal',icon:'<i data-lucide="scan-line"></i>',desc:'50-90% women. Genetic predisposition.',causes:['Rapid skin stretching','Genetic factor','Decreased elasticity'],relief:['Coconut oil / shea butter daily','Vitamin E oil','Stay hydrated','Accept them — tiger stripes'],warn:'No medical concern — cosmetic only'},
  {name:'Shortness of Breath',cat:'common',tri:'3',urg:'watch',icon:'<i data-lucide="wind"></i>',desc:'Uterus pushing diaphragm + progesterone increases breathing.',causes:['Uterus pressing diaphragm','Progesterone effect','Anaemia'],relief:['Slow down','Good upright posture','Propped pillows for sleep','Baby drops W36 — relief'],warn:'Sudden severe breathlessness + chest pain + rapid heart rate → EMERGENCY (PE possible)'},
  {name:'Frequent Urination',cat:'common',tri:'1,3',urg:'normal',icon:'<i data-lucide="droplets"></i>',desc:'Kidney blood flow 50% increase + bladder pressure.',causes:['Increased renal flow','HCG effect','Bladder pressure'],relief:['Normal — accept it','Avoid caffeine','Reduce fluids after 6pm','Kegel exercises help control'],warn:'Burning/pain + blood in urine + fever → UTI — treat immediately (dangerous in pregnancy)'},
];

const SYMP_CATS=[{k:'all',l:'All'},{k:'common',l:'Common'},{k:'watch',l:'Watch'},{k:'serious',l:'Serious'},{k:'emergency',l:'Emergency'},{k:'cosmetic',l:'Cosmetic'}];

function initSymptoms(){
  const el=$('symptomCatBtns');if(!el)return;
  el.innerHTML=SYMP_CATS.map(c=>`<button class="tab-btn${c.k==='all'?' active':''}" data-sc="${c.k}">${c.l}</button>`).join('');
  el.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{el.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');sympFilterKey=b.dataset.sc;filterSymptoms();}));
  filterSymptoms();
}

function filterSymptoms(){
  const q=($('symptomSearch')?.value||'').toLowerCase();
  const filtered=SYMPTOMS.filter(s=>{const mq=!q||s.name.toLowerCase().includes(q)||s.desc.toLowerCase().includes(q);const mf=sympFilterKey==='all'||s.cat===sympFilterKey||s.urg===sympFilterKey;return mq&&mf;});
  const uc={normal:{bg:'rgba(106,184,154,.08)',border:'var(--green)',lbl:'<i data-lucide="check" class="app-icon-inline"></i> Normal'},watch:{bg:'rgba(212,168,83,.08)',border:'var(--gold)',lbl:'<i data-lucide="eye" class="app-icon-inline"></i> Monitor'},serious:{bg:'rgba(220,120,80,.08)',border:'#e07040',lbl:'<i data-lucide="alert-triangle" class="app-icon-inline"></i> Serious'},emergency:{bg:'rgba(220,80,80,.1)',border:'#e05c5c',lbl:'<i data-lucide="siren" class="app-icon-inline"></i> Emergency'}};
  const cont=$('symptomsContainer');if(!cont)return;
  cont.innerHTML=filtered.map(s=>{const u=uc[s.urg]||uc.normal;return`<div class="card" style="border-left:3px solid ${u.border}"><div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px"><span style="font-size:32px; color:${u.border}">${s.icon}</span><div><div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--warm)">${s.name}</div><div style="display:flex;gap:5px;margin-top:3px"><span style="font-size:11px;padding:2px 9px;border-radius:50px;background:${u.bg};color:${u.border};font-weight:600">${u.lbl}</span><span class="pill pill-b" style="font-size:10px">T${s.tri}</span></div></div></div><p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:12px">${s.desc}</p><div class="g2" style="margin-bottom:10px"><div style="background:var(--cream);border-radius:12px;padding:11px"><div style="font-size:10.5px;font-weight:600;color:var(--accent);text-transform:uppercase;margin-bottom:5px">Kyon hota hai</div>${s.causes.map(c=>`<p style="font-size:12px;color:var(--muted);line-height:1.6;padding:2px 0">• ${c}</p>`).join('')}</div><div style="background:rgba(106,184,154,.06);border-radius:12px;padding:11px"><div style="font-size:10.5px;font-weight:600;color:var(--green);text-transform:uppercase;margin-bottom:5px">Relief</div>${s.relief.map(r=>`<p style="font-size:12px;color:var(--muted);line-height:1.6;padding:2px 0">• ${r}</p>`).join('')}</div></div><div style="background:${u.bg};border-radius:10px;padding:10px 12px;font-size:12.5px;color:var(--warm);line-height:1.6"><strong style="color:${u.border}"><i data-lucide="alert-circle" class="app-icon-inline"></i> Warning:</strong> ${s.warn}</div></div>`;}).join('')||'<div class="card"><p style="color:var(--muted);font-size:13px;text-align:center;padding:14px">Koi symptom nahi mila.</p></div>';
  renderIcons();
}

// ══════════════════════════════════════
// SOS / EMERGENCY
// ══════════════════════════════════════
const EC_NUMBERS=[{n:'Ambulance',i:'<i data-lucide="ambulance" class="app-icon-inline"></i>',d:'National Emergency — Free',num:'108'},{n:'Police',i:'<i data-lucide="shield" class="app-icon-inline"></i>',d:'All India',num:'100'},{n:'iCall Mental Health',i:'<i data-lucide="heart-pulse" class="app-icon-inline"></i>',d:'9152987821 | Mon-Sat',num:'9152987821'},{n:'Women Helpline',i:'<i data-lucide="phone-call" class="app-icon-inline"></i>',d:'National',num:'1091'},{n:'Childline',i:'<i data-lucide="baby" class="app-icon-inline"></i>',d:'Child Emergency',num:'1098'}];
let myContacts=[];

function initSOS(){
  if($('sosFastDial')) $('sosFastDial').innerHTML=EC_NUMBERS.map(n=>`<div class="sos-contact"><div><div class="sname">${n.i} ${n.n}</div><div class="snum">${n.d}</div></div><a href="tel:${n.num}" style="padding:8px 16px;border-radius:50px;background:linear-gradient(135deg,var(--green),#4da888);color:white;text-decoration:none;font-size:12.5px;font-weight:600"><i data-lucide="phone" class="app-icon-inline"></i> ${n.num}</a></div>`).join('');
  if($('warningSigns')) $('warningSigns').innerHTML=['Bahut zyada vaginal bleeding (soaking pad in 1 hr)','Severe abdominal pain jo kam nahi ho raha','Baby movements suddenly stop ya dramatically kam','Severe headache + vision changes + swelling — preeclampsia','Sudden severe swelling face/hands','High fever (38°C+) with chills','Water break (amniotic fluid) — any amount','Regular contractions before 37 weeks','Chest pain ya difficulty breathing','Seizure ya loss of consciousness'].map(w=>`<p style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(220,80,80,.08);font-size:13px"><i data-lucide="alert-triangle" class="app-icon-inline" style="color:#e05c5c"></i> <span>${w}</span></p>`).join('');
  
  if(user && supa) supa.from('user_profile').select('*').eq('id',user.id).maybeSingle().then(({data})=>{if(data?.emergency_contacts)myContacts=data.emergency_contacts||[];renderContacts();});
  renderIcons();
}

function findHospital(){
  const r=$('sosResult'); 
  if(!r) return;
  r.innerHTML='<p style="color:var(--muted);font-size:13px;text-align:center;padding:14px"><i data-lucide="map-pin" class="app-icon-inline"></i> Location detect kar rahi hun...</p>';
  renderIcons();
  if(!navigator.geolocation){r.innerHTML=`<div style="display:flex;flex-direction:column;gap:9px"><a href="https://www.google.com/maps/search/maternity+hospital+near+me" target="_blank" style="display:block;padding:13px 20px;background:linear-gradient(135deg,#e05c5c,#c94040);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px"><i data-lucide="search" class="app-icon-inline"></i> Search Nearest Hospital →</a><a href="tel:108" style="display:block;padding:13px 20px;background:linear-gradient(135deg,var(--green),#4da888);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px"><i data-lucide="ambulance" class="app-icon-inline"></i> Ambulance — 108</a></div>`;renderIcons();return;}
  navigator.geolocation.getCurrentPosition(pos=>{
    const{latitude:la,longitude:lo}=pos.coords;
    r.innerHTML=`<div style="display:flex;flex-direction:column;gap:9px"><a href="https://www.google.com/maps/search/maternity+hospital/@${la},${lo},14z" target="_blank" style="display:block;padding:13px 20px;background:linear-gradient(135deg,#e05c5c,#c94040);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px"><i data-lucide="building" class="app-icon-inline"></i> Nearest Maternity Hospital →</a><a href="https://www.google.com/maps/search/government+hospital/@${la},${lo},13z" target="_blank" style="display:block;padding:13px 20px;background:linear-gradient(135deg,var(--blue),#4a98c4);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px"><i data-lucide="landmark" class="app-icon-inline"></i> Government Hospital →</a><a href="tel:108" style="display:block;padding:13px 20px;background:linear-gradient(135deg,var(--green),#4da888);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px"><i data-lucide="ambulance" class="app-icon-inline"></i> Ambulance — 108</a></div>`;
    renderIcons();
  },()=>{r.innerHTML=`<a href="https://www.google.com/maps/search/hospital+near+me" target="_blank" style="display:block;padding:13px 20px;background:linear-gradient(135deg,#e05c5c,#c94040);color:white;border-radius:14px;text-decoration:none;font-weight:600"><i data-lucide="search" class="app-icon-inline"></i> Search Hospital →</a>`;renderIcons();});
}

async function addEC(){
  const n=$('ecName')?.value.trim(),p=$('ecPhone')?.value.trim(),rel=$('ecRelation')?.value;
  if(!n||!p){alert('Naam aur phone zaroori');return;}
  myContacts.push({name:n,phone:p,relation:rel});
  if(user && supa)await supa.from('user_profile').update({emergency_contacts:myContacts}).eq('id',user.id);
  if($('ecName')) $('ecName').value='';
  if($('ecPhone')) $('ecPhone').value='';
  flash('sos-save',T.synced);renderContacts();
}

async function delEC(i){myContacts.splice(i,1);if(user && supa)await supa.from('user_profile').update({emergency_contacts:myContacts}).eq('id',user.id);renderContacts();}

function renderContacts(){
  const el=$('customContacts');if(!el)return;
  el.innerHTML=myContacts.length?myContacts.map((c,i)=>`<div class="sos-contact"><div><div class="sname"><i data-lucide="user" class="app-icon-inline"></i> ${c.name} <span style="font-size:11px;color:var(--muted)">(${c.relation})</span></div><div class="snum">${c.phone}</div></div><div style="display:flex;gap:6px;align-items:center"><a href="tel:${c.phone}" style="padding:7px 14px;border-radius:50px;background:linear-gradient(135deg,var(--green),#4da888);color:white;text-decoration:none;font-size:12px;font-weight:600"><i data-lucide="phone" class="app-icon-inline"></i></a><button onclick="MC.delEC(${i})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:20px"><i data-lucide="trash-2" class="app-icon-inline"></i></button></div></div>`).join(''):'<p style="font-size:12.5px;color:var(--muted);text-align:center;padding:8px">Koi personal contact nahi.</p>';
  renderIcons();
}

// ══════════════════════════════════════
// DASHBOARD (FAILSAFE VERSION)
// ══════════════════════════════════════
const MILESTONES = [{w:4,t:'Test positive! Journey shuru <i data-lucide="sprout" class="app-icon-inline"></i>'},{w:8,t:'Pehla heartbeat scan <i data-lucide="heart-pulse" class="app-icon-inline"></i>'},{w:12,t:'1st trimester complete <i data-lucide="check-circle" class="app-icon-inline"></i>'},{w:16,t:'Gender scan possible <i data-lucide="baby" class="app-icon-inline"></i>'},{w:20,t:'Anatomy scan — halfway <i data-lucide="sparkles" class="app-icon-inline"></i>'},{w:24,t:'Viability milestone <i data-lucide="star" class="app-icon-inline"></i>'},{w:28,t:'3rd trimester shuru <i data-lucide="sparkles" class="app-icon-inline"></i>'},{w:32,t:'Hospital bag pack karo <i data-lucide="briefcase-medical" class="app-icon-inline"></i>'},{w:36,t:'Full term approaching <i data-lucide="flower-2" class="app-icon-inline"></i>'},{w:40,t:'Due date! <i data-lucide="party-popper" class="app-icon-inline"></i>'}];

async function renderDashboard() {
  if (!user || !supa) return;

  const dueStr = $('directDue')?.value;
  const due = dueStr ? new Date(dueStr) : null;
  const now = new Date();
  let week = 0, daysLeft = 0, pct = 0, tri = 0;

  if (due && !isNaN(due)) {
    const el = Math.max(0, Math.floor((now - new Date(due.getTime() - 280 * 86400000)) / 86400000));
    week = Math.min(40, Math.floor(el / 7) + 1);
    daysLeft = Math.max(0, Math.round((due - now) / 86400000));
    pct = Math.min(100, Math.round(el / 280 * 100));
    tri = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  }

  // 1. Enhanced Hero Section with icons instead of emojis
  const hero = $('dbHero');
  if (hero) {
    const tn = [T.t1, T.t2, T.t3][tri - 1] || '';
    const triIcon = tri === 1 ? 'sprout' : tri === 2 ? 'flower-2' : 'star';
    hero.innerHTML = due ? `
      <div class="hero-icon">
        <i data-lucide="${triIcon}"></i>
      </div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;margin-bottom:10px;font-weight:500;background:linear-gradient(135deg,var(--text-main),var(--rose));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
        Week ${week} — ${tn} ${T.tri}
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin:16px 0;flex-wrap:wrap">
        <div style="text-align:center">
          <div style="font-size:2.2rem;font-weight:700;color:var(--rose);line-height:1">${week}</div>
          <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:4px">Weeks</div>
        </div>
        <div style="width:1px;height:40px;background:rgba(216,140,154,0.2)"></div>
        <div style="text-align:center">
          <div style="font-size:2.2rem;font-weight:700;color:var(--peach);line-height:1">${daysLeft}</div>
          <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:4px">Days Left</div>
        </div>
      </div>
      <p style="font-size:13.5px;color:var(--text-muted);margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:6px">
        <i data-lucide="calendar" style="width:16px;height:16px"></i> Due: ${fmtDate(dueStr)}
      </p>
      <div style="background:rgba(216,140,154,0.15);border-radius:100px;height:12px;overflow:hidden;margin-top:16px;max-width:320px;margin-inline:auto;box-shadow:inset 0 2px 4px rgba(0,0,0,0.05)">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--rose),#E59FA9,#F3A8B4);background-size:200% 100%;border-radius:100px;transition:width 1.5s cubic-bezier(0.4,0,0.2,1);animation:shimmer 2s ease-in-out infinite;box-shadow:0 2px 8px rgba(216,140,154,0.4)"></div>
      </div>
      <div style="text-align:center;margin-top:8px;font-size:13px;font-weight:700;color:var(--rose)">${pct}% Complete</div>
    ` : `
      <div class="hero-icon">
        <i data-lucide="flower-2"></i>
      </div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:500;margin-bottom:8px">Welcome to MamaCare!</div>
      <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.6">Your complete pregnancy companion is ready. Let's start by setting your due date.</p>
      <button onclick="MC.goTo('due')" style="background:linear-gradient(135deg,var(--rose),#E59FA9);color:white;border:none;padding:14px 28px;border-radius:100px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(216,140,154,0.35);transition:all 0.3s ease;display:inline-flex;align-items:center;gap:8px" onmouseover="this.style.transform='translateY(-2px) scale(1.02)';this.style.boxShadow='0 12px 32px rgba(216,140,154,0.5)'" onmouseout="this.style.transform='';this.style.boxShadow='0 8px 24px rgba(216,140,154,0.35)'">
        <i data-lucide="calendar-plus" style="width:18px;height:18px"></i> Set Due Date
      </button>
    `;
  }

  // 2. Enhanced Milestones with icons
  const msContainer = $('dbMilestones');
  if (msContainer) {
    const upcoming = MILESTONES.filter(m => m.w >= week).slice(0, 3);
    msContainer.innerHTML = upcoming.length ? upcoming.map((m, i) => `
      <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.85));border:1.5px solid rgba(216,140,154,0.15);border-radius:16px;margin-bottom:10px;font-size:13.5px;transition:all 0.3s ease;cursor:pointer;animation:fadeInUp 0.5s ease-out ${i * 0.1}s backwards" onmouseover="this.style.transform='translateX(8px)';this.style.borderColor='var(--rose)';this.style.boxShadow='0 8px 24px rgba(216,140,154,0.15)'" onmouseout="this.style.transform='';this.style.borderColor='rgba(216,140,154,0.15)';this.style.boxShadow=''">
        <div class="milestone-icon">
          <i data-lucide="star" style="width:20px;height:20px"></i>
        </div>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:700;color:var(--rose);margin-bottom:4px">WEEK ${m.w}</div>
          <div style="line-height:1.5;color:var(--text-main);font-weight:500">${m.t}</div>
        </div>
        <i data-lucide="chevron-right" style="width:18px;height:18px;color:var(--rose);opacity:0.5"></i>
      </div>
    `).join('') : '<p style="font-size:13px;color:var(--muted);text-align:center;padding:20px">All milestones completed! <i data-lucide="party-popper" style="width:16px;height:16px;display:inline-block"></i></p>';
  }

  renderIcons();
}

// ══════════════════════════════════════
// EXPORT MC (For Dynamic Plugin Hooks)
// ══════════════════════════════════════
window.MC = {
  // Auth
  sendOTP, showStep, verifyOTP, otpInput, logout,
  // Nav
  goTo, applyLang,
  // Mood / Chat
  showMoodTips, startBreathing, newAffirmation, sendChat,
  // Data Logic
  calcDue, calcFromDue,
  addWeight, deleteWeight, savePreWeight,
  logSleep, deleteSleep,
  addFood, deleteFood,
  addMedicine, deleteMed, toggleMedTaken, toggleAddMedForm,
  toggleBagItem, addCustomBagItem, resetBag,
  renderNames, toggleSaveName,
  handlePhoto, saveJournalEntry, deleteJournalEntry,
  addAppointment, toggleApptDone, deleteAppt,
  saveBirthPlan, renderPPWeek, filterSymptoms,
  findHospital, addEC, delEC, renderDashboard,
};
