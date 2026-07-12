// @ts-nocheck
/**
 * MamaCare — Contraction Timer Module
 * Tracks labor contractions with 5-1-1 rule alerts
 */

(function() {
  'use strict';

  const CONTRACTION = {
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    timerInterval: null,
    contractions: [], // Array of {start, end, duration, frequency}
    lastEndTime: null
  };

  /**
   * Initialize contraction timer
   */
  window.initContractionTimer = function() {
    loadContractions();
    renderContractionHistory();
    
    // Set up event listeners
    const startBtn = document.getElementById('startContractionBtn');
    const endBtn = document.getElementById('endContractionBtn');
    const resetBtn = document.getElementById('resetContractionBtn');
    const exportBtn = document.getElementById('exportContractionBtn');
    
    if (startBtn) startBtn.addEventListener('click', startContraction);
    if (endBtn) endBtn.addEventListener('click', endContraction);
    if (resetBtn) resetBtn.addEventListener('click', resetContractionTimer);
    if (exportBtn) exportBtn.addEventListener('click', exportContractions);
  };

  /**
   * Start timing a contraction
   */
  function startContraction() {
    if (CONTRACTION.isRunning) return;

    CONTRACTION.isRunning = true;
    CONTRACTION.startTime = Date.now();
    CONTRACTION.elapsedTime = 0;

    // Update UI
    const startBtn = document.getElementById('startContractionBtn');
    const endBtn = document.getElementById('endContractionBtn');
    const resetBtn = document.getElementById('resetContractionBtn');
    const label = document.getElementById('contractionTimerLabel');
    const circle = document.getElementById('contractionCircle');
    
    if (startBtn) startBtn.style.display = 'none';
    if (endBtn) endBtn.style.display = 'block';
    if (resetBtn) resetBtn.style.display = 'block';
    if (label) label.textContent = 'Contracting...';
    if (circle) circle.classList.add('timer-active');

    // Start timer display
    CONTRACTION.timerInterval = setInterval(updateTimerDisplay, 100);
  }

  /**
   * End the current contraction
   */
  function endContraction() {
    if (!CONTRACTION.isRunning) return;

    CONTRACTION.isRunning = false;
    clearInterval(CONTRACTION.timerInterval);

    const endTime = Date.now();
    const duration = Math.round((endTime - CONTRACTION.startTime) / 1000); // in seconds
    const frequency = CONTRACTION.lastEndTime 
      ? Math.round((CONTRACTION.startTime - CONTRACTION.lastEndTime) / 1000 / 60) // in minutes
      : null;

    // Save contraction
    const contraction = {
      id: Date.now(),
      start: CONTRACTION.startTime,
      end: endTime,
      duration: duration,
      frequency: frequency,
      date: new Date(CONTRACTION.startTime).toISOString()
    };

    CONTRACTION.contractions.unshift(contraction);
    CONTRACTION.lastEndTime = endTime;

    // Save to localStorage
    saveContractions();

    // Update UI
    const startBtn = document.getElementById('startContractionBtn');
    const endBtn = document.getElementById('endContractionBtn');
    const circle = document.getElementById('contractionCircle');
    const label = document.getElementById('contractionTimerLabel');
    const stats = document.getElementById('contractionStats');
    
    if (startBtn) startBtn.style.display = 'block';
    if (endBtn) endBtn.style.display = 'none';
    if (circle) circle.classList.remove('timer-active');
    if (label) label.textContent = 'Contraction Ended';
    if (stats) stats.style.display = 'grid';
    
    updateStats();
    renderContractionHistory();

    // Check for 5-1-1 rule
    check511Rule();

    // Reset for next contraction
    setTimeout(() => {
      const display = document.getElementById('contractionTimerDisplay');
      const label = document.getElementById('contractionTimerLabel');
      if (display) display.textContent = '00:00';
      if (label) label.textContent = 'Press Start';
    }, 2000);
  }

  /**
   * Reset the timer (clears current timing only, not history)
   */
  function resetContractionTimer() {
    if (CONTRACTION.isRunning) {
      clearInterval(CONTRACTION.timerInterval);
      CONTRACTION.isRunning = false;
    }

    CONTRACTION.startTime = null;
    CONTRACTION.elapsedTime = 0;

    document.getElementById('contractionTimerDisplay').textContent = '00:00';
    document.getElementById('contractionTimerLabel').textContent = 'Press Start';
    document.getElementById('startContractionBtn').style.display = 'block';
    document.getElementById('endContractionBtn').style.display = 'none';
    document.getElementById('resetContractionBtn').style.display = 'none';
    document.getElementById('contractionCircle').classList.remove('timer-active');
  }

  /**
   * Update timer display
   */
  function updateTimerDisplay() {
    const elapsed = Date.now() - CONTRACTION.startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    document.getElementById('contractionTimerDisplay').textContent = 
      `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Update statistics
   */
  function updateStats() {
    const recent = CONTRACTION.contractions.slice(0, 10); // Last 10 contractions
    
    if (recent.length === 0) return;

    // Last duration
    const lastDuration = formatDuration(recent[0].duration);
    document.getElementById('statLastDuration').textContent = lastDuration;

    // Average duration
    const avgDuration = recent.reduce((sum, c) => sum + c.duration, 0) / recent.length;
    document.getElementById('statAvgDuration').textContent = formatDuration(Math.round(avgDuration));

    // Frequency (avg time between contractions)
    const withFreq = recent.filter(c => c.frequency !== null);
    if (withFreq.length > 0) {
      const avgFreq = withFreq.reduce((sum, c) => sum + c.frequency, 0) / withFreq.length;
      document.getElementById('statFrequency').textContent = `${Math.round(avgFreq)} min`;
    } else {
      document.getElementById('statFrequency').textContent = '-';
    }

    // Total count today
    const today = new Date().toDateString();
    const todayCount = CONTRACTION.contractions.filter(c => 
      new Date(c.start).toDateString() === today
    ).length;
    document.getElementById('statCount').textContent = todayCount;
  }

  /**
   * Check for 5-1-1 rule (5 min apart, 1 min long, for 1 hour)
   */
  function check511Rule() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentContractions = CONTRACTION.contractions.filter(c => c.start > oneHourAgo);

    if (recentContractions.length < 6) return; // Need at least 6 contractions in an hour

    // Check if all recent contractions meet criteria
    const meets511 = recentContractions.every(c => {
      // Duration: 45-90 seconds (giving some tolerance around 60)
      const durationOk = c.duration >= 45 && c.duration <= 90;
      
      // Frequency: 3-7 minutes apart (giving tolerance around 5)
      const freqOk = c.frequency !== null && c.frequency >= 3 && c.frequency <= 7;
      
      return durationOk && freqOk;
    });

    if (meets511) {
      const alertCard = document.getElementById('alert511Card');
      if (alertCard) alertCard.style.display = 'block';
      
      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }

      // Show notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('MamaCare Alert', {
          body: '5-1-1 Rule Alert! Your contractions match the labor pattern. Consider calling your doctor.',
          icon: '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/180.png',
          badge: '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/180.png',
          tag: '511-alert'
        });
      }
    }
  }

  /**
   * Dismiss 5-1-1 alert
   */
  window.dismissAlert511 = function() {
    const alertCard = document.getElementById('alert511Card');
    if (alertCard) alertCard.style.display = 'none';
  };

  /**
   * Navigate to a section (for use in HTML onclick)
   */
  window.showSection = function(sectionName) {
    if (window.goTo) {
      window.goTo(sectionName);
    } else {
      console.error('Navigation function not available');
    }
  };

  /**
   * Render contraction history
   */
  function renderContractionHistory() {
    const container = document.getElementById('contractionHistory');
    if (!container) return;

    if (CONTRACTION.contractions.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:var(--muted);">
          <i data-lucide="timer" style="width:48px; height:48px; opacity:0.3; margin-bottom:12px;"></i>
          <p style="font-size:14px;">No contractions tracked yet</p>
          <p style="font-size:13px; margin-top:8px;">Start timing when you feel a contraction</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Group by date
    const byDate = {};
    CONTRACTION.contractions.forEach(c => {
      const dateStr = new Date(c.start).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      if (!byDate[dateStr]) byDate[dateStr] = [];
      byDate[dateStr].push(c);
    });

    let html = '';
    for (const [date, contractions] of Object.entries(byDate)) {
      html += `
        <div class="contraction-date-group">
          <div class="contraction-date-header">${date} (${contractions.length} contractions)</div>
          <div class="contraction-list">
      `;

      contractions.forEach((c, idx) => {
        const time = new Date(c.start).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const duration = formatDuration(c.duration);
        const frequency = c.frequency ? `${c.frequency} min apart` : 'First';

        html += `
          <div class="contraction-item">
            <div class="contraction-time">${time}</div>
            <div class="contraction-details">
              <div class="contraction-duration">
                <i data-lucide="clock" style="width:14px; height:14px;"></i>
                ${duration}
              </div>
              <div class="contraction-frequency">
                <i data-lucide="activity" style="width:14px; height:14px;"></i>
                ${frequency}
              </div>
            </div>
            <button class="btn-icon-sm" onclick="deleteContraction(${c.id})" title="Delete">
              <i data-lucide="trash-2" style="width:16px; height:16px;"></i>
            </button>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
    lucide.createIcons();
  }

  /**
   * Delete a contraction
   */
  window.deleteContraction = function(id) {
    if (!confirm('Delete this contraction?')) return;
    
    CONTRACTION.contractions = CONTRACTION.contractions.filter(c => c.id !== id);
    saveContractions();
    updateStats();
    renderContractionHistory();
  };

  /**
   * Export contractions as CSV
   */
  function exportContractions() {
    if (CONTRACTION.contractions.length === 0) {
      alert('No contractions to export');
      return;
    }

    // Create CSV content
    let csv = 'Date,Time,Duration (seconds),Frequency (minutes)\n';
    
    CONTRACTION.contractions.slice().reverse().forEach(c => {
      const date = new Date(c.start).toLocaleDateString('en-US');
      const time = new Date(c.start).toLocaleTimeString('en-US');
      const frequency = c.frequency || 'N/A';
      csv += `${date},${time},${c.duration},${frequency}\n`;
    });

    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contractions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Show success message
    const exportBtn = document.getElementById('exportContractionBtn');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i data-lucide="check" class="app-icon-inline"></i> Exported';
    lucide.createIcons();
    
    setTimeout(() => {
      exportBtn.innerHTML = originalText;
      lucide.createIcons();
    }, 2000);
  }

  /**
   * Format duration in seconds to readable string
   */
  function formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    }
  }

  /**
   * Save contractions to localStorage AND Supabase
   */
  function saveContractions() {
    try {
      localStorage.setItem('mamacare_contractions', JSON.stringify({
        contractions: CONTRACTION.contractions,
        lastEndTime: CONTRACTION.lastEndTime
      }));
    } catch (e) {
      console.error('Failed to save contractions to localStorage:', e);
    }
    
    // CRITICAL: Also sync to Supabase for cross-device access and data safety
    if (window.user && window.supa && CONTRACTION.contractions.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      window.supa.from('contraction_sessions').upsert({
        user_id: window.user.id,
        session_date: today,
        contractions: JSON.stringify(CONTRACTION.contractions),
        last_end_time: CONTRACTION.lastEndTime,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id,session_date' 
      }).then(() => {
        console.log('✅ Contractions synced to Supabase');
      }).catch(err => {
        console.error('❌ Failed to sync contractions to Supabase:', err);
      });
    }
  }

  /**
   * Load contractions from Supabase first, then fallback to localStorage
   */
  async function loadContractions() {
    // Try loading from Supabase first (cross-device sync)
    if (window.user && window.supa) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await window.supa
          .from('contraction_sessions')
          .select('contractions, last_end_time')
          .eq('user_id', window.user.id)
          .eq('session_date', today)
          .maybeSingle();
        
        if (!error && data) {
          CONTRACTION.contractions = JSON.parse(data.contractions || '[]');
          CONTRACTION.lastEndTime = data.last_end_time || null;
          
          // Also save to localStorage for offline access
          localStorage.setItem('mamacare_contractions', JSON.stringify({
            contractions: CONTRACTION.contractions,
            lastEndTime: CONTRACTION.lastEndTime
          }));
          
          console.log('✅ Loaded contractions from Supabase');
          
          if (CONTRACTION.contractions.length > 0) {
            document.getElementById('contractionStats').style.display = 'grid';
            updateStats();
          }
          return;
        }
      } catch (e) {
        console.error('Failed to load from Supabase, trying localStorage:', e);
      }
    }
    
    // Fallback to localStorage
    try {
      const saved = localStorage.getItem('mamacare_contractions');
      if (saved) {
        const data = JSON.parse(saved);
        CONTRACTION.contractions = data.contractions || [];
        CONTRACTION.lastEndTime = data.lastEndTime || null;

        // Show stats if we have contractions
        if (CONTRACTION.contractions.length > 0) {
          document.getElementById('contractionStats').style.display = 'grid';
          updateStats();
        }
      }
    } catch (e) {
      console.error('Failed to load contractions:', e);
    }
  }

  /**
   * Clear all contraction history (for testing/reset)
   */
  window.clearContractionHistory = function() {
    if (!confirm('Clear all contraction history? This cannot be undone.')) return;
    
    CONTRACTION.contractions = [];
    CONTRACTION.lastEndTime = null;
    saveContractions();
    updateStats();
    renderContractionHistory();
    document.getElementById('contractionStats').style.display = 'none';
    document.getElementById('alert511Card').style.display = 'none';
  };

  /**
   * Get contraction pattern analysis for sharing with doctor
   */
  window.getContractionPattern = function() {
    if (CONTRACTION.contractions.length === 0) {
      return 'No contractions tracked yet.';
    }

    const recent = CONTRACTION.contractions.slice(0, 10);
    const avgDuration = recent.reduce((sum, c) => sum + c.duration, 0) / recent.length;
    const withFreq = recent.filter(c => c.frequency !== null);
    const avgFreq = withFreq.length > 0 
      ? withFreq.reduce((sum, c) => sum + c.frequency, 0) / withFreq.length 
      : null;

    return {
      totalContractions: CONTRACTION.contractions.length,
      todayCount: CONTRACTION.contractions.filter(c => 
        new Date(c.start).toDateString() === new Date().toDateString()
      ).length,
      averageDuration: Math.round(avgDuration),
      averageFrequency: avgFreq ? Math.round(avgFreq) : null,
      lastContraction: CONTRACTION.contractions[0],
      pattern: check511Pattern() ? '5-1-1 (Active Labor)' : 'Irregular (Early Labor)',
      recommendation: check511Pattern() 
        ? 'Call your doctor and prepare to go to hospital'
        : 'Continue monitoring, stay comfortable'
    };
  };

  /**
   * Check if pattern matches 5-1-1 (non-alerting version)
   */
  function check511Pattern() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentContractions = CONTRACTION.contractions.filter(c => c.start > oneHourAgo);
    
    if (recentContractions.length < 6) return false;
    
    return recentContractions.every(c => {
      const durationOk = c.duration >= 45 && c.duration <= 90;
      const freqOk = c.frequency !== null && c.frequency >= 3 && c.frequency <= 7;
      return durationOk && freqOk;
    });
  }

  /**
   * Add note to a contraction
   */
  window.addContractionNote = function(id, note) {
    const contraction = CONTRACTION.contractions.find(c => c.id === id);
    if (contraction) {
      contraction.note = note;
      saveContractions();
      renderContractionHistory();
    }
  };

  /**
   * Share contraction summary (Web Share API)
   */
  window.shareContractionSummary = async function() {
    const pattern = getContractionPattern();
    
    if (typeof pattern === 'string') {
      alert(pattern);
      return;
    }

    const text = `Contraction Summary:\n` +
      `Total: ${pattern.totalContractions} (${pattern.todayCount} today)\n` +
      `Average Duration: ${pattern.averageDuration}s\n` +
      `Average Frequency: ${pattern.averageFrequency || 'N/A'} min\n` +
      `Pattern: ${pattern.pattern}\n` +
      `Recommendation: ${pattern.recommendation}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MamaCare - Contraction Summary',
          text: text
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        alert('Summary copied to clipboard!');
      });
    }
  };

  // Helper function (if not already defined)
  if (!window.$) {
    window.$ = (sel) => document.querySelector(sel);
  }

})();

