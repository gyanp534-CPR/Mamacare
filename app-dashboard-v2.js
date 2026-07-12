/**
 * MamaCare — app-dashboard-v2.js
 * Enhanced Dashboard with Journey Thread Visualization
 * 
 * Features:
 * - Journey Thread SVG (Haldi garland metaphor)
 * - Hero progress card with T1/T2/Due markers
 * - Summary cards (Hydration, Affirmation)
 * - Smooth animations
 */

'use strict';

// ════════════════════════════════════════
// JOURNEY THREAD VISUALIZATION
// ════════════════════════════════════════

function renderJourneyThread() {
  const heroCard = document.querySelector('#dbHero');
  if (!heroCard) return;

  // Calculate current progress
  const dueDate = userData?.due_date ? new Date(userData.due_date) : null;
  if (!dueDate) {
    renderEmptyJourneyState(heroCard);
    return;
  }

  const lmpDate = userData?.lmp_date ? new Date(userData.lmp_date) : null;
  const today = new Date();
  
  // Calculate weeks and days
  const totalDays = Math.floor((dueDate - (lmpDate || today)) / (1000 * 60 * 60 * 24));
  const elapsedDays = lmpDate ? Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24)) : 0;
  const remainingDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.floor(elapsedDays / 7);
  
  // Calculate progress (0 to 1)
  const progress = Math.min(Math.max(elapsedDays / totalDays, 0), 1);

  // Baby size info by week
  const babyInfo = getBabyInfoForWeek(currentWeek);

  heroCard.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <div>
        <p style="color:var(--mc-text-soft);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;margin-bottom:4px">Current Progress</p>
        <h2 class="font-display" style="font-size:56px;font-weight:600;color:var(--mc-text);line-height:1;letter-spacing:-0.02em;margin-bottom:0">
          ${currentWeek}
          <span style="font-size:20px;font-weight:500;color:var(--mc-text-soft);margin-left:4px">wks</span>
        </h2>
      </div>
      <div style="text-align:right;padding-top:4px">
        <p style="color:var(--mc-text-soft);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;margin-bottom:4px">Days Left</p>
        <p class="font-display" style="font-size:28px;font-weight:500;color:var(--mc-rose)">${remainingDays > 0 ? remainingDays : 0}</p>
      </div>
    </div>

    <!-- Journey Thread SVG -->
    <div class="journey-thread-container" aria-hidden="true">
      <svg class="journey-thread-svg" viewBox="0 0 300 100" preserveAspectRatio="xMidYMid meet">
        <!-- Background Thread -->
        <path 
          d="M 10 30 Q 150 100 290 30" 
          fill="none" 
          stroke="var(--mc-rose-tint)" 
          stroke-width="2.5" 
          stroke-linecap="round"
        />
        
        <!-- Active Thread (up to current week) -->
        <path 
          d="M 10 30 Q 150 100 290 30" 
          fill="none" 
          stroke="var(--mc-rose)" 
          stroke-width="2.5" 
          stroke-linecap="round"
          stroke-dasharray="310"
          stroke-dashoffset="${310 - (progress * 310)}"
        />
        
        ${renderThreadBeads(currentWeek, progress)}
      </svg>
    </div>

    <!-- Baby Info Box -->
    <div class="info-box" style="margin-top:16px">
      <div class="info-box-icon">
        <i data-lucide="sprout" style="width:20px;height:20px"></i>
      </div>
      <p class="info-box-text">
        ${babyInfo}
      </p>
    </div>
  `;

  // Re-render Lucide icons
  if (window.lucide) window.lucide.createIcons();
}

function renderThreadBeads(currentWeek, progress) {
  // Calculate positions on the bezier curve
  // Formula: Q(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
  // P0 = (10, 30), P1 = (150, 100), P2 = (290, 30)
  
  function getPointOnCurve(t) {
    const p0 = { x: 10, y: 30 };
    const p1 = { x: 150, y: 100 };
    const p2 = { x: 290, y: 30 };
    
    const x = Math.pow(1-t, 2) * p0.x + 2 * (1-t) * t * p1.x + Math.pow(t, 2) * p2.x;
    const y = Math.pow(1-t, 2) * p0.y + 2 * (1-t) * t * p1.y + Math.pow(t, 2) * p2.y;
    
    return { x, y };
  }

  const t1Point = getPointOnCurve(0.325); // Week 13
  const t2Point = getPointOnCurve(0.65);  // Week 26
  const duePoint = getPointOnCurve(1.0);  // Week 40
  const currentPoint = getPointOnCurve(progress);

  let beads = '';

  // T1 Bead (Week 13)
  const t1Passed = currentWeek >= 13;
  beads += `
    <g transform="translate(${t1Point.x}, ${t1Point.y})">
      <circle cx="0" cy="0" r="5" fill="${t1Passed ? 'var(--mc-rose)' : 'var(--mc-rose-tint)'}" stroke="var(--mc-surface)" stroke-width="2" />
      <text x="0" y="20" text-anchor="middle" fill="${t1Passed ? 'var(--mc-rose)' : 'var(--mc-text-soft)'}" font-size="10" font-weight="bold" letter-spacing="0.05em">T1</text>
    </g>
  `;

  // T2 Bead (Week 26)
  const t2Passed = currentWeek >= 26;
  beads += `
    <g transform="translate(${t2Point.x}, ${t2Point.y})">
      <circle cx="0" cy="0" r="5" fill="${t2Passed ? 'var(--mc-rose)' : 'var(--mc-rose-tint)'}" stroke="var(--mc-surface)" stroke-width="2" />
      <text x="0" y="20" text-anchor="middle" fill="${t2Passed ? 'var(--mc-rose)' : 'var(--mc-text-soft)'}" font-size="10" font-weight="bold" letter-spacing="0.05em">T2</text>
    </g>
  `;

  // Due Date Bead (Week 40)
  beads += `
    <g transform="translate(${duePoint.x}, ${duePoint.y})">
      <circle cx="0" cy="0" r="5" fill="var(--mc-rose-tint)" stroke="var(--mc-surface)" stroke-width="2" />
      <text x="-5" y="-12" text-anchor="end" fill="var(--mc-text-soft)" font-size="10" font-weight="bold" letter-spacing="0.05em">DUE</text>
    </g>
  `;

  // Current Position Marker
  if (currentWeek > 0 && currentWeek < 40) {
    beads += `
      <g class="journey-current-marker" transform="translate(${currentPoint.x}, ${currentPoint.y})">
        <!-- Glow -->
        <circle cx="0" cy="0" r="14" fill="var(--mc-gold-tint)" opacity="0.6" />
        <!-- Gold bead -->
        <circle cx="0" cy="0" r="7" fill="var(--mc-gold)" stroke="var(--mc-surface)" stroke-width="2.5" />
        <!-- Inner highlight -->
        <circle cx="0" cy="0" r="2" fill="var(--mc-surface)" />
        
        <!-- Label -->
        <g transform="translate(0, -22)">
          <rect x="-35" y="-14" width="70" height="18" rx="4" fill="var(--mc-text)" />
          <text x="0" y="-1" text-anchor="middle" fill="var(--mc-surface)" font-size="9" font-weight="bold" letter-spacing="0.02em">You are here</text>
          <polygon points="-4,4 4,4 0,8" fill="var(--mc-text)" />
        </g>
      </g>
    `;
  }

  return beads;
}

function renderEmptyJourneyState(heroCard) {
  heroCard.innerHTML = `
    <div style="text-align:center;padding:32px 20px">
      <div style="font-size:48px;margin-bottom:16px">📅</div>
      <h2 class="font-display" style="font-size:24px;margin-bottom:8px;color:var(--mc-text)">
        Set Your Due Date
      </h2>
      <p style="color:var(--mc-text-soft);font-size:14px;margin-bottom:20px;line-height:1.6">
        Let's personalize your journey! Add your due date or LMP to see your beautiful progress thread.
      </p>
      <button 
        onclick="goTo('due')" 
        style="background:var(--mc-rose);color:white;border:none;padding:12px 24px;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer;transition:all 0.3s ease"
      >
        Calculate Due Date
      </button>
    </div>
  `;
}

function getBabyInfoForWeek(week) {
  const info = {
    4: "Your baby is just starting to form — a tiny ball of cells preparing for an amazing journey.",
    8: "Your baby is about the size of a raspberry. Their little heart is starting to beat!",
    12: "Your baby is the size of a lime. Tiny fingers and toes are forming!",
    16: "Your baby is as big as an avocado. They can now make facial expressions!",
    20: "Your baby is about the size of a banana. You might start feeling gentle movements soon!",
    24: "Your baby is about the size of a corn cob. They are practicing breathing movements!",
    28: "Your baby is as big as an eggplant. They can open and close their eyes now!",
    32: "Your baby is the size of a pineapple. They are gaining weight quickly!",
    36: "Your baby is as big as a honeydew melon. They are getting into position for birth!",
    40: "Your baby is ready to meet you! Full term and preparing for their big day!",
  };

  // Find closest week
  const weeks = Object.keys(info).map(Number).sort((a, b) => a - b);
  const closestWeek = weeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );

  return info[closestWeek] || info[24];
}

// ════════════════════════════════════════
// ENHANCED DASHBOARD RENDERING
// ════════════════════════════════════════

function renderDashboardV2() {
  // Render journey thread hero card
  renderJourneyThread();

  // Render summary cards if not already present
  const dashboardSection = document.querySelector('.dashboard-section');
  if (dashboardSection && !document.querySelector('.summary-grid-v2')) {
    renderSummaryCards();
  }
}

function renderSummaryCards() {
  // This would be called after the hero card to add hydration and affirmation cards
  // For now, we'll keep the existing dashboard cards and just enhance the hero
  // Full implementation would go here
}

// ════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════

// Hook into existing dashboard render
if (window.MC) {
  const originalGoTo = window.MC.goTo || window.goTo;
  const enhancedGoTo = function(page) {
    if (typeof originalGoTo === 'function') {
      originalGoTo(page);
    }
    
    // If navigating to dashboard, render v2 enhancements
    if (page === 'dashboard') {
      setTimeout(() => renderDashboardV2(), 100);
    }
  };
  
  if (window.MC) {
    window.MC.goTo = enhancedGoTo;
  }
  window.goTo = enhancedGoTo;
}

// Auto-render on page load if dashboard is active
document.addEventListener('DOMContentLoaded', () => {
  const dashboardPage = document.getElementById('page-dashboard');
  if (dashboardPage && dashboardPage.classList.contains('active')) {
    setTimeout(() => renderDashboardV2(), 200);
  }
});

// Export for use in window.MC
if (window.MC) {
  window.MC.renderJourneyThread = renderJourneyThread;
  window.MC.renderDashboardV2 = renderDashboardV2;
}

console.log('✨ Dashboard v2 with Journey Thread loaded');
