-- Email System Tables for AuraDoc
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. SIGNING REQUESTS TABLE
-- Stores document signing requests with multi-signer support
-- =============================================

CREATE TABLE IF NOT EXISTS signing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_url TEXT,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  signers JSONB NOT NULL DEFAULT '[]',
  -- signers format: [{name, email, order, status, signedAt}]
  message TEXT,
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  -- status: pending, in_progress, completed, declined, expired
  current_signer_index INTEGER DEFAULT 0,
  declined_by TEXT,
  declined_reason TEXT,
  declined_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_signing_requests_user ON signing_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_signing_requests_status ON signing_requests(status);
CREATE INDEX IF NOT EXISTS idx_signing_requests_created ON signing_requests(created_at DESC);

-- =============================================
-- 2. EMAIL LOGS TABLE
-- Tracks all sent emails for audit and analytics
-- =============================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES signing_requests(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_type TEXT NOT NULL,
  -- types: signing_request, reminder, document_opened_notification,
  -- signature_notification, signer_confirmation, document_completed,
  -- document_declined_notification
  reminder_number INTEGER,
  status TEXT NOT NULL DEFAULT 'sent',
  -- status: sent, delivered, opened, bounced, failed
  resend_id TEXT,
  triggered_by TEXT DEFAULT 'manual',
  -- triggered_by: manual, auto (cron), webhook
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  metadata JSONB
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_document ON email_logs(document_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent ON email_logs(sent_at DESC);

-- =============================================
-- 3. SIGNATURE RECORDS TABLE (Enhanced)
-- Stores actual signatures with legal audit trail
-- =============================================

CREATE TABLE IF NOT EXISTS signature_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signing_request_id UUID REFERENCES signing_requests(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  signature_image TEXT, -- Base64 or URL
  signature_type TEXT DEFAULT 'draw',
  -- types: draw, type, upload
  ip_address TEXT,
  user_agent TEXT,
  geolocation JSONB,
  consent_given BOOLEAN DEFAULT true,
  consent_text TEXT,
  signed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(signing_request_id, signer_email)
);

CREATE INDEX IF NOT EXISTS idx_signature_records_request ON signature_records(signing_request_id);
CREATE INDEX IF NOT EXISTS idx_signature_records_signer ON signature_records(signer_email);

-- =============================================
-- 4. REMINDER SCHEDULE TABLE
-- Customizable reminder schedules per document
-- =============================================

CREATE TABLE IF NOT EXISTS reminder_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signing_request_id UUID REFERENCES signing_requests(id) ON DELETE CASCADE,
  reminder_days INTEGER[] DEFAULT ARRAY[1, 3, 5, 7],
  max_reminders INTEGER DEFAULT 4,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. RLS POLICIES (Row Level Security)
-- =============================================

-- Enable RLS
ALTER TABLE signing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_schedules ENABLE ROW LEVEL SECURITY;

-- Signing Requests: Users can see their own documents
CREATE POLICY "Users can view own signing requests"
  ON signing_requests FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own signing requests"
  ON signing_requests FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own signing requests"
  ON signing_requests FOR UPDATE
  USING (user_id = auth.uid()::text);

-- Email Logs: Users can see logs for their documents
CREATE POLICY "Users can view email logs for own documents"
  ON email_logs FOR SELECT
  USING (
    document_id IN (
      SELECT id FROM signing_requests WHERE user_id = auth.uid()::text
    )
  );

-- Signature Records: Users can see signatures on their documents
CREATE POLICY "Users can view signatures on own documents"
  ON signature_records FOR SELECT
  USING (
    signing_request_id IN (
      SELECT id FROM signing_requests WHERE user_id = auth.uid()::text
    )
  );

-- =============================================
-- 6. FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER signing_requests_updated
  BEFORE UPDATE ON signing_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 7. VIEWS FOR ANALYTICS
-- =============================================

-- Document signing analytics
CREATE OR REPLACE VIEW signing_analytics AS
SELECT
  user_id,
  COUNT(*) as total_documents,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'pending' OR status = 'in_progress') as pending,
  COUNT(*) FILTER (WHERE status = 'declined') as declined,
  AVG(
    CASE
      WHEN completed_at IS NOT NULL
      THEN EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600
    END
  ) as avg_completion_hours
FROM signing_requests
GROUP BY user_id;

-- Email delivery stats
CREATE OR REPLACE VIEW email_stats AS
SELECT
  email_type,
  COUNT(*) as total_sent,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
  COUNT(*) FILTER (WHERE status = 'opened') as opened,
  COUNT(*) FILTER (WHERE status = 'bounced') as bounced
FROM email_logs
GROUP BY email_type;

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Uncomment to add test data:
/*
INSERT INTO signing_requests (id, user_id, document_name, sender_name, sender_email, signers, status)
VALUES (
  'test-doc-001',
  'user_test123',
  'Sample Agreement',
  'John Doe',
  'john@example.com',
  '[{"name": "Alice Smith", "email": "alice@example.com", "order": 1, "status": "pending"},
    {"name": "Bob Wilson", "email": "bob@example.com", "order": 2, "status": "pending"}]',
  'pending'
);
*/
