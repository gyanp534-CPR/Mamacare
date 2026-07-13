/**
 * MamaCare — app-weight-tracker-v2.js
 * Enhanced Weight Tracker with SVG Chart Visualization
 * 
 * Features:
 * - SVG chart with healthy weight band
 * - Grid lines and axis labels
 * - Smooth progress visualization
 * - Empty state handling
 * - Full page layout matching React design
 */

'use strict';

// ════════════════════════════════════════
// WEIGHT CHART VISUALIZATION
// ════════════════════════════════════════

function renderWeightChartV2(data) {
  const container = document.querySelector('#weightChartContainer');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="margin-top:16px">
        <div class="empty-state-icon">
          <i data-lucide="trending-up"></i>
        </div>
        <h2 class="empty-state-title">Start tracking</h2>
        <p class="empty-state-text">
          Apna aur baby ka khayal rakhne ke liye, hum yahan aapka weight track karenge. Add your first weigh-in above to start.
        </p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Chart dimensions
  const width = 300;
  const height = 160;

  // Calculate ranges
  const weeks = data.map(d => d.week || calculateWeekFromDate(d.logged_at));
  const weights = data.map(d => d.weight_kg);

  const minWeek = Math.min(14, ...weeks);
  let maxWeek = Math.max(26, ...weeks);
  if (minWeek === maxWeek) maxWeek = minWeek + 10;

  let minWeight = Math.floor(Math.min(54, ...weights) / 2) * 2;
  let maxWeight = Math.ceil(Math.max(62, ...weights) / 2) * 2;

  if (minWeight === maxWeight) {
    minWeight -= 2;
    maxWeight += 2;
  }

  // Coordinate transformation functions
  const getX = (week) => ((week - minWeek) / (maxWeek - minWeek)) * width;
  const getY = (weight) => ((maxWeight - weight) / (maxWeight - minWeight)) * height;

  // Generate points for data line
  const points = data.map((d, i) => {
    const week = weeks[i];
    const weight = d.weight_kg;
    return `${getX(week)},${getY(weight)}`;
  }).join(' ');

  // Healthy weight band (rough approximation: 10-12.5kg total gain)
  const healthyBand = `
    ${getX(14)},${getY(57)}
    ${getX(maxWeek)},${getY(63)}
    ${getX(maxWeek)},${getY(59)}
    ${getX(14)},${getY(53)}
  `;

  // Generate grid steps
  const yRange = maxWeight - minWeight;
  const stepSize = yRange > 12 ? 4 : 2;
  const ySteps = [];
  for (let w = minWeight; w <= maxWeight; w += stepSize) {
    ySteps.push(w);
  }

  const xSteps = [];
  for (let w = minWeek; w <= maxWeek; w += 4) {
    xSteps.push(w);
  }

  // Build SVG
  let svg = `
    <svg viewBox="0 0 ${width} ${height}" class="weight-chart-svg" style="width:100%;height:100%;overflow:visible">
      <!-- Healthy Band -->
      <polygon points="${healthyBand}" fill="var(--mc-sage-tint)" opacity="0.6" />
      
      <!-- Y-axis grid & labels -->
      ${ySteps.map(w => `
        <g>
          <line x1="0" y1="${getY(w)}" x2="${width}" y2="${getY(w)}" stroke="var(--mc-line)" stroke-width="1" stroke-dasharray="4,4" />
          <text x="-12" y="${getY(w) + 4}" font-size="11" fill="var(--mc-text-soft)" text-anchor="end" font-family="var(--font-body)">${w}</text>
        </g>
      `).join('')}
      
      <!-- X-axis labels -->
      ${xSteps.map(w => `
        <text x="${getX(w)}" y="${height + 24}" font-size="11" fill="var(--mc-text-soft)" text-anchor="middle" font-family="var(--font-body)">Wk ${w}</text>
      `).join('')}
      
      <!-- Data Line -->
      ${data.length > 1 ? `<polyline points="${points}" fill="none" stroke="var(--mc-rose)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />` : ''}
      
      <!-- Data Points -->
      ${data.map((d, i) => {
        const week = weeks[i];
        const weight = d.weight_kg;
        return `
          <circle 
            cx="${getX(week)}" 
            cy="${getY(weight)}" 
            r="4.5" 
            fill="var(--mc-surface)"
            stroke="${i === data.length - 1 ? 'var(--mc-gold)' : 'var(--mc-rose)'}"
            stroke-width="2.5"
          />
        `;
      }).join('')}
    </svg>
  `;

  container.innerHTML = `
    <!-- Chart Header -->
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px">
      <h2 class="font-display" style="font-size:22px;color:var(--mc-text)">Your Progress</h2>
      <span class="badge badge-rose">
        Trimester ${getCurrentTrimester()}
      </span>
    </div>
    
    <!-- Info Box -->
    <div style="background:rgba(139,154,122,0.15);border-radius:16px;padding:16px;display:flex;align-items:flex-start;gap:12px;margin-top:8px;margin-bottom:8px;border:1px solid var(--mc-sage-tint)">
      <div style="flex-shrink:0;margin-top:2px;color:var(--mc-sage)">
        <i data-lucide="info" style="width:20px;height:20px"></i>
      </div>
      <p style="font-size:14px;line-height:1.6;color:var(--mc-text-soft);margin:0">
        Your weight is growing steadily. The soft green band shows a healthy range for this stage. <strong style="color:var(--mc-text);font-weight:600">Sab theek chal raha hai!</strong>
      </p>
    </div>
    
    <!-- Chart SVG Container -->
    <div style="position:relative;width:100%;aspect-ratio:1.7;margin-top:24px;margin-bottom:8px;padding-left:24px;padding-right:16px">
      ${svg}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function calculateWeekFromDate(dateStr) {
  if (!userData?.lmp_date) return 24; // default
  const lmpDate = new Date(userData.lmp_date);
  const logDate = new Date(dateStr);
  const diffDays = Math.floor((logDate - lmpDate) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

function getCurrentTrimester() {
  const dueDate = userData?.due_date ? new Date(userData.due_date) : null;
  if (!dueDate) return 2;

  const lmpDate = userData?.lmp_date ? new Date(userData.lmp_date) : null;
  const today = new Date();
  
  const elapsedDays = lmpDate ? Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24)) : 0;
  const currentWeek = Math.floor(elapsedDays / 7);

  if (currentWeek < 13) return 1;
  if (currentWeek < 27) return 2;
  return 3;
}

// ════════════════════════════════════════
// WEIGHT LOG RENDERING (Enhanced)
// ════════════════════════════════════════

function renderWeightLogV2(data) {
  const container = document.querySelector('#weightLog');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '';
    return;
  }

  // Sort by date descending (newest first)
  const sorted = [...data].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));

  const html = sorted.map((d, i) => {
    const date = new Date(d.logged_at);
    const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const week = d.week || calculateWeekFromDate(d.logged_at);

    return `
      <div style="display:flex;align-items:center;justify-content:space-between;background:var(--mc-surface);border:1px solid var(--mc-line);border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 1px 3px rgba(62,42,41,0.04)">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:15px;background:${i === 0 ? 'var(--mc-gold-tint)' : 'var(--mc-rose-tint)'};color:${i === 0 ? 'var(--mc-gold)' : 'var(--mc-rose-dark)'}">
            W${week}
          </div>
          <div style="display:flex;flex-direction:column">
            <div style="font-weight:500;font-size:16px;color:var(--mc-text)">${d.weight_kg.toFixed(1)} kg</div>
            <div style="font-size:13px;color:var(--mc-text-soft);margin-top:2px">${dateStr}</div>
          </div>
        </div>
        ${i === 0 ? `<span style="font-size:12px;font-weight:600;color:var(--mc-gold);background:rgba(217,154,43,0.15);padding:4px 12px;border-radius:50px">Latest</span>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.04em;color:var(--mc-text-soft);font-weight:700;margin-bottom:12px;padding-left:4px;margin-top:32px">Past Weigh-ins</h3>
    <div style="display:flex;flex-direction:column;gap:0">
      ${html}
    </div>
  `;
}

// ════════════════════════════════════════
// ENHANCED WEIGHT PAGE RENDERING
// ════════════════════════════════════════

async function enhanceWeightPage() {
  // Check if we're on the weight page
  const weightPage = document.getElementById('page-weight');
  if (!weightPage || !weightPage.classList.contains('active')) return;

  // Load weight data
  if (!window.user || !window.supa) return;

  const { data } = await window.supa
    .from('weight_logs')
    .select('*')
    .eq('user_id', window.user.id)
    .order('logged_at', { ascending: true });

  // Render chart and log
  renderWeightChartV2(data || []);
  renderWeightLogV2(data || []);
}

// ════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════

// Hook into page navigation
if (window.MC) {
  const originalGoTo = window.MC.goTo || window.goTo;
  const enhancedGoTo = function(page) {
    if (typeof originalGoTo === 'function') {
      originalGoTo(page);
    }
    
    if (page === 'weight') {
      setTimeout(() => enhanceWeightPage(), 150);
    }
  };
  
  if (window.MC) {
    window.MC.goTo = enhancedGoTo;
  }
  window.goTo = enhancedGoTo;
}

// Hook into existing weight log function
if (window.MC && window.MC.loadWeights) {
  const originalLoadWeights = window.MC.loadWeights;
  window.MC.loadWeights = async function() {
    await originalLoadWeights();
    setTimeout(() => enhanceWeightPage(), 100);
  };
}

// Export functions
if (window.MC) {
  window.MC.renderWeightChartV2 = renderWeightChartV2;
  window.MC.renderWeightLogV2 = renderWeightLogV2;
  window.MC.enhanceWeightPage = enhanceWeightPage;
}

console.log('📊 Weight Tracker v2 with Chart loaded');
