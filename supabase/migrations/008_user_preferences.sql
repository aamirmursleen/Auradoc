-- User Preferences table for storing settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  default_reminder_enabled BOOLEAN DEFAULT true,
  default_reminder_interval_days INT DEFAULT 3,
  default_expiration_days INT,
  email_notifications_enabled BOOLEAN DEFAULT true,
  notify_on_view BOOLEAN DEFAULT true,
  notify_on_sign BOOLEAN DEFAULT true,
  notify_on_complete BOOLEAN DEFAULT true,
  signature_image TEXT,
  company_name TEXT,
  company_logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- RLS policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (true);
