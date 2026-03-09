"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bot, Plus, Search, Settings, Phone, Users } from "lucide-react";
import Link from "next/link";

const mockAgentTeams = [
  {
    id: 1,
    name: "Real Estate Team A",
    phoneNumber: "+1 (650) 518-1788",
    agents: [
      { name: "Inbound Call Agent", trigger: "incoming_call", action: "ai_call", active: true },
      { name: "Outbound Call Agent", trigger: "lead_added_to_campaign", action: "ai_call", active: true },
      { name: "Welcome SMS Agent", trigger: "lead_added_to_campaign", action: "send_sms", active: true },
      { name: "Follow-up Call (48h)", trigger: "no_response_48h", action: "ai_call", active: true },
      { name: "SMS Reply Bot", trigger: "inbound_sms", action: "send_sms", active: true },
    ],
    contactsAssigned: 45,
    campaignsActive: 3,
  },
  {
    id: 2,
    name: "Real Estate Team B",
    phoneNumber: "+1 (650) 669-1427",
    agents: [
      { name: "Inbound Call Agent", trigger: "incoming_call", action: "ai_call", active: true },
      { name: "Outbound Call Agent", trigger: "lead_added_to_campaign", action: "ai_call", active: true },
      { name: "Follow-up Call (7d)", trigger: "no_response_7d", action: "ai_call", active: false },
      { name: "SMS Reply Bot", trigger: "inbound_sms", action: "send_sms", active: true },
    ],
    contactsAssigned: 23,
    campaignsActive: 1,
  },
];

export default function AgentTeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Teams</h1>
          <p className="text-muted-foreground">
            Manage phone numbers and their AI agent teams
          </p>
        </div>
        <Link href="/settings/agents/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Agent Team
          </Button>
        </Link>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">What is an Agent Team?</h3>
              <p className="text-sm text-blue-700 mt-1">
                An Agent Team is a collection of specialized AI agents assigned to a phone number.
                Each agent handles one specific task (inbound calls, SMS replies, follow-ups, etc.).
                When you assign a contact or campaign to a team, all agents in that team work together automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agent teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {mockAgentTeams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{team.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{team.phoneNumber}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {team.agents.filter(a => a.active).length} active agents
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/settings/agents/${team.id}`}>
                  <Button>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Team
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Agent List */}
              <div>
                <h4 className="font-semibold mb-3 text-sm">Agents in Team</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {team.agents.map((agent, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{agent.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-xs">
                              {agent.trigger.replace(/_/g, " ")}
                            </Badge>
                            <span className="text-xs text-muted-foreground">→</span>
                            <Badge variant="outline" className="text-xs">
                              {agent.action.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge variant={agent.active ? "default" : "secondary"} className="text-xs">
                        {agent.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Stats */}
              <div className="flex items-center gap-6 pt-3 border-t text-sm">
                <div>
                  <span className="text-muted-foreground">Contacts Assigned:</span>{" "}
                  <span className="font-semibold">{team.contactsAssigned}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Active Campaigns:</span>{" "}
                  <span className="font-semibold">{team.campaignsActive}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
