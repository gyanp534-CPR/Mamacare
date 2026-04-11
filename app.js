/**
 * MamaCare v6 — app.js (COMPLETE)
 * Supabase Auth + Cloud Sync + Language Fix + All Features
 * Photo → Gallery only (no cloud storage)
 */
'use strict';

// ══════════════════════════════════════
// SUPABASE CONFIG
// ══════════════════════════════════════
const SUPA_URL = 'https://denspwxohwxconxfbaor.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbnNwd3hvaHd4Y29ueGZiYW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjkwNjIsImV4cCI6MjA5MTMwNTA2Mn0.LgZFCpyPi1W521PkYLRO--nLV6fpAnNgg1G40SMmAVU';
const supa = supabase.createClient(SUPA_URL, SUPA_KEY);
window.supa = supa; // Expose for app-features.js and app-coach.js

// ══════════════════════════════════════
// LANGUAGE STRINGS
// ══════════════════════════════════════
const LANG = {
  hinglish:{
    moodHero:'Pregnancy mein <em>mood swings</em><br>normal hain, aap akeli nahi 💗',
    moodStep:'Abhi kaisi feel kar rahi hain?',breathTitle:'4-4-4 Box Breathing',
    breathStart:'🌬️ Shuru Karein',breathStop:'⏹ Band Karein',
    affirmTitle:'Aaj ki Affirmation ✨',affirmBtn:'✨ Nayi',
    chatTitle:'MamaCare AI Companion 💗',chatHint:'Apni baat likhein...',chatSend:'Send 💌',
    chatGreeting:'Namaste! 🌸 Main MamaCare hun. Aaj kaisi feel kar rahi hain? Kuch bhi share karein.',
    lmpLbl:'Last Menstrual Period (LMP)',dueLbl:'Ya Due Date daalo',
    startLbl:'Shuruat',endLbl:'Due Date',thisWeekLbl:'Is Hafte',
    wtKg:'Weight (kg)',wtWk:'Week',preWt:'Pre-pregnancy weight (kg)',wtAdd:'+ Log',
    bedLbl:'Bedtime',wakeLbl:'Wake time',qualLbl:'Quality',issueLbl:'Issue',sleepAdd:'+ Log Sleep',
    waterGoal:'Goal: 8–10 glasses — tap to fill 🥤',
    foodAdd:'+ Add',mealTitle:'Expert Diet Guide',
    medAdd:'+ Add Medicine',medSave:'Save',
    bagReset:'Reset',bagAdd:'+ Add Item',
    jWkLbl:'Week',jDtLbl:'Date',jMoodLbl:'Mood',jTxtLbl:'Likhein...',
    jPhotoLbl:'Photo (gallery mein save hogi)',jPhotoBtn:'📷 Photo chuniye',
    jSave:'💗 Save Entry',jTimeline:'Meri Diary',
    apptAdd:'+ Save',apptTitle:'Upcoming Appointments',
    bpNote:'💡 Doctor ko delivery se pehle dijiye. Medical emergency mein doctor ka decision final hoga.',
    ppCongrats:'Congratulations, Maa! 💗',
    ppSub:'Khud ka khayal rakhna utna hi zaroori hai jitna baby ka.',
    sympHint:'Symptom search karein...',sympDisc:'⚠️ General info ke liye — severe symptoms mein doctor se milein.',
    sosDesc:'Emergency mein yeh button dabao — GPS nearest hospital dhundega',
    logoutQ:'Logout karna chahte ho?',synced:'☁️ Synced',savedOff:'✓ Saved',
    m_anxious:'Anxious',m_sad:'Udaas',m_angry:'Gussa',m_tired:'Thakaan',
    m_nauseous:'Nausea',m_overwhelmed:'Overwhelmed',m_scared:'Dara hua',
    m_lonely:'Akela',m_happy:'Khush',m_excited:'Excited',
    t1:'Pehli',t2:'Doosri',t3:'Teesri',tri:'Trimester',wk:'Week',
    days:'days baaki',done:'complete',baby:'Baby',body:'Body',tip:'Tip',mTip:'Mood Tip',
  },
  hi:{
    moodHero:'गर्भावस्था में <em>मूड स्विंग्स</em><br>सामान्य हैं 💗',
    moodStep:'अभी कैसा महसूस हो रहा है?',breathTitle:'बॉक्स श्वास व्यायाम',
    breathStart:'🌬️ शुरू करें',breathStop:'⏹ बंद करें',
    affirmTitle:'आज की पुष्टि ✨',affirmBtn:'✨ नई',
    chatTitle:'MamaCare AI साथी 💗',chatHint:'अपनी बात लिखें...',chatSend:'भेजें 💌',
    chatGreeting:'नमस्ते! 🌸 मैं MamaCare हूं। आज कैसा महसूस हो रहा है?',
    lmpLbl:'अंतिम माहवारी',dueLbl:'नियत तिथि',startLbl:'शुरुआत',endLbl:'नियत तिथि',
    thisWeekLbl:'इस सप्ताह',wtKg:'वजन (kg)',wtWk:'सप्ताह',preWt:'पहले का वजन',wtAdd:'+ लॉग',
    bedLbl:'सोने का समय',wakeLbl:'उठने का समय',qualLbl:'गुणवत्ता',issueLbl:'समस्या',sleepAdd:'+ नींद लॉग',
    waterGoal:'लक्ष्य: 8-10 गिलास 🥤',foodAdd:'+ जोड़ें',mealTitle:'आहार गाइड',
    medAdd:'+ दवा जोड़ें',medSave:'सेव',bagReset:'रीसेट',bagAdd:'+ जोड़ें',
    jWkLbl:'सप्ताह',jDtLbl:'तारीख',jMoodLbl:'मूड',jTxtLbl:'लिखें...',
    jPhotoLbl:'फोटो (गैलरी में)',jPhotoBtn:'📷 फोटो',jSave:'💗 सेव',jTimeline:'मेरी डायरी',
    apptAdd:'+ सेव',apptTitle:'अपॉइंटमेंट',
    bpNote:'💡 डिलीवरी से पहले डॉक्टर को दें।',
    ppCongrats:'बधाई हो, माँ! 💗',ppSub:'अपना ख्याल रखना उतना ही जरूरी है।',
    sympHint:'लक्षण खोजें...',sympDisc:'⚠️ सामान्य जानकारी के लिए।',
    sosDesc:'आपातकाल में यह बटन दबाएं',
    logoutQ:'लॉगआउट करें?',synced:'☁️ सिंक',savedOff:'✓ सेव',
    m_anxious:'घबराहट',m_sad:'उदासी',m_angry:'गुस्सा',m_tired:'थकान',
    m_nauseous:'मतली',m_overwhelmed:'अभिभूत',m_scared:'डर',
    m_lonely:'अकेलापन',m_happy:'खुशी',m_excited:'उत्साह',
    t1:'पहली',t2:'दूसरी',t3:'तीसरी',tri:'तिमाही',wk:'सप्ताह',
    days:'दिन बाकी',done:'पूर्ण',baby:'शिशु',body:'शरीर',tip:'टिप',mTip:'मूड टिप',
  },
  en:{
    moodHero:'Pregnancy <em>mood swings</em><br>are completely normal 💗',
    moodStep:'How are you feeling right now?',breathTitle:'4-4-4 Box Breathing',
    breathStart:'🌬️ Start Breathing',breathStop:'⏹ Stop',
    affirmTitle:"Today's Affirmation ✨",affirmBtn:'✨ New',
    chatTitle:'MamaCare AI Companion 💗',chatHint:'Share anything...',chatSend:'Send 💌',
    chatGreeting:"Hello! 🌸 I'm MamaCare. How are you feeling today?",
    lmpLbl:'Last Menstrual Period',dueLbl:'Or enter Due Date',startLbl:'Start',endLbl:'Due Date',
    thisWeekLbl:'This Week',wtKg:'Weight (kg)',wtWk:'Week',preWt:'Pre-pregnancy weight',wtAdd:'+ Log',
    bedLbl:'Bedtime',wakeLbl:'Wake time',qualLbl:'Quality',issueLbl:'Issue',sleepAdd:'+ Log Sleep',
    waterGoal:'Goal: 8–10 glasses daily 🥤',foodAdd:'+ Add',mealTitle:'Expert Meal Guide',
    medAdd:'+ Add Medicine',medSave:'Save',bagReset:'Reset',bagAdd:'+ Add',
    jWkLbl:'Week',jDtLbl:'Date',jMoodLbl:'Mood',jTxtLbl:'Write anything...',
    jPhotoLbl:'Photo (saved to gallery)',jPhotoBtn:'📷 Select Photo',jSave:'💗 Save Entry',jTimeline:'My Diary',
    apptAdd:'+ Save',apptTitle:'Upcoming Appointments',
    bpNote:'💡 Share with your doctor before delivery.',
    ppCongrats:'Congratulations, Mama! 💗',ppSub:'Taking care of yourself matters as much as caring for baby.',
    sympHint:'Search symptoms...',sympDisc:'⚠️ General info only — consult doctor for serious symptoms.',
    sosDesc:'Press this button in emergency — GPS finds nearest hospital',
    logoutQ:'Are you sure you want to logout?',synced:'☁️ Synced',savedOff:'✓ Saved',
    m_anxious:'Anxious',m_sad:'Sad',m_angry:'Angry',m_tired:'Tired',
    m_nauseous:'Nauseous',m_overwhelmed:'Overwhelmed',m_scared:'Scared',
    m_lonely:'Lonely',m_happy:'Happy',m_excited:'Excited',
    t1:'First',t2:'Second',t3:'Third',tri:'Trimester',wk:'Week',
    days:'days left',done:'complete',baby:'Baby',body:'Body',tip:'Tip',mTip:'Mood Tip',
  },
  ta:{
    moodHero:'கர்ப்ப காலத்தில் <em>மனநிலை மாற்றங்கள்</em><br>இயல்பானவை 💗',
    moodStep:'இப்போது எப்படி உணர்கிறீர்கள்?',breathTitle:'மூச்சு பயிற்சி',
    breathStart:'🌬️ தொடங்கு',breathStop:'⏹ நிறுத்து',
    affirmTitle:'இன்றைய உறுதிமொழி ✨',affirmBtn:'✨ புதிய',
    chatTitle:'MamaCare AI 💗',chatHint:'எதையும் பகிரலாம்...',chatSend:'அனுப்பு 💌',
    chatGreeting:'வணக்கம்! 🌸 நான் MamaCare. இன்று எப்படி இருக்கீர்கள்?',
    lmpLbl:'கடைசி மாதவிடாய்',dueLbl:'பிரசவ தேதி',startLbl:'தொடக்கம்',endLbl:'பிரசவ தேதி',
    thisWeekLbl:'இந்த வாரம்',wtKg:'எடை (kg)',wtWk:'வாரம்',preWt:'முந்தைய எடை',wtAdd:'+ பதிவு',
    bedLbl:'தூக்க நேரம்',wakeLbl:'எழும் நேரம்',qualLbl:'தரம்',issueLbl:'சிக்கல்',sleepAdd:'+ பதிவு',
    waterGoal:'இலக்கு: 8-10 கிளாஸ் 🥤',foodAdd:'+ சேர்',mealTitle:'உணவு வழிகாட்டி',
    medAdd:'+ மருந்து',medSave:'சேமி',bagReset:'மீட்டமை',bagAdd:'+ சேர்',
    jWkLbl:'வாரம்',jDtLbl:'தேதி',jMoodLbl:'மனநிலை',jTxtLbl:'எழுதுங்கள்...',
    jPhotoLbl:'புகைப்படம் (கேலரியில்)',jPhotoBtn:'📷 புகைப்படம்',jSave:'💗 சேமி',jTimeline:'என் நாட்குறிப்பு',
    apptAdd:'+ சேமி',apptTitle:'சந்திப்புகள்',
    bpNote:'💡 பிரசவத்திற்கு முன் மருத்துவரிடம் கொடுங்கள்.',
    ppCongrats:'வாழ்த்துகள், அம்மா! 💗',ppSub:'உங்களை கவனித்துக்கொள்வதும் முக்கியம்.',
    sympHint:'அறிகுறி தேடுங்கள்...',sympDisc:'⚠️ பொதுவான தகவல் மட்டுமே.',
    sosDesc:'அவசரத்தில் இந்த பொத்தானை அழுத்தவும்',
    logoutQ:'வெளியேற விரும்புகிறீர்களா?',synced:'☁️ Synced',savedOff:'✓ சேமிக்கப்பட்டது',
    m_anxious:'பதட்டம்',m_sad:'சோகம்',m_angry:'கோபம்',m_tired:'சோர்வு',
    m_nauseous:'குமட்டல்',m_overwhelmed:'அழுத்தம்',m_scared:'பயம்',
    m_lonely:'தனிமை',m_happy:'மகிழ்ச்சி',m_excited:'உற்சாகம்',
    t1:'முதல்',t2:'இரண்டாவது',t3:'மூன்றாவது',tri:'மூன்று மாதம்',wk:'வாரம்',
    days:'நாட்கள் மீதம்',done:'முடிந்தது',baby:'குழந்தை',body:'உடல்',tip:'குறிப்பு',mTip:'மனநிலை குறிப்பு',
  },
  bn:{
    moodHero:'গর্ভাবস্থায় <em>মুড সুইং</em><br>সম্পূর্ণ স্বাভাবিক 💗',
    moodStep:'এখন কেমন অনুভব করছেন?',breathTitle:'শ্বাস ব্যায়াম',
    breathStart:'🌬️ শুরু করুন',breathStop:'⏹ বন্ধ',
    affirmTitle:'আজকের নিশ্চয়তা ✨',affirmBtn:'✨ নতুন',
    chatTitle:'MamaCare AI 💗',chatHint:'যেকোনো কথা...',chatSend:'পাঠান 💌',
    chatGreeting:'নমস্কার! 🌸 আমি MamaCare। আজ কেমন লাগছে?',
    lmpLbl:'শেষ মাসিক',dueLbl:'প্রসবের তারিখ',startLbl:'শুরু',endLbl:'প্রসব তারিখ',
    thisWeekLbl:'এই সপ্তাহ',wtKg:'ওজন (kg)',wtWk:'সপ্তাহ',preWt:'আগের ওজন',wtAdd:'+ লগ',
    bedLbl:'ঘুমানোর সময়',wakeLbl:'ওঠার সময়',qualLbl:'গুণমান',issueLbl:'সমস্যা',sleepAdd:'+ লগ',
    waterGoal:'লক্ষ্য: ৮-১০ গ্লাস 🥤',foodAdd:'+ যোগ',mealTitle:'খাদ্য গাইড',
    medAdd:'+ ওষুধ',medSave:'সেভ',bagReset:'রিসেট',bagAdd:'+ যোগ',
    jWkLbl:'সপ্তাহ',jDtLbl:'তারিখ',jMoodLbl:'মেজাজ',jTxtLbl:'লিখুন...',
    jPhotoLbl:'ছবি (গ্যালারিতে)',jPhotoBtn:'📷 ছবি',jSave:'💗 সেভ',jTimeline:'আমার ডায়েরি',
    apptAdd:'+ সেভ',apptTitle:'অ্যাপয়েন্টমেন্ট',
    bpNote:'💡 ডেলিভারির আগে ডাক্তারকে দিন।',
    ppCongrats:'অভিনন্দন, মা! 💗',ppSub:'নিজের যত্ন নেওয়াও গুরুত্বপূর্ণ।',
    sympHint:'লক্ষণ খুঁজুন...',sympDisc:'⚠️ সাধারণ তথ্যের জন্য।',
    sosDesc:'জরুরি অবস্থায় এই বোতাম টিপুন',
    logoutQ:'লগআউট করতে চান?',synced:'☁️ সিংক',savedOff:'✓ সেভ',
    m_anxious:'উদ্বিগ্ন',m_sad:'দুঃখী',m_angry:'রাগান্বিত',m_tired:'ক্লান্ত',
    m_nauseous:'বমি বমি',m_overwhelmed:'অভিভূত',m_scared:'ভীত',
    m_lonely:'একা',m_happy:'সুখী',m_excited:'উত্তেজিত',
    t1:'প্রথম',t2:'দ্বিতীয়',t3:'তৃতীয়',tri:'ত্রৈমাসিক',wk:'সপ্তাহ',
    days:'দিন বাকি',done:'সম্পূর্ণ',baby:'শিশু',body:'শরীর',tip:'টিপ',mTip:'মেজাজ টিপ',
  },
  mr:{
    moodHero:'गर्भधारणेत <em>मूड स्विंग्स</em><br>सामान्य आहेत 💗',
    moodStep:'आत्ता कसे वाटत आहे?',breathTitle:'श्वास व्यायाम',
    breathStart:'🌬️ सुरू करा',breathStop:'⏹ थांबा',
    affirmTitle:'आजची पुष्टी ✨',affirmBtn:'✨ नवीन',
    chatTitle:'MamaCare AI 💗',chatHint:'काहीही सांगा...',chatSend:'पाठवा 💌',
    chatGreeting:'नमस्कार! 🌸 मी MamaCare. आज कसे वाटते?',
    lmpLbl:'शेवटची मासिक',dueLbl:'देय तारीख',startLbl:'सुरुवात',endLbl:'देय तारीख',
    thisWeekLbl:'या आठवड्यात',wtKg:'वजन (kg)',wtWk:'आठवडा',preWt:'आधीचे वजन',wtAdd:'+ नोंद',
    bedLbl:'झोपण्याची वेळ',wakeLbl:'उठण्याची वेळ',qualLbl:'गुणवत्ता',issueLbl:'समस्या',sleepAdd:'+ नोंद',
    waterGoal:'ध्येय: 8-10 ग्लास 🥤',foodAdd:'+ जोडा',mealTitle:'आहार मार्गदर्शक',
    medAdd:'+ औषध',medSave:'सेव्ह',bagReset:'रीसेट',bagAdd:'+ जोडा',
    jWkLbl:'आठवडा',jDtLbl:'तारीख',jMoodLbl:'मूड',jTxtLbl:'लिहा...',
    jPhotoLbl:'फोटो (गॅलरीत)',jPhotoBtn:'📷 फोटो',jSave:'💗 सेव्ह',jTimeline:'माझी डायरी',
    apptAdd:'+ सेव्ह',apptTitle:'भेटी',
    bpNote:'💡 डिलिव्हरीपूर्वी डॉक्टरांना द्या.',
    ppCongrats:'अभिनंदन, आई! 💗',ppSub:'स्वतःची काळजी तितकीच महत्त्वाची.',
    sympHint:'लक्षण शोधा...',sympDisc:'⚠️ सामान्य माहितीसाठी.',
    sosDesc:'आणीबाणीत हे बटण दाबा',
    logoutQ:'लॉगआउट करायचे आहे का?',synced:'☁️ सिंक',savedOff:'✓ सेव्ह',
    m_anxious:'काळजी',m_sad:'दुःख',m_angry:'राग',m_tired:'थकवा',
    m_nauseous:'मळमळ',m_overwhelmed:'दडपण',m_scared:'भीती',
    m_lonely:'एकटेपणा',m_happy:'आनंद',m_excited:'उत्साह',
    t1:'पहिला',t2:'दुसरा',t3:'तिसरा',tri:'तिमाही',wk:'आठवडा',
    days:'दिवस बाकी',done:'पूर्ण',baby:'बाळ',body:'शरीर',tip:'टिप',mTip:'मूड टिप',
  },
  te:{
    moodHero:'గర్భధారణలో <em>మూడ్ స్వింగ్స్</em><br>సాధారణం 💗',
    moodStep:'ఇప్పుడు ఎలా అనిపిస్తోంది?',breathTitle:'శ్వాస వ్యాయామం',
    breathStart:'🌬️ ప్రారంభించు',breathStop:'⏹ ఆపు',
    affirmTitle:'నేటి ధృఢీకరణ ✨',affirmBtn:'✨ కొత్తది',
    chatTitle:'MamaCare AI 💗',chatHint:'ఏదైనా చెప్పండి...',chatSend:'పంపు 💌',
    chatGreeting:'నమస్కారం! 🌸 నేను MamaCare. ఈరోజు ఎలా ఉన్నారు?',
    lmpLbl:'చివరి మాసిక',dueLbl:'ప్రసవ తేదీ',startLbl:'ప్రారంభం',endLbl:'ప్రసవ తేదీ',
    thisWeekLbl:'ఈ వారం',wtKg:'బరువు (kg)',wtWk:'వారం',preWt:'ముందు బరువు',wtAdd:'+ లాగ్',
    bedLbl:'నిద్ర వేళ',wakeLbl:'లేచే వేళ',qualLbl:'నాణ్యత',issueLbl:'సమస్య',sleepAdd:'+ లాగ్',
    waterGoal:'లక్ష్యం: 8-10 గ్లాసులు 🥤',foodAdd:'+ జోడించు',mealTitle:'ఆహార గైడ్',
    medAdd:'+ మందు',medSave:'సేవ్',bagReset:'రీసెట్',bagAdd:'+ జోడించు',
    jWkLbl:'వారం',jDtLbl:'తేదీ',jMoodLbl:'మూడ్',jTxtLbl:'రాయండి...',
    jPhotoLbl:'ఫోటో (గ్యాలరీలో)',jPhotoBtn:'📷 ఫోటో',jSave:'💗 సేవ్',jTimeline:'నా డైరీ',
    apptAdd:'+ సేవ్',apptTitle:'అపాయింట్‌మెంట్లు',
    bpNote:'💡 డెలివరీకి ముందు వైద్యుడికి ఇవ్వండి.',
    ppCongrats:'అభినందనలు, అమ్మ! 💗',ppSub:'మీ శ్రద్ధ కూడా అంతే ముఖ్యం.',
    sympHint:'లక్షణం వెతకండి...',sympDisc:'⚠️ సాధారణ సమాచారం మాత్రమే.',
    sosDesc:'అత్యవసర సమయంలో ఈ బటన్ నొక్కండి',
    logoutQ:'లాగ్‌అవుట్ చేయాలా?',synced:'☁️ సింక్',savedOff:'✓ సేవ్',
    m_anxious:'ఆందోళన',m_sad:'దుఃఖం',m_angry:'కోపం',m_tired:'అలసట',
    m_nauseous:'వికారం',m_overwhelmed:'అధికంగా',m_scared:'భయం',
    m_lonely:'ఒంటరి',m_happy:'సంతోషం',m_excited:'ఉత్సాహం',
    t1:'మొదటి',t2:'రెండవ',t3:'మూడవ',tri:'త్రైమాసికం',wk:'వారం',
    days:'రోజులు మిగిలి',done:'పూర్తి',baby:'శిశువు',body:'శరీరం',tip:'చిట్కా',mTip:'మూడ్ చిట్కా',
  },
};

// ══════════════════════════════════════
// STATE
// ══════════════════════════════════════
let user = null;
let lang = localStorage.getItem('mc_lang') || 'hinglish';
let T = LANG[lang];
let chatHist = [];
let breathTimer = null, breathOn = false, breathRounds = 0;
let affIdx = 0;
let jMood = '😊';
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
  if(msg) e.textContent = msg;
  e.classList.add('show');
  setTimeout(()=>e.classList.remove('show'), 2000);
}
const fmtDate = d => { try { return new Date(d).toLocaleDateString('hi-IN',{day:'numeric',month:'long',year:'numeric'}); } catch { return d||''; }};
const todayStr = () => new Date().toISOString().split('T')[0];

// ══════════════════════════════════════
// LANGUAGE — Apply ALL strings at once
// ══════════════════════════════════════
function applyLang(l) {
  lang = l; T = LANG[l] || LANG.hinglish;
  localStorage.setItem('mc_lang', l);
  document.getElementById('htmlRoot').lang = {hi:'hi',mr:'hi',ta:'ta',bn:'bn',te:'te'}[l]||'en';

  // Static text map
  const M = {
    moodHeroText:       {html: T.moodHero},
    breathTitle:        {text: T.breathTitle},
    breathBtn:          {text: T.breathStart},
    affirmTitle:        {text: T.affirmTitle},
    affirmBtn:          {text: T.affirmBtn},
    chatTitle:          {text: T.chatTitle},
    chatInput:          {ph: T.chatHint},
    chatSendBtn:        {text: T.chatSend},
    lmpLabel:           {text: T.lmpLbl},
    dueDateLabel:       {text: T.dueLbl},
    startLabel:         {text: T.startLbl},
    endLabel:           {text: T.endLbl},
    thisWeekLabel:      {text: T.thisWeekLbl},
    wtKgLabel:          {text: T.wtKg},
    wtWeekLabel:        {text: T.wtWk},
    preWeightLabel:     {text: T.preWt},
    wtAddBtn:           {text: T.wtAdd},
    bedtimeLabel:       {text: T.bedLbl},
    wakeLabel:          {text: T.wakeLbl},
    qualityLabel:       {text: T.qualLbl},
    issueLabel:         {text: T.issueLbl},
    sleepLogBtn:        {text: T.sleepAdd},
    waterGoalText:      {text: T.waterGoal},
    foodAddBtn:         {text: T.foodAdd},
    mealPlanTitle:      {text: T.mealTitle},
    addMedBtn:          {text: T.medAdd},
    saveMedBtn:         {text: T.medSave},
    bagResetBtn:        {text: T.bagReset},
    bagAddBtn:          {text: T.bagAdd},
    jWeekLabel:         {text: T.jWkLbl},
    jDateLabel:         {text: T.jDtLbl},
    jMoodLabel:         {text: T.jMoodLbl},
    jTextLabel:         {text: T.jTxtLbl},
    jPhotoLabel:        {text: T.jPhotoLbl},
    photoUploadBtn:     {text: T.jPhotoBtn},
    saveJournalBtn:     {text: T.jSave},
    journalTimelineTitle:{text: T.jTimeline},
    addApptBtn:         {text: T.apptAdd},
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

  // Re-render dynamic content that uses T
  renderMoodGrid();
  renderYogaGrid();
  if(user) {
    supa.from('user_profile').update({language:l}).eq('id',user.id).then(()=>{});
  }
}

// ══════════════════════════════════════
// AUTH
// ══════════════════════════════════════
async function sendOTP() {
  const email = $('authEmail')?.value?.trim();
  if(!email||!email.includes('@')) { setHTML('authMsg','<span style="color:var(--accent)">Valid email daalo 🌸</span>'); return; }
  const btn=$('authSendBtn'); btn.disabled=true; btn.textContent='Sending...';
  const {error} = await supa.auth.signInWithOtp({email, options:{shouldCreateUser:true}});
  btn.disabled=false; btn.textContent='Magic Link Bhejo ✨';
  if(error) setHTML('authMsg',`<span style="color:var(--accent)">${error.message}</span>`);
  else { setHTML('authOTPMsg',`<strong>${email}</strong> pe OTP bheja! Spam bhi check karein.`); showStep(2); }
}

function showStep(n) {
  $('authStep1').style.display = n===1?'block':'none';
  $('authStep2').style.display = n===2?'block':'none';
}

async function verifyOTP() {
  const email=$('authEmail')?.value?.trim();
  const token=[0,1,2,3,4,5].map(i=>$('otp'+i)?.value||'').join('');
  if(token.length!==6){setHTML('authMsg','<span style="color:var(--accent)">6-digit code daalo</span>');return;}
  const btn=$('authVerifyBtn'); btn.disabled=true; btn.textContent='Verifying...';
  const {data,error}=await supa.auth.verifyOtp({email,token,type:'email'});
  btn.disabled=false; btn.textContent='Verify & Login';
  if(error) setHTML('authMsg','<span style="color:var(--accent)">Wrong code. Try again.</span>');
  else if(data.user) onLogin(data.user);
}

function otpInput(el, idx) {
  el.value=el.value.replace(/\D/g,'');
  if(el.value&&idx<5) $('otp'+(idx+1))?.focus();
  if(idx===5&&el.value) verifyOTP();
}

async function onLogin(u) {
  user=u;
  window.user = u; // Expose for app-features.js and app-coach.js
  $('authScreen').style.display='none';
  $('langBar').style.display='flex';
  $('topBar').style.display='block';
  const em=u.email||''; setText('topUserEmail', em.length>22?em.slice(0,19)+'...':em);
  // Load profile + lang
  const {data:prof}=await supa.from('user_profile').select('*').eq('id',u.id).maybeSingle();
  if(prof){
    if(prof.language&&LANG[prof.language]){
      lang=prof.language;
      document.querySelectorAll('.lang-btn').forEach(b=>{b.classList.toggle('active',b.dataset.lang===lang);});
    }
    if(prof.due_date){$('directDue').value=prof.due_date; calcFromDue();}
    if(prof.lmp_date) $('lmpDate').value=prof.lmp_date;
    if(prof.pre_weight) $('preWeight').value=prof.pre_weight;
  }
  applyLang(lang);
  // Init chat
  const cb=$('chatBox'); if(cb){cb.innerHTML=''; addBotMsg(T.chatGreeting);}
  // Affirmations
  affIdx=Math.floor(Math.random()*AFFIRMATIONS.length);
  setText('affirmText',AFFIRMATIONS[affIdx]);
  // Init all features
  initYogaFilters();
  initNutrition();
  initBirthPlan();
  initPostpartum();
  initSOS();
  initSymptoms();
  initAppointmentChecklist();
  initJournal();
  initSupplementGuide();
  renderDashboard();
}

async function logout(){
  if(!confirm(T.logoutQ)) return;
  await supa.auth.signOut(); user=null; window.user=null;
  $('authScreen').style.display='flex';
  $('langBar').style.display='none';
  $('topBar').style.display='none';
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  $('page-mood').classList.add('active');
}

// Check existing session on load
window.addEventListener('DOMContentLoaded',async()=>{
  initNav();
  const {data:{session}}=await supa.auth.getSession();
  if(session?.user) onLogin(session.user);
  else { applyLang(lang); }
});

// ══════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════
function initNav(){
  document.querySelectorAll('.top-tab').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.page)));
  document.querySelectorAll('#bottomNav .bn-item').forEach(b=>b.addEventListener('click',()=>{
    if(b.id==='moreBtn'){const m=$('moreMenu');m.style.display=m.style.display==='block'?'none':'block';return;}
    goTo(b.dataset.page);
  }));
  document.querySelectorAll('#moreMenu .more-item').forEach(b=>b.addEventListener('click',()=>{$('moreMenu').style.display='none';goTo(b.dataset.page);}));
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.lang-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); applyLang(b.dataset.lang);
  }));
  document.addEventListener('click',e=>{const m=$('moreMenu');if(m&&!m.contains(e.target)&&e.target.id!=='moreBtn')m.style.display='none';});
}

function goTo(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.top-tab,.bn-item').forEach(t=>t.classList.remove('active'));
  const pg=$('page-'+id); if(pg) pg.classList.add('active');
  const tab=document.querySelector(`.top-tab[data-page="${id}"]`); if(tab) tab.classList.add('active');
  const bn=document.querySelector(`#bottomNav .bn-item[data-page="${id}"]`); if(bn) bn.classList.add('active');
  $('moreMenu').style.display='none';
  window.scrollTo({top:0,behavior:'smooth'});
  // Lazy load data
  const loads={dashboard:renderDashboard,weight:loadWeights,sleep:loadSleepLogs,
    nutrition:()=>{loadFoodLog();loadWater();},medicine:loadMedicines,
    bag:loadBag,names:loadNames,journal:loadJournal,appointments:loadAppointments};
  if(loads[id]) loads[id]();
}

// ══════════════════════════════════════
// MOOD
// ══════════════════════════════════════
const MOODS={
  anxious:{e:'😰',key:'m_anxious',why:'Estrogen + progesterone rapidly change → amygdala hyper-reactive. HCG bhi anxiety badhata hai.',tips:[['4-4-4 Breathing','Vagus nerve activate → cortisol 23% kam. Inhale 4, hold 4, exhale 4.'],['5-4-3-2-1 Grounding','5 dekho, 4 chho, 3 suno, 2 sungo, 1 taste. Anxiety override hoti hai.'],['Body Scan','Aankhein band. Pair se sir tak muscles dheel do consciously.'],['Write Fears','Worst case likho, then "how would I cope?" — 93% fears sach nahi hote.'],['Partner Talk','"Bas sunna chahti hun" ya "Solution chahiye" — clear karein kya chahiye.'],['CBT Therapy','4-6 sessions mein significant improvement. Pregnancy mein safe hai.']]},
  sad:{e:'😢',key:'m_sad',why:'Serotonin/dopamine levels change + sleep deprivation + identity shift = sadness.',tips:[['Cry Freely','Tears mein natural stress hormones release hote hain — rone do.'],['Sunlight','Subah 10-20 min direct sun → serotonin naturally badhti hai.'],['10-min Walk','Dopamine release karta hai. Inactivity depression maintain karti hai.'],['One Phone Call','"Main theek nahi hun" kehna strength hai. Ek call kaafi hai.'],['Journal','Unsent letter — feelings likh do bina bheje. Processing hoti hai.'],['Doctor','2+ weeks sadness + appetite/sleep issues → prenatal depression — treat karo.']]},
  angry:{e:'😤',key:'m_angry',why:'Progesterone drop + estrogen surge → amygdala 40% more sensitive. Physical discomfort compound karta hai.',tips:[['STOP Method','Stop. Take breath. Observe sensations. Proceed. 10 sec gap creates space.'],['Cold Water','Haath thande paani mein 15 sec → diving reflex heart rate instantly kam karta hai.'],['10-min Walk','Adrenaline naturally discharge hota hai safely.'],['Trigger Diary','Time, hunger level, sleep quality note karo — pattern identify karo.'],['Partner Script','"Mere hormones bahut unbalanced hain — yeh personal nahi hai."'],['Humor','Absurdity mein humor dhundho — release hota hai.']]},
  tired:{e:'😴',key:'m_tired',why:'Progesterone sedative effect + 50% blood volume increase + organ development = energy drain.',tips:[['20-min Power Nap','Slow wave se pehle uthna — no grogginess. 1-3pm ideal time.'],['Iron Check','Normal Hb > 11g/dL. Palak + nimbu saath = iron absorption 3x.'],['Hydration','1L dehydration = 20% energy drop. Min 2.5-3L fluid daily.'],['Cancel Plans','Social obligations cancel karna aaj valid hai.'],['Thyroid Check','Hypothyroidism common in pregnancy — TSH test karwao if severe.'],['Cold Shower','2 min cold water → cortisol + adrenaline natural boost.']]},
  nauseous:{e:'🤢',key:'m_nauseous',why:'HCG hormone week 8-10 pe peak. Smell sensitivity dramatically badhti hai.',tips:[['Ginger','1g daily ginger → nausea 40% reduce (clinical evidence). Gingerols block 5-HT3.'],['Small Meals','Khali pet = bile + worst nausea. Har 2 hrs mein thoda khaao.'],['Vitamin B6','Pyridoxine 10-25mg 3x daily — clinically proven. Banana, sweet potato.'],['Acupressure P6','Wrist ke andar 3 fingers down — firm pressure 2-3 min. Sea-bands bhi kaam karte hain.'],['Cold Foods','Garam khaane ki smell trigger hai. Cold dahi/fruits better tolerated.'],['Hyperemesis Alert','3+ vomits/day, weight loss, unable to keep fluids → IMMEDIATE doctor.']]},
  overwhelmed:{e:'🌊',key:'m_overwhelmed',why:'Cognitive overload + hormones + identity restructuring (matrescence). Brain literally reorganize ho raha hai.',tips:[['Brain Dump','Sab unfiltered likho. Working memory free → anxiety 30% kam.'],['2-List Method','List A: Serious consequences if not done. List B: Rest. Sirf A ke 2-3 items aaj.'],['Reduce Decisions','Daily choices pre-plan karo — decision fatigue real hai.'],['Say No','"Main abhi available nahi hun" complete sentence hai.'],['Specific Ask','"Kya tum groceries la sakte ho?" vs "Help karo" → 3x more effective.'],['Matrescence','"Kaun hun main ab?" — identity shift normal hai. Acknowledge karo.']]},
  scared:{e:'😨',key:'m_scared',why:'Amygdala hyperactive in pregnancy — evolutionary programming, sometimes maladaptive today.',tips:[['Learn About It','Specific fears ke baare mein padho — unknown zyada scary hota hai.'],['Birth Plan','Options jaanno → helplessness kam → fear reduce.'],['Positive Stories','Curated positive birth stories sirf — negative ones avoid.'],['Fear Exercise','Worst case → how would I cope → reality check. 90% fears unrealistic.'],['EMDR/CBT','Tokophobia treatable hai — 4-6 sessions. Seeking help = smart.'],['Partner Brief','Vague "main scared hun" se specific fears → practical support possible.']]},
  lonely:{e:'🥺',key:'m_lonely',why:'Social circles shift + maternity leave isolation + relationship dynamics change.',tips:[['Pregnancy Groups','Same stage ke log — WhatsApp local groups, BabyCenter India.'],['Acknowledge Shift','Matrescence identity transition existential loneliness cause karta hai.'],['Schedule Calls','Calendar pe weekly call block karo — spontaneous socializing mushkil.'],['Talk to Baby','Week 18 se baby sun sakta hai — bond banao. Oxytocin release.'],['Community Role','Support groups mein dene wali position lo — meaning + connection.'],['Partner Ritual','Weekly 30 min shared activity. Physical presence = loneliness ka antidote.']]},
  happy:{e:'😊',key:'m_happy',why:'Second trimester "pregnancy glow" real hai — estrogen skin hydration badhata hai.',tips:[['Gratitude Log','3 specific moments aaj — brain positive bias develop karta hai.'],['Bump Photos','Same spot, time, outfit — timelapse baad mein banao.'],['Energy Banking','Khushi journal mein likho — dark days mein kaam aata hai.'],['Baby Bonding','Music, naam, poetry — fetal brain development + attachment.'],['Celebrate','Har trimester ek celebration — milestones acknowledge karo.'],['Share Joy','Neuroscience: khushi share karne se genuinely badhti hai.']]},
  excited:{e:'🥰',key:'m_excited',why:'Dopamine + oxytocin baby ke thought pe release hote hain — brain pregnancy ke liye rewire ho raha hai.',tips:[['Nest Building','Nursery, names, layette — oxytocin boost. Biologically programmed.'],['Partner Bond','Movements feel karo saath, appointments attend karo milke.'],['Future Vision','Baby ke liye hopes likhna — beautiful attachment exercise.'],['Body Gratitude','Stretch marks, weight — sab badges of honor hain.'],['Learn Now','Newborn care, breastfeeding, infant CPR — best time while excited.'],['Document All','Pregnancy diary — feelings, cravings, kicks — bachche ko baad mein dikhao.']]},
};

function renderMoodGrid(){
  const g=$('moodGrid'); if(!g) return;
  const moods=Object.keys(MOODS);
  g.innerHTML=moods.map(m=>`<button class="mood-btn" data-mood="${m}"><span class="mi">${MOODS[m].e}</span><span>${T[MOODS[m].key]||m}</span></button>`).join('');
  g.querySelectorAll('.mood-btn').forEach(b=>b.addEventListener('click',()=>{
    g.querySelectorAll('.mood-btn').forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');
    showMoodTips(b.dataset.mood);
    if(user) supa.from('mood_logs').insert({user_id:user.id,mood_type:b.dataset.mood}).then(()=>{});
  }));
}

function showMoodTips(mood){
  const d=MOODS[mood]; if(!d) return;
  const card=$('moodTipsCard');
  $('moodTipsContent').innerHTML=`
    <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;background:linear-gradient(135deg,#fce8e8,#fdf5ee);margin-bottom:14px">
      <span style="font-size:34px">${d.e}</span>
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--warm)">${T[d.key]||mood}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px;line-height:1.55">${d.why}</div>
      </div>
    </div>
    <div class="g2">${d.tips.map(([l,t])=>`<div style="background:white;border-radius:13px;padding:12px 14px;border-left:3px solid var(--rose)"><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);margin-bottom:3px;font-weight:600">${l}</div><div style="font-size:12.5px;color:var(--warm);line-height:1.65">${t}</div></div>`).join('')}</div>`;
  card.style.display='block';
  card.style.animation='none'; void card.offsetWidth; card.style.animation='fadeUp .35s ease';
  card.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ══════════════════════════════════════
// BREATHING
// ══════════════════════════════════════
function startBreathing(){
  if(breathOn){clearTimeout(breathTimer);breathOn=false;$('breathBtn').textContent=T.breathStart;setText('breathStatus','');setText('breathCount','');$('breathLabel').textContent='Start';$('breathRing').style.transform='scale(1)';return;}
  breathOn=true;breathRounds=0;$('breathBtn').textContent=T.breathStop;
  const phases=[{l:'Inhale',d:4000,s:'1.45'},{l:'Hold',d:4000,s:'1.45'},{l:'Exhale',d:4000,s:'1'},{l:'Pause',d:2000,s:'1'}];
  let i=0;
  function next(){
    if(!breathOn) return;
    if(i>=phases.length){breathRounds++;setText('breathCount',`Round ${breathRounds}/4 ✓`);if(breathRounds>=4){$('breathRing').style.transform='scale(1)';$('breathLabel').textContent='✅';setText('breathStatus','🌸 Bahut achha!');breathOn=false;$('breathBtn').textContent=T.breathStart;return;}i=0;}
    const p=phases[i];
    $('breathRing').style.transition=`transform ${p.d}ms ease-in-out`;
    $('breathRing').style.transform=`scale(${p.s})`;
    $('breathLabel').textContent=p.l;
    i++;breathTimer=setTimeout(next,p.d);
  }next();
}

// ══════════════════════════════════════
// AFFIRMATIONS
// ══════════════════════════════════════
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
  const d=document.createElement('div');d.className='msg bot';d.textContent=txt;
  const b=$('chatBox');if(b){b.appendChild(d);b.scrollTop=b.scrollHeight;}
}
function addUserMsg(txt){
  const d=document.createElement('div');d.className='msg user';d.textContent=txt;
  const b=$('chatBox');if(b){b.appendChild(d);b.scrollTop=b.scrollHeight;}
}

async function sendChat(){
  const inp=$('chatInput'); const txt=inp.value.trim(); if(!txt) return;
  inp.value=''; addUserMsg(txt); chatHist.push({role:'user',content:txt});
  const typing=document.createElement('div');typing.className='msg bot';typing.style.cssText='font-style:italic;color:var(--muted)';typing.textContent='...💭';
  $('chatBox').appendChild(typing);$('chatBox').scrollTop=9999;
  try{
    const langName={hinglish:'Hinglish (natural Hindi-English mix)',hi:'Hindi',en:'English',ta:'Tamil',bn:'Bengali',mr:'Marathi',te:'Telugu'}[lang]||'Hinglish';
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:`You are MamaCare AI — warm, empathetic pregnancy support companion. Speak in ${langName}. Tone: caring elder sister + certified nurse-midwife. 2-4 sentences max. Validate feelings first. Soft emojis naturally. Recommend doctor for medical concerns.`,messages:chatHist})});
    const data=await r.json();typing.remove();
    const reply=data.content?.[0]?.text||'🌸';addBotMsg(reply);chatHist.push({role:'assistant',content:reply});
  }catch{typing.remove();addBotMsg('Network issue 🌸');}
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
function getSizeEmoji(w){return w<=4?'🌱 Sesame seed':w<=6?'🍋 Lemon seed':w<=8?'🍓 Raspberry':w<=10?'🍓 Strawberry':w<=12?'🍊 Lime':w<=16?'🥑 Avocado':w<=20?'🍌 Banana':w<=24?'🌽 Corn':w<=28?'🍆 Eggplant':w<=32?'🍍 Pineapple':w<=36?'🥥 Coconut':'🍉 Watermelon';}
function getMoodTipW(w){return w<=6?'Test positive! Excitement + anxiety dono normal hain.':w<=13?'First trimester anxiety peak — emotions ko safe space do.':w<=27?'Golden period — energy wapas, kicks soon. Enjoy!':w<=36?'Delivery anxiety normal — birth classes bahut help karte hain.':'Excited + scared + exhausted + ready — sab ek saath. Almost there! 🌸';}

function calcDue(){
  const lmp=new Date($('lmpDate').value); if(isNaN(lmp.getTime())) return;
  const due=new Date(lmp.getTime()+280*86400000);
  $('directDue').value=due.toISOString().split('T')[0];
  if(user) supa.from('user_profile').upsert({id:user.id,email:user.email,lmp_date:$('lmpDate').value,due_date:$('directDue').value}).then(()=>{});
  flash('due-save',T.synced); showTimeline(due);
}

function calcFromDue(){
  const due=new Date($('directDue').value); if(isNaN(due.getTime())) return;
  const lmp=new Date(due.getTime()-280*86400000);
  $('lmpDate').value=lmp.toISOString().split('T')[0];
  if(user) supa.from('user_profile').upsert({id:user.id,email:user.email,lmp_date:$('lmpDate').value,due_date:$('directDue').value}).then(()=>{});
  flash('due-save',T.synced); showTimeline(due);
}

function showTimeline(due){
  const now=new Date(),elapsed=Math.max(0,Math.floor((now-new Date(due.getTime()-280*86400000))/86400000));
  const week=Math.min(40,Math.floor(elapsed/7)+1),pct=Math.min(100,Math.round(elapsed/280*100));
  const daysLeft=Math.max(0,Math.round((due-now)/86400000)),tri=week<=13?1:week<=27?2:3;
  const tn=[T.t1,T.t2,T.t3][tri-1];
  $('dueResult').innerHTML=`<div class="g3"><div class="stat"><div class="stat-v">${T.wk} ${week}</div><div class="stat-l">Current</div></div><div class="stat"><div class="stat-v">${daysLeft}</div><div class="stat-l">${T.days}</div></div><div class="stat"><div class="stat-v">${pct}%</div><div class="stat-l">${T.done}</div></div></div><p style="font-size:13px;color:var(--muted);margin-top:10px;padding:9px 13px;background:rgba(232,160,168,.08);border-radius:10px">🗓️ Due: <strong>${fmtDate(due.toISOString().split('T')[0])}</strong> | ${getSizeEmoji(week)}</p>`;
  $('timelineCard').style.display='block'; setText('pctText',pct+'%');
  setTimeout(()=>$('timelineFill').style.width=pct+'%',100);
  $('triCards').innerHTML=[{n:`${T.t1} ${T.tri}`,w:'Week 1–13',d:'Organ formation, nausea, fatigue'},{n:`${T.t2} ${T.tri}`,w:'Week 14–27',d:'Energy boost, baby kicks!'},{n:`${T.t3} ${T.tri}`,w:'Week 28–40',d:'Growth, delivery prep'}].map((t,i)=>`<div class="tri-c${tri===i+1?' current':''}"><div style="font-size:10px;font-weight:600;color:var(--accent);margin-bottom:3px">${t.w}</div><div style="font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:4px">${t.n}</div><div style="font-size:11.5px;color:var(--muted);line-height:1.5">${t.d}</div>${tri===i+1?'<div style="font-size:11px;color:var(--accent);font-weight:600;margin-top:5px">← You are here ✓</div>':''}</div>`).join('');
  const wd=getWD(week);
  $('weekDetailCard').style.display='block';
  setText('weekDetailTitle',`${T.wk} ${week} of 40`);
  $('weekDetailGrid').innerHTML=`<div class="g3"><div style="background:white;border-radius:13px;padding:13px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);margin-bottom:5px;font-weight:600">👶 ${T.baby}</div><p style="font-size:12.5px;line-height:1.65">${wd.b}</p></div><div style="background:white;border-radius:13px;padding:13px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--blue);margin-bottom:5px;font-weight:600">🤱 ${T.body}</div><p style="font-size:12.5px;line-height:1.65">${wd.body}</p></div><div style="background:white;border-radius:13px;padding:13px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--green);margin-bottom:5px;font-weight:600">💡 ${T.tip}</div><p style="font-size:12.5px;line-height:1.65">${wd.tip}</p></div></div>`;
  $('weekMoodTip').innerHTML=`<strong style="color:var(--accent)">🌸 ${T.mTip}:</strong> ${getMoodTipW(week)}`;
}

// ══════════════════════════════════════
// WEIGHT — Supabase
// ══════════════════════════════════════
async function loadWeights(){
  if(!user) return;
  const {data}=await supa.from('weight_logs').select('*').eq('user_id',user.id).order('logged_at');
  renderWeights(data||[]);
}
function savePreWeight(){const v=parseFloat($('preWeight').value);if(v&&user)supa.from('user_profile').upsert({id:user.id,email:user.email,pre_weight:v}).then(()=>{});}
async function addWeight(){
  const kg=parseFloat($('wtInput').value),wk=parseInt($('wtWeek').value);
  if(!kg||kg<30||kg>200){alert('Valid weight daalo (30-200kg)');return;}
  if(!user) return;
  await supa.from('weight_logs').insert({user_id:user.id,weight_kg:kg,week_number:wk||null});
  $('wtInput').value='';flash('wt-save',T.synced);loadWeights();
}
async function deleteWeight(id){await supa.from('weight_logs').delete().eq('id',id);loadWeights();}
function renderWeights(ws){
  const pre=parseFloat($('preWeight')?.value)||0,last=ws[ws.length-1];
  const gain=ws.length>=2?(last.weight_kg-ws[0].weight_kg).toFixed(1):'—';
  const tg=pre&&last?(last.weight_kg-pre).toFixed(1):'—';
  $('wtStats').innerHTML=`<div class="stat"><div class="stat-v">${last?last.weight_kg+'kg':'—'}</div><div class="stat-l">Current</div></div><div class="stat"><div class="stat-v">${gain!=='—'?(parseFloat(gain)>=0?'+':'')+gain+'kg':'—'}</div><div class="stat-l">Change</div></div><div class="stat"><div class="stat-v">${tg!=='—'?(parseFloat(tg)>=0?'+':'')+tg+'kg':'—'}</div><div class="stat-l">Total Gain</div></div>`;
  $('weightLog').innerHTML=ws.length?ws.slice().reverse().map(w=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px"><span>W${w.week_number||'?'} — <strong>${w.weight_kg}kg</strong></span><span style="display:flex;align-items:center;gap:8px"><span style="font-size:12px;color:var(--muted)">${new Date(w.logged_at).toLocaleDateString('en-IN')}</span><button onclick="MC.deleteWeight('${w.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px">×</button></span></div>`).join(''):'<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi entry nahi.</p>';
  if(wtChart){wtChart.destroy();wtChart=null;}
  if(ws.length>=2){const ctx=$('weightChart')?.getContext('2d');if(ctx)wtChart=new Chart(ctx,{type:'line',data:{labels:ws.map(w=>`W${w.week_number||'?'}`),datasets:[{label:'kg',data:ws.map(w=>w.weight_kg),borderColor:'#e8a0a8',backgroundColor:'rgba(232,160,168,.12)',tension:.4,pointBackgroundColor:'#c97b7b',pointRadius:5,fill:true}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{grid:{color:'rgba(200,100,100,.06)'},ticks:{font:{size:11}}}}}});}
}

// ══════════════════════════════════════
// YOGA
// ══════════════════════════════════════
const YCATS=[{k:'all',l:'All'},{k:'1',l:'1st Tri'},{k:'2',l:'2nd Tri'},{k:'3',l:'3rd Tri'},{k:'breathing',l:'🌬️ Breathing'},{k:'stretch',l:'🤸 Stretch'},{k:'strength',l:'💪 Strength'},{k:'cardio',l:'🏃 Cardio'},{k:'pelvic',l:'🌸 Pelvic'}];
const YOGA=[
  {icon:'🧘',name:'Cat-Cow Stretch',cat:['all','1','2','3','stretch'],dur:'5-10 min',lvl:'Beginner',short:'Spine flexibility, back pain relief.',why:'Relaxin hormone ligaments loosen karta hai — controlled spinal movement essential.',steps:['Tabletop: haath shoulders ke neeche, ghutne hips ke neeche.','Cow (inhale): peth neeche, sar upar, tailbone upar.','Cat (exhale): peth andar, sar neeche, kamar round.','10-15 reps, saans ke saath sync. No jerks.','Slow, comfortable range only.'],benefits:'Lower back pain relief | Hip flexibility | Stress reduction',avoid:'Wrist pain mein fists use karo.'},
  {icon:'🦋',name:'Butterfly Pose',cat:['all','1','2','3','stretch'],dur:'5-8 min',lvl:'Beginner',short:'Hips open — delivery ke liye best prep.',why:'Pelvic floor + hip flexors delivery mein key role.',steps:['Seedhe baitho — wall support optional.','Dono talne milaao. Gothne naturally side mein.','Spine straight. Deep breathing.','Exhale pe gothic gently neeche — force mat karo!','3-5 min comfortable position mein.'],benefits:'Hip flexor stretch | Pelvic floor prep | Sciatic relief',avoid:'SPD mein cautiously. Force nahi.'},
  {icon:'🌊',name:'Prenatal Squats',cat:['all','2','3','strength'],dur:'3-5 min',lvl:'Intermediate',short:'Labor prep — pelvic opening + pushing strength.',why:'Deep squats pelvis 28% open karte hain — baby descent space.',steps:['Feet shoulder-width, toes 45° outward.','Chair support initially. Slowly lower.','Heels ground — blanket under heels agar uthein.','Namaste haath — counter balance.','30-60 sec hold. 5-8 reps. Slowly up.'],benefits:'Pelvic opening | Leg strength | Lower back relief',avoid:'Placenta previa mein avoid. Knee pain pe stop.'},
  {icon:'🌬️',name:'Ujjayi Pranayama',cat:['all','1','2','3','breathing'],dur:'10 min',lvl:'Beginner',short:'Ocean breath — cortisol reduce, BP normalize.',why:'Parasympathetic NS activate. Labor pain 20-30% reduce.',steps:['Baitho — spine straight. Mouth close.','Naak se saans — throat thoda constrict (ocean sound).','Exhale bhi naak se — same sound.','4 counts inhale, 6 counts exhale.','Kabhi bhi anxiety/pain pe immediately use karo.'],benefits:'Anxiety 40% reduction | BP normalize | Labor pain management',avoid:'No contraindications.'},
  {icon:'🌸',name:'Kegel Exercises',cat:['all','1','2','3','pelvic'],dur:'Daily',lvl:'Beginner',short:'Pelvic floor — delivery prep + incontinence prevention.',why:'Strong pelvic floor: shorter pushing, less tearing, faster recovery.',steps:['Identify muscles: urine mid-stream rokne ki feeling (identify only).','Comfortable position — baith ke ya lait ke.','Contract — andar + upar pull. Stomach nahi!','5-10 sec hold. Fully release.','10-15 reps, 3 sets daily.'],benefits:'Incontinence prevention | Shorter pushing stage | Faster recovery',avoid:'No contraindications — most important exercise!'},
  {icon:'💪',name:'Side-Lying Leg Lifts',cat:['all','2','3','strength'],dur:'5-8 min',lvl:'Beginner',short:'Hip strength without back pressure.',why:'Back pe litnaa IVC compress kar sakta hai after W12.',steps:['Baayi karwat pe aao.','Ghutne thoda bend, pillow for support.','Ooper wala paer straight — hip height tak.','15-20 reps. Dono sides.','Clam shells variation bhi try karo.'],benefits:'Glute strength | Pelvic stability | Safe for all trimesters',avoid:'Hip pain pe range reduce karo.'},
  {icon:'🤸',name:'Prenatal Walking',cat:['all','1','2','3','cardio'],dur:'20-30 min daily',lvl:'Beginner',short:'Best overall exercise — cardio, mood, sleep, labor prep.',why:'ACOG recommends 150 min moderate cardio/week. GD 27% reduce.',steps:['Comfortable shoes, no heels.','Talk test pace — conversation possible.','5 min warm up + 5 min cool down.','Paani bottle saath.','Heart rate under 140 bpm.'],benefits:'Cardio | Mood boost | GD prevention | Better sleep',avoid:'Uneven terrain 3rd trimester mein.'},
  {icon:'🌙',name:"Child's Pose (Modified)",cat:['all','1','2','3','stretch'],dur:'3-5 min',lvl:'Beginner',short:'Instant lower back relief + grounding.',why:'Forward fold parasympathetic NS activate, oxytocin release.',steps:['Ghutne wide open (mat width se zyada), toes touch.','Haath aage — slowly forward.','Forehead mat ya block pe. Neck relaxed.','BELLY KO SPACE MILEGI — ghutne wide hain.','5-10 deep breaths then slowly up.'],benefits:'Lower back relief | Hip flexors | Calming | Baby awareness',avoid:'Knee discomfort mein cushion rakho.'},
  {icon:'😤',name:'Lamaze Breathing',cat:['all','3','breathing'],dur:'Daily 10-15 min',lvl:'Intermediate',short:'Labor pain management — clinically proven.',why:'Gate control theory: breathing competes with pain signals. 40-50% reduction.',steps:['Pattern 1 Early: "hee-hee-hee-who" — slow, steady.','Pattern 2 Active: accelerated with contraction peak.','Pattern 3 Transition: "hee-hee-who" — puffs then blow.','Pattern 4 Pushing: deep breath → hold → push 6-8 sec.','Partner ko sikhao. Daily practice essential.'],benefits:'Pain management | Oxygen to baby | Focus during contractions',avoid:'Hyperventilation pe pause karo.'},
];

function initYogaFilters(){
  const fr=$('yogaFilterRow');if(!fr||fr.children.length) return;
  fr.innerHTML=YCATS.map(c=>`<button class="tab-btn${c.k==='all'?' active':''}" data-ycat="${c.k}">${c.l}</button>`).join('');
  fr.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{fr.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');yogaFilterKey=b.dataset.ycat;renderYogaGrid();}));
  const av=$('avoidList');if(av)av.innerHTML=[['Flat back (W12+)','IVC compression — dizziness, reduced blood flow.'],['Intense ab crunches','Diastasis recti risk.'],['Contact sports/skiing','Fall + impact risk.'],['Hot yoga/sauna','Overheating danger.'],['Breath holding','Fetal oxygenation reduce hoti hai.'],['Heavy lifting >10kg','Intra-abdominal pressure.'],['High altitude','Oxygen reduction.'],['Exercise through pain','Pain = stop signal.']].map(([t,d])=>`<div style="background:white;border-radius:12px;padding:12px;border-left:3px solid #e05c5c"><div style="font-weight:600;font-size:13px;margin-bottom:2px">⚠️ ${t}</div><div style="font-size:12px;color:var(--muted);line-height:1.55">${d}</div></div>`).join('');
  renderYogaGrid();
}

function renderYogaGrid(){
  const g=$('yogaGrid');if(!g)return;
  const filtered=yogaFilterKey==='all'?YOGA:YOGA.filter(y=>y.cat.includes(yogaFilterKey));
  g.innerHTML=filtered.map(y=>`
    <div class="yoga-card" onclick="this.classList.toggle('open')">
      <div style="font-size:38px;margin-bottom:8px">${y.icon}</div>
      <div style="font-weight:600;font-size:13.5px;margin-bottom:4px">${y.name}</div>
      <div style="display:flex;gap:5px;margin-bottom:7px"><span class="pill pill-g">⏱ ${y.dur}</span><span class="pill pill-b">${y.lvl}</span></div>
      <div style="font-size:12.5px;color:var(--muted);line-height:1.55">${y.short}</div>
      <div style="font-size:11.5px;color:var(--accent);margin-top:8px;font-weight:500">▼ Tap for details</div>
      <div class="yoga-detail">
        <p style="font-size:12.5px;color:var(--muted);line-height:1.65;margin-bottom:10px"><strong style="color:var(--green)">Why:</strong> ${y.why}</p>
        ${y.steps.map((s,i)=>`<div class="yoga-step"><div class="yoga-step-num">${i+1}</div><div style="font-size:12.5px;line-height:1.6">${s}</div></div>`).join('')}
        <div style="background:var(--cream);border-radius:10px;padding:9px 12px;margin-top:8px;font-size:12px"><strong style="color:var(--green)">Benefits:</strong> ${y.benefits}</div>
        <div style="background:#fff5f5;border-radius:10px;padding:8px 12px;margin-top:6px;font-size:12px;color:#c94040">⚠️ ${y.avoid}</div>
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════
// SLEEP — Supabase
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
  if(!user) return;
  const {data}=await supa.from('sleep_logs').select('*').eq('user_id',user.id).order('logged_at',{ascending:false}).limit(30);
  renderSleepUI(data||[]);
}

async function logSleep(){
  const s=$('sleepStart').value,e=$('sleepEnd').value;
  if(!s||!e){alert('Bedtime aur wake time daalo');return;}
  if(!user) return;
  let mins=(parseInt(e.split(':')[0])*60+parseInt(e.split(':')[1]))-(parseInt(s.split(':')[0])*60+parseInt(s.split(':')[1]));
  if(mins<0)mins+=1440;
  const hrs=Math.round(mins/60*10)/10;
  await supa.from('sleep_logs').insert({user_id:user.id,bedtime:s,wake_time:e,duration_hrs:hrs,quality:parseInt($('sleepQuality').value),issue:$('sleepIssue').value||null});
  flash('sleep-save',T.synced);loadSleepLogs();
}

async function deleteSleep(id){await supa.from('sleep_logs').delete().eq('id',id);loadSleepLogs();}

function renderSleepUI(logs){
  const avg7=logs.length?(logs.slice(0,7).reduce((a,s)=>a+parseFloat(s.duration_hrs),0)/Math.min(7,logs.length)).toFixed(1):0;
  $('sleepStats').innerHTML=`<div class="stat"><div class="stat-v">${logs[0]?.duration_hrs||'—'}h</div><div class="stat-l">Last Night</div></div><div class="stat"><div class="stat-v">${avg7}h</div><div class="stat-l">7-Day Avg</div></div><div class="stat"><div class="stat-v" style="font-size:1.4rem">${['','😞','😐','😊'][logs[0]?.quality||0]||'—'}</div><div class="stat-l">Quality</div></div>`;
  $('sleepLog').innerHTML=logs.length?logs.slice(0,14).map(s=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px"><span>${new Date(s.logged_at).toLocaleDateString('en-IN')} — <strong>${s.duration_hrs}h</strong> ${['','😞','😐','😊'][s.quality||0]}</span><span style="display:flex;align-items:center;gap:6px"><span class="pill ${parseFloat(s.duration_hrs)>=7?'pill-g':parseFloat(s.duration_hrs)>=5?'pill-b':'pill-r'}">${parseFloat(s.duration_hrs)>=7?'Good':parseFloat(s.duration_hrs)>=5?'OK':'Short'}</span><button onclick="MC.deleteSleep('${s.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px">×</button></span></div>`).join(''):'<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi entry nahi.</p>';
  $('sleepTipsGrid').innerHTML=SLEEP_TIPS.map(t=>`<div style="background:white;border-radius:14px;padding:13px;border-left:3px solid var(--lavender)"><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--lavender);margin-bottom:3px;font-weight:600">${t.t}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${t.b}</div></div>`).join('');
  if(slChart){slChart.destroy();slChart=null;}
  const last7=logs.slice(0,7).reverse();
  if(last7.length){const ctx=$('sleepChart')?.getContext('2d');if(ctx)slChart=new Chart(ctx,{type:'bar',data:{labels:last7.map(s=>new Date(s.logged_at).toLocaleDateString('en-IN',{day:'numeric',month:'numeric'})),datasets:[{label:'hrs',data:last7.map(s=>s.duration_hrs),backgroundColor:last7.map(s=>parseFloat(s.duration_hrs)>=7?'rgba(106,184,154,.75)':parseFloat(s.duration_hrs)>=5?'rgba(232,160,168,.75)':'rgba(220,80,80,.65)'),borderRadius:8}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{min:0,max:12,ticks:{font:{size:11},callback:v=>v+'h'}},x:{ticks:{font:{size:10}}}}}});}
}

// ══════════════════════════════════════
// NUTRITION — Supabase
// ══════════════════════════════════════
const MEAL_PLANS={
  1:{focus:'Folic Acid, B6 (nausea), Iron, Zinc. Small frequent meals.',meals:[{t:'🌅 Breakfast',i:['Dalia + fruits (fiber)','Banana + wheat toast (B6)','Ginger lemon water (nausea)']},{t:'🍪 Mid-morning',i:['Walnuts + 2 dates (iron)','Coconut water (electrolytes)']},{t:'☀️ Lunch',i:['Dal + rice + palak (iron+folate)','Curd (calcium+probiotics)','Salad + nimbu (Vit C = iron 3x)']},{t:'🌙 Dinner',i:['Khichdi / idli (easy digest)','Vegetable soup','Warm haldi milk (calcium)']}],avoid:['Raw papaya/pineapple','Unpasteurized dairy','High mercury fish','Raw sprouts']},
  2:{focus:'Calcium, Vit D, Omega-3, Protein. Baby bones + brain developing.',meals:[{t:'🌅 Breakfast',i:['2 eggs + wheat toast (choline)','OJ/mosambi (Vit C)','Mixed nuts']},{t:'🍪 Mid-morning',i:['Greek yogurt + berries','Ragi ladoo (iron+calcium)']},{t:'☀️ Lunch',i:['Fish/tofu curry (omega-3)','Rajma/chhole (protein+iron)','Brown rice + salad']},{t:'🌙 Dinner',i:['Paneer/chicken (protein)','Methi saag (iron+folate)','Sweet potato (beta-carotene)']}],avoid:['Junk/processed foods','Excess sweets (GD risk)','Caffeine >200mg/day','Smoked meats']},
  3:{focus:'Vit K, Iron, Calcium, Fiber (constipation). Very small meals — stomach cramped.',meals:[{t:'🌅 Breakfast',i:['Oats + flaxseeds (omega-3+fiber)','2-3 dates (iron + labor prep)','Warm milk (calcium)']},{t:'🍪 Mid-morning',i:['Dry fruits mix','Tender coconut water']},{t:'☀️ Lunch',i:['Palak paneer (iron+calcium)','Dal makhani (protein)','Small rice/roti portion']},{t:'🌙 Dinner',i:['Light khichdi / soup','Boiled vegetables','Avoid heavy — heartburn worse!']}],avoid:['Gas foods (beans, broccoli)','Spicy food (heartburn)','Large meals','Lying down after eating']},
};

function initNutrition(){
  document.querySelectorAll('#mealTimeBtns .tab-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#mealTimeBtns .tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');mealTab=b.dataset.meal;renderFoodLog();}));
  document.querySelectorAll('#triMealTabs .tab-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#triMealTabs .tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderMealPlan(parseInt(b.dataset.tri));}));
  renderMealPlan(1);
}

function renderMealPlan(tri){
  const plan=MEAL_PLANS[tri];const el=$('mealPlanContent');if(!el||!plan) return;
  el.innerHTML=`<div style="background:rgba(232,160,168,.08);border-radius:10px;padding:11px 13px;margin-bottom:12px;font-size:13px;color:var(--muted);line-height:1.7"><strong style="color:var(--accent)">Focus:</strong> ${plan.focus}</div>`+
    plan.meals.map(m=>`<div style="margin-bottom:12px"><div style="font-weight:600;font-size:13px;margin-bottom:6px">${m.t}</div>${m.i.map(i=>`<div style="font-size:12.5px;color:var(--muted);padding:4px 0 4px 12px;border-left:2px solid var(--blush);margin-bottom:3px;line-height:1.5">${i}</div>`).join('')}</div>`).join('')+
    `<div style="background:#fff5f5;border-radius:10px;padding:10px 12px;margin-top:8px"><div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:5px">⚠️ Avoid this trimester:</div>${plan.avoid.map(a=>`<div style="font-size:12.5px;color:var(--muted);padding:2px 0">• ${a}</div>`).join('')}</div>`;
}

async function loadWater(){
  if(!user) return;
  const {data}=await supa.from('water_logs').select('glasses_count').eq('user_id',user.id).eq('log_date',todayStr()).maybeSingle();
  waterCount=data?.glasses_count||0;renderWater();
}

function renderWater(){
  const el=$('waterTrack');if(!el) return;el.innerHTML='';
  for(let i=0;i<10;i++){const g=document.createElement('span');g.style.cssText=`font-size:25px;cursor:pointer;transition:.2s;filter:${i<waterCount?'none':'grayscale(1)'};opacity:${i<waterCount?'1':'0.3'}`;g.textContent='🥤';
    g.onclick=async()=>{waterCount=i<waterCount?i:i+1;if(user){await supa.from('water_logs').upsert({user_id:user.id,log_date:todayStr(),glasses_count:waterCount});flash('nutri-save',T.synced);}renderWater();updateNutriBars();};el.appendChild(g);}
  const msg=$('waterMsg');if(msg)msg.textContent=waterCount>=10?'🎉 Goal complete!':waterCount>=6?`✅ ${waterCount}/10 — Good!`:`💧 ${waterCount}/10 — ${10-waterCount} more needed`;
  updateNutriBars();
}

function updateNutriBars(){
  const el=$('nutriBars');if(!el) return;
  const cal=foodLogs.reduce((a,f)=>a+(f.calories||0),0),goal=2200;
  el.innerHTML=`<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:3px"><span>🔥 Calories</span><span>${cal}/${goal} kcal</span></div><div style="height:8px;background:#f0e0e0;border-radius:50px;overflow:hidden"><div style="height:100%;width:${Math.min(100,Math.round(cal/goal*100))}%;background:linear-gradient(90deg,var(--rose),var(--peach));border-radius:50px;transition:width .5s"></div></div></div><div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:3px"><span>💧 Water</span><span>${waterCount}/10</span></div><div style="height:8px;background:#f0e0e0;border-radius:50px;overflow:hidden"><div style="height:100%;width:${waterCount*10}%;background:linear-gradient(90deg,var(--blue),#4a98c4);border-radius:50px;transition:width .5s"></div></div></div><p style="font-size:12px;color:var(--muted);margin-top:9px">💡 Pregnancy mein ~300 extra calories needed daily.</p>`;
}

async function loadFoodLog(){
  if(!user) return;
  const {data}=await supa.from('food_logs').select('*').eq('user_id',user.id).eq('food_date',todayStr()).order('logged_at');
  foodLogs=data||[];renderFoodLog();updateNutriBars();
}

function renderFoodLog(){
  const list=$('foodList');if(!list) return;
  const filtered=mealTab==='all'?foodLogs:foodLogs.filter(f=>f.meal_type===mealTab);
  list.innerHTML=filtered.length?filtered.slice().reverse().map(f=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px"><span>${{breakfast:'🌅',lunch:'☀️',snack:'🍪',dinner:'🌙'}[f.meal_type]||'🍽️'} ${f.food_name}</span><span style="display:flex;align-items:center;gap:7px"><span style="font-size:12px;color:var(--muted)">${f.calories} cal</span><button onclick="MC.deleteFood('${f.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px">×</button></span></div>`).join(''):'<p style="font-size:13px;color:var(--muted);text-align:center;padding:12px">Koi food log nahi.</p>';
}

async function addFood(){
  const name=$('foodInput').value.trim();if(!name) return;
  if(!user) return;
  const {data}=await supa.from('food_logs').insert({user_id:user.id,food_name:name,calories:parseInt($('foodCalSel').value),meal_type:mealTab,food_date:todayStr()}).select().single();
  if(data){foodLogs.push(data);$('foodInput').value='';renderFoodLog();updateNutriBars();flash('nutri-save',T.synced);}
}

async function deleteFood(id){await supa.from('food_logs').delete().eq('id',id);foodLogs=foodLogs.filter(f=>f.id!==id);renderFoodLog();updateNutriBars();}

// ══════════════════════════════════════
// MEDICINES — Supabase
// ══════════════════════════════════════
async function loadMedicines(){
  if(!user) return;
  const {data:meds}=await supa.from('medicines').select('*').eq('user_id',user.id).eq('is_active',true).order('time_of_day');
  const {data:logs}=await supa.from('medicine_logs').select('medicine_id').eq('user_id',user.id).eq('taken_date',todayStr());
  medicines=meds||[];medTaken={};(logs||[]).forEach(l=>medTaken[l.medicine_id]=true);
  renderMedicines();
}

function renderMedicines(){
  const taken=Object.keys(medTaken).length,total=medicines.length,pct=total?Math.round(taken/total*100):0;
  $('medStats').innerHTML=`<div class="stat"><div class="stat-v">${taken}</div><div class="stat-l">Liya</div></div><div class="stat"><div class="stat-v">${total-taken}</div><div class="stat-l">Baaki</div></div><div class="stat"><div class="stat-v">${pct}%</div><div class="stat-l">Done</div></div>`;
  $('medProgressBar').style.width=pct+'%';
  $('medList').innerHTML=medicines.length?medicines.map(m=>`<div style="display:flex;align-items:center;gap:12px;background:white;border-radius:14px;padding:13px;margin-bottom:8px"><div style="width:42px;height:42px;border-radius:12px;background:${medTaken[m.id]?'#e8f5e9':'#fce8e8'};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${m.icon}</div><div style="flex:1"><div style="font-weight:600;font-size:13.5px">${m.name}</div><div style="font-size:12px;color:var(--muted);margin-top:1px">${m.dose||''}${m.notes?' • '+m.notes:''}</div><div style="font-size:11.5px;color:var(--accent);margin-top:2px">⏰ ${m.time_of_day||'—'}</div></div><div style="display:flex;gap:6px"><button onclick="MC.toggleMedTaken('${m.id}')" style="padding:6px 13px;border-radius:50px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid ${medTaken[m.id]?'var(--green)':'var(--blush)'};background:${medTaken[m.id]?'var(--green)':'white'};color:${medTaken[m.id]?'white':'var(--muted)'};font-family:'DM Sans',sans-serif">${medTaken[m.id]?'✓ Liya':'Liya?'}</button><button onclick="MC.deleteMed('${m.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:20px">×</button></div></div>`).join(''):'<p style="font-size:13px;color:var(--muted);padding:10px 0">Koi medicine nahi. Neeche se add karein.</p>';
}

async function toggleMedTaken(id){
  if(!user) return;
  if(medTaken[id]){await supa.from('medicine_logs').delete().eq('user_id',user.id).eq('medicine_id',id).eq('taken_date',todayStr());delete medTaken[id];}
  else{await supa.from('medicine_logs').upsert({user_id:user.id,medicine_id:id,taken_date:todayStr()});medTaken[id]=true;}
  flash('med-save',T.synced);renderMedicines();
}
async function addMedicine(){
  const name=$('medName').value.trim();if(!name){alert('Name daalo');return;}
  if(!user) return;
  await supa.from('medicines').insert({user_id:user.id,name,dose:$('medDose').value||'1 tablet',time_of_day:$('medTime').value||'08:00',icon:$('medIcon').value,notes:$('medNotes').value,is_active:true});
  ['medName','medDose','medNotes'].forEach(id=>{const e=$(id);if(e)e.value='';});
  toggleAddMedForm();flash('med-save',T.synced);loadMedicines();
}
async function deleteMed(id){if(!confirm('Delete karein?'))return;await supa.from('medicines').delete().eq('id',id);loadMedicines();}
function toggleAddMedForm(){const f=$('addMedForm');if(f)f.style.display=f.style.display==='none'?'block':'none';}

function initSupplementGuide(){
  const el=$('suppGuide');if(!el)return;
  el.innerHTML=[{i:'💊',n:'Folic Acid (400-800mcg)',w:'Pre-conception to W12',r:'Neural tube defects 70% prevent.'},{i:'🍊',n:'Iron + Vit C',w:'Throughout, esp 2nd+3rd',r:'Anaemia prevent. Vit C se iron 3x.'},{i:'🦴',n:'Calcium (1000mg)',w:'2nd trimester+',r:"Baby bones. Maa ki bones protect."},{i:'☀️',n:'Vitamin D (600 IU)',w:'Throughout',r:'Calcium absorption.'},{i:'🐟',n:'DHA/Omega-3 (200mg)',w:'2nd trimester+',r:'Baby brain + vision.'},{i:'🌿',n:'Magnesium (350mg)',w:'3rd trimester esp',r:'Leg cramps + sleep.'}].map(s=>`<div style="display:flex;gap:12px;padding:11px 0;border-bottom:1px solid var(--blush);align-items:flex-start"><span style="font-size:22px;flex-shrink:0">${s.i}</span><div><div style="font-weight:600;font-size:13px">${s.n}</div><div style="font-size:11.5px;color:var(--accent);margin-top:1px">⏰ ${s.w}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.6;margin-top:2px">${s.r}</div></div></div>`).join('')+'<p style="font-size:12px;color:var(--muted);margin-top:10px;padding:9px;background:rgba(220,80,80,.05);border-radius:9px">⚠️ Doctor ki salah ke bina koi supplement mat lo.</p>';
}

// ══════════════════════════════════════
// HOSPITAL BAG — Supabase
// ══════════════════════════════════════
const BAG_DEFAULT={'Maa ke Liye 👩':['Maternity nightgown (2-3)','Comfortable underwear (3-4, dark)','Non-slip chappal','Nursing bra (2)','Toiletries','Sanitary pads heavy (10-15)','Phone charger + power bank','Snacks','Water bottle (1L)'],'Baby ke Liye 👶':['Onesies (5-6, newborn)','Soft blanket (2-3)','Baby cap (2-3)','Socks (3-4)','Mittens (2-3)','Diapers newborn (15-20)','Baby wipes unscented','Going home outfit','Baby car seat'],'Documents 📄':['Aadhar card (original + copies)','Health insurance card','Previous scan reports','Doctor contact','Blood group card','Birth plan copy','Emergency contacts list'],"Partner ke Liye 👨":['Clothes (2 days)','Toiletries','Snacks + water','Cash + cards','Camera charged','Contact list for announcements']};

async function loadBag(){
  if(!user)return;
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
  $('bagPct').textContent=total?Math.round(done/total*100)+'%':'0%';
  $('bagBar').style.width=total?Math.round(done/total*100)+'%':'0%';
  $('bagCount').textContent=`${done}/${total}`;
  const cats=filterCat?[filterCat]:[...new Set(bagItems.map(i=>i.category))];
  $('bagContainer').innerHTML=cats.map(cat=>{
    const items=bagItems.filter(i=>i.category===cat);const catDone=items.filter(i=>i.is_checked).length;
    return`<div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:10px"><div style="font-weight:600;font-size:13.5px">${cat}</div><div style="font-size:12px;color:var(--muted)">${catDone}/${items.length}</div></div>`+items.map(item=>`<div onclick="MC.toggleBagItem('${item.id}')" style="display:flex;align-items:center;gap:9px;padding:8px 10px;background:white;border-radius:10px;margin-bottom:5px;cursor:pointer;opacity:${item.is_checked?'.6':'1'}"><input type="checkbox" ${item.is_checked?'checked':''} onclick="event.stopPropagation();MC.toggleBagItem('${item.id}')" style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0"/><span style="font-size:13px;${item.is_checked?'text-decoration:line-through;color:var(--muted)':''}">${item.item_name}</span></div>`).join('')+'</div>';
  }).join('');
}

async function toggleBagItem(id){
  const item=bagItems.find(i=>i.id===id);if(!item)return;
  item.is_checked=!item.is_checked;
  await supa.from('hospital_bag').update({is_checked:item.is_checked}).eq('id',id);
  flash('bag-save',T.synced);
  const activeTab=document.querySelector('#bagCatTabs .tab-btn.active');
  renderBag(activeTab?.dataset.bc==='All'?null:activeTab?.dataset.bc);
}

async function addCustomBagItem(){
  const name=$('customBagItem')?.value.trim();if(!name)return;
  const cat=$('customBagCatSel')?.value||'Misc';
  const {data}=await supa.from('hospital_bag').insert({user_id:user.id,item_name:name,category:cat,is_checked:false,is_custom:true}).select().single();
  if(data){bagItems.push(data);$('customBagItem').value='';renderBag();flash('bag-save',T.synced);}
}

async function resetBag(){
  if(!confirm('Sab uncheck karein?'))return;
  await supa.from('hospital_bag').update({is_checked:false}).eq('user_id',user.id);
  bagItems.forEach(i=>i.is_checked=false);renderBag();
}

// ══════════════════════════════════════
// BABY NAMES — Supabase
// ══════════════════════════════════════
const NAME_DB=[
  {n:'Aarav',m:'Peaceful',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Vivaan',m:'Full of life',o:'Sanskrit',g:'boy',r:['hindu','modern']},{n:'Arjun',m:'Bright, white',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Reyansh',m:'Ray of light',o:'Sanskrit',g:'boy',r:['hindu','modern']},{n:'Aryan',m:'Noble',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Dev',m:'Divine',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Dhruv',m:'Polar star',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Shaurya',m:'Bravery',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Rudra',m:'Form of Shiva',o:'Sanskrit',g:'boy',r:['hindu']},{n:'Vihaan',m:'Dawn',o:'Sanskrit',g:'boy',r:['hindu','modern']},{n:'Kabir',m:'Great, wise',o:'Arabic',g:'boy',r:['hindu','muslim']},{n:'Ayaan',m:'Gift of God',o:'Arabic',g:'boy',r:['muslim']},{n:'Zayan',m:'Beauty',o:'Arabic',g:'boy',r:['muslim','modern']},{n:'Rayan',m:'Gates of heaven',o:'Arabic',g:'boy',r:['muslim']},{n:'Ibrahim',m:'Father of many',o:'Arabic',g:'boy',r:['muslim']},{n:'Yusuf',m:'God increases',o:'Arabic',g:'boy',r:['muslim']},{n:'Zaid',m:'Growth',o:'Arabic',g:'boy',r:['muslim']},{n:'Gurpreet',m:'Beloved of Guru',o:'Punjabi',g:'boy',r:['sikh']},{n:'Harjot',m:"God's light",o:'Punjabi',g:'boy',r:['sikh']},{n:'Veer',m:'Brave hero',o:'Sanskrit',g:'boy',r:['sikh','hindu']},
  {n:'Anaya',m:'Free, gift',o:'Sanskrit',g:'girl',r:['hindu','modern']},{n:'Aarohi',m:'Rising',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Ahana',m:'Inner light',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Diya',m:'Lamp, light',o:'Sanskrit',g:'girl',r:['hindu','modern']},{n:'Navya',m:'Young, new',o:'Sanskrit',g:'girl',r:['hindu','modern']},{n:'Avni',m:'Earth',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Kavya',m:'Poetry',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Siya',m:'Pure, Sita',o:'Sanskrit',g:'girl',r:['hindu']},{n:'Zara',m:'Princess, dawn',o:'Arabic',g:'girl',r:['muslim','modern']},{n:'Inaya',m:'Care of God',o:'Arabic',g:'girl',r:['muslim']},{n:'Aisha',m:'Alive',o:'Arabic',g:'girl',r:['muslim']},{n:'Pari',m:'Angel',o:'Persian',g:'girl',r:['muslim','modern']},{n:'Noor',m:'Divine light',o:'Arabic',g:'girl',r:['muslim','modern']},{n:'Fatima',m:'Captivating',o:'Arabic',g:'girl',r:['muslim']},{n:'Simran',m:"God's remembrance",o:'Punjabi',g:'girl',r:['sikh']},{n:'Harleen',m:'Absorbed in God',o:'Punjabi',g:'girl',r:['sikh']},{n:'Manpreet',m:'Heart fulfilled',o:'Punjabi',g:'girl',r:['sikh']},
  {n:'Arya',m:'Noble',o:'Sanskrit',g:'unisex',r:['modern','hindu']},{n:'Kiran',m:'Ray of light',o:'Sanskrit',g:'unisex',r:['hindu','sikh']},{n:'Reva',m:'Star',o:'Sanskrit',g:'unisex',r:['hindu','modern']},{n:'Myra',m:'Sweet',o:'Modern',g:'girl',r:['modern']},{n:'Kiara',m:'Bright, clear',o:'Modern',g:'girl',r:['modern']},{n:'Rumi',m:'Beauty, poet',o:'Persian',g:'unisex',r:['modern']},
];
const NAME_FILTERS=[{k:'all',l:'All'},{k:'boy',l:'👦 Boy'},{k:'girl',l:'👧 Girl'},{k:'unisex',l:'🌟 Unisex'},{k:'hindu',l:'🕉️ Hindu'},{k:'muslim',l:'☪️ Muslim'},{k:'sikh',l:'🪯 Sikh'},{k:'modern',l:'✨ Modern'}];

async function loadNames(){
  if(!user)return;
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
  g.innerHTML=filtered.map(n=>{const sv=savedNames.includes(n.n);return`<div onclick="MC.toggleSaveName('${n.n}')" style="background:white;border-radius:16px;padding:14px;border:1.5px solid ${sv?'var(--accent)':'rgba(232,160,168,.15)'};cursor:pointer;transition:.2s;position:relative" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'"><div style="position:absolute;top:10px;right:10px;font-size:17px">${sv?'💗':'🤍'}</div><div style="font-family:'Cormorant Garamond',serif;font-size:1.25rem;color:var(--warm);margin-bottom:2px">${n.n}</div><div style="font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:5px">${n.m}</div><span class="pill ${n.g==='boy'?'pill-b':n.g==='girl'?'pill-p':'pill-o'}">${n.g}</span><span class="pill pill-g">${n.o}</span></div>`;}).join('')||'<p style="color:var(--muted);font-size:13px;padding:12px;grid-column:1/-1">Koi naam nahi mila.</p>';
}

async function toggleSaveName(name){
  if(!user)return;
  if(savedNames.includes(name)){await supa.from('saved_names').delete().eq('user_id',user.id).eq('baby_name',name);savedNames=savedNames.filter(n=>n!==name);}
  else{await supa.from('saved_names').insert({user_id:user.id,baby_name:name});savedNames.push(name);}
  flash('names-save',T.synced);renderNames();renderSavedNames();
}

function renderSavedNames(){
  const card=$('savedNamesCard'),list=$('savedNamesList');if(!card||!list)return;
  card.style.display=savedNames.length?'block':'none';
  list.innerHTML=savedNames.map(n=>`<div style="display:inline-flex;align-items:center;gap:5px;padding:6px 13px;background:white;border-radius:50px;border:1.5px solid var(--blush);font-size:13px;font-weight:500">💗 ${n}<button onclick="MC.toggleSaveName('${n}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px;line-height:1;margin-left:2px">×</button></div>`).join('');
}

// ══════════════════════════════════════
// JOURNAL — Supabase (photo → gallery)
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
  if(!user)return;
  await supa.from('journal_entries').insert({user_id:user.id,week_number:week||null,entry_date:date||todayStr(),mood:jMood,content_text:text||null});
  // Photo → download to gallery (no cloud storage)
  if(photoFile){const url=URL.createObjectURL(photoFile);const a=document.createElement('a');a.href=url;a.download=`mamacare-w${week||'bump'}-${date||todayStr()}.jpg`;a.click();URL.revokeObjectURL(url);photoFile=null;const p=$('photoPreview');if(p){p.style.display='none';p.src='';};$('photoUpload').value='';}
  $('jText').value='';$('jWeek').value='';
  flash('journal-save',T.synced);loadJournal();
}

async function loadJournal(){
  if(!user)return;
  const {data}=await supa.from('journal_entries').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
  journalList=data||[];renderJournal();
}

async function deleteJournalEntry(id){if(!confirm('Delete karein?'))return;await supa.from('journal_entries').delete().eq('id',id);journalList=journalList.filter(e=>e.id!==id);renderJournal();}

function renderJournal(){
  const el=$('journalEntries');if(!el)return;
  if(!journalList.length){el.innerHTML='<p style="text-align:center;color:var(--muted);font-size:13.5px;padding:22px">Koi entry nahi. Upar se pehli yaad likho! 🌸</p>';return;}
  el.innerHTML=journalList.map(e=>`<div style="background:white;border-radius:18px;padding:16px;margin-bottom:11px;border:1.5px solid rgba(232,160,168,.15)"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:${e.content_text?'10px':'0'}"><div style="display:flex;align-items:center;gap:8px"><span style="font-size:22px">${e.mood||'😊'}</span><span style="font-size:12px;color:var(--muted)">${fmtDate(e.entry_date)}</span></div><div style="display:flex;align-items:center;gap:8px">${e.week_number?`<span style="font-size:11px;background:var(--blush);color:var(--accent);padding:3px 10px;border-radius:50px;font-weight:500">W${e.week_number}</span>`:''}<button onclick="MC.deleteJournalEntry('${e.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px">🗑️</button></div></div>${e.content_text?`<p style="font-size:13.5px;line-height:1.75;color:var(--warm)">${e.content_text.replace(/\n/g,'<br>')}</p>`:''}</div>`).join('');
}

// ══════════════════════════════════════
// APPOINTMENTS — Supabase
// ══════════════════════════════════════
async function loadAppointments(){
  if(!user)return;
  const {data}=await supa.from('appointments').select('*').eq('user_id',user.id).order('appt_date');
  apptList=data||[];renderAppointments();
}

async function addAppointment(){
  const title=$('apptTitle')?.value.trim(),date=$('apptDate')?.value;
  if(!title||!date){alert('Title aur date zaroori hai');return;}
  if(!user)return;
  await supa.from('appointments').insert({user_id:user.id,title,doctor_name:$('apptDoctor')?.value,hospital:$('apptHospital')?.value,appt_date:date,appt_time:$('apptTime')?.value||null,notes:$('apptNotes')?.value,is_completed:false});
  ['apptTitle','apptDoctor','apptHospital','apptNotes'].forEach(id=>{const e=$(id);if(e)e.value='';});
  flash('appt-save',T.synced);loadAppointments();
}

async function toggleApptDone(id){
  const appt=apptList.find(a=>a.id===id);if(!appt)return;
  appt.is_completed=!appt.is_completed;
  await supa.from('appointments').update({is_completed:appt.is_completed}).eq('id',id);
  renderAppointments();
}

async function deleteAppt(id){if(!confirm('Delete karein?'))return;await supa.from('appointments').delete().eq('id',id);apptList=apptList.filter(a=>a.id!==id);renderAppointments();}

function renderAppointments(){
  const el=$('apptList');if(!el)return;
  const upcoming=apptList.filter(a=>!a.is_completed);const done=apptList.filter(a=>a.is_completed);
  if(!apptList.length){el.innerHTML='<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px">Koi appointment nahi. Upar se add karein!</p>';return;}
  el.innerHTML=[...upcoming,...done].map(a=>{const d=new Date(a.appt_date);return`<div class="appt-item" style="opacity:${a.is_completed?'.6':'1'}"><div class="appt-date-box"><div class="appt-day">${d.getDate()}</div><div class="appt-mon">${d.toLocaleDateString('en-IN',{month:'short'})}</div></div><div class="appt-info"><div class="appt-title" style="${a.is_completed?'text-decoration:line-through':''}">${a.title}</div><div class="appt-sub">${[a.doctor_name,a.hospital,a.appt_time].filter(Boolean).join(' • ')}</div>${a.notes?`<div style="font-size:12px;color:var(--muted);margin-top:3px">${a.notes}</div>`:''}</div><div style="display:flex;gap:5px;align-items:center;flex-shrink:0"><button onclick="MC.toggleApptDone('${a.id}')" style="padding:5px 11px;border-radius:50px;font-size:11.5px;cursor:pointer;border:1.5px solid ${a.is_completed?'var(--green)':'var(--blush)'};background:${a.is_completed?'var(--green)':'white'};color:${a.is_completed?'white':'var(--muted)'};font-family:'DM Sans',sans-serif">${a.is_completed?'✓':'Done?'}</button><button onclick="MC.deleteAppt('${a.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px">×</button></div></div>`;}).join('');
}

function initAppointmentChecklist(){
  const el=$('apptChecklist');if(!el)return;
  const TESTS=[
    {w:'8-12',  t:'Dating scan + NT scan',       d:'Baby size confirm, chromosomal screen'},
    {w:'16-20', t:'Anatomy scan (Level 2)',       d:'All major organs, gender'},
    {w:'24-28', t:'Glucose tolerance test',       d:'Gestational diabetes screen'},
    {w:'28+',   t:'Blood tests — Hb, iron',       d:'Anaemia check'},
    {w:'32-36', t:'Group B Strep test',           d:'Antibiotic if needed during labor'},
    {w:'36+',   t:'Weekly NST',                   d:'Non-stress test if high risk'},
    {w:'40+',   t:'Post-dates monitoring',        d:'Induction discussion if needed'},
  ];
  el.innerHTML=TESTS.map(function(t){return'<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid rgba(232,160,168,.12);align-items:flex-start"><span style="font-size:11px;background:var(--blush);color:var(--accent);padding:3px 8px;border-radius:50px;font-weight:600;white-space:nowrap;flex-shrink:0">W'+t.w+'</span><div><div style="font-weight:600;font-size:13px">'+t.t+'</div><div style="font-size:12px;color:var(--muted);margin-top:2px">'+t.d+'</div></div></div>';}).join('');
}

// ══════════════════════════════════════
// BIRTH PLAN — Supabase
// ══════════════════════════════════════
const BP_SECTIONS=[
  {id:'personal',title:'👩 Patient Info',fields:[{id:'bp_name',l:'Naam',ph:'Full name'},{id:'bp_doc',l:'Doctor',ph:'Dr. ...'},{id:'bp_hosp',l:'Hospital',ph:'Hospital naam'},{id:'bp_due2',l:'Due Date',t:'date'},{id:'bp_blood',l:'Blood Group',ph:'e.g. B+'},{id:'bp_allergy',l:'Allergies',ph:'Medicines, food...'}]},
  {id:'env',title:'🏥 Labor Environment',opts:[{id:'bp_env',q:'Preference:',opts:['Dim lighting','Music (my playlist)','Quiet room','Partner always present','Limit visitors']}]},
  {id:'pain',title:'💊 Pain Management',opts:[{id:'bp_pain',q:'Pain relief:',opts:['Natural — no medication','Epidural','Gas & air','TENS machine','Open to all options']},{id:'bp_move',q:'Movement:',opts:['Walk during labor','Birth ball','Hydrotherapy/shower','Bed preferred']}]},
  {id:'delivery',title:'👶 Delivery',opts:[{id:'bp_push',q:'Pushing position:',opts:['Traditional (back)','Squatting','Side-lying','Hands and knees','Doctor decides']},{id:'bp_cord',q:'Cord cutting:',opts:['Partner cuts cord','Delayed clamping (60s+)','Doctor decides']}]},
  {id:'newborn',title:'🌸 After Birth',opts:[{id:'bp_skin',q:'Immediately:',opts:['Skin-to-skin right away','Delayed vernix removal','Delayed bathing (24hrs)']},{id:'bp_feed',q:'Feeding:',opts:['Exclusive breastfeeding','Combination','Formula','Lactation consultant']}]},
  {id:'notes',title:'📝 Special Notes',textarea:{id:'bp_notes2',l:'Special requests, cultural considerations:',ph:'Hindi mein communication prefer karein...'}}
];

function initBirthPlan(){
  const form=$('birthPlanForm');if(!form)return;
  form.innerHTML=BP_SECTIONS.map(sec=>`<div class="bp-sec"><h4>${sec.title}</h4>${sec.fields?`<div class="g2">${sec.fields.map(f=>`<div><label>${f.l}</label><input type="${f.t||'text'}" id="${f.id}" placeholder="${f.ph||''}" onchange="MC.saveBirthPlan()"/></div>`).join('')}</div>`:''} ${sec.opts?sec.opts.map(opt=>`<div style="margin-bottom:12px"><label style="margin-bottom:7px;display:block">${opt.q}</label><div class="bp-opts" id="${opt.id}">${opt.opts.map(o=>`<button class="bp-opt" onclick="this.classList.toggle('sel');MC.saveBirthPlan()">${o}</button>`).join('')}</div></div>`).join(''):''} ${sec.textarea?`<div><label>${sec.textarea.l}</label><textarea id="${sec.textarea.id}" placeholder="${sec.textarea.ph}" oninput="MC.saveBirthPlan()"></textarea></div>`:''}</div>`).join('');
  loadBirthPlan();
}

async function loadBirthPlan(){
  if(!user)return;
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
  if(!user)return;
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
  1:{title:'Week 1–2: Acute Recovery',secs:[{i:'🩹',t:'Physical Recovery',items:['Vaginal birth: perineal soreness, swelling. Ice packs 24hrs, warm sitz bath after.','C-section: incision care — dry, no lifting >4kg. 6-8 weeks healing.','Lochia (bleeding): bright red → pink → yellow-white. 4-6 weeks total.','Afterpains (cramping): especially during breastfeeding — uterus contracting back.','Constipation common: high fiber, water, stool softeners if needed.']},{i:'🤱',t:'Breastfeeding Start',items:['First milk = colostrum — thick, yellowish, GOLD. Baby ko sirf yahi chahiye.','Milk comes in day 3-5 — engorgement, tenderness normal.','Latch pain initially OK, but sharp pain each feed → lactation consultant.','Feed on demand: 8-12 times/24hrs newborn mein.']},{i:'😴',t:'Sleep & Rest',items:['"Sleep when baby sleeps" — practical aur necessary hai.','Night sweats common — hormonal, normal.','Visitors limit karein — rest priority hai.','Sleep deprivation peak — maximum impact first 2 weeks.']}]},
  2:{title:'Week 3–6: Gradual Recovery',secs:[{i:'💪',t:'Physical Changes',items:['Bleeding usually stops/very light by week 3-4.','Energy slowly improving — fatigue still significant.','Hair loss (telogen effluvium) week 3+ — normal, peaks at 3-4 months.','C-section scar itching as healing — normal. Massage from week 6.']},{i:'🧠',t:'Emotional Adjustment',items:['Baby blues (day 3-14) vs Postpartum Depression — important distinction.','Identity shift (matrescence) — "kaun hun main ab?" normal hai.','Partner relationship changes — communication essential.','Guilt about not "loving it all" — completely valid.']},{i:'🤸',t:'Gentle Exercise',items:['Week 4-6: Kegel exercises resume.','Week 6 clearance: walking, light stretching.','No running/high-impact for 12 weeks minimum.','Diastasis recti check at 6-week appointment.']}]},
  3:{title:'Week 6–12: Finding Routine',secs:[{i:'✅',t:'6-Week Checkup — ESSENTIAL',items:['Physical exam: uterus, incision/perineum.','Mental health screen (Edinburgh Scale).','Contraception discussion — fertility returns before first period.','BP check — postpartum preeclampsia possible up to 6 weeks.','Discuss everything — no question too small.']},{i:'🏃',t:'Exercise Returns',items:['Doctor clearance then gradually increase.','Pelvic floor physio BEFORE running — highly recommended.','Swimming: 6 weeks if healed.','Core slowly — diastasis recti healing important.']},{i:'🌸',t:'Self-Care',items:['Daily shower — even 5 min alone significant for mental health.','Continue prenatal vitamins if breastfeeding.','One adult conversation/day matters — social connection.','House can wait — presence matters more.']}]},
  4:{title:'3–6 Months: New Normal',secs:[{i:'👶',t:'Baby Development',items:['3 months: smiles, head control, recognizing faces.','4 months: laughing, reaching — solid food prep begins.','6 months: solids typically started (WHO recommendation).','4-month sleep regression — normal, temporary.']},{i:'💼',t:'Work Return',items:['Childcare, pumping schedule if breastfeeding.','Separation anxiety — both maa aur baby ke liye normal.','Gradual return if possible — first week shorter.']},{i:'❤️',t:'Identity & Relationship',items:['Partner intimacy: communication essential.','Mom guilt: universal, not useful. You are doing enough.','Community: other parents best support.','Identity integration takes 12-18 months — normal.']}]},
};

function initPostpartum(){
  document.querySelectorAll('#ppWeekTabs .tab-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#ppWeekTabs .tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderPPWeek(parseInt(b.dataset.ppw));}));
  renderPPWeek(1);
  $('ppWarnings').innerHTML=['Heavy bleeding after 24hrs (soaking pad/hr)','Fever >38°C — infection sign','Wound redness, pus, or opening','Leg pain/swelling — DVT blood clot','Severe headache + vision changes (postpartum preeclampsia)','Difficulty breathing, chest pain','Thoughts of harming yourself or baby — IMMEDIATE help','Inability to urinate'].map(w=>`<p style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(232,160,168,.1);font-size:13px"><span>🔴</span><span>${w}</span></p>`).join('');
  $('ppMentalHealth').innerHTML=`<div class="g2"><div style="background:#e8f5e9;border-radius:14px;padding:14px"><div style="font-weight:600;font-size:13px;color:#2e7d32;margin-bottom:7px">😊 Baby Blues (Normal)</div><div style="font-size:12.5px;line-height:1.7">Day 2-14. Crying, mood swings, overwhelm. 70-80% women. Hormonal shift — estrogen/progesterone drop. <strong>Passes on its own with rest + support.</strong></div></div><div style="background:#ffebee;border-radius:14px;padding:14px"><div style="font-weight:600;font-size:13px;color:#c62828;margin-bottom:7px">😔 Postpartum Depression</div><div style="font-size:12.5px;line-height:1.7">2+ weeks persistent. Hopelessness, inability to function. 10-15% women. NOT weakness — medical condition. <strong>Treatment safe, effective. Please seek help.</strong></div></div></div><div style="background:rgba(232,160,168,.08);border-radius:10px;padding:11px 13px;margin-top:12px;font-size:13px;color:var(--muted)">📞 iCall: 9152987821 | Vandrevala: 1860-2662-345 (24/7)</div>`;
  $('ppBreastfeeding').innerHTML=[['🤱 Correct Latch','Poora areola andar hona chahiye — sirf nipple nahi. Chin breast pe touch kare, nose clear.'],['⏱️ Frequency','8-12 times/day. On-demand — cues dekho, clock nahi.'],['📈 Supply','Supply = demand. Frequent feeding = more milk. Stress supply reduce karta hai.'],['😣 Problems','Cracked nipples: lanolin cream + breastmilk apply. Mastitis: fever + hard lump + redness = immediate doctor.'],['🍼 Formula OK','Fed is best. No guilt for any feeding choice. Formula-fed babies thrive equally.']].map(([t,b])=>`<div style="background:white;border-radius:13px;padding:13px;margin-bottom:8px"><div style="font-weight:600;font-size:13.5px;margin-bottom:5px">${t}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${b}</div></div>`).join('');
}

function renderPPWeek(w){
  const data=PP[w];const el=$('ppWeekContent');if(!el||!data)return;
  el.innerHTML=`<div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--warm);margin-bottom:14px">${data.title}</div>`+
    data.secs.map(s=>`<div style="background:white;border-radius:14px;padding:15px;margin-bottom:11px"><div style="font-weight:600;font-size:13.5px;margin-bottom:9px">${s.i} ${s.t}</div>${s.items.map(item=>`<p style="font-size:13px;color:var(--muted);line-height:1.7;padding:5px 0;border-bottom:1px solid rgba(232,160,168,.08)">• ${item}</p>`).join('')}</div>`).join('');
}

// ══════════════════════════════════════
// SYMPTOM CHECKER
// ══════════════════════════════════════
const SYMPTOMS=[
  {name:'Morning Sickness / Nausea',cat:'common',tri:'1',urg:'normal',icon:'🤢',desc:'80% women ko hoti hai. HCG hormone responsible.',causes:['HCG rapid increase','Estrogen surge','Smell sensitivity','Slow gastric emptying'],relief:['Ginger therapy (1g daily — 40% reduction)','Small meals every 2 hrs','Vit B6 10-25mg 3x daily','Acupressure P6 wrist point','Cold foods better tolerated'],warn:'Hyperemesis: 3+ vomits/day, weight loss, unable to keep fluids → IMMEDIATE doctor'},
  {name:'Extreme Fatigue',cat:'common',tri:'1,3',urg:'normal',icon:'😴',desc:'Progesterone sedative effect + blood volume 50% increase.',causes:['Progesterone surge','Blood volume increase','Iron deficiency','Poor sleep'],relief:['20-min power nap (not longer)','Iron + Hb check','Hydration 2.5-3L daily','Reduce unnecessary commitments'],warn:'Extreme fatigue + breathlessness + pallor → Anaemia check karwao'},
  {name:'Back Pain',cat:'common',tri:'2,3',urg:'normal',icon:'🤸',desc:'Relaxin hormone + shifting gravity + uterus weight.',causes:['Relaxin loosening ligaments','Posture changes','Sciatica','Muscle weakness'],relief:['Prenatal yoga — cat-cow','Pregnancy pillow between knees','Warm compress (not hot)','Supportive footwear only'],warn:'Severe sudden pain + bleeding → immediate care (placental abruption possible)'},
  {name:'Swelling (Oedema)',cat:'common',tri:'3',urg:'watch',icon:'🦵',desc:'Ankles, feet, hands mein mild swelling — normal fluid retention.',causes:['Blood volume increase','Pelvic vein pressure','Sodium retention','Heat'],relief:['Legs elevated (Viparita Karani)','Compression socks','Left side sleeping','Reduce sodium','Swimming'],warn:'Sudden severe face/hand swelling + headache + vision → PREECLAMPSIA EMERGENCY'},
  {name:'Heartburn / Acidity',cat:'common',tri:'2,3',urg:'normal',icon:'🔥',desc:'Progesterone relaxes lower esophageal sphincter + uterus pressure.',causes:['LES relaxation','Stomach compressed','Reduced motility'],relief:['Small frequent meals','Avoid triggers: spicy, coffee, citrus','No lying down 2-3hrs after eating','Elevate bed head','Cold milk, coconut water'],warn:'Severe pain, difficulty swallowing → doctor'},
  {name:'Leg Cramps',cat:'common',tri:'2,3',urg:'normal',icon:'💢',desc:'50% pregnant women. Usually at night.',causes:['Calcium/magnesium deficiency','Dehydration','Nerve pressure','Circulation'],relief:['Magnesium 300mg nightly','Calf stretches before bed','3L hydration daily','When cramp: toes up + massage'],warn:'Persistent calf pain + swelling + redness → DVT rule out'},
  {name:'Braxton Hicks',cat:'common',tri:'3',urg:'normal',icon:'🫂',desc:'Practice contractions. Week 28+ common.',causes:['Uterus practice','Dehydration trigger','Physical activity','Full bladder'],relief:['Change position','Drink water','Warm bath (not hot)','Rest + breathe'],warn:'Before W37: regular painful contractions → preterm labor. Any time: 5 min apart for 1 hr → hospital'},
  {name:'Gestational Diabetes',cat:'serious',tri:'2,3',urg:'serious',icon:'🩸',desc:'7-8% pregnancies. Placental hormones block insulin.',causes:['Placental hormones','Pre-existing resistance','Risk: overweight, family history'],relief:['Low glycemic diet','30 min walking daily','Blood sugar monitoring','Insulin if needed'],warn:'Uncontrolled GDM → large baby, difficult delivery, baby hypoglycemia. Follow treatment plan.'},
  {name:'Preeclampsia Signs',cat:'serious',tri:'3',urg:'emergency',icon:'🚨',desc:'High BP + protein in urine. 5-8% pregnancies.',causes:['Abnormal placentation','Immune factors','Risk: first pregnancy, twins, existing hypertension'],relief:['Low-dose aspirin 81mg if high risk (doctor prescribed)','Regular BP monitoring','Regular prenatal care'],warn:'🚨 BP >140/90 + severe headache + vision changes + severe swelling + upper right pain → IMMEDIATE HOSPITAL'},
  {name:'Stretch Marks',cat:'cosmetic',tri:'2,3',urg:'normal',icon:'〰️',desc:'50-90% women. Genetic predisposition.',causes:['Rapid skin stretching','Genetic factor','Decreased elasticity'],relief:['Coconut oil / shea butter daily','Vitamin E oil','Stay hydrated','Accept them — tiger stripes 🐯'],warn:'No medical concern — cosmetic only'},
  {name:'Shortness of Breath',cat:'common',tri:'3',urg:'watch',icon:'😮‍💨',desc:'Uterus pushing diaphragm + progesterone increases breathing.',causes:['Uterus pressing diaphragm','Progesterone effect','Anaemia'],relief:['Slow down','Good upright posture','Propped pillows for sleep','Baby drops W36 — relief'],warn:'Sudden severe breathlessness + chest pain + rapid heart rate → EMERGENCY (PE possible)'},
  {name:'Frequent Urination',cat:'common',tri:'1,3',urg:'normal',icon:'🚽',desc:'Kidney blood flow 50% increase + bladder pressure.',causes:['Increased renal flow','HCG effect','Bladder pressure'],relief:['Normal — accept it','Avoid caffeine','Reduce fluids after 6pm','Kegel exercises help control'],warn:'Burning/pain + blood in urine + fever → UTI — treat immediately (dangerous in pregnancy)'},
];

const SYMP_CATS=[{k:'all',l:'All'},{k:'common',l:'✅ Common'},{k:'watch',l:'👀 Watch'},{k:'serious',l:'⚠️ Serious'},{k:'emergency',l:'🚨 Emergency'},{k:'cosmetic',l:'💄 Cosmetic'}];

function initSymptoms(){
  const el=$('symptomCatBtns');if(!el)return;
  el.innerHTML=SYMP_CATS.map(c=>`<button class="tab-btn${c.k==='all'?' active':''}" data-sc="${c.k}">${c.l}</button>`).join('');
  el.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{el.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');sympFilterKey=b.dataset.sc;filterSymptoms();}));
  filterSymptoms();
}

function filterSymptoms(){
  const q=($('symptomSearch')?.value||'').toLowerCase();
  const filtered=SYMPTOMS.filter(s=>{const mq=!q||s.name.toLowerCase().includes(q)||s.desc.toLowerCase().includes(q);const mf=sympFilterKey==='all'||s.cat===sympFilterKey||s.urg===sympFilterKey;return mq&&mf;});
  const uc={normal:{bg:'rgba(106,184,154,.08)',border:'var(--green)',lbl:'✅ Normal'},watch:{bg:'rgba(212,168,83,.08)',border:'var(--gold)',lbl:'👀 Monitor'},serious:{bg:'rgba(220,120,80,.08)',border:'#e07040',lbl:'⚠️ Serious'},emergency:{bg:'rgba(220,80,80,.1)',border:'#e05c5c',lbl:'🚨 Emergency'}};
  const cont=$('symptomsContainer');if(!cont)return;
  cont.innerHTML=filtered.map(s=>{const u=uc[s.urg]||uc.normal;return`<div class="card" style="border-left:3px solid ${u.border}"><div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px"><span style="font-size:32px">${s.icon}</span><div><div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--warm)">${s.name}</div><div style="display:flex;gap:5px;margin-top:3px"><span style="font-size:11px;padding:2px 9px;border-radius:50px;background:${u.bg};color:${u.border};font-weight:600">${u.lbl}</span><span class="pill pill-b" style="font-size:10px">T${s.tri}</span></div></div></div><p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:12px">${s.desc}</p><div class="g2" style="margin-bottom:10px"><div style="background:var(--cream);border-radius:12px;padding:11px"><div style="font-size:10.5px;font-weight:600;color:var(--accent);text-transform:uppercase;margin-bottom:5px">Kyon hota hai</div>${s.causes.map(c=>`<p style="font-size:12px;color:var(--muted);line-height:1.6;padding:2px 0">• ${c}</p>`).join('')}</div><div style="background:rgba(106,184,154,.06);border-radius:12px;padding:11px"><div style="font-size:10.5px;font-weight:600;color:var(--green);text-transform:uppercase;margin-bottom:5px">Relief</div>${s.relief.map(r=>`<p style="font-size:12px;color:var(--muted);line-height:1.6;padding:2px 0">• ${r}</p>`).join('')}</div></div><div style="background:${u.bg};border-radius:10px;padding:10px 12px;font-size:12.5px;color:var(--warm);line-height:1.6"><strong style="color:${u.border}">⚠️ Warning:</strong> ${s.warn}</div></div>`;}).join('')||'<div class="card"><p style="color:var(--muted);font-size:13px;text-align:center;padding:14px">Koi symptom nahi mila.</p></div>';
}

// ══════════════════════════════════════
// SOS / EMERGENCY
// ══════════════════════════════════════
const EC_NUMBERS=[{n:'🚑 Ambulance',d:'National Emergency — Free',num:'108'},{n:'👮 Police',d:'All India',num:'100'},{n:'🏥 iCall Mental Health',d:'9152987821 | Mon-Sat',num:'9152987821'},{n:'👩 Women Helpline',d:'National',num:'1091'},{n:'🍼 Childline',d:'Child Emergency',num:'1098'}];
let myContacts=[];

function initSOS(){
  $('sosFastDial').innerHTML=EC_NUMBERS.map(n=>`<div class="sos-contact"><div><div class="sname">${n.n}</div><div class="snum">${n.d}</div></div><a href="tel:${n.num}" style="padding:8px 16px;border-radius:50px;background:linear-gradient(135deg,var(--green),#4da888);color:white;text-decoration:none;font-size:12.5px;font-weight:600">${n.num}</a></div>`).join('');
  $('warningSigns').innerHTML=['Bahut zyada vaginal bleeding (soaking pad in 1 hr)','Severe abdominal pain jo kam nahi ho raha','Baby movements suddenly stop ya dramatically kam','Severe headache + vision changes + swelling — preeclampsia','Sudden severe swelling face/hands','High fever (38°C+) with chills','Water break (amniotic fluid) — any amount','Regular contractions before 37 weeks','Chest pain ya difficulty breathing','Seizure ya loss of consciousness'].map(w=>`<p style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(220,80,80,.08);font-size:13px"><span>🔴</span><span>${w}</span></p>`).join('');
  // Load emergency contacts
  if(user) supa.from('user_profile').select('*').eq('id',user.id).maybeSingle().then(({data})=>{if(data?.emergency_contacts)myContacts=data.emergency_contacts||[];renderContacts();});
}

function findHospital(){
  const r=$('sosResult');r.innerHTML='<p style="color:var(--muted);font-size:13px;text-align:center;padding:14px">📍 Location detect kar rahi hun...</p>';
  if(!navigator.geolocation){r.innerHTML=`<div style="display:flex;flex-direction:column;gap:9px"><a href="https://www.google.com/maps/search/maternity+hospital+near+me" target="_blank" style="display:block;padding:13px 20px;background:linear-gradient(135deg,#e05c5c,#c94040);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px">🏥 Search Nearest Hospital →</a><a href="tel:108" style="display:block;padding:13px 20px;background:linear-gradient(135deg,var(--green),#4da888);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px">🚑 Ambulance — 108</a></div>`;return;}
  navigator.geolocation.getCurrentPosition(pos=>{
    const{latitude:la,longitude:lo}=pos.coords;
    r.innerHTML=`<div style="display:flex;flex-direction:column;gap:9px"><a href="https://www.google.com/maps/search/maternity+hospital/@${la},${lo},14z" target="_blank" style="display:block;padding:13px 20px;background:linear-gradient(135deg,#e05c5c,#c94040);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px">🏥 Nearest Maternity Hospital →</a><a href="https://www.google.com/maps/search/government+hospital/@${la},${lo},13z" target="_blank" style="display:block;padding:13px 20px;background:linear-gradient(135deg,var(--blue),#4a98c4);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px">🏛️ Government Hospital →</a><a href="tel:108" style="display:block;padding:13px 20px;background:linear-gradient(135deg,var(--green),#4da888);color:white;border-radius:14px;text-decoration:none;font-weight:600;font-size:14px">🚑 Ambulance — 108</a></div>`;
  },()=>{r.innerHTML=`<a href="https://www.google.com/maps/search/hospital+near+me" target="_blank" style="display:block;padding:13px 20px;background:linear-gradient(135deg,#e05c5c,#c94040);color:white;border-radius:14px;text-decoration:none;font-weight:600">🏥 Search Hospital →</a>`;});
}

async function addEC(){
  const n=$('ecName')?.value.trim(),p=$('ecPhone')?.value.trim(),rel=$('ecRelation')?.value;
  if(!n||!p){alert('Naam aur phone zaroori');return;}
  myContacts.push({name:n,phone:p,relation:rel});
  if(user)await supa.from('user_profile').update({emergency_contacts:myContacts}).eq('id',user.id);
  $('ecName').value='';$('ecPhone').value='';
  flash('sos-save',T.synced);renderContacts();
}

async function delEC(i){myContacts.splice(i,1);if(user)await supa.from('user_profile').update({emergency_contacts:myContacts}).eq('id',user.id);renderContacts();}

function renderContacts(){
  const el=$('customContacts');if(!el)return;
  el.innerHTML=myContacts.length?myContacts.map((c,i)=>`<div class="sos-contact"><div><div class="sname">👤 ${c.name} <span style="font-size:11px;color:var(--muted)">(${c.relation})</span></div><div class="snum">${c.phone}</div></div><div style="display:flex;gap:6px;align-items:center"><a href="tel:${c.phone}" style="padding:7px 14px;border-radius:50px;background:linear-gradient(135deg,var(--green),#4da888);color:white;text-decoration:none;font-size:12px;font-weight:600">Call</a><button onclick="MC.delEC(${i})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:20px">×</button></div></div>`).join(''):'<p style="font-size:12.5px;color:var(--muted);text-align:center;padding:8px">Koi personal contact nahi.</p>';
}

// ══════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════
const MILESTONES=[{w:4,t:'Test positive! Journey shuru 🌱'},{w:8,t:'Pehla heartbeat scan 💗'},{w:12,t:'1st trimester complete ✓'},{w:16,t:'Gender scan possible 👶'},{w:20,t:'Anatomy scan — halfway 🎉'},{w:24,t:'Viability milestone ⭐'},{w:28,t:'3rd trimester shuru 🌟'},{w:32,t:'Hospital bag pack karo 🏥'},{w:36,t:'Full term approaching 🌸'},{w:40,t:'Due date! 🎊'}];

async function renderDashboard(){
  if(!user)return;
  const dueStr=$('directDue')?.value;const due=dueStr?new Date(dueStr):null;
  const now=new Date();let week=0,daysLeft=0,pct=0,tri=0;
  if(due&&!isNaN(due)){const el=Math.max(0,Math.floor((now-new Date(due.getTime()-280*86400000))/86400000));week=Math.min(40,Math.floor(el/7)+1);daysLeft=Math.max(0,Math.round((due-now)/86400000));pct=Math.min(100,Math.round(el/280*100));tri=week<=13?1:week<=27?2:3;}
  const hero=$('dbHero');
  if(hero){const tn=[T.t1,T.t2,T.t3][tri-1]||'';hero.innerHTML=due?`<div style="font-size:44px;margin-bottom:10px">${tri===1?'🌱':tri===2?'🌸':'🌟'}</div><div style="font-family:'Cormorant Garamond',serif;font-size:1.7rem;margin-bottom:7px">${T.wk} ${week} — ${tn} ${T.tri}</div><p style="font-size:13px;color:var(--muted)">${fmtDate(dueStr)} | ${daysLeft} ${T.days}</p><div style="background:rgba(255,255,255,.3);border-radius:50px;height:8px;overflow:hidden;margin-top:14px;max-width:300px;margin-inline:auto"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--rose),var(--gold));border-radius:50px;transition:width 1s"></div></div><div style="font-size:11px;color:var(--muted);margin-top:4px">${pct}% ${T.done}</div>`:`<div style="font-size:44px;margin-bottom:8px">🌸</div><div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem">MamaCare mein Aapka Swagat! 💗</div><p style="font-size:13px;color:var(--muted);margin-top:6px"><a href="#" onclick="MC.goTo('due')" style="color:var(--accent)">📅 Due date add karein →</a></p>`;}

  // Stats
  const [slRes,wtRes,medRes]=await Promise.all([supa.from('sleep_logs').select('duration_hrs').eq('user_id',user.id).order('logged_at',{ascending:false}).limit(1),supa.from('weight_logs').select('weight_kg').eq('user_id',user.id).order('logged_at',{ascending:false}).limit(1),supa.from('medicines').select('id').eq('user_id',user.id).eq('is_active',true)]);
  const slHrs=slRes.data?.[0]?.duration_hrs||'—',wtKg=wtRes.data?.[0]?.weight_kg||'—',medTotal=medRes.data?.length||0;
  const {data:takenToday}=await supa.from('medicine_logs').select('id').eq('user_id',user.id).eq('taken_date',todayStr());
  const {data:waterToday}=await supa.from('water_logs').select('glasses_count').eq('user_id',user.id).eq('log_date',todayStr()).maybeSingle();
  const wc=waterToday?.glasses_count||0,mt=takenToday?.length||0;
  $('dbStats').innerHTML=`<div class="stat"><div class="stat-v">${slHrs}h</div><div class="stat-l">Last Sleep</div></div><div class="stat"><div class="stat-v">${wtKg}</div><div class="stat-l">Weight kg</div></div><div class="stat"><div class="stat-v">${wc}/10</div><div class="stat-l">Water</div></div><div class="stat"><div class="stat-v">${mt}/${medTotal}</div><div class="stat-l">Meds</div></div>`;

  // Quick actions
  $('dbQuickActions').innerHTML=[{icon:'🍎',l:'Log Food',p:'nutrition'},{icon:'💊',l:'Meds',p:'medicine'},{icon:'😴',l:'Sleep',p:'sleep'},{icon:'📸',l:'Journal',p:'journal'}].map(a=>`<div onclick="MC.goTo('${a.p}')" style="background:white;border-radius:16px;padding:16px;text-align:center;cursor:pointer;border:1.5px solid rgba(232,160,168,.2);transition:.2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'"><div style="font-size:26px;margin-bottom:5px">${a.icon}</div><div style="font-size:12.5px;font-weight:500">${a.l}</div></div>`).join('');

  // Today summary
  const {data:todayFoods}=await supa.from('food_logs').select('calories').eq('user_id',user.id).eq('food_date',todayStr());
  const cal=todayFoods?.reduce((a,f)=>a+(f.calories||0),0)||0;
  $('dbToday').innerHTML=[['🍽️ Calories',`${cal} kcal`],['💧 Water',`${wc}/10 glasses`],['💊 Medicines',`${mt}/${medTotal} done`],['😴 Last sleep',`${slHrs} hours`]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:white;border-radius:12px;margin-bottom:7px;font-size:13px"><span>${l}</span><strong>${v}</strong></div>`).join('');

  // Milestones
  const upcoming=MILESTONES.filter(m=>m.w>=week).slice(0,4);
  $('dbMilestones').innerHTML=upcoming.length?upcoming.map(m=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:white;border-radius:12px;margin-bottom:7px;font-size:13px"><div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--rose),var(--peach));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0">W${m.w}</div><div>${m.t}</div></div>`).join(''):'<p style="font-size:13px;color:var(--muted)">Due date add karein milestones ke liye.</p>';
}

// ══════════════════════════════════════
// PUBLIC MC OBJECT
// ══════════════════════════════════════
window.MC = {
  // Auth
  sendOTP, showStep, verifyOTP, otpInput, logout,
  // Nav
  goTo,
  // Mood
  showMoodTips,
  // Breathing + Affirmations
  startBreathing, newAffirmation,
  // Chat
  sendChat,
  // Due Date
  calcDue, calcFromDue,
  // Weight
  addWeight, deleteWeight, savePreWeight,
  // Sleep
  logSleep, deleteSleep,
  // Nutrition
  addFood, deleteFood,
  // Medicine
  addMedicine, deleteMed, toggleMedTaken, toggleAddMedForm,
  // Bag
  toggleBagItem, addCustomBagItem, resetBag,
  // Names
  renderNames, toggleSaveName,
  // Journal
  handlePhoto, saveJournalEntry, deleteJournalEntry,
  // Appointments
  addAppointment, toggleApptDone, deleteAppt,
  // Birth Plan
  saveBirthPlan,
  // Postpartum
  renderPPWeek,
  // Symptoms
  filterSymptoms,
  // SOS
  findHospital, addEC, delEC,
  // Dashboard
  renderDashboard,
};
