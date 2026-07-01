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
