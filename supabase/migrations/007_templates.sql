-- Templates Table for AuraDoc/MamaSign
-- Run this in your Supabase SQL Editor

-- =============================================
-- TEMPLATES TABLE
-- Stores document templates (NDA, contracts, etc.)
-- =============================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  content TEXT,
  fields JSONB DEFAULT '[]',
  downloads INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on category
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

-- Index on popular
CREATE INDEX IF NOT EXISTS idx_templates_popular ON templates(popular);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Allow read access for all users
CREATE POLICY "Anyone can view templates" ON templates
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage templates" ON templates
  FOR ALL USING (true);

-- Seed with default templates
INSERT INTO templates (name, description, category, downloads, rating, popular, is_system) VALUES
  ('Non-Disclosure Agreement (NDA)', 'Standard mutual NDA template for protecting confidential business information between parties.', 'business', 12500, 4.9, true, true),
  ('Employment Contract', 'Comprehensive employment agreement template covering terms, compensation, and conditions.', 'hr', 9800, 4.8, true, true),
  ('Residential Lease Agreement', 'Complete rental agreement for residential properties with all standard clauses.', 'real-estate', 8500, 4.7, true, true),
  ('Independent Contractor Agreement', 'Template for hiring contractors with clear scope of work and payment terms.', 'business', 7200, 4.8, false, true),
  ('Medical Consent Form', 'HIPAA-compliant patient consent form for medical procedures and treatments.', 'healthcare', 6100, 4.9, false, true),
  ('Invoice Template', 'Professional invoice template with itemized billing and payment terms.', 'finance', 15000, 4.6, true, true),
  ('Purchase Order', 'Standard purchase order form for business procurement and vendor management.', 'business', 5400, 4.7, false, true),
  ('Vehicle Sale Agreement', 'Complete bill of sale template for private vehicle transactions.', 'automotive', 4200, 4.8, false, true),
  ('Student Enrollment Form', 'Educational institution enrollment and registration template.', 'education', 3800, 4.5, false, true),
  ('Power of Attorney', 'Legal document granting authority to act on someones behalf.', 'legal', 6800, 4.9, true, true),
  ('Employee Onboarding Checklist', 'Comprehensive checklist for new employee orientation and setup.', 'hr', 4500, 4.6, false, true),
  ('Commercial Lease Agreement', 'Professional commercial property lease with business-specific terms.', 'real-estate', 5100, 4.7, false, true)
ON CONFLICT DO NOTHING;
