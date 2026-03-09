import { supabase } from './client';

// =====================================================
// CONTACTS
// =====================================================

export async function getAllContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      agent_teams (
        id,
        name,
        phone_number
      )
    `)
    .order('last_contact_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }

  return data;
}

export async function getContactById(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      agent_teams (
        id,
        name,
        phone_number
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contact:', error);
    return null;
  }

  return data;
}

// =====================================================
// CALLS
// =====================================================

export async function getAllCalls() {
  const { data, error } = await supabase
    .from('calls')
    .select(`
      *,
      contacts (
        id,
        name,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching calls:', error);
    return [];
  }

  return data;
}

export async function getCallsByContactId(contactId: string) {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching calls for contact:', error);
    return [];
  }

  return data;
}

export async function getCallById(id: string) {
  const { data, error } = await supabase
    .from('calls')
    .select(`
      *,
      contacts (
        id,
        name,
        phone
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching call:', error);
    return null;
  }

  return data;
}

// =====================================================
// CONVERSATIONS
// =====================================================

export async function getAllConversations() {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      contacts (
        id,
        name,
        phone,
        email
      ),
      agent_teams (
        id,
        name,
        phone_number
      )
    `)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  return data;
}

export async function getConversationByContactId(contactId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      contacts (
        id,
        name,
        phone,
        email
      )
    `)
    .eq('contact_id', contactId)
    .single();

  if (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }

  return data;
}

// =====================================================
// MESSAGES (for a conversation timeline)
// =====================================================

export async function getMessagesForContact(contactId: string) {
  // Get all calls for this contact
  const { data: calls, error: callError } = await supabase
    .from('calls')
    .select('*')
    .eq('contact_id', contactId);

  if (callError) {
    console.error('Error fetching calls:', callError);
  }

  // Get all messages (SMS/Email) for this contact
  const { data: messages, error: messageError } = await supabase
    .from('messages')
    .select('*')
    .eq('contact_id', contactId);

  if (messageError) {
    console.error('Error fetching messages:', messageError);
  }

  const timeline: any[] = [];

  // Add calls to timeline
  if (calls) {
    calls.forEach(call => {
      // Add the call itself
      timeline.push({
        id: call.id,
        type: call.handled_by_type === 'ai' ? 'ai_call' : 'human_call',
        timestamp: new Date(call.created_at).toLocaleString(),
        from: call.direction === 'inbound' ? call.from_number : call.handled_by_name,
        to: call.to_number,
        content: call.call_summary || call.transcript || 'Call completed',
        duration: call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : undefined,
        direction: call.direction,
        handledBy: {
          name: call.handled_by_name || 'AI Agent',
          type: call.handled_by_type,
        },
        callSummary: call.call_summary,
        outcome: call.outcome,
        sentiment: call.sentiment,
        transcript: call.transcript,
        recording: call.recording_url,
        created_at: call.created_at,
      });

      // Add transfer event if transferred
      if (call.transferred && call.transfer_to_name) {
        timeline.push({
          id: `${call.id}-transfer`,
          type: 'transfer',
          timestamp: new Date(call.created_at).toLocaleString(),
          from: call.handled_by_name || 'AI Agent',
          to: call.transfer_to_name,
          direction: 'outbound',
          handledBy: {
            name: 'System',
            type: 'ai',
          },
          transferDetails: {
            from: call.handled_by_name || 'AI Agent',
            to: call.transfer_to_name,
            reason: call.transfer_reason || 'Call transferred',
          },
          created_at: call.created_at,
        });
      }
    });
  }

  // Add SMS and Email messages to timeline
  if (messages) {
    messages.forEach(msg => {
      timeline.push({
        id: msg.id,
        type: msg.handled_by_type === 'ai'
          ? (msg.type === 'sms' ? 'ai_sms' : 'ai_email')
          : (msg.type === 'sms' ? 'human_sms' : 'human_email'),
        timestamp: new Date(msg.created_at).toLocaleString(),
        from: msg.from_address,
        to: msg.to_address,
        content: msg.content,
        subject: msg.subject,
        direction: msg.direction,
        handledBy: {
          name: msg.handled_by_name || 'AI Agent',
          type: msg.handled_by_type,
        },
        created_at: msg.created_at,
      });
    });
  }

  // Sort by created_at
  timeline.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return timeline;
}

// =====================================================
// AGENT TEAMS
// =====================================================

export async function getAllAgentTeams() {
  const { data, error } = await supabase
    .from('agent_teams')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching agent teams:', error);
    return [];
  }

  return data;
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

export function subscribeToConversations(callback: (payload: any) => void) {
  return supabase
    .channel('conversations')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, callback)
    .subscribe();
}

export function subscribeToCalls(callback: (payload: any) => void) {
  return supabase
    .channel('calls')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'calls' }, callback)
    .subscribe();
}

export function subscribeToContacts(callback: (payload: any) => void) {
  return supabase
    .channel('contacts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, callback)
    .subscribe();
}
