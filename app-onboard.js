/**
 * MamaCare — app-onboard.js v6.1
 * First-time onboarding wizard
 * Shows after first login if profile is incomplete
 */

'use strict';

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
