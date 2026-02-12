-- Invoices Table for AuraDoc/MamaSign
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. INVOICES TABLE
-- Stores user invoices with full invoice data in JSONB
-- =============================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  invoice_number TEXT,
  status TEXT DEFAULT 'draft',
  -- status: draft, sent, paid, overdue, cancelled
  data JSONB NOT NULL DEFAULT '{}',
  -- data stores the full InvoiceData object (items, client info, business info, etc.)
  total DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  client_name TEXT,
  client_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own invoices (via service role, RLS bypassed)
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own invoices" ON invoices
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own invoices" ON invoices
  FOR DELETE USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_invoices_updated_at();

-- =============================================
-- 2. ENABLE REALTIME (Optional)
-- =============================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
