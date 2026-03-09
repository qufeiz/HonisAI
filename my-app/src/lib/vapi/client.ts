import Vapi from '@vapi-ai/web';

const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!;

export const vapi = new Vapi(vapiPublicKey);

// Vapi event handlers
export function setupVapiEventListeners(
  onCallStart?: () => void,
  onCallEnd?: () => void,
  onSpeechStart?: () => void,
  onSpeechEnd?: () => void,
  onError?: (error: any) => void
) {
  if (onCallStart) {
    vapi.on('call-start', onCallStart);
  }

  if (onCallEnd) {
    vapi.on('call-end', onCallEnd);
  }

  if (onSpeechStart) {
    vapi.on('speech-start', onSpeechStart);
  }

  if (onSpeechEnd) {
    vapi.on('speech-end', onSpeechEnd);
  }

  if (onError) {
    vapi.on('error', onError);
  }

  // Message event for real-time transcript
  vapi.on('message', (message) => {
    console.log('Vapi message:', message);
  });
}

// Clean up event listeners
export function cleanupVapiEventListeners() {
  vapi.removeAllListeners();
}
