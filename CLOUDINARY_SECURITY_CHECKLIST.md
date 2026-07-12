# Cloudinary Security Configuration Checklist

## ⚠️ CRITICAL: Unsigned Upload Security

MamaCare uses **unsigned uploads** to Cloudinary for user photos (journal entries, milestone cards). This is convenient but requires strict dashboard restrictions to prevent abuse.

## Required Dashboard Settings

### 1. Log into Cloudinary Dashboard
- Go to https://cloudinary.com/console
- Navigate to **Settings** → **Upload** → **Upload presets**

### 2. Configure the `mamacare_unsigned` Upload Preset

Find or create the `mamacare_unsigned` preset with these exact settings:

#### Basic Settings
- **Signing Mode**: `Unsigned`
- **Upload Preset Name**: `mamacare_unsigned`
- **Folder**: `mamacare/user-uploads` (organizes uploads)

#### Security Restrictions (CRITICAL)
✅ **File Size Limit**: 5 MB max
✅ **Allowed Formats**: `jpg,jpeg,png,webp` only (no PDF, no executables)
✅ **Max Image Width**: 2000px (prevents huge uploads)
✅ **Max Image Height**: 2000px
✅ **Upload Rate Limit**: 10 uploads per minute per IP
✅ **Enable Auto Tagging**: `user-generated` (for monitoring)
✅ **Enable Moderation**: `manual` or `aws_rek` (if available)

#### Transform Settings
- **Auto Quality**: `auto:good` (optimize file size)
- **Auto Format**: `auto` (serve WebP to supported browsers)
- **Default Transformation**: `c_limit,w_1200,q_auto,f_auto` (resize large images)

#### Access Control
- **Restrict Access by Domain**: Add your production domain (e.g., `mamacare.vercel.app`)
  - In **Settings** → **Security** → **Allowed fetch domains**
  - Add: `https://mamacare.vercel.app`
  - Add: `https://www.mamacare.app` (if you have a custom domain)
- **Enable Upload Logging**: Monitor all uploads in **Reports** → **Transformation Reports**

## 3. Verify Current Settings

Run this check in your browser console (on your app):

```javascript
// Check if Cloudinary credentials are exposed
console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME); // Should show your cloud name
console.log('Upload Preset:', 'mamacare_unsigned'); // Should be unsigned preset

// Test upload with a small file to verify restrictions work
```

## 4. Monitor Usage

### Weekly Monitoring Tasks
1. **Check Upload Reports**: Cloudinary Dashboard → Reports → Usage
   - Look for unusual spikes in upload volume
   - Check "Source" to see if uploads are coming from your app domain

2. **Review Moderation Queue** (if enabled):
   - Dashboard → Assets → Moderation
   - Manually approve or reject flagged images

3. **Check Storage Usage**:
   - Dashboard → Reports → Storage
   - Delete unused or suspicious files

## 5. Emergency Response

### If You See Abuse
1. **Immediately disable the unsigned preset**:
   - Settings → Upload → Upload presets → `mamacare_unsigned` → Toggle OFF
2. **Switch to signed uploads**:
   - Requires backend endpoint to generate signatures
   - See: https://cloudinary.com/documentation/upload_images#signed_upload
3. **Delete abusive files**:
   - Dashboard → Media Library → Search by tag `user-generated`
   - Bulk delete suspicious files

## 6. Code Configuration

Your app code is in `app-photo-storage.js`:

```javascript
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
const CLOUDINARY_UPLOAD_PRESET = 'mamacare_unsigned';
```

### Current Status (from code comments)
- ✅ File size validated client-side (5 MB max)
- ✅ File type validated (images only)
- ✅ Preview shown before upload
- ⚠️ **Dashboard restrictions must be set manually** (you're here!)

## 7. Compliance Notes

### GDPR/Privacy
- User photos are uploaded to Cloudinary (Ireland/EU region if configured)
- Add to Privacy Policy: "Profile images are stored securely via Cloudinary CDN"
- Users can delete photos anytime (app calls `cloudinary.uploader.destroy()`)

### Backup
- Enable **Auto-Backup** in Cloudinary: Settings → Account → Backup
- Downloads daily snapshots of all assets

---

## ✅ Verification Checklist

Before going to production, verify:

- [ ] Unsigned preset `mamacare_unsigned` is configured with ALL security restrictions
- [ ] File size limit is 5 MB
- [ ] Only image formats allowed (jpg, jpeg, png, webp)
- [ ] Domain whitelist includes your production URL
- [ ] Upload rate limiting is enabled (10/min per IP)
- [ ] Auto moderation is enabled (if available)
- [ ] Usage monitoring is set up (weekly reports)
- [ ] Backup is enabled

**Last Verified**: [Add date when you complete this checklist]  
**Verified By**: [Your name]

---

## Alternative: Switch to Signed Uploads (More Secure)

If you want maximum security, consider switching to **signed uploads**:

1. Create a backend endpoint (Supabase Edge Function) that generates upload signatures
2. Update `app-photo-storage.js` to call this endpoint before upload
3. Remove the unsigned preset entirely

Pros: No dashboard restrictions needed, full control  
Cons: Requires backend endpoint, slightly slower upload flow

See: `supabase/functions/cloudinary-signature/index.ts` (create this)
