// Vapi Webhook Event Handlers
import { supabase } from '@/lib/supabase/client';
import OpenAI from 'openai';
import { addLog } from '@/app/api/logs/route';
import type {
  AssistantRequestPayload,
  StatusUpdatePayload,
  TranscriptPayload,
  FunctionCallPayload,
  EndOfCallReportPayload,
} from '@/types/vapi';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  // 4. Return dynamic assistant configuration with contact context
  const { salesAssistantConfig } = await import('./assistants');

  // Build context about the contact for the assistant
  let contactContext = '';
  if (contact) {
    const contextParts = [];
    if (contact.name && contact.name !== 'Unknown') {
      contextParts.push(`- Name: ${contact.name}`);
    }
    if (contact.email) {
      contextParts.push(`- Email: ${contact.email}`);
    }
    if (contact.notes) {
      contextParts.push(`- Notes: ${contact.notes}`);
    }
    if (contact.contact_type) {
      contextParts.push(`- Lead Type: ${contact.contact_type}`);
    }

    if (contextParts.length > 0) {
      contactContext = `\n\nCaller History:\n${contextParts.join('\n')}`;
    }
  }

  // Customize system prompt with contact history
  const customizedSystemPrompt = contactContext
    ? salesAssistantConfig.model.systemPrompt + contactContext
    : salesAssistantConfig.model.systemPrompt;

  const response = {
    assistant: {
      ...salesAssistantConfig,
      model: {
        ...salesAssistantConfig.model,
        systemPrompt: customizedSystemPrompt,
      },
      firstMessage: contact?.name && contact.name !== 'Unknown'
        ? `Hello! Thanks for calling QufieAI Real Estate. Is this ${contact.name}?`
        : 'Hello! Thanks for calling QufieAI Real Estate. How can I help you today?',
    },
  };

  const fs = require('fs');
  fs.writeFileSync('/tmp/vapi-assistant-config.json', JSON.stringify(response, null, 2));
  console.log('[Vapi] Wrote assistant config to /tmp/vapi-assistant-config.json');
  return response;
}

// =====================================================
// STATUS UPDATE - Call status changed
// =====================================================
export async function handleStatusUpdate(payload: StatusUpdatePayload) {
  const { call, status } = payload.message;

  console.log('[Vapi] Status update:', call.id, status);
  addLog('info', 'status-update', `Call ${status}`, { callId: call.id, status });

  // If this is the first event (in-progress), create the call record if it doesn't exist
  if (status === 'in-progress') {
    const { data: existing } = await supabase
      .from('calls')
      .select('id')
      .eq('vapi_call_id', call.id)
      .single();

    if (!existing) {
      // Create call record since assistant-request wasn't sent (persistent assistant)
      const phoneNumber = call.customer?.number || 'Unknown';

      // Look up or create contact
      const { data: existingContacts } = await supabase
        .from('contacts')
        .select('*')
        .eq('phone', phoneNumber)
        .limit(1);

      let contact = existingContacts?.[0];

      if (!contact) {
        const { data: newContact } = await supabase
          .from('contacts')
          .insert({
            phone: phoneNumber,
            name: call.customer?.name || 'Unknown',
            source: 'Inbound Call',
            status: 'pending',
            contact_type: 'Buyer',
            assigned_to_type: 'ai',
          })
          .select()
          .single();
        contact = newContact;
      }

      // Create call record
      await supabase
        .from('calls')
        .insert({
          contact_id: contact?.id,
          vapi_call_id: call.id,
          direction: call.type?.includes('inbound') ? 'inbound' : 'outbound',
          from_number: phoneNumber,
          to_number: call.phoneNumber?.number || '',
          status: 'in-progress',
          handled_by_type: 'ai',
          handled_by_name: 'AI Agent',
          started_at: new Date().toISOString(),
        });

      console.log('[Vapi] Created call record from status-update');
    }
  }

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

  // Handle getCustomerMemory
  if (functionCall.name === 'getCustomerMemory') {
    return await handleGetCustomerMemory(call, functionCall.parameters);
  }

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

// Handle getCustomerMemory - fetch caller history
async function handleGetCustomerMemory(call: any, parameters: any) {
  const phoneNumber = parameters.phone_number || call.customer?.number;

  if (!phoneNumber) {
    return {
      result: {
        success: false,
        message: 'No phone number provided',
      },
    };
  }

  console.log('[Vapi] Fetching customer memory for:', phoneNumber);

  // Look up contact and their call history
  const { data: contact } = await supabase
    .from('contacts')
    .select('*, calls(*)')
    .eq('phone', phoneNumber)
    .single();

  if (!contact) {
    console.log('[Vapi] New customer - no history found');
    return {
      result: {
        success: true,
        is_new_customer: true,
        customer_name: null,
        customer_email: null,
        call_count: 0,
        last_call_summary: null,
        last_call_date: null,
        notes: null,
        contact_type: null,
      },
    };
  }

  // Get most recent completed calls
  const recentCalls = contact.calls
    ?.filter((c: any) => c.status === 'completed')
    ?.sort((a: any, b: any) => new Date(b.ended_at).getTime() - new Date(a.ended_at).getTime());

  const result = {
    success: true,
    is_new_customer: false,
    customer_name: contact.name !== 'Unknown' ? contact.name : null,
    customer_email: contact.email,
    call_count: recentCalls?.length || 0,
    last_call_summary: recentCalls?.[0]?.call_summary || null,
    last_call_date: recentCalls?.[0]?.ended_at || null,
    notes: contact.notes,
    contact_type: contact.contact_type,
  };

  console.log('[Vapi] Customer memory fetched:', result);
  return { result };
}

// Handle transfer to human agent
async function handleTransferToHuman(call: any, parameters: any) {
  const { reason, urgency = 'medium' } = parameters;

  addLog('info', 'transfer-to-human', `Transfer requested: ${reason}`, {
    callId: call.id,
    reason,
    urgency
  });

  // 1. Get call and contact info
  const { data: callRecord } = await supabase
    .from('calls')
    .select('*, contacts(*), agent_teams(*)')
    .eq('vapi_call_id', call.id)
    .single();

  if (!callRecord) {
    addLog('error', 'transfer-to-human', 'Call not found in database', { callId: call.id });
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
  addLog('info', 'end-of-call-report', `Call ended: ${endedReason}`, {
    callId: call.id,
    endedReason,
    duration: call.endedAt && call.startedAt ? Math.floor((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000) : 0,
    hasTranscript: !!transcript,
    hasRecording: !!recordingUrl,
  });

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

  // Get call record with contact
  const { data: callRecord } = await supabase
    .from('calls')
    .select('contact_id, contacts(*)')
    .eq('vapi_call_id', call.id)
    .single();

  if (callRecord?.contact_id) {
    // Update conversation last_message
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

    // Extract contact info from transcript and update contact
    await extractAndUpdateContactInfo(transcript, callRecord.contact_id, callRecord.contacts);
  }

  return { success: true };
}

// Helper function to extract contact info from transcript using AI
async function extractAndUpdateContactInfo(transcript: string, contactId: string, existingContact: any) {
  if (!transcript) return;

  try {
    // Use OpenAI to extract structured data from transcript
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a data extraction assistant. Extract the customer's name and email from the call transcript.
Return a JSON object with "name" and "email" fields. If information is not found, use null.
For spoken emails like "tuesday z at g mail dot com", convert to proper format: "tuesdayz@gmail.com".
Only extract information that was explicitly stated by the user (not the AI agent).`,
        },
        {
          role: 'user',
          content: `Extract name and email from this transcript:\n\n${transcript}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const extracted = JSON.parse(completion.choices[0].message.content || '{}');
    console.log('[Vapi] AI extracted contact info:', extracted);

    const updates: any = {};

    // Only update if we don't already have the info
    if (extracted.name && (!existingContact?.name || existingContact.name === 'Unknown')) {
      updates.name = extracted.name;
    }

    if (extracted.email && !existingContact?.email) {
      updates.email = extracted.email.toLowerCase().trim();
    }

    // Only update if we found something
    if (Object.keys(updates).length > 0) {
      console.log('[Vapi] Updating contact with AI-extracted info:', updates);
      addLog('info', 'ai-extraction', 'Contact info extracted and updated', updates);

      const { error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', contactId);

      if (error) {
        console.error('[Vapi] Error updating contact info:', error);
        addLog('error', 'ai-extraction', 'Failed to update contact', { error: String(error) });
      } else {
        console.log('[Vapi] Contact updated successfully');
      }
    }
  } catch (error) {
    console.error('[Vapi] Error extracting contact info with AI:', error);
  }
}
