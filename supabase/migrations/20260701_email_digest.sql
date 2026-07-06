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
