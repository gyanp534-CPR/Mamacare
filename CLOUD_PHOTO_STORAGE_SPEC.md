# ☁️ Cloud Photo Storage — Feature Specification

**Feature:** Cloud Photo Storage Migration  
**Version:** MamaCare v8.2  
**Priority:** High  
**Status:** Planning

---

## 🎯 Problem Statement

### Current Implementation Issues

**Current System:** Base64 encoding in localStorage
- ❌ **5-10MB localStorage limit** — Users can only store 5-10 photos
- ❌ **Performance degradation** — Large base64 strings slow down app
- ❌ **No backup** — Data lost if browser cache cleared
- ❌ **No compression** — Full-resolution images waste space
- ❌ **No sync** — Photos don't sync across devices

### User Impact

- Users lose precious pregnancy photos
- Can't store enough photos for full pregnancy journey
- Photos disappear after browser reset
- Slow app performance as photos accumulate

---

## 🎯 Objectives

### Must Have
1. ✅ Store photos in cloud (Supabase Storage or Cloudinary)
2. ✅ Automatic compression and optimization
3. ✅ Unlimited photo storage (or reasonable limit: 1000+)
4. ✅ Fast upload and retrieval
5. ✅ Sync across devices
6. ✅ Backup and recovery

### Should Have
1. ⭐ Progressive image loading (thumbnails first)
2. ⭐ Multiple photo support per journal entry
3. ⭐ Photo gallery view
4. ⭐ Photo metadata (EXIF, location)
5. ⭐ Download all photos feature

### Nice to Have
1. 💫 Face detection (blur option for privacy)
2. 💫 AI photo organization
3. 💫 Photo filters/editing
4. 💫 Shared albums with partner
5. 💫 Photo timeline view

---

## 🏗️ Architecture Options

### Option 1: Supabase Storage (Recommended)

**Pros:**
- ✅ Already using Supabase
- ✅ Integrated with auth (RLS)
- ✅ No additional service needed
- ✅ Generous free tier (1GB)
- ✅ Easy to implement

**Cons:**
- ⚠️ 1GB limit on free tier
- ⚠️ Limited optimization features
- ⚠️ Manual compression needed

**Implementation:**
```javascript
// Upload
const { data, error } = await supabase.storage
  .from('journal-photos')
  .upload(`${userId}/${photoId}.jpg`, file);

// Retrieve
const { data } = supabase.storage
  .from('journal-photos')
  .getPublicUrl(`${userId}/${photoId}.jpg`);
```

---

### Option 2: Cloudinary

**Pros:**
- ✅ Automatic optimization
- ✅ On-the-fly transformations
- ✅ Better performance
- ✅ CDN delivery
- ✅ Advanced features (face detection, AI)

**Cons:**
- ⚠️ Additional service/cost
- ⚠️ More complex setup
- ⚠️ Requires API keys

**Implementation:**
```javascript
// Upload
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', 'mamacare');

const response = await fetch(
  'https://api.cloudinary.com/v1_1/your-cloud/image/upload',
  { method: 'POST', body: formData }
);
```

---

### Option 3: Hybrid Approach

- **Supabase Storage:** For storage and backup
- **Cloudinary:** For optimization and CDN
- **Best of both worlds**

---

## 🔧 Recommended Solution: Supabase Storage

**Reasoning:**
1. Simpler implementation
2. Already integrated
3. No additional costs
4. Sufficient for MVP
5. Can migrate to Cloudinary later if needed

---

## 📋 Implementation Plan

### Phase 1: Infrastructure Setup

1. **Create Supabase Storage Bucket**
   ```sql
   -- In Supabase Dashboard → Storage
   -- Create bucket: 'journal-photos'
   -- Set public access: false (private, auth required)
   ```

2. **Set up RLS Policies**
   ```sql
   -- Users can only access their own photos
   CREATE POLICY "Users can upload their photos"
   ON storage.objects FOR INSERT
   WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

   CREATE POLICY "Users can view their photos"
   ON storage.objects FOR SELECT
   USING (auth.uid()::text = (storage.foldername(name))[1]);

   CREATE POLICY "Users can delete their photos"
   ON storage.objects FOR DELETE
   USING (auth.uid()::text = (storage.foldername(name))[1]);
   ```

3. **Update Database Schema**
   ```sql
   -- Add photo_url column to journal_entries
   ALTER TABLE journal_entries 
   ADD COLUMN photo_url TEXT,
   ADD COLUMN photo_path TEXT,
   ADD COLUMN photo_size INTEGER;

   -- For multiple photos support (future)
   CREATE TABLE journal_photos (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
     photo_url TEXT NOT NULL,
     photo_path TEXT NOT NULL,
     photo_size INTEGER,
     uploaded_at TIMESTAMP DEFAULT NOW(),
     user_id UUID REFERENCES auth.users(id)
   );
   ```

---

### Phase 2: Frontend Implementation

1. **Image Compression Function**
   ```javascript
   async function compressImage(file, maxWidth = 1200, quality = 0.8) {
     return new Promise((resolve) => {
       const reader = new FileReader();
       reader.onload = (e) => {
         const img = new Image();
         img.onload = () => {
           const canvas = document.createElement('canvas');
           let width = img.width;
           let height = img.height;

           if (width > maxWidth) {
             height = (height * maxWidth) / width;
             width = maxWidth;
           }

           canvas.width = width;
           canvas.height = height;
           const ctx = canvas.getContext('2d');
           ctx.drawImage(img, 0, 0, width, height);

           canvas.toBlob(resolve, 'image/jpeg', quality);
         };
         img.src = e.target.result;
       };
       reader.readAsDataURL(file);
     });
   }
   ```

2. **Upload Function**
   ```javascript
   async function uploadJournalPhoto(file, userId, entryId) {
     // Compress image
     const compressed = await compressImage(file);
     
     // Generate unique filename
     const filename = `${userId}/${entryId}_${Date.now()}.jpg`;
     
     // Upload to Supabase
     const { data, error } = await supabase.storage
       .from('journal-photos')
       .upload(filename, compressed);

     if (error) throw error;

     // Get public URL
     const { data: urlData } = supabase.storage
       .from('journal-photos')
       .getPublicUrl(filename);

     return {
       url: urlData.publicUrl,
       path: filename,
       size: compressed.size
     };
   }
   ```

3. **Save Journal Entry with Photo**
   ```javascript
   async function saveJournalWithPhoto(text, photoFile) {
     let photoData = null;

     if (photoFile) {
       photoData = await uploadJournalPhoto(
         photoFile, 
         user.id, 
         `entry-${Date.now()}`
       );
     }

     const { data, error } = await supabase
       .from('journal_entries')
       .insert({
         user_id: user.id,
         text: text,
         photo_url: photoData?.url,
         photo_path: photoData?.path,
         photo_size: photoData?.size,
         date: new Date().toISOString()
       });

     return data;
   }
   ```

4. **Display Photos**
   ```javascript
   function renderJournalWithPhoto(entry) {
     return `
       <div class="journal-entry">
         <div class="journal-text">${entry.text}</div>
         ${entry.photo_url ? `
           <img src="${entry.photo_url}" 
                alt="Journal photo" 
                class="journal-photo"
                loading="lazy">
         ` : ''}
       </div>
     `;
   }
   ```

5. **Delete Photo**
   ```javascript
   async function deleteJournalPhoto(photoPath) {
     const { error } = await supabase.storage
       .from('journal-photos')
       .remove([photoPath]);

     if (error) throw error;
   }
   ```

---

### Phase 3: Migration Strategy

**For existing users with base64 photos:**

1. **Detect legacy format**
   ```javascript
   function isBase64Photo(photoData) {
     return photoData && photoData.startsWith('data:image');
   }
   ```

2. **Convert on next upload**
   ```javascript
   async function migrateBase64ToCloud(base64Data, userId, entryId) {
     // Convert base64 to blob
     const response = await fetch(base64Data);
     const blob = await response.blob();
     
     // Upload to cloud
     return await uploadJournalPhoto(
       new File([blob], 'photo.jpg', { type: 'image/jpeg' }),
       userId,
       entryId
     );
   }
   ```

3. **Gradual migration**
   - Don't force immediate migration
   - Migrate when user edits entry
   - Show migration progress
   - Keep base64 as fallback

---

### Phase 4: Enhanced Features

1. **Gallery View**
   ```javascript
   async function loadPhotoGallery() {
     const { data } = await supabase
       .from('journal_entries')
       .select('photo_url, date, text')
       .not('photo_url', 'is', null)
       .order('date', { ascending: false });

     return data;
   }
   ```

2. **Download All Photos**
   ```javascript
   async function downloadAllPhotos() {
     const photos = await loadPhotoGallery();
     
     // Create zip file (using JSZip library)
     const zip = new JSZip();
     
     for (const photo of photos) {
       const response = await fetch(photo.photo_url);
       const blob = await response.blob();
       zip.file(`photo-${photo.date}.jpg`, blob);
     }
     
     const content = await zip.generateAsync({ type: 'blob' });
     downloadBlob(content, 'mamacare-photos.zip');
   }
   ```

3. **Photo Metadata**
   ```javascript
   async function extractExifData(file) {
     // Using exif-js library
     return new Promise((resolve) => {
       EXIF.getData(file, function() {
         resolve({
           dateTaken: EXIF.getTag(this, 'DateTime'),
           camera: EXIF.getTag(this, 'Model'),
           location: {
             lat: EXIF.getTag(this, 'GPSLatitude'),
             lon: EXIF.getTag(this, 'GPSLongitude')
           }
         });
       });
     });
   }
   ```

---

## 🎨 UI/UX Changes

### Journal Entry Form

**Before:**
```html
<input type="file" accept="image/*" id="photoInput">
```

**After:**
```html
<div class="photo-upload-zone">
  <input type="file" accept="image/*" id="photoInput" hidden>
  <button onclick="$('#photoInput').click()">
    <i data-lucide="camera"></i>
    Add Photo
  </button>
  <div id="photoPreview" class="photo-preview"></div>
  <div id="uploadProgress" class="upload-progress" style="display:none;">
    <div class="progress-bar"></div>
    <span class="progress-text">Uploading... 0%</span>
  </div>
</div>
```

### Gallery View

```html
<div class="photo-gallery">
  <div class="gallery-grid">
    <!-- Photo thumbnails in grid -->
    <div class="gallery-item">
      <img src="thumbnail-url" loading="lazy">
      <div class="gallery-date">Week 20</div>
    </div>
  </div>
</div>
```

---

## 📊 Storage Estimates

### Free Tier Limits (Supabase)
- **Storage:** 1GB
- **Bandwidth:** 2GB/month

### Photo Size Estimates
- **Original:** 2-5MB
- **Compressed (1200px):** 200-500KB
- **Thumbnail (300px):** 20-50KB

### Capacity
- **1GB = 2,000-5,000 photos** (compressed)
- **Average pregnancy:** 100-200 photos
- **Supports:** 10-50 users comfortably

### Premium Tier Upgrade
- **Storage:** 100GB ($25/month)
- **Supports:** 500+ users

---

## 🔒 Security Considerations

1. **Authentication**
   - All uploads require auth
   - RLS policies enforce user isolation

2. **File Type Validation**
   ```javascript
   function validateImageFile(file) {
     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
     return allowedTypes.includes(file.type);
   }
   ```

3. **File Size Limits**
   ```javascript
   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
   if (file.size > MAX_FILE_SIZE) {
     throw new Error('File too large (max 10MB)');
   }
   ```

4. **Content Moderation**
   - Could integrate CloudFlare Stream or AWS Rekognition
   - For MVP: Trust users, add reporting

5. **Privacy**
   - Photos not public by default
   - Signed URLs expire
   - Can implement blur/privacy mode

---

## 🧪 Testing Plan

### Unit Tests
- [ ] Image compression works
- [ ] Upload function handles errors
- [ ] RLS policies enforce access control
- [ ] File validation works

### Integration Tests
- [ ] Upload → Save → Retrieve flow
- [ ] Multiple photos per entry
- [ ] Gallery view loads
- [ ] Download all photos works

### Performance Tests
- [ ] Upload speed (target: < 5s for 5MB photo)
- [ ] Gallery load time (100 photos: < 3s)
- [ ] Compression doesn't block UI

### Edge Cases
- [ ] Network failure during upload
- [ ] Very large files (> 10MB)
- [ ] Corrupt image files
- [ ] Quota exceeded
- [ ] Concurrent uploads

---

## 📅 Implementation Timeline

### Week 1: Infrastructure
- Day 1-2: Supabase Storage setup
- Day 3-4: RLS policies and database schema
- Day 5: Testing infrastructure

### Week 2: Core Features
- Day 1-2: Compression and upload functions
- Day 3-4: Integration with journal entries
- Day 5: Testing and bug fixes

### Week 3: Migration & Enhancements
- Day 1-2: Base64 migration logic
- Day 3-4: Gallery view
- Day 5: Final testing

### Week 4: Polish & Deploy
- Day 1-2: UI polish
- Day 3: Documentation
- Day 4: Deployment
- Day 5: Monitoring and support

**Total:** 4 weeks

---

## 💰 Cost Analysis

### Supabase Storage (Free Tier)
- **Storage:** 1GB (free)
- **Bandwidth:** 2GB/month (free)
- **Sufficient for:** 10-50 active users

### Supabase Pro ($25/month)
- **Storage:** 100GB
- **Bandwidth:** 250GB/month
- **Sufficient for:** 500-1000 users

### Cloudinary (Alternative)
- **Free:** 25GB storage, 25GB bandwidth
- **Paid:** $99/month for 100GB

**Recommendation:** Start with Supabase free tier, upgrade as needed

---

## 🚀 Future Enhancements

### Phase 2 (v8.3)
1. **Multiple photos per entry** — Up to 10 photos
2. **Photo timeline view** — Visual pregnancy journey
3. **Photo editing** — Crop, rotate, filters
4. **Shared albums** — Share with partner

### Phase 3 (v9.0)
1. **AI photo organization** — Auto-tag by trimester
2. **Face detection** — Privacy blur option
3. **Photo stories** — Automated slideshow
4. **Print service integration** — Order photo books

---

## 📚 Dependencies

### Required
- Supabase Storage configured
- User authentication working
- Browser File API support

### Optional
- exif-js (for metadata)
- JSZip (for download all)
- canvas-to-blob polyfill (older browsers)

---

## ✅ Success Metrics

### Technical
- [ ] Upload success rate > 95%
- [ ] Average upload time < 5s
- [ ] No data loss
- [ ] Works offline (queue uploads)

### User Experience
- [ ] Users store 100+ photos
- [ ] No complaints about storage limit
- [ ] Gallery loads fast
- [ ] Migration seamless

### Business
- [ ] Increased user engagement
- [ ] Higher premium conversion
- [ ] Positive user feedback

---

## 🎯 Ready to Implement?

**Status:** Specification Complete ✅  
**Next Steps:**
1. Review and approve specification
2. Set up Supabase Storage bucket
3. Begin Phase 1 implementation
4. Create migration plan for existing users

**Estimated Effort:** 4 weeks (full-time) or 8 weeks (part-time)  
**Complexity:** Medium  
**Impact:** High (fixes major pain point)

---

*Last Updated: June 25, 2026*  
*MamaCare v8.2 Specification*
