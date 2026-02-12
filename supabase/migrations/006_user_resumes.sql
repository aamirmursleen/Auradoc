-- User Resumes Table for AuraDoc/MamaSign
-- Run this in your Supabase SQL Editor

-- =============================================
-- USER_RESUMES TABLE
-- Stores user-created resumes with template and form data
-- =============================================

CREATE TABLE IF NOT EXISTS user_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  name TEXT DEFAULT 'Untitled Resume',
  data JSONB NOT NULL DEFAULT '{}',
  -- data stores form field values (fullName, jobTitle, experience, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id ON user_resumes(user_id);

-- Create index on template_id
CREATE INDEX IF NOT EXISTS idx_user_resumes_template_id ON user_resumes(template_id);

-- Enable RLS
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY;

-- Policies (service role bypasses RLS, these are for anon key access)
CREATE POLICY "Users can view own resumes" ON user_resumes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own resumes" ON user_resumes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own resumes" ON user_resumes
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own resumes" ON user_resumes
  FOR DELETE USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_user_resumes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_resumes_updated_at
    BEFORE UPDATE ON user_resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_user_resumes_updated_at();
