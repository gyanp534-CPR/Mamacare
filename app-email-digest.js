// @ts-nocheck
/**
 * MamaCare — Email Digest Preferences
 * UI and logic for weekly email summary opt-in/out
 */

'use strict';

window.EMAIL_DIGEST = {
  /**
   * Load email preferences for current user
   */
  async loadPreferences() {
    if (!window.user || !window.supa) return;
    
    try {
      const { data, error } = await window.supa
        .from('user_profile')
        .select('email, email_digest_enabled, email_verified, last_digest_sent_at')
        .eq('id', window.user.id)
        .single();
      
      if (error) throw error;
      
      // Update UI
      const toggle = document.getElementById('emailDigestToggle');
      const status = document.getElementById('emailVerificationStatus');
      const emailInput = document.getElementById('emailAddressInput');
      
      if (emailInput && data?.email) {
        emailInput.value = data.email;
      }
      
      if (toggle) {
        toggle.checked = data?.email_digest_enabled || false;
        toggle.addEventListener('change', (e) => {
          EMAIL_DIGEST.toggleDigest(e.target.checked);
        });
      }
      
      if (status) {
        EMAIL_DIGEST.updateStatus(data);
      }
      
    } catch (error) {
      console.error('Error loading email preferences:', error);
    }
  },
  
  /**
   * Update status display
   */
  updateStatus(data) {
    const status = document.getElementById('emailVerificationStatus');
    if (!status) return;
    
    if (!data?.email) {
      status.innerHTML = '⚠️ No email address set';
      status.style.color = 'var(--gold)';
    } else if (data.email_verified) {
      const lastSent = data.last_digest_sent_at 
        ? new Date(data.last_digest_sent_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : 'Never';
      status.innerHTML = `✅ Email verified • Last sent: ${lastSent}`;
      status.style.color = 'var(--green)';
    } else {
      status.innerHTML = '⚠️ Email not verified — click verify button below';
      status.style.color = 'var(--gold)';
    }
  },

  
  /**
   * Toggle email digest on/off
   */
  async toggleDigest(enabled) {
    if (!window.user || !window.supa) return;
    
    try {
      const { error } = await window.supa
        .from('user_profile')
        .update({ email_digest_enabled: enabled })
        .eq('id', window.user.id);
      
      if (error) throw error;
      
      // Check verification status
      const { data } = await window.supa
        .from('user_profile')
        .select('email_verified')
        .eq('id', window.user.id)
        .single();
      
      if (enabled && !data?.email_verified) {
        alert('⚠️ Please verify your email first to receive weekly digests!');
      } else if (enabled) {
        EMAIL_DIGEST.showSuccessMessage('✅ Weekly email digest enabled!');
      } else {
        EMAIL_DIGEST.showSuccessMessage('📭 Weekly email digest disabled');
      }
      
    } catch (error) {
      console.error('Error toggling digest:', error);
      alert('Failed to update preferences. Please try again.');
    }
  },
  
  /**
   * Verify email address
   */
  async verifyEmail() {
    if (!window.user || !window.supa) return;
    
    const emailInput = document.getElementById('emailAddressInput');
    const email = emailInput?.value?.trim();
    
    if (!email || !email.includes('@')) {
      alert('⚠️ Please enter a valid email address!');
      return;
    }
    
    const btn = document.getElementById('verifyEmailBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }
    
    try {
      // Update email in profile
      const { error: updateError } = await window.supa
        .from('user_profile')
        .update({ email })
        .eq('id', window.user.id);
      
      if (updateError) throw updateError;
      
      // For now, auto-verify (in production, send verification email)
      // In production: call edge function to send verification email
      const { error: verifyError } = await window.supa
        .from('user_profile')
        .update({ email_verified: true })
        .eq('id', window.user.id);
      
      if (verifyError) throw verifyError;
      
      EMAIL_DIGEST.showSuccessMessage('✅ Email verified successfully!');
      
      // Reload preferences
      await EMAIL_DIGEST.loadPreferences();
      
    } catch (error) {
      console.error('Error verifying email:', error);
      alert('Failed to verify email. Please try again.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Verify Email';
      }
    }
  },

  
  /**
   * Show success message with animation
   */
  showSuccessMessage(message) {
    const existing = document.getElementById('emailSuccessMessage');
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.id = 'emailSuccessMessage';
    div.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:var(--green);color:white;padding:12px 24px;border-radius:50px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:slideDown 0.3s ease;';
    div.textContent = message;
    document.body.appendChild(div);
    
    setTimeout(() => div.remove(), 3000);
  },
  
  /**
   * Test email digest (for admin)
   */
  async testDigest() {
    if (!window.user || !window.supa) return;
    
    const btn = document.getElementById('testDigestBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending test email...';
    }
    
    try {
      // Call the edge function manually
      const { data, error } = await window.supa.functions.invoke('send-weekly-digest', {
        body: { test_user_id: window.user.id }
      });
      
      if (error) throw error;
      
      alert('✅ Test email sent! Check your inbox.');
      
    } catch (error) {
      console.error('Error sending test:', error);
      alert('❌ Failed to send test email. Check console for details.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send Test Email';
      }
    }
  },
  
  /**
   * Render email preferences card in More menu
   */
  renderPreferencesCard() {
    const moreContent = document.getElementById('moreContent');
    if (!moreContent) return;
    
    // Check if card already exists
    if (document.getElementById('emailDigestCard')) return;
    
    const card = document.createElement('div');
    card.id = 'emailDigestCard';
    card.className = 'card';
    card.innerHTML = `
      <div class="sec-label">Communication</div>
      <div class="sec-title">📧 Weekly Email Digest</div>
      
      <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:14px">
        Har Sunday ko apka pregnancy summary email milega — weight trend, mood, baby development, upcoming appointments.
      </p>
      
      <div style="background:rgba(106,184,154,.08);border-radius:12px;padding:14px;margin-bottom:12px">
        <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:var(--green)">
          Email Status:
        </div>
        <div id="emailVerificationStatus" style="font-size:13px;color:var(--warm)">
          Checking...
        </div>
      </div>
      
      <div style="margin-bottom:14px">
        <label style="font-size:13px;font-weight:500;color:var(--warm);margin-bottom:6px;display:block">
          Email Address
        </label>
        <input type="email" id="emailAddressInput" placeholder="your@email.com" 
          style="width:100%;padding:12px;border:1.5px solid #e0d5d0;border-radius:10px;font-size:14px"/>
      </div>
      
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:14px;padding:10px;background:rgba(232,160,168,.05);border-radius:10px">
        <input type="checkbox" id="emailDigestToggle" 
          style="width:18px;height:18px;accent-color:var(--rose)"/>
        <span style="font-size:14px;font-weight:500">Enable weekly email digest</span>
      </label>
      
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-p btn-sm" id="verifyEmailBtn" onclick="EMAIL_DIGEST.verifyEmail()">
          <i data-lucide="mail" class="app-icon-inline"></i> Verify Email
        </button>
        ${window.user?.email?.includes('admin') ? '<button class="btn btn-g btn-sm" id="testDigestBtn" onclick="EMAIL_DIGEST.testDigest()">Send Test Email</button>' : ''}
      </div>
      
      <div style="margin-top:16px;padding:12px;background:rgba(212,168,83,.06);border-radius:10px;font-size:12px;color:var(--warm);line-height:1.6">
        💡 <strong>What's included:</strong> Weekly stats (weight, mood, kicks), baby development, upcoming appointments, and personalized tips.
      </div>
    `;
    
    // Insert after profile card or at top
    const profileCard = moreContent.querySelector('.card');
    if (profileCard) {
      profileCard.after(card);
    } else {
      moreContent.prepend(card);
    }
    
    // Initialize lucide icons
    if (window.lucide) window.lucide.createIcons();
    
    // Load preferences
    EMAIL_DIGEST.loadPreferences();
  }
};

// Auto-initialize when More menu is opened
const originalGoTo = window.goTo;
if (originalGoTo) {
  window.goTo = function(page) {
    originalGoTo(page);
    if (page === 'more' && window.user) {
      setTimeout(() => EMAIL_DIGEST.renderPreferencesCard(), 100);
    }
  };
}

// Initialize on page load if user is logged in
if (window.user) {
  window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('emailDigestToggle')) {
      EMAIL_DIGEST.loadPreferences();
    }
  });
}
