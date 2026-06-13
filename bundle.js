// MamaCare v8.0 — Bundled App
// Combined from 14 source files
// Build: 2026-06-13T05:54:13.821Z


// ═══════════════════════════════════════════════════════════
// SOURCE: app.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare v8.0 — app.js (FULLY CONNECTED & STABLE)
 * Fixes: Centralized Event Listeners, Stabilized Routing, Failsafe DB
 */
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
  },
  hi:{
    moodHero:'गर्भावस्था में <em>मूड बदलना</em><br>बिल्कुल सामान्य है, आप अकेली नहीं <i data-lucide="heart-handshake" style="display:inline; width:28px; height:28px; color:var(--accent);"></i>',
    moodStep:'अभी आप कैसा महसूस कर रही हैं?',breathTitle:'4-4-4 बॉक्स ब्रीदिंग',
    breathStart:'शुरू करें',breathStop:'बंद करें',
    affirmTitle:'आज की पुष्टि',affirmBtn:'नई',
    chatTitle:'MamaCare AI साथी',chatHint:'कुछ भी लिखें...',chatSend:'भेजें',
    chatGreeting:'नमस्ते! मैं MamaCare हूँ। आज आप कैसा महसूस कर रही हैं? कुछ भी साझा करें।',
    lmpLbl:'अंतिम मासिक धर्म (LMP)',dueLbl:'या नियत तारीख डालें',
    startLbl:'शुरुआत',endLbl:'नियत तारीख',thisWeekLbl:'इस सप्ताह',
    wtKg:'वजन (kg)',wtWk:'सप्ताह',preWt:'गर्भावस्था से पहले का वजन (kg)',wtAdd:'+ लॉग',
    bedLbl:'सोने का समय',wakeLbl:'उठने का समय',qualLbl:'गुणवत्ता',issueLbl:'समस्या',sleepAdd:'+ नींद लॉग करें',
    waterGoal:'लक्ष्य: 8–10 गिलास — टैप करें',
    foodAdd:'+ जोड़ें',mealTitle:'विशेषज्ञ आहार गाइड',
    medAdd:'+ दवाई जोड़ें',medSave:'सहेजें',
    bagReset:'रीसेट',bagAdd:'+ आइटम जोड़ें',
    jWkLbl:'सप्ताह',jDtLbl:'तारीख',jMoodLbl:'मनोदशा',jTxtLbl:'लिखें...',
    jPhotoLbl:'फोटो (गैलरी में सहेजी जाएगी)',jPhotoBtn:'फोटो चुनें',
    jSave:'एंट्री सहेजें',jTimeline:'मेरी डायरी',
    apptAdd:'+ सहेजें',apptTitle:'आगामी अपॉइंटमेंट',
    bpNote:'💡 डिलीवरी से पहले डॉक्टर को दें। मेडिकल इमरजेंसी में डॉक्टर का निर्णय अंतिम होगा।',
    ppCongrats:'बधाई हो, माँ! <i data-lucide="heart" class="app-icon-inline" style="color:var(--accent); fill:var(--accent)"></i>',
    ppSub:'अपना ख्याल रखना उतना ही जरूरी है जितना बच्चे का।',
    sympHint:'लक्षण खोजें...',sympDisc:'⚠️ सामान्य जानकारी के लिए — गंभीर लक्षणों में डॉक्टर से मिलें।',
    sosDesc:'इमरजेंसी में यह बटन दबाएं — GPS नजदीकी अस्पताल ढूंढेगा',
    logoutQ:'क्या आप लॉगआउट करना चाहती हैं?',synced:'सिंक हो गया',savedOff:'सहेजा गया',
    m_anxious:'चिंतित',m_sad:'उदास',m_angry:'गुस्सा',m_tired:'थकान',
    m_nauseous:'मतली',m_overwhelmed:'अभिभूत',m_scared:'डरा हुआ',
    m_lonely:'अकेला',m_happy:'खुश',m_excited:'उत्साहित',
    t1:'पहली',t2:'दूसरी',t3:'तीसरी',tri:'तिमाही',wk:'सप्ताह',
    days:'दिन बाकी',done:'पूर्ण',baby:'बच्चा',body:'शरीर',tip:'सुझाव',mTip:'मूड टिप',
  },
  ta:{
    moodHero:'கர்ப்பகாலத்தில் <em>மனநிலை மாற்றங்கள்</em><br>இயல்பானவை, நீங்கள் தனியில்லை <i data-lucide="heart-handshake" style="display:inline; width:28px; height:28px; color:var(--accent);"></i>',
    moodStep:'இப்போது எப்படி உணர்கிறீர்கள்?',breathTitle:'4-4-4 மூச்சுப் பயிற்சி',
    breathStart:'தொடங்கு',breathStop:'நிறுத்து',
    affirmTitle:'இன்றைய உறுதிமொழி',affirmBtn:'புதியது',
    chatTitle:'MamaCare AI தோழி',chatHint:'எதையும் எழுதுங்கள்...',chatSend:'அனுப்பு',
    chatGreeting:'வணக்கம்! நான் MamaCare. இன்று எப்படி உணர்கிறீர்கள்?',
    lmpLbl:'கடைசி மாதவிடாய் (LMP)',dueLbl:'அல்லது பிரசவ தேதி உள்ளிடவும்',
    startLbl:'தொடக்கம்',endLbl:'பிரசவ தேதி',thisWeekLbl:'இந்த வாரம்',
    wtKg:'எடை (kg)',wtWk:'வாரம்',preWt:'கர்ப்பத்திற்கு முந்தைய எடை (kg)',wtAdd:'+ பதிவு',
    bedLbl:'தூக்க நேரம்',wakeLbl:'எழும் நேரம்',qualLbl:'தரம்',issueLbl:'பிரச்சனை',sleepAdd:'+ தூக்கம் பதிவு',
    waterGoal:'இலக்கு: 8–10 கிளாஸ் — தட்டவும்',
    foodAdd:'+ சேர்',mealTitle:'நிபுணர் உணவு வழிகாட்டி',
    medAdd:'+ மருந்து சேர்',medSave:'சேமி',
    bagReset:'மீட்டமை',bagAdd:'+ பொருள் சேர்',
    jWkLbl:'வாரம்',jDtLbl:'தேதி',jMoodLbl:'மனநிலை',jTxtLbl:'எழுதுங்கள்...',
    jPhotoLbl:'புகைப்படம்',jPhotoBtn:'புகைப்படம் தேர்வு',
    jSave:'பதிவு சேமி',jTimeline:'என் டைரி',
    apptAdd:'+ சேமி',apptTitle:'வரவிருக்கும் சந்திப்புகள்',
    bpNote:'💡 பிரசவத்திற்கு முன் மருத்துவரிடம் கொடுங்கள்.',
    ppCongrats:'வாழ்த்துக்கள், அம்மா! <i data-lucide="heart" class="app-icon-inline" style="color:var(--accent); fill:var(--accent)"></i>',
    ppSub:'உங்களை கவனித்துக்கொள்வது குழந்தையை கவனிப்பதைப் போலவே முக்கியம்.',
    sympHint:'அறிகுறிகளை தேடுங்கள்...',sympDisc:'⚠️ பொது தகவலுக்கு மட்டுமே — தீவிர அறிகுறிகளுக்கு மருத்துவரை அணுகவும்.',
    sosDesc:'அவசரநிலையில் இந்த பொத்தானை அழுத்துங்கள் — GPS அருகிலுள்ள மருத்துவமனையை கண்டுபிடிக்கும்',
    logoutQ:'வெளியேற விரும்புகிறீர்களா?',synced:'ஒத்திசைக்கப்பட்டது',savedOff:'சேமிக்கப்பட்டது',
    m_anxious:'கவலை',m_sad:'சோகம்',m_angry:'கோபம்',m_tired:'சோர்வு',
    m_nauseous:'குமட்டல்',m_overwhelmed:'அதிர்ச்சி',m_scared:'பயம்',
    m_lonely:'தனிமை',m_happy:'மகிழ்ச்சி',m_excited:'உற்சாகம்',
    t1:'முதல்',t2:'இரண்டாம்',t3:'மூன்றாம்',tri:'மூன்று மாதம்',wk:'வாரம்',
    days:'நாட்கள் மீதம்',done:'முடிந்தது',baby:'குழந்தை',body:'உடல்',tip:'குறிப்பு',mTip:'மனநிலை குறிப்பு',
  },
  bn:{
    moodHero:'গর্ভাবস্থায় <em>মেজাজ পরিবর্তন</em><br>সম্পূর্ণ স্বাভাবিক, আপনি একা নন <i data-lucide="heart-handshake" style="display:inline; width:28px; height:28px; color:var(--accent);"></i>',
    moodStep:'এখন আপনি কেমন অনুভব করছেন?',breathTitle:'4-4-4 বক্স ব্রিদিং',
    breathStart:'শুরু করুন',breathStop:'বন্ধ করুন',
    affirmTitle:'আজকের নিশ্চয়তা',affirmBtn:'নতুন',
    chatTitle:'MamaCare AI সঙ্গী',chatHint:'যেকোনো কিছু লিখুন...',chatSend:'পাঠান',
    chatGreeting:'নমস্কার! আমি MamaCare। আজ আপনি কেমন আছেন?',
    lmpLbl:'শেষ মাসিক (LMP)',dueLbl:'অথবা প্রসবের তারিখ দিন',
    startLbl:'শুরু',endLbl:'প্রসবের তারিখ',thisWeekLbl:'এই সপ্তাহ',
    wtKg:'ওজন (kg)',wtWk:'সপ্তাহ',preWt:'গর্ভাবস্থার আগের ওজন (kg)',wtAdd:'+ লগ',
    bedLbl:'ঘুমানোর সময়',wakeLbl:'ওঠার সময়',qualLbl:'মান',issueLbl:'সমস্যা',sleepAdd:'+ ঘুম লগ করুন',
    waterGoal:'লক্ষ্য: ৮–১০ গ্লাস — ট্যাপ করুন',
    foodAdd:'+ যোগ করুন',mealTitle:'বিশেষজ্ঞ খাদ্য গাইড',
    medAdd:'+ ওষুধ যোগ করুন',medSave:'সংরক্ষণ করুন',
    bagReset:'রিসেট',bagAdd:'+ আইটেম যোগ করুন',
    jWkLbl:'সপ্তাহ',jDtLbl:'তারিখ',jMoodLbl:'মেজাজ',jTxtLbl:'লিখুন...',
    jPhotoLbl:'ছবি (গ্যালারিতে সংরক্ষিত হবে)',jPhotoBtn:'ছবি বেছে নিন',
    jSave:'এন্ট্রি সংরক্ষণ',jTimeline:'আমার ডায়েরি',
    apptAdd:'+ সংরক্ষণ',apptTitle:'আসন্ন অ্যাপয়েন্টমেন্ট',
    bpNote:'💡 প্রসবের আগে ডাক্তারকে দিন।',
    ppCongrats:'অভিনন্দন, মা! <i data-lucide="heart" class="app-icon-inline" style="color:var(--accent); fill:var(--accent)"></i>',
    ppSub:'নিজের যত্ন নেওয়া শিশুর যত্নের মতোই গুরুত্বপূর্ণ।',
    sympHint:'উপসর্গ খুঁজুন...',sympDisc:'⚠️ সাধারণ তথ্যের জন্য — গুরুতর উপসর্গে ডাক্তার দেখান।',
    sosDesc:'জরুরি অবস্থায় এই বোতাম চাপুন — GPS নিকটতম হাসপাতাল খুঁজবে',
    logoutQ:'আপনি কি লগআউট করতে চান?',synced:'সিঙ্ক হয়েছে',savedOff:'সংরক্ষিত',
    m_anxious:'উদ্বিগ্ন',m_sad:'দুঃখী',m_angry:'রাগান্বিত',m_tired:'ক্লান্ত',
    m_nauseous:'বমি বমি',m_overwhelmed:'অভিভূত',m_scared:'ভীত',
    m_lonely:'একাকী',m_happy:'খুশি',m_excited:'উত্তেজিত',
    t1:'প্রথম',t2:'দ্বিতীয়',t3:'তৃতীয়',tri:'ত্রৈমাসিক',wk:'সপ্তাহ',
    days:'দিন বাকি',done:'সম্পূর্ণ',baby:'শিশু',body:'শরীর',tip:'টিপস',mTip:'মেজাজ টিপস',
  },
  mr:{
    moodHero:'गर्भावस्थेत <em>मूड बदलणे</em><br>अगदी सामान्य आहे, तुम्ही एकट्या नाही <i data-lucide="heart-handshake" style="display:inline; width:28px; height:28px; color:var(--accent);"></i>',
    moodStep:'आत्ता तुम्हाला कसे वाटत आहे?',breathTitle:'4-4-4 बॉक्स श्वास',
    breathStart:'सुरू करा',breathStop:'थांबवा',
    affirmTitle:'आजची पुष्टी',affirmBtn:'नवीन',
    chatTitle:'MamaCare AI सोबती',chatHint:'काहीही लिहा...',chatSend:'पाठवा',
    chatGreeting:'नमस्कार! मी MamaCare आहे. आज तुम्हाला कसे वाटत आहे?',
    lmpLbl:'शेवटची मासिक पाळी (LMP)',dueLbl:'किंवा प्रसूती तारीख टाका',
    startLbl:'सुरुवात',endLbl:'प्रसूती तारीख',thisWeekLbl:'या आठवड्यात',
    wtKg:'वजन (kg)',wtWk:'आठवडा',preWt:'गर्भावस्थेपूर्वीचे वजन (kg)',wtAdd:'+ लॉग',
    bedLbl:'झोपण्याची वेळ',wakeLbl:'उठण्याची वेळ',qualLbl:'गुणवत्ता',issueLbl:'समस्या',sleepAdd:'+ झोप लॉग करा',
    waterGoal:'ध्येय: ८–१० ग्लास — टॅप करा',
    foodAdd:'+ जोडा',mealTitle:'तज्ञ आहार मार्गदर्शक',
    medAdd:'+ औषध जोडा',medSave:'जतन करा',
    bagReset:'रीसेट',bagAdd:'+ वस्तू जोडा',
    jWkLbl:'आठवडा',jDtLbl:'तारीख',jMoodLbl:'मनस्थिती',jTxtLbl:'लिहा...',
    jPhotoLbl:'फोटो (गॅलरीत जतन होईल)',jPhotoBtn:'फोटो निवडा',
    jSave:'नोंद जतन करा',jTimeline:'माझी डायरी',
    apptAdd:'+ जतन करा',apptTitle:'येणारे अपॉइंटमेंट',
    bpNote:'💡 प्रसूतीपूर्वी डॉक्टरांना द्या.',
    ppCongrats:'अभिनंदन, आई! <i data-lucide="heart" class="app-icon-inline" style="color:var(--accent); fill:var(--accent)"></i>',
    ppSub:'स्वतःची काळजी घेणे बाळाची काळजी घेण्याइतकेच महत्त्वाचे आहे.',
    sympHint:'लक्षणे शोधा...',sympDisc:'⚠️ सामान्य माहितीसाठी — गंभीर लक्षणांसाठी डॉक्टरांना भेटा.',
    sosDesc:'आणीबाणीत हे बटण दाबा — GPS जवळचे रुग्णालय शोधेल',
    logoutQ:'तुम्हाला लॉगआउट करायचे आहे का?',synced:'सिंक झाले',savedOff:'जतन झाले',
  bind('authVerifyBtn', 'click', verifyOTP);
  for(let i=0; i<=5; i++) bind('otp'+i, 'input', function() { otpInput(this, i); });
  setupOTPPaste();
    m_lonely:'एकटे',m_happy:'आनंदी',m_excited:'उत्साहित',
    t1:'पहिली',t2:'दुसरी',t3:'तिसरी',tri:'तिमाही',wk:'आठवडा',
    days:'दिवस बाकी',done:'पूर्ण',baby:'बाळ',body:'शरीर',tip:'टिप',mTip:'मूड टिप',
  },
  te:{
    moodHero:'గర్భావస్థలో <em>మూడ్ మారడం</em><br>పూర్తిగా సాధారణం, మీరు ఒంటరిగా లేరు <i data-lucide="heart-handshake" style="display:inline; width:28px; height:28px; color:var(--accent);"></i>',
    moodStep:'ఇప్పుడు మీకు ఎలా అనిపిస్తోంది?',breathTitle:'4-4-4 బాక్స్ శ్వాస',
    breathStart:'ప్రారంభించు',breathStop:'ఆపు',
    affirmTitle:'నేటి ధృవీకరణ',affirmBtn:'కొత్తది',
    chatTitle:'MamaCare AI తోడు',chatHint:'ఏదైనా రాయండి...',chatSend:'పంపు',
    chatGreeting:'నమస్కారం! నేను MamaCare. ఈరోజు మీకు ఎలా అనిపిస్తోంది?',
    lmpLbl:'చివరి మాసిక స్రావం (LMP)',dueLbl:'లేదా ప్రసవ తేదీ నమోదు చేయండి',
    startLbl:'ప్రారంభం',endLbl:'ప్రసవ తేదీ',thisWeekLbl:'ఈ వారం',
    wtKg:'బరువు (kg)',wtWk:'వారం',preWt:'గర్భానికి ముందు బరువు (kg)',wtAdd:'+ లాగ్',
    bedLbl:'నిద్ర సమయం',wakeLbl:'లేచే సమయం',qualLbl:'నాణ్యత',issueLbl:'సమస్య',sleepAdd:'+ నిద్ర లాగ్',
    waterGoal:'లక్ష్యం: 8–10 గ్లాసులు — నొక్కండి',
    foodAdd:'+ జోడించు',mealTitle:'నిపుణుల ఆహార గైడ్',
    medAdd:'+ మందు జోడించు',medSave:'సేవ్ చేయి',
    bagReset:'రీసెట్',bagAdd:'+ వస్తువు జోడించు',
    jWkLbl:'వారం',jDtLbl:'తేదీ',jMoodLbl:'మూడ్',jTxtLbl:'రాయండి...',
    jPhotoLbl:'ఫోటో (గ్యాలరీలో సేవ్ అవుతుంది)',jPhotoBtn:'ఫోటో ఎంచుకోండి',
    jSave:'ఎంట్రీ సేవ్ చేయి',jTimeline:'నా డైరీ',
    apptAdd:'+ సేవ్ చేయి',apptTitle:'రాబోయే అపాయింట్‌మెంట్లు',
    bpNote:'💡 ప్రసవానికి ముందు డాక్టర్‌కు ఇవ్వండి.',
    ppCongrats:'అభినందనలు, అమ్మా! <i data-lucide="heart" class="app-icon-inline" style="color:var(--accent); fill:var(--accent)"></i>',
    ppSub:'మిమ్మల్ని మీరు జాగ్రత్తగా చూసుకోవడం శిశువును చూసుకోవడంలా ముఖ్యమైనది.',
    sympHint:'లక్షణాలు వెతకండి...',sympDisc:'⚠️ సాధారణ సమాచారం మాత్రమే — తీవ్రమైన లక్షణాలకు డాక్టర్‌ను సంప్రదించండి.',
    sosDesc:'అత్యవసర పరిస్థితిలో ఈ బటన్ నొక్కండి — GPS సమీప ఆసుపత్రిని కనుగొంటుంది',
    logoutQ:'మీరు లాగ్‌అవుట్ చేయాలనుకుంటున్నారా?',synced:'సమకాలీకరించబడింది',savedOff:'సేవ్ అయింది',
    m_anxious:'ఆందోళన',m_sad:'దుఃఖం',m_angry:'కోపం',m_tired:'అలసట',
    m_nauseous:'వికారం',m_overwhelmed:'అభిభూతం',m_scared:'భయం',
    m_lonely:'ఒంటరితనం',m_happy:'సంతోషం',m_excited:'ఉత్సాహం',
    t1:'మొదటి',t2:'రెండవ',t3:'మూడవ',tri:'త్రైమాసికం',wk:'వారం',
    days:'రోజులు మిగిలాయి',done:'పూర్తయింది',baby:'శిశువు',body:'శరీరం',tip:'చిట్కా',mTip:'మూడ్ చిట్కా',
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
const setHTML = (id, v) => { const e=$(id); if(e) e.innerHTML=window.DOMPurify ? DOMPurify.sanitize(v) : v; };
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
function otpInput(el, idx) {
  el.value=el.value.replace(/\D/g,'');
  if(el.value&&idx<5) $('otp'+(idx+1))?.focus();
  if(idx===5&&el.value) verifyOTP();
}

// Handle OTP paste — fills all 6 boxes from a pasted 6-digit code
function setupOTPPaste() {
  for(let i=0;i<6;i++){
    const inp=$('otp'+i);
    if(!inp) continue;
    inp.addEventListener('paste', e=>{
      e.preventDefault();
      const text=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
      if(!text) return;
      for(let j=0;j<6;j++){
        const box=$('otp'+j);
        if(box) box.value=text[j]||'';
      }
      $('otp'+(Math.min(text.length,5)))?.focus();
      if(text.length===6) verifyOTP();
    });
    // Also handle backspace to go back
    inp.addEventListener('keydown', e=>{
      if(e.key==='Backspace'&&!inp.value&&i>0) $('otp'+(i-1))?.focus();
    });
  }
}

async function onLogin(u) { all 6 boxes from a pasted 6-digit code
function setupOTPPaste() {
  for(let i=0;i<6;i++){
    const inp=$('otp'+i);
    if(!inp) continue;
    inp.addEventListener('paste', e=>{
      e.preventDefault();
      const text=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
      if(!text) return;
      for(let j=0;j<6;j++){
        const box=$('otp'+j);
        if(box) box.value=text[j]||'';
      }
      $('otp'+(Math.min(text.length,5)))?.focus();
      if(text.length===6) verifyOTP();
    });
    // Also handle backspace to go back
    inp.addEventListener('keydown', e=>{
      if(e.key==='Backspace'&&!inp.value&&i>0) $('otp'+(i-1))?.focus();
    });
  }
}

// Handle OTP paste — fills all 6 boxes from a pasted 6-digit code
function setupOTPPaste() {
  for(let i=0;i<6;i++){
    const inp=$('otp'+i);
    if(!inp) continue;
    inp.addEventListener('paste', e=>{
      e.preventDefault();
      const text=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
      if(!text) return;
      for(let j=0;j<6;j++){
        const box=$('otp'+j);
        if(box) box.value=text[j]||'';
      }
  if (window.TRACKER)  window.TRACKER.initTrackers();
  if (window.ONBOARD)  window.ONBOARD.checkOnboarding(u);
  // Schedule push reminders if permission already granted
  if (Notification.permission === 'granted') {
    if (window.scheduleDailyWaterReminders) window.scheduleDailyWaterReminders();
    if (window.scheduleWeeklyUpdate) window.scheduleWeeklyUpdate();
  }
    });
    // Also handle backspace to go back
    inp.addEventListener('keydown', e=>{
      if(e.key==='Backspace'&&!inp.value&&idx>0) $('otp'+(idx-1))?.focus();
    });
  }
}   affirmTitle:        {text: T.affirmTitle},
    affirmBtn:          {html: `<i data-lucide="sparkles" class="app-icon-inline"></i> ${T.affirmBtn}`},
    chatTitle:          {text: T.chatTitle},
    chatInput:          {ph: T.chatHint},
    chatSendBtn:        {html: `<i data-lucide="send" class="app-icon-inline"></i> ${T.chatSend}`},
    lmpLabel:           {text: T.lmpLbl},
    dueDateLabel:       {text: T.dueLbl},
    startLabel:         {text: T.startLbl},
    endLabel:           {text: T.endLbl},
  initYogaFilters(); initNutrition(); initBirthPlan(); initPostpartum();
  initSOS(); initSymptoms(); initAppointmentChecklist(); initJournal();
  initSupplementGuide(); renderDashboard();
  
  // Call plugins if they exist
  if (window.TRACKER)  window.TRACKER.initTrackers();
  if (window.ONBOARD)  window.ONBOARD.checkOnboarding(u);
  // Schedule push reminders if permission already granted
  if (Notification.permission === 'granted') {
    if (window.scheduleDailyWaterReminders) window.scheduleDailyWaterReminders();
    if (window.scheduleWeeklyUpdate) scheduleWeeklyUpdate();
  }
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
  if (window.BABY)     window.BABY.initBaby();
  if (window.INDIA)    window.INDIA.initIndia();
  if (window.SMART)    window.SMART.initSmart();
  
  renderIcons();

  // Dispatch login event for push notifications and onboarding
  window.dispatchEvent(new CustomEvent('mc:loggedin', { detail: u }));
}

async function logout(){
  // Auth 
  // Call plugins if they exist
  if (window.TRACKER)  window.TRACKER.initTrackers();
  if (window.ONBOARD)  window.ONBOARD.checkOnboarding(u);
  if (window.PREMIUM)  { window.PREMIUM.load().then(() => { window.PREMIUM.loadBadge(); window.PREMIUM.updatePage(); }); }
  if (window.BABY)     window.BABY.initBaby();
  if (window.INDIA)    window.INDIA.initIndia();
  if (window.SMART)    window.SMART.initSmart();
  
  renderIcons();

  // Dispatch login event for app-push.js and other modules
  window.dispatchEvent(new CustomEvent('mc:loggedin', { detail: u }));
} if (window.initAllReminders) window.initAllReminders();

  renderIcons();

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
  // Hide both splash and auth
  const splash = document.getElementById('splashScreen');
  const auth   = document.getElementById('authScreen');
  if (splash) splash.classList.add('hidden');
  if (auth)   auth.style.display='none';
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

  if ($('authScreen')) $('authScreen').style.display='none';
  const splash = document.getElementById('splashScreen');
  if (splash) splash.classList.remove('hidden');
  if ($('langBar'))    $('langBar').style.display='none';
  if ($('topBar'))     $('topBar').style.display='none';
  if ($('bottomNav'))  $('bottomNav').classList.remove('nav-visible');
  
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  if ($('page-dashboard')) $('page-dashboard').classList.add('active');
}

// Initialization Entry Point
window.addEventListener('DOMContentLoaded', async () => {
  bindStaticEvents(); // Wire up all the clean HTML IDs

  // ── Splash "Get Started" button ──
  const getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      const splash = document.getElementById('splashScreen');
      const auth   = document.getElementById('authScreen');
      if (splash) splash.classList.add('hidden');
      if (auth)   auth.style.display = 'flex';
    });
  }

  // ── Auth "Back to Splash" button ──
  const backToSplash = document.getElementById('authBackToSplash');
  if (backToSplash) {
    backToSplash.addEventListener('click', () => {
      const splash = document.getElementById('splashScreen');
      const auth   = document.getElementById('authScreen');
      if (splash) splash.classList.remove('hidden');
      if (auth)   auth.style.display = 'none';
    });
  }

  if(supa) {
    const {data:{session}}=await supa.auth.getSession();
    if(session?.user) {
      // Already logged in — skip splash & auth entirely
      const splash = document.getElementById('splashScreen');
      const auth   = document.getElementById('authScreen');
      if (splash) splash.classList.add('hidden');
      if (auth)   auth.style.display = 'none';
      onLogin(session.user);
    } else {
      applyLang(lang);
    }
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
async function loadMedicines(){
  if(!user || !supa) return;
  const {data:meds}=await supa.from('medicines').select('*').eq('user_id',user.id).eq('is_active',true).order('time_of_day');
  const {data:logs}=await supa.from('medicine_logs').select('medicine_id').eq('user_id',user.id).eq('taken_date',todayStr());
  medicines=meds||[];medTaken={};(logs||[]).forEach(l=>medTaken[l.medicine_id]=true);
  renderMedicines();
  // Re-schedule reminders for all active medicines
  if(window.scheduleMedicineReminders && medicines.length){
    const medsForSchedule=medicines.map(m=>({...m,reminder_time:m.time_of_day}));
    window.scheduleMedicineReminders(medsForSchedule);
  }
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
async function addMedicine(){
  const name=$('medName')?.value.trim();if(!name){alert('Name daalo');return;}
  if(!user || !supa) return;
  await supa.from('medicines').insert({user_id:user.id,name,dose:$('medDose').value||'1 tablet',time_of_day:$('medTime').value||'08:00',icon:$('medIcon').value,notes:$('medNotes').value,is_active:true});
  ['medName','medDose','medNotes'].forEach(id=>{const e=$(id);if(e)e.value='';});
  toggleAddMedForm();flash('med-save',T.synced);loadMedicines();
  // Schedule local reminder for this medicine
  if(window.scheduleMedicineReminders){
    const newMed={name,dose:$('medDose')?.value||'1 tablet',reminder_time:$('medTime')?.value||'08:00',notes:$('medNotes')?.value||''};
    window.scheduleMedicineReminders([newMed]);
  }
}       <div style="font-size:13px;color:var(--text-muted)">${pose.dur} • ${pose.lvl}</div>
      </div>
      
async function loadMedicines(){
  if(!user || !supa) return;
  const {data:meds}=await supa.from('medicines').select('*').eq('user_id',user.id).eq('is_active',true).order('time_of_day');
  const {data:logs}=await supa.from('medicine_logs').select('medicine_id').eq('user_id',user.id).eq('taken_date',todayStr());
  medicines=meds||[];medTaken={};(logs||[]).forEach(l=>medTaken[l.medicine_id]=true);
  renderMedicines();
  // Re-schedule reminders for all active medicines
  if(window.scheduleMedicineReminders && medicines.length){
    const medsForSchedule=medicines.map(m=>({...m,reminder_time:m.time_of_day}));
    window.scheduleMedicineReminders(medsForSchedule);
  }
}
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
async function addMedicine(){
  const name=$('medName')?.value.trim();if(!name){alert('Name daalo');return;}
  if(!user || !supa) return;
  await supa.from('medicines').insert({user_id:user.id,name,dose:$('medDose').value||'1 tablet',time_of_day:$('medTime').value||'08:00',icon:$('medIcon').value,notes:$('medNotes').value,is_active:true});
  ['medName','medDose','medNotes'].forEach(id=>{const e=$(id);if(e)e.value='';});
  toggleAddMedForm();flash('med-save',T.synced);loadMedicines();
  // Schedule local reminder for this medicine
  if(window.scheduleMedicineReminders){
    const newMed={name,dose:$('medDose')?.value||'1 tablet',reminder_time:$('medTime')?.value||'08:00',notes:$('medNotes')?.value||''};
    window.scheduleMedicineReminders([newMed]);
  }
}       `).join('')}
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
function handlePhoto(input){
  const file=input.files[0];if(!file)return;photoFile=file;
  const reader=new FileReader();
  reader.onload=e=>{const p=$('photoPreview');if(p){p.src=e.target.result;p.style.display='block';}};
  reader.readAsDataURL(file);
}
}
async function uploadPhotoToSupabase(file, week, date) {
  if (!supa || !user) return null;
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${user.id}/w${week||'0'}-${date||todayStr()}-${Date.now()}.${ext}`;
    const { data, error } = await supa.storage
      .from('journal-photos')
      .upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      // Bucket may not exist yet — fall back to local download
      console.warn('Photo upload failed, falling back to download:', error.message);
      return null;
    }
    const { data: urlData } = supa.storage.from('journal-photos').getPublicUrl(path);
    return urlData?.publicUrl || null;
  } catch(e) {
function renderJournal(){
  const html = journalList.length ? journalList.map(e=>{
    const moodIcon = e.mood || 'smile';
    const photoHtml = e.photo_url
      ? `<img src="${e.photo_url}" style="width:100%;border-radius:10px;margin-top:8px;max-height:200px;object-fit:cover;" loading="lazy" />`
      : '';
    return `<div style="background:white;border-radius:14px;padding:14px;margin-bottom:9px;border:1.5px solid rgba(232,160,168,.15)"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:${e.content_text?'8px':'0'}"><div style="display:flex;align-items:center;gap:8px"><i data-lucide="${moodIcon}" style="width:18px;height:18px;color:var(--accent)"></i><span style="font-size:12px;color:var(--muted)">${fmtDate(e.entry_date)}</span></div><div style="display:flex;align-items:center;gap:8px">${e.week_number?`<span style="font-size:11px;background:var(--blush);color:var(--accent);padding:2px 9px;border-radius:50px;font-weight:500">W${e.week_number}</span>`:''}<button onclick="MC.deleteJournalEntry('${e.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px"><i data-lucide="trash-2" class="app-icon-inline"></i></button></div></div>${e.content_text?`<p style="font-size:13px;line-height:1.7;color:var(--warm)">${e.content_text.replace(/\n/g,'<br>')}</p>`:''}${photoHtml}</div>`;
  }).join('') : '<p style="text-align:center;color:var(--muted);font-size:13px;padding:18px">Koi entry nahi. Pehli yaad likho! <i data-lucide="flower-2" class="app-icon-inline" style="color:var(--rose)"></i></p>';
  const el=$('journalEntries'); if(el){ el.innerHTML=html; }
  const el2=$('journalEntries2'); if(el2){ el2.innerHTML=html; }
  renderIcons();
} if(!user || !supa)return;

  let photoUrl = null;
  if (photoFile) {
    // Try Supabase Storage first
    photoUrl = await uploadPhotoToSupabase(photoFile, week, date);
    if (!photoUrl) {
      // Fallback: download to device
      const url = URL.createObjectURL(photoFile);
      const a = document.createElement('a');
      a.href = url; a.download = `mamacare-w${week||'bump'}-${date||todayStr()}.jpg`;
      a.click(); URL.revokeObjectURL(url);
    }
  }
  }
  await supa.from('journal_entries').insert({
    user_id: user.id,
    week_number: week||null,
    entry_date: date||todayStr(),
    mood: jMood,
    content_text: text||null,
    photo_url: photoUrl,
  });

  photoFile=null;
  const p=$('photoPreview');if(p){p.style.display='none';p.src='';}
  if($('photoUpload'))$('photoUpload').value='';
  if($('jText'))$('jText').value='';
  if($('jWeek'))$('jWeek').value='';
  flash('journal-save',T.synced);
  loadJournal();
}async function deleteFood(id){if(supa) await supa.from('food_logs').delete().eq('id',id);foodLogs=foodLogs.filter(f=>f.id!==id);renderFoodLog();updateNutriBars();}

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
  
  let photoUrl = null;
  
  // Upload photo to cloud if present
  if(photoFile){
    try {
      flash('journal-save-uploading', 'Photo upload ho raha hai...');
      const result = await smartPhotoUpload(photoFile, {
        userId: user.id,
        week: week || currentWeek,
        date: date || todayStr()
      });
      
      photoUrl = result.url;
      
      // Track usage
      if(result.provider !== 'local') {
        trackPhotoUpload(result.provider, photoFile.size);
      }
      
      // Clear photo input
      photoFile = null;
      const p = $('photoPreview');
      if(p){p.style.display='none';p.src='';}
      if($('photoUpload'))$('photoUpload').value='';
      
    } catch(err) {
      console.error('Photo upload error:', err);
      flash('journal-save-error', 'Photo upload failed. Entry will be saved without photo.');
    }
  }
  
  // Save journal entry with photo URL
  await supa.from('journal_entries').insert({
    user_id:user.id,
    week_number:week||null,
    entry_date:date||todayStr(),
    mood:jMood,
    content_text:text||null,
    photo_url:photoUrl  // ← Cloud URL (Cloudinary/Supabase)
  });
  
  if($('jText'))$('jText').value='';
  if($('jWeek'))$('jWeek').value='';
  flash('journal-save',T.synced);
  loadJournal();
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
    const photoHtml = e.photo_url ? `<div style="margin-top:12px"><img src="${e.photo_url}" alt="Journal photo" style="width:100%;max-width:400px;border-radius:12px;border:2px solid var(--blush)" onclick="window.open('${e.photo_url}','_blank')" /></div>` : '';
    return `<div style="background:white;border-radius:14px;padding:14px;margin-bottom:9px;border:1.5px solid rgba(232,160,168,.15)"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:${e.content_text||e.photo_url?'8px':'0'}"><div style="display:flex;align-items:center;gap:8px"><i data-lucide="${moodIcon}" style="width:18px;height:18px;color:var(--accent)"></i><span style="font-size:12px;color:var(--muted)">${fmtDate(e.entry_date)}</span></div><div style="display:flex;align-items:center;gap:8px">${e.week_number?`<span style="font-size:11px;background:var(--blush);color:var(--accent);padding:2px 9px;border-radius:50px;font-weight:500">W${e.week_number}</span>`:''}<button onclick="MC.deleteJournalEntry('${e.id}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px"><i data-lucide="trash-2" class="app-icon-inline"></i></button></div></div>${e.content_text?`<p style="font-size:13px;line-height:1.7;color:var(--warm)">${e.content_text.replace(/\n/g,'<br>')}</p>`:''}${photoHtml}</div>`;
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
}

// ═══════════════════════════════════════════════════════════
// SOURCE: app-improvements.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — app-improvements.js
 * Implements: Contraction Timer, Empty States, Loading States,
 * Push Notifications setup, Privacy Policy, Input Validation helpers
 */
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
// PUSH NOTIFICATIONS — AUTO SCHEDULING
// ══════════════════════════════════════
async function requestPushPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// Schedule a single notification at a specific time today (or tomorrow if past)
function scheduleNotification({ id, title, body, icon, tag, delayMs }) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (delayMs <= 0 || delayMs > 24 * 60 * 60 * 1000) return;
  // Clear any existing timer for this id
  if (window._notifTimers && window._notifTimers[id]) {
    clearTimeout(window._notifTimers[id]);
  }
  if (!window._notifTimers) window._notifTimers = {};
  window._notifTimers[id] = setTimeout(() => {
    new Notification(title, {
      body,
      icon: icon || '/mcAppIcons/android/mipmap-xxxhdpi/icon.png',
      badge: '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/180.png',
      tag,
    });
    // Reschedule for next day
    scheduleNotification({ id, title, body, icon, tag, delayMs: delayMs + 24 * 60 * 60 * 1000 });
  }, delayMs);
}

function getDelayUntil(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
}

// Schedule medicine reminders from loaded medicines array
function scheduleMedicineReminders(medicines) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  medicines.forEach(med => {
    if (!med.reminder_time) return;
    const delay = getDelayUntil(med.reminder_time);
    scheduleNotification({
      id: `med-${med.id}`,
      title: '💊 Medicine Reminder — MamaCare',
      body: `${med.icon || '💊'} ${med.name}${med.dose ? ' — ' + med.dose : ''} lene ka waqt!`,
      tag: `med-${med.id}`,
      delayMs: delay,
    });
  });
}

// Schedule appointment reminders (1 day before + 1 hour before)
function scheduleAppointmentReminders(appointments) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const now = new Date();
  appointments.forEach(appt => {
    if (!appt.date) return;
    const apptDate = new Date(appt.date + (appt.time ? 'T' + appt.time : 'T09:00'));
    if (apptDate <= now) return;

    // 1 day before reminder
    const dayBefore = new Date(apptDate.getTime() - 24 * 60 * 60 * 1000);
    const dayDelay = dayBefore - now;
    if (dayDelay > 0 && dayDelay < 7 * 24 * 60 * 60 * 1000) {
      scheduleNotification({
        id: `appt-day-${appt.id}`,
        title: '📅 Appointment Reminder — MamaCare',
        body: `Kal aapka appointment hai: ${appt.doctor || appt.title || 'Doctor visit'}`,
        tag: `appt-day-${appt.id}`,
        delayMs: dayDelay,
      });
    }

    // 1 hour before reminder
    const hourBefore = new Date(apptDate.getTime() - 60 * 60 * 1000);
    const hourDelay = hourBefore - now;
    if (hourDelay > 0 && hourDelay < 7 * 24 * 60 * 60 * 1000) {
      scheduleNotification({
        id: `appt-hour-${appt.id}`,
        title: '⏰ 1 Hour to Appointment — MamaCare',
        body: `1 ghante mein appointment: ${appt.doctor || appt.title || 'Doctor visit'}`,
        tag: `appt-hour-${appt.id}`,
        delayMs: hourDelay,
      });
    }
  });
}

// Daily water reminder at 10am, 2pm, 6pm
function scheduleDailyWaterReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  [{ t: '10:00', msg: 'Paani peena mat bhoolo! 💧 Subah ka pehla reminder.' },
   { t: '14:00', msg: 'Dopahar ho gayi — paani peena zaroori hai! 💧' },
   { t: '18:00', msg: 'Shaam ka reminder: 8 glass paani ka goal poora karo! 💧' }
  ].forEach(({ t, msg }, i) => {
    scheduleNotification({
      id: `water-${i}`,
      title: '💧 Hydration Reminder — MamaCare',
      body: msg,
      tag: `water-${i}`,
      delayMs: getDelayUntil(t),
    });
  });
}

// Master function — call on login to set up all reminders
async function initAllReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!window.supa || !window.user) return;

  // Load medicines and schedule
  const { data: meds } = await window.supa
    .from('medicines')
    .select('*')
    .eq('user_id', window.user.id);
  if (meds && meds.length) scheduleMedicineReminders(meds);

  // Load appointments and schedule
  const { data: appts } = await window.supa
    .from('appointments')
    .select('*')
    .eq('user_id', window.user.id);
  if (appts && appts.length) scheduleAppointmentReminders(appts);

  // Daily water reminders
  scheduleDailyWaterReminders();
}

// Expose globally so onLogin can call it
window.initAllReminders = initAllReminders;

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

// ══════════════════════════════════════
// OFFLINE QUEUE — IndexedDB
// ══════════════════════════════════════
const OfflineQueue = (() => {
  const DB_NAME = 'mamacare-offline';
  const STORE   = 'queue';

  function open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = e => resolve(e.target.result);
      req.onerror   = e => reject(e.target.error);
    });
  }

  async function enqueue(item) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readwrite');
      const req = tx.objectStore(STORE).add({ ...item, queuedAt: Date.now() });
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  async function getAll() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  async function remove(id) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = resolve;
      tx.onerror    = () => reject(tx.error);
    });
  }

  // Flush queue when back online — push to Supabase
  async function flush() {
    if (!navigator.onLine || !window.supa || !window.user) return;
    let items;
    try { items = await getAll(); } catch(e) { return; }
    if (!items || !items.length) return;

    for (const item of items) {
      try {
        const { error } = await window.supa.from(item.table).insert(item.data);
        if (!error) {
          await remove(item.id);
          console.log(`[Offline Sync] Synced ${item.table} entry`);
        }
      } catch(e) { /* still offline */ }
    }

    // Refresh UI after sync
    if (window.loadWeights)   window.loadWeights();
    if (window.loadSleepLogs) window.loadSleepLogs();
    if (window.loadFoodLog)   window.loadFoodLog();
    if (window.loadJournal)   window.loadJournal();
  }

  return { enqueue, getAll, remove, flush };
})();

window.OfflineQueue = OfflineQueue;

// Flush on reconnect
window.addEventListener('online', () => {
  console.log('[MamaCare] Back online — syncing offline queue...');
  OfflineQueue.flush();
  // Trigger SW background sync if supported
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(reg => {
      if ('sync' in reg) reg.sync.register('sync-logs').catch(() => {});
    });
  }
});

// Listen for SW sync complete messages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data?.type === 'SYNC_COMPLETE') {
      console.log('[MamaCare] SW synced table:', e.data.table);
      OfflineQueue.flush();
    }
  });
}

// Helper: save to Supabase or queue offline
async function saveOrQueue(table, data) {
  if (!window.supa || !window.user) return { queued: false, error: 'Not logged in' };
  if (!navigator.onLine) {
    await OfflineQueue.enqueue({ table, data: { ...data, user_id: window.user.id } });
    return { queued: true };
  }
  const { error } = await window.supa.from(table).insert({ ...data, user_id: window.user.id });
  return { queued: false, error };
}

window.saveOrQueue = saveOrQueue;


// ═══════════════════════════════════════════════════════════
// SOURCE: app-push.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — app-push.js
 * Web Push Notifications (VAPID), Partner Companion, Doctor PDF,
 * Contraction Persistence, Offline Enhancements, Onboarding Streamline
 */
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


// ═══════════════════════════════════════════════════════════
// SOURCE: meal-plans-indian.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — Comprehensive Indian Meal Plans
 * Authentic desi food options for all trimesters + postpartum
 */

const MEAL_PLANS_INDIAN = {
  1: {
    focus: 'Folic Acid, B6 (nausea relief), Iron, Zinc. Small frequent meals for sensitive stomach.',
    meals: [
      {
        t: '<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',
        i: [
          'Poha with peanuts & curry leaves (B6, easy to digest)',
          'Idli-sambhar with coconut chutney (fermented, probiotic)',
          'Moong dal cheela with mint chutney',
          'Banana with whole wheat paratha',
          'Dalia (broken wheat) upma with vegetables',
          'Ragi porridge with jaggery',
          'Ginger-lemon water or jeera water (nausea relief)'
        ]
      },
      {
        t: '<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning Snack',
        i: [
          'Handful of soaked almonds & walnuts (omega-3)',
          '2-3 dates with warm milk (iron, calcium)',
          'Fresh coconut water (electrolytes, hydration)',
          'Roasted makhana (fox nuts) with light spices',
          'Seasonal fruits - apple, pear, berries (avoid papaya)',
          'Buttermilk with roasted jeera'
        ]
      },
      {
        t: '<i data-lucide="sun" class="app-icon-inline"></i> Lunch',
        i: [
          'Dal (moong/masoor) + brown rice or roti',
          'Palak paneer or methi sabzi (folate, iron)',
          'Curd or buttermilk (probiotics, calcium)',
          'Salad with lemon (Vitamin C boosts iron 3x)',
          'Rajma or chana curry (protein, fiber)',
          'Lauki (bottle gourd) or tinda sabzi'
        ]
      },
      {
        t: '<i data-lucide="moon" class="app-icon-inline"></i> Dinner',
        i: [
          'Moong dal khichdi with ghee (easy digest)',
          'Vegetable soup (carrot, tomato, spinach)',
          'Roti with lauki or tinda sabzi',
          'Warm turmeric milk (anti-inflammatory)',
          'Light paneer bhurji with roti',
          'Idli or dosa with sambar (light option)'
        ]
      }
    ],
    avoid: [
      'Raw papaya (latex causes contractions)',
      'Pineapple (bromelain enzyme)',
      'Ajinomoto/Chinese food (MSG)',
      'Unpasteurized paneer/cheese',
      'Raw sprouts (bacteria risk)',
      'Alcohol, smoking (strict no)'
    ]
  },
  
  2: {
    focus: 'Calcium, Vitamin D, Omega-3, Protein. Baby bones and brain developing rapidly.',
    meals: [
      {
        t: '<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',
        i: [
          'Ragi porridge with jaggery (calcium, iron powerhouse)',
          'Besan cheela with vegetables',
          '2 boiled eggs + whole wheat toast',
          'Oats with milk, nuts & berries',
          'Paratha (aloo/paneer/methi) with curd',
          'Fresh orange or mosambi juice (Vitamin C)',
          'Upma with vegetables and peanuts'
        ]
      },
      {
        t: '<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning Snack',
        i: [
          'Greek yogurt with honey & mixed nuts',
          'Ragi or til (sesame) ladoo (calcium boost)',
          'Roasted chana (chickpeas) - protein, fiber',
          'Coconut water with sabja (basil) seeds',
          'Dry fruits mix (anjeer, badam, akhrot)',
          'Paneer cubes with cherry tomatoes'
        ]
      },
      {
        t: '<i data-lucide="sun" class="app-icon-inline"></i> Lunch',
        i: [
          'Fish curry (rohu/katla) or tofu curry (omega-3)',
          'Rajma masala or chhole (protein, iron)',
          'Brown rice + dal + mixed sabzi',
          'Paneer tikka or grilled chicken',
          'Raita with cucumber & boondi',
          'Salad with flaxseed powder',
          'Methi paratha with curd'
        ]
      },
      {
        t: '<i data-lucide="moon" class="app-icon-inline"></i> Dinner',
        i: [
          'Paneer butter masala with roti',
          'Methi paratha with curd (iron, folate)',
          'Dal makhani with jeera rice',
          'Sweet potato chaat (beta-carotene)',
          'Palak soup or mixed vegetable soup',
          'Warm milk with saffron strands',
          'Grilled fish with vegetables'
        ]
      }
    ],
    avoid: [
      'Junk food (chips, burgers, pizza)',
      'Excess sweets (gestational diabetes risk)',
      'Caffeine >200mg/day (1 cup chai is okay)',
      'Smoked or processed meats',
      'Street food (hygiene concerns)'
    ]
  },
  
  3: {
    focus: 'Vitamin K, Iron, Calcium, Fiber (for constipation). Very small frequent meals as stomach is cramped.',
    meals: [
      {
        t: '<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',
        i: [
          'Oats with flaxseeds & dates (fiber, omega-3)',
          'Ragi dosa with sambar',
          'Soaked anjeer (figs) with warm milk',
          'Whole wheat toast with peanut butter',
          'Poha with vegetables & peanuts',
          'Warm water with honey & lemon',
          'Moong dal cheela (light, protein-rich)'
        ]
      },
      {
        t: '<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning Snack',
        i: [
          'Dry fruits ladoo (energy boost)',
          'Tender coconut water (hydration)',
          'Roasted makhana with light spices',
          'Fresh fruits (apple, pear, berries)',
          'Buttermilk with roasted jeera',
          'Dates with almonds'
        ]
      },
      {
        t: '<i data-lucide="sun" class="app-icon-inline"></i> Lunch',
        i: [
          'Palak paneer (iron + calcium perfect combo)',
          'Dal makhani with small rice portion',
          'Curd rice with pickle (easy to digest)',
          'Grilled fish or chicken (protein)',
          'Mixed vegetable sabzi (avoid gas-forming)',
          'Small portions, eat slowly',
          'Moong dal khichdi with ghee'
        ]
      },
      {
        t: '<i data-lucide="moon" class="app-icon-inline"></i> Dinner',
        i: [
          'Light moong dal khichdi with ghee',
          'Ajwain paratha (aids digestion)',
          'Vegetable soup (avoid gas-causing veggies)',
          'Boiled vegetables with roti',
          'Avoid heavy meals (heartburn risk)',
          'Warm milk with cardamom',
          'Idli with light sambar'
        ]
      }
    ],
    avoid: [
      'Gas-forming foods (rajma, chana, cabbage, broccoli)',
      'Spicy food (heartburn gets worse)',
      'Large meals (eat small portions 6-7 times)',
      'Lying down immediately after eating',
      'Carbonated drinks',
      'Fried and oily foods'
    ]
  },
  
  4: {
    focus: 'Postpartum Recovery + Breastfeeding: Protein, Iron, Calcium, Omega-3, Hydration. Traditional Indian foods for healing.',
    meals: [
      {
        t: '<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',
        i: [
          'Methi paratha with generous ghee (milk supply booster)',
          '2 boiled eggs or paneer bhurji (protein)',
          'Warm turmeric milk with saffron (healing, anti-inflammatory)',
          'Ragi porridge with jaggery (calcium, iron)',
          'Soaked almonds & dates (energy, strength)',
          'Ajwain water (digestion, gas relief)',
          'Moong dal cheela with ghee'
        ]
      },
      {
        t: '<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning Snack',
        i: [
          'Gond ladoo or dry fruits ladoo (strength, warmth)',
          'Coconut water (hydration, electrolytes)',
          'Almonds, cashews, walnuts (omega-3)',
          'Til (sesame) ladoo (calcium, warmth)',
          'Fresh fruit juice (room temperature, not cold)',
          'Paneer cubes with nuts'
        ]
      },
      {
        t: '<i data-lucide="sun" class="app-icon-inline"></i> Lunch',
        i: [
          'Dal + rice with generous ghee (strength)',
          'Chicken or fish curry (protein, omega-3)',
          'Palak or methi sabzi (iron, milk supply)',
          'Curd or buttermilk (probiotics, cooling)',
          'Moong dal khichdi (easy digest)',
          'Paneer curry with roti',
          'Lauki or tinda sabzi'
        ]
      },
      {
        t: '<i data-lucide="coffee" class="app-icon-inline"></i> Evening Snack',
        i: [
          'Ajwain or saunf water (lactation booster)',
          'Ragi malt with milk',
          'Gond katira sherbet (cooling, milk supply)',
          'Besan ladoo (protein, energy)',
          'Warm soup (vegetable or chicken)',
          'Methi ladoo (traditional healing)'
        ]
      },
      {
        t: '<i data-lucide="moon" class="app-icon-inline"></i> Dinner',
        i: [
          'Moong dal khichdi with ghee (easy digest)',
          'Paneer bhurji with roti (protein, calcium)',
          'Light chicken curry',
          'Vegetable soup (warm, not cold)',
          'Methi paratha (milk supply)',
          'Warm milk with cardamom',
          'Dal with rice and ghee'
        ]
      }
    ],
    avoid: [
      'Spicy and oily foods (can cause baby colic)',
      'Caffeine (passes to breast milk)',
      'Alcohol (strict no)',
      'Gas-forming foods (cabbage, rajma, beans)',
      'Cold foods and drinks (traditional advice)',
      'Processed and junk food'
    ]
  }
};

// Export for use in main app
if (typeof window !== 'undefined') {
  window.MEAL_PLANS_INDIAN = MEAL_PLANS_INDIAN;
}


// ═══════════════════════════════════════════════════════════
// SOURCE: app-baby.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — app-baby.js v6.2
 * Baby's First Year Tracker
 * Feed Log | Diaper Log | Baby Sleep | Baby Weight | Vaccinations | Milestones
 */
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


// ═══════════════════════════════════════════════════════════
// SOURCE: app-coach.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — app-coach.js
 * AI Weekly Coach — Claude API + Real Supabase Data
 * Personalized weekly advice based on actual user health data
 */

// ═══════════════════════════════════════════
// COACH PAGE INJECTION
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  injectCoachPage();
  addCoachTab();
});

function injectCoachPage() {
  const footer = document.querySelector('footer');
  const html = `
<!-- ═══════ AI COACH PAGE ═══════ -->
<div class="page" id="page-coach">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Personalized AI</div>
    <div class="sec-title">Weekly Coach 🤖✨</div>
  </div>

  <!-- HERO -->
  <div class="card" style="background:linear-gradient(135deg,rgba(212,168,83,.1),rgba(232,160,168,.1));text-align:center;padding:28px">
    <div style="font-size:52px;margin-bottom:12px">🤖</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;margin-bottom:8px">Aapka Personal Pregnancy Coach</div>
    <p style="font-size:13.5px;color:var(--muted);line-height:1.75;max-width:460px;margin:0 auto">Aapka actual data — weight, sleep, mood, nutrition, symptoms — dekh ke Claude AI aapke liye personalized weekly advice tayaar karta hai. Generic nahi, <strong>sirf aapke liye.</strong></p>
  </div>

  <!-- QUICK STATS (what coach will analyze) -->
  <div class="card">
    <div class="sec-label">Analysis Preview</div>
    <div class="sec-title">Yeh Data Analyze Hoga</div>
    <div id="coachDataPreview" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="background:white;border-radius:13px;padding:13px;text-align:center" class="loading">Loading...</div>
    </div>
  </div>

  <!-- GENERATE BUTTON -->
  <div class="card" style="text-align:center;padding:24px">
    <button class="btn btn-p" id="coachGenerateBtn" onclick="COACH.generate()" style="font-size:14px;padding:14px 32px">
      ✨ Weekly Coach Report Generate Karo
    </button>
    <p style="font-size:12px;color:var(--muted);margin-top:10px;line-height:1.6" id="coachSubtext">
      Aapka is hafte ka complete health data Claude ko bheja jaayega
    </p>
  </div>

  <!-- LOADING STATE -->
  <div id="coachLoading" style="display:none" class="card">
    <div style="text-align:center;padding:28px">
      <div style="font-size:40px;margin-bottom:14px;animation:spin 2s linear infinite;display:inline-block">🤖</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;margin-bottom:8px" id="coachLoadingText">Aapka data analyze ho raha hai...</div>
      <div id="coachLoadingSteps" style="font-size:12.5px;color:var(--muted);line-height:2"></div>
    </div>
  </div>

  <!-- COACH REPORT OUTPUT -->
  <div id="coachReport" style="display:none">

    <!-- REPORT HEADER -->
    <div class="card" style="background:linear-gradient(135deg,rgba(212,168,83,.12),rgba(232,160,168,.1))">
      <div style="display:flex;align-items:center;gap:14px">
        <div style="font-size:44px">🤖</div>
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem" id="reportWeekTitle">Week — ka Report</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px" id="reportDateLine"></div>
        </div>
      </div>
    </div>

    <!-- OVERALL SCORE -->
    <div class="card">
      <div class="sec-label">Overall Health Score</div>
      <div class="sec-title">Is Hafte Aap Kaisi Rahi?</div>
      <div id="coachScoreSection"></div>
    </div>

    <!-- PERSONALIZED ADVICE SECTIONS -->
    <div id="coachSections"></div>

    <!-- WEEKLY GOALS -->
    <div class="card" id="coachGoalsCard">
      <div class="sec-label">Agle Hafte ke Liye</div>
      <div class="sec-title">🎯 3 Priority Goals</div>
      <div id="coachGoals"></div>
    </div>

    <!-- MOTIVATIONAL MESSAGE -->
    <div class="card" id="coachMotivation" style="background:linear-gradient(135deg,#fef0f5,#fdf5ee)">
      <div style="font-size:28px;text-align:center;margin-bottom:10px">💗</div>
      <div id="coachMotivationText" style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-style:italic;text-align:center;color:var(--warm);line-height:1.75"></div>
    </div>

    <!-- ACTION BUTTONS -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;padding:0 0 20px">
      <button class="btn btn-p" onclick="COACH.saveReport()">💾 Report Save Karo</button>
      <button class="btn btn-g" onclick="COACH.printReport()">🖨️ Print</button>
      <button class="btn btn-g" onclick="COACH.generate()">🔄 Regenerate</button>
    </div>
  </div>

  <!-- PAST REPORTS -->
  <div class="card" id="pastReportsCard" style="display:none">
    <div class="sec-label">History</div>
    <div class="sec-title">Pichhle Reports 📁</div>
    <div id="pastReportsList"></div>
  </div>

  <!-- HOW IT WORKS -->
  <div class="card" style="background:linear-gradient(135deg,rgba(235,248,240,.6),rgba(230,245,255,.5))">
    <div class="sec-label">About</div>
    <div class="sec-title">Yeh Kaise Kaam Karta Hai?</div>
    <div style="font-size:13px;line-height:2;color:var(--warm)">
      🔒 <strong>Privacy:</strong> Aapka data sirf AI analysis ke liye use hota hai — store nahi hota<br>
      🎯 <strong>Personalized:</strong> Generic advice nahi — aapke actual numbers pe based<br>
      🔄 <strong>Weekly:</strong> Har hafte new analysis — progress track hota hai<br>
      👩‍⚕️ <strong>Expert Based:</strong> ACOG, WHO guidelines pe trained Claude model<br>
      ⚠️ <strong>Disclaimer:</strong> Yeh medical advice replace nahi karta — doctor se milna zaroori hai
    </div>
  </div>
</div>
`;
  if (footer) footer.insertAdjacentHTML('beforebegin', html);
  else document.body.insertAdjacentHTML('beforeend', html);
}

function addCoachTab() {
  // Desktop
  const topTabs = document.getElementById('topTabs');
  if (topTabs) {
    const btn = document.createElement('button');
    btn.className = 'top-tab';
    btn.dataset.page = 'coach';
    btn.textContent = '🤖 Coach';
    btn.addEventListener('click', () => {
      if (window.MC?.goTo) window.MC.goTo('coach');
      loadCoachPreview();
    });
    topTabs.appendChild(btn);
  }
  // Mobile more menu
  const moreGrid = document.querySelector('#moreMenu .more-grid');
  if (moreGrid) {
    const div = document.createElement('div');
    div.className = 'more-item';
    div.dataset.page = 'coach';
    div.innerHTML = '<div class="mi-icon">🤖</div><div class="mi-label">AI Coach</div>';
    div.addEventListener('click', () => {
      document.getElementById('moreMenu').style.display = 'none';
      if (window.MC?.goTo) window.MC.goTo('coach');
      loadCoachPreview();
    });
    moreGrid.appendChild(div);
  }
}

// ═══════════════════════════════════════════
// DATA FETCHER — pulls all user data
// ═══════════════════════════════════════════
async function fetchUserData() {
  const supaRef = window.supa;
  const userRef = window.user;
  if (!supaRef || !userRef) return null;

  const uid = userRef.id;
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0];

  try {
    const [
      profileRes, weightRes, sleepRes, foodRes,
      waterRes, medRes, medLogRes, moodRes,
      journalRes, apptRes, kickRes,
    ] = await Promise.all([
      supaRef.from('user_profile').select('*').eq('id', uid).maybeSingle(),
      supaRef.from('weight_logs').select('*').eq('user_id', uid).gte('logged_at', weekAgo).order('logged_at'),
      supaRef.from('sleep_logs').select('*').eq('user_id', uid).gte('logged_at', weekAgo).order('logged_at'),
      supaRef.from('food_logs').select('*').eq('user_id', uid).gte('logged_at', weekAgo),
      supaRef.from('water_logs').select('*').eq('user_id', uid).gte('log_date', weekAgo),
      supaRef.from('medicines').select('*').eq('user_id', uid).eq('is_active', true),
      supaRef.from('medicine_logs').select('*').eq('user_id', uid).gte('taken_date', weekAgo),
      supaRef.from('mood_logs').select('*').eq('user_id', uid).gte('logged_at', weekAgo).order('logged_at'),
      supaRef.from('journal_entries').select('week_number,mood,content_text,entry_date').eq('user_id', uid).order('created_at', { ascending: false }).limit(3),
      supaRef.from('appointments').select('*').eq('user_id', uid).gte('appt_date', today).order('appt_date').limit(5),
      supaRef.from('kick_logs')?.select('*').eq('user_id', uid).gte('session_date', weekAgo) || { data: [] },
    ]);

    const profile = profileRes.data || {};
    const due = profile.due_date ? new Date(profile.due_date) : null;
    const now = new Date();
    const currentWeek = due
      ? Math.min(40, Math.floor((now - new Date(due.getTime() - 280 * 86400000)) / (7 * 86400000)) + 1)
      : null;
    const trimester = currentWeek ? (currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3) : null;

    const weights = weightRes.data || [];
    const sleeps = sleepRes.data || [];
    const foods = foodRes.data || [];
    const waters = waterRes.data || [];
    const medicines = medRes.data || [];
    const medLogs = medLogRes.data || [];
    const moods = moodRes.data || [];
    const journals = journalRes.data || [];
    const appointments = apptRes.data || [];

    // Compute stats
    const avgSleep = sleeps.length
      ? (sleeps.reduce((a, s) => a + parseFloat(s.duration_hrs || 0), 0) / sleeps.length).toFixed(1)
      : null;
    const sleepQualities = sleeps.map(s => s.quality).filter(Boolean);
    const avgSleepQuality = sleepQualities.length
      ? (sleepQualities.reduce((a, b) => a + b, 0) / sleepQualities.length).toFixed(1)
      : null;
    const sleepIssues = [...new Set(sleeps.map(s => s.issue).filter(Boolean))];

    const lastWeight = weights.length ? weights[weights.length - 1].weight_kg : null;
    const weightTrend = weights.length >= 2
      ? (weights[weights.length - 1].weight_kg - weights[0].weight_kg).toFixed(1)
      : null;

    const avgDailyCal = foods.length
      ? Math.round(foods.reduce((a, f) => a + (f.calories || 0), 0) / 7)
      : null;
    const avgWater = waters.length
      ? (waters.reduce((a, w) => a + (w.glasses_count || 0), 0) / waters.length).toFixed(1)
      : null;

    const moodCounts = {};
    moods.forEach(m => moodCounts[m.mood_type] = (moodCounts[m.mood_type] || 0) + 1);
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    const moodDiversity = Object.keys(moodCounts).length;

    const totalMedDoses = medicines.length * 7;
    const takenDoses = medLogs.length;
    const medCompliance = totalMedDoses > 0
      ? Math.round((takenDoses / totalMedDoses) * 100)
      : null;

    return {
      profile,
      currentWeek,
      trimester,
      dueDate: profile.due_date,
      preWeight: parseFloat(profile.pre_weight) || null,
      // Sleep
      sleepEntries: sleeps.length,
      avgSleep: parseFloat(avgSleep),
      avgSleepQuality: parseFloat(avgSleepQuality),
      sleepIssues,
      // Weight
      lastWeight,
      weightTrend: parseFloat(weightTrend),
      weightEntries: weights.length,
      // Nutrition
      avgDailyCal,
      avgWater: parseFloat(avgWater),
      foodEntries: foods.length,
      waterEntries: waters.length,
      // Medicines
      medicines: medicines.map(m => ({ name: m.name, time: m.time_of_day })),
      medCompliance,
      // Mood
      dominantMood: dominantMood?.[0] || null,
      dominantMoodCount: dominantMood?.[1] || 0,
      moodDiversity,
      moodLogs: moods.length,
      allMoods: moodCounts,
      // Journal
      recentJournals: journals,
      // Appointments
      upcomingAppointments: appointments,
      // Raw for context
      weekRange: `${weekAgo} to ${today}`,
    };
  } catch (e) {
    console.error('Coach data fetch error:', e);
    return null;
  }
}

// ═══════════════════════════════════════════
// PREVIEW — show data summary before generating
// ═══════════════════════════════════════════
async function loadCoachPreview() {
  const preview = document.getElementById('coachDataPreview');
  if (!preview) return;
  if (!window.user) {
    preview.innerHTML = '<p style="font-size:13px;color:var(--muted);grid-column:1/-1;text-align:center;padding:14px">Login karein data dekhne ke liye.</p>';
    return;
  }
  preview.innerHTML = '<div class="loading" style="grid-column:1/-1;padding:14px">Data load ho raha hai...</div>';
  const data = await fetchUserData();
  if (!data) {
    preview.innerHTML = '<p style="font-size:13px;color:var(--muted);grid-column:1/-1;text-align:center;padding:14px">Data load nahi hua. Dobara try karein.</p>';
    return;
  }

  const items = [
    { icon: '🗓️', label: 'Current Week', value: data.currentWeek ? `Week ${data.currentWeek}` : 'Not set', ok: !!data.currentWeek },
    { icon: '😴', label: 'Sleep (7-day avg)', value: data.avgSleep ? `${data.avgSleep} hrs` : 'No data', ok: data.avgSleep >= 7 },
    { icon: '⚖️', label: 'Weight Entries', value: data.weightEntries ? `${data.weightEntries} entries` : 'No data', ok: data.weightEntries > 0 },
    { icon: '🍎', label: 'Nutrition', value: data.avgDailyCal ? `${data.avgDailyCal} kcal/day` : 'No data', ok: data.foodEntries > 0 },
    { icon: '💧', label: 'Water Intake', value: data.avgWater ? `${data.avgWater}/10 glasses` : 'No data', ok: data.avgWater >= 6 },
    { icon: '💊', label: 'Medicine', value: data.medCompliance !== null ? `${data.medCompliance}% compliance` : 'No meds', ok: data.medCompliance >= 80 },
    { icon: '😊', label: 'Mood Logs', value: data.moodLogs ? `${data.moodLogs} entries` : 'No data', ok: data.moodLogs > 0 },
    { icon: '📸', label: 'Journal', value: data.recentJournals.length ? `${data.recentJournals.length} entries` : 'No data', ok: data.recentJournals.length > 0 },
  ];

  preview.innerHTML = items.map(item => `
    <div style="background:white;border-radius:13px;padding:13px;display:flex;align-items:center;gap:10px">
      <span style="font-size:22px">${item.icon}</span>
      <div style="flex:1">
        <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em">${item.label}</div>
        <div style="font-size:13px;font-weight:600;color:var(--warm);margin-top:2px">${item.value}</div>
      </div>
      <span style="font-size:16px">${item.ok ? '✅' : '⚪'}</span>
    </div>`).join('');

  // Load past reports
  loadPastReports();
}

// ═══════════════════════════════════════════
// MAIN GENERATE — Claude API call
// ═══════════════════════════════════════════
async function generate() {
  const btn = document.getElementById('coachGenerateBtn');
  if (!window.user) { showCoachToast('Pehle login karein!'); return; }

  // Show loading
  btn.disabled = true;
  document.getElementById('coachReport').style.display = 'none';
  const loading = document.getElementById('coachLoading');
  loading.style.display = 'block';
  const steps = document.getElementById('coachLoadingSteps');
  const stepsArr = [
    '📊 Aapka health data fetch ho raha hai...',
    '⚖️ Weight trends analyze ho rahi hai...',
    '😴 Sleep patterns check ho rahe hain...',
    '🍎 Nutrition assessment ho raha hai...',
    '😊 Mood patterns samjhe ja rahe hain...',
    '🤖 Claude AI personalized advice tayaar kar raha hai...',
  ];
  let stepIdx = 0;
  const stepInterval = setInterval(() => {
    if (stepIdx < stepsArr.length) {
      if (steps) steps.innerHTML += stepsArr[stepIdx] + '<br>';
      stepIdx++;
    }
  }, 600);

  try {
    // Fetch data
    const data = await fetchUserData();
    if (!data) throw new Error('Data fetch failed');

    // Build prompt
    const prompt = buildCoachPrompt(data);

    // Call Claude via Supabase Edge Function (API key is server-side)
    const supaRef = window.supa;
    const { data: aiData, error: aiError } = await supaRef.functions.invoke('claude-proxy', {
      body: {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: `You are Dr. MamaCare — a warm, expert pregnancy health coach combining the knowledge of an OB-GYN, nutritionist, sleep specialist, and mental health counselor. You speak in Hinglish (natural Hindi-English mix).

You analyze REAL user health data and provide PERSONALIZED advice. Be specific — reference their actual numbers. Be warm but direct. Use evidence-based recommendations from ACOG, WHO, NICE guidelines.

ALWAYS respond in this EXACT JSON format:
{
  "weekSummary": "2-3 sentence overall assessment in Hinglish",
  "overallScore": 75,
  "scoreBreakdown": {
    "sleep": 60,
    "nutrition": 80,
    "activity": 70,
    "mood": 85,
    "medicines": 90
  },
  "sections": [
    {
      "category": "😴 Sleep",
      "status": "needs_attention",
      "headline": "Short headline about their sleep",
      "analysis": "2-3 sentences analyzing their specific sleep data",
      "advice": ["Specific tip 1", "Specific tip 2", "Specific tip 3"],
      "urgency": "medium"
    }
  ],
  "weeklyGoals": [
    { "goal": "Specific goal text", "why": "Why this matters this week", "icon": "🎯" }
  ],
  "motivationalMessage": "Warm, personal closing message in Hinglish",
  "doctorAlert": null
}

Status options: "great", "good", "needs_attention", "urgent"
Urgency options: "low", "medium", "high"
doctorAlert: null OR a specific concern to discuss with doctor

Include sections for: Sleep, Nutrition, Hydration, Weight, Mood & Mental Health, Medicines (if any), and one Pregnancy-specific tip based on their current week.`,
        messages: [{ role: 'user', content: prompt }],
      }
    });

    clearInterval(stepInterval);

    if (aiError) throw new Error(aiError.message || 'Edge Function error');
    const rawText = aiData?.content?.[0]?.text || '';

    // Parse JSON response
    let coachResult;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      coachResult = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      throw new Error('Response parse failed');
    }

    // Render report
    loading.style.display = 'none';
    renderCoachReport(coachResult, data);

    // Auto-save to Supabase
    await saveReportToSupabase(coachResult, data);

  } catch (err) {
    clearInterval(stepInterval);
    loading.style.display = 'none';
    showCoachToast('❌ Error: ' + (err.message || 'Unknown error'));
    console.error('Coach error:', err);
  }

  btn.disabled = false;
}

// ═══════════════════════════════════════════
// PROMPT BUILDER
// ═══════════════════════════════════════════
function buildCoachPrompt(d) {
  const trimesterNames = { 1: 'Pehli', 2: 'Doosri', 3: 'Teesri' };
  const lines = [
    `PREGNANCY DATA — Week ${d.currentWeek || 'Unknown'} of 40`,
    `Trimester: ${trimesterNames[d.trimester] || 'Unknown'}`,
    `Due Date: ${d.dueDate || 'Not set'}`,
    `Analysis Period: ${d.weekRange}`,
    '',
    '=== SLEEP ===',
    `Entries logged: ${d.sleepEntries}/7 days`,
    d.avgSleep ? `Average sleep: ${d.avgSleep} hours/night (Goal: 7-9 hrs)` : 'No sleep data',
    d.avgSleepQuality ? `Average quality: ${d.avgSleepQuality}/3` : '',
    d.sleepIssues.length ? `Issues reported: ${d.sleepIssues.join(', ')}` : 'No issues reported',
    '',
    '=== WEIGHT ===',
    d.lastWeight ? `Current weight: ${d.lastWeight} kg` : 'No weight data',
    d.preWeight ? `Pre-pregnancy weight: ${d.preWeight} kg` : '',
    d.preWeight && d.lastWeight ? `Total gain: ${(d.lastWeight - d.preWeight).toFixed(1)} kg` : '',
    d.weightTrend !== null ? `This week trend: ${d.weightTrend >= 0 ? '+' : ''}${d.weightTrend} kg` : '',
    `Entries this week: ${d.weightEntries}`,
    '',
    '=== NUTRITION ===',
    d.avgDailyCal ? `Average daily calories: ${d.avgDailyCal} kcal (Pregnancy goal: ~2200-2500 kcal)` : 'No food data logged',
    `Food entries logged: ${d.foodEntries} this week`,
    '',
    '=== HYDRATION ===',
    d.avgWater ? `Average water intake: ${d.avgWater}/10 glasses/day (Goal: 8-10)` : 'No water data',
    `Water tracking days: ${d.waterEntries}`,
    '',
    '=== MEDICINES ===',
    d.medicines.length ? `Active medicines: ${d.medicines.map(m => m.name).join(', ')}` : 'No medicines logged',
    d.medCompliance !== null ? `This week compliance: ${d.medCompliance}% (${d.medCompliance >= 80 ? 'Good' : 'Needs improvement'})` : '',
    '',
    '=== MOOD & MENTAL HEALTH ===',
    `Mood logs this week: ${d.moodLogs}`,
    d.dominantMood ? `Most common mood: ${d.dominantMood} (${d.dominantMoodCount}x)` : 'No mood data',
    d.allMoods && Object.keys(d.allMoods).length ? `All moods: ${Object.entries(d.allMoods).map(([m, c]) => `${m}:${c}`).join(', ')}` : '',
    `Mood variety: ${d.moodDiversity} different moods logged`,
    '',
    '=== JOURNAL ===',
    d.recentJournals.length ? `Recent journal entries: ${d.recentJournals.length}` : 'No journal entries',
    d.recentJournals[0]?.content_text ? `Latest entry snippet: "${d.recentJournals[0].content_text.slice(0, 150)}..."` : '',
    '',
    '=== UPCOMING APPOINTMENTS ===',
    d.upcomingAppointments.length
      ? d.upcomingAppointments.map(a => `${a.title} on ${a.appt_date}`).join(', ')
      : 'No upcoming appointments',
  ];

  return lines.filter(l => l !== undefined && l !== '').join('\n') +
    '\n\nProvide a comprehensive weekly coaching report based on this data. Be specific about their numbers. Reference actual values. Give actionable, week-specific advice.';
}

// ═══════════════════════════════════════════
// RENDER REPORT
// ═══════════════════════════════════════════
function renderCoachReport(result, data) {
  document.getElementById('coachReport').style.display = 'block';
  document.getElementById('reportWeekTitle').textContent = `Week ${data.currentWeek || '—'} ka Coach Report`;
  document.getElementById('reportDateLine').textContent = `Generated: ${new Date().toLocaleString('hi-IN')} | ${data.weekRange}`;

  // Score section
  const score = result.overallScore || 70;
  const scoreColor = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--gold)' : 'var(--accent)';
  const scoreEmoji = score >= 80 ? '🌟' : score >= 60 ? '👍' : '💪';
  const sb = result.scoreBreakdown || {};

  document.getElementById('coachScoreSection').innerHTML = `
    <div style="display:flex;align-items:center;gap:20px;margin-bottom:20px;flex-wrap:wrap">
      <div style="text-align:center;flex-shrink:0">
        <div style="font-family:'Cormorant Garamond',serif;font-size:4rem;color:${scoreColor};line-height:1">${score}</div>
        <div style="font-size:12px;color:var(--muted)">/ 100</div>
        <div style="font-size:20px;margin-top:4px">${scoreEmoji}</div>
      </div>
      <div style="flex:1;min-width:200px">
        <p style="font-size:13.5px;line-height:1.8;color:var(--warm)">${result.weekSummary || ''}</p>
      </div>
    </div>
    ${Object.keys(sb).length ? `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px">
      ${Object.entries(sb).map(([key, val]) => {
        const icons = { sleep: '😴', nutrition: '🍎', activity: '🤸', mood: '😊', medicines: '💊', hydration: '💧', weight: '⚖️' };
        const c = val >= 80 ? '#2e7d32' : val >= 60 ? '#e65100' : '#c62828';
        const bg = val >= 80 ? '#e8f5e9' : val >= 60 ? '#fff3e0' : '#ffebee';
        return `<div style="background:${bg};border-radius:12px;padding:11px;text-align:center">
          <div style="font-size:20px;margin-bottom:4px">${icons[key] || '📊'}</div>
          <div style="font-size:18px;font-weight:700;color:${c}">${val}</div>
          <div style="font-size:10.5px;color:var(--muted);text-transform:capitalize">${key}</div>
        </div>`;
      }).join('')}
    </div>` : ''}`;

  // Doctor Alert
  if (result.doctorAlert) {
    document.getElementById('coachSections').insertAdjacentHTML('beforebegin', `
      <div class="card" style="border:2px solid #e05c5c;background:#fff5f5">
        <div style="display:flex;gap:12px;align-items:flex-start">
          <span style="font-size:28px">⚠️</span>
          <div>
            <div style="font-weight:600;font-size:14px;color:#c62828;margin-bottom:4px">Doctor se Discuss Karein</div>
            <div style="font-size:13px;color:var(--warm);line-height:1.65">${result.doctorAlert}</div>
          </div>
        </div>
      </div>`);
  }

  // Category sections
  const statusStyles = {
    great:          { bg: '#e8f5e9', border: '#66bb6a', badge: '🌟 Great', badgeBg: '#e8f5e9', badgeColor: '#2e7d32' },
    good:           { bg: 'rgba(106,184,154,.06)', border: 'var(--green)', badge: '👍 Good', badgeBg: '#e8f5e9', badgeColor: '#2e7d32' },
    needs_attention:{ bg: 'rgba(212,168,83,.06)', border: 'var(--gold)', badge: '💛 Attention', badgeBg: '#fff3e0', badgeColor: '#e65100' },
    urgent:         { bg: '#fff5f5', border: '#e05c5c', badge: '🔴 Urgent', badgeBg: '#ffebee', badgeColor: '#c62828' },
  };

  const sections = result.sections || [];
  document.getElementById('coachSections').innerHTML = sections.map(sec => {
    const st = statusStyles[sec.status] || statusStyles.good;
    return `
      <div class="card" style="border-left:3px solid ${st.border};background:${st.bg}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:8px">
          <div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--warm)">${sec.category}</div>
            <div style="font-size:13px;font-weight:600;color:var(--warm);margin-top:2px">${sec.headline}</div>
          </div>
          <span style="font-size:11px;padding:4px 12px;border-radius:50px;background:${st.badgeBg};color:${st.badgeColor};font-weight:600;white-space:nowrap">${st.badge}</span>
        </div>
        <p style="font-size:13.5px;color:var(--muted);line-height:1.75;margin-bottom:12px">${sec.analysis}</p>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${(sec.advice || []).map(tip => `
            <div style="display:flex;gap:10px;background:white;border-radius:11px;padding:10px 13px;align-items:flex-start">
              <span style="color:${st.border};font-size:14px;flex-shrink:0;margin-top:1px">→</span>
              <span style="font-size:13px;color:var(--warm);line-height:1.6">${tip}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');

  // Weekly goals
  const goals = result.weeklyGoals || [];
  document.getElementById('coachGoals').innerHTML = goals.map((g, i) => `
    <div style="display:flex;gap:14px;align-items:flex-start;padding:14px;background:white;border-radius:14px;margin-bottom:9px;border-left:3px solid var(--rose)">
      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--rose),var(--peach));display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">${g.icon || (i + 1)}</div>
      <div>
        <div style="font-weight:600;font-size:13.5px;color:var(--warm);margin-bottom:3px">${g.goal}</div>
        <div style="font-size:12.5px;color:var(--muted);line-height:1.6">${g.why}</div>
      </div>
    </div>`).join('');

  // Motivational message
  if (result.motivationalMessage) {
    document.getElementById('coachMotivationText').textContent = result.motivationalMessage;
  }

  // Scroll to report
  document.getElementById('coachReport').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════
// SAVE / HISTORY
// ═══════════════════════════════════════════
let lastReport = null;

async function saveReportToSupabase(result, data) {
  const supaRef = window.supa;
  const userRef = window.user;
  if (!supaRef || !userRef) return;

  lastReport = { result, data, savedAt: new Date().toISOString() };

  // Save to user_profile as latest_coach_report jsonb
  // (No new table needed — store in profile)
  try {
    await supaRef.from('user_profile').update({
      latest_coach_report: {
        week: data.currentWeek,
        score: result.overallScore,
        generated_at: new Date().toISOString(),
        summary: result.weekSummary,
        goals: result.weeklyGoals,
      }
    }).eq('id', userRef.id);
  } catch (e) {
    // Column might not exist — add it in Supabase SQL editor:
    // alter table user_profile add column if not exists latest_coach_report jsonb;
    console.warn('Could not save report to Supabase. Run: ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS latest_coach_report jsonb;');
  }

  // Also save to localStorage for history
  const history = JSON.parse(localStorage.getItem('mc_coach_history') || '[]');
  history.unshift({
    week: data.currentWeek,
    score: result.overallScore,
    summary: result.weekSummary,
    date: new Date().toLocaleDateString('hi-IN'),
    goals: result.weeklyGoals?.map(g => g.goal) || [],
  });
  if (history.length > 10) history.pop(); // keep last 10
  localStorage.setItem('mc_coach_history', JSON.stringify(history));
  loadPastReports();
}

async function saveReport() {
  if (!lastReport) return;
  // Trigger print as PDF
  printReport();
  showCoachToast('✅ Report saved!');
}

function printReport() {
  const content = document.getElementById('coachReport')?.innerHTML || '';
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <title>MamaCare AI Coach Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
    <style>
      body{font-family:'DM Sans',sans-serif;padding:24px;color:#4a2c2a;max-width:720px;margin:0 auto}
      .btn,.no-print{display:none}
      h2{font-family:'Cormorant Garamond',serif}
      @media print{.btn{display:none}}
    </style>
    </head><body>
    <h2 style="font-family:'Cormorant Garamond',serif;margin-bottom:4px">MamaCare AI Coach Report 🤖</h2>
    <p style="color:#9a7070;font-size:12px;margin-bottom:20px">Powered by Claude AI | mamacare.gyanam.shop</p>
    ${content}
    <script>window.onload=()=>setTimeout(()=>window.print(),500)</script>
    </body></html>`);
  w.document.close();
}

function loadPastReports() {
  const history = JSON.parse(localStorage.getItem('mc_coach_history') || '[]');
  const card = document.getElementById('pastReportsCard');
  const list = document.getElementById('pastReportsList');
  if (!card || !list) return;
  if (!history.length) { card.style.display = 'none'; return; }
  card.style.display = 'block';
  list.innerHTML = history.map((r, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:white;border-radius:13px;margin-bottom:8px">
      <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--rose),var(--peach));display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;flex-shrink:0">
        <div style="font-size:14px;font-weight:700;line-height:1">${r.score || '—'}</div>
        <div style="font-size:9px;opacity:.85">score</div>
      </div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:13px">Week ${r.week || '—'} — ${r.date}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px;line-height:1.5">${r.summary ? r.summary.slice(0, 80) + '...' : ''}</div>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
function showCoachToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#4a2c2a;color:white;padding:10px 22px;border-radius:50px;font-size:13px;font-weight:500;z-index:9999;animation:fadeUp .3s ease;white-space:nowrap';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Add spin animation if not already present
const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(styleEl);

// ═══════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════
window.COACH = {
  generate,
  saveReport,
  printReport,
  loadPreview: loadCoachPreview,
};

// Load preview when coach page becomes visible via nav
const origGoTo = window.MC?.goTo;
if (window.MC) {
  window.MC.goTo = function(id) {
    if (origGoTo) origGoTo(id);
    if (id === 'coach') setTimeout(loadCoachPreview, 100);
  };
}


// ═══════════════════════════════════════════════════════════
// SOURCE: app-extra.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare app-extra.js — v5 Additional Modules
 * Dashboard, Nutrition, Hospital Bag, Baby Names,
 * Medicine, Journal, Postpartum, Symptom Checker
 */

// ════════════════════════════════════════
// EXTEND MC with new modules
// ════════════════════════════════════════
(function extendMC() {

  // ── Storage helper (same prefix as app.js) ──
  const S = {
    get: (k, d = null) => { try { const v = localStorage.getItem('mc5_' + k); return v !== null ? JSON.parse(v) : d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem('mc5_' + k, JSON.stringify(v)); } catch {} }
  };
  function flash(id) { const e = document.getElementById(id); if (!e) return; e.classList.add('show'); setTimeout(() => e.classList.remove('show'), 1800); }

  // ════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════
  const MILESTONE_WEEKS = [
    { w: 4, text: 'Test positive! Journey shuru 🌱' },
    { w: 8, text: 'Pehla heartbeat scan 💗' },
    { w: 12, text: 'First trimester complete ✓' },
    { w: 16, text: 'Gender scan possible 👶' },
    { w: 20, text: 'Anatomy scan — halfway! 🎉' },
    { w: 24, text: 'Viability milestone ⭐' },
    { w: 28, text: 'Third trimester shuru 🌟' },
    { w: 32, text: 'Hospital bag pack karo 🏥' },
    { w: 36, text: 'Full term approaching 🌸' },
    { w: 40, text: 'Due date! 🎊' },
  ];

  function initDashboard() {
    const dueStr = S.get('dueDate');
    const due = dueStr ? new Date(dueStr) : null;
    const now = new Date();
    let week = 0, daysLeft = 0, pct = 0, trimester = 0;
    if (due && !isNaN(due)) {
      const start = new Date(due.getTime() - 280 * 86400000);
      const elapsed = Math.max(0, Math.floor((now - start) / 86400000));
      week = Math.min(40, Math.floor(elapsed / 7) + 1);
      daysLeft = Math.max(0, Math.round((due - now) / 86400000));
      pct = Math.min(100, Math.round(elapsed / 280 * 100));
      trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
    }

    const heroEl = document.getElementById('db-week-text');
    const dueEl = document.getElementById('db-due-text');
    const emojiEl = document.getElementById('db-emoji');
    const pbEl = document.getElementById('db-progress-bar');
    if (heroEl) {
      if (due) {
        const emojis = ['🌱','🌱','🌱','🌸','🌸','🌸','🌟','🌟','🌟','🎊'];
        emojiEl.textContent = emojis[Math.min(9, Math.floor(trimester * 3) - 1)] || '🌸';
        heroEl.textContent = `Week ${week} of 40 — ${trimester === 1 ? 'Pehli' : trimester === 2 ? 'Doosri' : 'Teesri'} Trimester`;
        dueEl.textContent = `Due Date: ${due.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })} (${daysLeft} days baaki)`;
        pbEl.innerHTML = `<div style="background:rgba(255,255,255,.3);border-radius:50px;height:8px;overflow:hidden;margin-top:14px"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--rose),var(--gold));border-radius:50px;transition:width 1s"></div></div><div style="font-size:11px;color:var(--muted);margin-top:4px">${pct}% journey complete</div>`;
      } else {
        emojiEl.textContent = '🌸';
        heroEl.textContent = 'MamaCare Mein Aapka Swagat Hai!';
        dueEl.innerHTML = '<a href="#" onclick="MC.navTo(\'due\')" style="color:var(--accent);font-size:13px">📅 Due date add karein →</a>';
      }
    }

    // Stats grid
    const sleepLogs = S.get('sleepLog', []);
    const weights = S.get('weights', []);
    const meds = S.get('medicines', []);
    const foodLog = S.get('foodLog', []);
    const water = S.get('water', 0);
    const todayMeds = meds.filter(m => m.taken).length;
    const statsEl = document.getElementById('db-stats-top');
    if (statsEl) statsEl.innerHTML = `
      <div class="stat"><div class="stat-v">${sleepLogs[0]?.hrs || '—'}h</div><div class="stat-l">Last Night Sleep</div></div>
      <div class="stat"><div class="stat-v">${weights.slice(-1)[0]?.kg || '—'}</div><div class="stat-l">Current Weight (kg)</div></div>
      <div class="stat"><div class="stat-v">${water}/10</div><div class="stat-l">Water Glasses</div></div>
      <div class="stat"><div class="stat-v">${todayMeds}/${meds.length}</div><div class="stat-l">Medicines Liye</div></div>`;

    // Quick actions
    const qaEl = document.getElementById('db-quick-actions');
    if (qaEl) qaEl.innerHTML = [
      { icon: '🍎', label: 'Log Food', page: 'nutrition' },
      { icon: '💊', label: 'Mark Meds', page: 'medicine' },
      { icon: '😴', label: 'Log Sleep', page: 'sleep' },
      { icon: '📸', label: 'Journal Entry', page: 'journal' },
    ].map(a => `<div onclick="MC.navTo('${a.page}')" style="background:white;border-radius:16px;padding:16px;text-align:center;cursor:pointer;transition:.2s;border:1.5px solid rgba(232,160,168,.2)" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'"><div style="font-size:28px;margin-bottom:6px">${a.icon}</div><div style="font-size:12.5px;font-weight:500;color:var(--warm)">${a.label}</div></div>`).join('');

    // Today summary
    const todayEl = document.getElementById('db-today');
    if (todayEl) {
      const todayFoods = foodLog.filter(f => f.date === new Date().toLocaleDateString('en-IN'));
      const totalCal = todayFoods.reduce((a, f) => a + f.cal, 0);
      todayEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:white;border-radius:12px;font-size:13px"><span>🍽️ Calories logged</span><strong>${totalCal} kcal</strong></div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:white;border-radius:12px;font-size:13px"><span>💧 Water intake</span><strong>${water}/10 glasses</strong></div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:white;border-radius:12px;font-size:13px"><span>💊 Medicines</span><strong>${todayMeds}/${meds.length} complete</strong></div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:white;border-radius:12px;font-size:13px"><span>😴 Last sleep</span><strong>${sleepLogs[0]?.hrs || '—'} hours</strong></div>
        </div>`;
    }

    // Milestones
    const remEl = document.getElementById('db-reminders');
    if (remEl && week > 0) {
      const upcoming = MILESTONE_WEEKS.filter(m => m.w >= week).slice(0, 4);
      remEl.innerHTML = upcoming.map(m => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:white;border-radius:12px;margin-bottom:7px;font-size:13px">
          <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--rose),var(--peach));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0">W${m.w}</div>
          <div>${m.text}</div>
        </div>`).join('');
    } else if (remEl) {
      remEl.innerHTML = '<p style="font-size:13px;color:var(--muted)">Due date add karein milestones dekhne ke liye.</p>';
    }
  }

  // ════════════════════════════════════════
  // NUTRITION
  // ════════════════════════════════════════
  let waterCount = S.get('water', 0);
  let foodLog = S.get('foodLog', []);
  let activeMeal = 'breakfast';

  const MEAL_PLANS = {
    1: {
      title: 'Pehli Trimester (Week 1–13)',
      focus: 'Folic Acid, Vitamin B6 (nausea ke liye), Iron, Zinc. Small frequent meals kyunki stomach sensitive hota hai.',
      meals: [
        { time: '🌅 Breakfast', items: ['Dalia with fruits (fiber + complex carbs)', 'Banana + whole wheat toast (B6 — nausea relief)', 'Warm ginger lemon water (HCG-related nausea)'] },
        { time: '🍪 Mid-morning', items: ['Handful of walnuts + 2 dates (Iron + healthy fats)', 'Fresh coconut water (electrolytes, nausea)'] },
        { time: '☀️ Lunch', items: ['Dal + brown rice + palak sabzi (Iron + Folate + Protein)', 'Curd (calcium + probiotics)', 'Salad with lemon (Vitamin C — iron absorption 3x)'] },
        { time: '🍵 Evening', items: ['Roasted makhana / chana (protein snack)', 'Ginger chai (limited — nausea + warmth)'] },
        { time: '🌙 Dinner', items: ['Khichdi / idli (easy to digest)', 'Vegetable soup (light, nutritious)', 'Warm milk with turmeric (calcium + anti-inflammatory)'] },
      ],
      avoid: ['Raw papaya & pineapple (oxytocin-like effect)', 'Unpasteurized dairy (listeria risk)', 'High mercury fish', 'Raw sprouts (bacterial risk)']
    },
    2: {
      title: 'Doosri Trimester (Week 14–27)',
      focus: 'Calcium, Vitamin D, Omega-3, Protein. Baby ki bones, brain, muscles develop ho rahi hain. Appetite improve hoti hai.',
      meals: [
        { time: '🌅 Breakfast', items: ['Eggs (2) + whole wheat toast (choline — brain development)', 'Fresh juice (orange/mosambi — Vitamin C)', 'Mixed nuts handful'] },
        { time: '🍪 Mid-morning', items: ['Greek yogurt with berries (calcium + probiotics)', 'Ragi ladoo / sattu (iron + calcium)'] },
        { time: '☀️ Lunch', items: ['Fish curry (salmon/rohu — Omega-3) OR tofu sabzi', 'Rajma / chhole (protein + iron)', 'Mixed vegetable salad', 'Brown rice'] },
        { time: '🍵 Evening', items: ['Avocado toast / peanut butter on roti (healthy fats)', 'Fresh fruit plate'] },
        { time: '🌙 Dinner', items: ['Paneer / chicken (protein)', 'Methi saag (iron + folate + calcium)', 'Multigrain roti', 'Sweet potato (beta-carotene, Vitamin A)'] },
      ],
      avoid: ['Junk food / processed snacks', 'Excessive sweets (gestational diabetes risk)', 'Caffeine >200mg/day', 'Smoked or cured meats']
    },
    3: {
      title: 'Teesri Trimester (Week 28–40)',
      focus: 'Vitamin K, Iron, Calcium, Fiber (constipation). Baby rapidly gaining weight. Stomach cramped — very small meals.',
      meals: [
        { time: '🌅 Breakfast', items: ['Oats with flaxseeds (omega-3 + fiber)', 'Dates (natural iron + labor preparation)', 'Warm milk (calcium)'] },
        { time: '🍪 Mid-morning', items: ['Dry fruits mix (iron, zinc, healthy fats)', 'Tender coconut water (electrolytes, hydration)'] },
        { time: '☀️ Lunch', items: ['Palak paneer (iron + calcium — excellent combination)', 'Dal makhani (protein + iron)', 'Small portion brown rice / 1-2 rotis', 'Curd / lassi'] },
        { time: '🍵 Evening', items: ['Whole fruit (not juice — fiber important)', 'Nuts + seeds trail mix'] },
        { time: '🌙 Dinner', items: ['Light khichdi or soup (digestion difficult now)', 'Boiled vegetables / salad', 'Avoid heavy dinners — heartburn worse at night'] },
      ],
      avoid: ['Gas-producing foods (beans, broccoli, cabbage) — baby pressing stomach', 'Spicy food (heartburn)', 'Large meals (stomach compressed)', 'Lying down right after eating']
    }
  };

  const AVOID_FOODS = [
    { icon: '🐟', name: 'High Mercury Fish', reason: 'Shark, swordfish, king mackerel — neural damage to baby' },
    { icon: '🥚', name: 'Raw/Undercooked Eggs', reason: 'Salmonella risk — mayonnaise, half-boiled eggs avoid' },
    { icon: '🥩', name: 'Raw/Rare Meat', reason: 'Toxoplasma, Listeria risk — always fully cook' },
    { icon: '🧀', name: 'Unpasteurized Cheese', reason: 'Soft cheeses (brie, camembert) — Listeria risk' },
    { icon: '🍵', name: 'Excess Caffeine', reason: '>200mg/day — miscarriage & low birth weight risk' },
    { icon: '🍹', name: 'Alcohol — Zero', reason: 'Fetal Alcohol Syndrome — koi safe amount nahi hai' },
    { icon: '🌿', name: 'Raw Sprouts', reason: 'Alfalfa, clover, mung sprouts — bacterial contamination' },
    { icon: '🍍', name: 'Papaya & Pineapple', reason: 'Especially raw/unripe — contractions trigger kar sakta hai' },
  ];

  function initNutrition() {
    // Water track
    renderWater();
    // Meal time buttons
    document.querySelectorAll('#mealTimeBtns .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#mealTimeBtns .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeMeal = btn.dataset.meal;
        renderFoodLog();
      });
    });
    // Tri meal tabs
    document.querySelectorAll('#triMealTabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#triMealTabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMealPlan(parseInt(btn.dataset.tri));
      });
    });
    renderFoodLog();
    renderMealPlan(1);
    // Avoid foods
    const avoidEl = document.getElementById('avoidFoods');
    if (avoidEl) avoidEl.innerHTML = AVOID_FOODS.map(f => `
      <div style="background:white;border-radius:13px;padding:12px;border-left:3px solid var(--accent)">
        <div style="font-weight:600;font-size:13px;margin-bottom:3px">${f.icon} ${f.name}</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.55">${f.reason}</div>
      </div>`).join('');
  }

  function renderWater() {
    const el = document.getElementById('waterTrack');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const g = document.createElement('span');
      g.style.cssText = `font-size:26px;cursor:pointer;transition:.2s;filter:${i < waterCount ? 'none' : 'grayscale(1)'};opacity:${i < waterCount ? '1' : '0.35'}`;
      g.textContent = '🥤';
      g.onclick = () => { waterCount = i < waterCount ? i : i + 1; S.set('water', waterCount); renderWater(); flash('nutri-save'); updateNutriBars(); };
      el.appendChild(g);
    }
    const msg = document.getElementById('waterMsg');
    if (msg) msg.textContent = waterCount >= 10 ? '🎉 Daily goal complete! Bahut achha!' : waterCount >= 6 ? `✅ ${waterCount}/10 — Achha progress!` : `💧 ${waterCount}/10 — ${10 - waterCount} glasses aur chahiye`;
  }

  function updateNutriBars() {
    const el = document.getElementById('nutriBars');
    if (!el) return;
    const todayCal = foodLog.filter(f => f.date === new Date().toLocaleDateString('en-IN')).reduce((a, f) => a + f.cal, 0);
    const calGoal = 2200;
    const calPct = Math.min(100, Math.round(todayCal / calGoal * 100));
    const wPct = Math.min(100, waterCount * 10);
    el.innerHTML = `
      <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:4px"><span>🔥 Calories</span><span>${todayCal} / ${calGoal} kcal</span></div><div style="height:8px;background:#f0e0e0;border-radius:50px;overflow:hidden"><div style="height:100%;width:${calPct}%;background:linear-gradient(90deg,var(--rose),var(--peach));border-radius:50px;transition:width .5s"></div></div></div>
      <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:4px"><span>💧 Water</span><span>${waterCount} / 10 glasses</span></div><div style="height:8px;background:#f0e0e0;border-radius:50px;overflow:hidden"><div style="height:100%;width:${wPct}%;background:linear-gradient(90deg,var(--blue),#4a98c4);border-radius:50px;transition:width .5s"></div></div></div>
      <p style="font-size:12px;color:var(--muted)">💡 Pregnancy mein ~300 extra calories chahiye hoti hain. 2nd & 3rd trimester mein protein 25g extra aur calcium 200mg extra needed hai.</p>`;
  }

  function renderFoodLog() {
    updateNutriBars();
    const list = document.getElementById('foodList');
    if (!list) return;
    const filtered = activeMeal === 'all' ? foodLog : foodLog.filter(f => f.meal === activeMeal);
    const today = filtered.filter(f => f.date === new Date().toLocaleDateString('en-IN'));
    if (today.length === 0) { list.innerHTML = `<p style="font-size:13px;color:var(--muted);text-align:center;padding:14px 0">Is meal mein kuch log nahi kiya. Upar se add karein!</p>`; return; }
    list.innerHTML = today.slice().reverse().map((f, i) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:white;border-radius:11px;margin-bottom:6px;font-size:13px">
        <span>${f.meal === 'breakfast' ? '🌅' : f.meal === 'lunch' ? '☀️' : f.meal === 'snack' ? '🍪' : '🌙'} ${f.name}</span>
        <span style="display:flex;align-items:center;gap:8px"><span style="font-size:12px;color:var(--muted)">${f.cal} cal</span><button onclick="MC.deleteFood(${foodLog.indexOf(f)})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;line-height:1">×</button></span>
      </div>`).join('');
  }

  function renderMealPlan(tri) {
    const plan = MEAL_PLANS[tri];
    if (!plan) return;
    const el = document.getElementById('mealPlanContent');
    if (!el) return;
    el.innerHTML = `
      <div style="background:rgba(232,160,168,.08);border-radius:12px;padding:12px 14px;margin-bottom:14px;font-size:13px;color:var(--muted);line-height:1.7"><strong style="color:var(--accent)">Focus:</strong> ${plan.focus}</div>
      ${plan.meals.map(m => `
        <div style="margin-bottom:14px">
          <div style="font-weight:600;font-size:13.5px;color:var(--warm);margin-bottom:7px">${m.time}</div>
          ${m.items.map(item => `<div style="font-size:13px;color:var(--muted);padding:5px 0 5px 14px;border-left:2px solid var(--blush);margin-bottom:4px;line-height:1.5">${item}</div>`).join('')}
        </div>`).join('')}
      <div style="background:#fff5f5;border-radius:12px;padding:12px 14px;margin-top:10px">
        <div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:6px">⚠️ Avoid this trimester:</div>
        ${plan.avoid.map(a => `<div style="font-size:12.5px;color:var(--muted);padding:2px 0">• ${a}</div>`).join('')}
      </div>`;
  }

  function addFood() {
    const name = document.getElementById('foodInput').value.trim();
    if (!name) return;
    const cal = parseInt(document.getElementById('foodCalSel').value);
    foodLog.push({ name, cal, meal: activeMeal, date: new Date().toLocaleDateString('en-IN'), ts: Date.now() });
    S.set('foodLog', foodLog);
    document.getElementById('foodInput').value = '';
    renderFoodLog();
    flash('nutri-save');
  }

  function deleteFood(i) { foodLog.splice(i, 1); S.set('foodLog', foodLog); renderFoodLog(); flash('nutri-save'); }

  // ════════════════════════════════════════
  // HOSPITAL BAG
  // ════════════════════════════════════════
  const BAG_CATEGORIES = {
    'Maa ke Liye 👩': [
      ['Maternity nightgown / kurta (2-3 sets)', true],
      ['Comfortable underwear (3-4 pairs, dark colored)', true],
      ['Non-slip chappal / socks', true],
      ['Nursing bra (2)', true],
      ['Toiletries — soap, shampoo, toothbrush, toothpaste', true],
      ['Sanitary pads — extra thick, postpartum (10-15)', true],
      ['Breast pads (in case breastfeeding starts)', false],
      ['Personal items — hair tie, lip balm', false],
      ['Phone charger + power bank', true],
      ['Earphones / music playlist prepared', false],
      ['Comfortable pillow (from home)', false],
      ['Snacks — dry fruits, crackers, nimbu candy', true],
      ['Water bottle (large, 1L)', true],
      ['Book / magazine / downloaded movies', false],
    ],
    'Baby ke Liye 👶': [
      ['Onesies / jhabla (5-6 sets, newborn size)', true],
      ['Soft blanket / swaddle cloth (2-3)', true],
      ['Baby cap (2-3)', true],
      ['Socks (3-4 pairs)', true],
      ['Mittens (2-3 pairs)', true],
      ['Diapers (newborn size, 15-20)', true],
      ['Baby wipes (unscented, sensitive)', true],
      ['Baby lotion / oil (gentle, fragrance-free)', false],
      ['Muslin swaddle cloths (2-3)', true],
      ['Going home outfit (special one!)', true],
      ['Baby nail file', false],
      ['Baby car seat (for going home)', true],
    ],
    'Documents 📄': [
      ['Aadhar card (original + 2 copies)', true],
      ['Health insurance card + policy number', true],
      ['Previous scan reports & blood tests', true],
      ["Doctor's name, number & hospital contact", true],
      ['Blood group card', true],
      ['Birth plan copy (3 copies)', false],
      ['Emergency contact list (written)', true],
      ['Hospital registration form (if pre-filled)', true],
    ],
    'Partner ke Liye 👨': [
      ['Change of clothes (2 days worth)', true],
      ['Toiletries', true],
      ['Snacks & water', true],
      ['Cash + cards', true],
      ['Camera — fully charged', true],
      ['Comfortable pillow', false],
      ['List of people to call after delivery', true],
    ],
  };

  let bagChecked = S.get('bagChecked', {});
  let customBagItems = S.get('customBagItems', []);

  function initBag() {
    const catSel = document.getElementById('customBagCatSel');
    if (catSel) catSel.innerHTML = Object.keys(BAG_CATEGORIES).map(c => `<option>${c}</option>`).join('');
    // Tab buttons
    const tabRow = document.getElementById('bagCatTabs');
    if (tabRow) {
      const cats = [...Object.keys(BAG_CATEGORIES), 'All'];
      tabRow.innerHTML = cats.map((c, i) => `<button class="tab-btn${i === cats.length - 1 ? '' : i === 0 ? ' active' : ''}" data-bagcat="${c}">${c === 'All' ? '📦 All' : c}</button>`).join('');
      tabRow.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          tabRow.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderBag(btn.dataset.bagcat);
        });
      });
    }
    renderBag(Object.keys(BAG_CATEGORIES)[0]);
  }

  function renderBag(filterCat = null) {
    const allCats = { ...BAG_CATEGORIES };
    customBagItems.forEach(i => { if (!allCats[i.cat]) allCats[i.cat] = []; allCats[i.cat].push([i.name, false]); });
    const allKeys = Object.keys(allCats);
    const total = allKeys.reduce((a, k) => a + allCats[k].length, 0);
    const done = allKeys.reduce((a, k) => a + allCats[k].filter(([name]) => bagChecked[k + '::' + name]).length, 0);
    document.getElementById('bagPct').textContent = total ? Math.round(done / total * 100) + '%' : '0%';
    document.getElementById('bagBar').style.width = total ? Math.round(done / total * 100) + '%' : '0%';
    document.getElementById('bagCount').textContent = `${done} / ${total} packed`;
    const container = document.getElementById('bagContainer');
    if (!container) return;
    const catsToShow = (!filterCat || filterCat === 'All') ? allKeys : allKeys.filter(k => k === filterCat);
    container.innerHTML = catsToShow.map(cat => {
      const items = allCats[cat];
      const catDone = items.filter(([name]) => bagChecked[cat + '::' + name]).length;
      return `<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-weight:600;font-size:14px;color:var(--warm)">${cat}</div>
          <div style="font-size:12px;color:var(--muted)">${catDone}/${items.length}</div>
        </div>
        ${items.map(([name, essential]) => {
          const key = cat + '::' + name;
          const checked = !!bagChecked[key];
          return `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:white;border-radius:10px;margin-bottom:5px;cursor:pointer;transition:.2s;opacity:${checked ? '.65' : '1'}" onclick="MC.toggleBagItem('${key}',this)">
            <input type="checkbox" ${checked ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer;flex-shrink:0" onclick="event.stopPropagation();MC.toggleBagItem('${key}',this.closest('[onclick]'))"/>
            <span style="font-size:13px;${checked ? 'text-decoration:line-through;color:var(--muted)' : 'color:var(--warm)'}">${name}</span>
            ${essential ? '<span style="margin-left:auto;font-size:10px;padding:2px 8px;background:#fff3e0;color:#e65100;border-radius:50px;font-weight:600">Must</span>' : ''}
          </div>`;
        }).join('')}
      </div>`;
    }).join('');
  }

  function toggleBagItem(key, el) {
    bagChecked[key] = !bagChecked[key];
    S.set('bagChecked', bagChecked);
    const tabRow = document.getElementById('bagCatTabs');
    const activeTab = tabRow ? tabRow.querySelector('.tab-btn.active')?.dataset.bagcat : null;
    renderBag(activeTab);
    flash('bag-save');
  }

  function addCustomBagItem() {
    const name = document.getElementById('customBagItem').value.trim();
    const cat = document.getElementById('customBagCatSel')?.value || Object.keys(BAG_CATEGORIES)[0];
    if (!name) return;
    customBagItems.push({ name, cat });
    S.set('customBagItems', customBagItems);
    document.getElementById('customBagItem').value = '';
    renderBag(cat);
    flash('bag-save');
  }

  function resetBag() {
    if (!confirm('Sab items uncheck kar dein?')) return;
    bagChecked = {};
    S.set('bagChecked', bagChecked);
    renderBag();
  }

  // ════════════════════════════════════════
  // BABY NAMES
  // ════════════════════════════════════════
  const NAME_DB = [
    // Boys - Hindu
    { n: 'Aarav', m: 'Peaceful, calm', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Vivaan', m: 'Full of life, sunrise', o: 'Sanskrit', g: 'boy', r: ['hindu', 'modern'] },
    { n: 'Arjun', m: 'Bright, clear, white', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Reyansh', m: 'Ray of light, part of Vishnu', o: 'Sanskrit', g: 'boy', r: ['hindu', 'modern'] },
    { n: 'Aryan', m: 'Noble, honourable', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Dev', m: 'Divine, godlike', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Ishaan', m: 'Sun, gift of Shiva', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Advaith', m: 'Unique, non-dual', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Arnav', m: 'Ocean, sea', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Dhruv', m: 'Polar star, firm, stable', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Kabir', m: 'Great, powerful, wise', o: 'Arabic/Hindi', g: 'boy', r: ['hindu', 'muslim'] },
    { n: 'Laksh', m: 'Aim, target, Lakshmi', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Neel', m: 'Blue, sapphire, sky', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Om', m: 'Sacred sound, universe', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Rudra', m: 'Form of Shiva, powerful', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Shaurya', m: 'Bravery, courage', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    { n: 'Vedant', m: 'Knowledge of Vedas, end of knowledge', o: 'Sanskrit', g: 'boy', r: ['hindu'] },
    // Boys - Muslim
    { n: 'Ayaan', m: 'Gift of God, time, era', o: 'Arabic', g: 'boy', r: ['muslim'] },
    { n: 'Zayan', m: 'Beauty, grace, adornment', o: 'Arabic', g: 'boy', r: ['muslim', 'modern'] },
    { n: 'Rayan', m: 'Gates of paradise', o: 'Arabic', g: 'boy', r: ['muslim'] },
    { n: 'Arham', m: 'Most merciful', o: 'Arabic', g: 'boy', r: ['muslim'] },
    { n: 'Ibrahim', m: 'Father of many, Abraham', o: 'Arabic', g: 'boy', r: ['muslim'] },
    { n: 'Mikail', m: 'Who is like God', o: 'Arabic', g: 'boy', r: ['muslim'] },
    { n: 'Yusuf', m: 'God increases, Joseph', o: 'Arabic', g: 'boy', r: ['muslim'] },
    { n: 'Zaid', m: 'Growth, increase, abundance', o: 'Arabic', g: 'boy', r: ['muslim'] },
    // Boys - Sikh
    { n: 'Gurpreet', m: 'Beloved of the Guru', o: 'Punjabi', g: 'boy', r: ['sikh'] },
    { n: 'Harjot', m: "God's light", o: 'Punjabi', g: 'boy', r: ['sikh'] },
    { n: 'Veer', m: 'Brave, hero', o: 'Sanskrit', g: 'boy', r: ['sikh', 'hindu'] },
    { n: 'Japneet', m: 'One who meditates on God', o: 'Punjabi', g: 'boy', r: ['sikh'] },
    // Girls - Hindu
    { n: 'Anaya', m: 'Completely free, gift of God', o: 'Sanskrit', g: 'girl', r: ['hindu', 'modern'] },
    { n: 'Aarohi', m: 'Rising, musical scale', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Ahana', m: 'Inner light, dawn, immortal', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Diya', m: 'Lamp, divine light', o: 'Sanskrit', g: 'girl', r: ['hindu', 'modern'] },
    { n: 'Navya', m: 'Young, worthy of praise, new', o: 'Sanskrit', g: 'girl', r: ['hindu', 'modern'] },
    { n: 'Avni', m: 'Earth, nature', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Ishita', m: 'Desired, one who has power', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Kavya', m: 'Poem, poetry, with the qualities of a poem', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Mahi', m: 'Earth, heaven and earth united', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Nisha', m: 'Night, dream', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Priya', m: 'Beloved, dear', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Siya', m: 'Sita, white, pure', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Tvisha', m: 'Bright, brilliant light', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    { n: 'Vrinda', m: 'Tulsi plant, Radha', o: 'Sanskrit', g: 'girl', r: ['hindu'] },
    // Girls - Muslim
    { n: 'Zara', m: 'Bright as dawn, princess, flower', o: 'Arabic', g: 'girl', r: ['muslim', 'modern'] },
    { n: 'Inaya', m: 'Kindness, care of God, concern', o: 'Arabic', g: 'girl', r: ['muslim'] },
    { n: 'Aisha', m: 'Alive, prosperous, living', o: 'Arabic', g: 'girl', r: ['muslim'] },
    { n: 'Pari', m: 'Angel, fairy, beautiful', o: 'Persian', g: 'girl', r: ['muslim', 'modern'] },
    { n: 'Aleena', m: 'Soft, delicate, beautiful', o: 'Arabic', g: 'girl', r: ['muslim', 'modern'] },
    { n: 'Fatima', m: 'Captivating, abstaining', o: 'Arabic', g: 'girl', r: ['muslim'] },
    { n: 'Hana', m: 'Happiness, bliss', o: 'Arabic', g: 'girl', r: ['muslim'] },
    { n: 'Noor', m: 'Light, divine light', o: 'Arabic', g: 'girl', r: ['muslim', 'modern'] },
    // Girls - Sikh
    { n: 'Simran', m: "God's remembrance, meditation", o: 'Punjabi', g: 'girl', r: ['sikh'] },
    { n: 'Harleen', m: 'Absorbed in God', o: 'Punjabi', g: 'girl', r: ['sikh'] },
    { n: 'Manpreet', m: 'One whose heart is fulfilled by God', o: 'Punjabi', g: 'girl', r: ['sikh'] },
    // Modern / Unisex
    { n: 'Arya', m: 'Noble, honoured, great', o: 'Sanskrit', g: 'unisex', r: ['modern', 'hindu'] },
    { n: 'Kiran', m: 'Ray of light, beam', o: 'Sanskrit', g: 'unisex', r: ['hindu', 'sikh'] },
    { n: 'Reva', m: 'Star, swift, rain', o: 'Sanskrit', g: 'unisex', r: ['hindu', 'modern'] },
    { n: 'Myra', m: 'Sweet, admirable, beloved', o: 'Modern', g: 'girl', r: ['modern'] },
    { n: 'Kiara', m: 'Bright, clear, famous', o: 'Modern', g: 'girl', r: ['modern'] },
    { n: 'Aarav', m: 'Peaceful', o: 'Modern', g: 'boy', r: ['modern'] },
    { n: 'Rumi', m: 'Beauty, poet (after Rumi)', o: 'Persian', g: 'unisex', r: ['modern'] },
    { n: 'Vihaan', m: 'Dawn, morning, beginning', o: 'Sanskrit', g: 'boy', r: ['hindu', 'modern'] },
  ];

  const NAME_FILTERS = [
    { key: 'all', label: 'Sabhi' },
    { key: 'boy', label: '👦 Boy' },
    { key: 'girl', label: '👧 Girl' },
    { key: 'unisex', label: '🌟 Unisex' },
    { key: 'hindu', label: '🕉️ Hindu' },
    { key: 'muslim', label: '☪️ Muslim' },
    { key: 'sikh', label: '🪯 Sikh' },
    { key: 'modern', label: '✨ Modern' },
  ];

  let nameFilter = 'all';
  let savedNames = S.get('savedNames', []);

  function initNames() {
    const filterEl = document.getElementById('nameFilterBtns');
    if (!filterEl) return;
    filterEl.innerHTML = NAME_FILTERS.map(f => `<button class="tab-btn${f.key === 'all' ? ' active' : ''}" data-nf="${f.key}">${f.label}</button>`).join('');
    filterEl.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        nameFilter = btn.dataset.nf;
        renderNames();
      });
    });
    renderNames();
    renderSavedNames();
  }

  function renderNames() {
    const q = (document.getElementById('nameSearch')?.value || '').toLowerCase();
    const filtered = NAME_DB.filter(n => {
      const matchQ = !q || n.n.toLowerCase().includes(q) || n.m.toLowerCase().includes(q) || n.o.toLowerCase().includes(q);
      const matchF = nameFilter === 'all' || n.g === nameFilter || n.r.includes(nameFilter);
      return matchQ && matchF;
    });
    const grid = document.getElementById('nameGrid');
    if (!grid) return;
    if (!filtered.length) { grid.innerHTML = '<p style="color:var(--muted);font-size:13px;padding:14px;grid-column:1/-1;text-align:center">Koi naam nahi mila.</p>'; return; }
    grid.innerHTML = filtered.map(n => {
      const saved = savedNames.includes(n.n);
      return `<div onclick="MC.toggleSaveName('${n.n}',this)" style="background:white;border-radius:16px;padding:15px;border:1.5px solid ${saved ? 'var(--accent)' : 'rgba(232,160,168,.15)'};cursor:pointer;transition:.22s;position:relative" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
        <div style="position:absolute;top:10px;right:10px;font-size:18px">${saved ? '💗' : '🤍'}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;color:var(--warm);margin-bottom:3px">${n.n}</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:6px">${n.m}</div>
        <span class="pill ${n.g === 'boy' ? 'pill-b' : n.g === 'girl' ? 'pill-p' : 'pill-o'}">${n.g}</span>
        <span class="pill pill-g">${n.o}</span>
      </div>`;
    }).join('');
  }

  function toggleSaveName(name) {
    const i = savedNames.indexOf(name);
    if (i > -1) savedNames.splice(i, 1); else savedNames.push(name);
    S.set('savedNames', savedNames);
    flash('names-save');
    renderNames();
    renderSavedNames();
  }

  function renderSavedNames() {
    const card = document.getElementById('savedNamesCard');
    const list = document.getElementById('savedNamesList');
    if (!card || !list) return;
    card.style.display = savedNames.length ? 'block' : 'none';
    list.innerHTML = savedNames.map(n => `<div style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:white;border-radius:50px;border:1.5px solid var(--blush);font-size:13px;font-weight:500">💗 ${n}<button onclick="MC.removeSavedName('${n}')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;line-height:1;margin-left:2px">×</button></div>`).join('');
  }

  function removeSavedName(n) { savedNames = savedNames.filter(x => x !== n); S.set('savedNames', savedNames); renderNames(); renderSavedNames(); }

  // ════════════════════════════════════════
  // MEDICINE
  // ════════════════════════════════════════
  let medicines = S.get('medicines', []);

  const SUPP_GUIDE = [
    { icon: '💊', name: 'Folic Acid (400-800mcg)', when: 'Pre-conception se week 12 tak', why: 'Neural tube defects 70% tak prevent karta hai — spina bifida, anencephaly' },
    { icon: '🍊', name: 'Iron + Vitamin C', when: 'Throughout pregnancy, especially 2nd & 3rd tri', why: 'Anaemia prevent karta hai. Vitamin C ke saath lena iron absorption 3x badhata hai' },
    { icon: '🦴', name: 'Calcium (1000mg/day)', when: '2nd trimester se', why: "Baby ki bones aur teeth ke liye. Maa ki bones se calcium steal nahi hoga" },
    { icon: '☀️', name: 'Vitamin D (600-800 IU)', when: 'Throughout pregnancy', why: 'Calcium absorption ke liye essential. Deficiency: preeclampsia, gestational diabetes risk' },
    { icon: '🐟', name: 'DHA/Omega-3 (200mg)', when: '2nd trimester se', why: "Baby ka brain development — IQ aur vision ke liye critical" },
    { icon: '🌿', name: 'Magnesium (350mg)', when: 'As needed, especially 3rd tri', why: 'Leg cramps prevent karta hai, sleep improve karta hai, preterm labor risk reduce' },
    { icon: '🥛', name: 'Prenatal Multivitamin', when: 'Throughout pregnancy', why: 'Overall nutritional insurance — especially important agar diet incomplete ho' },
  ];

  function initMedicine() {
    const guideEl = document.getElementById('suppGuide');
    if (guideEl) guideEl.innerHTML = SUPP_GUIDE.map(s => `
      <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--blush);align-items:flex-start">
        <span style="font-size:24px;flex-shrink:0">${s.icon}</span>
        <div><div style="font-weight:600;font-size:13.5px;color:var(--warm);margin-bottom:2px">${s.name}</div><div style="font-size:12px;color:var(--accent);margin-bottom:3px">⏰ ${s.when}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.6">${s.why}</div></div>
      </div>`).join('') + '<p style="font-size:12px;color:var(--muted);margin-top:12px;padding:10px;background:rgba(220,80,80,.05);border-radius:10px">⚠️ Koi bhi supplement apne doctor ki salah ke bina mat lo — overdose bhi harmful ho sakta hai.</p>';
    // Reset taken if new day
    const today = new Date().toDateString();
    if (S.get('medDate', '') !== today) { medicines.forEach(m => m.taken = false); S.set('medicines', medicines); S.set('medDate', today); }
    renderMeds();
  }

  function renderMeds() {
    const taken = medicines.filter(m => m.taken).length;
    const total = medicines.length;
    const pct = total ? Math.round(taken / total * 100) : 0;
    const statsEl = document.getElementById('medStats');
    if (statsEl) statsEl.innerHTML = `
      <div class="stat"><div class="stat-v">${taken}</div><div class="stat-l">Aaj Liya</div></div>
      <div class="stat"><div class="stat-v">${total - taken}</div><div class="stat-l">Baaki Hai</div></div>
      <div class="stat"><div class="stat-v">${pct}%</div><div class="stat-l">Complete</div></div>`;
    const pb = document.getElementById('medProgressBar');
    if (pb) pb.style.width = pct + '%';
    const listEl = document.getElementById('medList');
    if (!listEl) return;
    if (!medicines.length) { listEl.innerHTML = '<p style="font-size:13px;color:var(--muted);padding:10px 0">Abhi koi medicine add nahi ki. Neeche button se add karein.</p>'; return; }
    listEl.innerHTML = medicines.map((m, i) => `
      <div style="display:flex;align-items:center;gap:12px;background:white;border-radius:14px;padding:14px;margin-bottom:9px">
        <div style="width:44px;height:44px;border-radius:12px;background:${m.taken ? '#e8f5e9' : '#fce8e8'};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${m.icon}</div>
        <div style="flex:1"><div style="font-weight:600;font-size:13.5px;color:var(--warm)">${m.name}</div><div style="font-size:12px;color:var(--muted);margin-top:2px">${m.dose}${m.notes ? ' • ' + m.notes : ''}</div><div style="font-size:11.5px;color:var(--accent);margin-top:2px">⏰ ${m.time}</div></div>
        <div style="display:flex;gap:6px;align-items:center">
          <button onclick="MC.toggleMedTaken(${i})" style="padding:7px 14px;border-radius:50px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid ${m.taken ? 'var(--green)' : 'var(--blush)'};background:${m.taken ? 'var(--green)' : 'white'};color:${m.taken ? 'white' : 'var(--muted)'};font-family:'DM Sans',sans-serif;transition:.2s">${m.taken ? '✓ Liya' : 'Liya?'}</button>
          <button onclick="MC.deleteMed(${i})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:20px;line-height:1">×</button>
        </div>
      </div>`).join('');
  }

  function toggleMedTaken(i) { medicines[i].taken = !medicines[i].taken; S.set('medicines', medicines); renderMeds(); flash('med-save'); }
  function deleteMed(i) { if (!confirm('Delete karein?')) return; medicines.splice(i, 1); S.set('medicines', medicines); renderMeds(); }
  function toggleAddMedForm() { const f = document.getElementById('addMedForm'); if (f) f.style.display = f.style.display === 'none' ? 'block' : 'none'; }
  function addMedicine() {
    const name = document.getElementById('medName').value.trim();
    if (!name) { alert('Medicine ka naam daalo.'); return; }
    medicines.push({ name, dose: document.getElementById('medDose').value || '1 tablet', time: document.getElementById('medTime').value || '08:00', icon: document.getElementById('medIcon').value, notes: document.getElementById('medNotes').value, taken: false });
    S.set('medicines', medicines);
    ['medName', 'medDose', 'medNotes'].forEach(id => { const e = document.getElementById(id); if (e) e.value = ''; });
    toggleAddMedForm();
    renderMeds();
    flash('med-save');
  }

  // ════════════════════════════════════════
  // JOURNAL
  // ════════════════════════════════════════
  let journalEntries = S.get('journalEntries', []);
  let selectedJMood = '😊';
  let photoData = null;

  function initJournal() {
    const dateEl = document.getElementById('jDate');
    if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
    document.querySelectorAll('.jmood').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.jmood').forEach(e => { e.style.borderColor = 'transparent'; e.style.background = 'transparent'; });
        el.style.borderColor = 'var(--rose)';
        el.style.background = 'var(--blush)';
        selectedJMood = el.dataset.jm;
      });
    });
    renderJournal();
  }

  function handlePhoto(input) {
    const file = input.files[0];
    if (!file) return;
    // Store file reference only — no base64 in memory
    window._extraPhotoFile = file;
    const url = URL.createObjectURL(file);
    const prev = document.getElementById('photoPreview');
    if (prev) { prev.src = url; prev.style.display = 'block'; }
  }

  async function saveJournalEntry() {
    const text = document.getElementById('jText').value.trim();
    const week = document.getElementById('jWeek').value;
    const date = document.getElementById('jDate').value;
    const file = window._extraPhotoFile;
    if (!text && !file) { alert('Kuch likhein ya photo add karein!'); return; }

    // Upload photo to cloud (compressed, no base64 localStorage)
    let photoUrl = null;
    if (file) {
      if (window.uploadJournalPhoto) {
        photoUrl = await window.uploadJournalPhoto(file);
      } else if (window.uploadPhotoToSupabase) {
        photoUrl = await window.uploadPhotoToSupabase(file, week, date);
      }
      // Fallback: object URL (session only, not persisted)
      if (!photoUrl) photoUrl = URL.createObjectURL(file);
    }

    // Save entry WITHOUT photo blob — only URL reference
    const entry = {
      text, week: week || '?',
      date: date || new Date().toISOString().split('T')[0],
      mood: selectedJMood,
      photo: photoUrl,  // URL only, not base64
      id: Date.now(),
    };

    // Load existing entries, strip any old base64 photos to free storage
    let existing = [];
    try {
      existing = S.get('journalEntries', []).map(e => ({
        ...e,
        photo: e.photo && e.photo.startsWith('data:') ? null : e.photo, // strip base64
      }));
    } catch(err) { existing = []; }

    journalEntries = [entry, ...existing];
    try { S.set('journalEntries', journalEntries); } catch(err) {
      // Storage full — keep only last 20 entries without photos
      journalEntries = journalEntries.slice(0, 20).map(e => ({ ...e, photo: null }));
      try { S.set('journalEntries', journalEntries); } catch(e2) { /* ignore */ }
    }

    document.getElementById('jText').value = '';
    document.getElementById('jWeek').value = '';
    window._extraPhotoFile = null;
    const prev = document.getElementById('photoPreview');
    if (prev) { prev.style.display = 'none'; prev.src = ''; }
    const upload = document.getElementById('photoUpload');
    if (upload) upload.value = '';
    flash('journal-save');
    renderJournal();
  }

  function deleteJournalEntry(id) {
    if (!confirm('Entry delete karein?')) return;
    journalEntries = journalEntries.filter(e => e.id !== id);
    S.set('journalEntries', journalEntries);
    renderJournal();
  }

  function renderJournal() {
    const el = document.getElementById('journalEntries');
    if (!el) return;
    if (!journalEntries.length) { el.innerHTML = '<p style="text-align:center;color:var(--muted);font-size:13.5px;padding:24px">Abhi koi entry nahi. Upar form se pehli yaad likho! 🌸</p>'; return; }
    el.innerHTML = journalEntries.map(e => `
      <div style="background:white;border-radius:18px;padding:18px;margin-bottom:12px;border:1.5px solid rgba(232,160,168,.18)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:${e.text || e.photo ? '10px' : '0'}">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:22px">${e.mood}</span>
            <span style="font-size:12px;color:var(--muted)">${formatJDate(e.date)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            ${e.week !== '?' ? `<span style="font-size:11px;background:var(--blush);color:var(--accent);padding:3px 10px;border-radius:50px;font-weight:500">Week ${e.week}</span>` : ''}
            <button onclick="MC.deleteJournalEntry(${e.id})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;line-height:1">🗑️</button>
          </div>
        </div>
        ${e.text ? `<p style="font-size:13.5px;line-height:1.75;color:var(--warm)">${e.text.replace(/\n/g, '<br>')}</p>` : ''}
        ${e.photo ? `<div style="margin-top:10px;border-radius:12px;overflow:hidden"><img src="${e.photo}" style="max-width:100%;max-height:220px;object-fit:cover;border-radius:12px;display:block"/></div>` : ''}
      </div>`).join('');
  }

  function formatJDate(d) {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return d; }
  }

  // ════════════════════════════════════════
  // POSTPARTUM
  // ════════════════════════════════════════
  const PP_WEEKS = {
    1: {
      title: 'Week 1–2: Acute Recovery',
      sections: [
        { icon: '🩹', title: 'Physical Recovery', items: ['Vaginal birth: Perineal soreness, swelling normal. Ice packs first 24 hrs, warm sitz bath after.', 'C-section: Incision care — keep dry, no heavy lifting (>4kg). Wound healing 6-8 weeks.', 'Lochia (vaginal bleeding): Bright red first few days, then pink, then yellow-white. 4-6 weeks total.', 'Uterus cramping (afterpains): Especially during breastfeeding — uterus contracting back to size.', 'Constipation common: High fiber diet, lots of water, stool softeners if needed.', 'Episiotomy care: Salt water sitz baths, keep area clean and dry.'] },
        { icon: '🤱', title: 'Breastfeeding Start', items: ['First milk is colostrum — thick, yellowish, GOLD. Baby ko sirf yahi chahiye pehle 2-3 days.', 'Milk "comes in" day 3-5 — breast engorgement, tenderness normal.', 'Latch pain initially normal, but sharp pain with each feeding — lactation consultant se milein.', 'Feed on demand — usually 8-12 times/24 hrs newborn mein.'] },
        { icon: '😴', title: 'Sleep & Rest', items: ['Sleep deprivation real struggle hai — maximum impact first 2 weeks.', '"Sleep when baby sleeps" — practical advice. Visitors limit karein.', 'Night sweats common — hormonal. Normal.', 'Rest prioritize karein — visitors, housework baad mein.'] },
      ]
    },
    2: {
      title: 'Week 3–6: Gradual Recovery',
      sections: [
        { icon: '💪', title: 'Physical Changes', items: ['Bleeding usually stops or becomes very light by week 3-4.', 'Energy slowly improving — but fatigue still significant.', 'Hair loss starts around week 3 (telogen effluvium) — normal, peaks at 3-4 months.', 'C-section scar itching as it heals — normal. Massage scar gently from week 6.', 'Sex: Medical clearance at 6-week checkup. But no pressure — readiness varies greatly.'] },
        { icon: '🧠', title: 'Emotional Adjustment', items: ['Baby blues (day 3-14) vs Postpartum Depression — yeh important distinction hai.', 'Identity shift — "matrescence" — completely normal.', 'Partner relationship changes — communication essential.', 'Guilt about not "loving it all" — completely valid. Adjustment takes time.'] },
        { icon: '🤸', title: 'Gentle Exercise', items: ['Week 4-6: Pelvic floor exercises (kegel) resume.', 'Week 6 clearance: Walking, light stretching.', 'No running or high-impact for 12 weeks minimum.', 'Diastasis recti check at 6-week appointment.'] },
      ]
    },
    3: {
      title: 'Week 6–12: Finding Routine',
      sections: [
        { icon: '✅', title: '6-Week Checkup — Essential', items: ['Physical exam: Uterus, incision/perineum healing.', 'Mental health screen (Edinburgh Postnatal Depression Scale).', 'Contraception discussion — yes, fertility can return before first period.', 'Blood pressure check (postpartum preeclampsia possible up to 6 weeks).', 'Discuss any concerns — no question too small.'] },
        { icon: '🏃', title: 'Returning to Exercise', items: ['Green light from doctor: gradually increase intensity.', 'Pelvic floor physiotherapy highly recommended before running.', 'Swimming: 6 weeks if healing complete.', 'Core exercises: Start slowly — diastasis recti healing important.'] },
        { icon: '🌸', title: 'Self-Care Matters', items: ['Shower daily — even 5 min alone helps mental health significantly.', 'Nutrition: Continue prenatal vitamins if breastfeeding.', 'Social connection: Even one adult conversation/day matters.', 'Acceptance: House can wait, baby needs you present.'] },
      ]
    },
    4: {
      title: '3–6 Months: New Normal',
      sections: [
        { icon: '👶', title: 'Baby Development', items: ['3 months: Social smiles, head control, recognizing faces.', '4 months: Laughing, reaching for objects, solid food preparation.', '6 months: Solid foods typically started (WHO recommendation).', 'Sleep regression at 4 months — completely normal, temporary.'] },
        { icon: '💼', title: 'Returning to Work', items: ['Plan maternity leave end: childcare arrangements, pumping schedule if breastfeeding.', 'Separation anxiety — both maa aur baby ke liye normal.', 'Gradual return if possible: first week shorter hours.', 'Pumping at work: Know your rights, plan private space.'] },
        { icon: '❤️', title: 'Relationship & Identity', items: ['Couple intimacy: Communication essential — needs change, time pressures real.', '"Who am I now?" is normal question — identity integration takes 12-18 months.', 'Mom guilt: Universal, but not useful. You are doing enough.', 'Community: Other parents are best support — join groups.'] },
      ]
    }
  };

  const PP_WARNINGS = [
    { icon: '🔴', text: 'Heavy bleeding (soaking pad in 1 hour) after first 24 hrs' },
    { icon: '🔴', text: 'Fever >38°C — infection sign' },
    { icon: '🔴', text: 'Wound (C-section/episiotomy) redness, pus, opening' },
    { icon: '🔴', text: 'Leg pain/swelling — DVT (blood clot) sign' },
    { icon: '🔴', text: 'Severe headache + vision changes — postpartum preeclampsia' },
    { icon: '🔴', text: 'Difficulty breathing, chest pain' },
    { icon: '🔴', text: 'Thoughts of harming yourself or baby — immediate help needed' },
    { icon: '🔴', text: 'Urinary incontinence/inability to urinate' },
  ];

  function initPostpartum() {
    document.querySelectorAll('#ppWeekTabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#ppWeekTabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPPWeek(parseInt(btn.dataset.ppw));
      });
    });
    renderPPWeek(1);
    // Warnings
    const warnEl = document.getElementById('ppWarnings');
    if (warnEl) warnEl.innerHTML = PP_WARNINGS.map(w => `<p style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(232,160,168,.12);font-size:13px;color:var(--warm)"><span>${w.icon}</span><span>${w.text}</span></p>`).join('');
    // Mental health section
    const mhEl = document.getElementById('ppMentalHealth');
    if (mhEl) mhEl.innerHTML = `
      <div class="g2">
        <div style="background:#e8f5e9;border-radius:14px;padding:16px">
          <div style="font-weight:600;font-size:13.5px;color:#2e7d32;margin-bottom:8px">😊 Baby Blues (Normal)</div>
          <div style="font-size:12.5px;color:var(--warm);line-height:1.7">Day 2-14 tak. Crying, mood swings, anxiety, overwhelm. <strong>Hormonal shift</strong> — estrogen/progesterone dramatically drop. 70-80% women experience this. <strong>Treatment:</strong> Rest, support, passes on its own.</div>
        </div>
        <div style="background:#ffebee;border-radius:14px;padding:16px">
          <div style="font-weight:600;font-size:13.5px;color:#c62828;margin-bottom:8px">😔 Postpartum Depression</div>
          <div style="font-size:12.5px;color:var(--warm);line-height:1.7">2+ weeks persistent. Hopelessness, inability to care for baby, thoughts of harm. 10-15% women. <strong>NOT weakness</strong> — medical condition. <strong>Treatment:</strong> Therapy, medication (breastfeeding-safe options available). <strong>Please seek help.</strong></div>
        </div>
      </div>
      <div style="background:rgba(232,160,168,.08);border-radius:12px;padding:12px 14px;margin-top:12px;font-size:13px;color:var(--muted);line-height:1.7">📞 iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345 (24/7)</div>`;
    // Breastfeeding
    const bfEl = document.getElementById('ppBreastfeeding');
    if (bfEl) bfEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px">
        ${[
          ['🤱 Correct Latch', 'Baby ka poora areola (dark area) andar hona chahiye — sirf nipple nahi. Deep latch = no pain. Baby ka chin breast pe touch kare, naak clear hona chahiye.'],
          ['⏱️ Feeding Frequency', 'Newborn: har 2-3 ghante, 8-12 times/day. "On demand" feeding — clock mat dekho, baby ke cues dekho.'],
          ['📈 Milk Supply', 'Supply = demand. Frequent feeding = more milk. Stress aur fatigue supply reduce karta hai. Fenugreek, fennel seeds traditional galactagogues (doctor se discuss karein).'],
          ['😣 Common Problems', 'Cracked nipples: Lanolin cream, breastmilk apply karein. Mastitis (infection): Fever + hard lump + red area = immediate doctor. Engorgement: Frequent feeding, warm compress.'],
          ['🍼 Bottle & Formula', 'Combination feeding perfectly fine. Fed is best. Formula-fed babies thrive equally. No guilt for any feeding choice.'],
        ].map(([t, b]) => `<div style="background:white;border-radius:13px;padding:14px"><div style="font-weight:600;font-size:13.5px;color:var(--warm);margin-bottom:5px">${t}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${b}</div></div>`).join('')}
      </div>`;
    // Newborn basics
    const nbEl = document.getElementById('ppNewborn');
    if (nbEl) nbEl.innerHTML = `
      <div class="g2">
        ${[
          ['😴 Sleep Safety (SAFE)', '<strong>S</strong>olo (alone in crib) • <strong>A</strong>ir (firm flat surface) • <strong>F</strong>eet to foot • <strong>E</strong>nvironment (no loose bedding). Back pe sulana — SIDS prevention.'],
          ['🚿 Bathing', 'Sponge bath until cord stump falls (1-3 weeks). Soft cloth, warm water. No soap on face. Cord: keep dry, alcohol-free.'],
          ['💩 Poop Guide', 'Day 1-3: Meconium (black, tarry — normal). Day 4+: Yellow seedy (breastfed) or tan paste (formula). Frequency: newborns — up to 10x/day or once a week, both normal.'],
          ['😢 Why is Baby Crying?', 'Checklist: Hungry? Wet? Too hot/cold? Needs burping? Overstimulated? Tired? Wants contact? 90% of crying has these reasons.'],
          ['🌡️ Fever Alert', 'Newborn fever (>38°C rectal) = EMERGENCY regardless of time. Call doctor immediately — newborn immune system immature.'],
          ['👁️ Development Watch', 'Week 1-4: Responds to sound. Week 4-6: Eye contact, social smile developing. Trust your instincts — if something feels wrong, always check.'],
        ].map(([t, b]) => `<div style="background:white;border-radius:13px;padding:14px"><div style="font-weight:600;font-size:13.5px;color:var(--warm);margin-bottom:5px">${t}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${b}</div></div>`).join('')}
      </div>`;
  }

  function renderPPWeek(w) {
    const data = PP_WEEKS[w];
    const el = document.getElementById('ppWeekContent');
    if (!el || !data) return;
    el.innerHTML = `<div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--warm);margin-bottom:16px">${data.title}</div>` +
      data.sections.map(s => `
        <div style="background:white;border-radius:14px;padding:16px;margin-bottom:12px">
          <div style="font-weight:600;font-size:14px;color:var(--warm);margin-bottom:10px">${s.icon} ${s.title}</div>
          ${s.items.map(item => `<p style="font-size:13px;color:var(--muted);line-height:1.7;padding:5px 0;border-bottom:1px solid rgba(232,160,168,.1)">• ${item}</p>`).join('')}
        </div>`).join('');
  }

  // ════════════════════════════════════════
  // SYMPTOM CHECKER
  // ════════════════════════════════════════
  const SYMPTOMS = [
    { name: 'Morning Sickness / Nausea', cat: 'common', tri: '1', urgency: 'normal', icon: '🤢',
      desc: 'Pehli trimester ka most common symptom — 80% women ko hota hai. HCG hormone responsible hai.',
      causes: ['HCG hormone rapid increase', 'Estrogen surge', 'Smell sensitivity increase', 'Slow gastric emptying'],
      relief: ['Small frequent meals — khali pet avoid', 'Ginger tea / ginger candies (evidence-based)', 'Vitamin B6 10-25mg (doctor se discuss)', 'Cold foods better tolerated', 'Acupressure P6 wrist point', 'Fresh air, avoid strong smells'],
      warning: 'Hyperemesis gravidarum (severe): 3+ vomits/day, weight loss, unable to keep fluids → Doctor immediately'
    },
    { name: 'Fatigue / Extreme Tiredness', cat: 'common', tri: '1,3', urgency: 'normal', icon: '😴',
      desc: 'Progesterone ka sedative effect + increased blood volume + organ development = extreme tiredness',
      causes: ['Progesterone surge', 'Blood volume 50% increase', 'Low iron / anaemia', 'Poor sleep quality'],
      relief: ['20-min power nap (not longer)', 'Iron check karwao (Hb >11 chahiye)', 'Hydration maintain karo', 'Reduce unnecessary commitments', 'Gentle walking — paradoxically boosts energy'],
      warning: 'Extreme fatigue + breathlessness + pallor → Anaemia check karwao'
    },
    { name: 'Back Pain', cat: 'common', tri: '2,3', urgency: 'normal', icon: '🤸',
      desc: 'Relaxin hormone ligaments loosen karta hai + shifting center of gravity + uterus weight',
      causes: ['Relaxin hormone — joint loosening', 'Posture changes', 'Muscle weakness', 'Sciatica (nerve compression)'],
      relief: ['Prenatal yoga — cat-cow, child\'s pose', 'Pregnancy pillow between knees at night', 'Warm compress (not hot)', 'Supportive footwear — no heels', 'Gentle swimming', 'Physiotherapy referral'],
      warning: 'Severe sudden back pain + bleeding → Immediate medical attention (placental abruption possible)'
    },
    { name: 'Swelling (Oedema)', cat: 'common', tri: '3', urgency: 'watch', icon: '🦵',
      desc: 'Ankles, feet, hands mein mild swelling — normal in pregnancy due to increased fluid retention',
      causes: ['Blood volume 50% increase', 'Pressure on pelvic veins', 'Sodium retention', 'Heat'],
      relief: ['Legs elevate karo (viparita karani)', 'Compression socks', 'Side pe sona (left side best)', 'Reduce sodium intake', 'Regular walking improves circulation', 'Swimming excellent'],
      warning: 'Sudden severe face/hand swelling + headache + vision changes → Preeclampsia emergency!'
    },
    { name: 'Heartburn / Acidity', cat: 'common', tri: '2,3', urgency: 'normal', icon: '🔥',
      desc: 'Progesterone lower esophageal sphincter relax karta hai + growing uterus stomach push karta hai',
      causes: ['Progesterone effect on LES', 'Uterus pressure on stomach', 'Reduced gastric motility'],
      relief: ['Small frequent meals', 'Avoid trigger foods: spicy, citrus, coffee, chocolate', 'Don\'t lie down 2-3 hrs after eating', 'Elevate head of bed', 'Antacids (safe ones) — doctor approved', 'Coconut water, cold milk'],
      warning: 'Severe pain, difficulty swallowing → Doctor se milein'
    },
    { name: 'Leg Cramps', cat: 'common', tri: '2,3', urgency: 'normal', icon: '💢',
      desc: 'Calf muscles mein sudden painful spasms — usually at night. 50% pregnant women experience',
      causes: ['Calcium/magnesium deficiency', 'Dehydration', 'Pressure on nerves from uterus', 'Reduced circulation'],
      relief: ['Magnesium supplement 300mg (doctor approved)', 'Calf stretches before bedtime', 'Adequate hydration (3L/day)', 'Calcium-rich foods', 'When cramp occurs: dorsiflexion (toes up) + massage'],
      warning: 'Persistent calf pain + swelling + redness → DVT (blood clot) rule out karein'
    },
    { name: 'Frequent Urination', cat: 'common', tri: '1,3', urgency: 'normal', icon: '🚽',
      desc: 'Kidney blood flow 50% badhta hai + uterus pressure on bladder',
      causes: ['Increased renal blood flow', 'HCG hormone effect', 'Uterus bladder pressure', 'Increased fluid intake'],
      relief: ['Normal hai — accept karo', 'Avoid caffeine (bladder irritant)', 'Night: fluid reduce after 6pm', 'Lean forward when urinating (emptying fully)', 'Kegel exercises — helps control'],
      warning: 'Burning/pain with urination, blood in urine, fever → UTI — treat immediately (dangerous in pregnancy)'
    },
    { name: 'Braxton Hicks (False Labor)', cat: 'common', tri: '3', urgency: 'normal', icon: '🫂',
      desc: 'Practice contractions — uterus delivery ke liye practice kar raha hai. Week 28 se common.',
      causes: ['Uterus muscle practice contractions', 'Dehydration can trigger them', 'Physical activity', 'Full bladder'],
      relief: ['Change position ya activity', 'Hydration — drink water', 'Warm bath (not hot)', 'Rest', 'Deep breathing'],
      warning: 'Before week 37: regular painful contractions → Preterm labor. Any time: contractions every 5 min for 1 hour → Hospital'
    },
    { name: 'Stretch Marks', cat: 'cosmetic', tri: '2,3', urgency: 'normal', icon: '〰️',
      desc: 'Skin rapidly stretches — dermis layer tears. 50-90% pregnant women. Genetic predisposition.',
      causes: ['Rapid skin stretching', 'Genetic factor (maa ko tha toh likely)', 'Decreased skin elasticity', 'Hormonal effects on collagen'],
      relief: ['Coconut oil / shea butter daily massage (prevention better than cure)', 'Vitamin E oil', 'Stay hydrated', 'Gradual weight gain', 'Tretinoin (post-delivery only)', 'Accept them — tiger stripes, battle scars 🐯'],
      warning: 'No medical concern — cosmetic only'
    },
    { name: 'Shortness of Breath', cat: 'common', tri: '3', urgency: 'watch', icon: '😮‍💨',
      desc: 'Uterus diaphragm push karta hai upward + progesterone breathing rate increase karta hai',
      causes: ['Uterus pressing diaphragm', 'Progesterone increases breathing drive', 'Anaemia'],
      relief: ['Slow down activity', 'Good posture — sit upright', 'Propped up sleeping', 'Baby drops in week 36 — relief then', 'Anaemia check karwao'],
      warning: 'Sudden severe shortness of breath, chest pain, rapid heart rate → Emergency! (Pulmonary embolism possible)'
    },
    { name: 'Vaginal Discharge', cat: 'common', tri: '1,2,3', urgency: 'watch', icon: '💧',
      desc: 'Increased leukorrhea (white/clear discharge) normal in pregnancy — estrogen increases cervical mucus',
      causes: ['Increased estrogen', 'Increased blood flow to vaginal area', 'Normal protective mechanism'],
      relief: ['Cotton underwear wear karo', 'Good hygiene maintain karo', 'No douching — ever, especially in pregnancy', 'Breathable clothing'],
      warning: 'Yellow/green/cottage cheese-like + itching/burning → Infection. Blood-tinged discharge before 37 weeks → Doctor immediately'
    },
    { name: 'Round Ligament Pain', cat: 'common', tri: '2', urgency: 'normal', icon: '⚡',
      desc: 'Sharp stabbing pain lower abdomen sides — uterus support ligaments stretching',
      causes: ['Round ligament rapid stretching', 'Sudden movements', 'Sneezing, laughing'],
      relief: ['Slow down sudden movements', 'Warm compress lower abdomen', 'Prenatal support belt', 'Gentle stretching', 'Flexing toward pain'],
      warning: 'Severe persistent pain + bleeding + fever → Not round ligament — seek care'
    },
    { name: 'Gestational Diabetes', cat: 'serious', tri: '2,3', urgency: 'serious', icon: '🩸',
      desc: 'Pregnancy hormones insulin resistance badhate hain — 7-8% pregnancies affected. Manageable.',
      causes: ['Placental hormones block insulin', 'Pre-existing insulin resistance', 'Risk factors: overweight, family history, previous GDM'],
      relief: ['Diet: Low glycemic index foods, small meals', 'Exercise: 30 min daily walking', 'Blood sugar monitoring', 'Insulin if diet/exercise insufficient', 'Close monitoring — baby size, amniotic fluid'],
      warning: 'Uncontrolled GDM → Large baby (macrosomia), difficult delivery, baby hypoglycemia. Always follow treatment plan.'
    },
    { name: 'Preeclampsia Signs', cat: 'serious', tri: '3', urgency: 'emergency', icon: '🚨',
      desc: 'High blood pressure + protein in urine + organ involvement — 5-8% pregnancies. Serious condition.',
      causes: ['Abnormal placental development', 'Immune system factors', 'Risk: first pregnancy, twins, pre-existing hypertension'],
      relief: ['Prevention: Low dose aspirin (81mg) if high risk — doctor prescribed', 'Regular BP monitoring', 'Regular prenatal care'],
      warning: '🚨 EMERGENCY SIGNS: BP >140/90 + severe headache + vision changes + severe swelling + upper right abdominal pain → IMMEDIATE HOSPITAL'
    },
  ];

  const SYMPTOM_CATS = [
    { key: 'all', label: 'Sabhi' },
    { key: 'common', label: '✅ Common' },
    { key: 'watch', label: '👀 Watch' },
    { key: 'serious', label: '⚠️ Serious' },
    { key: 'cosmetic', label: '💄 Cosmetic' },
  ];

  let symptomCatFilter = 'all';

  function initSymptomChecker() {
    const catEl = document.getElementById('symptomCatBtns');
    if (!catEl) return;
    catEl.innerHTML = SYMPTOM_CATS.map(c => `<button class="tab-btn${c.key === 'all' ? ' active' : ''}" data-sc="${c.key}">${c.label}</button>`).join('');
    catEl.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        catEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        symptomCatFilter = btn.dataset.sc;
        renderSymptoms();
      });
    });
    renderSymptoms();
  }

  function filterSymptoms() { renderSymptoms(); }

  function renderSymptoms() {
    const q = (document.getElementById('symptomSearch')?.value || '').toLowerCase();
    const filtered = SYMPTOMS.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
      const matchCat = symptomCatFilter === 'all' || s.cat === symptomCatFilter || s.urgency === symptomCatFilter;
      return matchQ && matchCat;
    });
    const container = document.getElementById('symptomsContainer');
    if (!container) return;
    if (!filtered.length) { container.innerHTML = '<div class="card"><p style="color:var(--muted);font-size:13px;text-align:center;padding:14px">Koi symptom nahi mila. Search word change karein.</p></div>'; return; }
    const urgencyColors = { normal: { bg: 'rgba(106,184,154,.1)', border: 'var(--green)', text: '✅ Normal' }, watch: { bg: 'rgba(212,168,83,.1)', border: 'var(--gold)', text: '👀 Monitor' }, serious: { bg: 'rgba(220,120,80,.1)', border: '#e07040', text: '⚠️ Serious' }, emergency: { bg: 'rgba(220,80,80,.1)', border: '#e05c5c', text: '🚨 Emergency' } };
    container.innerHTML = filtered.map((s, i) => {
      const uc = urgencyColors[s.urgency] || urgencyColors.normal;
      return `<div class="card" style="border-left:3px solid ${uc.border}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:10px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:32px">${s.icon}</span>
            <div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:1.15rem;color:var(--warm)">${s.name}</div>
              <div style="display:flex;gap:6px;margin-top:3px">
                <span style="font-size:11px;padding:2px 9px;border-radius:50px;background:${uc.bg};color:${uc.border};font-weight:600">${uc.text}</span>
                <span class="pill pill-b" style="font-size:10px">Trimester ${s.tri}</span>
              </div>
            </div>
          </div>
        </div>
        <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:12px">${s.desc}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <div style="background:var(--cream);border-radius:12px;padding:12px">
            <div style="font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Kyon hota hai</div>
            ${s.causes.map(c => `<p style="font-size:12px;color:var(--muted);line-height:1.6;padding:2px 0">• ${c}</p>`).join('')}
          </div>
          <div style="background:rgba(106,184,154,.06);border-radius:12px;padding:12px">
            <div style="font-size:11px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Relief & Management</div>
            ${s.relief.map(r => `<p style="font-size:12px;color:var(--muted);line-height:1.6;padding:2px 0">• ${r}</p>`).join('')}
          </div>
        </div>
        <div style="background:${uc.bg};border-radius:10px;padding:10px 12px;font-size:12.5px;color:var(--warm);line-height:1.6">
          <strong style="color:${uc.border}">⚠️ Warning:</strong> ${s.warning}
        </div>
      </div>`;
    }).join('');
  }

  // ════════════════════════════════════════
  // NAVIGATION HELPER
  // ════════════════════════════════════════
  function navTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');
    const tab = document.querySelector(`.nav-tab[data-page="${pageId}"]`);
    if (tab) tab.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ════════════════════════════════════════
  // INIT ALL MODULES
  // ════════════════════════════════════════
  function initAll() {
    initDashboard();
    initNutrition();
    initBag();
    initNames();
    initMedicine();
    initJournal();
    initPostpartum();
    initSymptomChecker();

    // Nav click refresh dashboard
    document.querySelectorAll('.nav-tab').forEach(btn => {
      const orig = btn.onclick;
      btn.addEventListener('click', () => {
        if (btn.dataset.page === 'dashboard') setTimeout(initDashboard, 50);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // ════════════════════════════════════════
  // EXTEND GLOBAL MC OBJECT
  // ════════════════════════════════════════
  Object.assign(window.MC || (window.MC = {}), {
    navTo,
    // Nutrition
    addFood, deleteFood,
    // Bag
    toggleBagItem, addCustomBagItem, resetBag,
    // Names
    renderNames, toggleSaveName, removeSavedName,
    // Medicine
    toggleMedTaken, deleteMed, toggleAddMedForm, addMedicine,
    // Journal
    handlePhoto, saveJournalEntry, deleteJournalEntry,
    // Symptoms
    filterSymptoms,
  });

})();


// ═══════════════════════════════════════════════════════════
// SOURCE: app-features.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — app-features.js
 * NEW FEATURES:
 *  1. Smart Reminders (Web Notifications)
 *  2. Partner Access (Supabase shared view)
 *  3. Weekly PDF Report (jsPDF)
 *  4. Relaxation Audio + YouTube Videos
 *
 * Load AFTER app.js in index.html
 */

// ═══════════════════════════════════════════
// FEATURE INIT — runs after DOM ready
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initRemindersPage();
  initPartnerPage();
  initReportPage();
  initRelaxPage();

  // Add nav tabs for new pages
  addNewTabs();
});

function addNewTabs() {
  // Desktop top tabs
  const topTabs = document.getElementById('topTabs');
  if (topTabs) {
    const newTabs = [
      { page: 'reminders', label: '🔔 Reminders' },
      { page: 'partner',   label: '👨‍👩‍👧 Partner' },
      { page: 'report',    label: '📊 Report' },
      { page: 'relax',     label: '🎵 Relax' },
    ];
    newTabs.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'top-tab';
      btn.dataset.page = t.page;
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        if (window.MC && window.MC.goTo) window.MC.goTo(t.page);
      });
      topTabs.appendChild(btn);
    });
  }

  // Mobile more menu
  const moreMenu = document.querySelector('#moreMenu .more-grid');
  if (moreMenu) {
    [{ page:'reminders', icon:'🔔', label:'Reminders' },
     { page:'partner',   icon:'👨‍👩‍👧', label:'Partner' },
     { page:'report',    icon:'📊', label:'Report' },
     { page:'relax',     icon:'🎵', label:'Relax' }
    ].forEach(t => {
      const div = document.createElement('div');
      div.className = 'more-item';
      div.dataset.page = t.page;
      div.innerHTML = `<div class="mi-icon">${t.icon}</div><div class="mi-label">${t.label}</div>`;
      div.addEventListener('click', () => {
        document.getElementById('moreMenu').style.display = 'none';
        if (window.MC && window.MC.goTo) window.MC.goTo(t.page);
      });
      moreMenu.appendChild(div);
    });
  }

  // Inject page HTML
  injectPages();
}

function injectPages() {
  const body = document.body;
  const footer = document.querySelector('footer');

  const html = `
<!-- ═══════ REMINDERS PAGE ═══════ -->
<div class="page" id="page-reminders">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Notifications</div>
    <div class="sec-title">Smart Reminders 🔔</div>
  </div>

  <div class="card" id="notifPermCard">
    <div style="text-align:center;padding:10px 0 16px">
      <div style="font-size:48px;margin-bottom:12px">🔔</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;margin-bottom:8px">Notifications Enable Karein</div>
      <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:18px">Medicine, water, aur kick count ke reminders apne phone pe paayein — app open rahe tab kaam karta hai.</p>
      <button class="btn btn-p" onclick="FEAT.requestNotifPerm()">🔔 Allow Notifications</button>
      <div id="notifStatus" style="font-size:12.5px;color:var(--muted);margin-top:10px"></div>
    </div>
  </div>

  <div class="card">
    <div class="sec-label">Medicine Reminder</div>
    <div class="sec-title">💊 Medicine Alert</div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.6">Apni medicines ka time daalo — browser notification aayegi.</p>
    <div id="medReminderList" style="margin-bottom:14px"></div>
    <p style="font-size:12px;color:var(--muted);background:rgba(232,160,168,.08);padding:10px 12px;border-radius:10px">💡 Medicine times app.js ke Medicine tracker se automatically aate hain. App khula hona zaroori hai.</p>
  </div>

  <div class="card">
    <div class="sec-label">Water Reminder</div>
    <div class="sec-title">💧 Paani Peene ka Reminder</div>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <p style="font-size:13px;color:var(--muted);line-height:1.6">Har <strong id="waterIntervalLabel">2 ghante</strong> mein reminder</p>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <select id="waterInterval" style="width:150px" onchange="FEAT.updateWaterInterval()">
          <option value="30">30 minutes</option>
          <option value="60">1 ghanta</option>
          <option value="120" selected>2 ghante</option>
          <option value="180">3 ghante</option>
        </select>
        <button class="btn btn-p btn-sm" id="waterReminderBtn" onclick="FEAT.toggleWaterReminder()">Start</button>
      </div>
    </div>
    <div id="waterReminderStatus" style="font-size:12px;color:var(--muted);margin-top:10px"></div>
  </div>

  <div class="card">
    <div class="sec-label">Kick Counter</div>
    <div class="sec-title">👶 Kick Count Reminder</div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.6">Week 28+ ke baad — subah aur shaam kick count karne ki yaad dilaata hai.</p>
    <div class="g2" style="margin-bottom:12px">
      <div><label>Subah ka reminder</label><input type="time" id="kickMorningTime" value="10:00"/></div>
      <div><label>Shaam ka reminder</label><input type="time" id="kickEveningTime" value="18:00"/></div>
    </div>
    <button class="btn btn-p btn-sm" id="kickReminderBtn" onclick="FEAT.toggleKickReminder()">Reminder Set Karo</button>
    <div id="kickReminderStatus" style="font-size:12px;color:var(--muted);margin-top:8px"></div>
  </div>

  <div class="card">
    <div class="sec-label">Daily Check-in</div>
    <div class="sec-title">🌸 Daily Mood Check-in</div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.6">Roz ek specific time pe mood log karne ki reminder.</p>
    <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
      <div style="flex:1"><label>Check-in time</label><input type="time" id="moodReminderTime" value="09:00"/></div>
      <button class="btn btn-p btn-sm" onclick="FEAT.setMoodReminder()">Set</button>
    </div>
    <div id="moodReminderStatus" style="font-size:12px;color:var(--muted);margin-top:8px"></div>
  </div>
</div>

<!-- ═══════ PARTNER PAGE ═══════ -->
<div class="page" id="page-partner">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Family Access</div>
    <div class="sec-title">Partner Access 👨‍👩‍👧 <span class="sync-badge" id="partner-save">☁️ Synced</span></div>
  </div>

  <div class="card" style="background:linear-gradient(135deg,rgba(232,160,168,.1),rgba(247,196,168,.08));text-align:center;padding:24px">
    <div style="font-size:44px;margin-bottom:10px">💑</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:8px">Partner ko Invite Karein</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.7;max-width:420px;margin:0 auto">Pati ya family member apne phone pe aapki pregnancy journey dekh sakta hai — read-only access.</p>
  </div>

  <div class="card">
    <div class="sec-label">Invite</div>
    <div class="sec-title">Partner ka Email</div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:14px;line-height:1.6">Yeh link bhejo — partner browser mein khol ke aapka dashboard dekh sakta hai (koi login required nahi).</p>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <input type="email" id="partnerEmail" placeholder="partner@email.com" style="flex:1"/>
      <button class="btn btn-p btn-sm" onclick="FEAT.generatePartnerLink()">🔗 Link Generate</button>
    </div>
    <div id="partnerLinkBox" style="display:none;background:var(--cream);border-radius:12px;padding:14px;margin-top:10px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:6px">Partner ke liye link (copy karke WhatsApp pe bhejo):</div>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="text" id="partnerLinkText" readonly style="flex:1;font-size:12px;background:white"/>
        <button class="btn btn-p btn-sm" onclick="FEAT.copyPartnerLink()">Copy</button>
      </div>
      <button class="btn btn-g btn-sm" style="margin-top:8px;width:100%" onclick="FEAT.shareWhatsApp()">📱 WhatsApp pe Bhejo</button>
    </div>
  </div>

  <div class="card">
    <div class="sec-label">Access Control</div>
    <div class="sec-title">Kya Dikhaana Hai?</div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:14px">Partner kya dekh sakta hai — aap control karti hain.</p>
    <div id="partnerPermsList"></div>
    <button class="btn btn-p btn-sm" style="margin-top:12px" onclick="FEAT.savePartnerPerms()">💾 Save Settings</button>
    <div id="partnerPermSaved" style="font-size:12px;color:var(--green);margin-top:6px;opacity:0;transition:.3s"></div>
  </div>

  <div class="card" id="activePartnerCard" style="display:none">
    <div class="sec-label">Active Access</div>
    <div class="sec-title">Current Partners</div>
    <div id="partnersList"></div>
    <button class="btn btn-g btn-sm" style="margin-top:10px" onclick="FEAT.revokeAllAccess()">🚫 Revoke All Access</button>
  </div>
</div>

<!-- ═══════ REPORT PAGE ═══════ -->
<div class="page" id="page-report">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Health Summary</div>
    <div class="sec-title">Weekly PDF Report 📊</div>
  </div>

  <div class="card" style="text-align:center;padding:24px">
    <div style="font-size:48px;margin-bottom:12px">📋</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:8px">Doctor ke liye Report</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.7;max-width:420px;margin:0 auto 20px">Is hafte ka complete health summary — weight, sleep, nutrition, mood, medicines — ek PDF mein.</p>
    <button class="btn btn-p" onclick="FEAT.generateReport()" id="generateReportBtn">📊 Generate Report</button>
    <div id="reportStatus" style="font-size:12.5px;color:var(--muted);margin-top:10px"></div>
  </div>

  <div class="card" id="reportPreview" style="display:none">
    <div class="sec-label">Preview</div>
    <div class="sec-title">Report Content</div>
    <div id="reportContent" style="font-size:13px;line-height:1.9"></div>
    <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
      <button class="btn btn-p" onclick="FEAT.downloadPDF()">⬇️ PDF Download</button>
      <button class="btn btn-g" onclick="window.print()">🖨️ Print</button>
      <button class="btn btn-g" onclick="FEAT.shareReport()">📱 Share</button>
    </div>
  </div>

  <div class="card" style="background:linear-gradient(135deg,rgba(235,248,240,.6),rgba(230,245,255,.6))">
    <div class="sec-label">Report mein kya hoga</div>
    <div class="sec-title">Contents</div>
    <div style="font-size:13px;line-height:2;color:var(--warm)">
      ✅ Patient info + due date + current week<br>
      ✅ Weight log — last 7 entries + trend<br>
      ✅ Sleep — 7-day average + quality<br>
      ✅ Nutrition — daily calories + water intake<br>
      ✅ Medicines — compliance this week<br>
      ✅ Mood pattern — last 7 days<br>
      ✅ Appointments — upcoming<br>
      ✅ Baby bump journal — last entry<br>
      ✅ Doctor notes section (blank — fill karo)
    </div>
  </div>
</div>

<!-- ═══════ RELAX PAGE ═══════ -->
<div class="page" id="page-relax">
  <div style="padding:20px 0 8px">
    <div class="sec-label">Wellbeing</div>
    <div class="sec-title">Relaxation & Guidance 🎵</div>
  </div>

  <!-- AUDIO PLAYER -->
  <div class="card">
    <div class="sec-label">Ambient Sounds</div>
    <div class="sec-title">Soothing Audio 🎧</div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.6">Baby ko bhi sunai deta hai — week 18 se. Relaxation ke saath bonding bhi hoti hai.</p>
    <div id="audioPlayer" style="text-align:center;padding:16px 0">
      <div id="nowPlaying" style="font-size:28px;margin-bottom:8px">🎵</div>
      <div id="nowPlayingName" style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;margin-bottom:16px;color:var(--warm)">Koi sound nahi chal raha</div>
      <!-- Volume -->
      <div style="display:flex;align-items:center;gap:10px;justify-content:center;margin-bottom:16px">
        <span style="font-size:14px">🔈</span>
        <input type="range" id="masterVolume" min="0" max="1" step="0.1" value="0.5" style="width:140px;accent-color:var(--rose)" oninput="FEAT.setVolume(this.value)"/>
        <span style="font-size:14px">🔊</span>
      </div>
      <!-- Timer -->
      <div style="display:flex;align-items:center;gap:8px;justify-content:center;margin-bottom:16px">
        <span style="font-size:12.5px;color:var(--muted)">Timer:</span>
        <select id="sleepTimer" style="width:130px" onchange="FEAT.setSleepTimer(this.value)">
          <option value="0">No timer</option>
          <option value="10">10 minutes</option>
          <option value="20">20 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </select>
      </div>
      <div id="timerDisplay" style="font-size:12px;color:var(--accent);height:18px"></div>
    </div>

    <!-- Sound Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;margin-top:8px" id="soundGrid"></div>
    <button class="btn btn-g btn-sm" style="margin-top:14px;width:100%" onclick="FEAT.stopAll()">⏹ Stop All</button>
  </div>

  <!-- GUIDED MEDITATION TEXT -->
  <div class="card">
    <div class="sec-label">Guided Meditation</div>
    <div class="sec-title">5-Minute Pregnancy Meditation 🧘</div>
    <div class="tab-row" id="meditationTabs">
      <button class="tab-btn active" data-med="anxiety" onclick="FEAT.showMeditation('anxiety',this)">Anxiety</button>
      <button class="tab-btn" data-med="sleep" onclick="FEAT.showMeditation('sleep',this)">Sleep</button>
      <button class="tab-btn" data-med="baby" onclick="FEAT.showMeditation('baby',this)">Baby Bond</button>
      <button class="tab-btn" data-med="labor" onclick="FEAT.showMeditation('labor',this)">Labor Prep</button>
    </div>
    <div id="meditationContent" style="background:linear-gradient(135deg,#fef0f5,#fdf5ee);border-radius:14px;padding:20px;line-height:2;font-size:13.5px;color:var(--warm)"></div>
    <button class="btn btn-p btn-sm" style="margin-top:12px" onclick="FEAT.readAloud()">🔊 Read Aloud</button>
  </div>

  <!-- YOUTUBE VIDEOS -->
  <div class="card">
    <div class="sec-label">Video Guides</div>
    <div class="sec-title">Pregnancy YouTube Videos 📺</div>
    <div class="tab-row" id="videoTabs">
      <button class="tab-btn active" data-vcat="yoga" onclick="FEAT.showVideos('yoga',this)">🧘 Yoga</button>
      <button class="tab-btn" data-vcat="meditation" onclick="FEAT.showVideos('meditation',this)">🧘‍♀️ Meditation</button>
      <button class="tab-btn" data-vcat="nutrition" onclick="FEAT.showVideos('nutrition',this)">🍎 Nutrition</button>
      <button class="tab-btn" data-vcat="labor" onclick="FEAT.showVideos('labor',this)">🏥 Labor</button>
      <button class="tab-btn" data-vcat="baby" onclick="FEAT.showVideos('baby',this)">👶 Baby Care</button>
    </div>
    <div id="videoGrid" style="display:flex;flex-direction:column;gap:12px"></div>
  </div>
</div>
`;

  if (footer) {
    footer.insertAdjacentHTML('beforebegin', html);
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}

// ═══════════════════════════════════════════
// 1. SMART REMINDERS
// ═══════════════════════════════════════════
let waterReminderInterval = null;
let kickReminderTimers = [];
let sleepTimerTimeout = null;
let reminderActive = { water: false, kick: false };

function initRemindersPage() {
  // Check notification permission on page load
  if ('Notification' in window) {
    updateNotifStatus(Notification.permission);
  }
}

async function requestNotifPerm() {
  if (!('Notification' in window)) {
    document.getElementById('notifStatus').textContent = '⚠️ Aapka browser notifications support nahi karta.';
    return;
  }
  const perm = await Notification.requestPermission();
  updateNotifStatus(perm);
  if (perm === 'granted') {
    showNotif('MamaCare 🌸', 'Notifications enabled! Aap ready hain.');
    loadMedReminders();
  }
}

function updateNotifStatus(perm) {
  const el = document.getElementById('notifStatus');
  if (!el) return;
  const msgs = {
    granted: '✅ Notifications allowed — reminders kaam karenge!',
    denied: '❌ Notifications blocked — browser settings mein allow karein.',
    default: '⏳ Allow karein toh reminders milenge.',
  };
  el.textContent = msgs[perm] || '';
}

function showNotif(title, body, icon = '🌸') {
  if (Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: '/mcAppIcons/android/mipmap-xxxhdpi/icon.png' });
}

async function loadMedReminders() {
  const el = document.getElementById('medReminderList');
  if (!el) return;
  // Pull medicines from Supabase if user logged in
  const supaRef = window.supa;
  const userRef = window.user;
  if (!supaRef || !userRef) {
    el.innerHTML = '<p style="font-size:13px;color:var(--muted)">Login ke baad medicines automatically dikh jaayengi.</p>';
    return;
  }
  const { data } = await supaRef.from('medicines').select('name,time_of_day,icon').eq('user_id', userRef.id).eq('is_active', true);
  if (!data || !data.length) {
    el.innerHTML = '<p style="font-size:13px;color:var(--muted)">Koi medicine add nahi ki. Medicine tab se add karein.</p>';
    return;
  }
  el.innerHTML = data.map(m => `
    <div style="display:flex;align-items:center;gap:12px;background:white;border-radius:12px;padding:11px 14px;margin-bottom:7px">
      <span style="font-size:20px">${m.icon || '💊'}</span>
      <div style="flex:1"><div style="font-weight:600;font-size:13px">${m.name}</div><div style="font-size:12px;color:var(--muted)">⏰ ${m.time_of_day || '—'}</div></div>
      <span class="pill pill-g">Active</span>
    </div>`).join('');
  // Schedule notifications for today
  scheduleMedNotifs(data);
}

function scheduleMedNotifs(meds) {
  meds.forEach(m => {
    if (!m.time_of_day) return;
    const [h, min] = m.time_of_day.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, min, 0, 0);
    let delay = target - now;
    if (delay < 0) return; // already passed today
    setTimeout(() => {
      showNotif(`💊 Medicine Time!`, `${m.name} lena mat bhoolo! 🌸`);
    }, delay);
  });
}

function toggleWaterReminder() {
  const btn = document.getElementById('waterReminderBtn');
  const status = document.getElementById('waterReminderStatus');
  if (reminderActive.water) {
    clearInterval(waterReminderInterval);
    waterReminderInterval = null;
    reminderActive.water = false;
    btn.textContent = 'Start';
    btn.className = 'btn btn-p btn-sm';
    if (status) status.textContent = '';
  } else {
    if (Notification.permission !== 'granted') {
      requestNotifPerm();
      return;
    }
    const mins = parseInt(document.getElementById('waterInterval').value);
    reminderActive.water = true;
    btn.textContent = '⏹ Stop';
    if (status) status.textContent = `✅ Har ${mins} minute mein reminder aayegi`;
    showNotif('💧 Paani Peeo!', 'Pehla reminder shuru hua. Hydrated raho! 🌸');
    waterReminderInterval = setInterval(() => {
      showNotif('💧 Paani Peene Ka Time!', 'Ek glass paani peeo — baby ko bhi zaroorat hai! 🌸');
    }, mins * 60 * 1000);
  }
}

function updateWaterInterval() {
  const mins = parseInt(document.getElementById('waterInterval').value);
  const lbl = document.getElementById('waterIntervalLabel');
  if (lbl) lbl.textContent = mins >= 60 ? `${mins / 60} ghanta` : `${mins} minute`;
  if (reminderActive.water) {
    clearInterval(waterReminderInterval);
    waterReminderInterval = setInterval(() => {
      showNotif('💧 Paani Peene Ka Time!', 'Ek glass paani peeo! 🌸');
    }, mins * 60 * 1000);
  }
}

function toggleKickReminder() {
  const btn = document.getElementById('kickReminderBtn');
  const status = document.getElementById('kickReminderStatus');
  if (reminderActive.kick) {
    kickReminderTimers.forEach(t => clearTimeout(t));
    kickReminderTimers = [];
    reminderActive.kick = false;
    if (btn) btn.textContent = 'Reminder Set Karo';
    if (status) status.textContent = 'Reminder off kar diya.';
    return;
  }
  if (Notification.permission !== 'granted') { requestNotifPerm(); return; }
  const mTime = document.getElementById('kickMorningTime').value;
  const eTime = document.getElementById('kickEveningTime').value;
  scheduleKick(mTime, '🌅 Subah', 'Subah ka kick count karo — 10 kicks 2 ghante mein! 👶');
  scheduleKick(eTime, '🌆 Shaam', 'Shaam ka kick count karo — baby active hai? 👶');
  reminderActive.kick = true;
  if (btn) btn.textContent = '⏹ Cancel';
  if (status) status.textContent = `✅ Subah ${mTime} + Shaam ${eTime} — daily reminder set!`;
  showNotif('👶 Kick Reminder Set!', `Subah ${mTime} aur shaam ${eTime} pe yaad dilayenge.`);
}

function scheduleKick(timeStr, label, body) {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const t = new Date(); t.setHours(h, m, 0, 0);
  let delay = t - now;
  if (delay < 0) delay += 86400000; // next day
  const timer = setTimeout(() => {
    showNotif(`${label} Kick Count! 👶`, body);
    // Reschedule for next day
    scheduleKick(timeStr, label, body);
  }, delay);
  kickReminderTimers.push(timer);
}

function setMoodReminder() {
  const time = document.getElementById('moodReminderTime').value;
  const status = document.getElementById('moodReminderStatus');
  if (Notification.permission !== 'granted') { requestNotifPerm(); return; }
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  const t = new Date(); t.setHours(h, m, 0, 0);
  let delay = t - now;
  if (delay < 0) delay += 86400000;
  setTimeout(function remind() {
    showNotif('🌸 Mood Check-in!', 'Aaj kaisi feel kar rahi hain? MamaCare mein log karein.');
    setTimeout(remind, 86400000); // daily
  }, delay);
  if (status) status.textContent = `✅ Roz ${time} pe mood check-in reminder!`;
  showNotif('🌸 Mood Reminder Set!', `Roz ${time} pe aapko yaad dilaayenge.`);
}

// ═══════════════════════════════════════════
// 2. PARTNER ACCESS
// ═══════════════════════════════════════════
const PARTNER_PERMS = [
  { id: 'due', label: '🗓️ Due Date & Timeline', default: true },
  { id: 'mood', label: '😊 Mood Logs', default: true },
  { id: 'weight', label: '⚖️ Weight Progress', default: true },
  { id: 'kicks', label: '👶 Kick Counter', default: true },
  { id: 'appointments', label: '📅 Appointments', default: true },
  { id: 'journal', label: '📸 Journal Entries', default: false },
  { id: 'nutrition', label: '🍎 Food & Water', default: false },
  { id: 'medicines', label: '💊 Medicines', default: false },
  { id: 'symptoms', label: '🩺 Symptoms Log', default: false },
];

function initPartnerPage() {
  const list = document.getElementById('partnerPermsList');
  if (!list) return;
  list.innerHTML = PARTNER_PERMS.map(p => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:white;border-radius:12px;margin-bottom:7px">
      <span style="font-size:13.5px">${p.label}</span>
      <label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin:0">
        <input type="checkbox" id="perm_${p.id}" ${p.default ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--accent)"/>
        <span style="font-size:12px;color:var(--muted)">Allow</span>
      </label>
    </div>`).join('');
}

function generatePartnerLink() {
  const email = document.getElementById('partnerEmail').value.trim();
  const userRef = window.user;
  if (!userRef) { alert('Pehle login karein'); return; }
  // Generate a shareable token (simple base64 of user id)
  const token = btoa(userRef.id + ':' + Date.now());
  const perms = PARTNER_PERMS.filter(p => document.getElementById('perm_' + p.id)?.checked).map(p => p.id).join(',');
  const domain = window.location.origin;
  const link = `${domain}?partner_view=${token}&perms=${perms}`;
  document.getElementById('partnerLinkText').value = link;
  document.getElementById('partnerLinkBox').style.display = 'block';
  // Save to Supabase profile
  if (window.supa && userRef) {
    window.supa.from('user_profile').update({
      partner_email: email,
      partner_token: token,
      partner_perms: perms
    }).eq('id', userRef.id).then(() => {});
    flashSaveBadge('partner-save');
  }
}

function copyPartnerLink() {
  const txt = document.getElementById('partnerLinkText').value;
  navigator.clipboard.writeText(txt).then(() => {
    showToast('✅ Link copied!');
  }).catch(() => {
    document.getElementById('partnerLinkText').select();
    document.execCommand('copy');
    showToast('✅ Link copied!');
  });
}

function shareWhatsApp() {
  const link = document.getElementById('partnerLinkText').value;
  const msg = encodeURIComponent(`💗 MamaCare — meri pregnancy journey dekho!\n${link}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function savePartnerPerms() {
  const perms = PARTNER_PERMS.filter(p => document.getElementById('perm_' + p.id)?.checked).map(p => p.id);
  if (window.supa && window.user) {
    window.supa.from('user_profile').update({ partner_perms: perms.join(',') }).eq('id', window.user.id).then(() => {
      const saved = document.getElementById('partnerPermSaved');
      if (saved) { saved.textContent = '✅ Saved!'; saved.style.opacity = '1'; setTimeout(() => saved.style.opacity = '0', 2000); }
    });
  }
}

function revokeAllAccess() {
  if (!confirm('Sab partner access revoke karein?')) return;
  if (window.supa && window.user) {
    window.supa.from('user_profile').update({ partner_token: null, partner_email: null }).eq('id', window.user.id).then(() => {
      showToast('✅ Access revoked!');
      document.getElementById('activePartnerCard').style.display = 'none';
    });
  }
}

// Check if viewing as partner
function checkPartnerView() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('partner_view');
  if (!token) return;
  // Show partner view mode banner
  document.body.insertAdjacentHTML('afterbegin', `
    <div style="background:linear-gradient(135deg,var(--rose),var(--peach));color:white;padding:10px 20px;text-align:center;font-size:13px;font-weight:500;position:sticky;top:0;z-index:999">
      👀 Aap Partner View Mode mein hain — read only
    </div>`);
}
checkPartnerView();

// ═══════════════════════════════════════════
// 3. WEEKLY PDF REPORT
// ═══════════════════════════════════════════
let reportData = {};

async function generateReport() {
  const btn = document.getElementById('generateReportBtn');
  const status = document.getElementById('reportStatus');
  if (!window.user || !window.supa) {
    if (status) status.textContent = '⚠️ Login karein report generate karne ke liye.';
    return;
  }
  btn.disabled = true;
  btn.textContent = '⏳ Generating...';
  if (status) status.textContent = 'Data fetch ho raha hai...';

  try {
    const uid = window.user.id;
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const [profileRes, weightRes, sleepRes, foodRes, waterRes, medRes, moodRes, apptRes] = await Promise.all([
      window.supa.from('user_profile').select('*').eq('id', uid).maybeSingle(),
      window.supa.from('weight_logs').select('*').eq('user_id', uid).gte('logged_at', weekAgo + 'T00:00:00').order('logged_at'),
      window.supa.from('sleep_logs').select('*').eq('user_id', uid).gte('logged_at', weekAgo + 'T00:00:00').order('logged_at'),
      window.supa.from('food_logs').select('*').eq('user_id', uid).gte('logged_at', weekAgo + 'T00:00:00'),
      window.supa.from('water_logs').select('*').eq('user_id', uid).gte('log_date', weekAgo),
      window.supa.from('medicines').select('name,dose,time_of_day').eq('user_id', uid).eq('is_active', true),
      window.supa.from('mood_logs').select('mood_type,logged_at').eq('user_id', uid).gte('logged_at', weekAgo + 'T00:00:00').order('logged_at'),
      window.supa.from('appointments').select('*').eq('user_id', uid).gte('appt_date', today).order('appt_date').limit(5),
    ]);

    reportData = {
      profile: profileRes.data,
      weights: weightRes.data || [],
      sleepLogs: sleepRes.data || [],
      foods: foodRes.data || [],
      waters: waterRes.data || [],
      medicines: medRes.data || [],
      moods: moodRes.data || [],
      appointments: apptRes.data || [],
      generatedAt: new Date().toLocaleString('hi-IN'),
      weekRange: `${weekAgo} to ${today}`,
    };

    renderReportPreview(reportData);
    document.getElementById('reportPreview').style.display = 'block';
    if (status) status.textContent = '✅ Report ready!';
  } catch (e) {
    if (status) status.textContent = '❌ Error: ' + e.message;
  }

  btn.disabled = false;
  btn.textContent = '📊 Generate Report';
}

function renderReportPreview(d) {
  const p = d.profile || {};
  const due = p.due_date ? new Date(p.due_date) : null;
  const now = new Date();
  const week = due ? Math.min(40, Math.floor((now - new Date(due.getTime() - 280 * 86400000)) / (7 * 86400000)) + 1) : '—';

  // Weight stats
  const weights = d.weights;
  const avgWt = weights.length ? (weights.reduce((a, w) => a + parseFloat(w.weight_kg), 0) / weights.length).toFixed(1) : '—';
  const lastWt = weights.length ? weights[weights.length - 1].weight_kg : '—';

  // Sleep stats
  const sleeps = d.sleepLogs;
  const avgSleep = sleeps.length ? (sleeps.reduce((a, s) => a + parseFloat(s.duration_hrs), 0) / sleeps.length).toFixed(1) : '—';

  // Nutrition
  const avgCal = d.foods.length ? Math.round(d.foods.reduce((a, f) => a + (f.calories || 0), 0) / 7) : '—';
  const avgWater = d.waters.length ? (d.waters.reduce((a, w) => a + w.glasses_count, 0) / d.waters.length).toFixed(1) : '—';

  // Mood
  const moodCount = {};
  d.moods.forEach(m => moodCount[m.mood_type] = (moodCount[m.mood_type] || 0) + 1);
  const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];

  const el = document.getElementById('reportContent');
  el.innerHTML = `
    <div style="border:2px solid var(--rose);border-radius:14px;padding:18px;margin-bottom:14px">
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:var(--warm);margin-bottom:4px">MamaCare — Weekly Health Report</div>
      <div style="font-size:12px;color:var(--muted)">Generated: ${d.generatedAt} | Period: ${d.weekRange}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <tr style="background:rgba(232,160,168,.1)"><td style="padding:8px 12px;font-weight:600;width:40%">Patient Name</td><td style="padding:8px 12px">${p.name || window.user?.email || '—'}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600">Due Date</td><td style="padding:8px 12px">${p.due_date ? new Date(p.due_date).toLocaleDateString('hi-IN', {day:'numeric',month:'long',year:'numeric'}) : '—'}</td></tr>
      <tr style="background:rgba(232,160,168,.1)"><td style="padding:8px 12px;font-weight:600">Current Week</td><td style="padding:8px 12px">Week ${week} of 40</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600">⚖️ Current Weight</td><td style="padding:8px 12px">${lastWt} kg | 7-day avg: ${avgWt} kg</td></tr>
      <tr style="background:rgba(232,160,168,.1)"><td style="padding:8px 12px;font-weight:600">😴 Sleep Average</td><td style="padding:8px 12px">${avgSleep} hours/night (${sleeps.length} entries)</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600">🔥 Avg Daily Calories</td><td style="padding:8px 12px">${avgCal} kcal</td></tr>
      <tr style="background:rgba(232,160,168,.1)"><td style="padding:8px 12px;font-weight:600">💧 Avg Water Intake</td><td style="padding:8px 12px">${avgWater} glasses/day</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600">😊 Most Common Mood</td><td style="padding:8px 12px">${topMood ? topMood[0] + ' (' + topMood[1] + 'x)' : '—'}</td></tr>
      <tr style="background:rgba(232,160,168,.1)"><td style="padding:8px 12px;font-weight:600">💊 Active Medicines</td><td style="padding:8px 12px">${d.medicines.map(m => m.name).join(', ') || '—'}</td></tr>
    </table>
    ${d.appointments.length ? `
    <div style="margin-top:14px;padding:12px 14px;background:rgba(106,184,154,.08);border-radius:12px">
      <div style="font-weight:600;font-size:13px;margin-bottom:8px">📅 Upcoming Appointments</div>
      ${d.appointments.map(a => `<div style="font-size:13px;padding:4px 0">• ${a.title} — ${new Date(a.appt_date).toLocaleDateString('hi-IN')}</div>`).join('')}
    </div>` : ''}
    <div style="margin-top:14px;padding:12px 14px;border:1.5px dashed var(--blush);border-radius:12px">
      <div style="font-weight:600;font-size:13px;margin-bottom:6px">📝 Doctor Notes (Fill karein)</div>
      <div style="height:60px;border-bottom:1px solid var(--blush)"></div>
      <div style="height:60px"></div>
    </div>`;
}

async function downloadPDF() {
  const status = document.getElementById('reportStatus');
  // Use browser print as PDF fallback (jsPDF CDN load karo)
  const printWin = window.open('', '_blank');
  const content = document.getElementById('reportContent').innerHTML;
  printWin.document.write(`
    <!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <title>MamaCare Weekly Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
    <style>
      body{font-family:'DM Sans',sans-serif;padding:30px;color:#4a2c2a;max-width:700px;margin:0 auto}
      h1{font-family:'Cormorant Garamond',serif;font-size:1.8rem;margin-bottom:4px}
      table{width:100%;border-collapse:collapse}
      td{padding:8px 12px;border-bottom:1px solid #f5d5d8;font-size:13px}
      @media print{body{padding:15px}}
    </style>
    </head><body>
    ${content}
    <script>window.onload=()=>window.print();</script>
    </body></html>`);
  printWin.document.close();
}

function shareReport() {
  if (navigator.share) {
    navigator.share({ title: 'MamaCare Weekly Report', text: 'Meri pregnancy weekly health report', url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => showToast('Link copied!'));
  }
}

// ═══════════════════════════════════════════
// 4. RELAXATION AUDIO + YOUTUBE
// ═══════════════════════════════════════════
let audioCtx = null;
let activeSources = {};
let masterGain = null;
let sleepTimerTO = null;

// Sound definitions — generated via Web Audio API (no CDN files needed)
const SOUNDS = [
  { id: 'rain',      icon: '🌧️', name: 'Rain',          color: '#7ab8d4' },
  { id: 'ocean',     icon: '🌊', name: 'Ocean Waves',   color: '#4a98c4' },
  { id: 'forest',    icon: '🌲', name: 'Forest',        color: '#6ab89a' },
  { id: 'heartbeat', icon: '💓', name: 'Heartbeat',     color: '#e8a0a8' },
  { id: 'womb',      icon: '🌸', name: 'Womb Sound',    color: '#c97b7b' },
  { id: 'whitenoise',icon: '🌀', name: 'White Noise',   color: '#b8a8d0' },
  { id: 'lullaby',   icon: '🎵', name: 'Lullaby Tone',  color: '#d4a853' },
  { id: 'creek',     icon: '💧', name: 'Creek',         color: '#4da888' },
];

function initRelaxPage() {
  renderSoundGrid();
  showMeditation('anxiety', document.querySelector('[data-med="anxiety"]'));
  showVideos('yoga', document.querySelector('[data-vcat="yoga"]'));
}

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function renderSoundGrid() {
  const g = document.getElementById('soundGrid');
  if (!g) return;
  g.innerHTML = SOUNDS.map(s => `
    <div id="soundBtn_${s.id}" onclick="FEAT.toggleSound('${s.id}')" style="padding:14px 8px;border-radius:16px;border:1.5px solid rgba(232,160,168,.2);background:white;cursor:pointer;text-align:center;transition:.22s">
      <div style="font-size:30px;margin-bottom:5px">${s.icon}</div>
      <div style="font-size:11px;font-weight:500;color:var(--muted)">${s.name}</div>
    </div>`).join('');
}

function toggleSound(id) {
  if (activeSources[id]) {
    stopSound(id); return;
  }
  playSound(id);
}

function playSound(id) {
  const ctx = getAudioCtx();
  const sound = SOUNDS.find(s => s.id === id);
  if (!sound) return;

  let src;
  switch(id) {
    case 'rain':       src = createRain(ctx);       break;
    case 'ocean':      src = createOcean(ctx);      break;
    case 'forest':     src = createForest(ctx);     break;
    case 'heartbeat':  src = createHeartbeat(ctx);  break;
    case 'womb':       src = createWomb(ctx);       break;
    case 'whitenoise': src = createWhiteNoise(ctx); break;
    case 'lullaby':    src = createLullaby(ctx);    break;
    case 'creek':      src = createCreek(ctx);      break;
    default: return;
  }

  src.connect(masterGain);
  activeSources[id] = src;

  // Update UI
  const btn = document.getElementById('soundBtn_' + id);
  if (btn) { btn.style.borderColor = sound.color; btn.style.background = sound.color + '22'; }
  document.getElementById('nowPlaying').textContent = sound.icon;
  document.getElementById('nowPlayingName').textContent = sound.name + ' 🎵';
}

function stopSound(id) {
  if (!activeSources[id]) return;
  try { activeSources[id].stop(); } catch(e) {}
  delete activeSources[id];
  const btn = document.getElementById('soundBtn_' + id);
  if (btn) { btn.style.borderColor = 'rgba(232,160,168,.2)'; btn.style.background = 'white'; }
  if (!Object.keys(activeSources).length) {
    document.getElementById('nowPlaying').textContent = '🎵';
    document.getElementById('nowPlayingName').textContent = 'Koi sound nahi chal raha';
  }
}

function stopAll() {
  Object.keys(activeSources).forEach(id => stopSound(id));
}

function setVolume(v) {
  if (masterGain) masterGain.gain.setTargetAtTime(parseFloat(v), getAudioCtx().currentTime, 0.1);
}

let sleepCountdownInterval = null;

function setSleepTimer(mins) {
  if (sleepTimerTO) { clearTimeout(sleepTimerTO); sleepTimerTO = null; }
  if (sleepCountdownInterval) { clearInterval(sleepCountdownInterval); sleepCountdownInterval = null; }
  const display = document.getElementById('timerDisplay');
  if (!mins || mins === '0') { if (display) display.textContent = ''; return; }
  const ms = parseInt(mins) * 60 * 1000;
  let remaining = ms;
  sleepCountdownInterval = setInterval(() => {
    remaining -= 1000;
    if (display) {
      const m = Math.floor(remaining / 60000), s = Math.floor((remaining % 60000) / 1000);
      display.textContent = `⏱ ${m}:${s.toString().padStart(2,'0')} remaining`;
    }
    if (remaining <= 0) {
      clearInterval(sleepCountdownInterval);
      sleepCountdownInterval = null;
      stopAll();
      if (display) display.textContent = '✅ Timer complete — sweet dreams! 🌙';
    }
  }, 1000);
}

// ── Audio generators (Web Audio API) ──
function createWhiteNoise(ctx) {
  const bufSize = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true; src.start();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = 1200;
  src.connect(filter);
  // Return filter as connectable node
  filter._stop = () => src.stop();
  filter.stop = filter._stop;
  return filter;
}

function createRain(ctx) {
  const noise = createWhiteNoise(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass'; filter.frequency.value = 4000; filter.Q.value = 0.5;
  const gain = ctx.createGain(); gain.gain.value = 0.6;
  noise.connect(filter); filter.connect(gain);
  gain.stop = () => { try{noise.stop();}catch(e){} };
  return gain;
}

function createOcean(ctx) {
  const src = createWhiteNoise(ctx);
  const gain = ctx.createGain();
  // LFO for wave effect
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.1; lfoGain.gain.value = 0.4;
  lfo.connect(lfoGain); lfoGain.connect(gain.gain);
  lfo.start(); gain.gain.value = 0.5;
  src.connect(gain);
  gain.stop = () => { try{src.stop();}catch(e){} try{lfo.stop();}catch(e){} };
  return gain;
}

function createForest(ctx) {
  // Birds + gentle wind
  const wind = createWhiteNoise(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = 600;
  const gain = ctx.createGain(); gain.gain.value = 0.3;
  wind.connect(filter); filter.connect(gain);
  gain.stop = () => { try{wind.stop();}catch(e){} };
  return gain;
}

function createHeartbeat(ctx) {
  const gain = ctx.createGain(); gain.gain.value = 0;
  const bpm = 140; // fetal heartbeat ~140 bpm
  const interval = 60 / bpm;
  let running = true;

  function beat() {
    if (!running) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = 80; osc.type = 'sine';
    g.gain.setValueAtTime(0.7, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(g); g.connect(masterGain);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
    // Double beat (lub-dub)
    setTimeout(() => {
      if (!running) return;
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.frequency.value = 65; osc2.type = 'sine';
      g2.gain.setValueAtTime(0.5, ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc2.connect(g2); g2.connect(masterGain);
      osc2.start(); osc2.stop(ctx.currentTime + 0.1);
    }, 120);
    setTimeout(beat, interval * 1000);
  }
  beat();
  gain.stop = () => { running = false; };
  return gain;
}

function createWomb(ctx) {
  // Low rumble + slow whoosh
  const src = createWhiteNoise(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = 300;
  const gain = ctx.createGain(); gain.gain.value = 0.6;
  src.connect(filter); filter.connect(gain);
  gain.stop = () => { try{src.stop();}catch(e){} };
  return gain;
}

function createLullaby(ctx) {
  // Simple pentatonic lullaby loop
  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
  const pattern = [0,2,4,2,1,0,3,2];
  let idx = 0; let running = true;

  function playNote() {
    if (!running) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[pattern[idx % pattern.length]];
    idx++;
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(g); g.connect(masterGain);
    osc.start(); osc.stop(ctx.currentTime + 0.8);
    setTimeout(playNote, 900);
  }
  playNote();
  const gain = ctx.createGain();
  gain.stop = () => { running = false; };
  return gain;
}

function createCreek(ctx) {
  const src = createWhiteNoise(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass'; filter.frequency.value = 2000; filter.Q.value = 0.3;
  const gain = ctx.createGain(); gain.gain.value = 0.5;
  src.connect(filter); filter.connect(gain);
  gain.stop = () => { try{src.stop();}catch(e){} };
  return gain;
}

// ── Guided Meditation Scripts ──
const MEDITATIONS = {
  anxiety: {
    title: 'Anxiety Release Meditation (5 min)',
    script: `
      <p><strong>Comfortable position mein baitho ya lait jao.</strong> Ankhein band karo. 🌸</p>
      <p><em>Ek gehri saans lo... aur chhodho.</em></p>
      <p>Apne haathon ko apne pet pe rakho. Baby ki warmth feel karo. Yeh connection real hai — ek insaan bana raha hai aapka sharir.</p>
      <p><em>Saans lo... roko... chhodho.</em></p>
      <p>Anxiety feel hoti hai toh use acknowledge karo: <strong>"Haan, main scared hun. Aur yeh normal hai."</strong> Darr ko judge mat karo — yeh care hai, weakness nahi.</p>
      <p><em>Naak se saans lo... 4 counts... roko... 4... chhodho... 4.</em></p>
      <p>Ab imagine karo ek warm golden light apne sir se shuru ho ke poore body mein faili hai. Jahan bhi tension hai — shoulders, jaw, hands — wahan light jaati hai aur tension pighal jaati hai.</p>
      <p>Apne baby ko internally ek message bhejo: <strong>"Main tumhe protect karti hun. Hum safe hain. Sab theek hoga."</strong></p>
      <p><em>Jab ready ho — aankhein kholo. Aaj ke liye kaafi hai. 💗</em></p>`,
  },
  sleep: {
    title: 'Sleep Induction Meditation (5 min)',
    script: `
      <p><strong>Left side pe aram se lait jao.</strong> Pillow ko ghutno ke beech, pet ke neeche. 🌙</p>
      <p><em>Aankhein band. Koi kaam nahi karna. Bas lait rehna.</em></p>
      <p>Apne pair ki ungliyon se shuru karo — unhe conscious rup se dheel do. Pair... ghutne... jaanghe... sab dheel. Upar badhte jao — kamar... pet... chaati... kandhe... chehra.</p>
      <p>Ab imagine karo aap ek warm soft cloud pe hain. Cloud aapko gently rock kar raha hai — bilkul jaise baby ko rock karte hain. Slow... gentle... safe.</p>
      <p><em>Saans andar... dhire... saans bahar... aur dhire...</em></p>
      <p>Baby bhi rest kar raha hai aapke saath. Dono ek rhythm mein — aapki heartbeat baby ka lullaby hai. 💗</p>
      <p><em>Koi tense nahi. Koi kaam nahi. Sirf rest. Sirf yeh pal...</em></p>`,
  },
  baby: {
    title: 'Baby Bonding Meditation (5 min)',
    script: `
      <p><strong>Haath pet pe rakho.</strong> Eyes closed. Deep breath. 👶</p>
      <p>Feel karo — under your hands — ek complete, perfect, growing human. Har din naya kuch develop ho raha hai.</p>
      <p><em>Apne baby se baat karo — andar andar ya zor se:</em></p>
      <p><strong>"Namaste, baby. Main hun — tumhari maa."</strong></p>
      <p><strong>"Tum safe ho. Tum loved ho. Tum wanted ho."</strong></p>
      <p>Imagine karo baby tumhari awaaz sun raha hai — week 18 se actually sun sakta hai. Kya message dena chahti ho apne baby ko? Usse woh bolo — mentally ya zor se.</p>
      <p><em>Baby ke liye ek wish karo — health, happiness, strength...</em></p>
      <p>Yeh bond delivery se pehle hi shuru ho jaata hai. Aap already ek amazing maa ho. 💗</p>`,
  },
  labor: {
    title: 'Labor Preparation Meditation (5 min)',
    script: `
      <p><strong>Comfortable position. Deep breath.</strong> 🌟</p>
      <p>Delivery ka waqt aayega jab aayega. Aaj ka kaam — apne aap ko prepare karna, darr ko kam karna.</p>
      <p><em>Saans lo aur yeh affirm karo:</em></p>
      <p><strong>"Mera sharir jaanta hai kya karna hai."</strong></p>
      <p><strong>"Billions of women ne yeh kiya hai. Main bhi kar sakti hun."</strong></p>
      <p>Jab contraction imagine karo — use enemy ki tarah mat dekho. Yeh WAVE hai — upar jaati hai, peak karti hai, neeche aati hai. Har wave baby ke aane ke ek step closer hai.</p>
      <p><em>Contraction ke waqt: saans andar... hold... saans bahar — slow, steady, ocean ki tarah.</em></p>
      <p>Aap strong ho. Aap ready ho. Aapka baby ready hai. Sab theek hoga. 💗</p>`,
  },
};

function showMeditation(key, btn) {
  document.querySelectorAll('#meditationTabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const m = MEDITATIONS[key];
  if (!m) return;
  const el = document.getElementById('meditationContent');
  if (el) el.innerHTML = `<div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin-bottom:12px;color:var(--accent)">${m.title}</div>${m.script}`;
}

let speechSynth = null;
function readAloud() {
  if (!window.speechSynthesis) { alert('Aapka browser text-to-speech support nahi karta.'); return; }
  window.speechSynthesis.cancel();
  const el = document.getElementById('meditationContent');
  if (!el) return;
  const text = el.innerText;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'hi-IN'; utt.rate = 0.8; utt.pitch = 1;
  window.speechSynthesis.speak(utt);
}

// ── YouTube Videos ──
const VIDEOS = {
  yoga: [
    { id: 'KnbhJDmVHPU', title: 'Prenatal Yoga — First Trimester (Safe & Gentle)', desc: 'Week 1-12 ke liye safe yoga routine. 20 min.', channel: 'Yoga with Adriene' },
    { id: 'sTVjm86W8sE', title: 'Pregnancy Yoga — Second Trimester', desc: '14-27 weeks ke liye — back pain, hip flexibility.', channel: 'Brett Larkin Yoga' },
    { id: 'Yw81PVH6bGQ', title: 'Third Trimester Yoga for Labor Prep', desc: 'Squats, pelvic floor, breathing. 25 min.', channel: 'Prenatal Yoga Center' },
    { id: 'jlAMCHHSUj0', title: 'Pregnancy Stretches for Back Pain', desc: '10 min daily stretch — lower back relief.', channel: 'SarahBethYoga' },
  ],
  meditation: [
    { id: 'ZToicYcHIOU', title: 'Pregnancy Meditation — Anxiety Relief', desc: 'Guided relaxation for anxious moms-to-be. 15 min.', channel: 'The Honest Guys' },
    { id: '4pLUleLFnY4', title: 'Sleep Meditation for Pregnant Women', desc: 'Deep sleep induction. Left side position. 20 min.', channel: 'Meditation Vacation' },
    { id: 'jPpUNAFHgDk', title: 'Baby Bonding Meditation', desc: 'Connect with your baby before birth. 10 min.', channel: 'Mama Natural' },
  ],
  nutrition: [
    { id: 'xBqDSjVB_yI', title: 'Pregnancy Diet — What to Eat Each Trimester', desc: 'Complete Indian pregnancy diet guide.', channel: 'Mommy & Me' },
    { id: 'GiRKpoBbdbs', title: 'Foods to Avoid in Pregnancy', desc: 'Complete list — safe vs unsafe foods.', channel: 'Doctor Mike' },
    { id: 'Qv7gHY4JqJI', title: 'Iron Rich Foods for Pregnancy Anaemia', desc: 'Indian diet tips for iron deficiency.', channel: 'Dietitian Lavleen' },
  ],
  labor: [
    { id: 'wMvVTGKHscc', title: 'What to Expect During Labor & Delivery', desc: 'Complete guide — stages of labor explained.', channel: 'Mama Natural' },
    { id: 'M6aKVAqbp70', title: 'Lamaze Breathing Techniques', desc: 'Practice these patterns — labor pain management.', channel: 'Lamaze International' },
    { id: 'VzMxjrFBKaU', title: 'Hospital Bag Packing Guide', desc: 'What to actually pack — moms share tips.', channel: 'What to Expect' },
  ],
  baby: [
    { id: 'Hj0h-mFfHBQ', title: 'Newborn Care Basics for New Parents', desc: 'Bathing, feeding, swaddling — step by step.', channel: 'IntermountainMoms' },
    { id: 'WXJRM6C5YNE', title: 'Breastfeeding Tips for New Moms', desc: 'Latch, positions, common problems — Hindi.', channel: 'UNICEF India' },
    { id: 'Jp7bJ23FUlc', title: 'Baby Sleep Safety (Safe to Sleep)', desc: 'SIDS prevention, safe sleep environment.', channel: 'Safe to Sleep' },
  ],
};

function showVideos(cat, btn) {
  document.querySelectorAll('#videoTabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const vids = VIDEOS[cat] || [];
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  grid.innerHTML = vids.map(v => `
    <div style="background:white;border-radius:16px;overflow:hidden;border:1.5px solid rgba(232,160,168,.15)">
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden">
        <iframe
          src="https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1"
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
          title="${v.title}">
        </iframe>
      </div>
      <div style="padding:14px">
        <div style="font-weight:600;font-size:13.5px;color:var(--warm);margin-bottom:4px">${v.title}</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.55;margin-bottom:6px">${v.desc}</div>
        <span class="pill pill-g" style="font-size:10.5px">${v.channel}</span>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#4a2c2a;color:white;padding:10px 20px;border-radius:50px;font-size:13px;font-weight:500;z-index:9999;animation:fadeUp .3s ease';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function flashSaveBadge(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

// ═══════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════
window.FEAT = {
  // Reminders
  requestNotifPerm, toggleWaterReminder, updateWaterInterval,
  toggleKickReminder, setMoodReminder,
  // Partner
  generatePartnerLink, copyPartnerLink, shareWhatsApp,
  savePartnerPerms, revokeAllAccess,
  // Report
  generateReport, downloadPDF, shareReport,
  // Relax
  toggleSound, stopAll, setVolume, setSleepTimer,
  showMeditation, readAloud, showVideos,
};


// ═══════════════════════════════════════════════════════════
// SOURCE: app-india.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — app-india.js v6.2
 * India-specific features:
 *  1. Government Schemes Guide
 *  2. Ayurvedic & Home Remedies
 *  3. Offline Emergency Card
 *  4. Daily Symptom Diary
 *  5. Global Search Bar
 */
// ════════════════════════════════════════
// 1. GOVERNMENT SCHEMES
// ════════════════════════════════════════
const GOV_SCHEMES = [
  {
    name: 'PMMVY — Pradhan Mantri Matru Vandana Yojana',
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
      { name: 'Adrak (Ginger)', use: 'Nausea ke liye — 1 inch fresh ginger chai mein ya paani mein ubal ke. Clinical evidence confirmed.', icon: 'leaf' },
      { name: 'Saunf (Fennel)', use: 'Digestive — 1 tsp seeds paani mein ubal ke peo. Bloating + gas relief.', icon: 'sprout' },
      { name: 'Nimbu (Lemon)', use: 'Nausea — lemon smell ya nimbu paani. Safe and effective.', icon: 'citrus' },
      { name: 'Coconut Water', use: 'Electrolytes + hydration — khaali pet peo. Natural ORS.', icon: 'droplet' },
      { name: 'Mishri + Saunf', use: 'Morning nausea — khali pet 1 tsp mishri + saunf chaba ke khaao.', icon: 'candy' },
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
      { name: 'Kesar (Saffron)', use: '1-2 strands warm milk mein roz — complexion, mood, immunity. Traditional belief + mild antidepressant properties.', icon: 'flower-2' },
      { name: 'Haldi (Turmeric)', use: '½ tsp warm milk mein — anti-inflammatory, immunity. Avoid high doses.', icon: 'circle' },
      { name: 'Ajwain (Carom)', use: 'Digestive, gas, heartburn. ½ tsp roasted seeds chew karo.', icon: 'sprout' },
      { name: 'Dates (Khajoor)', use: '2-3 roz — natural iron + labor preparation. Week 36+ mein cervical ripening evidence.', icon: 'palmtree' },
      { name: 'Amla (Indian Gooseberry)', use: 'Vit C — immunity + iron absorption + constipation. Fresh ya murabba.', icon: 'circle' },
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
      { name: 'Dates (Week 36+)', use: '6 dates roz — cervical ripening studies: shorter labor, less augmentation needed', icon: 'palmtree' },
      { name: 'Raspberry Leaf Tea', use: 'Week 32+ — uterine toning. 1 cup/day only. Do not use earlier.', icon: 'leaf' },
      { name: 'Sesame Seeds (Til)', use: 'Iron + calcium — til ke laddoo. Traditional winter pregnancy food.', icon: 'circle' },
      { name: 'Gondh Laddoo', use: 'Post-delivery — energy, milk production, back strength. Traditional postpartum food.', icon: 'cookie' },
      { name: 'Ghee (Moderate)', use: 'Joint lubrication, baby brain development. 1-2 tsp daily ok. Excess avoid (calories).', icon: 'droplet' },
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
      { name: 'Panjiri', use: 'Traditional postpartum food — atta, ghee, gondh, dry fruits. Energy + galactagogue.', icon: 'cookie' },
      { name: 'Ajwain + Gur Water', use: 'Uterine healing + digestive. 1 tsp ajwain + gur in warm water, 2-3 days postpartum.', icon: 'droplet' },
      { name: 'Methi (Fenugreek)', use: 'Milk supply booster — methi laddoo or methi ki sabzi. Evidence-backed galactagogue.', icon: 'sprout' },
      { name: 'Satavari (Shatavari)', use: 'Ayurvedic galactagogue — powder in warm milk. Safe for breastfeeding.', icon: 'leaf' },
      { name: 'Mustard Oil Massage', use: 'Traditional baby massage — warming, bone development (traditional belief). Use gentle pressure.', icon: 'droplet' },
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
    <div class="scheme-card" style="border-left:4px solid ${s.color}">
      <div class="scheme-header">
        <div class="scheme-icon" style="background:${s.color}20">
          <i data-lucide="${getSchemeIcon(s.name)}" style="color:${s.color}"></i>
        </div>
        <div class="scheme-title-section">
          <h3 class="scheme-title">${s.name}</h3>
          <div class="scheme-badge" style="background:${s.color};color:white">${s.badge}</div>
        </div>
      </div>
      <p class="scheme-benefit">${s.benefit}</p>
      <div class="scheme-section">
        <div class="scheme-section-title">
          <i data-lucide="check-circle" style="width:16px;height:16px"></i>
          Eligibility
        </div>
        <p class="scheme-text">${s.eligibility}</p>
      </div>
      <div class="scheme-section">
        <div class="scheme-section-title">
          <i data-lucide="list" style="width:16px;height:16px"></i>
          How to Apply
        </div>
        <ol class="scheme-steps">
          ${s.howto.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      <div class="scheme-section">
        <div class="scheme-section-title">
          <i data-lucide="file-text" style="width:16px;height:16px"></i>
          Documents Required
        </div>
        <div class="scheme-docs">
          ${s.docs.map(doc => `<span class="doc-tag">${doc}</span>`).join('')}
        </div>
      </div>
      ${s.link ? `<a href="${s.link}" target="_blank" class="scheme-link">
        <i data-lucide="external-link" style="width:16px;height:16px"></i>
        Official Website
      </a>` : ''}
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}

function getSchemeIcon(name) {
  if (name.includes('PMMVY')) return 'landmark';
  if (name.includes('JSY')) return 'hospital';
  if (name.includes('Ayushman') || name.includes('JAY')) return 'shield-plus';
  if (name.includes('JSSK')) return 'heart-pulse';
  if (name.includes('Ration') || name.includes('PMGKAY')) return 'wheat';
  if (name.includes('Iron') || name.includes('Folic')) return 'pill';
  return 'info';
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
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--green);margin-bottom:8px"><i data-lucide="check-circle" style="width:14px;height:14px;display:inline"></i> Safe & Beneficial</div>
      ${data.safe.map(t => `<div style="background:white;border-radius:13px;padding:12px 14px;margin-bottom:7px;border-left:3px solid var(--green)"><div style="font-weight:600;font-size:13.5px;margin-bottom:3px"><i data-lucide="${t.icon}" style="width:16px;height:16px;display:inline;color:var(--green)"></i> ${t.name}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${t.use}</div></div>`).join('')}
    </div>
    <div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#e05c5c;margin-bottom:8px"><i data-lucide="alert-triangle" style="width:14px;height:14px;display:inline"></i> Avoid in Pregnancy</div>
      ${data.avoid.map(t => `<div style="background:#fff5f5;border-radius:13px;padding:12px 14px;margin-bottom:7px;border-left:3px solid #e05c5c"><div style="font-weight:600;font-size:13.5px;margin-bottom:3px"><i data-lucide="x-circle" style="width:16px;height:16px;display:inline;color:#e05c5c"></i> ${t.name}</div><div style="font-size:12.5px;color:var(--muted);line-height:1.65">${t.reason}</div></div>`).join('')}
    </div>`;
  if (window.lucide) lucide.createIcons();
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
      { page:'india', icon:'landmark', label:'Schemes' },
      { page:'ayurveda', icon:'leaf', label:'Ayurveda' },
      { page:'sympdiary', icon:'notebook-pen', label:'Diary' },
      { page:'emergencycard', icon:'alert-circle', label:'Emergency Card' },
    ].forEach(t => {
      if (!document.querySelector(`#moreMenu [data-page="${t.page}"]`)) {
        const div = document.createElement('div');
        div.className='more-item'; div.dataset.page=t.page;
        div.innerHTML=`<div class="mi-icon"><i data-lucide="${t.icon}"></i></div><div class="mi-label">${t.label}</div>`;
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


// ═══════════════════════════════════════════════════════════
// SOURCE: app-monetize.js
// ═══════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════
// SOURCE: app-onboard.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — app-onboard.js v6.1
 * First-time onboarding wizard
 * Shows after first login if profile is incomplete
 */

let onboardStep = 1;

function injectOnboardingHTML() {
  if (document.getElementById('onboardOverlay')) return;
  document.body.insertAdjacentHTML('beforeend', `
<div id="onboardOverlay" style="display:none;position:fixed;inset:0;z-index:2000;background:linear-gradient(135deg,#fdf6f0,#fce8e8 50%,#fdf0e8);overflow-y:auto;padding:20px">
  <div style="max-width:440px;margin:0 auto;padding:20px 0">

    <!-- Progress dots -->
    <div style="display:flex;justify-content:center;gap:8px;margin-bottom:28px" id="onboardDots">
      <div class="ob-dot ob-dot-1 active"></div>
      <div class="ob-dot ob-dot-2"></div>
      <div class="ob-dot ob-dot-3"></div>
    </div>

    <!-- STEP 1 — Welcome + Language -->
    <div id="ob-step-1" class="ob-card">
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:56px;margin-bottom:12px">🌸</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:var(--warm)">MamaCare mein<br>Aapka Swagat! 💗</h2>
        <p style="font-size:13.5px;color:var(--muted);line-height:1.7;margin-top:8px">Aapki pregnancy journey ko safe, informed aur yaaadgaar banana humara lakshy hai. Chalo shuru karte hain! ✨</p>
      </div>
      <div style="margin-bottom:16px">
        <label style="font-size:13px;font-weight:600;color:var(--warm);display:block;margin-bottom:8px">🌍 Apni Language chuniye</label>
        <div style="display:flex;gap:7px;flex-wrap:wrap">
          <button class="ob-lang-btn active" data-lang="hinglish">Hinglish</button>
          <button class="ob-lang-btn" data-lang="hi">हिंदी</button>
          <button class="ob-lang-btn" data-lang="en">English</button>
          <button class="ob-lang-btn" data-lang="ta">தமிழ்</button>
          <button class="ob-lang-btn" data-lang="bn">বাংলা</button>
          <button class="ob-lang-btn" data-lang="mr">मराठी</button>
          <button class="ob-lang-btn" data-lang="te">తెలుగు</button>
        </div>
      </div>
      <button class="btn btn-p" style="width:100%;font-size:14px;padding:14px" onclick="ONBOARD.next()">Aage Badho →</button>
    </div>

    <!-- STEP 2 — Name + Due Date -->
    <div id="ob-step-2" class="ob-card" style="display:none">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:44px;margin-bottom:10px">🗓️</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.7rem;font-weight:300;color:var(--warm)">Apni details daalo</h2>
        <p style="font-size:13px;color:var(--muted);margin-top:4px">Aapki pregnancy tracking ke liye zaroori hai</p>
      </div>
      <div style="margin-bottom:14px">
        <label>Aapka Naam (optional)</label>
        <input type="text" id="ob-name" placeholder="Ananya, Priya..."/>
      </div>
      <div style="margin-bottom:14px">
        <label>Last Menstrual Period (LMP)</label>
        <input type="date" id="ob-lmp" onchange="ONBOARD.calcDueFromLMP()"/>
      </div>
      <div style="margin-bottom:14px">
        <label>Ya Direct Due Date daalo</label>
        <input type="date" id="ob-due"/>
      </div>
      <div id="ob-week-preview" style="display:none;background:linear-gradient(135deg,rgba(232,160,168,.12),rgba(247,196,168,.08));border-radius:14px;padding:14px;text-align:center;margin-bottom:14px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--warm)" id="ob-week-text"></div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-g" style="flex:1" onclick="ONBOARD.back()">← Wapas</button>
        <button class="btn btn-p" style="flex:2;font-size:14px" onclick="ONBOARD.next()">Aage →</button>
      </div>
    </div>

    <!-- STEP 3 — Health Info -->
    <div id="ob-step-3" class="ob-card" style="display:none">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:44px;margin-bottom:10px">⚖️</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.7rem;font-weight:300;color:var(--warm)">Health Details</h2>
        <p style="font-size:13px;color:var(--muted);margin-top:4px">Weight tracking ke liye — bilkul private</p>
      </div>
      <div style="margin-bottom:14px">
        <label>Pre-pregnancy Weight (kg)</label>
        <input type="number" id="ob-preweight" placeholder="55" step="0.1" min="30" max="200"/>
      </div>
      <div style="margin-bottom:14px">
        <label>Emergency Contact Naam</label>
        <input type="text" id="ob-ec-name" placeholder="Pati / Maa ka naam"/>
      </div>
      <div style="margin-bottom:14px">
        <label>Emergency Contact Phone</label>
        <input type="tel" id="ob-ec-phone" placeholder="9876543210"/>
      </div>
      <div style="margin-bottom:14px">
        <label>Blood Group (optional)</label>
        <select id="ob-blood">
          <option value="">-- Select --</option>
          <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
          <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
        </select>
      </div>
      <div style="margin-bottom:14px;padding:14px;background:rgba(216,140,154,0.06);border-radius:14px;border:1px solid rgba(216,140,154,0.2);">
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:13px;color:var(--text-main);">
          <input type="checkbox" id="ob-consent" style="width:18px;height:18px;margin-top:2px;flex-shrink:0;accent-color:var(--rose);">
          <span>Main agree karta/karti hun ki Mama Gyan meri health data securely store karega. 
          <a href="#" onclick="showPrivacyPolicy();return false;" style="color:var(--rose);">Privacy Policy</a> padh li hai. 
          (DPDP Act 2023 ke anusaar)</span>
        </label>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-g" style="flex:1" onclick="ONBOARD.back()">← Wapas</button>
        <button class="btn btn-p" style="flex:2;font-size:14px" onclick="ONBOARD.finish()">🌸 App Shuru Karein!</button>
      </div>
    </div>

  </div>
</div>

<style>
.ob-dot{width:10px;height:10px;border-radius:50%;background:var(--blush);transition:.3s}
.ob-dot.active{background:var(--rose);transform:scale(1.3)}
.ob-card{background:rgba(255,255,255,.92);border-radius:24px;padding:28px;box-shadow:0 20px 60px rgba(200,100,100,.12);border:1.5px solid rgba(232,160,168,.2);animation:fadeUp .35s ease}
.ob-lang-btn{padding:7px 14px;border-radius:50px;border:1.5px solid var(--blush);background:white;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;color:var(--muted);transition:.2s;font-weight:500}
.ob-lang-btn.active{background:var(--rose);color:white;border-color:var(--rose)}
</style>
`);

  // Language button handlers
  document.querySelectorAll('.ob-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ob-lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (window.MC?.applyLang) window.MC.applyLang(btn.dataset.lang);
      else if (window.applyLang) window.applyLang(btn.dataset.lang);
    });
  });
}

function showOnboarding() {
  injectOnboardingHTML();
  document.getElementById('onboardOverlay').style.display = 'block';
  document.body.style.overflow = 'hidden';
  onboardStep = 1;
  updateDots();
}

function hideOnboarding() {
  const el = document.getElementById('onboardOverlay');
  if (el) el.style.display = 'none';
  document.body.style.overflow = '';
  localStorage.setItem('mc_onboard_done', '1');
}

function updateDots() {
  for (let i = 1; i <= 3; i++) {
    const d = document.querySelector(`.ob-dot-${i}`);
    if (d) d.classList.toggle('active', i === onboardStep);
  }
}

function calcDueFromLMP() {
  const lmpVal = document.getElementById('ob-lmp')?.value;
  if (!lmpVal) return;
  const lmp = new Date(lmpVal);
  const due = new Date(lmp.getTime() + 280 * 86400000);
  const dueInput = document.getElementById('ob-due');
  if (dueInput) dueInput.value = due.toISOString().split('T')[0];
  const now = new Date();
  const elapsed = Math.floor((now - lmp) / 86400000);
  const week = Math.min(40, Math.floor(elapsed / 7) + 1);
  const preview = document.getElementById('ob-week-preview');
  const previewText = document.getElementById('ob-week-text');
  if (preview) preview.style.display = 'block';
  if (previewText) previewText.textContent = `🌸 Aap Week ${week} mein hain! Due: ${due.toLocaleDateString('hi-IN',{day:'numeric',month:'long',year:'numeric'})}`;
}

function obNext() {
  if (onboardStep === 1) {
    onboardStep = 2;
    document.getElementById('ob-step-1').style.display = 'none';
    document.getElementById('ob-step-2').style.display = 'block';
  } else if (onboardStep === 2) {
    onboardStep = 3;
    document.getElementById('ob-step-2').style.display = 'none';
    document.getElementById('ob-step-3').style.display = 'block';
  }
  updateDots();
}

function obBack() {
  if (onboardStep === 2) {
    onboardStep = 1;
    document.getElementById('ob-step-2').style.display = 'none';
    document.getElementById('ob-step-1').style.display = 'block';
  } else if (onboardStep === 3) {
    onboardStep = 2;
    document.getElementById('ob-step-3').style.display = 'none';
    document.getElementById('ob-step-2').style.display = 'block';
  }
  updateDots();
}

async function obFinish() {
  // DPDP consent check
  const consent = document.getElementById('ob-consent');
  if (consent && !consent.checked) {
    consent.parentElement.style.borderColor = 'var(--danger)';
    alert('Privacy Policy se agree karna zaroori hai.');
    return;
  }
  if (!window.user || !window.supa) { hideOnboarding(); return; }

  const name     = document.getElementById('ob-name')?.value.trim()    || null;
  const lmpDate  = document.getElementById('ob-lmp')?.value            || null;
  const dueDate  = document.getElementById('ob-due')?.value            || null;
  const preWt    = parseFloat(document.getElementById('ob-preweight')?.value) || null;
  const ecName   = document.getElementById('ob-ec-name')?.value.trim() || null;
  const ecPhone  = document.getElementById('ob-ec-phone')?.value.trim() || null;
  const blood    = document.getElementById('ob-blood')?.value           || null;

  // Build emergency contacts array
  const ec = ecName && ecPhone ? [{ name: ecName, phone: ecPhone, relation: 'Emergency' }] : [];

  // Upsert profile
  await window.supa.from('user_profile').upsert({
    id: window.user.id,
    email: window.user.email,
    ...(name     ? { name }          : {}),
    ...(lmpDate  ? { lmp_date: lmpDate } : {}),
    ...(dueDate  ? { due_date: dueDate }  : {}),
    ...(preWt    ? { pre_weight: preWt }  : {}),
    ...(blood    ? { blood_group: blood } : {}),
    ...(ec.length ? { emergency_contacts: ec } : {}),
  });

  // Apply to live UI
  if (dueDate) {
    const dd = document.getElementById('directDue');
    if (dd) { dd.value = dueDate; if (window.MC?.calcFromDue) window.MC.calcFromDue(); }
  }
  if (lmpDate) {
    const lmp = document.getElementById('lmpDate');
    if (lmp) lmp.value = lmpDate;
  }
  if (preWt) {
    const pw = document.getElementById('preWeight');
    if (pw) pw.value = preWt;
  }

  hideOnboarding();
  // Show welcome toast
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--rose),var(--peach));color:white;padding:12px 24px;border-radius:50px;font-size:13.5px;font-weight:600;z-index:9999;animation:fadeUp .3s ease;box-shadow:0 6px 20px rgba(200,100,100,.35)';
  t.textContent = name ? `🌸 Welcome, ${name}! MamaCare taiyaar hai!` : '🌸 MamaCare taiyaar hai! All the best!';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// Check if onboarding should show
async function checkOnboarding(user) {
  if (localStorage.getItem('mc_onboard_done')) return;
  if (!user || !window.supa) return;
  const { data } = await window.supa.from('user_profile').select('name,due_date').eq('id', user.id).maybeSingle();
  if (!data?.due_date) {
    setTimeout(showOnboarding, 800);
  }
}

// Expose applyLang on window for onboarding
if (window.MC) window.MC.applyLang = window.MC.applyLang || window.applyLang;

window.ONBOARD = {
  show: showOnboarding,
  hide: hideOnboarding,
  next: obNext,
  back: obBack,
  finish: obFinish,
  calcDueFromLMP,
  checkOnboarding,
};


// ═══════════════════════════════════════════════════════════
// SOURCE: app-smart.js
// ═══════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════
// SOURCE: app-tracker.js
// ═══════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════
// SOURCE: app-enhancements.js
// ═══════════════════════════════════════════════════════════

/**
 * MamaCare — app-enhancements.js
 * UI/UX Enhancements: Swipeable carousel, photo options, mood modals, etc.
 */

// ══════════════════════════════════════
// SWIPEABLE CAROUSEL FOR SLEEP TIPS
// ══════════════════════════════════════
let currentTipIndex = 0;
let startX = 0;
let isDragging = false;

function initSleepTipsCarousel() {
  const container = document.getElementById('sleepTipsGrid');
  if (!container) return;

  const SLEEP_TIPS = [
    {t:'Left Side Sleeping', icon:'moon', b:'From second trimester, sleep on your left side to avoid IVC compression and ensure optimal blood flow to baby.'},
    {t:'Pillow Support System', icon:'pillow', b:'Use 3 pillows: between knees, under belly, and for head elevation. This significantly improves sleep quality.'},
    {t:'Screen-Free Hour', icon:'smartphone-off', b:'Blue light suppresses melatonin by 50%. Turn off phone/TV 1 hour before bed for better sleep.'},
    {t:'Magnesium Supplement', icon:'pill', b:'200-400mg before bed helps with leg cramps and sleep quality. Consult your doctor first.'},
    {t:'Cool Room Temperature', icon:'thermometer', b:'Keep room at 18-20°C. Your body temperature is already higher during pregnancy.'},
    {t:'Heartburn Prevention', icon:'flame', b:'Avoid heavy meals 2-3 hours before bed. Elevate bed head by 30° to reduce acid reflux.'},
    {t:'Manage Night Urination', icon:'droplet', b:'Reduce fluids 2 hours before bed. Use dim night light to maintain melatonin levels.'},
    {t:'Consistent Schedule', icon:'clock', b:'Sleep and wake at same time daily. Circadian rhythm is the #1 factor for sleep quality.'},
  ];

  container.innerHTML = `
    <div class="tips-carousel">
      <div class="tips-track" id="tipsTrack">
        ${SLEEP_TIPS.map((tip, i) => `
          <div class="tip-card">
            <div class="tip-title">
              <i data-lucide="${tip.icon}" style="width:24px;height:24px"></i>
              ${tip.t}
            </div>
            <div class="tip-content">${tip.b}</div>
          </div>
        `).join('')}
      </div>
      <div class="carousel-nav prev" onclick="prevTip()">
        <i data-lucide="chevron-left"></i>
      </div>
      <div class="carousel-nav next" onclick="nextTip()">
        <i data-lucide="chevron-right"></i>
      </div>
      <div class="carousel-dots">
        ${SLEEP_TIPS.map((_, i) => `
          <div class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToTip(${i})"></div>
        `).join('')}
      </div>
    </div>
  `;

  // Touch events for swipe
  const track = document.getElementById('tipsTrack');
  if (track) {
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd);
    
    track.addEventListener('mousedown', handleMouseDown);
    track.addEventListener('mousemove', handleMouseMove);
    track.addEventListener('mouseup', handleMouseEnd);
    track.addEventListener('mouseleave', handleMouseEnd);
  }

  if (window.lucide) lucide.createIcons();
}

function handleTouchStart(e) {
  startX = e.touches[0].clientX;
  isDragging = true;
}

function handleTouchMove(e) {
  if (!isDragging) return;
  const currentX = e.touches[0].clientX;
  const diff = startX - currentX;
  if (Math.abs(diff) > 10) {
    e.preventDefault();
  }
}

function handleTouchEnd(e) {
  if (!isDragging) return;
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  
  if (diff > 50) nextTip();
  else if (diff < -50) prevTip();
  
  isDragging = false;
}

function handleMouseDown(e) {
  startX = e.clientX;
  isDragging = true;
  e.preventDefault();
}

function handleMouseMove(e) {
  if (!isDragging) return;
  e.preventDefault();
}

function handleMouseEnd(e) {
  if (!isDragging) return;
  const endX = e.clientX;
  const diff = startX - endX;
  
  if (diff > 50) nextTip();
  else if (diff < -50) prevTip();
  
  isDragging = false;
}

function nextTip() {
  const track = document.getElementById('tipsTrack');
  if (!track) return;
  const totalTips = track.children.length;
  currentTipIndex = (currentTipIndex + 1) % totalTips;
  updateCarousel();
}

function prevTip() {
  const track = document.getElementById('tipsTrack');
  if (!track) return;
  const totalTips = track.children.length;
  currentTipIndex = (currentTipIndex - 1 + totalTips) % totalTips;
  updateCarousel();
}

function goToTip(index) {
  currentTipIndex = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById('tipsTrack');
  if (!track) return;
  
  track.style.transform = `translateX(-${currentTipIndex * 100}%)`;
  
  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTipIndex);
  });
}

// ══════════════════════════════════════
// LANGUAGE TOGGLE
// ══════════════════════════════════════
function initLanguageToggle() {
  const topUser = document.querySelector('.top-user');
  if (!topUser) return;

  // Add language toggle button
  const langToggle = document.createElement('button');
  langToggle.className = 'lang-toggle';
  langToggle.innerHTML = '<i data-lucide="globe"></i>';
  langToggle.onclick = toggleLanguageBar;
  topUser.insertBefore(langToggle, topUser.firstChild);

  if (window.lucide) lucide.createIcons();
}

function toggleLanguageBar() {
  const langBar = document.getElementById('langBar');
  if (!langBar) return;
  langBar.classList.toggle('show');
}

// Close language bar when clicking outside
document.addEventListener('click', (e) => {
  const langBar = document.getElementById('langBar');
  const langToggle = document.querySelector('.lang-toggle');
  if (langBar && !langBar.contains(e.target) && !langToggle?.contains(e.target)) {
    langBar.classList.remove('show');
  }
});

// ══════════════════════════════════════
// PHOTO UPLOAD OPTIONS (Camera + Gallery)
// ══════════════════════════════════════
function initPhotoOptions() {
  const photoBtn = document.getElementById('triggerPhotoBtn');
  if (!photoBtn) return;

  photoBtn.onclick = showPhotoOptions;
}

function showPhotoOptions() {
  const existingModal = document.querySelector('.photo-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'mood-detail-modal photo-modal';
  modal.innerHTML = `
    <div class="mood-detail-content" style="max-width:400px">
      <div class="mood-detail-header">
        <div class="mood-detail-title">
          <i data-lucide="camera"></i>
          Add Photo
        </div>
        <button class="mood-close-btn" onclick="this.closest('.photo-modal').remove()">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="photo-options">
        <label class="photo-option-btn" for="cameraInput">
          <i data-lucide="camera"></i>
          <span>Take Photo</span>
          <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display:none" onchange="handlePhotoCapture(this)">
        </label>
        <label class="photo-option-btn" for="galleryInput">
          <i data-lucide="image"></i>
          <span>Choose from Gallery</span>
          <input type="file" id="galleryInput" accept="image/*" style="display:none" onchange="handlePhotoCapture(this)">
        </label>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
}

function handlePhotoCapture(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const preview = document.getElementById('photoPreview');
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        window.photoFile = file;
      }
      
      // Close modal
      document.querySelector('.photo-modal')?.remove();
    };
    
    reader.readAsDataURL(file);
  }
}

// ══════════════════════════════════════
// MOOD DETAIL MODAL
// ══════════════════════════════════════
function showMoodDetail(mood, emoji) {
  const moodInfo = {
    'Anxious': {
      title: 'Feeling Anxious',
      emoji: '😰',
      content: `Anxiety during pregnancy is completely normal. Your body is going through massive changes, and it's natural to worry about your baby's health, delivery, and becoming a parent.
      
      <strong>Why it happens:</strong>
      • Hormonal changes (progesterone, cortisol)
      • Fear of the unknown
      • Physical discomfort
      • Financial concerns
      
      <strong>What helps:</strong>
      • Deep breathing exercises (try our 4-4-4 breathing)
      • Talk to your partner or a friend
      • Join a pregnancy support group
      • Light exercise like walking or prenatal yoga
      • Limit caffeine and sugar
      • Professional help if anxiety is severe`,
    },
    'Happy': {
      title: 'Feeling Happy',
      emoji: '😊',
      content: `Wonderful! Positive emotions are great for both you and your baby. When you're happy, your body releases endorphins that can cross the placenta and benefit your baby.
      
      <strong>Keep the happiness going:</strong>
      • Share your joy with loved ones
      • Document these moments in your journal
      • Do activities you love
      • Practice gratitude
      • Get enough rest to maintain energy
      
      <strong>Remember:</strong>
      It's okay to have ups and downs. Enjoy these happy moments!`,
    },
    // Add more moods...
  };

  const info = moodInfo[mood] || {
    title: `Feeling ${mood}`,
    emoji: emoji,
    content: `It's completely normal to feel ${mood.toLowerCase()} during pregnancy. Your emotions are valid, and it's important to acknowledge them.`,
  };

  const modal = document.createElement('div');
  modal.className = 'mood-detail-modal';
  modal.innerHTML = `
    <div class="mood-detail-content">
      <div class="mood-detail-header">
        <div class="mood-detail-title">
          <span style="font-size:32px">${info.emoji}</span>
          ${info.title}
        </div>
        <button class="mood-close-btn" onclick="this.closest('.mood-detail-modal').remove()">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="mood-detail-body">
        ${info.content.replace(/\n/g, '<br>')}
      </div>
      <div class="mood-share-section">
        <div class="mood-share-title">Share your feelings (optional)</div>
        <textarea class="mood-share-input" placeholder="How are you feeling? Write it down..."></textarea>
        <button class="btn btn-p mood-share-btn" onclick="saveMoodNote(this)">
          <i data-lucide="heart"></i> Save Note
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function saveMoodNote(btn) {
  const textarea = btn.closest('.mood-share-section').querySelector('textarea');
  const note = textarea.value.trim();
  if (note) {
    // Save to local storage or database
    console.log('Mood note saved:', note);
    btn.closest('.mood-detail-modal').remove();
    alert('Your feelings have been saved to your journal ❤️');
  }
}

// ══════════════════════════════════════
// ROTATING AFFIRMATIONS
// ══════════════════════════════════════
const AFFIRMATIONS = [
  "I trust my body to grow and nurture my baby.",
  "I am strong, capable, and ready for motherhood.",
  "My baby and I are healthy and safe.",
  "I embrace the changes in my body with love.",
  "I am creating a miracle inside me.",
  "I deserve rest, care, and support.",
  "My intuition guides me in caring for my baby.",
  "I am grateful for this journey.",
  "I release fear and welcome peace.",
  "I am enough, just as I am.",
];

let currentAffirmationIndex = 0;

function rotateAffirmation() {
  currentAffirmationIndex = (currentAffirmationIndex + 1) % AFFIRMATIONS.length;
  const affirmText = document.getElementById('affirmText');
  if (affirmText) {
    affirmText.style.opacity = '0';
    setTimeout(() => {
      affirmText.textContent = AFFIRMATIONS[currentAffirmationIndex];
      affirmText.style.opacity = '1';
    }, 300);
  }
}

// Auto-rotate affirmation every 10 seconds
setInterval(rotateAffirmation, 10000);

// ══════════════════════════════════════
// INITIALIZE ALL ENHANCEMENTS
// ══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  initLanguageToggle();
  initPhotoOptions();
});

// Export functions
window.ENHANCEMENTS = {
  initSleepTipsCarousel,
  showMoodDetail,
  nextTip,
  prevTip,
  goToTip,
  toggleLanguageBar,
  showPhotoOptions,
  handlePhotoCapture,
  saveMoodNote,
  rotateAffirmation,
};

