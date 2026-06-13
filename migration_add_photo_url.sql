-- Migration: Add photo_url column to journal_entries
-- Run this in Supabase SQL Editor

-- Add column if it doesn't exist
ALTER TABLE public.journal_entries 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add comment
COMMENT ON COLUMN public.journal_entries.photo_url IS 'Cloud photo URL from Cloudinary or Supabase Storage';

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'journal_entries' 
AND column_name = 'photo_url';
