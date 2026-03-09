-- =====================================================
-- ENHANCED SEED DATA for QufieAI
-- Run this in Supabase SQL Editor after schema.sql
-- Includes rich details like transfers, appointments, tool calls
-- =====================================================

-- Clear existing data
DELETE FROM calls;
DELETE FROM conversations;
DELETE FROM contacts;
DELETE FROM agent_teams;
DELETE FROM organizations;

-- Insert Organization
INSERT INTO organizations (id, name, vapi_phone_number_id, vapi_assistant_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'QufieAI Real Estate', 'your-vapi-phone-number-id', 'your-vapi-assistant-id');

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
  );

-- Insert Sample Contacts with rich data
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
  value,
  last_contact_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'Max Planck',
    'max.planck@caltech.edu',
    '+1 (650) 669-1427',
    'Caltech',
    'human',
    'active',
    'Buyer',
    'Website Inquiry',
    650000,
    NOW() - INTERVAL '11 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'Richard Feynman',
    'richard@example.com',
    '+1 (650) 518-1788',
    'Caltech',
    'ai',
    'active',
    'Buyer',
    'Website',
    450000,
    NOW() - INTERVAL '43 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000012',
    'Marie Curie',
    'marie@sorbonne.fr',
    '+44 7772 327658',
    'Sorbonne University',
    'human',
    'active',
    'Investor',
    'Referral',
    850000,
    NOW() - INTERVAL '2 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'Albert Einstein',
    'albert@princeton.edu',
    '+1 (650) 518-1788',
    'Princeton',
    'ai',
    'pending',
    'Seller',
    'Cold Call',
    0,
    NOW() - INTERVAL '44 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000105',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000012',
    'Niels Bohr',
    'niels@copenhagen.dk',
    '+1 (650) 679-4960',
    'University of Copenhagen',
    'human',
    'pending',
    'Buyer',
    'Partner Referral',
    0,
    NOW() - INTERVAL '1 hour'
  ),
  (
    '00000000-0000-0000-0000-000000000106',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000012',
    'Ernest Rutherford',
    'ernest@cambridge.ac.uk',
    '+44 1865 270000',
    'Cambridge University',
    'ai',
    'pending',
    'Buyer',
    'Website',
    0,
    NOW() - INTERVAL '1 hour'
  );

-- Insert Rich Call Data
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
  transfer_to_number,
  transfer_to_name,
  transfer_reason,
  warm_transfer_sms_sent,
  warm_transfer_sms_content,
  recording_url,
  tool_calls_json,
  started_at,
  ended_at
)
VALUES
  -- Call 1: Max Planck - Successful transfer with appointment
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000012',
    'vapi_call_maxplanck_001',
    'outbound',
    '+1 (650) 669-1427',
    '+1 (650) 669-1427',
    'completed',
    180,
    'AI: Hello, this is Sarah from QufeiAI Real Estate. Am I speaking with Max?
Max: Yes, this is Max.
AI: Great! I''m calling about your inquiry regarding HVAC systems for solar solutions. Are you still interested?
Max: Yes, absolutely! Our heating costs have been really high lately.
AI: I understand. Can you tell me about your current setup? Do you live in a single-family home?
Max: Yes, we have a single-family home with central heating.
AI: Perfect. And who would be the decision maker for this installation?
Max: It would be both me and my wife.
AI: Excellent. How many people live in the household?
Max: Four of us.
AI: I see. When would you ideally like to have the new system installed?
Max: As soon as possible, preferably within the next week. Maybe 8 AM tomorrow?
AI: That''s quite urgent! Let me transfer you to one of our specialists who can discuss the options and provide you with an initial quote.',
    'Max sought a quote from Solar Solutions for a new HVAC system due to heating costs. He confirmed living in a single-family home with central heating, and the ownership with his wife. They are a household of four, and Max expressed urgency for installation preferably within 8 AM the following day. Solar Solutions adviser to discuss options and receive an initial quote.',
    'Appointment booked for Dec 02, 2024 at 08:00. Transfer successful to Agent John Smith.',
    'Very Positive',
    'ai',
    'AI Agent Sarah',
    true,
    '+1 (555) 789-0123',
    'Agent John Smith',
    'Customer needs HVAC system quote urgently',
    true,
    'Incoming call from Max Planck regarding HVAC system quote. Customer is ready to discuss installation options.',
    'https://recordings.vapi.ai/maxplanck-001.mp3',
    '[
      {"tool": "calendar_booking", "action": "Booked appointment for Dec 02, 2024 at 08:00", "success": true},
      {"tool": "sms_notification", "action": "Sent confirmation SMS to customer", "success": true}
    ]',
    NOW() - INTERVAL '11 minutes',
    NOW() - INTERVAL '8 minutes'
  ),

  -- Call 2: Richard Feynman - Transfer attempted but failed
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000011',
    'vapi_call_feynman_001',
    'outbound',
    '+1 (650) 518-1788',
    '+1 (650) 518-1788',
    'completed',
    120,
    'AI: Hello, this is calling from QufeiAI Real Estate. May I speak with Richard?
Richard: Speaking.
AI: Hi Richard! I noticed you showed interest in our downtown properties. Are you still looking?
Richard: Yes, I''d like to know more about available listings.
AI: Wonderful! Let me get you some information. What''s your budget range?
Richard: Around $450,000.
AI: Great! We have several options in that range. Let me try to connect you with an agent who can show you our current inventory.',
    'Brief conversation about property inquiry. Contact showed interest in viewing available listings.',
    'Attempted transfer to Agent Sarah Johnson but agent was unavailable. Follow-up scheduled.',
    'Positive',
    'ai',
    'AI Agent Mike',
    true,
    '+1 (555) 456-7890',
    'Agent Sarah Johnson',
    'Property viewing inquiry',
    true,
    'Incoming call from Richard Feynman regarding property viewing inquiry.',
    'https://recordings.vapi.ai/feynman-001.mp3',
    '[]',
    NOW() - INTERVAL '43 minutes',
    NOW() - INTERVAL '41 minutes'
  ),

  -- Call 3: Albert Einstein - Not reached
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000011',
    'vapi_call_einstein_001',
    'outbound',
    '+1 (650) 518-1788',
    '+1 (650) 518-1788',
    'no-answer',
    0,
    '',
    'No answer. Voicemail left.',
    'Left voicemail with callback information',
    'Neutral',
    'ai',
    'AI Agent Sarah',
    false,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    NULL,
    '[]',
    NOW() - INTERVAL '44 minutes',
    NOW() - INTERVAL '44 minutes'
  ),

  -- Call 4: Niels Bohr - Not reached
  (
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000105',
    '00000000-0000-0000-0000-000000000012',
    'vapi_call_bohr_001',
    'outbound',
    '+1 (650) 679-4960',
    '+1 (650) 679-4960',
    'no-answer',
    0,
    '',
    'No answer. Will retry later.',
    'No contact made',
    'Neutral',
    'human',
    'John Davis',
    false,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    NULL,
    '[]',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour'
  ),

  -- Call 5: Ernest Rutherford - Not reached
  (
    '00000000-0000-0000-0000-000000000205',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000106',
    '00000000-0000-0000-0000-000000000012',
    'vapi_call_rutherford_001',
    'outbound',
    '+44 1865 270000',
    '+44 1865 270000',
    'no-answer',
    0,
    '',
    'No answer.',
    'No contact made',
    'Neutral',
    'ai',
    'AI Agent Mike',
    false,
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    NULL,
    '[]',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour'
  ),

  -- Call 6: Marie Curie - Successful with appointment and transfer
  (
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000012',
    'vapi_call_curie_001',
    'outbound',
    '+44 7772 327658',
    '+44 7772 327658',
    'completed',
    240,
    'AI: Good afternoon, may I speak with Marie?
Marie: Yes, this is Marie.
AI: Hello Marie! This is calling from QufeiAI Real Estate. I understand you''re interested in real estate investment opportunities?
Marie: Yes, I''ve been looking at some properties for investment.
AI: Excellent! What type of properties are you most interested in?
Marie: I''m looking at multi-family units, possibly apartment buildings.
AI: Great choice! We have several investment properties that might interest you. What''s your investment budget?
Marie: Around $800,000 to $900,000.
AI: Perfect. I''d like to connect you with one of our investment specialists who can provide detailed information about our current portfolio.',
    'Discussed investment opportunities in real estate. Contact requested more information about multi-family properties and apartment buildings.',
    'Viewing scheduled for Dec 05, 2024 at 14:00. Transfer successful to David Miller.',
    'Very Positive',
    'human',
    'Sarah Chen',
    true,
    '+44 7911 123456',
    'Agent David Miller',
    'Real estate investment inquiry',
    true,
    'Incoming call from Marie Curie regarding real estate investment opportunities. High priority client.',
    'https://recordings.vapi.ai/curie-001.mp3',
    '[
      {"tool": "calendar_booking", "action": "Booked appointment for Dec 05, 2024 at 14:00", "success": true},
      {"tool": "crm_lead", "action": "Created lead in Salesforce", "success": true}
    ]',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 hour 56 minutes'
  );

-- Insert Conversations (using ON CONFLICT to update existing)
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
    '00000000-0000-0000-0000-000000000012',
    'active',
    'human',
    'Agent John Smith',
    'Appointment booked for Dec 02, 2024 at 08:00. Transfer successful to Agent John Smith.',
    'call',
    NOW() - INTERVAL '8 minutes',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000011',
    'pending',
    'ai',
    'AI Agent Mike',
    'Attempted transfer to Agent Sarah Johnson but agent was unavailable. Follow-up scheduled.',
    'call',
    NOW() - INTERVAL '41 minutes',
    0
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000012',
    'active',
    'human',
    'Agent David Miller',
    'Viewing scheduled for Dec 05, 2024 at 14:00. Transfer successful to David Miller.',
    'call',
    NOW() - INTERVAL '1 hour 56 minutes',
    1
  )
ON CONFLICT (contact_id) DO UPDATE SET
  status = EXCLUDED.status,
  current_handler_type = EXCLUDED.current_handler_type,
  current_handler_name = EXCLUDED.current_handler_name,
  last_message_content = EXCLUDED.last_message_content,
  last_message_type = EXCLUDED.last_message_type,
  last_message_at = EXCLUDED.last_message_at,
  unread_count = EXCLUDED.unread_count;

-- Success message
SELECT
  'Enhanced seed data inserted successfully!' as message,
  (SELECT COUNT(*) FROM organizations) as organizations,
  (SELECT COUNT(*) FROM agent_teams) as agent_teams,
  (SELECT COUNT(*) FROM contacts) as contacts,
  (SELECT COUNT(*) FROM calls) as calls,
  (SELECT COUNT(*) FROM conversations) as conversations;
