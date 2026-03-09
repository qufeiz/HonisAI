-- =====================================================
-- REALISTIC SEED DATA for QufieAI Real Estate
-- Run this in Supabase SQL Editor
-- Includes proper call flows: AI call → Transfer → Human call
-- =====================================================

-- Clear existing data
DELETE FROM messages;
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
    'vapi-phone-1',
    'vapi-assistant-1',
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
    'vapi-phone-2',
    'vapi-assistant-2',
    true,
    'John Smith',
    '+1 (555) 789-0123',
    'Incoming call from {{contact_name}} regarding {{reason}}.'
  );

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
  value,
  last_contact_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'Richard Feynman',
    'richard@caltech.edu',
    '+1 (555) 123-4567',
    'Caltech',
    'human',
    'active',
    'Buyer',
    'Website Inquiry',
    450000,
    NOW() - INTERVAL '10 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000012',
    'Max Planck',
    'max@physics.de',
    '+1 (650) 669-1427',
    'Physics Institute',
    'human',
    'active',
    'Buyer',
    'Phone Call',
    650000,
    NOW() - INTERVAL '11 minutes'
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
  );

-- =====================================================
-- RICHARD FEYNMAN - Complete flow with transfer
-- AI call → Transfer → Human call + SMS + Notification
-- =====================================================

-- Call 1: Initial AI outbound call
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
  recording_url,
  tool_calls_json,
  started_at,
  ended_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000011',
    'vapi_feynman_call1',
    'outbound',
    '+1 (650) 518-1788',
    '+1 (555) 123-4567',
    'completed',
    154,
    'AI: Hello, this is calling from QufieAI Real Estate. Am I speaking with Richard?
Richard: Yes, this is Richard.
AI: Great! I saw you inquired about our downtown condo listing on our website. Are you still interested?
Richard: Yes, absolutely! I''d love to know more about it.
AI: Wonderful! The property is a 2-bedroom, 2-bathroom condo with downtown views. What''s your timeline for moving?
Richard: I need to move in within the next few weeks, ideally.
AI: That''s great timing! This unit is available immediately. Do you have any specific questions about the property?
Richard: Yes, what are the HOA fees and is parking included?
AI: Those are great questions. Let me connect you with one of our specialists who can provide all the financial details.',
    'AI successfully engaged with lead about downtown condo. Lead confirmed interest and has urgent timeline (few weeks). Asked specific questions about HOA fees and parking.',
    'Lead confirmed interest, requested detailed property information',
    'Very Positive',
    'ai',
    'AI Agent (Inbound)',
    false,
    'https://recordings.vapi.ai/feynman-001.mp3',
    '[]',
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '27 minutes 26 seconds'
  );

-- Call 2: Inbound call after AI engagement
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
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000011',
    'vapi_feynman_call2',
    'inbound',
    '+1 (555) 123-4567',
    '+1 (650) 518-1788',
    'completed',
    225,
    'Richard: Hi, I have some questions about the downtown condo.
AI: Of course! I''d be happy to help. What would you like to know?
Richard: Can you tell me more about the HOA fees and parking situation?
AI: The HOA fees are $350/month and include water, trash, and building maintenance. Parking - let me get you exact details from our specialist.
Richard: Also, what floor is it on and does it have a balcony?
AI: Great questions! This is important information. Let me transfer you to Sarah Johnson who can give you all the details and even schedule a viewing if you''d like.',
    'Lead called back with detailed questions about HOA fees ($350/month mentioned), parking, floor level, and balcony. Showed strong purchase intent.',
    'Transferred to human agent Sarah Johnson for detailed discussion and viewing scheduling',
    'Very Positive',
    'ai',
    'AI Agent (Inbound)',
    true,
    '+1 (555) 456-7890',
    'Sarah Johnson',
    'Qualified lead with detailed property questions and strong purchase intent',
    true,
    'Incoming call from Richard Feynman regarding downtown condo. Customer asking about HOA fees, parking, floor level, and balcony. Strong purchase intent - ready to schedule viewing.',
    'https://recordings.vapi.ai/feynman-002.mp3',
    '[]',
    NOW() - INTERVAL '18 minutes',
    NOW() - INTERVAL '14 minutes 15 seconds'
  );

-- Call 3: Human agent call after transfer
INSERT INTO calls (
  id,
  organization_id,
  contact_id,
  agent_team_id,
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
  recording_url,
  tool_calls_json,
  started_at,
  ended_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000011',
    'outbound',
    '+1 (555) 456-7890',
    '+1 (555) 123-4567',
    'completed',
    420,
    'Sarah: Hi Richard, this is Sarah Johnson from QufieAI Real Estate. I understand you have questions about our downtown condo?
Richard: Yes! Thanks for calling back.
Sarah: Of course! So the unit is on the 12th floor with a beautiful balcony overlooking the city. HOA is $350/month covering water, trash, maintenance, and gym access. You get one assigned parking spot plus guest parking.
Richard: That sounds perfect! When can I see it?
Sarah: I have availability tomorrow at 2pm or Thursday at 10am. Which works better?
Richard: Tomorrow at 2pm works great!
Sarah: Perfect! I''ll send you a confirmation text with the address and my contact info.',
    'Human agent provided detailed property information: 12th floor, balcony with city views, $350/month HOA (includes gym), assigned parking + guest parking. Scheduled viewing for tomorrow at 2pm.',
    'Viewing scheduled for tomorrow at 2:00 PM',
    'Very Positive',
    'human',
    'Sarah Johnson',
    false,
    NULL,
    '[
      {"tool": "calendar_booking", "action": "Booked viewing for tomorrow at 2:00 PM", "success": true},
      {"tool": "sms_notification", "action": "Sent viewing confirmation SMS", "success": true}
    ]',
    NOW() - INTERVAL '14 minutes',
    NOW() - INTERVAL '7 minutes'
  );

-- SMS Messages for Richard Feynman
INSERT INTO messages (
  organization_id,
  contact_id,
  type,
  direction,
  from_address,
  to_address,
  content,
  handled_by_type,
  handled_by_name,
  created_at
)
VALUES
  -- SMS 1: AI sends property link after first call
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'sms',
    'outbound',
    '+1 (650) 518-1788',
    '+1 (555) 123-4567',
    'Thanks for your interest in our downtown condo! Here''s the full listing: https://qufieai.com/properties/downtown-condo-2br

2BR/2BA | $450,000 | Downtown
- Immediate availability
- Building amenities included
- Virtual tour available

Reply with questions anytime!',
    'ai',
    'SMS Bot',
    NOW() - INTERVAL '26 minutes'
  ),
  -- SMS 2: Human replies
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'sms',
    'inbound',
    '+1 (555) 123-4567',
    '+1 (650) 518-1788',
    'This looks great! Calling now to ask some questions.',
    'ai',
    'SMS Bot',
    NOW() - INTERVAL '19 minutes'
  ),
  -- SMS 3: Viewing confirmation from Sarah
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'sms',
    'outbound',
    '+1 (555) 456-7890',
    '+1 (555) 123-4567',
    'Hi Richard! Your viewing is confirmed for tomorrow at 2:00 PM.

📍 Address: 123 Downtown Plaza, Unit 1205
🏢 12th Floor | City View Balcony
🅿️ Parking: Guest parking available in visitor lot

I''ll meet you in the lobby. My cell: +1 (555) 456-7890

- Sarah Johnson, QufieAI Real Estate',
    'human',
    'Sarah Johnson',
    NOW() - INTERVAL '6 minutes'
  ),
  -- SMS 4: Customer confirms
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'sms',
    'inbound',
    '+1 (555) 123-4567',
    '+1 (555) 456-7890',
    'Perfect! See you tomorrow at 2. Thanks!',
    'human',
    'Sarah Johnson',
    NOW() - INTERVAL '5 minutes'
  );

-- =====================================================
-- MAX PLANCK - Successful transfer with appointment
-- AI call → Transfer → Human call
-- =====================================================

-- Call 1: AI outbound call
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
  started_at,
  ended_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000012',
    'vapi_planck_call1',
    'outbound',
    '+1 (650) 669-1427',
    '+1 (650) 669-1427',
    'completed',
    180,
    'AI: Hello, may I speak with Max?
Max: Yes, speaking.
AI: Hi Max! This is calling from QufieAI Real Estate. I saw you called us earlier about luxury properties in the $600-700K range. Is now a good time?
Max: Yes, perfect timing actually!
AI: Great! We have several excellent options. Are you looking for a single-family home or would you consider a townhouse?
Max: Preferably single-family, 3+ bedrooms.
AI: Perfect! We have a beautiful 4-bedroom in the suburbs, just listed. Would you like to discuss details with one of our senior agents?
Max: Yes, that would be great.',
    'AI engaged lead about luxury properties. Lead confirmed interest in single-family homes, 3+ bedrooms, $600-700K range. Ready for detailed discussion.',
    'Transfer to senior agent John Smith for luxury property consultation',
    'Positive',
    'ai',
    'AI Agent (Outbound)',
    true,
    '+1 (555) 789-0123',
    'John Smith',
    'Qualified luxury buyer, 3+BR single-family home, $600-700K budget',
    true,
    'Incoming call from Max Planck regarding luxury single-family homes. Budget $600-700K, needs 3+ bedrooms. Qualified buyer ready for consultation.',
    'https://recordings.vapi.ai/planck-001.mp3',
    NOW() - INTERVAL '11 minutes',
    NOW() - INTERVAL '8 minutes'
  );

-- Call 2: Human agent follow-up
INSERT INTO calls (
  id,
  organization_id,
  contact_id,
  agent_team_id,
  direction,
  from_number,
  to_number,
  status,
  duration,
  call_summary,
  outcome,
  sentiment,
  handled_by_type,
  handled_by_name,
  recording_url,
  tool_calls_json,
  started_at,
  ended_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000205',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000012',
    'outbound',
    '+1 (555) 789-0123',
    '+1 (650) 669-1427',
    'completed',
    360,
    'John Smith discussed luxury property portfolio with Max. Presented 4BR/3BA single-family home at $675K with large backyard, modern kitchen, and excellent school district. Max very interested. Scheduled viewing for this Saturday at 10am.',
    'Viewing scheduled for Saturday December 2nd at 10:00 AM',
    'Very Positive',
    'human',
    'John Smith',
    NULL,
    '[
      {"tool": "calendar_booking", "action": "Booked viewing for Saturday Dec 2 at 10:00 AM", "success": true},
      {"tool": "email_send", "action": "Sent property details and viewing confirmation", "success": true}
    ]',
    NOW() - INTERVAL '7 minutes',
    NOW() - INTERVAL '1 minute'
  );

-- =====================================================
-- MARIE CURIE - Investment property inquiry
-- AI call → Transfer → Human call + Email
-- =====================================================

-- Call 1: AI handles investment inquiry
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
  started_at,
  ended_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000012',
    'vapi_curie_call1',
    'outbound',
    '+1 (650) 669-1427',
    '+44 7772 327658',
    'completed',
    210,
    'Investment property inquiry discussion. Lead interested in multi-family properties for investment purposes with budget around $850K.',
    'Transfer to investment specialist John Smith for portfolio review',
    'Very Positive',
    'ai',
    'AI Agent (Investment)',
    true,
    '+1 (555) 789-0123',
    'John Smith',
    'High-value investment client, multi-family properties, $850K budget',
    true,
    'Incoming call from Marie Curie regarding investment properties. Interested in multi-family units, $850K budget. High-value client - investment focused.',
    'https://recordings.vapi.ai/curie-001.mp3',
    NOW() - INTERVAL '2 hours 15 minutes',
    NOW() - INTERVAL '2 hours 11 minutes 30 seconds'
  );

-- Call 2: Investment specialist consultation
INSERT INTO calls (
  id,
  organization_id,
  contact_id,
  agent_team_id,
  direction,
  from_number,
  to_number,
  status,
  duration,
  call_summary,
  outcome,
  sentiment,
  handled_by_type,
  handled_by_name,
  tool_calls_json,
  started_at,
  ended_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000207',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000012',
    'outbound',
    '+1 (555) 789-0123',
    '+44 7772 327658',
    'completed',
    540,
    'John Smith provided investment consultation. Discussed 3 multi-family properties: 4-unit ($825K), 6-unit ($875K), and mixed-use ($850K). Reviewed ROI projections and rental income history. Marie requested financial analysis. Viewing scheduled for Thursday December 5th at 2pm.',
    'Viewing scheduled for Thursday December 5th at 2:00 PM. Financial analysis to be sent via email.',
    'Very Positive',
    'human',
    'John Smith',
    '[
      {"tool": "calendar_booking", "action": "Booked investment property tour for Dec 5 at 2:00 PM", "success": true},
      {"tool": "crm_lead", "action": "Created high-value investment lead in CRM", "success": true}
    ]',
    NOW() - INTERVAL '2 hours 10 minutes',
    NOW() - INTERVAL '2 hours 1 minute'
  );

-- Email for Marie Curie
INSERT INTO messages (
  organization_id,
  contact_id,
  type,
  direction,
  from_address,
  to_address,
  subject,
  content,
  handled_by_type,
  handled_by_name,
  created_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    'email',
    'outbound',
    'john.smith@qufieai.com',
    'marie@sorbonne.fr',
    'Investment Portfolio Analysis - Multi-Family Properties',
    'Dear Marie,

Thank you for speaking with me today about investment opportunities. As discussed, I''ve compiled detailed information on three excellent multi-family properties:

**Property 1: 4-Unit Apartment Building**
- Location: Downtown District
- Price: $825,000
- Current Annual Rental Income: $78,000
- ROI: 9.5%
- Built: 2015, Excellent condition

**Property 2: 6-Unit Complex**
- Location: Midtown
- Price: $875,000
- Current Annual Rental Income: $96,000
- ROI: 11%
- Built: 2018, Modern amenities

**Property 3: Mixed-Use Property**
- Location: Arts District
- Price: $850,000
- Retail + 3 Residential Units
- Current Annual Income: $88,000
- ROI: 10.4%

All properties include:
✓ Professional property management options
✓ Strong rental history (95%+ occupancy)
✓ Excellent appreciation potential
✓ Detailed financial projections attached

I''m looking forward to showing you these properties on Thursday, December 5th at 2:00 PM. We''ll tour all three locations.

Please let me know if you have any questions before our meeting.

Best regards,
John Smith
Investment Specialist, QufieAI Real Estate
(555) 789-0123',
    'human',
    'John Smith',
    NOW() - INTERVAL '1 hour 55 minutes'
  );

-- Insert Conversations
INSERT INTO conversations (
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
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000011',
    'active',
    'human',
    'Sarah Johnson',
    'Perfect! See you tomorrow at 2. Thanks!',
    'sms',
    NOW() - INTERVAL '5 minutes',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000012',
    'active',
    'human',
    'John Smith',
    'Viewing scheduled for Saturday December 2nd at 10:00 AM',
    'call',
    NOW() - INTERVAL '1 minute',
    0
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000012',
    'active',
    'human',
    'John Smith',
    'Viewing scheduled for Thursday December 5th at 2:00 PM. Financial analysis to be sent via email.',
    'call',
    NOW() - INTERVAL '2 hours 1 minute',
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
  'Realistic real estate seed data inserted!' as message,
  (SELECT COUNT(*) FROM contacts) as contacts,
  (SELECT COUNT(*) FROM calls) as calls,
  (SELECT COUNT(*) FROM messages) as messages,
  (SELECT COUNT(*) FROM conversations) as conversations;
