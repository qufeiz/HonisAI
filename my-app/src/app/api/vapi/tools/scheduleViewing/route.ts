import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[scheduleViewing] Full request:', JSON.stringify(body, null, 2));

    // Vapi sends toolCalls array (not toolCallList)
    const toolCalls = body.message?.toolCalls || body.message?.toolCallList || [];
    const toolCall = toolCalls[0];
    const toolCallId = toolCall?.id;
    const parameters = toolCall?.arguments || {};

    console.log('[scheduleViewing] Tool call:', { toolCallId, parameters });

    const { property_id, date, time } = parameters;

    // TODO: Actually schedule in calendar system
    const confirmationNumber = Math.random().toString(36).substring(7).toUpperCase();

    const result = {
      success: true,
      message: `Viewing scheduled for ${date} at ${time}`,
      confirmationNumber,
      property_id,
      date,
      time,
    };

    console.log('[scheduleViewing] Result:', result);

    return NextResponse.json({
      results: [{
        toolCallId,
        result: JSON.stringify(result),
      }],
    });
  } catch (error) {
    console.error('[scheduleViewing] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
