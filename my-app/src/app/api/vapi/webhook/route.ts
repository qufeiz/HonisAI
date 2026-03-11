// Vapi Webhook Endpoint
// POST /api/vapi/webhook
import { NextRequest, NextResponse } from 'next/server';
import type { VapiWebhookPayload } from '@/types/vapi';
import {
  handleAssistantRequest,
  handleStatusUpdate,
  handleTranscript,
  handleFunctionCall,
  handleEndOfCallReport,
} from '@/lib/vapi/handlers';
import { addLog } from '@/app/api/logs/route';

export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const payload: VapiWebhookPayload = await request.json();
    const eventType = payload.message.type;

    console.log('[Vapi Webhook] Received event:', eventType);
    addLog('info', 'webhook', `Event received: ${eventType}`, {
      callId: (payload.message as any).call?.id,
      type: eventType
    });

    // Route to appropriate handler
    let response;

    switch (eventType) {
      case 'assistant-request':
        response = await handleAssistantRequest(payload as any);
        break;

      case 'status-update':
        response = await handleStatusUpdate(payload as any);
        break;

      case 'transcript':
        response = await handleTranscript(payload as any);
        break;

      case 'function-call':
        response = await handleFunctionCall(payload as any);
        break;

      case 'end-of-call-report':
        response = await handleEndOfCallReport(payload as any);
        break;

      default:
        console.log('[Vapi Webhook] Unhandled event type:', eventType);
        response = { success: true, message: 'Event type not handled' };
    }

    // Return success response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[Vapi Webhook] Error processing webhook:', error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Export GET handler for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: 'QufieAI Vapi Webhook',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
}
