"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bot, Phone, Calendar, Database, Zap, Save, Plus, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [agentName, setAgentName] = useState("AI Agent Sarah");
  const [agentVoice, setAgentVoice] = useState("female-professional");
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [crmEnabled, setCrmEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="agents">Agent Teams</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user-name">Name</Label>
                <Input
                  id="user-name"
                  defaultValue="User Name"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  defaultValue="user@example.com"
                  placeholder="Your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  defaultValue="Real Estate Co."
                  placeholder="Your company"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Teams Tab */}
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Agent Teams
                  </CardTitle>
                  <CardDescription>
                    Manage your AI agent teams and phone numbers
                  </CardDescription>
                </div>
                <Link href="/settings/agents">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    View All Teams
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Agent Teams bundle multiple specialized AI agents (inbound, outbound, SMS, follow-up)
                under one phone number. Configure team settings, knowledge base, and tools per team.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: "Real Estate Team A",
                    phone: "+1 (650) 518-1788",
                    agents: 5,
                    contacts: 45,
                  },
                  {
                    name: "Real Estate Team B",
                    phone: "+1 (650) 669-1427",
                    agents: 4,
                    contacts: 23,
                  },
                ].map((team, idx) => (
                  <div key={idx} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-xs text-muted-foreground">{team.phone}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Agents</p>
                        <p className="font-semibold">{team.agents}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Contacts</p>
                        <p className="font-semibold">{team.contacts}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Link href="/settings/agents">
                  <Button variant="outline" className="w-full">
                    Manage All Agent Teams
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">Current Plan</h4>
                    <p className="text-2xl font-bold mt-1">Professional</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">$99/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing cycle</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next billing date</span>
                    <span className="font-medium">April 1, 2026</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Change Plan
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Payment Method</h4>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded bg-muted flex items-center justify-center">
                        <span className="text-xs font-semibold">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/2026</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Update</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage global API keys and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Twilio Configuration</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Global Twilio credentials used by all agent teams
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="twilio-sid">Account SID</Label>
                      <Input
                        id="twilio-sid"
                        type="password"
                        placeholder="AC••••••••••••••••••••••••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twilio-token">Auth Token</Label>
                      <Input
                        id="twilio-token"
                        type="password"
                        placeholder="••••••••••••••••••••••••••••••••"
                      />
                    </div>
                    <Button>Save Twilio Settings</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">OpenAI API Key</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Used for AI voice conversations
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">API Key</Label>
                    <Input
                      id="openai-key"
                      type="password"
                      placeholder="sk-••••••••••••••••••••••••••••••••"
                    />
                  </div>
                  <Button className="mt-3">Save OpenAI Key</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
