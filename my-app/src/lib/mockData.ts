// Shared data structure for contacts, conversations, calls, and campaigns

export type MessageType = "ai_call" | "human_call" | "ai_sms" | "human_sms" | "ai_email" | "transfer" | "notification";

export interface Message {
  id: number;
  type: MessageType;
  timestamp: string;
  from: string;
  to: string;
  content?: string;
  duration?: string;
  direction: "inbound" | "outbound";
  handledBy: {
    name: string;
    type: "ai" | "human";
  };
  transferDetails?: {
    from: string;
    to: string;
    reason: string;
  };
  // Call-specific fields
  callSummary?: string;
  outcome?: string;
  sentiment?: string;
  transcript?: string;
  recording?: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: string;
  status: "active" | "completed" | "pending" | "future";
  source: string;
  value: string;
  addedDate: string;
  lastContact: string;
  agentTeam: string | null;
  agentTeamPhone: string | null;
  messages: Message[];
}

export interface Conversation {
  id: number;
  contactId: number;
  contactName: string;
  contactPhone: string;
  agentTeam: string;
  currentHandler: {
    name: string;
    type: "ai" | "human";
  };
  status: "active" | "resolved" | "pending";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messageIds: number[]; // References to messages in the contact
}

// Shared mock contacts with all their messages
export const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Richard Feynman",
    email: "richard@example.com",
    phone: "+1 (555) 123-4567",
    company: "Caltech",
    type: "Buyer",
    status: "active",
    source: "Website",
    value: "$450,000",
    addedDate: "2024-03-01",
    lastContact: "2 hours ago",
    agentTeam: "Real Estate Team A",
    agentTeamPhone: "+1 (650) 518-1788",
    messages: [
      {
        id: 1,
        type: "ai_call",
        timestamp: "Today at 9:15 AM",
        from: "QufeiAI Agent",
        to: "Richard Feynman",
        content: "Hello, this is calling from QufeiAI regarding your property inquiry. Are you still interested in the downtown condo?",
        duration: "2m 34s",
        direction: "outbound",
        handledBy: { name: "Inbound Call Agent", type: "ai" },
        callSummary: "AI successfully engaged with lead, provided initial property information and confirmed interest.",
        outcome: "Lead confirmed interest, requested more details",
        sentiment: "Positive",
      },
      {
        id: 2,
        type: "ai_sms",
        timestamp: "Today at 9:45 AM",
        from: "QufeiAI Agent",
        to: "Richard Feynman",
        content: "Thanks for your interest! Here's the property listing link: https://example.com/listing/123",
        direction: "outbound",
        handledBy: { name: "SMS Reply Bot", type: "ai" },
      },
      {
        id: 3,
        type: "human_sms",
        timestamp: "Today at 10:12 AM",
        from: "Richard Feynman",
        to: "+1 (650) 518-1788",
        content: "This looks great! I'd love to schedule a viewing. I need to move in by next week!",
        direction: "inbound",
        handledBy: { name: "SMS Reply Bot", type: "ai" },
      },
      {
        id: 10,
        type: "notification",
        timestamp: "Today at 10:12 AM",
        from: "Notification Agent",
        to: "Sarah Johnson",
        direction: "outbound",
        handledBy: { name: "Notification Agent", type: "ai" },
        transferDetails: {
          from: "Notification Agent",
          to: "Sarah Johnson",
          reason: "🔔 Lead has urgent timeline (1 week move-in) - Alert sent to Sarah",
        },
      },
      {
        id: 4,
        type: "human_call",
        timestamp: "Today at 10:15 AM",
        from: "Richard Feynman",
        to: "+1 (650) 518-1788",
        content: "Richard called to discuss viewing details and asked specific questions about the property amenities.",
        duration: "3m 45s",
        direction: "inbound",
        handledBy: { name: "Inbound Call Agent", type: "ai" },
        callSummary: "Lead asked detailed questions about HOA fees, parking availability, and in-unit amenities. Expressed strong interest.",
        outcome: "Transferred to human agent for detailed discussion",
        sentiment: "Very Positive",
      },
      {
        id: 5,
        type: "transfer",
        timestamp: "Today at 10:18 AM",
        from: "Inbound Call Agent",
        to: "Sarah Johnson",
        direction: "outbound",
        handledBy: { name: "System", type: "ai" },
        transferDetails: {
          from: "Inbound Call Agent",
          to: "Sarah Johnson",
          reason: "Qualified lead with detailed property questions",
        },
      },
      {
        id: 6,
        type: "human_call",
        timestamp: "Today at 10:18 AM",
        from: "Sarah Johnson",
        to: "Richard Feynman",
        content: "Sarah answered specific questions about HOA fees, parking, and scheduled a viewing for Saturday at 2pm.",
        duration: "5m 12s",
        direction: "outbound",
        handledBy: { name: "Sarah Johnson", type: "human" },
        callSummary: "Human agent provided detailed information about property amenities, HOA structure, and parking options. Successfully scheduled viewing.",
        outcome: "Viewing scheduled for Saturday at 2pm",
        sentiment: "Very Positive",
      },
      {
        id: 7,
        type: "human_sms",
        timestamp: "Today at 10:25 AM",
        from: "Sarah Johnson",
        to: "Richard Feynman",
        content: "Hi Richard! Great talking to you. Confirming our viewing on Saturday at 2pm. See you then!",
        direction: "outbound",
        handledBy: { name: "Sarah Johnson", type: "human" },
      },
      {
        id: 8,
        type: "human_sms",
        timestamp: "Today at 10:27 AM",
        from: "Richard Feynman",
        to: "+1 (650) 518-1788",
        content: "Perfect! See you Saturday.",
        direction: "inbound",
        handledBy: { name: "Sarah Johnson", type: "human" },
      },
      {
        id: 9,
        type: "human_sms",
        timestamp: "Today at 2:45 PM",
        from: "Richard Feynman",
        to: "+1 (650) 518-1788",
        content: "Quick question - is there in-unit laundry?",
        direction: "inbound",
        handledBy: { name: "Sarah Johnson", type: "human" },
      },
    ],
  },
  {
    id: 2,
    name: "James Maxwell",
    email: "james@example.com",
    phone: "+1 (555) 234-5678",
    company: "Cambridge University",
    type: "Seller",
    status: "pending",
    source: "Referral",
    value: "$320,000",
    addedDate: "2024-03-05",
    lastContact: "1 day ago",
    agentTeam: "Real Estate Team A",
    agentTeamPhone: "+1 (650) 518-1788",
    messages: [
      {
        id: 11,
        type: "ai_call",
        timestamp: "Today at 1:30 PM",
        from: "QufeiAI Agent",
        to: "James Maxwell",
        content: "Hello James, this is calling from QufeiAI. We noticed you inquired about our properties. Would you like to schedule a property tour?",
        duration: "1m 12s",
        direction: "outbound",
        handledBy: { name: "Outbound Call Agent", type: "ai" },
        callSummary: "Reached out to lead, introduced services. Lead expressed mild interest but requested callback later.",
        outcome: "Callback requested for next week",
        sentiment: "Neutral",
      },
    ],
  },
  {
    id: 3,
    name: "Marie Curie",
    email: "marie@example.com",
    phone: "+1 (555) 345-6789",
    company: "Sorbonne",
    type: "Buyer",
    status: "completed",
    source: "Cold Call",
    value: "$280,000",
    addedDate: "2024-02-28",
    lastContact: "3 hours ago",
    agentTeam: "Real Estate Team B",
    agentTeamPhone: "+1 (650) 669-1427",
    messages: [
      {
        id: 12,
        type: "ai_sms",
        timestamp: "Today at 11:00 AM",
        from: "QufeiAI Agent",
        to: "Marie Curie",
        content: "Hi Marie! Thanks for your interest in our properties. We'll be reaching out soon to discuss your needs. Reply STOP to opt out.",
        direction: "outbound",
        handledBy: { name: "Welcome SMS Agent", type: "ai" },
      },
    ],
  },
];

// Generate conversations from contacts
export const mockConversations: Conversation[] = mockContacts
  .filter(contact => contact.messages.length > 0)
  .map(contact => {
    const lastMessage = contact.messages[contact.messages.length - 1];
    return {
      id: contact.id,
      contactId: contact.id,
      contactName: contact.name,
      contactPhone: contact.phone,
      agentTeam: contact.agentTeam || "Not Assigned",
      currentHandler: contact.messages.find(m => m.handledBy.type === "human")
        ? { name: "Sarah Johnson", type: "human" as const }
        : { name: contact.messages[contact.messages.length - 1]?.handledBy.name || "AI Agent", type: "ai" as const },
      status: contact.status,
      lastMessage: lastMessage.content || `${lastMessage.type} - ${lastMessage.duration || ""}`,
      lastMessageTime: lastMessage.timestamp.includes("Today") ? "2 min ago" : "3 hours ago",
      unreadCount: contact.id === 1 ? 1 : 0,
      messageIds: contact.messages.map(m => m.id),
    };
  });

// Helper function to get messages for a conversation
export function getMessagesForConversation(conversationId: number): Message[] {
  const contact = mockContacts.find(c => c.id === conversationId);
  return contact?.messages || [];
}

// Helper function to get contact by ID
export function getContactById(contactId: number): Contact | undefined {
  return mockContacts.find(c => c.id === contactId);
}

// Extract all calls for Call History page
export const mockCalls = mockContacts.flatMap(contact =>
  contact.messages
    .filter(m => m.type === "ai_call" || m.type === "human_call")
    .map(call => ({
      ...call,
      contact: contact.name,
      contactId: contact.id,
      phone: contact.phone,
    }))
);
