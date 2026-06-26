/**
 * MamaCare Template Refactor Examples
 * Shows before/after of template refactoring
 * 
 * Use these patterns to gradually refactor app.js
 */

// ═══════════════════════════════════════════════════════════
// EXAMPLE 1: Welcome Hero Screen
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE (100+ lines, inline styles everywhere)
const welcomeScreenOld = `
  <div style="position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(231,121,160,0.05),rgba(124,58,237,0.05));padding:32px 20px">
    <div style="text-align:center;max-width:420px">
      <div style="width:120px;height:120px;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,#E879A0,#7C3AED);box-shadow:0 12px 48px rgba(231,121,160,0.4)">
        <i data-lucide="flower-2"></i>
      </div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:500;margin-bottom:8px">Welcome to MamaCare!</div>
      <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.6">Your complete pregnancy companion is ready. Let's start by setting your due date.</p>
      <button onclick="MC.goTo('due')" style="background:linear-gradient(135deg,var(--rose),#E59FA9);color:white;border:none;padding:14px 28px;border-radius:100px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(216,140,154,0.35)">Set Due Date</button>
    </div>
  </div>
`;

// ✅ AFTER (Clean, using Templates)
const welcomeScreenNew = Templates.hero({
  emoji: '🌸',
  title: 'Welcome to MamaCare!',
  subtitle: "Your complete pregnancy companion is ready. Let's start by setting your due date.",
  action: `<button class="btn btn-p" onclick="MC.goTo('due')">
    <i data-lucide="calendar-plus"></i> Set Due Date
  </button>`
});

// ═══════════════════════════════════════════════════════════
// EXAMPLE 2: Stats Cards
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const statsOld = `
  <div class="g3">
    <div style="text-align:center;padding:12px;background:rgba(232,160,168,0.06);border-radius:12px">
      <i data-lucide="calendar" style="width:20px;color:var(--accent)"></i>
      <div style="font-size:22px;font-weight:700;color:var(--accent)">${week}</div>
      <div style="font-size:11.5px;color:var(--muted)">Week</div>
    </div>
    <div style="text-align:center;padding:12px;background:rgba(232,160,168,0.06);border-radius:12px">
      <i data-lucide="heart" style="width:20px;color:var(--rose)"></i>
      <div style="font-size:22px;font-weight:700;color:var(--rose)">${days}</div>
      <div style="font-size:11.5px;color:var(--muted)">Days</div>
    </div>
  </div>
`;

// ✅ AFTER
const statsNew = Layout.grid3([
  Templates.statCard({ icon: 'calendar', label: 'Week', value: week }),
  Templates.statCard({ icon: 'heart', label: 'Days', value: days, color: 'var(--rose)' }),
  Templates.statCard({ icon: 'clock', label: 'Trimester', value: tri })
]);

// ═══════════════════════════════════════════════════════════
// EXAMPLE 3: List Items (Journal/Medicine/etc.)
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const journalListOld = journalEntries.map(e => `
  <div style="background:white;border-radius:14px;padding:14px;margin-bottom:9px;border:1.5px solid rgba(232,160,168,.15)">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div style="display:flex;align-items:center;gap:8px">
        <i data-lucide="${e.mood}" style="width:18px;height:18px;color:var(--accent)"></i>
        <span style="font-size:12px;color:var(--muted)">${e.date}</span>
      </div>
      <button onclick="deleteEntry('${e.id}')" style="background:none;border:none;cursor:pointer">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
    <p style="font-size:13px;line-height:1.7;color:var(--warm)">${e.text}</p>
  </div>
`).join('');

// ✅ AFTER
const journalListNew = journalEntries.map(e => 
  Templates.listItem({
    icon: e.mood,
    title: e.date,
    subtitle: e.text,
    meta: e.week ? Templates.badge({ text: `W${e.week}` }) : null,
    actions: Templates.iconButton({
      icon: 'trash-2',
      onClick: `deleteEntry('${e.id}')`,
      title: 'Delete'
    })
  })
).join('');

// ═══════════════════════════════════════════════════════════
// EXAMPLE 4: Empty States
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const emptyOld = `
  <p style="text-align:center;color:var(--muted);font-size:13px;padding:18px">
    Koi entry nahi. Pehli yaad likho! <i data-lucide="flower-2"></i>
  </p>
`;

// ✅ AFTER
const emptyNew = Templates.emptyState({
  icon: 'flower-2',
  message: 'Koi entry nahi. Pehli yaad likho!',
  actionText: 'Add Entry',
  actionClick: 'showAddForm()'
});

// ═══════════════════════════════════════════════════════════
// EXAMPLE 5: Feature Grid (Dashboard)
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const featuresOld = `
  <div class="feature-grid db-grid-4">
    <div class="feature-item" data-page="weight">
      <div class="mi-icon"><i data-lucide="scale"></i></div>
      <div class="mi-label">Weight</div>
    </div>
    <div class="feature-item" data-page="sleep">
      <div class="mi-icon"><i data-lucide="moon"></i></div>
      <div class="mi-label">Sleep</div>
    </div>
  </div>
`;

// ✅ AFTER
const featuresNew = Layout.featureGrid([
  Templates.featureItem({ icon: 'scale', label: 'Weight', page: 'weight' }),
  Templates.featureItem({ icon: 'moon', label: 'Sleep', page: 'sleep' }),
  Templates.featureItem({ icon: 'apple', label: 'Nutrition', page: 'nutrition' }),
  Templates.featureItem({ icon: 'pill', label: 'Meds', page: 'medicine' })
]);

// ═══════════════════════════════════════════════════════════
// EXAMPLE 6: Progress Bar
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const progressOld = `
  <div class="timeline-bar">
    <div class="timeline-fill" style="width:${percent}%"></div>
  </div>
  <div style="text-align:right;font-size:12.5px;font-weight:700;color:var(--accent)">
    ${percent}%
  </div>
`;

// ✅ AFTER
const progressNew = Templates.progressBar({ percent: 45 });

// ═══════════════════════════════════════════════════════════
// EXAMPLE 7: Card with Content
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const cardOld = `
  <div class="card">
    <div class="sec-label">Today's Mood</div>
    <div class="sec-title">How are you feeling?</div>
    <div class="mood-grid">
      ${moods.map(m => `<button>${m}</button>`).join('')}
    </div>
  </div>
`;

// ✅ AFTER
const cardNew = Templates.card({
  label: "Today's Mood",
  title: 'How are you feeling?',
  content: `<div class="mood-grid">
    ${moods.map(m => `<button>${m}</button>`).join('')}
  </div>`
});

// ═══════════════════════════════════════════════════════════
// EXAMPLE 8: Input Forms
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const formOld = `
  <div class="g2">
    <div>
      <label>Weight (kg)</label>
      <input type="number" id="wtInput" placeholder="Current weight">
    </div>
    <div>
      <label>Week</label>
      <input type="number" id="wtWeek" placeholder="e.g. 14">
    </div>
  </div>
`;

// ✅ AFTER
const formNew = Layout.grid2([
  Templates.inputGroup({
    label: 'Weight (kg)',
    id: 'wtInput',
    type: 'number',
    placeholder: 'Current weight',
    required: true
  }),
  Templates.inputGroup({
    label: 'Week',
    id: 'wtWeek',
    type: 'number',
    placeholder: 'e.g. 14'
  })
]);

// ═══════════════════════════════════════════════════════════
// EXAMPLE 9: Tab Buttons
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const tabsOld = `
  <div class="tab-row">
    <button class="tab-btn active" onclick="switchTab('all')">All</button>
    <button class="tab-btn" onclick="switchTab('breakfast')">Breakfast</button>
    <button class="tab-btn" onclick="switchTab('lunch')">Lunch</button>
  </div>
`;

// ✅ AFTER
const tabsNew = Layout.tabRow([
  Templates.tabButton({ label: 'All', active: true, onClick: "switchTab('all')" }),
  Templates.tabButton({ label: 'Breakfast', onClick: "switchTab('breakfast')" }),
  Templates.tabButton({ label: 'Lunch', onClick: "switchTab('lunch')" })
]);

// ═══════════════════════════════════════════════════════════
// EXAMPLE 10: Alert Messages
// ═══════════════════════════════════════════════════════════

// ❌ BEFORE
const alertOld = `
  <div style="background:#e8f5e9;color:#2e7d32;padding:12px;border-radius:12px;margin-bottom:16px">
    <i data-lucide="check-circle"></i> Data saved successfully!
  </div>
`;

// ✅ AFTER
const alertNew = Templates.alert({
  type: 'success',
  message: 'Data saved successfully!'
});

// ═══════════════════════════════════════════════════════════
// USAGE IN ACTUAL CODE
// ═══════════════════════════════════════════════════════════

// Example: Refactoring renderDashboard()
function renderDashboard() {
  // Hero section
  const heroHTML = dueDate ? 
    Templates.hero({
      title: `Week ${currentWeek}`,
      subtitle: `${daysLeft} days until your due date`,
      action: Templates.progressBar({ percent: progressPercent })
    }) :
    Templates.hero({
      emoji: '🌸',
      title: 'Welcome to MamaCare!',
      subtitle: "Let's start by setting your due date.",
      action: `<button class="btn btn-p" onclick="MC.goTo('due')">Set Due Date</button>`
    });

  // Features section
  const featuresHTML = Layout.section({
    label: 'Rozana Tracking',
    content: Layout.featureGrid([
      Templates.featureItem({ icon: 'scale', label: 'Weight', page: 'weight' }),
      Templates.featureItem({ icon: 'moon', label: 'Sleep', page: 'sleep' }),
      Templates.featureItem({ icon: 'apple', label: 'Nutrition', page: 'nutrition' }),
      Templates.featureItem({ icon: 'stethoscope', label: 'Appts', page: 'appointments' })
    ])
  });

  // Combine
  setHTML('main-content', heroHTML + featuresHTML);
  renderIcons();
}

// ═══════════════════════════════════════════════════════════
// MIGRATION STRATEGY
// ═══════════════════════════════════════════════════════════

/*
PRIORITY ORDER (High Impact, Low Effort):

1. ✅ Empty States (10 occurrences)
2. ✅ Stat Cards (15 occurrences)
3. ✅ Progress Bars (8 occurrences)
4. ✅ List Items (20+ occurrences)
5. ✅ Feature Grid (5 occurrences)
6. ⏳ Hero Sections (3 occurrences)
7. ⏳ Form Inputs (30+ occurrences)
8. ⏳ Cards (50+ occurrences)

GRADUAL APPROACH:
- Refactor 1-2 functions per deploy
- Test after each refactor
- Keep old code commented for reference
- Remove old code after verification
*/

console.log('📚 Template Refactor Examples loaded');
console.log('  10 before/after patterns ready');
console.log('  Use these to gradually refactor app.js');
