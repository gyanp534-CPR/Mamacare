# Apply Database Migration - Step by Step Guide

## Method 1: Supabase Dashboard SQL Editor (Easiest) ⭐

### Step 1: Open SQL Editor
1. Go to https://supabase.com/dashboard
2. Click on your **MamaCare project**
3. Click **SQL Editor** in the left sidebar
4. Click **New query** button

### Step 2: Copy and Run Migration SQL

Copy this entire SQL block and paste it into the SQL Editor:

```sql
-- Add email digest preferences to user_profile table
ALTER TABLE user_profile 
ADD COLUMN IF NOT EXISTS email_digest_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_digest_sent_at TIMESTAMPTZ;

-- Create index for faster queries in weekly digest function
CREATE INDEX IF NOT EXISTS idx_user_profile_email_digest 
ON user_profile(email_digest_enabled, email_verified, last_digest_sent_at)
WHERE email_digest_enabled = true AND email_verified = true;

-- Add comment
COMMENT ON COLUMN user_profile.email_digest_enabled IS 'Whether user wants weekly email digest';
COMMENT ON COLUMN user_profile.email_verified IS 'Whether email has been verified';
COMMENT ON COLUMN user_profile.last_digest_sent_at IS 'Timestamp of last sent weekly digest';

-- ═══════════════════════════════════════════════════════════════
-- CONTRACTION TIMER: Cross-device sync table
-- ═══════════════════════════════════════════════════════════════

-- Create contraction_sessions table for critical labor data
CREATE TABLE IF NOT EXISTS contraction_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  contractions JSONB NOT NULL,
  last_end_time BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_date)
);

-- Enable Row Level Security
ALTER TABLE contraction_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own contractions
CREATE POLICY "Users can view own contractions" ON contraction_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contractions" ON contraction_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contractions" ON contraction_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contractions" ON contraction_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_contraction_sessions_user_date 
ON contraction_sessions(user_id, session_date DESC);

-- Comments
COMMENT ON TABLE contraction_sessions IS 'Stores contraction timer data for cross-device sync and data safety';
COMMENT ON COLUMN contraction_sessions.contractions IS 'JSON array of contraction objects with start, end, duration, frequency';
COMMENT ON COLUMN contraction_sessions.last_end_time IS 'Timestamp of last contraction end (for frequency calculation)';
```

### Step 3: Execute
1. Click **Run** button (or press `Ctrl+Enter`)
2. Wait for "Success. No rows returned" message
3. Done! ✅

### Step 4: Verify Tables Created
1. Click **Table Editor** in left sidebar
2. You should see new table: `contraction_sessions`
3. Click `user_profile` table
4. Scroll right to see new columns:
   - `email_digest_enabled`
   - `email_verified`
   - `last_digest_sent_at`

---

## Method 2: Supabase CLI with Remote Connection

If you prefer CLI, connect to your remote database:

### Step 1: Link to Remote Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Find your project ref:
- Go to Supabase Dashboard → Project Settings → General
- Copy "Reference ID" (looks like `abcdefghijklmnop`)

### Step 2: Push Migration
```bash
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

Replace:
- `[YOUR-PASSWORD]` with your database password
- `[YOUR-PROJECT-REF]` with your project reference ID

Or set environment variable:
```bash
$env:SUPABASE_DB_PASSWORD="your-database-password"
supabase db push
```

---

## Troubleshooting

### Error: "Connection timeout"
- This means CLI is trying to connect to local Supabase (not running)
- **Solution**: Use Method 1 (Dashboard SQL Editor) instead

### Error: "relation already exists"
- Migration was already applied
- **Solution**: Check Table Editor to confirm tables exist, then skip this step

### Error: "column already exists"
- Columns were already added
- **Solution**: Migration is idempotent (uses `IF NOT EXISTS`), safe to ignore

---

## What This Migration Does

### 1. Email Digest Columns (user_profile table)
- `email_digest_enabled` → User wants weekly email (default: true)
- `email_verified` → Email verified (default: false)
- `last_digest_sent_at` → Last email sent timestamp

### 2. Contraction Sessions Table (NEW)
- Stores labor contraction data for cross-device sync
- **Critical for patient safety** — data survives browser clears
- RLS enabled — users only see their own data
- Indexed for fast queries

---

## Verification Checklist

After running migration, verify:

- [ ] `contraction_sessions` table exists in Table Editor
- [ ] `user_profile` has 3 new columns (email_digest_enabled, email_verified, last_digest_sent_at)
- [ ] RLS is enabled on `contraction_sessions` (green shield icon)
- [ ] No error messages in SQL Editor

---

## Next Step After Migration

Once migration is applied, proceed to:

1. **Deploy Razorpay Webhook**:
   ```bash
   supabase functions deploy razorpay-webhook --no-verify-jwt
   ```

2. **Set Webhook Secret**:
   ```bash
   supabase secrets set RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

3. **Configure Cloudinary** (see `CLOUDINARY_SECURITY_CHECKLIST.md`)

4. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

---

## Need Help?

If you see any errors:
1. Screenshot the error message
2. Check Supabase Dashboard → Database → Logs
3. Verify project is not paused (free tier auto-pauses after 7 days inactivity)
