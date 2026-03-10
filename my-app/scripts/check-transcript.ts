import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTranscript() {
  const { data, error } = await supabase
    .from('calls')
    .select('id, vapi_call_id, transcript, call_summary, duration, started_at, ended_at')
    .eq('vapi_call_id', '019cd50e-721b-766d-aea7-2fdaa50e2bb8')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n=== CALL DETAILS ===');
  console.log('ID:', data.id);
  console.log('Vapi Call ID:', data.vapi_call_id);
  console.log('Duration:', data.duration, 'seconds');
  console.log('Started:', data.started_at);
  console.log('Ended:', data.ended_at);
  console.log('\n=== SUMMARY ===');
  console.log(data.call_summary || 'No summary');
  console.log('\n=== TRANSCRIPT ===');
  console.log(data.transcript || 'No transcript captured');
}

checkTranscript();
