# 🔧 Cloudinary Unsigned Preset Setup

**Your Cloud Name:** `dpaihqxq3` ✅ (already configured in code)

---

## ⚡ Quick Setup (2 Minutes)

### Step 1: Login to Cloudinary

Go to: https://cloudinary.com/console

Login with your account.

---

### Step 2: Create Unsigned Upload Preset

1. Click **Settings** (⚙️ icon in top right)
2. Click **Upload** tab in left sidebar
3. Scroll down to **Upload presets** section
4. Click **Add upload preset** button

---

### Step 3: Configure Preset

Fill in these settings:

| Setting | Value | Why |
|---------|-------|-----|
| **Preset name** | `mamacare_unsigned` | Must match code |
| **Signing mode** | **Unsigned** ⚠️ CRITICAL | Allows browser uploads |
| **Folder** | `mamacare-journals` | Organizes photos |
| **Access mode** | Public read | Users can view their photos |
| **Overwrite** | ❌ No | Prevents replacing existing photos |
| **Allowed formats** | `jpg,jpeg,png,webp` | Image files only |
| **Max file size** | 5 MB | Reasonable limit |

**Screenshot of key settings:**
```
┌─────────────────────────────────────┐
│ Preset name: mamacare_unsigned     │
│ Signing mode: ⦿ Unsigned           │  ← MUST be Unsigned
│ Folder: mamacare-journals          │
└─────────────────────────────────────┘
```

---

### Step 4: Save Preset

Click **Save** at the bottom.

✅ You're done! The preset is now active.

---

## 🧪 Test Upload

After creating the preset, test it:

### Option A: Test in App

1. Open your deployed app: https://mamacare.gyanam.shop
2. Login
3. Go to **Journal** page
4. Upload a photo
5. Check browser console:
   - ✅ Should see: `"✅ Uploaded to Cloudinary: https://res.cloudinary.com/..."`
   - ❌ If error: Check preset name matches exactly

### Option B: Test in Cloudinary Dashboard

1. Go to **Media Library** in Cloudinary
2. Look for folder: `mamacare-journals`
3. Uploaded photos should appear there

---

## ❓ Troubleshooting

### Error: "Invalid preset"

**Fix:** Preset name doesn't match code
- Check preset name is exactly: `mamacare_unsigned`
- Case-sensitive! No spaces!

### Error: "Unsigned upload not allowed"

**Fix:** Preset is in "Signed" mode
- Edit preset
- Change **Signing mode** to **Unsigned**
- Save

### Error: "Folder not allowed"

**Fix:** Folder restrictions
- Edit preset
- Remove folder restrictions (or set to `mamacare-journals`)
- Save

### Photos not appearing in Media Library

**Check:**
1. Go to Media Library
2. Click **Folders** in left sidebar
3. Open `mamacare-journals` folder
4. Photos should be there

---

## 🔒 Security Notes

### Why Unsigned Preset is Safe:

1. **Folder restriction** — All uploads go to `mamacare-journals/` only
2. **No overwrite** — Users can't replace existing photos
3. **User-specific filenames** — Includes user ID (only authenticated users can upload)
4. **Rate limiting** — Cloudinary has built-in abuse protection
5. **Cloudinary dashboard** — You can monitor and delete suspicious uploads

### What Users CAN'T Do:

- ❌ Upload to other folders
- ❌ Replace existing photos
- ❌ Access other users' photos
- ❌ Delete photos
- ❌ Bypass file size limits

### What You CAN Do:

- ✅ Monitor all uploads in dashboard
- ✅ Delete inappropriate photos manually
- ✅ See bandwidth/storage usage
- ✅ Add more restrictions if needed

---

## 📊 Monitoring

### Check Usage:

1. Go to https://cloudinary.com/console
2. **Overview** tab shows:
   - Storage used (out of 25 GB)
   - Bandwidth (out of 25 GB/month)
   - Transformations used

### Alerts:

- Cloudinary emails you at 80% storage
- Cloudinary emails you at 80% bandwidth

---

## ✅ Verification Checklist

After setup:

- [ ] Preset created with name: `mamacare_unsigned`
- [ ] Signing mode set to: **Unsigned**
- [ ] Folder set to: `mamacare-journals`
- [ ] Saved successfully
- [ ] Tested upload in app (see console log)
- [ ] Photo appears in Cloudinary Media Library

---

## 🚀 Deploy Updated Code

Code is already updated with your cloud name! Just deploy:

```bash
# Rebuild bundle (if needed)
node build.js

# Commit and push
git add .
git commit -m "Configure Cloudinary with credentials"
git push origin main

# Deploy to production (automatic via Vercel)
# Or manually: vercel --prod
```

---

## 📝 After Setup

Once preset is created and code is deployed:

1. ✅ Photo uploads will go to Cloudinary automatically
2. ✅ Falls back to Supabase if Cloudinary has issues
3. ✅ Falls back to local download if both fail
4. ✅ Users never lose photos

---

**Your cloud name is already configured!** Just create the preset and you're done. 🎉

**Dashboard:** https://cloudinary.com/console  
**Preset name:** `mamacare_unsigned`  
**Mode:** Unsigned
