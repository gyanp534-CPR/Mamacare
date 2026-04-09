/**
 * MamaCare app-extra.js — v5 Additional Modules
 * Dashboard, Nutrition, Hospital Bag, Baby Names,
 * Medicine, Journal, Postpartum, Symptom Checker
 */

'use strict';

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
    const reader = new FileReader();
    reader.onload = e => {
      photoData = e.target.result;
      const prev = document.getElementById('photoPreview');
      if (prev) { prev.src = photoData; prev.style.display = 'block'; }
    };
    reader.readAsDataURL(file);
  }

  function saveJournalEntry() {
    const text = document.getElementById('jText').value.trim();
    const week = document.getElementById('jWeek').value;
    const date = document.getElementById('jDate').value;
    if (!text && !photoData) { alert('Kuch likhein ya photo add karein!'); return; }
    journalEntries.unshift({ text, week: week || '?', date: date || new Date().toISOString().split('T')[0], mood: selectedJMood, photo: photoData, id: Date.now() });
    S.set('journalEntries', journalEntries);
    document.getElementById('jText').value = '';
    document.getElementById('jWeek').value = '';
    photoData = null;
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
