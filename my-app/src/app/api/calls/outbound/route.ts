// Outbound Call API
// POST /api/calls/outbound
import { NextRequest, NextResponse } from 'next/server';
import { vapiServerClient } from '@/lib/vapi/server-client';
import { supabase } from '@/lib/supabase/client';
import { getAssistantConfig } from '@/lib/vapi/assistants';

export async function POST(request: NextRequest) {
  try {
    const { contactId, assistantType = 'sales' } = await request.json();

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // 1. Get contact info
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*, agent_teams(*)')
      .eq('id', contactId)
      .single();

    if (contactError || !contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    console.log('[Outbound] Initiating call to:', contact.name, contact.phone);

    // 2. Get assistant configuration
    const assistantConfig = getAssistantConfig(assistantType as 'sales' | 'investment');

    // Customize first message with contact name
    const customizedAssistant = {
      ...assistantConfig,
      firstMessage: contact.name
        ? `Hello ${contact.name}! This is calling from QufieAI Real Estate. How are you today?`
        : assistantConfig.firstMessage,
    };

    // 3. Create call via Vapi API
    const vapiCall = await vapiServerClient.createCall({
      assistant: customizedAssistant,
      customer: {
        number: contact.phone,
        name: contact.name || undefined,
      },
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    });

    console.log('[Outbound] Vapi call created:', vapiCall.id);

    // 4. Create call record in our database
    const { data: callRecord, error: callError } = await supabase
      .from('calls')
      .insert({
        contact_id: contactId,
        agent_team_id: contact.agent_team_id,
        organization_id: contact.organization_id,
        vapi_call_id: vapiCall.id,
        direction: 'outbound',
        from_number: vapiCall.phoneNumber?.number || '',
        to_number: contact.phone,
        status: vapiCall.status,
        handled_by_type: 'ai',
        handled_by_name: assistantConfig.name,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (callError) {
      console.error('[Outbound] Error creating call record:', callError);
      return NextResponse.json(
        { error: 'Failed to create call record' },
        { status: 500 }
      );
    }

    console.log('[Outbound] Call record created:', callRecord.id);

    // 5. Return success with call info
    return NextResponse.json({
      success: true,
      call: {
        id: callRecord.id,
        vapiCallId: vapiCall.id,
        status: vapiCall.status,
        contactName: contact.name,
        contactPhone: contact.phone,
      },
    });
  } catch (error) {
    console.error('[Outbound] Error creating outbound call:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create call',
      },
      { status: 500 }
    );
  }
}
