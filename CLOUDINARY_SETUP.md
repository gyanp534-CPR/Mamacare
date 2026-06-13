# 📸 Cloudinary Setup Guide — Free Photo Storage

**Target:** 25 GB free storage for MamaCare journal photos

---

## 🎯 Why Cloudinary?

| Service | Free Tier | MamaCare Impact |
|---------|-----------|-----------------|
| **Cloudinary** | 25 GB storage + CDN | ✅ ~25,000 photos |
| Supabase | 1 GB storage | ⚠️ ~1,000 photos |
| ImgBB | Unlimited (with ads) | ✅ Unlimited but ads |
| Imgur | Unlimited (rate limited) | ⚠️ Rate limits |

**Verdict:** Cloudinary = Best balance of free storage + no ads + CDN

---

## 🚀 Setup Steps (5 minutes)

### Step 1: Create Free Account

1. Go to https://cloudinary.com/users/register_free
2. Sign up with email (or Google/GitHub)
3. **Free Plan:**
   - 25 GB storage
   - 25 GB bandwidth/month
   - 10,000 image transformations
   - CDN included

### Step 2: Get Cloud Name

1. After login, go to **Dashboard**
2. Find **Account Details** section
3. Copy your **Cloud Name** (e.g., `dxyz123abc`)

### Step 3: Create Unsigned Upload Preset

1. Go to **Settings** (⚙️ icon top right)
2. Click **Upload** tab
3. Scroll to **Upload presets**
4. Click **Add upload preset**
5. Configure:
   - **Preset name:** `mamacare_unsigned`
   - **Signing Mode:** **Unsigned** ⚠️ IMPORTANT
   - **Folder:** `mamacare-journals`
   - **Access mode:** Public read
   - **Overwrite:** No
6. Click **Save**

### Step 4: Update Code

Open `app-photo-storage.js` and update:

```javascript
const CLOUDINARY_CONFIG = {
  cloudName: 'YOUR_CLOUD_NAME',    // ← Replace with your cloud name
  uploadPreset: 'mamacare_unsigned' // ← Use your preset name
};
```

**Example:**
```javascript
const CLOUDINARY_CONFIG = {
  cloudName: 'dxyz123abc',         // ✅ Your actual cloud name
  uploadPreset: 'mamacare_unsigned' // ✅ Matches preset you created
};
```

### Step 5: Test

1. Run app locally or deploy
2. Go to Journal page
3. Upload a photo
4. Check console: should see "✅ Uploaded to Cloudinary"
5. Verify in Cloudinary Dashboard → Media Library

---

## 🔒 Security Notes

### Why Unsigned Preset?

- **Direct browser upload** (no backend needed)
- **Faster** (no proxy through server)
- **Free tier friendly** (no extra API calls)

### Is it safe?

✅ **YES** — Unsigned presets are safe when configured correctly:

1. **Folder restriction** — All uploads go to `mamacare-journals/`
2. **No overwrite** — Users can't replace existing photos
3. **Rate limiting** — Cloudinary has built-in abuse protection
4. **User-specific** — Filenames include user ID (only visible to authenticated users)

### Optional: Add Security

**If you want extra security**, add upload restrictions:

1. In Cloudinary Dashboard → **Upload Preset Settings**
2. Add **Context** validation (user must be logged in)
3. Add **Allowed formats:** `jpg,jpeg,png`
4. Add **Max file size:** 5 MB

---

## 📊 Monitoring Usage

### Check Dashboard

1. Go to https://cloudinary.com/console
2. **Overview** tab shows:
   - Storage used (out of 25 GB)
   - Bandwidth used (out of 25 GB/month)
   - Transformations used

### In-App Tracking

The app automatically tracks uploads in localStorage:

```javascript
// Check usage
const stats = JSON.parse(localStorage.getItem('photo_upload_stats'));
console.log(stats);
```

### Alerts

Cloudinary emails you when you reach:
- 80% of storage
- 80% of bandwidth

---

## 💰 Free Tier Limits

| Resource | Limit | MamaCare Usage |
|----------|-------|----------------|
| Storage | 25 GB | ~25,000 photos (1 MB each) |
| Bandwidth | 25 GB/month | ~25,000 views/month |
| Transformations | 10,000/month | Thumbnails (unlimited static) |

**Reality Check:**
- Average photo: 200-500 KB (after compression)
- **Actual capacity:** 50,000-125,000 photos!
- **Daily uploads:** 137 photos/day = 1 user uploading 5x/day for 27 days

**Verdict:** Free tier is more than enough for initial users!

---

## 🔄 Fallback Strategy

The app has **3-tier fallback:**

```
1. Try Cloudinary (25 GB free) ✅
   ↓ (if fails)
2. Try Supabase (1 GB free) ⚠️
   ↓ (if fails)
3. Download locally 📱
```

**User Experience:**
- **Cloudinary works:** Photo backed up to cloud + CDN
- **Cloudinary down:** Falls back to Supabase (still cloud)
- **All cloud fails:** Downloads to device (existing behavior)

---

## 🐛 Troubleshooting

### Error: "Upload failed"

**Check:**
1. Cloud name correct? (no spaces, exact match)
2. Preset name correct? (case-sensitive)
3. Preset is **Unsigned**? (not Signed)
4. Internet connection stable?

### Error: "Invalid signature"

**Fix:** Your preset is set to "Signed" mode
1. Go to Upload Preset settings
2. Change **Signing Mode** to **Unsigned**
3. Save

### Error: "Folder not allowed"

**Fix:** Remove folder restriction from preset
1. Go to Upload Preset settings
2. Remove **Folder** setting (or ensure it matches code)
3. Save

### Photos not showing in Media Library

**Check:**
1. Go to **Media Library**
2. Click **Folders** (left sidebar)
3. Open `mamacare-journals` folder
4. Photos should be there

---

## 🚀 Upgrade Path (If Needed)

If you outgrow free tier (unlikely in first year):

### Cloudinary Paid Plans

| Plan | Price | Storage | Bandwidth |
|------|-------|---------|-----------|
| **Free** | $0 | 25 GB | 25 GB/month |
| **Plus** | $89/month | 140 GB | 140 GB/month |
| **Advanced** | $224/month | 540 GB | 540 GB/month |

### Alternative: Keep Cloudinary + Add More Services

**Hybrid approach:**
1. **Cloudinary** — First 25 GB (primary)
2. **ImgBB** — Unlimited (fallback, has ads)
3. **Supabase** — 1 GB (emergency fallback)

**Code is already set up** to support multiple providers!

---

## ✅ Setup Checklist

Before deploying:

- [ ] Cloudinary account created
- [ ] Cloud name copied
- [ ] Unsigned upload preset created
- [ ] `app-photo-storage.js` updated with credentials
- [ ] Database migration run (`migration_add_photo_url.sql`)
- [ ] Tested photo upload locally
- [ ] Verified photo appears in Cloudinary Dashboard
- [ ] Checked fallback to Supabase works
- [ ] Checked local download works (if all cloud fails)

---

## 📚 Additional Resources

- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Upload Widget:** https://cloudinary.com/documentation/upload_widget
- **Unsigned Uploads:** https://cloudinary.com/documentation/upload_images#unsigned_upload
- **Free Tier Details:** https://cloudinary.com/pricing

---

**Ready to deploy? Update the config and push!** 🚀

```bash
# 1. Update app-photo-storage.js with your cloud name
# 2. Run migration
# 3. Deploy
npm run bundle
git add .
git commit -m "Add Cloudinary photo storage"
git push origin main
vercel --prod
```
