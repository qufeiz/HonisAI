import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpjzfydwtxagyotrzdwy.supabase.co';
const supabaseKey = 'sb_publishable__zkVH3tVvEG2u3BeXRwtLw_t5VtLWen';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Test basic connection
  const { data, error } = await supabase
    .from('organizations')
    .select('count')
    .limit(1);

  if (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n📝 Next steps:');
    console.log('1. Go to: https://bpjzfydwtxagyotrzdwy.supabase.co');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy contents of supabase/schema.sql');
    console.log('4. Paste and run in SQL Editor');
  } else {
    console.log('✅ Connection successful!');
    console.log('✅ Database tables exist!');

    // Check if we have any data
    const { data: orgs } = await supabase.from('organizations').select('*');
    console.log(`\n📊 Organizations: ${orgs?.length || 0}`);

    const { data: contacts } = await supabase.from('contacts').select('*');
    console.log(`📊 Contacts: ${contacts?.length || 0}`);

    const { data: calls } = await supabase.from('calls').select('*');
    console.log(`📊 Calls: ${calls?.length || 0}`);
  }
}

testConnection();
