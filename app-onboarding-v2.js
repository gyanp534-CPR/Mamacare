/**
 * MamaCare - Enhanced Onboarding Flow v2.0
 * Beautiful, engaging first-time user experience
 */

const ONBOARDING_V2 = {
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to MamaCare! 🌸',
      subtitle: 'Your complete pregnancy companion',
      content: 'Track your journey, connect with your baby, and get personalized care — all in one place.',
      icon: '💗',
      action: 'Get Started',
      image: 'mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/512.png'
    },
    {
      id: 'due-date',
      title: 'When is your due date? 📅',
      subtitle: 'This helps us personalize your experience',
      content: 'We\'ll show you week-by-week updates tailored to your pregnancy.',
      icon: '🗓️',
      action: 'Continue',
      input: 'date'
    },
    {
      id: 'features',
      title: 'Everything you need in one app ✨',
      subtitle: 'Explore key features',
      content: '',
      icon: '🎯',
      action: 'Continue',
      cards: [
        { icon: '📊', title: 'Smart Tracking', desc: 'Weight, sleep, nutrition, mood' },
        { icon: '⏱️', title: 'Contraction Timer', desc: '5-1-1 rule detection for labor' },
        { icon: '💬', title: 'AI Coach', desc: '24/7 pregnancy guidance' },
        { icon: '👶', title: 'Baby Updates', desc: 'Week-by-week development' },
        { icon: '🧘', title: 'Yoga & Wellness', desc: 'Safe exercises for pregnancy' },
        { icon: '📸', title: 'Journal & Memories', desc: 'Document your journey' }
      ]
    },
    {
      id: 'notifications',
      title: 'Never miss important moments 🔔',
      subtitle: 'Enable reminders and updates',
      content: 'Get medicine reminders, kick count alerts, and weekly baby updates.',
      icon: '⏰',
      action: 'Enable Notifications',
      optional: true
    },
    {
      id: 'ready',
      title: 'You\'re all set! 🎉',
      subtitle: 'Your personalized dashboard is ready',
      content: 'We\'ve prepared everything based on your due date. Let\'s start tracking!',
      icon: '🌟',
      action: 'Start My Journey',
      confetti: true
    }
  ]
};

// ══════════════════════════════════════
// ONBOARDING STATE
// ══════════════════════════════════════
let currentStep = 0;
let onboardingData = {
  due_date: null,
  lmp_date: null,
  notifications_enabled: false,
  completed_at: null
};

// ══════════════════════════════════════
// INIT ONBOARDING
// ══════════════════════════════════════
function initOnboardingV2() {
  // Check if user needs onboarding
  const user = window.user;
  if (!user) return;

  const profile = JSON.parse(localStorage.getItem('mc_profile') || '{}');
  const hasCompletedOnboarding = profile.onboarding_completed || false;
  const hasDueDate = profile.due_date || false;

  if (!hasCompletedOnboarding || !hasDueDate) {
    showOnboarding();
  }
}

// ══════════════════════════════════════
// SHOW ONBOARDING OVERLAY
// ══════════════════════════════════════
function showOnboarding() {
  const overlay = document.createElement('div');
  overlay.id = 'onboardingOverlay';
  overlay.className = 'onboarding-overlay';
  
  overlay.innerHTML = `
    <div class="onboarding-container">
      <div class="onboarding-progress">
        <div class="onboarding-progress-bar" id="obProgress"></div>
      </div>
      <div class="onboarding-content" id="obContent"></div>
      <div class="onboarding-nav">
        <button class="btn btn-g" id="obSkip" style="opacity:0.7">Skip for now</button>
        <button class="btn btn-p" id="obNext">Next</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Event listeners
  document.getElementById('obNext').addEventListener('click', nextStep);
  document.getElementById('obSkip').addEventListener('click', skipOnboarding);
  
  // Show first step
  renderStep();
  
  // Animate in
  setTimeout(() => overlay.classList.add('active'), 100);
}

// ══════════════════════════════════════
// RENDER CURRENT STEP
// ══════════════════════════════════════
function renderStep() {
  const step = ONBOARDING_V2.steps[currentStep];
  const content = document.getElementById('obContent');
  const nextBtn = document.getElementById('obNext');
  const skipBtn = document.getElementById('obSkip');
  
  // Update progress bar
  const progress = ((currentStep + 1) / ONBOARDING_V2.steps.length) * 100;
  document.getElementById('obProgress').style.width = progress + '%';
  
  // Update button text
  nextBtn.textContent = step.action;
  skipBtn.style.display = step.optional ? 'block' : 'none';
  
  // Render step content
  let html = '';
  
  if (step.id === 'welcome') {
    html = `
      <div class="ob-step ob-welcome">
        <img src="${step.image}" alt="MamaCare" class="ob-logo" />
        <h1 class="ob-title">${step.title}</h1>
        <p class="ob-subtitle">${step.subtitle}</p>
        <p class="ob-text">${step.content}</p>
        <div class="ob-features-preview">
          <div class="ob-feature-badge">📊 Smart Tracking</div>
          <div class="ob-feature-badge">💬 AI Coach</div>
          <div class="ob-feature-badge">⏱️ Contraction Timer</div>
        </div>
      </div>
    `;
  }
  
  else if (step.id === 'due-date') {
    html = `
      <div class="ob-step ob-due-date">
        <div class="ob-icon">${step.icon}</div>
        <h2 class="ob-title">${step.title}</h2>
        <p class="ob-subtitle">${step.subtitle}</p>
        
        <div class="ob-input-group">
          <label class="ob-label">Select your due date</label>
          <input type="date" id="obDueDate" class="ob-date-input" 
            min="${new Date().toISOString().split('T')[0]}"
            max="${new Date(Date.now() + 280*24*60*60*1000).toISOString().split('T')[0]}" />
          
          <div class="ob-or-divider">or</div>
          
          <label class="ob-label">Enter your last menstrual period (LMP)</label>
          <input type="date" id="obLMP" class="ob-date-input" 
            max="${new Date().toISOString().split('T')[0]}" />
        </div>
        
        <p class="ob-hint">💡 Your due date helps us provide personalized weekly updates</p>
      </div>
    `;
  }
  
  else if (step.id === 'features') {
    html = `
      <div class="ob-step ob-features">
        <div class="ob-icon">${step.icon}</div>
        <h2 class="ob-title">${step.title}</h2>
        <p class="ob-subtitle">${step.subtitle}</p>
        
        <div class="ob-feature-grid">
          ${step.cards.map(card => `
            <div class="ob-feature-card">
              <div class="ob-card-icon">${card.icon}</div>
              <h3 class="ob-card-title">${card.title}</h3>
              <p class="ob-card-desc">${card.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  else if (step.id === 'notifications') {
    html = `
      <div class="ob-step ob-notifications">
        <div class="ob-icon">${step.icon}</div>
        <h2 class="ob-title">${step.title}</h2>
        <p class="ob-subtitle">${step.subtitle}</p>
        <p class="ob-text">${step.content}</p>
        
        <div class="ob-notification-preview">
          <div class="ob-notif-item">
            <span class="ob-notif-icon">💊</span>
            <div>
              <strong>Medicine Reminder</strong>
              <p>Time to take your prenatal vitamins</p>
            </div>
          </div>
          <div class="ob-notif-item">
            <span class="ob-notif-icon">💧</span>
            <div>
              <strong>Hydration Reminder</strong>
              <p>Drink a glass of water</p>
            </div>
          </div>
          <div class="ob-notif-item">
            <span class="ob-notif-icon">👶</span>
            <div>
              <strong>Baby Update</strong>
              <p>Your baby is the size of a mango this week!</p>
            </div>
          </div>
        </div>
        
        <p class="ob-hint">✨ You can customize notification settings anytime</p>
      </div>
    `;
  }
  
  else if (step.id === 'ready') {
    html = `
      <div class="ob-step ob-ready">
        <div class="ob-icon ob-icon-large">${step.icon}</div>
        <h2 class="ob-title">${step.title}</h2>
        <p class="ob-subtitle">${step.subtitle}</p>
        <p class="ob-text">${step.content}</p>
        
        <div class="ob-ready-preview">
          <div class="ob-ready-item">
            <span class="ob-ready-check">✓</span>
            <span>Due date configured</span>
          </div>
          <div class="ob-ready-item">
            <span class="ob-ready-check">✓</span>
            <span>Personalized dashboard ready</span>
          </div>
          <div class="ob-ready-item">
            <span class="ob-ready-check">✓</span>
            <span>Weekly updates enabled</span>
          </div>
          ${onboardingData.notifications_enabled ? `
            <div class="ob-ready-item">
              <span class="ob-ready-check">✓</span>
              <span>Notifications enabled</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  content.innerHTML = html;
  
  // Animate in
  content.classList.remove('ob-fade-in');
  setTimeout(() => content.classList.add('ob-fade-in'), 10);
  
  // Auto-focus date inputs
  if (step.id === 'due-date') {
    const dueDateInput = document.getElementById('obDueDate');
    const lmpInput = document.getElementById('obLMP');
    
    dueDateInput.addEventListener('change', (e) => {
      if (e.target.value) lmpInput.value = '';
      onboardingData.due_date = e.target.value;
    });
    
    lmpInput.addEventListener('change', (e) => {
      if (e.target.value) {
        dueDateInput.value = '';
        // Calculate due date from LMP (add 280 days)
        const lmp = new Date(e.target.value);
        const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
        onboardingData.lmp_date = e.target.value;
        onboardingData.due_date = dueDate.toISOString().split('T')[0];
      }
    });
  }
  
  // Confetti on final step
  if (step.confetti && window.triggerConfetti) {
    setTimeout(() => window.triggerConfetti(), 500);
  }
}

// ══════════════════════════════════════
// NEXT STEP
// ══════════════════════════════════════
async function nextStep() {
  const step = ONBOARDING_V2.steps[currentStep];
  
  // Validate current step
  if (step.id === 'due-date') {
    if (!onboardingData.due_date && !onboardingData.lmp_date) {
      alert('Please select your due date or enter your LMP to continue');
      return;
    }
  }
  
  // Handle notifications step
  if (step.id === 'notifications') {
    if (window.requestPushPermission) {
      const granted = await window.requestPushPermission();
      onboardingData.notifications_enabled = granted;
    }
  }
  
  // Save data on final step
  if (step.id === 'ready') {
    await completeOnboarding();
    return;
  }
  
  // Move to next step
  currentStep++;
  if (currentStep < ONBOARDING_V2.steps.length) {
    renderStep();
  }
}

// ══════════════════════════════════════
// SKIP ONBOARDING
// ══════════════════════════════════════
function skipOnboarding() {
  if (confirm('Are you sure you want to skip? We recommend completing setup for the best experience.')) {
    closeOnboarding();
  }
}

// ══════════════════════════════════════
// COMPLETE ONBOARDING
// ══════════════════════════════════════
async function completeOnboarding() {
  const user = window.user;
  if (!user) return;
  
  onboardingData.completed_at = new Date().toISOString();
  
  // Save to Supabase
  if (window.supa) {
    await window.supa.from('user_profile').update({
      due_date: onboardingData.due_date,
      lmp_date: onboardingData.lmp_date,
      onboarding_completed: true,
      onboarding_completed_at: onboardingData.completed_at
    }).eq('id', user.id);
  }
  
  // Save to localStorage
  const profile = JSON.parse(localStorage.getItem('mc_profile') || '{}');
  Object.assign(profile, {
    due_date: onboardingData.due_date,
    lmp_date: onboardingData.lmp_date,
    onboarding_completed: true
  });
  localStorage.setItem('mc_profile', JSON.stringify(profile));
  
  // Track completion
  if (window.trackEvent) {
    window.trackEvent('onboarding_completed', {
      has_due_date: !!onboardingData.due_date,
      has_lmp: !!onboardingData.lmp_date,
      notifications_enabled: onboardingData.notifications_enabled
    });
  }
  
  // Show success and close
  closeOnboarding();
  
  // Refresh dashboard with new data
  if (window.MC && window.MC.calcDue) {
    window.MC.calcDue();
  }
  
  // Show welcome toast
  setTimeout(() => {
    if (window.showToast) {
      window.showToast('Welcome to MamaCare! Your journey begins now. 🌸', 'success');
    }
  }, 500);
}

// ══════════════════════════════════════
// CLOSE ONBOARDING
// ══════════════════════════════════════
function closeOnboarding() {
  const overlay = document.getElementById('onboardingOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
}

// ══════════════════════════════════════
// CONFETTI ANIMATION
// ══════════════════════════════════════
window.triggerConfetti = function() {
  const colors = ['#E879A0', '#A855C8', '#7C3AED', '#F9A8C9'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
  }
};

// ══════════════════════════════════════
// EXPORT
// ══════════════════════════════════════
window.ONBOARDING_V2 = {
  init: initOnboardingV2,
  show: showOnboarding,
  close: closeOnboarding
};

// Auto-init on login
window.addEventListener('mc:loggedin', (e) => {
  setTimeout(() => initOnboardingV2(), 1000);
});
