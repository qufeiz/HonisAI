-- =====================================================
-- SEED DATA for QufeiAI
-- Run this in Supabase SQL Editor after schema.sql
-- =====================================================

-- Insert Organization
INSERT INTO organizations (id, name, vapi_phone_number_id, vapi_assistant_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'QufeiAI Real Estate', 'your-vapi-phone-number-id', 'your-vapi-assistant-id')
ON CONFLICT (id) DO NOTHING;

-- Insert Agent Teams
INSERT INTO agent_teams (
  id,
  organization_id,
  name,
  phone_number,
  vapi_phone_number_id,
  vapi_assistant_id,
  transfer_enabled,
  human_agent_name,
  human_agent_phone,
  warm_transfer_sms_template
)
VALUES
  (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'Real Estate Team A',
    '+1 (650) 518-1788',
    'your-vapi-phone-number-id',
    'your-vapi-assistant-id',
    true,
    'Sarah Johnson',
    '+1 (555) 456-7890',
    'Incoming call from {{contact_name}} regarding {{reason}}. Customer is ready to discuss options.'
  ),
  (
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'Real Estate Team B',
    '+1 (650) 669-1427',
    'your-vapi-phone-number-id-2',
    'your-vapi-assistant-id-2',
    true,
    'Mike Chen',
    '+1 (555) 789-0123',
    'Incoming call from {{contact_name}} regarding {{reason}}.'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Contacts
INSERT INTO contacts (
  id,
  organization_id,
  agent_team_id,
  name,
  email,
  phone,
  company,
  assigned_to_type,
  status,
  contact_type,
  source,
  value
)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'Richard Feynman',
    'richard@example.com',
    '+1 (555) 123-4567',
    'Caltech',
    'ai',
    'active',
    'Buyer',
    'Website',
    450000
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'James Maxwell',
    'james@example.com',
    '+1 (555) 234-5678',
    'Cambridge University',
    'ai',
    'pending',
    'Seller',
    'Referral',
    320000
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000012',
    'Marie Curie',
    'marie@example.com',
    '+1 (555) 345-6789',
    'Sorbonne',
    'ai',
    'completed',
    'Buyer',
    'Cold Call',
    280000
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Calls
INSERT INTO calls (
  id,
  organization_id,
  contact_id,
  agent_team_id,
  vapi_call_id,
  direction,
  from_number,
  to_number,
  status,
  duration,
  transcript,
  call_summary,
  outcome,
  sentiment,
  handled_by_type,
  handled_by_name,
  transferred,
  started_at,
  ended_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000011',
    'vapi_call_001',
    'outbound',
    '+1 (650) 518-1788',
    '+1 (555) 123-4567',
    'completed',
    154,
    'AI: Hello, this is calling from QufeiAI regarding your property inquiry. Are you still interested in the downtown condo?\nRichard: Yes, I am! I''d love to know more about it.\nAI: Great! The property features 2 bedrooms, 2 bathrooms, and includes parking. Would you like to schedule a viewing?',
    'AI successfully engaged with lead, provided initial property information and confirmed interest.',
    'Lead confirmed interest, requested more details',
    'Positive',
    'ai',
    'Inbound Call Agent',
    false,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours' + INTERVAL '154 seconds'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000011',
    'vapi_call_002',
    'inbound',
    '+1 (555) 123-4567',
    '+1 (650) 518-1788',
    'completed',
    225,
    'Richard: Hi, I have some questions about the condo.\nAI: Of course! I''d be happy to help. What would you like to know?\nRichard: What are the HOA fees and is parking included?\nAI: Let me transfer you to a specialist who can provide detailed information.',
    'Lead asked detailed questions about HOA fees, parking availability, and in-unit amenities. Expressed strong interest.',
    'Transferred to human agent for detailed discussion',
    'Very Positive',
    'ai',
    'Inbound Call Agent',
    true,
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour' + INTERVAL '225 seconds'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000011',
    'vapi_call_003',
    'outbound',
    '+1 (650) 518-1788',
    '+1 (555) 234-5678',
    'completed',
    72,
    'AI: Hello James, this is calling from QufeiAI. We noticed you inquired about our properties.\nJames: Oh yes, but I''m busy right now. Can you call back later?',
    'Reached out to lead, introduced services. Lead expressed mild interest but requested callback later.',
    'Callback requested for next week',
    'Neutral',
    'ai',
    'Outbound Call Agent',
    false,
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '30 minutes' + INTERVAL '72 seconds'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Conversations (auto-created from calls via trigger)
-- These will be created automatically by the trigger, but we can also insert manually
INSERT INTO conversations (
  id,
  organization_id,
  contact_id,
  agent_team_id,
  status,
  current_handler_type,
  current_handler_name,
  last_message_content,
  last_message_type,
  last_message_at,
  unread_count
)
VALUES
  (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000011',
    'active',
    'ai',
    'Inbound Call Agent',
    'Transferred to human agent for detailed discussion',
    'call',
    NOW() - INTERVAL '1 hour',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000011',
    'pending',
    'ai',
    'Outbound Call Agent',
    'Callback requested for next week',
    'call',
    NOW() - INTERVAL '30 minutes',
    0
  )
ON CONFLICT (contact_id) DO UPDATE SET
  last_message_content = EXCLUDED.last_message_content,
  last_message_at = EXCLUDED.last_message_at,
  unread_count = EXCLUDED.unread_count;

-- Success message
SELECT
  'Seed data inserted successfully!' as message,
  (SELECT COUNT(*) FROM organizations) as organizations,
  (SELECT COUNT(*) FROM agent_teams) as agent_teams,
  (SELECT COUNT(*) FROM contacts) as contacts,
  (SELECT COUNT(*) FROM calls) as calls,
  (SELECT COUNT(*) FROM conversations) as conversations;
