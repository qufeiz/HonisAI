"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash2, Bot, Edit, Database, Zap, Calendar, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const mockAgents = [
  {
    id: 1,
    name: "Inbound Call Agent",
    trigger: "incoming_call",
    action: "ai_call",
    prompt: "You are a professional real estate assistant answering incoming calls. Greet the caller warmly, ask how you can help them, qualify their needs, and either schedule a viewing or transfer to an available agent.",
    active: true,
  },
  {
    id: 2,
    name: "Outbound Call Agent",
    trigger: "lead_added_to_campaign",
    action: "ai_call",
    prompt: "You are calling to introduce our real estate services. Ask if they're looking to buy or sell, understand their timeline and budget, and offer to schedule a property viewing.",
    active: true,
  },
  {
    id: 3,
    name: "Welcome SMS Agent",
    trigger: "lead_added_to_campaign",
    action: "send_sms",
    prompt: "Send a friendly welcome message: 'Hi! Thanks for your interest in our properties. We'll be reaching out soon to discuss your needs. Reply STOP to opt out.'",
    active: true,
  },
  {
    id: 4,
    name: "Follow-up Call (48h)",
    trigger: "no_response_48h",
    action: "ai_call",
    prompt: "You are following up with a lead who hasn't responded in 48 hours. Be friendly and not pushy. Ask if they're still interested and if there's a better time to connect.",
    active: true,
  },
  {
    id: 5,
    name: "SMS Reply Bot",
    trigger: "inbound_sms",
    action: "send_sms",
    prompt: "Reply to incoming SMS messages. Answer basic questions about properties, pricing, and viewings. If they want to schedule something, confirm and say an agent will call to finalize details.",
    active: true,
  },
];

export default function AgentTeamConfigPage() {
  const params = useParams();
  const [teamName, setTeamName] = useState("Real Estate Team A");
  const [phoneNumber, setPhoneNumber] = useState("+1 (650) 518-1788");
  const [agents, setAgents] = useState(mockAgents);
  const [editingAgent, setEditingAgent] = useState<number | null>(null);

  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      incoming_call: "Incoming Call",
      lead_added_to_campaign: "Lead Added to Campaign",
      no_response_48h: "No Response in 48h",
      no_response_7d: "No Response in 7 Days",
      inbound_sms: "Inbound SMS",
      "24h_before_appointment": "24h Before Appointment",
    };
    return labels[trigger] || trigger;
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      ai_call: "AI Phone Call",
      send_sms: "Send SMS",
      send_email: "Send Email",
      send_notification: "Send Notification",
    };
    return labels[action] || action;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/settings/agents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Configure Agent Team</h1>
            <p className="text-muted-foreground">
              Manage agents for this phone number
            </p>
          </div>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Team Settings</CardTitle>
              <CardDescription>Basic team configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Agents</span>
                  <span className="font-medium">{agents.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Agents</span>
                  <span className="font-medium">
                    {agents.filter((a) => a.active).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contacts Assigned</span>
                  <span className="font-medium">45</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Transfer & Human Handoff</CardTitle>
              <CardDescription>Configure how to escalate to human agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="enable-transfer">Enable Transfer</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow AI agents to transfer to humans
                  </p>
                </div>
                <Switch id="enable-transfer" defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="human-agent-name">Human Agent Name</Label>
                <Input
                  id="human-agent-name"
                  placeholder="e.g., Sarah Johnson"
                  defaultValue="Sarah Johnson"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="human-agent-phone">Human Agent Phone</Label>
                <Input
                  id="human-agent-phone"
                  placeholder="+1 (555) 123-4567"
                  defaultValue="+1 (555) 456-7890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transfer-conditions">Transfer Conditions</Label>
                <Select defaultValue="qualified">
                  <SelectTrigger id="transfer-conditions">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always transfer</SelectItem>
                    <SelectItem value="qualified">Transfer qualified leads only</SelectItem>
                    <SelectItem value="requested">Only when caller requests</SelectItem>
                    <SelectItem value="complex">For complex questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="warm-transfer-sms">Send Warm Transfer SMS</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify human before transfer
                  </p>
                </div>
                <Switch id="warm-transfer-sms" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warm-sms-template">Warm Transfer SMS Template</Label>
                <Textarea
                  id="warm-sms-template"
                  rows={3}
                  placeholder="SMS sent to human before transfer..."
                  defaultValue="Incoming call from [Contact Name] regarding [Topic]. Customer is ready to discuss [Details]."
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: [Contact Name], [Phone], [Topic], [Details]
                </p>
              </div>

              <Separator />

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                <h4 className="font-semibold text-sm text-blue-900 mb-1">Proxy Number</h4>
                <p className="text-xs text-blue-700">
                  When a human takes over, the lead continues using the team phone number.
                  All calls/SMS to this number are routed to the human agent, and replies
                  show as the team number. Everything is logged in the Inbox.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Documents specific to this team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed p-6 text-center">
                <Database className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Upload team-specific documents
                </p>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-3 w-3" />
                  Upload
                </Button>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Team A Properties.pdf", size: "2.4 MB" },
                  { name: "FAQ.docx", size: "156 KB" },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border p-2">
                    <div>
                      <p className="font-medium text-xs">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tools & Integrations</CardTitle>
              <CardDescription>Enable tools for this team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-sm">Calendar Booking</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allow AI to schedule appointments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold text-sm">CRM Integration</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Create/update leads in CRM
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-start justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-sm">SMS Notifications</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send follow-up SMS messages
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Agents in Team</CardTitle>
                  <CardDescription>
                    Each agent performs one action when triggered
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-3 w-3" />
                  Add Agent
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent) => (
                <Card key={agent.id} className={!agent.active ? "opacity-60" : ""}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Bot className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-semibold">{agent.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {getTriggerLabel(agent.trigger)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">→</span>
                              <Badge variant="secondary" className="text-xs">
                                {getActionLabel(agent.action)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={agent.active}
                            onCheckedChange={(checked) => {
                              const updated = agents.map((a) =>
                                a.id === agent.id ? { ...a, active: checked } : a
                              );
                              setAgents(updated);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEditingAgent(editingAgent === agent.id ? null : agent.id)
                            }
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {editingAgent === agent.id && (
                        <>
                          <Separator />
                          <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                              <Label>Agent Name</Label>
                              <Input
                                value={agent.name}
                                onChange={(e) => {
                                  const updated = agents.map((a) =>
                                    a.id === agent.id ? { ...a, name: e.target.value } : a
                                  );
                                  setAgents(updated);
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Trigger</Label>
                              <Select value={agent.trigger}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="incoming_call">Incoming Call</SelectItem>
                                  <SelectItem value="lead_added_to_campaign">
                                    Lead Added to Campaign
                                  </SelectItem>
                                  <SelectItem value="no_response_48h">
                                    No Response in 48h
                                  </SelectItem>
                                  <SelectItem value="no_response_7d">
                                    No Response in 7 Days
                                  </SelectItem>
                                  <SelectItem value="inbound_sms">Inbound SMS</SelectItem>
                                  <SelectItem value="24h_before_appointment">
                                    24h Before Appointment
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Action</Label>
                              <Select value={agent.action}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ai_call">AI Phone Call</SelectItem>
                                  <SelectItem value="send_sms">Send SMS</SelectItem>
                                  <SelectItem value="send_email">Send Email</SelectItem>
                                  <SelectItem value="send_notification">Send Notification</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>
                                {agent.action === "ai_call"
                                  ? "Call Script / Instructions"
                                  : "Message Template"}
                              </Label>
                              <Textarea
                                rows={6}
                                value={agent.prompt}
                                onChange={(e) => {
                                  const updated = agents.map((a) =>
                                    a.id === agent.id ? { ...a, prompt: e.target.value } : a
                                  );
                                  setAgents(updated);
                                }}
                                placeholder={
                                  agent.action === "ai_call"
                                    ? "Describe how the AI should handle the call..."
                                    : "Enter the message to send..."
                                }
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setEditingAgent(null)}
                              >
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingAgent(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="ml-auto"
                              >
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </>
                      )}

                      {editingAgent !== agent.id && (
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {agent.prompt}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
