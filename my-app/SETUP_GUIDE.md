# QufeiAI Setup Guide

Complete setup guide for deploying QufeiAI with Vapi + Supabase.

---

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Vapi account
- Basic understanding of SQL and webhooks

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Set a strong database password
5. Select a region (choose closest to your users)
6. Wait for project to finish setting up (~2 minutes)

### 1.2 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the entire contents of `/supabase/schema.sql`
4. Paste and click **Run**
5. Verify tables created under **Database** → **Tables**

### 1.3 Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (safe for frontend)
   - **service_role key**: `eyJhbGc...` (keep secret!)

### 1.4 Update Environment Variables

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
```

---

## Step 2: Vapi Setup

### 2.1 Create Vapi Account

1. Go to [vapi.ai](https://vapi.ai)
2. Sign up for an account
3. Complete onboarding

### 2.2 Create AI Assistant

1. In Vapi dashboard, go to **Assistants**
2. Click **Create Assistant**
3. Configure:
   - **Name**: Real Estate AI Agent
   - **Model**: gpt-4o-realtime (recommended)
   - **Voice**: Choose from available voices
   - **First Message**: "Hi, this is calling from QufeiAI. How can I help you today?"

4. **System Prompt**:
```
You are a professional real estate AI assistant for QufeiAI. Your role is to:

1. Answer questions about properties politely and professionally
2. Qualify leads by asking about their needs, timeline, and budget
3. Book property viewings when requested
4. Transfer to a human agent when the lead requests or for complex situations

Guidelines:
- Be friendly but professional
- Listen actively to customer needs
- Take notes on important details (urgency, budget, timeline)
- Offer to book appointments when interest is shown
- Transfer to human if customer explicitly asks or situation is complex

If you detect high urgency (move-in within 1-2 weeks), immediately notify the team.
```

5. **Functions** (Tool Calling):

Add these functions:

**Function 1: lookup_contact**
```json
{
  "name": "lookup_contact",
  "description": "Look up contact information by phone number",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "The phone number to look up"
      }
    },
    "required": ["phone"]
  },
  "url": "https://your-project.supabase.co/functions/v1/vapi-webhook"
}
```

**Function 2: transfer_to_human**
```json
{
  "name": "transfer_to_human",
  "description": "Transfer the call to a human agent when requested or needed",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "Reason for transfer"
      }
    },
    "required": ["reason"]
  },
  "url": "https://your-project.supabase.co/functions/v1/vapi-webhook"
}
```

**Function 3: book_appointment**
```json
{
  "name": "book_appointment",
  "description": "Book a property viewing appointment",
  "parameters": {
    "type": "object",
    "properties": {
      "datetime": {
        "type": "string",
        "description": "ISO 8601 datetime for appointment"
      },
      "property_id": {
        "type": "string",
        "description": "Property identifier"
      }
    },
    "required": ["datetime"]
  },
  "url": "https://your-project.supabase.co/functions/v1/vapi-webhook"
}
```

6. **Analysis Prompt**:
```
Analyze this call and provide:
1. Summary: Brief overview of the conversation
2. Outcome: What happened (e.g., "Appointment booked", "Transferred to human", "Not interested")
3. Sentiment: Positive, Neutral, or Negative
4. Key details: Budget, timeline, specific needs
```

7. Save the assistant and copy the **Assistant ID**

### 2.3 Get Phone Number

1. Go to **Phone Numbers**
2. Click **Buy Number**
3. Choose country and area code
4. Select a number
5. Assign to your assistant
6. Copy the **Phone Number ID**

### 2.4 Configure Webhooks

1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-project.supabase.co/functions/v1/vapi-webhook`
3. Enable these events:
   - ✅ end-of-call-report
   - ✅ function-call
   - ✅ status-update

### 2.5 Get API Keys

1. Go to **Settings** → **API Keys**
2. Copy:
   - **Public Key**: `xxx` (safe for frontend)
   - **Private Key**: `xxx` (keep secret!)

### 2.6 Update Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
VAPI_PRIVATE_KEY=your-vapi-private-key
```

---

## Step 3: Deploy Edge Function

### 3.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 3.2 Login to Supabase

```bash
supabase login
```

### 3.3 Link to Your Project

```bash
supabase link --project-ref your-project-ref
```

(Find project ref in Supabase dashboard URL)

### 3.4 Deploy Edge Function

```bash
supabase functions deploy vapi-webhook
```

### 3.5 Set Environment Variables

```bash
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3.6 Test Edge Function

```bash
curl -X POST https://your-project.supabase.co/functions/v1/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{"message": {"type": "status-update", "status": "test"}}'
```

Should return: `{"success":true}`

---

## Step 4: Initial Data Setup

### 4.1 Create Test Organization

In Supabase SQL Editor:

```sql
INSERT INTO organizations (name, vapi_assistant_id, vapi_phone_number_id)
VALUES (
  'Your Real Estate Company',
  'your-vapi-assistant-id',
  'your-vapi-phone-number-id'
)
RETURNING *;
```

Copy the returned `id`.

### 4.2 Create Test User

```sql
-- First create auth user (do this in Supabase Auth UI)
-- Then link to users table:

INSERT INTO users (id, organization_id, email, full_name, role)
VALUES (
  'your-auth-user-id',  -- From auth.users
  'your-org-id',        -- From step 4.1
  'you@example.com',
  'Your Name',
  'admin'
);
```

### 4.3 Create Agent Team

```sql
INSERT INTO agent_teams (
  organization_id,
  name,
  phone_number,
  vapi_phone_number_id,
  vapi_assistant_id,
  transfer_enabled,
  human_agent_name,
  human_agent_phone
)
VALUES (
  'your-org-id',
  'Real Estate Team A',
  '+1-650-518-1788',
  'your-vapi-phone-number-id',
  'your-vapi-assistant-id',
  true,
  'Sarah Johnson',
  '+1-555-123-4567'  -- Your actual phone for transfers
)
RETURNING *;
```

### 4.4 Create Test Contact

```sql
INSERT INTO contacts (
  organization_id,
  agent_team_id,
  name,
  phone,
  email,
  status,
  contact_type,
  source
)
VALUES (
  'your-org-id',
  'your-team-id',  -- From step 4.3
  'Test Contact',
  '+1-555-999-8888',  -- Use your real phone to test
  'test@example.com',
  'active',
  'Buyer',
  'Website'
);
```

---

## Step 5: Run Application

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Start Dev Server

```bash
npm run dev
```

### 5.3 Open Application

Navigate to http://localhost:3000

---

## Step 6: Test the System

### 6.1 Test Inbound Call

1. Call your Vapi phone number from your phone
2. Have a conversation with the AI
3. Ask it to transfer you to a human
4. After call ends, check:
   - Call appears in Call History page
   - Conversation shows in Inbox
   - Contact is created/updated

### 6.2 Test Outbound Call (from UI)

This feature needs to be implemented in the frontend. Example:

```typescript
import { vapi } from '@/lib/vapi/client';

// Start outbound call
const call = await vapi.start({
  phoneNumber: '+1-555-999-8888',
  assistantId: 'your-assistant-id',
});
```

### 6.3 Verify Webhooks

1. Go to Supabase dashboard
2. Check **Edge Functions** → **Logs**
3. You should see webhook events being processed

### 6.4 Check Database

```sql
-- View calls
SELECT * FROM calls ORDER BY created_at DESC LIMIT 10;

-- View conversations
SELECT * FROM conversations ORDER BY last_message_at DESC;

-- View contacts
SELECT * FROM contacts ORDER BY last_contact_at DESC;
```

---

## 🔧 Troubleshooting

### Calls Not Appearing

1. Check Edge Function logs for errors
2. Verify Vapi webhook URL is correct
3. Ensure organization_id exists in database
4. Check Vapi dashboard for call records

### Transfers Not Working

1. Verify human_agent_phone is a valid number
2. Check transfer function response in logs
3. Ensure Vapi has permission to transfer

### Authentication Issues

1. Verify Supabase URL and keys are correct
2. Check RLS policies are enabled
3. Ensure user has organization_id set

---

## 🚀 Next Steps

1. **Customize AI Prompts**: Update assistant prompt in Vapi dashboard
2. **Add More Functions**: Implement calendar booking, CRM integration
3. **Set Up Real-Time Updates**: Use Supabase subscriptions for live inbox
4. **Deploy to Production**: Deploy to Vercel/Netlify
5. **Add SMS/Email**: Extend for multi-channel conversations

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Vapi Docs](https://docs.vapi.ai)
- [Next.js Docs](https://nextjs.org/docs)

---

## 🆘 Need Help?

- Check logs in Supabase Edge Functions
- Review Vapi dashboard for call details
- Test webhooks with curl
- Check database records with SQL queries
