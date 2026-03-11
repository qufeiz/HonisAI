import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { addLog } from '@/app/api/logs/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    addLog('info', 'getCustomerMemory', 'Function called', body);
    console.log('[getCustomerMemory] Full request:', JSON.stringify(body, null, 2));

    // Vapi sends toolCalls array (not toolCallList)
    const toolCalls = body.message?.toolCalls || body.message?.toolCallList || [];
    const toolCall = toolCalls[0];
    const toolCallId = toolCall?.id;
    const parameters = toolCall?.arguments || {};

    console.log('[getCustomerMemory] Tool call:', { toolCallId, parameters });

    // Get phone number from parameters, call data, or message
    const phoneNumber = parameters.phone_number
      || body.call?.customer?.number
      || body.message?.call?.customer?.number;

    if (!phoneNumber) {
      console.error('[getCustomerMemory] No phone number found in:', JSON.stringify({
        parameters,
        callCustomer: body.call?.customer,
        messageCall: body.message?.call?.customer
      }));
      return NextResponse.json({
        results: [{
          toolCallId,
          result: JSON.stringify({
            success: false,
            message: 'No phone number found in request',
          }),
        }],
      });
    }

    console.log('[getCustomerMemory] Fetching for:', phoneNumber);

    // Look up contact and their call history
    const { data: contact } = await supabase
      .from('contacts')
      .select('*, calls(*)')
      .eq('phone', phoneNumber)
      .single();

    if (!contact) {
      console.log('[getCustomerMemory] New customer - no history found');
      return NextResponse.json({
        results: [{
          toolCallId,
          result: JSON.stringify({
            success: true,
            is_new_customer: true,
            customer_name: null,
            customer_email: null,
            call_count: 0,
            last_call_summary: null,
            last_call_date: null,
            notes: null,
            contact_type: null,
          }),
        }],
      });
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

    console.log('[getCustomerMemory] Result:', result);
    addLog('info', 'getCustomerMemory', `Returned memory for ${phoneNumber}`, result);

    return NextResponse.json({
      results: [{
        toolCallId,
        result: JSON.stringify(result),
      }],
    });
  } catch (error) {
    console.error('[getCustomerMemory] Error:', error);
    addLog('error', 'getCustomerMemory', 'Function error', { error: String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
