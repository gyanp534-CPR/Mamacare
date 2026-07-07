-- ═══════════════════════════════════════════════════════════════
-- FIX: Add missing last_end_time column to contraction_sessions
-- ═══════════════════════════════════════════════════════════════

-- Add the missing column (if it doesn't exist)
ALTER TABLE contraction_sessions 
ADD COLUMN IF NOT EXISTS last_end_time BIGINT;

-- Update the comment to include the new column
COMMENT ON COLUMN contraction_sessions.last_end_time IS 'Timestamp of last contraction end (for frequency calculation)';

-- Verify table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contraction_sessions' 
ORDER BY ordinal_position;
