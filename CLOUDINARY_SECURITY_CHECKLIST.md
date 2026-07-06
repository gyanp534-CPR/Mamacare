# Cloudinary Security Configuration Checklist

## ⚠️ CRITICAL: Complete Before Production Deployment

The app currently uses **unsigned Cloudinary uploads**, which means anyone who inspects the JavaScript bundle can upload files to your Cloudinary account.

### Why This Matters

- **Public Credentials**: `cloudName` and `uploadPreset` are visible in `app-photo-storage.js` (bundled in browser)
- **No Authentication**: Unsigned presets don't require API keys
- **Abuse Risk**: Malicious actors can upload files until you hit the 25 GB free tier limit
- **Cost Risk**: If you exceed free tier, Cloudinary charges for bandwidth and storage

---

## Step 1: Configure Upload Restrictions in Cloudinary Dashboard

### Navigate to Settings
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Click **Settings** (gear icon)
3. Go to **Upload** tab
4. Find preset: `mamacare_unsigned`
5. Click **Edit**

### Set These Restrictions (Screenshot Each Setting)

#### ✅ 1. Allowed Formats
```
jpg, jpeg, png, webp
```
- **Do NOT allow**: exe, zip, pdf, js, html, svg (XSS risk)

#### ✅ 2. Max File Size
```
5 MB (5242880 bytes)
```

#### ✅ 3. Max Image Dimensions
```
Width: 2048 px
Height: 2048 px
```

#### ✅ 4. Folder Restriction
```
mamacare-journals
```
- Lock uploads to this folder only

#### ✅ 5. Resource Type
```
image
```
- **Do NOT allow**: raw, video, auto

#### ✅ 6. Overwrite
```
❌ Disabled
```
- Prevents attackers from replacing existing images

#### ✅ 7. Unique Filename
```
✅ Enabled
```
- Prevents predictable URLs

#### ✅ 8. Access Mode
```
public
```
- Required for CDN delivery (images are not sensitive)

#### ✅ 9. Upload Preset Mode
```
unsigned
```
- For MVP only (see Step 2 for production upgrade)

---

## Step 2: Monitor Usage

### Check Upload Stats Weekly
1. Go to [Cloudinary Dashboard → Reports](https://cloudinary.com/console/reports)
2. Check **Storage** and **Bandwidth** usage
3. Set up email alerts at 80% of free tier (20 GB)

### Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month

### If You Hit Limits
- Option A: Upgrade to paid plan ($0.12/GB)
- Option B: Switch to Supabase Storage (1 GB free, $0.021/GB after)
- Option C: Implement signed uploads (see Step 3)

---

## Step 3: Production Upgrade — Signed Uploads (Recommended)

### Why Signed Uploads Are Better
- API Secret stays on server (not exposed to browser)
- Time-limited signatures (expire after 1 hour)
- User-specific signatures (audit trail)
- Rate limiting possible (via Edge Function)

### Implementation Steps

#### 1. Create Supabase Edge Function
```bash
supabase functions new cloudinary-sign
```

#### 2. Add Edge Function Code
File: `supabase/functions/cloudinary-sign/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

serve(async (req) => {
  // Verify user is authenticated
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  // Generate signed upload parameters
  const timestamp = Math.round(Date.now() / 1000);
  const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')!;
  const folder = 'mamacare-journals';
  
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=mamacare_signed`;
  const signature = createHmac('sha256', apiSecret)
    .update(paramsToSign)
    .digest('hex');

  return new Response(JSON.stringify({
    signature,
    timestamp,
    api_key: Deno.env.get('CLOUDINARY_API_KEY')!,
    folder,
    upload_preset: 'mamacare_signed'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

#### 3. Set Secrets
```bash
supabase secrets set CLOUDINARY_API_KEY=123456789012345
supabase secrets set CLOUDINARY_API_SECRET=your_api_secret_here
```

#### 4. Deploy Function
```bash
supabase functions deploy cloudinary-sign
```

#### 5. Update Frontend Code
In `app-photo-storage.js`, replace `uploadToCloudinary()`:

```javascript
window.uploadToCloudinary = async function(file, metadata = {}) {
  // 1. Get signature from Edge Function
  const signResponse = await fetch('https://YOUR_PROJECT.supabase.co/functions/v1/cloudinary-sign', {
    headers: {
      'Authorization': `Bearer ${(await supa.auth.getSession()).data.session.access_token}`
    }
  });
  const signData = await signResponse.json();

  // 2. Upload with signature
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signData.api_key);
  formData.append('timestamp', signData.timestamp);
  formData.append('signature', signData.signature);
  formData.append('folder', signData.folder);
  formData.append('upload_preset', signData.upload_preset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  const response = await fetch(uploadUrl, { method: 'POST', body: formData });
  return response.json();
};
```

---

## Step 4: Verification Checklist

Before marking this as complete:

- [ ] Logged into Cloudinary Dashboard
- [ ] Edited `mamacare_unsigned` preset
- [ ] Set allowed formats: jpg, jpeg, png, webp only
- [ ] Set max file size: 5 MB
- [ ] Set max dimensions: 2048x2048
- [ ] Set folder: mamacare-journals
- [ ] Set resource type: image only
- [ ] Disabled overwrite
- [ ] Enabled unique filename
- [ ] Saved preset settings
- [ ] Tested upload from app (should work)
- [ ] Tested upload with .exe file (should fail with "Format not supported")
- [ ] Set up usage alert at 20 GB
- [ ] (Optional) Implemented signed uploads for production

---

## Emergency Response: If Abuse Detected

### Symptoms
- Cloudinary storage jumped from 2 GB → 20 GB overnight
- Unknown files in `mamacare-journals` folder
- Bandwidth spike (check Reports → Bandwidth)

### Immediate Actions
1. **Disable Preset**
   - Go to Upload Settings → `mamacare_unsigned` → **Disable**
   - App uploads will fail temporarily (users see local download fallback)

2. **Review Uploads**
   - Go to Media Library → `mamacare-journals`
   - Sort by Upload Date (newest first)
   - Delete suspicious files

3. **Switch to Signed Uploads**
   - Follow Step 3 above
   - Update `CLOUDINARY_CONFIG.uploadPreset` to `mamacare_signed`
   - Deploy updated code

4. **Report Abuse**
   - Contact Cloudinary Support: support@cloudinary.com
   - Provide upload timestamps and IPs (if available in logs)

---

## Cost Analysis

### Current Setup (Unsigned)
- **Security**: ⚠️ Medium Risk
- **Setup Time**: 5 minutes
- **Cost**: $0/month (up to 25 GB)
- **Abuse Risk**: High (anyone can upload)

### Signed Uploads (Recommended)
- **Security**: ✅ High
- **Setup Time**: 1 hour
- **Cost**: $0/month (same limits)
- **Abuse Risk**: Low (requires valid user auth)

### Alternative: Supabase Only
- **Security**: ✅ High (RLS enforced)
- **Setup Time**: 0 (already implemented)
- **Cost**: $0/month (1 GB), then $0.021/GB
- **Limitation**: Smaller free tier (1 GB vs 25 GB)

---

## Recommendation

**For MVP/Testing**: Complete Step 1 (restrictions) immediately — 10 minutes  
**For Production**: Implement Step 3 (signed uploads) before public launch — 1 hour

The current unsigned setup is acceptable for private testing with <100 users, but signed uploads are mandatory for public launch to prevent abuse.
