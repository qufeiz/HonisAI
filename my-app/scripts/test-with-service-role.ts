import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testWithServiceRole() {
  console.log('Testing with Service Role (bypasses RLS)...\n');

  // Test organizations
  const { data: orgs, error: orgError } = await supabase
    .from('organizations')
    .select('*');

  if (orgError) {
    console.error('❌ Error fetching organizations:', orgError.message);
  } else {
    console.log('✅ Organizations:', orgs.length);
    if (orgs.length > 0) {
      console.log('   First org:', orgs[0].name);
    }
  }

  // Test contacts
  const { data: contacts, error: contactError } = await supabase
    .from('contacts')
    .select('*');

  if (contactError) {
    console.error('❌ Error fetching contacts:', contactError.message);
  } else {
    console.log('✅ Contacts:', contacts.length);
    if (contacts.length > 0) {
      contacts.forEach(c => console.log(`   - ${c.name} (${c.phone})`));
    }
  }

  // Test calls
  const { data: calls, error: callError } = await supabase
    .from('calls')
    .select('*');

  if (callError) {
    console.error('❌ Error fetching calls:', callError.message);
  } else {
    console.log('✅ Calls:', calls.length);
  }

  // Test conversations
  const { data: conversations, error: convError } = await supabase
    .from('conversations')
    .select('*');

  if (convError) {
    console.error('❌ Error fetching conversations:', convError.message);
  } else {
    console.log('✅ Conversations:', conversations.length);
  }

  // Test agent teams
  const { data: teams, error: teamError } = await supabase
    .from('agent_teams')
    .select('*');

  if (teamError) {
    console.error('❌ Error fetching agent teams:', teamError.message);
  } else {
    console.log('✅ Agent Teams:', teams.length);
    if (teams.length > 0) {
      teams.forEach(t => console.log(`   - ${t.name} (${t.phone_number})`));
    }
  }
}

testWithServiceRole();
