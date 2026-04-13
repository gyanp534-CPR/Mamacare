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
