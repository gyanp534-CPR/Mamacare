/**
 * MamaCare - Referral Program
 * Reward users for inviting friends
 */

const REFERRAL_REWARDS = {
  per_referral: 7, // days of premium
  max_referrals: 12, // max 12 referrals = 84 days (~3 months)
  bonus_milestone: {
    3: 14, // 3 referrals = extra 2 weeks
    5: 30, // 5 referrals = extra 1 month
    10: 60  // 10 referrals = extra 2 months
  }
};

// ══════════════════════════════════════
// GENERATE REFERRAL CODE
// ══════════════════════════════════════
async function generateReferralCode() {
  const user = window.user;
  if (!user) return null;
  
  // Check if user already has a code
  const { data: profile } = await window.supa
    .from('user_profile')
    .select('referral_code')
    .eq('id', user.id)
    .single();
  
  if (profile?.referral_code) {
    return profile.referral_code;
  }
  
  // Generate new code: first name + random 4 digits
  const name = user.email.split('@')[0].slice(0, 6).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  const code = `${name}${random}`;
  
  // Save to database
  await window.supa
    .from('user_profile')
    .update({ referral_code: code })
    .eq('id', user.id);
  
  return code;
}

// ══════════════════════════════════════
// GET REFERRAL STATS
// ══════════════════════════════════════
async function getReferralStats() {
  const user = window.user;
  if (!user) return null;
  
  const { data: profile } = await window.supa
    .from('user_profile')
    .select('referral_code, referral_count, premium_expires_at')
    .eq('id', user.id)
    .single();
  
  if (!profile) return null;
  
  // Calculate rewards earned
  const referrals = profile.referral_count || 0;
  const baseReward = Math.min(referrals, REFERRAL_REWARDS.max_referrals) * REFERRAL_REWARDS.per_referral;
  
  // Add milestone bonuses
  let bonusReward = 0;
  Object.entries(REFERRAL_REWARDS.bonus_milestone).forEach(([milestone, bonus]) => {
    if (referrals >= parseInt(milestone)) {
      bonusReward += bonus;
    }
  });
  
  const totalReward = baseReward + bonusReward;
  const nextMilestone = Object.keys(REFERRAL_REWARDS.bonus_milestone)
    .map(Number)
    .find(m => m > referrals);
  
  return {
    code: profile.referral_code,
    referrals: referrals,
    max_referrals: REFERRAL_REWARDS.max_referrals,
    days_earned: totalReward,
    next_milestone: nextMilestone,
    next_milestone_bonus: nextMilestone ? REFERRAL_REWARDS.bonus_milestone[nextMilestone] : 0,
    premium_expires_at: profile.premium_expires_at,
    is_premium: profile.premium_expires_at && new Date(profile.premium_expires_at) > new Date()
  };
}

// ══════════════════════════════════════
// TRACK REFERRAL (Called on signup)
// ══════════════════════════════════════
async function trackReferral(referralCode) {
  if (!referralCode) return;
  
  // Find referrer
  const { data: referrer } = await window.supa
    .from('user_profile')
    .select('id, referral_count, premium_expires_at')
    .eq('referral_code', referralCode)
    .single();
  
  if (!referrer) return;
  
  // Increment referral count
  const newCount = (referrer.referral_count || 0) + 1;
  
  // Calculate reward (7 days per referral, up to 12 referrals)
  if (newCount <= REFERRAL_REWARDS.max_referrals) {
    let rewardDays = REFERRAL_REWARDS.per_referral;
    
    // Add milestone bonus
    if (REFERRAL_REWARDS.bonus_milestone[newCount]) {
      rewardDays += REFERRAL_REWARDS.bonus_milestone[newCount];
    }
    
    // Calculate new expiry
    const currentExpiry = referrer.premium_expires_at 
      ? new Date(referrer.premium_expires_at) 
      : new Date();
    
    // If expired, start from today
    if (currentExpiry < new Date()) {
      currentExpiry.setTime(Date.now());
    }
    
    currentExpiry.setDate(currentExpiry.getDate() + rewardDays);
    
    // Update referrer's premium
    await window.supa
      .from('user_profile')
      .update({
        referral_count: newCount,
        premium_expires_at: currentExpiry.toISOString(),
        subscription_type: 'referral'
      })
      .eq('id', referrer.id);
    
    // Send notification to referrer
    if (window.sendPushNotification) {
      window.sendPushNotification(referrer.id, {
        title: '🎉 New Referral!',
        body: `Someone joined using your code! You earned ${rewardDays} days of premium.`,
        tag: 'referral-reward'
      });
    }
  }
  
  // Track referral in analytics
  if (window.trackEvent) {
    window.trackEvent('referral_tracked', {
      referrer_id: referrer.id,
      new_count: newCount
    });
  }
}

// ══════════════════════════════════════
// RENDER REFERRAL PAGE
// ══════════════════════════════════════
async function renderReferralPage() {
  const user = window.user;
  if (!user) return;
  
  // Generate code if needed
  let code = await generateReferralCode();
  const stats = await getReferralStats();
  
  if (!stats) return;
  
  const referralUrl = `https://mamacare.gyanam.shop?ref=${stats.code}`;
  const shareText = `Join me on MamaCare - the best pregnancy companion app! Use my code ${stats.code} and we both get rewards. 💗`;
  
  const container = document.getElementById('page-referral');
  if (!container) return;
  
  const progressPercent = (stats.referrals / stats.max_referrals) * 100;
  
  container.innerHTML = `
    <!-- Hero Card -->
    <div class="card" style="background: linear-gradient(135deg, rgba(232, 121, 160, 0.12), rgba(168, 85, 200, 0.08)); border: none; text-align: center; padding: 32px 20px;">
      <div class="referral-hero-icon">🎁</div>
      <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 2rem; margin: 16px 0 8px; color: var(--warm);">
        Invite Friends, Get Premium!
      </h1>
      <p style="font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 400px; margin: 0 auto;">
        Share MamaCare with friends and earn <strong>${REFERRAL_REWARDS.per_referral} days of premium</strong> for each signup.
        Up to ${REFERRAL_REWARDS.max_referrals * REFERRAL_REWARDS.per_referral} days total!
      </p>
    </div>
    
    <!-- Your Stats -->
    <div class="card">
      <div class="sec-label">Your Referral Stats</div>
      <div class="referral-stats-grid">
        <div class="referral-stat-box">
          <div class="referral-stat-value">${stats.referrals}</div>
          <div class="referral-stat-label">Friends Referred</div>
        </div>
        <div class="referral-stat-box">
          <div class="referral-stat-value">${stats.days_earned}</div>
          <div class="referral-stat-label">Days Earned</div>
        </div>
        <div class="referral-stat-box">
          <div class="referral-stat-value">${stats.max_referrals - stats.referrals}</div>
          <div class="referral-stat-label">Remaining</div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div style="margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 13px; font-weight: 600; color: var(--text-main);">Progress</span>
          <span style="font-size: 13px; font-weight: 700; color: var(--accent);">${stats.referrals}/${stats.max_referrals}</span>
        </div>
        <div class="timeline-bar" style="margin: 0;">
          <div class="timeline-fill" style="width: ${progressPercent}%; background: linear-gradient(90deg, #6AB89A, #5DA88C);"></div>
        </div>
      </div>
      
      ${stats.next_milestone ? `
        <div class="referral-milestone-hint">
          <i data-lucide="trophy" class="app-icon-inline" style="color: #d4a853;"></i>
          <span>
            Invite <strong>${stats.next_milestone - stats.referrals} more ${stats.next_milestone - stats.referrals === 1 ? 'friend' : 'friends'}</strong> 
            to unlock <strong>+${stats.next_milestone_bonus} bonus days!</strong>
          </span>
        </div>
      ` : `
        <div class="referral-milestone-hint" style="background: rgba(106, 184, 154, 0.1); border-color: #6AB89A;">
          <i data-lucide="check-circle" class="app-icon-inline" style="color: #6AB89A;"></i>
          <span>You've reached the maximum! Enjoy your premium access. 🎉</span>
        </div>
      `}
    </div>
    
    <!-- Your Referral Code -->
    <div class="card">
      <div class="sec-label">Your Referral Code</div>
      <div class="referral-code-box">
        <div class="referral-code-display">${stats.code}</div>
        <button class="btn btn-g" onclick="REFERRAL.copyCode('${stats.code}')">
          <i data-lucide="copy" class="app-icon-inline"></i> Copy
        </button>
      </div>
      
      <div style="margin-top: 16px; padding: 12px; background: rgba(232, 121, 160, 0.05); border-radius: 12px; font-size: 13px; color: var(--muted);">
        <i data-lucide="info" class="app-icon-inline"></i>
        Friends can enter this code during signup or use your link below
      </div>
    </div>
    
    <!-- Share Options -->
    <div class="card">
      <div class="sec-label">Share Your Link</div>
      <div class="referral-share-buttons">
        <button class="referral-share-btn whatsapp" onclick="REFERRAL.shareWhatsApp('${shareText}', '${referralUrl}')">
          <span class="referral-share-icon">💬</span>
          <span>WhatsApp</span>
        </button>
        <button class="referral-share-btn link" onclick="REFERRAL.copyLink('${referralUrl}')">
          <span class="referral-share-icon">🔗</span>
          <span>Copy Link</span>
        </button>
        <button class="referral-share-btn email" onclick="REFERRAL.shareEmail('${shareText}', '${referralUrl}')">
          <span class="referral-share-icon">📧</span>
          <span>Email</span>
        </button>
        <button class="referral-share-btn more" onclick="REFERRAL.shareNative('${shareText}', '${referralUrl}')">
          <span class="referral-share-icon">📤</span>
          <span>More</span>
        </button>
      </div>
      
      <div class="referral-link-box">
        <input type="text" readonly value="${referralUrl}" class="referral-link-input" id="referralLinkInput" />
      </div>
    </div>
    
    <!-- How It Works -->
    <div class="card">
      <div class="sec-label">How It Works</div>
      <div class="referral-how-it-works">
        <div class="referral-step">
          <div class="referral-step-num">1</div>
          <div>
            <strong>Share your code</strong>
            <p>Send your unique referral code or link to friends</p>
          </div>
        </div>
        <div class="referral-step">
          <div class="referral-step-num">2</div>
          <div>
            <strong>They sign up</strong>
            <p>Friend creates account using your code</p>
          </div>
        </div>
        <div class="referral-step">
          <div class="referral-step-num">3</div>
          <div>
            <strong>You both win!</strong>
            <p>You get ${REFERRAL_REWARDS.per_referral} days premium, they get a warm welcome 🎉</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bonus Milestones -->
    <div class="card">
      <div class="sec-label">Bonus Milestones 🏆</div>
      <div class="referral-milestones">
        ${Object.entries(REFERRAL_REWARDS.bonus_milestone).map(([count, bonus]) => {
          const achieved = stats.referrals >= parseInt(count);
          return `
            <div class="referral-milestone ${achieved ? 'achieved' : ''}">
              <div class="referral-milestone-icon">${achieved ? '✓' : count}</div>
              <div>
                <strong>${count} Referrals</strong>
                <p>Unlock <strong>+${bonus} bonus days</strong> of premium</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  // Render icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ══════════════════════════════════════
// SHARING FUNCTIONS
// ══════════════════════════════════════
const REFERRAL = {
  // Copy code
  copyCode: (code) => {
    navigator.clipboard.writeText(code).then(() => {
      if (window.showToast) {
        window.showToast('Referral code copied! 📋', 'success');
      } else {
        alert('Code copied: ' + code);
      }
    });
    
    if (window.trackEvent) {
      window.trackEvent('referral_code_copied', { code });
    }
  },
  
  // Copy link
  copyLink: (url) => {
    navigator.clipboard.writeText(url).then(() => {
      if (window.showToast) {
        window.showToast('Link copied! Share it with friends. 🔗', 'success');
      } else {
        alert('Link copied!');
      }
    });
    
    if (window.trackEvent) {
      window.trackEvent('referral_link_copied');
    }
  },
  
  // Share via WhatsApp
  shareWhatsApp: (text, url) => {
    const message = encodeURIComponent(`${text}\n\n${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    
    if (window.trackEvent) {
      window.trackEvent('referral_shared', { platform: 'whatsapp' });
    }
  },
  
  // Share via Email
  shareEmail: (text, url) => {
    const subject = encodeURIComponent('Join me on MamaCare! 💗');
    const body = encodeURIComponent(`${text}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    
    if (window.trackEvent) {
      window.trackEvent('referral_shared', { platform: 'email' });
    }
  },
  
  // Native share
  shareNative: async (text, url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join MamaCare',
          text: text,
          url: url
        });
        
        if (window.trackEvent) {
          window.trackEvent('referral_shared', { platform: 'native' });
        }
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      REFERRAL.copyLink(url);
    }
  },
  
  // Render page
  render: renderReferralPage,
  
  // Track referral (called on signup)
  track: trackReferral,
  
  // Get stats
  getStats: getReferralStats
};

// ══════════════════════════════════════
// EXPORT
// ══════════════════════════════════════
window.REFERRAL = REFERRAL;

// Check for referral code in URL on page load
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  if (ref) {
    localStorage.setItem('mc_referral_code', ref);
    // Show toast
    setTimeout(() => {
      if (window.showToast) {
        window.showToast(`Referral code ${ref} applied! Sign up to activate. 🎁`, 'success');
      }
    }, 1000);
  }
});
