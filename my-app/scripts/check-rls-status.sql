-- Check RLS status on all tables
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'organizations',
    'users',
    'agent_teams',
    'contacts',
    'calls',
    'messages',
    'conversations',
    'campaigns',
    'campaign_contacts',
    'notifications'
  )
ORDER BY tablename;
