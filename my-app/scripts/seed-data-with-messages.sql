-- =====================================================
-- ADD SMS AND EMAIL MESSAGES TO CREATE RICH TIMELINES
-- Run this AFTER seed-data-enhanced.sql
-- =====================================================

-- Insert SMS and Email messages to create rich conversation timelines

-- Richard Feynman's timeline (contact_id: 00000000-0000-0000-0000-000000000102)
-- Already has 1 call, now adding SMS messages
INSERT INTO messages (
  id,
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
  -- SMS 1: AI sends property link
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    'sms',
    'outbound',
    '+1 (650) 518-1788',
    '+1 (555) 123-4567',
    'Thanks for your interest! Here''s the property listing link: https://example.com/listing/123',
    'ai',
    'SMS Reply Bot',
    NOW() - INTERVAL '35 minutes'
  ),
  -- SMS 2: Human replies with urgency
  (
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000102',
    'sms',
    'inbound',
    '+1 (555) 123-4567',
    '+1 (650) 518-1788',
    'This looks great! I''d love to schedule a viewing. I need to move in by next week!',
    'ai',
    'SMS Reply Bot',
    NOW() - INTERVAL '31 minutes'
  );

-- Max Planck's timeline (contact_id: 00000000-0000-0000-0000-000000000101)
-- Already has 1 call with transfer, now adding confirmation SMS
INSERT INTO messages (
  id,
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
  -- SMS: Appointment confirmation
  (
    '00000000-0000-0000-0000-000000000403',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'sms',
    'outbound',
    '+1 (650) 669-1427',
    '+1 (650) 669-1427',
    'Your HVAC consultation is confirmed for Dec 02, 2024 at 08:00 AM. Agent John Smith will call you. Reply CONFIRM to acknowledge.',
    'ai',
    'Appointment Bot',
    NOW() - INTERVAL '7 minutes'
  ),
  -- SMS: Customer confirms
  (
    '00000000-0000-0000-0000-000000000404',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'sms',
    'inbound',
    '+1 (650) 669-1427',
    '+1 (650) 669-1427',
    'CONFIRM',
    'ai',
    'Appointment Bot',
    NOW() - INTERVAL '5 minutes'
  );

-- Marie Curie's timeline (contact_id: 00000000-0000-0000-0000-000000000103)
-- Already has 1 call with transfer, now adding follow-up email
INSERT INTO messages (
  id,
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
  -- Email: Investment portfolio
  (
    '00000000-0000-0000-0000-000000000405',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    'email',
    'outbound',
    'investments@qufieai.com',
    'marie@sorbonne.fr',
    'Investment Portfolio - Multi-Family Properties',
    'Dear Marie,

Thank you for your interest in our investment properties. Based on our conversation, I''ve compiled a list of multi-family units in your budget range ($800K-$900K):

1. 4-Unit Apartment Building - Downtown - $850K
2. 6-Unit Complex - Midtown - $875K
3. Mixed-Use Property - Arts District - $820K

All properties have strong rental histories and excellent ROI potential.

Looking forward to our viewing on Dec 05, 2024 at 14:00.

Best regards,
David Miller
Investment Specialist',
    'human',
    'David Miller',
    NOW() - INTERVAL '1 hour 45 minutes'
  ),
  -- Email: Customer reply
  (
    '00000000-0000-0000-0000-000000000406',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    'email',
    'inbound',
    'marie@sorbonne.fr',
    'investments@qufieai.com',
    'Re: Investment Portfolio - Multi-Family Properties',
    'David,

Thank you for the detailed information. The 6-Unit Complex in Midtown looks particularly interesting. Could you send me the financial analysis and rental income history?

I''m very excited about our meeting on Dec 5th.

Best,
Marie',
    'human',
    'David Miller',
    NOW() - INTERVAL '1 hour 30 minutes'
  );

-- Success message
SELECT
  'Messages inserted successfully!' as message,
  (SELECT COUNT(*) FROM messages) as total_messages,
  (SELECT COUNT(*) FROM messages WHERE type = 'sms') as sms_count,
  (SELECT COUNT(*) FROM messages WHERE type = 'email') as email_count;
