-- Enable Realtime for Dashboard Live Updates
-- Run this in your Supabase SQL Editor to enable real-time notifications

-- =============================================
-- 1. ENABLE REALTIME ON TABLES
-- This allows Supabase Realtime to broadcast changes
-- =============================================

-- Enable realtime for notifications table
-- This allows instant dashboard notifications when someone signs
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable realtime for signing_requests table
-- This allows live updates when signer status changes
ALTER PUBLICATION supabase_realtime ADD TABLE signing_requests;

-- Enable realtime for signature_records table (optional - for audit trail)
ALTER PUBLICATION supabase_realtime ADD TABLE signature_records;

-- =============================================
-- 2. ADD UPDATED_AT TRIGGER FOR SIGNING_REQUESTS
-- Ensures updated_at is always current
-- =============================================

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to signing_requests if not exists
DROP TRIGGER IF EXISTS update_signing_requests_updated_at ON signing_requests;
CREATE TRIGGER update_signing_requests_updated_at
    BEFORE UPDATE ON signing_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 3. CREATE REALTIME NOTIFICATION HELPER FUNCTION
-- Optional: Call this function to send instant notifications
-- =============================================

CREATE OR REPLACE FUNCTION notify_document_signed(
    p_user_id TEXT,
    p_document_id UUID,
    p_document_name TEXT,
    p_signer_name TEXT,
    p_signer_email TEXT,
    p_signed_count INT,
    p_total_signers INT
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_is_complete BOOLEAN;
BEGIN
    v_is_complete := p_signed_count = p_total_signers;

    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        document_id,
        document_name,
        signer_name,
        signer_email,
        metadata,
        is_read,
        created_at
    ) VALUES (
        p_user_id,
        CASE WHEN v_is_complete THEN 'document_completed' ELSE 'document_signed' END,
        CASE WHEN v_is_complete
            THEN 'Document Completed!'
            ELSE p_signer_name || ' signed your document'
        END,
        CASE WHEN v_is_complete
            THEN 'All ' || p_total_signers || ' signers have completed signing "' || p_document_name || '". Your document is ready!'
            ELSE p_signer_name || ' (' || p_signer_email || ') has signed "' || p_document_name || '". ' || p_signed_count || '/' || p_total_signers || ' signatures complete.'
        END,
        p_document_id,
        p_document_name,
        p_signer_name,
        p_signer_email,
        jsonb_build_object(
            'signedAt', NOW(),
            'signedCount', p_signed_count,
            'totalSigners', p_total_signers,
            'isComplete', v_is_complete
        ),
        false,
        NOW()
    ) RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE notifications IS 'Dashboard notifications for real-time updates when signers sign documents';
COMMENT ON COLUMN notifications.type IS 'Notification type: document_signed, document_completed, document_viewed, document_declined, reminder_sent';
COMMENT ON COLUMN notifications.metadata IS 'Additional data like signedCount, totalSigners, IP address, etc.';
