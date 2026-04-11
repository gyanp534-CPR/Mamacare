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
  new Notification(title, { body, icon: 'favicon.svg' });
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

function setSleepTimer(mins) {
  if (sleepTimerTO) { clearTimeout(sleepTimerTO); sleepTimerTO = null; }
  const display = document.getElementById('timerDisplay');
  if (!mins || mins === '0') { if (display) display.textContent = ''; return; }
  const ms = parseInt(mins) * 60 * 1000;
  let remaining = ms;
  const interval = setInterval(() => {
    remaining -= 1000;
    if (display) {
      const m = Math.floor(remaining / 60000), s = Math.floor((remaining % 60000) / 1000);
      display.textContent = `⏱ ${m}:${s.toString().padStart(2,'0')} remaining`;
    }
    if (remaining <= 0) {
      clearInterval(interval);
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
