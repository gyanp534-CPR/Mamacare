/**
 * MamaCare — Photo Storage Module
 * Cloudinary integration for journal photo backup
 * 
 * Free Tier: 25 GB storage + CDN
 * Setup: cloudinary.com → Settings → Upload → Add unsigned preset
 * 
 * ⚠️ CRITICAL SECURITY WARNING ⚠️
 * ═══════════════════════════════════════════════════════════════
 * This module uses UNSIGNED Cloudinary uploads, which means:
 * 
 * 1. ANYONE with this code can upload to your Cloudinary account
 * 2. Cloud name and preset are PUBLIC in the JavaScript bundle
 * 3. Malicious actors could upload unlimited files until you hit 25 GB limit
 * 
 * REQUIRED CLOUDINARY DASHBOARD RESTRICTIONS:
 * ═══════════════════════════════════════════════════════════════
 * Go to: Cloudinary Dashboard → Settings → Upload → Your Preset → Edit
 * 
 * Set these restrictions:
 * ✅ Allowed formats: jpg, jpeg, png, webp (NO exe, zip, pdf)
 * ✅ Max file size: 5 MB (enforced server-side)
 * ✅ Max image dimensions: 2048x2048
 * ✅ Folder: mamacare-journals (restrict uploads to this folder only)
 * ✅ Resource type: image (NOT raw or video)
 * ✅ Overwrite: false (prevent file replacement attacks)
 * ✅ Unique filename: true (prevent predictable URLs)
 * 
 * RECOMMENDED: Signed Uploads (Production)
 * ═══════════════════════════════════════════════════════════════
 * For production, replace unsigned uploads with signed uploads via
 * Supabase Edge Function to hide API credentials and prevent abuse:
 * 
 * 1. Create supabase/functions/cloudinary-sign/index.ts
 * 2. Generate signature server-side using CLOUDINARY_API_SECRET
 * 3. Pass signature + timestamp to frontend
 * 4. Use signed upload endpoint
 * 
 * This is a known security tradeoff for MVP speed vs. production security.
 */

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

// Cloudinary Configuration
// ⚠️ WARNING: These credentials are PUBLIC in browser JS bundle
// Anyone can upload to this account until free tier limit (25 GB)
// See security restrictions above for mitigation steps
const CLOUDINARY_CONFIG = {
  cloudName: 'dpaihqxq3',           // ⚠️ PUBLIC - visible in network tab
  uploadPreset: 'mamacare_unsigned' // ⚠️ PUBLIC - no authentication required
};

// Feature flag (disable if Cloudinary not configured)
const CLOUD_STORAGE_ENABLED = 
  CLOUDINARY_CONFIG.cloudName !== 'YOUR_CLOUD_NAME';

// ═══════════════════════════════════════════════════════════
// CLOUDINARY UPLOAD
// ═══════════════════════════════════════════════════════════

/**
 * Upload photo to Cloudinary
 * @param {File} file - Photo file from input
 * @param {Object} metadata - User metadata (userId, week, date)
 * @returns {Promise<Object>} - { url, publicId, provider }
 */
window.uploadToCloudinary = async function(file, metadata = {}) {
  if (!CLOUD_STORAGE_ENABLED) {
    throw new Error('Cloudinary not configured');
  }

  // ── SECURITY VALIDATION ────────────────────────────────────
  // Validate file type (client-side only - Cloudinary enforces server-side)
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Invalid image file');
  }

  // Whitelist allowed formats (prevent .exe, .zip, .js uploads)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error(`Format not allowed. Use: JPG, PNG, or WebP`);
  }

  // Max 5 MB (client-side check - Cloudinary preset MUST also enforce this)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image too large (max 5 MB)');
  }

  // CRITICAL: These checks are client-side only and can be bypassed
  // Cloudinary Dashboard preset MUST enforce these restrictions server-side
  // See security warnings at top of file for configuration instructions

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', 'mamacare-journals');
    
    // Add metadata as context
    if (metadata.userId) {
      formData.append('context', `user_id=${metadata.userId}|week=${metadata.week || 'bump'}|date=${metadata.date || todayStr()}`);
    }

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();

    return {
      url: data.secure_url,      // HTTPS CDN URL
      publicId: data.public_id,  // For deletion if needed
      provider: 'cloudinary',
      thumbnail: data.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill/'), // 200x200 thumbnail
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════
// SUPABASE FALLBACK
// ═══════════════════════════════════════════════════════════

/**
 * Upload to Supabase Storage (fallback)
 * @param {File} file - Photo file
 * @param {Object} metadata - User metadata
 * @returns {Promise<Object>} - { url, provider }
 */
window.uploadToSupabase = async function(file, metadata = {}) {
  if (!supa) throw new Error('Supabase not initialized');
  if (!user) throw new Error('User not authenticated');

  const fileName = `${user.id}/${metadata.date || todayStr()}-w${metadata.week || 'bump'}.jpg`;
  
  const { data, error } = await supa.storage
    .from('journal-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false // Don't overwrite existing
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supa.storage
    .from('journal-photos')
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    provider: 'supabase',
    fileName: fileName
  };
};

// ═══════════════════════════════════════════════════════════
// LOCAL DOWNLOAD (Last Resort)
// ═══════════════════════════════════════════════════════════

/**
 * Download photo to device (fallback)
 * @param {File} file - Photo file
 * @param {Object} metadata - User metadata
 */
window.downloadLocally = function(file, metadata = {}) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mamacare-w${metadata.week || 'bump'}-${metadata.date || todayStr()}.jpg`;
  a.click();
  URL.revokeObjectURL(url);
};

// ═══════════════════════════════════════════════════════════
// SMART UPLOAD (Main Function)
// ═══════════════════════════════════════════════════════════

/**
 * Smart photo upload with cascading fallbacks
 * Tries: Cloudinary → Supabase → Local Download
 * 
 * @param {File} file - Photo file from input
 * @param {Object} metadata - { userId, week, date }
 * @returns {Promise<Object>} - { url, provider, ...details }
 */
window.smartPhotoUpload = async function(file, metadata = {}) {
  // Ensure metadata
  metadata.userId = metadata.userId || (user ? user.id : 'anonymous');
  metadata.week = metadata.week || (window.currentWeek || null);
  metadata.date = metadata.date || todayStr();

  // Try Cloudinary first (25 GB free)
  if (CLOUD_STORAGE_ENABLED) {
    try {
      const result = await uploadToCloudinary(file, metadata);
      console.log('✅ Uploaded to Cloudinary:', result.url);
      return result;
    } catch (err) {
      console.warn('⚠️ Cloudinary upload failed:', err.message);
      flash('photo-upload-warn', 'Cloud backup unavailable, trying alternative...');
    }
  }

  // Fallback to Supabase (1 GB free)
  if (supa && user) {
    try {
      const result = await uploadToSupabase(file, metadata);
      console.log('✅ Uploaded to Supabase:', result.url);
      flash('photo-upload-success', 'Photo backed up successfully!');
      return result;
    } catch (err) {
      console.warn('⚠️ Supabase upload failed:', err.message);
      flash('photo-upload-error', 'Cloud backup failed. Saving to device only.');
    }
  }

  // Last resort: Local download
  downloadLocally(file, metadata);
  console.log('📱 Photo saved to device only (no cloud backup)');
  
  return {
    url: null,
    provider: 'local',
    localOnly: true
  };
};

// ═══════════════════════════════════════════════════════════
// COMPRESSION (Optional)
// ═══════════════════════════════════════════════════════════

/**
 * Compress image before upload (reduces bandwidth)
 * @param {File} file - Original file
 * @param {number} maxWidth - Max width (default 1200px)
 * @param {number} quality - JPEG quality (default 0.85)
 * @returns {Promise<Blob>} - Compressed blob
 */
window.compressImage = function(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Compression failed'));
          }
        }, 'image/jpeg', quality);
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};

// ═══════════════════════════════════════════════════════════
// USAGE TRACKING (Free Tier Monitoring)
// ═══════════════════════════════════════════════════════════

/**
 * Track upload stats in localStorage
 * Helps monitor free tier usage
 */
window.trackPhotoUpload = function(provider, bytes) {
  const key = 'photo_upload_stats';
  const stats = JSON.parse(localStorage.getItem(key) || '{}');
  
  const today = todayStr();
  if (!stats[today]) stats[today] = { cloudinary: 0, supabase: 0, local: 0, bytes: 0 };
  
  stats[today][provider] = (stats[today][provider] || 0) + 1;
  stats[today].bytes = (stats[today].bytes || 0) + bytes;
  
  // Keep only last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  Object.keys(stats).forEach(date => {
    if (new Date(date) < cutoff) delete stats[date];
  });
  
  localStorage.setItem(key, JSON.stringify(stats));
};

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

console.log('📸 Photo Storage Module loaded');
console.log('  Cloudinary:', CLOUD_STORAGE_ENABLED ? '✅ Enabled' : '⚠️ Not configured');
console.log('  Supabase:', typeof supa !== 'undefined' ? '✅ Available' : '⚠️ Not available');

if (!CLOUD_STORAGE_ENABLED) {
  console.warn('⚠️ Cloudinary not configured!');
  console.log('  1. Sign up at https://cloudinary.com (free)');
  console.log('  2. Get cloud_name from Dashboard');
  console.log('  3. Create unsigned upload preset: Settings → Upload → Add preset');
  console.log('  4. Update CLOUDINARY_CONFIG in app-photo-storage.js');
}
