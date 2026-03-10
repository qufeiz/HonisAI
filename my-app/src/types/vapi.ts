// Vapi.ai TypeScript Types
// Documentation: https://docs.vapi.ai

export type VapiEventType =
  | 'assistant-request'
  | 'status-update'
  | 'transcript'
  | 'function-call'
  | 'speech-update'
  | 'hang'
  | 'end-of-call-report';

export type CallStatus =
  | 'queued'
  | 'ringing'
  | 'in-progress'
  | 'forwarding'
  | 'ended';

export interface VapiCall {
  id: string;
  orgId: string;
  type: 'inboundPhoneCall' | 'outboundPhoneCall' | 'webCall';
  status: CallStatus;
  phoneNumber?: {
    id: string;
    number: string;
  };
  customer: {
    number: string;
    name?: string;
    extension?: string;
  };
  assistantId?: string;
  startedAt?: string;
  endedAt?: string;
  cost?: number;
  costBreakdown?: {
    transport?: number;
    stt?: number;
    llm?: number;
    tts?: number;
    vapi?: number;
    total?: number;
  };
  messages?: VapiMessage[];
  transcript?: string;
  recordingUrl?: string;
  summary?: string;
  analysis?: {
    successEvaluation?: string;
    structuredData?: Record<string, any>;
  };
}

export interface VapiMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string;
  name?: string;
  time: number;
  endTime?: number;
  secondsFromStart?: number;
}

export interface VapiTranscript {
  role: 'user' | 'assistant';
  transcript: string;
  transcriptType: 'partial' | 'final';
  timestamp: string;
}

export interface VapiFunctionCall {
  name: string;
  parameters: Record<string, any>;
}

// Webhook Event Payloads

export interface AssistantRequestPayload {
  message: {
    type: 'assistant-request';
    call: VapiCall;
    timestamp: string;
  };
}

export interface StatusUpdatePayload {
  message: {
    type: 'status-update';
    status: CallStatus;
    call: VapiCall;
    timestamp: string;
  };
}

export interface TranscriptPayload {
  message: {
    type: 'transcript';
    role: 'user' | 'assistant';
    transcript: string;
    transcriptType: 'partial' | 'final';
    call: VapiCall;
    timestamp: string;
  };
}

export interface FunctionCallPayload {
  message: {
    type: 'function-call';
    functionCall: VapiFunctionCall;
    call: VapiCall;
    timestamp: string;
  };
}

export interface EndOfCallReportPayload {
  message: {
    type: 'end-of-call-report';
    call: VapiCall;
    transcript: string;
    recordingUrl?: string;
    summary?: string;
    endedReason:
      | 'assistant-ended-call'
      | 'customer-ended-call'
      | 'assistant-forwarded-call'
      | 'assistant-error'
      | 'exceeded-max-duration'
      | 'pipeline-error-openai-voice-failed'
      | 'pipeline-error-deepgram-transcriber-failed'
      | 'pipeline-error-eleven-labs-voice-failed'
      | 'pipeline-error-playht-voice-failed'
      | 'assistant-not-found'
      | 'dial-busy'
      | 'dial-failed'
      | 'dial-no-answer';
    timestamp: string;
  };
}

export type VapiWebhookPayload =
  | AssistantRequestPayload
  | StatusUpdatePayload
  | TranscriptPayload
  | FunctionCallPayload
  | EndOfCallReportPayload;

// Assistant Configuration Types

export interface VapiAssistant {
  name: string;
  firstMessage?: string;
  model: {
    provider: 'openai' | 'anthropic' | 'together-ai' | 'anyscale';
    model: string;
    temperature?: number;
    systemPrompt: string;
    messages?: VapiMessage[];
  };
  voice: {
    provider: '11labs' | 'playht' | 'deepgram' | 'openai';
    voiceId: string;
  };
  transcriber?: {
    provider: 'deepgram' | 'gladia' | 'talkscriber';
    model?: string;
    language?: string;
  };
  functions?: VapiFunction[];
  tools?: VapiTool[];
  analysisPlan?: {
    summaryPrompt?: string;
    structuredDataPrompt?: string;
    successEvaluationPrompt?: string;
  };
  endCallMessage?: string;
  endCallPhrases?: string[];
  recordingEnabled?: boolean;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  backgroundSound?: 'off' | 'office';
  backchannelingEnabled?: boolean;
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
}

export interface VapiFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface VapiTool {
  type: 'transferCall' | 'endCall' | 'dtmf' | 'function';
  async?: boolean;
  destinations?: Array<{
    type: 'number' | 'sip';
    number?: string;
    message?: string;
    extension?: string;
  }>;
  description?: string;
  function?: VapiFunction;
  messages?: Array<{
    type: 'request-start' | 'request-complete' | 'request-failed';
    content: string;
    conditions?: Array<{
      param: string;
      operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte';
      value: string | number;
    }>;
  }>;
}

// Outbound Call Request

export interface CreateOutboundCallRequest {
  assistantId?: string;
  assistant?: Partial<VapiAssistant>;
  phoneNumberId?: string;
  customer: {
    number: string;
    name?: string;
  };
}

export interface CreateOutboundCallResponse {
  id: string;
  orgId: string;
  type: 'outboundPhoneCall';
  status: CallStatus;
  phoneNumber: {
    id: string;
    number: string;
  };
  customer: {
    number: string;
    name?: string;
  };
  assistantId?: string;
  startedAt?: string;
}
