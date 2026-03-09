-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ORGANIZATIONS (Teams/Companies)
-- =====================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  vapi_phone_number_id TEXT,
  vapi_assistant_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USERS (Extends Supabase Auth)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'agent', 'viewer')) DEFAULT 'agent',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AGENT TEAMS
-- =====================================================
CREATE TABLE agent_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT,
  vapi_phone_number_id TEXT,
  vapi_assistant_id TEXT,

  -- Transfer settings
  transfer_enabled BOOLEAN DEFAULT true,
  human_agent_name TEXT,
  human_agent_phone TEXT,
  transfer_conditions JSONB,
  warm_transfer_sms_template TEXT,

  -- Knowledge base
  knowledge_base_urls TEXT[],

  -- Integrations
  calendar_enabled BOOLEAN DEFAULT false,
  calendar_type TEXT,
  crm_enabled BOOLEAN DEFAULT false,
  crm_type TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTACTS
-- =====================================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  agent_team_id UUID REFERENCES agent_teams(id) ON DELETE SET NULL,

  -- Contact info
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  company TEXT,

  -- Assignment
  assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to_type TEXT CHECK (assigned_to_type IN ('ai', 'human')) DEFAULT 'ai',

  -- Status & metadata
  status TEXT CHECK (status IN ('active', 'completed', 'pending', 'future')) DEFAULT 'active',
  contact_type TEXT, -- buyer, seller, etc.
  source TEXT, -- website, referral, cold call, etc.
  value NUMERIC,

  -- Vapi integration
  vapi_contact_id TEXT,

  -- Timestamps
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contact_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on phone for fast lookup
CREATE INDEX contacts_phone_idx ON contacts(phone);
CREATE INDEX contacts_org_idx ON contacts(organization_id);

-- =====================================================
-- CALLS
-- =====================================================
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  agent_team_id UUID REFERENCES agent_teams(id) ON DELETE SET NULL,

  -- Vapi data
  vapi_call_id TEXT UNIQUE,
  vapi_assistant_id TEXT,

  -- Call details
  direction TEXT CHECK (direction IN ('inbound', 'outbound')) NOT NULL,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  status TEXT CHECK (status IN ('queued', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer')) DEFAULT 'queued',

  -- Duration in seconds
  duration INTEGER,

  -- Content
  recording_url TEXT,
  transcript TEXT,

  -- AI Analysis
  call_summary TEXT,
  outcome TEXT,
  sentiment TEXT,

  -- Handler
  handled_by_type TEXT CHECK (handled_by_type IN ('ai', 'human')) DEFAULT 'ai',
  handled_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  handled_by_name TEXT,

  -- Transfer info
  transferred BOOLEAN DEFAULT false,
  transferred_to TEXT,
  transferred_to_name TEXT,
  transfer_reason TEXT,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Additional metadata from Vapi
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX calls_vapi_id_idx ON calls(vapi_call_id);
CREATE INDEX calls_contact_idx ON calls(contact_id);
CREATE INDEX calls_org_idx ON calls(organization_id);
CREATE INDEX calls_created_idx ON calls(created_at DESC);

-- =====================================================
-- MESSAGES (SMS/Email for future)
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,

  -- Message type
  type TEXT CHECK (type IN ('sms', 'email')) NOT NULL,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')) NOT NULL,

  -- Content
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  subject TEXT, -- for email
  content TEXT NOT NULL,

  -- Handler
  handled_by_type TEXT CHECK (handled_by_type IN ('ai', 'human')) DEFAULT 'ai',
  handled_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  handled_by_name TEXT,

  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX messages_contact_idx ON messages(contact_id);
CREATE INDEX messages_created_idx ON messages(created_at DESC);

-- =====================================================
-- CONVERSATIONS (Unified inbox view)
-- =====================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  agent_team_id UUID REFERENCES agent_teams(id) ON DELETE SET NULL,

  -- Status
  status TEXT CHECK (status IN ('active', 'resolved', 'pending')) DEFAULT 'active',

  -- Current handler
  current_handler_type TEXT CHECK (current_handler_type IN ('ai', 'human')) DEFAULT 'ai',
  current_handler_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  current_handler_name TEXT,

  -- Last interaction
  last_message_content TEXT,
  last_message_type TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,

  -- Unread count
  unread_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX conversations_org_idx ON conversations(organization_id);
CREATE INDEX conversations_contact_idx ON conversations(contact_id);
CREATE INDEX conversations_status_idx ON conversations(status);

-- =====================================================
-- CAMPAIGNS (for outbound)
-- =====================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  agent_team_id UUID REFERENCES agent_teams(id) ON DELETE SET NULL,

  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',

  -- Campaign settings
  campaign_type TEXT CHECK (campaign_type IN ('outbound_calls', 'sms', 'email')),
  vapi_assistant_id TEXT,

  -- Scheduling
  scheduled_start TIMESTAMP WITH TIME ZONE,
  scheduled_end TIMESTAMP WITH TIME ZONE,

  -- Stats
  total_contacts INTEGER DEFAULT 0,
  completed_contacts INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- CAMPAIGN CONTACTS (Join table)
-- =====================================================
CREATE TABLE campaign_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,

  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'failed', 'skipped')) DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(campaign_id, contact_id)
);

-- =====================================================
-- NOTIFICATIONS (System alerts)
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,

  -- Link to related entity
  related_type TEXT, -- 'call', 'message', 'contact'
  related_id UUID,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX notifications_user_idx ON notifications(user_id);
CREATE INDEX notifications_read_idx ON notifications(read);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's organization
CREATE OR REPLACE FUNCTION user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- RLS Policies for organizations
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id = user_organization_id());

CREATE POLICY "Admins can update own organization"
  ON organizations FOR UPDATE
  USING (id = user_organization_id());

-- RLS Policies for users
CREATE POLICY "Users can view users in same org"
  ON users FOR SELECT
  USING (organization_id = user_organization_id());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- RLS Policies for contacts
CREATE POLICY "Users can view contacts in own org"
  ON contacts FOR SELECT
  USING (organization_id = user_organization_id());

CREATE POLICY "Users can create contacts in own org"
  ON contacts FOR INSERT
  WITH CHECK (organization_id = user_organization_id());

CREATE POLICY "Users can update contacts in own org"
  ON contacts FOR UPDATE
  USING (organization_id = user_organization_id());

CREATE POLICY "Users can delete contacts in own org"
  ON contacts FOR DELETE
  USING (organization_id = user_organization_id());

-- RLS Policies for calls
CREATE POLICY "Users can view calls in own org"
  ON calls FOR SELECT
  USING (organization_id = user_organization_id());

CREATE POLICY "Users can insert calls in own org"
  ON calls FOR INSERT
  WITH CHECK (organization_id = user_organization_id());

-- RLS Policies for messages
CREATE POLICY "Users can view messages in own org"
  ON messages FOR SELECT
  USING (organization_id = user_organization_id());

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations in own org"
  ON conversations FOR SELECT
  USING (organization_id = user_organization_id());

-- RLS Policies for agent_teams
CREATE POLICY "Users can view agent teams in own org"
  ON agent_teams FOR SELECT
  USING (organization_id = user_organization_id());

CREATE POLICY "Admins can manage agent teams"
  ON agent_teams FOR ALL
  USING (organization_id = user_organization_id());

-- RLS Policies for campaigns
CREATE POLICY "Users can view campaigns in own org"
  ON campaigns FOR SELECT
  USING (organization_id = user_organization_id());

CREATE POLICY "Users can manage campaigns in own org"
  ON campaigns FOR ALL
  USING (organization_id = user_organization_id());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_teams_updated_at BEFORE UPDATE ON agent_teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON calls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update conversation on new call/message
CREATE OR REPLACE FUNCTION update_conversation_on_interaction()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO conversations (
    organization_id,
    contact_id,
    agent_team_id,
    current_handler_type,
    current_handler_user_id,
    current_handler_name,
    last_message_content,
    last_message_type,
    last_message_at,
    status
  )
  SELECT
    NEW.organization_id,
    NEW.contact_id,
    NEW.agent_team_id,
    NEW.handled_by_type,
    NEW.handled_by_user_id,
    NEW.handled_by_name,
    COALESCE(NEW.call_summary, NEW.transcript, 'Call completed'),
    'call',
    NOW(),
    'active'
  WHERE NOT EXISTS (
    SELECT 1 FROM conversations WHERE contact_id = NEW.contact_id
  )
  ON CONFLICT (contact_id)
  DO UPDATE SET
    current_handler_type = NEW.handled_by_type,
    current_handler_user_id = NEW.handled_by_user_id,
    current_handler_name = NEW.handled_by_name,
    last_message_content = COALESCE(NEW.call_summary, NEW.transcript, 'Call completed'),
    last_message_type = 'call',
    last_message_at = NOW(),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation on new call
CREATE TRIGGER update_conversation_on_call
  AFTER INSERT OR UPDATE ON calls
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_interaction();

-- Add unique constraint on conversations.contact_id
ALTER TABLE conversations ADD CONSTRAINT conversations_contact_id_unique UNIQUE (contact_id);
