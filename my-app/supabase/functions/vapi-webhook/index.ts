import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log('Vapi webhook received:', JSON.stringify(payload, null, 2));

    const { message } = payload;

    switch (message.type) {
      case 'end-of-call-report':
        await handleEndOfCallReport(supabase, message);
        break;

      case 'function-call':
        return await handleFunctionCall(supabase, message);

      case 'status-update':
        await handleStatusUpdate(supabase, message);
        break;

      default:
        console.log('Unhandled message type:', message.type);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleEndOfCallReport(supabase: any, message: any) {
  console.log('Processing end-of-call-report');

  const call = message.call;
  const analysis = message.analysis;

  // Find or create contact based on phone number
  const customerPhone = call.customer?.number || call.phoneNumber;
  let contact = null;

  if (customerPhone) {
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('*')
      .eq('phone', customerPhone)
      .single();

    if (existingContact) {
      contact = existingContact;
    } else {
      // Create new contact
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .limit(1)
        .single();

      if (org) {
        const { data: newContact } = await supabase
          .from('contacts')
          .insert({
            organization_id: org.id,
            name: call.customer?.name || `Contact ${customerPhone}`,
            phone: customerPhone,
            status: 'active',
            assigned_to_type: 'ai',
          })
          .select()
          .single();

        contact = newContact;
      }
    }
  }

  // Insert call record
  if (contact) {
    const callData = {
      organization_id: contact.organization_id,
      contact_id: contact.id,
      vapi_call_id: call.id,
      vapi_assistant_id: call.assistantId,
      direction: call.type === 'inboundPhoneCall' ? 'inbound' : 'outbound',
      from_number: call.customer?.number || call.phoneNumber,
      to_number: call.phoneNumber,
      status: 'completed',
      duration: call.endedReason ? Math.floor((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000) : null,
      recording_url: call.recordingUrl,
      transcript: call.transcript,
      call_summary: analysis?.summary || call.summary,
      outcome: analysis?.structuredData?.outcome,
      sentiment: analysis?.structuredData?.sentiment || analysis?.successEvaluation,
      handled_by_type: 'ai',
      handled_by_name: call.assistant?.name || 'AI Agent',
      transferred: call.endedReason === 'transferred',
      started_at: call.startedAt,
      ended_at: call.endedAt,
      metadata: {
        cost: call.cost,
        endedReason: call.endedReason,
        messages: call.messages,
      },
    };

    const { data, error } = await supabase
      .from('calls')
      .insert(callData)
      .select()
      .single();

    if (error) {
      console.error('Error inserting call:', error);
    } else {
      console.log('Call saved successfully:', data.id);
    }

    // Update contact's last_contact_at
    await supabase
      .from('contacts')
      .update({ last_contact_at: new Date().toISOString() })
      .eq('id', contact.id);
  }
}

async function handleFunctionCall(supabase: any, message: any) {
  console.log('Processing function-call');

  const functionCall = message.functionCall;
  const call = message.call;

  switch (functionCall.name) {
    case 'lookup_contact':
      return await lookupContact(supabase, functionCall.parameters);

    case 'transfer_to_human':
      return await getHumanTransferNumber(supabase, call);

    case 'book_appointment':
      return await bookAppointment(supabase, functionCall.parameters, call);

    default:
      return new Response(
        JSON.stringify({
          result: { error: `Unknown function: ${functionCall.name}` },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
  }
}

async function lookupContact(supabase: any, parameters: any) {
  const { phone } = parameters;

  const { data: contact } = await supabase
    .from('contacts')
    .select('*, agent_teams(*), users(*)')
    .eq('phone', phone)
    .single();

  return new Response(
    JSON.stringify({
      result: {
        contact: contact || null,
        assigned_to_human: contact?.assigned_to_type === 'human',
        agent_team: contact?.agent_teams,
      },
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function getHumanTransferNumber(supabase: any, call: any) {
  // Look up the contact's assigned human agent
  const customerPhone = call.customer?.number || call.phoneNumber;

  const { data: contact } = await supabase
    .from('contacts')
    .select('*, agent_teams(*), users(*)')
    .eq('phone', customerPhone)
    .single();

  let transferNumber = null;

  if (contact?.assigned_to_user_id && contact.users?.phone) {
    transferNumber = contact.users.phone;
  } else if (contact?.agent_teams?.human_agent_phone) {
    transferNumber = contact.agent_teams.human_agent_phone;
  }

  return new Response(
    JSON.stringify({
      result: {
        transfer_number: transferNumber,
        agent_name: contact?.users?.full_name || contact?.agent_teams?.human_agent_name,
      },
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function bookAppointment(supabase: any, parameters: any, call: any) {
  // This is a placeholder - integrate with your calendar system
  console.log('Booking appointment:', parameters);

  return new Response(
    JSON.stringify({
      result: {
        success: true,
        appointment_id: crypto.randomUUID(),
        scheduled_time: parameters.datetime,
        message: 'Appointment booked successfully',
      },
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleStatusUpdate(supabase: any, message: any) {
  console.log('Processing status-update:', message.status);

  // Update call status in real-time
  const { data: existingCall } = await supabase
    .from('calls')
    .select('id')
    .eq('vapi_call_id', message.call.id)
    .single();

  if (existingCall) {
    await supabase
      .from('calls')
      .update({ status: message.status })
      .eq('id', existingCall.id);
  }
}
