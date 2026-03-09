// Vapi Webhook Event Handlers
import { supabase } from '@/lib/supabase/client';
import type {
  AssistantRequestPayload,
  StatusUpdatePayload,
  TranscriptPayload,
  FunctionCallPayload,
  EndOfCallReportPayload,
} from '@/types/vapi';

// =====================================================
// ASSISTANT REQUEST - Inbound call started
// =====================================================
export async function handleAssistantRequest(payload: AssistantRequestPayload) {
  const { call } = payload.message;

  console.log('[Vapi] Assistant request for call:', call.id);

  // 1. Get caller phone number
  const phoneNumber = call.customer.number;

  // 2. Look up or create contact
  const { data: existingContacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('phone', phoneNumber)
    .limit(1);

  let contact = existingContacts?.[0];

  if (!contact) {
    // Create new contact
    const { data: newContact } = await supabase
      .from('contacts')
      .insert({
        phone: phoneNumber,
        name: call.customer.name || 'Unknown',
        source: 'Inbound Call',
        status: 'pending',
        contact_type: 'Buyer',
        assigned_to_type: 'ai',
      })
      .select()
      .single();

    contact = newContact;
    console.log('[Vapi] Created new contact:', contact?.id);
  }

  // 3. Create call record
  const { data: callRecord, error } = await supabase
    .from('calls')
    .insert({
      contact_id: contact?.id,
      vapi_call_id: call.id,
      direction: 'inbound',
      from_number: phoneNumber,
      to_number: call.phoneNumber?.number || '',
      status: 'in-progress',
      handled_by_type: 'ai',
      handled_by_name: 'AI Agent (Inbound)',
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[Vapi] Error creating call record:', error);
  } else {
    console.log('[Vapi] Created call record:', callRecord?.id);
  }

  // 4. Return dynamic assistant configuration
  return {
    assistant: {
      firstMessage: contact?.name && contact.name !== 'Unknown'
        ? `Hello! Thanks for calling QufieAI Real Estate. Is this ${contact.name}?`
        : 'Hello! Thanks for calling QufieAI Real Estate. How can I help you today?',
      variableValues: {
        contactName: contact?.name || 'there',
        contactPhone: phoneNumber,
      },
    },
  };
}

// =====================================================
// STATUS UPDATE - Call status changed
// =====================================================
export async function handleStatusUpdate(payload: StatusUpdatePayload) {
  const { call, status } = payload.message;

  console.log('[Vapi] Status update:', call.id, status);

  // Map Vapi status to our database status
  const dbStatus = status === 'ended' ? 'completed' : status;

  // Update call record
  const { error } = await supabase
    .from('calls')
    .update({
      status: dbStatus,
      ...(status === 'ended' && { ended_at: new Date().toISOString() }),
    })
    .eq('vapi_call_id', call.id);

  if (error) {
    console.error('[Vapi] Error updating call status:', error);
  }

  return { success: true };
}

// =====================================================
// TRANSCRIPT - Real-time transcription
// =====================================================
export async function handleTranscript(payload: TranscriptPayload) {
  const { call, transcript, transcriptType, role } = payload.message;

  // Only save final transcripts to avoid too many updates
  if (transcriptType !== 'final') {
    return { success: true };
  }

  console.log('[Vapi] Transcript:', role, transcript);

  // Get existing transcript
  const { data: callRecord } = await supabase
    .from('calls')
    .select('transcript')
    .eq('vapi_call_id', call.id)
    .single();

  // Append new transcript
  const existingTranscript = callRecord?.transcript || '';
  const roleLabel = role === 'user' ? 'Customer' : 'AI';
  const newTranscript = `${existingTranscript}\n${roleLabel}: ${transcript}`.trim();

  // Update call record
  const { error } = await supabase
    .from('calls')
    .update({
      transcript: newTranscript,
    })
    .eq('vapi_call_id', call.id);

  if (error) {
    console.error('[Vapi] Error updating transcript:', error);
  }

  return { success: true };
}

// =====================================================
// FUNCTION CALL - AI called a function
// =====================================================
export async function handleFunctionCall(payload: FunctionCallPayload) {
  const { call, functionCall } = payload.message;

  console.log('[Vapi] Function call:', functionCall.name, functionCall.parameters);

  // Handle transfer_to_human
  if (functionCall.name === 'transfer_to_human') {
    return await handleTransferToHuman(call, functionCall.parameters);
  }

  // Handle schedule_viewing
  if (functionCall.name === 'schedule_viewing') {
    return await handleScheduleViewing(call, functionCall.parameters);
  }

  // Default: log unknown function
  console.warn('[Vapi] Unknown function call:', functionCall.name);
  return {
    result: {
      success: false,
      message: 'Unknown function',
    },
  };
}

// Handle transfer to human agent
async function handleTransferToHuman(call: any, parameters: any) {
  const { reason, urgency = 'medium' } = parameters;

  // 1. Get call and contact info
  const { data: callRecord } = await supabase
    .from('calls')
    .select('*, contacts(*), agent_teams(*)')
    .eq('vapi_call_id', call.id)
    .single();

  if (!callRecord) {
    return { result: { success: false, message: 'Call not found' } };
  }

  const agentTeam = callRecord.agent_teams;
  const contact = callRecord.contacts;

  // 2. Send warm transfer SMS to human agent (if configured)
  if (agentTeam?.warm_transfer_sms_template && agentTeam?.human_agent_phone) {
    const smsContent = agentTeam.warm_transfer_sms_template
      .replace('{{contact_name}}', contact?.name || 'Unknown')
      .replace('{{reason}}', reason);

    // TODO: Actually send SMS via Twilio or similar
    console.log('[Vapi] Would send warm transfer SMS to:', agentTeam.human_agent_phone);
    console.log('[Vapi] SMS content:', smsContent);

    // Update call record with transfer info
    await supabase
      .from('calls')
      .update({
        transferred: true,
        transfer_to_number: agentTeam.human_agent_phone,
        transfer_to_name: agentTeam.human_agent_name,
        transfer_reason: reason,
        warm_transfer_sms_sent: true,
        warm_transfer_sms_content: smsContent,
      })
      .eq('id', callRecord.id);
  }

  // 3. Return transfer destination to Vapi
  return {
    result: {
      success: true,
      transferTo: agentTeam?.human_agent_phone || '+1234567890',
    },
  };
}

// Handle schedule viewing
async function handleScheduleViewing(call: any, parameters: any) {
  const { property_id, date, time } = parameters;

  console.log('[Vapi] Schedule viewing:', { property_id, date, time });

  // TODO: Actually schedule in calendar system
  // For now, just log it

  return {
    result: {
      success: true,
      message: `Viewing scheduled for ${date} at ${time}`,
      confirmationNumber: Math.random().toString(36).substring(7).toUpperCase(),
    },
  };
}

// =====================================================
// END OF CALL REPORT - Call ended, final data
// =====================================================
export async function handleEndOfCallReport(payload: EndOfCallReportPayload) {
  const { call, transcript, recordingUrl, summary, endedReason } = payload.message;

  console.log('[Vapi] End of call report:', call.id, endedReason);

  // Calculate duration
  const startedAt = call.startedAt ? new Date(call.startedAt) : null;
  const endedAt = call.endedAt ? new Date(call.endedAt) : new Date();
  const duration = startedAt ? Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000) : 0;

  // Extract analysis if available
  const analysis = call.analysis;
  const callSummary = summary || analysis?.successEvaluation || 'Call completed';
  const structuredData = analysis?.structuredData || {};

  // Update call record with final data
  const { error } = await supabase
    .from('calls')
    .update({
      status: 'completed',
      duration,
      transcript,
      recording_url: recordingUrl,
      call_summary: callSummary,
      outcome: structuredData.outcome || endedReason,
      sentiment: structuredData.sentiment || 'Neutral',
      ended_at: endedAt.toISOString(),
    })
    .eq('vapi_call_id', call.id);

  if (error) {
    console.error('[Vapi] Error updating end of call report:', error);
  } else {
    console.log('[Vapi] Updated call with final data');
  }

  // Update conversation last_message
  const { data: callRecord } = await supabase
    .from('calls')
    .select('contact_id')
    .eq('vapi_call_id', call.id)
    .single();

  if (callRecord?.contact_id) {
    await supabase
      .from('conversations')
      .upsert({
        contact_id: callRecord.contact_id,
        last_message_content: callSummary,
        last_message_type: 'call',
        last_message_at: endedAt.toISOString(),
      }, {
        onConflict: 'contact_id',
      });
  }

  return { success: true };
}
