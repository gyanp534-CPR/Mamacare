-- Security Updates for MamaCare Database
-- Run this after the main schema.sql

-- ══════════════════════════════════════════════════════════════
-- AI USAGE TRACKING TABLE (for rate limiting)
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS ai_usage (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  call_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, date)
);

-- Enable RLS
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Users can only view their own usage
CREATE POLICY "Users can view own AI usage"
  ON ai_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can update (Edge Function)
CREATE POLICY "Service role can manage AI usage"
  ON ai_usage FOR ALL
  USING (auth.role() = 'service_role');

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date ON ai_usage(user_id, date);

-- ══════════════════════════════════════════════════════════════
-- SUBSCRIPTION STATUS CHECK (already exists, add index)
-- ══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
  ON subscriptions(user_id, status) 
  WHERE status = 'active';

-- ══════════════════════════════════════════════════════════════
-- SECURITY: Add audit log for sensitive operations
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only service role can write
CREATE POLICY "Service role can write audit log"
  ON audit_log FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Users can view their own audit log
CREATE POLICY "Users can view own audit log"
  ON audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_audit_log_user_created 
  ON audit_log(user_id, created_at DESC);

-- ══════════════════════════════════════════════════════════════
-- CLEANUP: Drop unsafe policies if any exist
-- ══════════════════════════════════════════════════════════════
-- (Add specific drops here if needed after auditing existing policies)

-- ══════════════════════════════════════════════════════════════
-- GRANTS: Ensure proper permissions
-- ══════════════════════════════════════════════════════════════
-- Edge Functions need service role access
GRANT ALL ON ai_usage TO service_role;
GRANT ALL ON subscriptions TO service_role;
GRANT ALL ON audit_log TO service_role;

-- ══════════════════════════════════════════════════════════════
-- COMMENTS
-- ══════════════════════════════════════════════════════════════
COMMENT ON TABLE ai_usage IS 'Tracks AI API call counts per user per day for rate limiting';
COMMENT ON TABLE audit_log IS 'Audit trail for sensitive operations';
