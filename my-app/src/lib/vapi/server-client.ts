// Vapi API Client (Server-Side Only)
import type { CreateOutboundCallRequest, CreateOutboundCallResponse, VapiAssistant } from '@/types/vapi';

const VAPI_BASE_URL = 'https://api.vapi.ai';

class VapiServerClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${VAPI_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Create outbound call
  async createCall(request: CreateOutboundCallRequest): Promise<CreateOutboundCallResponse> {
    return this.request<CreateOutboundCallResponse>('/call', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get call details
  async getCall(callId: string) {
    return this.request(`/call/${callId}`, {
      method: 'GET',
    });
  }

  // Create assistant
  async createAssistant(assistant: VapiAssistant) {
    return this.request('/assistant', {
      method: 'POST',
      body: JSON.stringify(assistant),
    });
  }

  // Update assistant
  async updateAssistant(assistantId: string, assistant: Partial<VapiAssistant>) {
    return this.request(`/assistant/${assistantId}`, {
      method: 'PATCH',
      body: JSON.stringify(assistant),
    });
  }

  // Get assistant
  async getAssistant(assistantId: string) {
    return this.request(`/assistant/${assistantId}`, {
      method: 'GET',
    });
  }

  // List phone numbers
  async listPhoneNumbers() {
    return this.request('/phone-number', {
      method: 'GET',
    });
  }
}

// Export singleton instance for server-side use
export const vapiServerClient = new VapiServerClient(
  process.env.VAPI_PRIVATE_KEY || ''
);

// Export class for custom instances
export default VapiServerClient;
