-- =====================================================
-- Add Enhanced Columns for Rich Call Data
-- Run this in Supabase SQL Editor BEFORE seed-data-enhanced.sql
-- =====================================================

-- Add missing columns to calls table
ALTER TABLE calls
  ADD COLUMN IF NOT EXISTS warm_transfer_sms_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS warm_transfer_sms_content TEXT,
  ADD COLUMN IF NOT EXISTS tool_calls_json JSONB DEFAULT '[]'::jsonb;

-- Rename columns to match seed data expectations
ALTER TABLE calls
  RENAME COLUMN transferred_to TO transfer_to_number;

ALTER TABLE calls
  RENAME COLUMN transferred_to_name TO transfer_to_name;

-- Add comment
COMMENT ON COLUMN calls.tool_calls_json IS 'JSON array of tool calls made during the call (calendar_booking, sms_notification, etc.)';
COMMENT ON COLUMN calls.warm_transfer_sms_sent IS 'Whether a warm transfer SMS was sent to the human agent';
COMMENT ON COLUMN calls.warm_transfer_sms_content IS 'Content of the warm transfer SMS';

SELECT 'Enhanced columns added successfully!' as message;
