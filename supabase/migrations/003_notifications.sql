-- Notifications System for MamaSign Dashboard
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. NOTIFICATIONS TABLE
-- Stores all user notifications
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  -- types: document_signed, document_completed, document_viewed, document_declined, reminder_sent
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  document_id UUID REFERENCES signing_requests(id) ON DELETE CASCADE,
  document_name TEXT,
  signer_name TEXT,
  signer_email TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_document ON notifications(document_id);

-- =============================================
-- 2. RLS POLICIES
-- =============================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid()::text);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid()::text);

-- Allow insert from service role (API)
CREATE POLICY "Service can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid()::text);
