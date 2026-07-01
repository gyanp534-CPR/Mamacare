// @ts-nocheck
/**
 * MamaCare — Breastfeeding/Lactation Tracker
 * Post-delivery feature for tracking feeds, duration, and latch quality
 */

'use strict';

const BF = {
  activeSession: null,
  startTime: null,
  timerInterval: null,
  currentBreast: null,
  todayFeeds: [],
  history: []
};

/**
 * Initialize breastfeeding tracker
 */
window.initBreastfeedingTracker = function() {
  loadTodayFeeds();
  loadFeedHistory();
  renderBreastfeedingUI();
  setupBreastfeedingListeners();
};

/**
 * Render breastfeeding tracker UI
 */
function renderBreastfeedingUI() {
  const container = document.getElementById('bfPage');
  if (!container) return;

  container.innerHTML = `
    <div style="padding:20px 0 8px">
      <div class="sec-label">Postpartum Care</div>
      <div class="sec-title">Breastfeeding Tracker 🍼</div>
    </div>

    <!-- Info Card -->
    <div class="card" style="background:rgba(106,184,154,.08)">
      <p style="font-size:13px;color:var(--warm);line-height:1.7;margin:0">
        Track baby's feeding sessions — left/right breast, duration, latch quality. 
        Helps establish feeding routine and identify any issues early.
      </p>
    </div>

    <!-- Active Session Card -->
    <div class="card" id="bfActiveSession" style="display:none;background:linear-gradient(135deg,rgba(106,184,154,.12),rgba(106,184,154,.08))">
      <div style="text-align:center">
        <div style="font-size:48px;margin-bottom:12px">🍼</div>
        <div style="font-size:14px;font-weight:600;color:var(--green);margin-bottom:8px">
          Feeding in Progress
        </div>
        <div style="font-size:32px;font-weight:700;color:var(--green);font-family:'Courier New',monospace;margin-bottom:8px" id="bfTimer">
          00:00
        </div>
        <div style="font-size:13px;color:var(--muted);margin-bottom:16px" id="bfBreastLabel">
          Left Breast
        </div>
        <div style="display:flex;gap:10px;justify-content:center">
          <button class="btn btn-g" onclick="BF.switchBreast()">
            <i data-lucide="repeat" class="app-icon-inline"></i> Switch
          </button>
          <button class="btn btn-p" onclick="BF.endSession()">
            <i data-lucide="check" class="app-icon-inline"></i> End Feed
          </button>
        </div>
      </div>
    </div>

    <!-- Start New Session -->
    <div class="card" id="bfStartCard">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;color:var(--warm)">
        Start New Feed
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <button class="btn btn-p" onclick="BF.startFeed('left')" style="padding:20px">
          <div style="font-size:24px;margin-bottom:4px">👈</div>
          <div>Left Breast</div>
        </button>
        <button class="btn btn-p" onclick="BF.startFeed('right')" style="padding:20px">
          <div style="font-size:24px;margin-bottom:4px">👉</div>
          <div>Right Breast</div>
        </button>
      </div>
      <button class="btn btn-g" onclick="BF.startFeed('both')" style="width:100%;margin-top:10px;padding:20px">
        <div style="font-size:24px;margin-bottom:4px">👐</div>
        <div>Both Breasts</div>
      </button>
    </div>

    <!-- Today's Summary -->
    <div class="card">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;color:var(--warm)">
        Today's Summary
      </div>
      <div class="g3" id="bfTodayStats">
        <div style="text-align:center;padding:16px;background:rgba(106,184,154,.08);border-radius:12px">
          <div style="font-size:24px;font-weight:700;color:var(--green)" id="bfTotalFeeds">0</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">Total Feeds</div>
        </div>
        <div style="text-align:center;padding:16px;background:rgba(106,184,154,.08);border-radius:12px">
          <div style="font-size:24px;font-weight:700;color:var(--green)" id="bfTotalDuration">0m</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">Total Time</div>
        </div>
        <div style="text-align:center;padding:16px;background:rgba(106,184,154,.08);border-radius:12px">
          <div style="font-size:24px;font-weight:700;color:var(--green)" id="bfAvgDuration">0m</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">Avg Duration</div>
        </div>
      </div>
      
      <!-- Feeding Intervals -->
      <div style="margin-top:16px;padding:12px;background:rgba(106,184,154,.06);border-radius:10px">
        <div style="font-size:12px;font-weight:600;color:var(--green);margin-bottom:6px">
          Last Feed:
        </div>
        <div style="font-size:13px;color:var(--warm)" id="bfLastFeed">
          No feeds recorded today
        </div>
      </div>
    </div>

    <!-- Today's Feed Log -->
    <div class="card">
      <div style="font-size:14px;font-weight:600;margin-bottom:12px;color:var(--warm)">
        Today's Feeds
      </div>
      <div id="bfTodayLog"></div>
    </div>

    <!-- Quick Tips -->
    <div class="card" style="background:rgba(212,168,83,.06)">
      <h3 style="font-size:14px;font-weight:600;color:var(--gold);margin-bottom:10px">
        💡 Feeding Tips
      </h3>
      <ul style="font-size:12px;color:var(--warm);line-height:1.8;padding-left:20px;margin:0">
        <li><strong>Newborns (0-4 weeks):</strong> Feed 8-12 times per day (every 2-3 hours)</li>
        <li><strong>1-2 months:</strong> 7-9 times per day</li>
        <li><strong>2-6 months:</strong> 6-8 times per day</li>
        <li><strong>Good latch:</strong> Baby's mouth covers most of areola, not just nipple</li>
        <li><strong>Switch breasts:</strong> When baby slows/stops sucking on first breast</li>
        <li><strong>Duration:</strong> Typically 10-20 minutes per breast</li>
        <li><strong>Wet diapers:</strong> 6+ wet diapers per day = good milk intake</li>
      </ul>
    </div>

    <!-- Weekly History -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:14px;font-weight:600;color:var(--warm)">
          Last 7 Days
        </div>
        <button class="btn btn-g btn-sm" onclick="BF.exportHistory()">
          <i data-lucide="download" class="app-icon-inline"></i> Export
        </button>
      </div>
      <canvas id="bfWeeklyChart" height="180"></canvas>
    </div>

    <!-- Latch Issues -->
    <div class="card" style="background:#fff5f5;border:1.5px solid #fecaca">
      <h3 style="font-size:14px;font-weight:600;color:#dc2626;margin-bottom:10px">
        🚨 When to Contact Lactation Consultant
      </h3>
      <ul style="font-size:12px;color:#991b1b;line-height:1.8;padding-left:20px;margin:0">
        <li>Severe nipple pain that doesn't improve</li>
        <li>Baby not gaining weight adequately</li>
        <li>Fewer than 6 wet diapers per day after day 5</li>
        <li>Baby seems hungry after every feed</li>
        <li>Hard, painful lumps in breast (possible mastitis)</li>
        <li>Baby falling asleep within 5 minutes every feed</li>
        <li>Persistent latch difficulties</li>
      </ul>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  renderTodayFeeds();
  renderWeeklyChart();
}

/**
 * Setup event listeners
 */
function setupBreastfeedingListeners() {
  // Auto-refresh every minute when session active
  setInterval(() => {
    if (BF.activeSession) {
      updateFeedTimer();
    }
  }, 1000);
}

/**
 * Start a feeding session
 */
function startFeed(breast) {
  if (BF.activeSession) {
    alert('Please end current session first');
    return;
  }

  BF.activeSession = true;
  BF.startTime = Date.now();
  BF.currentBreast = breast;

  // Update UI
  document.getElementById('bfActiveSession').style.display = 'block';
  document.getElementById('bfStartCard').style.display = 'none';
  
  const breastLabels = {
    left: 'Left Breast 👈',
    right: 'Right Breast 👉',
    both: 'Both Breasts 👐'
  };
  document.getElementById('bfBreastLabel').textContent = breastLabels[breast];

  // Start timer
  BF.timerInterval = setInterval(updateFeedTimer, 1000);
  updateFeedTimer();

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Update feed timer display
 */
function updateFeedTimer() {
  if (!BF.activeSession || !BF.startTime) return;

  const elapsed = Math.floor((Date.now() - BF.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const timerEl = document.getElementById('bfTimer');
  if (timerEl) {
    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

/**
 * Switch breast during feed
 */
function switchBreast() {
  if (!BF.activeSession) return;

  const switchMap = {
    left: 'right',
    right: 'left',
    both: 'both'
  };

  BF.currentBreast = switchMap[BF.currentBreast] || 'left';
  
  const breastLabels = {
    left: 'Left Breast 👈',
    right: 'Right Breast 👉',
    both: 'Both Breasts 👐'
  };
  
  document.getElementById('bfBreastLabel').textContent = breastLabels[BF.currentBreast];
  
  // Show notification
  const notification = document.createElement('div');
  notification.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:var(--green);color:white;padding:12px 24px;border-radius:50px;font-size:14px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
  notification.textContent = `Switched to ${breastLabels[BF.currentBreast]}`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

/**
 * End feeding session
 */
async function endFeedSession() {
  if (!BF.activeSession || !window.user || !window.supa) return;

  clearInterval(BF.timerInterval);
  
  const duration = Math.floor((Date.now() - BF.startTime) / 60000); // minutes
  
  // Show latch quality dialog
  const latchQuality = await promptLatchQuality();
  const notes = await promptFeedNotes();

  try {
    // Save to database
    const now = new Date();
    const { error } = await window.supa.from('breastfeeding_logs').insert({
      user_id: window.user.id,
      session_date: now.toISOString().split('T')[0],
      session_time: now.toTimeString().split(' ')[0],
      breast_side: BF.currentBreast,
      duration_minutes: duration,
      latch_quality: latchQuality,
      notes: notes || null
    });

    if (error) throw error;

    // Reset state
    BF.activeSession = null;
    BF.startTime = null;
    BF.currentBreast = null;

    // Update UI
    document.getElementById('bfActiveSession').style.display = 'none';
    document.getElementById('bfStartCard').style.display = 'block';

    // Reload data
    await loadTodayFeeds();
    await loadFeedHistory();
    renderTodayFeeds();
    renderWeeklyChart();

    // Track analytics
    window.supa.from('analytics_events').insert({
      user_id: window.user.id,
      event_name: 'breastfeeding_session_logged',
      event_properties: { duration_minutes: duration, latch_quality: latchQuality }
    }).then(() => {}).catch(() => {});

  } catch (error) {
    console.error('Error saving feed:', error);
    alert('Failed to save feeding session. Please try again.');
  }
}

/**
 * Prompt for latch quality
 */
function promptLatchQuality() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px';
    modal.innerHTML = `
      <div style="background:white;border-radius:20px;padding:28px;max-width:400px;width:100%">
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:#4a2c2a;margin-bottom:16px;text-align:center">
          How was the latch?
        </h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn-p" onclick="this.parentElement.parentElement.parentElement.remove();window.BF._latchResolve('good')" style="padding:16px;font-size:15px">
            😊 Good - No pain, baby feeding well
          </button>
          <button class="btn btn-g" onclick="this.parentElement.parentElement.parentElement.remove();window.BF._latchResolve('okay')" style="padding:16px;font-size:15px">
            😐 Okay - Some discomfort but manageable
          </button>
          <button class="btn" onclick="this.parentElement.parentElement.parentElement.remove();window.BF._latchResolve('poor')" style="padding:16px;font-size:15px;background:#fecaca;color:#991b1b">
            😣 Poor - Painful, baby struggling
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    window.BF._latchResolve = (quality) => {
      resolve(quality);
      delete window.BF._latchResolve;
    };
  });
}

/**
 * Prompt for feed notes
 */
function promptFeedNotes() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px';
    modal.innerHTML = `
      <div style="background:white;border-radius:20px;padding:28px;max-width:400px;width:100%">
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:#4a2c2a;margin-bottom:12px">
          Any notes? (Optional)
        </h3>
        <p style="font-size:13px;color:#666;margin-bottom:16px">
          e.g., "Baby sleepy", "Right breast feels full", etc.
        </p>
        <textarea id="bfNotesInput" rows="3" placeholder="Type here..." style="width:100%;padding:12px;border:1.5px solid #e5e7eb;border-radius:10px;font-family:inherit;font-size:14px;margin-bottom:12px"></textarea>
        <div style="display:flex;gap:10px">
          <button class="btn btn-g" onclick="window.BF._notesResolve('');this.parentElement.parentElement.parentElement.remove()" style="flex:1">
            Skip
          </button>
          <button class="btn btn-p" onclick="window.BF._notesResolve(document.getElementById('bfNotesInput').value);this.parentElement.parentElement.parentElement.remove()" style="flex:1">
            Save
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    window.BF._notesResolve = (notes) => {
      resolve(notes);
      delete window.BF._notesResolve;
    };
  });
}

/**
 * Load today's feeds
 */
async function loadTodayFeeds() {
  if (!window.user || !window.supa) return;

  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await window.supa
    .from('breastfeeding_logs')
    .select('*')
    .eq('user_id', window.user.id)
    .eq('session_date', today)
    .order('session_time', { ascending: false });

  if (!error && data) {
    BF.todayFeeds = data;
  }
}

/**
 * Load feed history (last 7 days)
 */
async function loadFeedHistory() {
  if (!window.user || !window.supa) return;

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const { data, error } = await window.supa
    .from('breastfeeding_logs')
    .select('*')
    .eq('user_id', window.user.id)
    .gte('session_date', weekAgo)
    .order('session_date');

  if (!error && data) {
    BF.history = data;
  }
}

/**
 * Render today's feeds
 */
function renderTodayFeeds() {
  const totalFeeds = BF.todayFeeds.length;
  const totalDuration = BF.todayFeeds.reduce((sum, f) => sum + f.duration_minutes, 0);
  const avgDuration = totalFeeds > 0 ? Math.round(totalDuration / totalFeeds) : 0;

  // Update stats
  document.getElementById('bfTotalFeeds').textContent = totalFeeds;
  document.getElementById('bfTotalDuration').textContent = totalDuration + 'm';
  document.getElementById('bfAvgDuration').textContent = avgDuration + 'm';

  // Update last feed
  const lastFeedEl = document.getElementById('bfLastFeed');
  if (BF.todayFeeds.length > 0) {
    const lastFeed = BF.todayFeeds[0];
    const timeAgo = getTimeAgo(lastFeed.session_time);
    const breastIcons = { left: '👈', right: '👉', both: '👐' };
    lastFeedEl.textContent = `${timeAgo} • ${breastIcons[lastFeed.breast_side]} ${lastFeed.breast_side} • ${lastFeed.duration_minutes}min`;
  } else {
    lastFeedEl.textContent = 'No feeds recorded today';
  }

  // Render feed log
  const logEl = document.getElementById('bfTodayLog');
  if (!logEl) return;

  if (BF.todayFeeds.length === 0) {
    logEl.innerHTML = '<p style="font-size:13px;color:var(--muted);text-align:center;padding:20px">No feeds logged yet today</p>';
    return;
  }

  logEl.innerHTML = BF.todayFeeds.map(feed => {
    const breastIcons = { left: '👈', right: '👉', both: '👐' };
    const latchColors = { good: '#16a34a', okay: '#d97706', poor: '#dc2626' };
    const latchLabels = { good: 'Good', okay: 'Okay', poor: 'Poor' };
    
    return `
      <div style="padding:12px;border-bottom:1px solid #f0e0e0;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--warm);margin-bottom:4px">
            ${breastIcons[feed.breast_side]} ${feed.breast_side.charAt(0).toUpperCase() + feed.breast_side.slice(1)} Breast
          </div>
          <div style="font-size:12px;color:var(--muted)">
            ${formatTime(feed.session_time)} • ${feed.duration_minutes} min
            ${feed.latch_quality ? ` • <span style="color:${latchColors[feed.latch_quality]}">${latchLabels[feed.latch_quality]} latch</span>` : ''}
          </div>
          ${feed.notes ? `<div style="font-size:11px;color:#666;margin-top:4px;font-style:italic">"${feed.notes}"</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render weekly chart
 */
function renderWeeklyChart() {
  const canvas = document.getElementById('bfWeeklyChart');
  if (!canvas || !window.Chart) return;

  // Group by date
  const dateGroups = {};
  BF.history.forEach(feed => {
    const date = feed.session_date;
    if (!dateGroups[date]) {
      dateGroups[date] = { count: 0, duration: 0 };
    }
    dateGroups[date].count++;
    dateGroups[date].duration += feed.duration_minutes;
  });

  // Get last 7 days
  const labels = [];
  const feedCounts = [];
  const durations = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const dayName = new Date(date).toLocaleDateString('en-IN', { weekday: 'short' });
    labels.push(dayName);
    
    const data = dateGroups[date] || { count: 0, duration: 0 };
    feedCounts.push(data.count);
    durations.push(data.duration);
  }

  // Destroy existing chart
  if (canvas.chart) {
    canvas.chart.destroy();
  }

  // Create new chart
  canvas.chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Feeds per Day',
        data: feedCounts,
        backgroundColor: 'rgba(106,184,154,0.6)',
        borderColor: 'rgba(106,184,154,1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 2 }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const idx = context.dataIndex;
              return `Total: ${durations[idx]} minutes`;
            }
          }
        }
      }
    }
  });
}

/**
 * Export feed history
 */
function exportFeedHistory() {
  if (BF.history.length === 0) {
    alert('No feed data to export');
    return;
  }

  // Create CSV
  const headers = ['Date', 'Time', 'Breast', 'Duration (min)', 'Latch Quality', 'Notes'];
  const rows = BF.history.map(feed => [
    feed.session_date,
    feed.session_time,
    feed.breast_side,
    feed.duration_minutes,
    feed.latch_quality || '',
    feed.notes || ''
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `breastfeeding-log-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Helper: Format time
 */
function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

/**
 * Helper: Get time ago
 */
function getTimeAgo(timeStr) {
  const now = new Date();
  const feedTime = new Date(`${now.toISOString().split('T')[0]}T${timeStr}`);
  const diffMinutes = Math.floor((now - feedTime) / 60000);
  
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const hours = Math.floor(diffMinutes / 60);
  return `${hours}h ago`;
}

// Export to window
window.BF = {
  startFeed: startFeed,
  switchBreast: switchBreast,
  endSession: endFeedSession,
  exportHistory: exportFeedHistory
};

window.initBreastfeedingTracker = initBreastfeedingTracker;
