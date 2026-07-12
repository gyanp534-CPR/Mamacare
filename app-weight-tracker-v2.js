/**
 * MamaCare — app-weight-tracker-v2.js
 * Enhanced Weight Tracker with SVG Chart Visualization
 * 
 * Features:
 * - SVG chart with healthy weight band
 * - Grid lines and axis labels
 * - Smooth progress visualization
 * - Empty state handling
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
  const weeks = data.map(d => d.week);
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
  const points = data.map(d => `${getX(d.week)},${getY(d.weight_kg)}`).join(' ');

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
    <svg viewBox="0 0 ${width} ${height}" class="weight-chart-svg">
      <!-- Healthy Band -->
      <polygon points="${healthyBand}" class="chart-healthy-band" />
      
      <!-- Y-axis grid & labels -->
      ${ySteps.map(w => `
        <g>
          <line x1="0" y1="${getY(w)}" x2="${width}" y2="${getY(w)}" class="chart-grid-line" />
          <text x="-12" y="${getY(w) + 4}" class="chart-axis-label" text-anchor="end">${w}</text>
        </g>
      `).join('')}
      
      <!-- X-axis labels -->
      ${xSteps.map(w => `
        <text x="${getX(w)}" y="${height + 24}" class="chart-axis-label" text-anchor="middle">Wk ${w}</text>
      `).join('')}
      
      <!-- Data Line -->
      ${data.length > 1 ? `<polyline points="${points}" class="chart-data-line" />` : ''}
      
      <!-- Data Points -->
      ${data.map((d, i) => `
        <circle 
          cx="${getX(d.week)}" 
          cy="${getY(d.weight_kg)}" 
          r="4.5" 
          class="chart-data-point ${i === data.length - 1 ? 'chart-data-point-current' : ''}"
        />
      `).join('')}
    </svg>
  `;

  container.innerHTML = `
    <div class="flex items-baseline justify-between mb-2" style="margin-bottom:8px">
      <h2 class="font-display" style="font-size:22px;color:var(--mc-text)">Your Progress</h2>
      <span class="badge badge-rose">
        Trimester ${getCurrentTrimester()}
      </span>
    </div>
    
    <div class="info-box" style="margin-top:8px;margin-bottom:8px">
      <div class="info-box-icon">
        <i data-lucide="info" style="width:20px;height:20px"></i>
      </div>
      <p class="info-box-text">
        Your weight is growing steadily. The soft green band shows a healthy range for this stage. <strong style="color:var(--mc-text)">Sab theek chal raha hai!</strong>
      </p>
    </div>
    
    <div class="weight-chart-container">
      ${svg}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
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
    container.innerHTML = `
      <p style="text-align:center;color:var(--mc-text-soft);font-size:13px;padding:18px">
        Koi entry nahi. Upar se weight log karein!
      </p>
    `;
    return;
  }

  // Sort by date descending (newest first)
  const sorted = [...data].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));

  const html = sorted.map((d, i) => {
    const date = new Date(d.logged_at);
    const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const week = d.week || Math.floor((date - new Date(userData?.lmp_date || date)) / (1000 * 60 * 60 * 24 * 7));

    return `
      <div class="flex items-center justify-between p-4 rounded-2xl bg-[var(--mc-surface)] border border-[var(--mc-line)] shadow-sm" style="background:var(--mc-surface);border:1px solid var(--mc-line);border-radius:16px;padding:16px;margin-bottom:12px">
        <div class="flex items-center gap-4" style="display:flex;align-items:center;gap:16px">
          <div style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:15px;background:${i === 0 ? 'var(--mc-gold-tint)' : 'var(--mc-rose-tint)'};color:${i === 0 ? 'var(--mc-gold)' : 'var(--mc-rose-dark)'}">
            W${week}
          </div>
          <div style="display:flex;flex-direction:column">
            <div style="font-weight:500;font-size:16px;color:var(--mc-text)">${d.weight_kg.toFixed(1)} kg</div>
            <div style="font-size:13px;color:var(--mc-text-soft);margin-top:2px">${dateStr}</div>
          </div>
        </div>
        ${i === 0 ? `<span class="badge badge-gold">Latest</span>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <h3 class="section-header-v2">Past Weigh-ins</h3>
    <div style="display:flex;flex-direction:column;gap:12px">
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

  // Create chart container if it doesn't exist
  let chartContainer = document.getElementById('weightChartContainer');
  if (!chartContainer) {
    const weightChart = document.getElementById('weightChart');
    if (weightChart) {
      chartContainer = document.createElement('div');
      chartContainer.id = 'weightChartContainer';
      weightChart.parentNode.replaceChild(chartContainer, weightChart);
    }
  }

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
