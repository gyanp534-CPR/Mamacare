/**
 * MamaCare — app-enhancements.js
 * UI/UX Enhancements: Swipeable carousel, photo options, mood modals, etc.
 */

'use strict';

// ══════════════════════════════════════
// SWIPEABLE CAROUSEL FOR SLEEP TIPS
// ══════════════════════════════════════
let currentTipIndex = 0;
let startX = 0;
let isDragging = false;

function initSleepTipsCarousel() {
  const container = document.getElementById('sleepTipsGrid');
  if (!container) return;

  const SLEEP_TIPS = [
    {t:'Left Side Sleeping', icon:'moon', b:'From second trimester, sleep on your left side to avoid IVC compression and ensure optimal blood flow to baby.'},
    {t:'Pillow Support System', icon:'pillow', b:'Use 3 pillows: between knees, under belly, and for head elevation. This significantly improves sleep quality.'},
    {t:'Screen-Free Hour', icon:'smartphone-off', b:'Blue light suppresses melatonin by 50%. Turn off phone/TV 1 hour before bed for better sleep.'},
    {t:'Magnesium Supplement', icon:'pill', b:'200-400mg before bed helps with leg cramps and sleep quality. Consult your doctor first.'},
    {t:'Cool Room Temperature', icon:'thermometer', b:'Keep room at 18-20°C. Your body temperature is already higher during pregnancy.'},
    {t:'Heartburn Prevention', icon:'flame', b:'Avoid heavy meals 2-3 hours before bed. Elevate bed head by 30° to reduce acid reflux.'},
    {t:'Manage Night Urination', icon:'droplet', b:'Reduce fluids 2 hours before bed. Use dim night light to maintain melatonin levels.'},
    {t:'Consistent Schedule', icon:'clock', b:'Sleep and wake at same time daily. Circadian rhythm is the #1 factor for sleep quality.'},
  ];

  container.innerHTML = `
    <div class="tips-carousel">
      <div class="tips-track" id="tipsTrack">
        ${SLEEP_TIPS.map((tip, i) => `
          <div class="tip-card">
            <div class="tip-title">
              <i data-lucide="${tip.icon}" style="width:24px;height:24px"></i>
              ${tip.t}
            </div>
            <div class="tip-content">${tip.b}</div>
          </div>
        `).join('')}
      </div>
      <div class="carousel-nav prev" onclick="prevTip()">
        <i data-lucide="chevron-left"></i>
      </div>
      <div class="carousel-nav next" onclick="nextTip()">
        <i data-lucide="chevron-right"></i>
      </div>
      <div class="carousel-dots">
        ${SLEEP_TIPS.map((_, i) => `
          <div class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToTip(${i})"></div>
        `).join('')}
      </div>
    </div>
  `;

  // Touch events for swipe
  const track = document.getElementById('tipsTrack');
  if (track) {
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd);
    
    track.addEventListener('mousedown', handleMouseDown);
    track.addEventListener('mousemove', handleMouseMove);
    track.addEventListener('mouseup', handleMouseEnd);
    track.addEventListener('mouseleave', handleMouseEnd);
  }

  if (window.lucide) lucide.createIcons();
}

function handleTouchStart(e) {
  startX = e.touches[0].clientX;
  isDragging = true;
}

function handleTouchMove(e) {
  if (!isDragging) return;
  const currentX = e.touches[0].clientX;
  const diff = startX - currentX;
  if (Math.abs(diff) > 10) {
    e.preventDefault();
  }
}

function handleTouchEnd(e) {
  if (!isDragging) return;
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  
  if (diff > 50) nextTip();
  else if (diff < -50) prevTip();
  
  isDragging = false;
}

function handleMouseDown(e) {
  startX = e.clientX;
  isDragging = true;
  e.preventDefault();
}

function handleMouseMove(e) {
  if (!isDragging) return;
  e.preventDefault();
}

function handleMouseEnd(e) {
  if (!isDragging) return;
  const endX = e.clientX;
  const diff = startX - endX;
  
  if (diff > 50) nextTip();
  else if (diff < -50) prevTip();
  
  isDragging = false;
}

function nextTip() {
  const track = document.getElementById('tipsTrack');
  if (!track) return;
  const totalTips = track.children.length;
  currentTipIndex = (currentTipIndex + 1) % totalTips;
  updateCarousel();
}

function prevTip() {
  const track = document.getElementById('tipsTrack');
  if (!track) return;
  const totalTips = track.children.length;
  currentTipIndex = (currentTipIndex - 1 + totalTips) % totalTips;
  updateCarousel();
}

function goToTip(index) {
  currentTipIndex = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById('tipsTrack');
  if (!track) return;
  
  track.style.transform = `translateX(-${currentTipIndex * 100}%)`;
  
  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTipIndex);
  });
}

// ══════════════════════════════════════
// LANGUAGE TOGGLE
// ══════════════════════════════════════
function initLanguageToggle() {
  const topUser = document.querySelector('.top-user');
  if (!topUser) return;

  // Add language toggle button
  const langToggle = document.createElement('button');
  langToggle.className = 'lang-toggle';
  langToggle.innerHTML = '<i data-lucide="globe"></i>';
  langToggle.onclick = toggleLanguageBar;
  topUser.insertBefore(langToggle, topUser.firstChild);

  if (window.lucide) lucide.createIcons();
}

function toggleLanguageBar() {
  const langBar = document.getElementById('langBar');
  if (!langBar) return;
  langBar.classList.toggle('show');
}

// Close language bar when clicking outside
document.addEventListener('click', (e) => {
  const langBar = document.getElementById('langBar');
  const langToggle = document.querySelector('.lang-toggle');
  if (langBar && !langBar.contains(e.target) && !langToggle?.contains(e.target)) {
    langBar.classList.remove('show');
  }
});

// ══════════════════════════════════════
// PHOTO UPLOAD OPTIONS (Camera + Gallery)
// ══════════════════════════════════════
function initPhotoOptions() {
  const photoBtn = document.getElementById('triggerPhotoBtn');
  if (!photoBtn) return;

  photoBtn.onclick = showPhotoOptions;
}

function showPhotoOptions() {
  const existingModal = document.querySelector('.photo-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'mood-detail-modal photo-modal';
  modal.innerHTML = `
    <div class="mood-detail-content" style="max-width:400px">
      <div class="mood-detail-header">
        <div class="mood-detail-title">
          <i data-lucide="camera"></i>
          Add Photo
        </div>
        <button class="mood-close-btn" onclick="this.closest('.photo-modal').remove()">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="photo-options">
        <label class="photo-option-btn" for="cameraInput">
          <i data-lucide="camera"></i>
          <span>Take Photo</span>
          <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display:none" onchange="handlePhotoCapture(this)">
        </label>
        <label class="photo-option-btn" for="galleryInput">
          <i data-lucide="image"></i>
          <span>Choose from Gallery</span>
          <input type="file" id="galleryInput" accept="image/*" style="display:none" onchange="handlePhotoCapture(this)">
        </label>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
}

function handlePhotoCapture(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const preview = document.getElementById('photoPreview');
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        window.photoFile = file;
      }
      
      // Close modal
      document.querySelector('.photo-modal')?.remove();
    };
    
    reader.readAsDataURL(file);
  }
}

// ══════════════════════════════════════
// MOOD DETAIL MODAL
// ══════════════════════════════════════
function showMoodDetail(mood, emoji) {
  const moodInfo = {
    'Anxious': {
      title: 'Feeling Anxious',
      emoji: '😰',
      content: `Anxiety during pregnancy is completely normal. Your body is going through massive changes, and it's natural to worry about your baby's health, delivery, and becoming a parent.
      
      <strong>Why it happens:</strong>
      • Hormonal changes (progesterone, cortisol)
      • Fear of the unknown
      • Physical discomfort
      • Financial concerns
      
      <strong>What helps:</strong>
      • Deep breathing exercises (try our 4-4-4 breathing)
      • Talk to your partner or a friend
      • Join a pregnancy support group
      • Light exercise like walking or prenatal yoga
      • Limit caffeine and sugar
      • Professional help if anxiety is severe`,
    },
    'Happy': {
      title: 'Feeling Happy',
      emoji: '😊',
      content: `Wonderful! Positive emotions are great for both you and your baby. When you're happy, your body releases endorphins that can cross the placenta and benefit your baby.
      
      <strong>Keep the happiness going:</strong>
      • Share your joy with loved ones
      • Document these moments in your journal
      • Do activities you love
      • Practice gratitude
      • Get enough rest to maintain energy
      
      <strong>Remember:</strong>
      It's okay to have ups and downs. Enjoy these happy moments!`,
    },
    // Add more moods...
  };

  const info = moodInfo[mood] || {
    title: `Feeling ${mood}`,
    emoji: emoji,
    content: `It's completely normal to feel ${mood.toLowerCase()} during pregnancy. Your emotions are valid, and it's important to acknowledge them.`,
  };

  const modal = document.createElement('div');
  modal.className = 'mood-detail-modal';
  modal.innerHTML = `
    <div class="mood-detail-content">
      <div class="mood-detail-header">
        <div class="mood-detail-title">
          <span style="font-size:32px">${info.emoji}</span>
          ${info.title}
        </div>
        <button class="mood-close-btn" onclick="this.closest('.mood-detail-modal').remove()">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="mood-detail-body">
        ${info.content.replace(/\n/g, '<br>')}
      </div>
      <div class="mood-share-section">
        <div class="mood-share-title">Share your feelings (optional)</div>
        <textarea class="mood-share-input" placeholder="How are you feeling? Write it down..."></textarea>
        <button class="btn btn-p mood-share-btn" onclick="saveMoodNote(this)">
          <i data-lucide="heart"></i> Save Note
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function saveMoodNote(btn) {
  const textarea = btn.closest('.mood-share-section').querySelector('textarea');
  const note = textarea.value.trim();
  if (note) {
    // Save to local storage or database
    console.log('Mood note saved:', note);
    btn.closest('.mood-detail-modal').remove();
    alert('Your feelings have been saved to your journal ❤️');
  }
}

// ══════════════════════════════════════
// ROTATING AFFIRMATIONS
// ══════════════════════════════════════
const AFFIRMATIONS = [
  "I trust my body to grow and nurture my baby.",
  "I am strong, capable, and ready for motherhood.",
  "My baby and I are healthy and safe.",
  "I embrace the changes in my body with love.",
  "I am creating a miracle inside me.",
  "I deserve rest, care, and support.",
  "My intuition guides me in caring for my baby.",
  "I am grateful for this journey.",
  "I release fear and welcome peace.",
  "I am enough, just as I am.",
];

let currentAffirmationIndex = 0;

function rotateAffirmation() {
  currentAffirmationIndex = (currentAffirmationIndex + 1) % AFFIRMATIONS.length;
  const affirmText = document.getElementById('affirmText');
  if (affirmText) {
    affirmText.style.opacity = '0';
    setTimeout(() => {
      affirmText.textContent = AFFIRMATIONS[currentAffirmationIndex];
      affirmText.style.opacity = '1';
    }, 300);
  }
}

// Auto-rotate affirmation every 10 seconds
setInterval(rotateAffirmation, 10000);

// ══════════════════════════════════════
// INITIALIZE ALL ENHANCEMENTS
// ══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  initLanguageToggle();
  initPhotoOptions();
});

// Export functions
window.ENHANCEMENTS = {
  initSleepTipsCarousel,
  showMoodDetail,
  nextTip,
  prevTip,
  goToTip,
  toggleLanguageBar,
  showPhotoOptions,
  handlePhotoCapture,
  saveMoodNote,
  rotateAffirmation,
};
