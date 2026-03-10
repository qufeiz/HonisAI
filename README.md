# HonisAI

AI-powered real estate call management platform. Handles inbound/outbound calls via AI agents, auto-transfers to human agents, and tracks all conversations in a unified inbox.

## Features

- **AI Call Handling** — Vapi-powered AI agents answer and qualify leads
- **Smart Transfers** — Auto-transfer to human agents with warm SMS handoff
- **Unified Inbox** — Full conversation history with call transcripts and recordings
- **Call Analytics** — Sentiment analysis, call summaries, and outcomes
- **Contact Management** — Track leads with status, value, and activity history
- **Agent Teams** — Multi-team support with dedicated phone numbers and assistants

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Postgres + Edge Functions)
- **AI Calls**: Vapi.ai
- **Database**: PostgreSQL with Row Level Security

## Getting Started

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) account
- [Vapi](https://vapi.ai) account

### 1. Clone & Install

```bash
git clone https://github.com/qufeiz/HonisAI.git
cd HonisAI/my-app
npm install
```

### 2. Environment Variables

Create `.env.local` in `my-app/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
VAPI_PRIVATE_KEY=your-vapi-private-key
```

### 3. Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor to create all tables.

### 4. Deploy Edge Function

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy vapi-webhook
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Configure Vapi

1. Create an assistant in Vapi dashboard and copy the **Assistant ID**
2. Get a phone number and copy the **Phone Number ID**
3. Set webhook URL to: `https://your-project.supabase.co/functions/v1/vapi-webhook`
4. Enable webhook events: `end-of-call-report`, `function-call`, `status-update`

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── inbox/        # Conversation inbox
│   │   │   ├── calls/        # Call history & transcripts
│   │   │   ├── contacts/     # Contact management
│   │   │   ├── campaigns/    # Campaign management
│   │   │   └── settings/     # Agent team configuration
│   │   └── api/vapi/webhook/ # Vapi webhook handler
│   ├── components/
│   ├── lib/
│   │   ├── supabase/         # Database client & queries
│   │   └── vapi/             # Vapi client & handlers
│   └── types/
├── supabase/
│   ├── schema.sql            # Database schema
│   └── functions/            # Edge functions
└── scripts/                  # Seed data & utilities
```

## Detailed Setup

See [SETUP_GUIDE.md](./my-app/SETUP_GUIDE.md) for full step-by-step setup including Vapi assistant configuration, function calling setup, and troubleshooting.
