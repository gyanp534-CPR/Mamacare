-- ════════════════════════════════════════════════════════════
-- MamaCare Database Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ════════════════════════════════════════════════════════════

-- Add photo_url column to journal_entries table
ALTER TABLE public.journal_entries 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.journal_entries.photo_url 
IS 'Cloud photo URL from Cloudinary (dpaihqxq3) or Supabase Storage';

-- Verify column was added
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'journal_entries' 
  AND column_name = 'photo_url';

-- Expected result:
--  column_name | data_type | is_nullable
-- -------------+-----------+-------------
--  photo_url   | text      | YES

-- ════════════════════════════════════════════════════════════
-- ✅ Migration Complete!
-- ════════════════════════════════════════════════════════════
