export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          vapi_phone_number_id: string | null
          vapi_assistant_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          vapi_phone_number_id?: string | null
          vapi_assistant_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          vapi_phone_number_id?: string | null
          vapi_assistant_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'agent' | 'viewer'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'agent' | 'viewer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'agent' | 'viewer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_teams: {
        Row: {
          id: string
          organization_id: string
          name: string
          phone_number: string | null
          vapi_phone_number_id: string | null
          vapi_assistant_id: string | null
          transfer_enabled: boolean
          human_agent_name: string | null
          human_agent_phone: string | null
          transfer_conditions: Json | null
          warm_transfer_sms_template: string | null
          knowledge_base_urls: string[] | null
          calendar_enabled: boolean
          calendar_type: string | null
          crm_enabled: boolean
          crm_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          phone_number?: string | null
          vapi_phone_number_id?: string | null
          vapi_assistant_id?: string | null
          transfer_enabled?: boolean
          human_agent_name?: string | null
          human_agent_phone?: string | null
          transfer_conditions?: Json | null
          warm_transfer_sms_template?: string | null
          knowledge_base_urls?: string[] | null
          calendar_enabled?: boolean
          calendar_type?: string | null
          crm_enabled?: boolean
          crm_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          phone_number?: string | null
          vapi_phone_number_id?: string | null
          vapi_assistant_id?: string | null
          transfer_enabled?: boolean
          human_agent_name?: string | null
          human_agent_phone?: string | null
          transfer_conditions?: Json | null
          warm_transfer_sms_template?: string | null
          knowledge_base_urls?: string[] | null
          calendar_enabled?: boolean
          calendar_type?: string | null
          crm_enabled?: boolean
          crm_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          organization_id: string
          agent_team_id: string | null
          name: string
          email: string | null
          phone: string
          company: string | null
          assigned_to_user_id: string | null
          assigned_to_type: 'ai' | 'human'
          status: 'active' | 'completed' | 'pending' | 'future'
          contact_type: string | null
          source: string | null
          value: number | null
          vapi_contact_id: string | null
          added_date: string
          last_contact_at: string
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          organization_id: string
          agent_team_id?: string | null
          name: string
          email?: string | null
          phone: string
          company?: string | null
          assigned_to_user_id?: string | null
          assigned_to_type?: 'ai' | 'human'
          status?: 'active' | 'completed' | 'pending' | 'future'
          contact_type?: string | null
          source?: string | null
          value?: number | null
          vapi_contact_id?: string | null
          added_date?: string
          last_contact_at?: string
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          organization_id?: string
          agent_team_id?: string | null
          name?: string
          email?: string | null
          phone?: string
          company?: string | null
          assigned_to_user_id?: string | null
          assigned_to_type?: 'ai' | 'human'
          status?: 'active' | 'completed' | 'pending' | 'future'
          contact_type?: string | null
          source?: string | null
          value?: number | null
          vapi_contact_id?: string | null
          added_date?: string
          last_contact_at?: string
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
      }
      calls: {
        Row: {
          id: string
          organization_id: string
          contact_id: string
          agent_team_id: string | null
          vapi_call_id: string | null
          vapi_assistant_id: string | null
          direction: 'inbound' | 'outbound'
          from_number: string
          to_number: string
          status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer'
          duration: number | null
          recording_url: string | null
          transcript: string | null
          call_summary: string | null
          outcome: string | null
          sentiment: string | null
          handled_by_type: 'ai' | 'human'
          handled_by_user_id: string | null
          handled_by_name: string | null
          transferred: boolean
          transferred_to: string | null
          transferred_to_name: string | null
          transfer_reason: string | null
          started_at: string | null
          ended_at: string | null
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          organization_id: string
          contact_id: string
          agent_team_id?: string | null
          vapi_call_id?: string | null
          vapi_assistant_id?: string | null
          direction: 'inbound' | 'outbound'
          from_number: string
          to_number: string
          status?: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer'
          duration?: number | null
          recording_url?: string | null
          transcript?: string | null
          call_summary?: string | null
          outcome?: string | null
          sentiment?: string | null
          handled_by_type?: 'ai' | 'human'
          handled_by_user_id?: string | null
          handled_by_name?: string | null
          transferred?: boolean
          transferred_to?: string | null
          transferred_to_name?: string | null
          transfer_reason?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          organization_id?: string
          contact_id?: string
          agent_team_id?: string | null
          vapi_call_id?: string | null
          vapi_assistant_id?: string | null
          direction?: 'inbound' | 'outbound'
          from_number?: string
          to_number?: string
          status?: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer'
          duration?: number | null
          recording_url?: string | null
          transcript?: string | null
          call_summary?: string | null
          outcome?: string | null
          sentiment?: string | null
          handled_by_type?: 'ai' | 'human'
          handled_by_user_id?: string | null
          handled_by_name?: string | null
          transferred?: boolean
          transferred_to?: string | null
          transferred_to_name?: string | null
          transfer_reason?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
      }
      conversations: {
        Row: {
          id: string
          organization_id: string
          contact_id: string
          agent_team_id: string | null
          status: 'active' | 'resolved' | 'pending'
          current_handler_type: 'ai' | 'human'
          current_handler_user_id: string | null
          current_handler_name: string | null
          last_message_content: string | null
          last_message_type: string | null
          last_message_at: string | null
          unread_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          contact_id: string
          agent_team_id?: string | null
          status?: 'active' | 'resolved' | 'pending'
          current_handler_type?: 'ai' | 'human'
          current_handler_user_id?: string | null
          current_handler_name?: string | null
          last_message_content?: string | null
          last_message_type?: string | null
          last_message_at?: string | null
          unread_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          contact_id?: string
          agent_team_id?: string | null
          status?: 'active' | 'resolved' | 'pending'
          current_handler_type?: 'ai' | 'human'
          current_handler_user_id?: string | null
          current_handler_name?: string | null
          last_message_content?: string | null
          last_message_type?: string | null
          last_message_at?: string | null
          unread_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
