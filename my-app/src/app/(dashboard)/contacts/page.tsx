"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Download,
  Filter,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Send,
  PhoneIncoming,
  Bot,
  User,
  PhoneOutgoing,
  ExternalLink,
  X,
  ArrowRightLeft,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllContacts, getMessagesForContact } from "@/lib/supabase/queries";

const oldMockContacts = [
  {
    id: 1,
    name: "Richard Feynman",
    initials: "RF",
    phone: "+1 650 518 1788",
    email: "richard.f@example.com",
    type: "Seller",
    callDate: "01/30/26 9:07 AM",
    duration: "02:08",
    outcome: "transfer-attempted" as const,
    stage: "Active",
    status: "not-reached" as const,
    attempts: 1,
    inCall: false,
    nextCallAt: "N/A",
    externalId: "7b5c8a9-csR1-4163-3Yv4-0f9b62c6eb57",
    contactStatus: "Not reached",
    agentTeam: "Real Estate Team A",
    agentTeamPhone: "+1 (650) 518-1788",
    callAttempts: [
      { date: "Feb 28, 2024", time: "2:30 PM", outcome: "Not reached", duration: "0:00" },
      { date: "Feb 27, 2024", time: "10:15 AM", outcome: "Voicemail", duration: "0:45" },
    ],
    timeline: [
      {
        id: 1,
        type: "call" as const,
        callId: 2,
        direction: "outbound" as const,
        status: "completed" as const,
        duration: "2 minutes",
        summary: "Brief conversation about property inquiry. Contact showed interest in viewing available listings.",
        time: "2:30 PM",
        date: "Feb 28"
      },
      {
        id: 2,
        type: "message" as const,
        channel: "sms" as const,
        sender: "AI",
        text: "Hi Richard, this is calling from QufeiAI...",
        time: "2:30 PM",
        date: "Feb 28"
      },
      {
        id: 3,
        type: "message" as const,
        channel: "sms" as const,
        sender: "Richard",
        text: "I'm interested in selling my property",
        time: "3:45 PM",
        date: "Feb 27"
      },
    ]
  },
  {
    id: 2,
    name: "James Maxwell",
    initials: "JM",
    phone: "+1 650 518 1788",
    email: "james.m@example.com",
    type: "Buyer",
    callDate: "01/30/26 9:01 AM",
    duration: "00:22",
    outcome: "callback-requested" as const,
    stage: "Active",
    status: "active" as const,
    attempts: 3,
    inCall: true,
    nextCallAt: "Yes",
    externalId: "8c6d9b0-dsS2-5274-4Zw5-1g0c73d7fc68",
    contactStatus: "Reached",
    agentTeam: "Real Estate Team B",
    agentTeamPhone: "+1 (650) 669-1427",
    callAttempts: [
      { date: "Feb 29, 2024", time: "11:00 AM", outcome: "Connected", duration: "3:22" },
      { date: "Feb 28, 2024", time: "4:15 PM", outcome: "Transfer successful", duration: "5:10" },
    ],
    timeline: [
      {
        id: 1,
        type: "call" as const,
        callId: 1,
        direction: "outbound" as const,
        status: "completed" as const,
        duration: "3 minutes",
        summary: "Max sought a quote from Solar Solutions for a new HVAC system due to heating costs.",
        time: "11:00 AM",
        date: "Feb 29"
      },
      {
        id: 2,
        type: "message" as const,
        channel: "sms" as const,
        sender: "AI",
        text: "Hello James, following up on your inquiry...",
        time: "11:00 AM",
        date: "Feb 29"
      },
      {
        id: 3,
        type: "message" as const,
        channel: "email" as const,
        sender: "James",
        text: "Yes, I'd like to schedule a viewing",
        time: "11:05 AM",
        date: "Feb 29"
      },
    ]
  },
  {
    id: 3,
    name: "Niels Bohr",
    initials: "NB",
    phone: "+1 650 679 4960",
    email: "niels.b@example.com",
    type: "Seller",
    callDate: "01/30/26 8:59 AM",
    duration: "01:07",
    outcome: "callback-requested" as const,
    stage: "Active",
    status: "not-reached" as const,
    attempts: 2,
    inCall: false,
    nextCallAt: "N/A",
    externalId: "9d7e0c1-etT3-6385-5Ax6-2h1d84e8gd79",
    contactStatus: "Not reached",
    agentTeam: "Real Estate Team A",
    agentTeamPhone: "+1 (650) 518-1788",
    callAttempts: [
      { date: "Feb 28, 2024", time: "9:30 AM", outcome: "Not reached", duration: "0:00" },
    ],
    timeline: []
  },
  {
    id: 4,
    name: "Marie Curie",
    initials: "MC",
    phone: "+1 650 518 1788",
    email: "marie.c@example.com",
    type: "Buyer",
    callDate: "01/30/26 8:51 AM",
    duration: "01:28",
    outcome: "callback-requested" as const,
    stage: "Active",
    status: "active" as const,
    attempts: 2,
    inCall: false,
    nextCallAt: "N/A",
    externalId: "0a8f1d2-fuU4-7496-6By7-3i2e95f9he80",
    contactStatus: "Reached",
    agentTeam: "Real Estate Team A",
    agentTeamPhone: "+1 (650) 518-1788",
    callAttempts: [],
    timeline: []
  },
  {
    id: 5,
    name: "Albert Einstein",
    initials: "AE",
    phone: "+1 650 518 1788",
    email: "albert.e@example.com",
    type: "Seller",
    callDate: "01/30/26 8:44 AM",
    duration: "00:56",
    outcome: "callback-requested" as const,
    stage: "Active",
    status: "not-reached" as const,
    attempts: 1,
    inCall: false,
    nextCallAt: "N/A",
    externalId: "1b9g2e3-gvV5-8507-7Cz8-4j3f06g0if91",
    contactStatus: "Not reached",
    agentTeam: null,
    agentTeamPhone: null,
    callAttempts: [],
    timeline: []
  },
];

export default function ContactsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [leadTypeFilter, setLeadTypeFilter] = useState("all");
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [selectedContactMessages, setSelectedContactMessages] = useState<any[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [callHistoryOpen, setCallHistoryOpen] = useState(true);
  const [dynamicVarsOpen, setDynamicVarsOpen] = useState(false);
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messageChannel, setMessageChannel] = useState<"sms" | "email" | "whatsapp">("sms");

  // Fetch contacts from Supabase
  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      const data = await getAllContacts();
      setContacts(data);
      setLoading(false);
    }
    fetchContacts();
  }, []);

  // Fetch messages when a contact is selected
  useEffect(() => {
    async function fetchMessages() {
      if (selectedContact?.id) {
        const messages = await getMessagesForContact(selectedContact.id);
        setSelectedContactMessages(messages);
      }
    }
    fetchMessages();
  }, [selectedContact]);

  const handleContactClick = (contact: typeof mockContacts[0]) => {
    setSelectedContact(contact);
    setSheetOpen(true);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", {
        text: messageText,
        channel: messageChannel,
        contactId: selectedContact?.id,
      });
      setMessageText("");
    }
  };

  const handleViewCallDetails = (callId: number) => {
    router.push(`/calls?callId=${callId}`);
  };

  const handleCallContact = (contact: typeof mockContacts[0], e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Calling contact:", contact.phone);
    // Implement call functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your leads and contact information
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Compact Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={leadTypeFilter} onValueChange={setLeadTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Full-Width Contact Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Agent Team</TableHead>
                <TableHead>Lead Type</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading contacts...
                  </TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleContactClick(contact)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {contact.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{contact.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.phone}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.email || '-'}
                  </TableCell>
                  <TableCell>
                    {contact.agent_teams ? (
                      <div className="text-sm">
                        <div className="font-medium">{contact.agent_teams.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.agent_teams.phone_number}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>{contact.contact_type || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(contact.last_contact_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={contact.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleCallContact(contact, e)}
                      className="hover:bg-primary/10"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slide-in Contact Detail Panel */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} modal={false}>
        <SheetContent className="w-[600px] sm:max-w-[600px] p-0 flex flex-col">
          {selectedContact && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {selectedContact.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-lg">{selectedContact.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">
                      Contact ID: {selectedContact.id.split('-')[0]}...
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="flex-1 overflow-hidden m-0 mt-4">
                  <ScrollArea className="h-full">
                    <div className="px-6 space-y-4 pb-6">
                      {/* Contact Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Phone</span>
                          </div>
                          <span className="text-sm font-medium">{selectedContact.phone}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Email</span>
                          </div>
                          <span className="text-sm font-medium">{selectedContact.email}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Lead Type</span>
                          <span className="text-sm font-medium">{selectedContact.type}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Contact status</span>
                          <StatusBadge status={selectedContact.status} />
                        </div>
                      </div>

                      <Separator />

                      {/* Agent Team Assignment */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Agent Team</h4>
                        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                          <div>
                            <label className="text-sm text-muted-foreground">Assigned Team</label>
                            <Select defaultValue={selectedContact.agentTeam || "none"}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Not Assigned</SelectItem>
                                <SelectItem value="Real Estate Team A">
                                  Real Estate Team A
                                </SelectItem>
                                <SelectItem value="Real Estate Team B">
                                  Real Estate Team B
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {selectedContact.agentTeam && (
                            <div className="text-sm">
                              <p className="text-muted-foreground">Team Phone:</p>
                              <p className="font-medium">{selectedContact.agentTeamPhone}</p>
                            </div>
                          )}
                          <Button className="w-full">Update Agent Team</Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Human Assignment */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Human Assignment</h4>
                        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              <Bot className="h-3 w-3 mr-1" />
                              Currently handled by AI
                            </Badge>
                          </div>
                          <div className="text-sm space-y-2">
                            <p className="text-muted-foreground">
                              When assigned to a human, all calls/SMS to the team number will be routed to the human agent.
                              The lead continues using the same number (proxy).
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Assign to Human Agent</label>
                            <Select defaultValue="none">
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Keep with AI</SelectItem>
                                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                                <SelectItem value="mike">Mike Chen</SelectItem>
                                <SelectItem value="emma">Emma Williams</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full" variant="outline">
                            <User className="mr-2 h-4 w-4" />
                            Assign to Human
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Call Attempt History - Collapsible */}
                      <Collapsible open={callHistoryOpen} onOpenChange={setCallHistoryOpen}>
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:underline">
                          <span className="font-semibold">Call attempt history</span>
                          {callHistoryOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-2">
                          {selectedContactMessages.length > 0 ? (
                            selectedContactMessages.map((call, idx) => (
                              <div key={idx} className="rounded-lg border p-3 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{call.timestamp}</span>
                                  <span className="text-xs text-muted-foreground">{call.direction}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-muted-foreground">{call.outcome || 'Completed'}</span>
                                  <span className="font-medium">{call.duration}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No call attempts yet</p>
                          )}
                        </CollapsibleContent>
                      </Collapsible>

                      <Separator />

                      {/* Dynamic Variables - Collapsible */}
                      <Collapsible open={dynamicVarsOpen} onOpenChange={setDynamicVarsOpen}>
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:underline">
                          <span className="font-semibold">Dynamic variables</span>
                          {dynamicVarsOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-2">
                          <div className="rounded-lg border p-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Property Type</span>
                              <span className="font-medium">Single Family</span>
                            </div>
                          </div>
                          <div className="rounded-lg border p-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Budget</span>
                              <span className="font-medium">$500K - $750K</span>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="messages" className="flex-1 overflow-hidden m-0 flex flex-col h-full mt-4">
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="px-6 space-y-4 pb-4">
                        {selectedContactMessages.length > 0 ? (
                          selectedContactMessages.map((message: any) => {
                            // Render transfer events
                            if (message.type === "transfer") {
                              return (
                                <div key={message.id} className="flex items-center justify-center">
                                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 max-w-md w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                      <ArrowRightLeft className="h-4 w-4 text-orange-600" />
                                      <p className="font-semibold text-sm text-orange-900">Call Transfer</p>
                                      <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                                    </div>
                                    <p className="text-sm text-orange-700">
                                      {message.transferDetails?.from} → {message.transferDetails?.to}
                                    </p>
                                    <p className="text-xs text-orange-600 mt-1">
                                      {message.transferDetails?.reason}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            // Render notification events
                            if (message.type === "notification") {
                              return (
                                <div key={message.id} className="flex items-center justify-center">
                                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 max-w-md w-full">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Bell className="h-4 w-4 text-yellow-600" />
                                      <p className="font-semibold text-sm text-yellow-900">Notification</p>
                                      <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                                    </div>
                                    <p className="text-sm text-yellow-700 mt-1">
                                      {message.transferDetails?.reason}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            // Render call events
                            if (message.type === "ai_call" || message.type === "human_call") {
                              const isExpanded = expandedCallId === message.id;
                              return (
                                <div key={message.id} className="rounded-lg border bg-muted/30 p-3">
                                  <div
                                    className="flex cursor-pointer items-start gap-3"
                                    onClick={() => setExpandedCallId(isExpanded ? null : message.id)}
                                  >
                                    <div className={cn(
                                      "flex h-8 w-8 items-center justify-center rounded-full",
                                      message.direction === "outbound" ? "bg-blue-100" : "bg-green-100"
                                    )}>
                                      {message.direction === "outbound" ? (
                                        <PhoneOutgoing className="h-4 w-4 text-blue-600" />
                                      ) : (
                                        <PhoneIncoming className="h-4 w-4 text-green-600" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">
                                          {message.direction === "outbound" ? "Outbound Call" : "Inbound Call"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {message.timestamp}
                                        </span>
                                      </div>
                                      <div className="mt-1 flex items-center gap-2">
                                        <Badge variant={message.handledBy.type === "ai" ? "secondary" : "default"} className="text-xs">
                                          {message.handledBy.type === "ai" ? <Bot className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                                          {message.handledBy.name}
                                        </Badge>
                                        {message.duration && (
                                          <span className="text-xs text-muted-foreground">
                                            {message.duration}
                                          </span>
                                        )}
                                      </div>

                                      {isExpanded && (
                                        <div className="mt-3 space-y-2">
                                          <Separator />
                                          {message.callSummary && (
                                            <div>
                                              <p className="text-xs font-semibold mb-1">Call Summary</p>
                                              <p className="text-sm text-muted-foreground leading-relaxed">
                                                {message.callSummary}
                                              </p>
                                            </div>
                                          )}
                                          {message.outcome && (
                                            <div>
                                              <p className="text-xs font-semibold mb-1">Outcome</p>
                                              <p className="text-sm text-muted-foreground">
                                                {message.outcome}
                                              </p>
                                            </div>
                                          )}
                                          {message.sentiment && (
                                            <div>
                                              <p className="text-xs font-semibold mb-1">Sentiment</p>
                                              <p className="text-sm text-muted-foreground">
                                                {message.sentiment}
                                              </p>
                                            </div>
                                          )}
                                          <div className="flex gap-2 mt-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="w-full"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewCallDetails(message.id);
                                              }}
                                            >
                                              <ExternalLink className="mr-2 h-3 w-3" />
                                              View Full Details & Transcript
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Render SMS/Email messages
                            const isAI = message.type.startsWith("ai_");
                            const messageType = message.type.replace("ai_", "").replace("human_", "");

                            return (
                              <div
                                key={message.id}
                                className={cn(
                                  "flex gap-3",
                                  message.direction === "outbound" ? "flex-row-reverse" : ""
                                )}
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback
                                    className={cn(
                                      message.direction === "outbound"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    )}
                                  >
                                    {message.direction === "outbound" ? (isAI ? "AI" : selectedContact.initials.charAt(0)) : selectedContact.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={cn(
                                    "max-w-[80%] rounded-lg p-3",
                                    message.direction === "outbound"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  )}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    {messageType === "email" && <Mail className="h-3 w-3" />}
                                    {messageType === "sms" && <MessageSquare className="h-3 w-3" />}
                                    <span className="text-xs opacity-70 uppercase">{messageType}</span>
                                    {message.direction === "outbound" && (
                                      <Badge
                                        variant={message.handledBy.type === "ai" ? "secondary" : "default"}
                                        className={cn(
                                          "text-xs ml-auto bg-white/20 border-white/30 text-primary-foreground"
                                        )}
                                      >
                                        {message.handledBy.type === "ai" ? <Bot className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                                        {message.handledBy.name}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                  <p
                                    className={cn(
                                      "mt-1 text-xs",
                                      message.direction === "outbound"
                                        ? "text-primary-foreground/70"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="font-semibold">No messages yet</h3>
                            <p className="text-sm text-muted-foreground">
                              Message history will appear here
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4 bg-background shrink-0">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Select value={messageChannel} onValueChange={(value: any) => setMessageChannel(value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sms">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                SMS
                              </div>
                            </SelectItem>
                            <SelectItem value="email">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                              </div>
                            </SelectItem>
                            <SelectItem value="whatsapp">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                WhatsApp
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder={`Type your ${messageChannel} message...`}
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press Enter to send, Shift+Enter for new line
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
