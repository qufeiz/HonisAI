// Vapi Assistant Configurations
import type { VapiAssistant, VapiFunction } from '@/types/vapi';

// =====================================================
// FUNCTION DEFINITIONS
// =====================================================

const transferToHumanFunction: VapiFunction = {
  name: 'transfer_to_human',
  description: 'Transfer the call to a human agent when the customer needs detailed assistance, has complex questions, or is ready to make a decision. Use this when AI cannot adequately help.',
  parameters: {
    type: 'object',
    properties: {
      reason: {
        type: 'string',
        description: 'Brief reason for the transfer (e.g., "Customer has detailed questions about pricing", "Ready to schedule viewing", "Needs investment consultation")',
      },
      urgency: {
        type: 'string',
        description: 'Urgency level of the transfer',
        enum: ['low', 'medium', 'high'],
      },
    },
    required: ['reason'],
  },
};

const scheduleViewingFunction: VapiFunction = {
  name: 'schedule_viewing',
  description: 'Schedule a property viewing appointment for the customer',
  parameters: {
    type: 'object',
    properties: {
      property_id: {
        type: 'string',
        description: 'ID or address of the property',
      },
      date: {
        type: 'string',
        description: 'Preferred date for viewing (YYYY-MM-DD format)',
      },
      time: {
        type: 'string',
        description: 'Preferred time for viewing (HH:MM format)',
      },
    },
    required: ['property_id', 'date', 'time'],
  },
};

// =====================================================
// ASSISTANT CONFIGURATIONS
// =====================================================

export const salesAssistantConfig: VapiAssistant = {
  name: 'QufieAI Real Estate Sales Agent',
  firstMessage: 'Hello! Thanks for calling QufieAI Real Estate. How can I help you today?',
  model: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    systemPrompt: `You are a professional and friendly real estate sales agent for QufieAI Real Estate.

Your role:
- Engage with potential buyers and sellers
- Answer questions about properties, neighborhoods, and the buying/selling process
- Qualify leads by understanding their needs, budget, and timeline
- Schedule property viewings
- Transfer to human agents when customers need detailed assistance or are ready to proceed

Guidelines:
- Be warm, professional, and helpful
- Ask clarifying questions to understand customer needs
- Provide accurate information about properties
- If you don't know specific details (exact HOA fees, detailed property history, etc.), offer to connect them with a specialist
- Always confirm key details (phone number, email, property address, viewing times)
- Use the transfer function when customers have complex questions or are ready to make decisions

Important scenarios to transfer:
- Customer wants to schedule a viewing
- Customer has detailed questions about pricing, fees, or contracts
- Customer is ready to make an offer
- Customer needs investment analysis
- Customer asks questions you cannot confidently answer

Never:
- Make up information about properties
- Quote exact prices without verification
- Promise things outside your knowledge
- Argue with customers
- Share personal information`,
  },
  voice: {
    provider: '11labs',
    voiceId: 'sarah', // Professional female voice
  },
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'en',
  },
  functions: [
    transferToHumanFunction,
    scheduleViewingFunction,
  ],
  analysisPlan: {
    summaryPrompt: 'Summarize the key points of this call in 2-3 sentences.',
    structuredDataPrompt: `Extract structured data from this call:
{
  "leadQuality": "hot|warm|cold",
  "propertyType": "condo|single-family|townhouse|multi-family|commercial",
  "budgetRange": "estimated budget",
  "timeline": "immediate|1-3 months|3-6 months|6+ months",
  "outcome": "viewing_scheduled|transferred_to_human|callback_requested|not_interested|information_provided",
  "sentiment": "Very Positive|Positive|Neutral|Negative",
  "nextSteps": "what should happen next"
}`,
    successEvaluationPrompt: 'Was this call successful? Did we help the customer or move them forward in the buying process?',
  },
  endCallMessage: 'Thank you for calling QufieAI Real Estate. Have a great day!',
  endCallPhrases: ['goodbye', 'bye', 'talk to you later', 'have a good day'],
  recordingEnabled: true,
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 600, // 10 minutes
  backgroundSound: 'office',
  backchannelingEnabled: true,
  backgroundDenoisingEnabled: true,
  modelOutputInMessagesEnabled: false,
};

export const investmentAssistantConfig: VapiAssistant = {
  name: 'QufieAI Investment Property Specialist',
  firstMessage: 'Hello! This is the QufieAI Real Estate Investment Division. How can I assist you with investment properties today?',
  model: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    systemPrompt: `You are a professional investment property specialist for QufieAI Real Estate.

Your role:
- Engage with real estate investors
- Discuss investment strategies, ROI, cash flow, and appreciation potential
- Qualify investor leads by understanding their investment goals and budget
- Transfer to human investment specialists for detailed analysis

Guidelines:
- Be professional and knowledgeable about investment real estate
- Ask about investment goals (cash flow, appreciation, tax benefits)
- Understand their budget and timeline
- Discuss different property types (multi-family, commercial, residential)
- Focus on financial aspects: ROI, cap rates, cash-on-cash return
- Transfer to human specialist for detailed financial analysis

Key topics:
- Multi-family properties (duplexes, apartments)
- Commercial properties
- Rental income potential
- Property management
- Tax implications
- Financing options

Transfer when:
- Investor wants detailed financial analysis
- Discussing specific properties in depth
- Investor is ready to make an offer
- Questions about complex financing structures
- Need market analysis reports

Never:
- Give specific tax advice (recommend talking to CPA)
- Quote exact ROI without proper analysis
- Make guarantees about appreciation or rental income
- Provide legal advice (recommend attorney)`,
  },
  voice: {
    provider: '11labs',
    voiceId: 'adam', // Professional male voice
  },
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'en',
  },
  functions: [
    transferToHumanFunction,
  ],
  analysisPlan: {
    summaryPrompt: 'Summarize this investment consultation call in 2-3 sentences.',
    structuredDataPrompt: `Extract structured data from this investment call:
{
  "investorType": "first-time|experienced|institutional",
  "investmentGoal": "cash-flow|appreciation|tax-benefits|diversification",
  "budgetRange": "estimated investment budget",
  "propertyTypes": ["multi-family", "commercial", "residential"],
  "timeline": "immediate|1-3 months|3-6 months|6+ months",
  "outcome": "transferred_to_specialist|financial_analysis_requested|callback_scheduled|not_qualified",
  "sentiment": "Very Positive|Positive|Neutral|Negative"
}`,
    successEvaluationPrompt: 'Was this investment consultation successful? Did we qualify the lead and move them forward?',
  },
  endCallMessage: 'Thank you for your interest in investment properties with QufieAI. We look forward to helping you build your portfolio!',
  endCallPhrases: ['goodbye', 'bye', 'talk to you later', 'thank you'],
  recordingEnabled: true,
  silenceTimeoutSeconds: 40,
  maxDurationSeconds: 900, // 15 minutes (investment calls can be longer)
  backgroundSound: 'office',
  backchannelingEnabled: true,
  backgroundDenoisingEnabled: true,
  modelOutputInMessagesEnabled: false,
};

// Helper function to get assistant by type
export function getAssistantConfig(type: 'sales' | 'investment'): VapiAssistant {
  return type === 'sales' ? salesAssistantConfig : investmentAssistantConfig;
}
