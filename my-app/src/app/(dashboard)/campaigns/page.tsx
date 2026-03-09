"use client";

import { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Download,
  Phone,
  X,
  Filter,
  CheckCircle2,
  XCircle,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockCampaignContacts = [
  {
    id: 1,
    name: "Richard Feynman",
    initials: "RF",
    phone: "+1 650 518 1788",
    campaign: "Outbound Calling",
    attempts: 3,
    lastCall: "01/30/26 9:07 AM",
    duration: "02:08",
    outcome: "transfer-attempted" as const,
    inCall: false,
    nextCallAt: "02/01/26 2:00 PM",
    conversationOccurred: true,
    summary: "Brief conversation about property inquiry. Contact showed interest in viewing available listings.",
    handledBy: { type: "ai" as const, name: "AI Agent Mike" },
    toolCalls: [],
    callHistory: [
      { date: "Feb 28, 2024", time: "2:30 PM", outcome: "Not reached", duration: "0:00" },
      { date: "Feb 27, 2024", time: "10:15 AM", outcome: "Voicemail", duration: "0:45" },
      { date: "Feb 26, 2024", time: "3:20 PM", outcome: "Transfer attempted", duration: "2:08" },
    ],
    transfer: {
      attempted: true,
      successful: false,
      transferredTo: "+1 (555) 456-7890",
      transferredToName: "Agent Sarah Johnson",
      timestamp: "9:07 AM",
      warmTransferSms: true,
      smsContent: "Incoming call from Richard Feynman regarding property viewing inquiry."
    }
  },
  {
    id: 2,
    name: "James Maxwell",
    initials: "JM",
    phone: "+1 650 518 1788",
    campaign: "Outbound Calling",
    attempts: 5,
    lastCall: "01/30/26 9:01 AM",
    duration: "00:22",
    outcome: "callback-requested" as const,
    inCall: true,
    nextCallAt: "In Progress",
    conversationOccurred: true,
    summary: "Contact requested a callback to discuss property details further.",
    handledBy: { type: "human" as const, name: "Sarah Chen" },
    toolCalls: [
      { tool: "sms_notification", action: "Sent callback confirmation SMS", success: true }
    ],
    callHistory: [
      { date: "Feb 29, 2024", time: "11:00 AM", outcome: "Connected", duration: "3:22" },
      { date: "Feb 28, 2024", time: "4:15 PM", outcome: "Transfer successful", duration: "5:10" },
    ],
    transfer: null
  },
  {
    id: 3,
    name: "Niels Bohr",
    initials: "NB",
    phone: "+1 650 679 4960",
    campaign: "Outbound Calling",
    attempts: 2,
    lastCall: "01/30/26 8:59 AM",
    duration: "01:07",
    outcome: "callback-requested" as const,
    inCall: false,
    nextCallAt: "02/02/26 10:00 AM",
    conversationOccurred: true,
    summary: "Spoke with contact about property options in their area.",
    handledBy: { type: "ai" as const, name: "AI Agent Sarah" },
    toolCalls: [],
    callHistory: [
      { date: "Feb 28, 2024", time: "9:30 AM", outcome: "Not reached", duration: "0:00" },
      { date: "Feb 25, 2024", time: "1:45 PM", outcome: "Callback requested", duration: "1:07" },
    ],
    transfer: null
  },
  {
    id: 4,
    name: "Marie Curie",
    initials: "MC",
    phone: "+1 650 518 1788",
    campaign: "Outbound Calling",
    attempts: 4,
    lastCall: "01/30/26 8:51 AM",
    duration: "01:28",
    outcome: "transfer-successful" as const,
    inCall: false,
    nextCallAt: "None",
    conversationOccurred: true,
    summary: "Successfully transferred to agent. Contact interested in investment properties.",
    handledBy: { type: "ai" as const, name: "AI Agent Sarah" },
    toolCalls: [
      { tool: "calendar_booking", action: "Booked property viewing for Feb 29, 2024", success: true },
      { tool: "crm_lead", action: "Created high-priority lead in CRM", success: true }
    ],
    callHistory: [
      { date: "Feb 29, 2024", time: "8:51 AM", outcome: "Transfer successful", duration: "1:28" },
    ],
    transfer: {
      attempted: true,
      successful: true,
      transferredTo: "+1 (555) 789-0123",
      transferredToName: "Agent John Smith",
      timestamp: "8:51 AM",
      warmTransferSms: true,
      smsContent: "Incoming call from Marie Curie regarding investment properties. High priority client."
    }
  },
  {
    id: 5,
    name: "Albert Einstein",
    initials: "AE",
    phone: "+1 650 518 1788",
    campaign: "Outbound Calling",
    attempts: 1,
    lastCall: "01/30/26 8:44 AM",
    duration: "00:56",
    outcome: "not-reached" as const,
    inCall: false,
    nextCallAt: "02/05/26 11:00 AM",
    conversationOccurred: false,
    summary: "",
    handledBy: { type: "human" as const, name: "John Davis" },
    toolCalls: [],
    callHistory: [
      { date: "Jan 30, 2024", time: "8:44 AM", outcome: "Not reached", duration: "0:00" },
    ],
    transfer: null
  },
];

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<typeof mockCampaignContacts[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleContactClick = (contact: typeof mockCampaignContacts[0]) => {
    setSelectedContact(contact);
    setSheetOpen(true);
  };

  const handleCall = (contact: typeof mockCampaignContacts[0], e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Calling:", contact.phone);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage call campaigns and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Compact Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="outbound">Outbound Calling</SelectItem>
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

      {/* Full-Width Campaign Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Contacts ({mockCampaignContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Last Call</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>In Call</TableHead>
                <TableHead>Next Call At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaignContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleContactClick(contact)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{contact.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.phone}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{contact.campaign}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {contact.attempts}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {contact.lastCall}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {contact.duration}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={contact.outcome} />
                  </TableCell>
                  <TableCell>
                    {contact.inCall ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {contact.nextCallAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleCall(contact, e)}
                      className="hover:bg-primary/10"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slide-in Campaign Contact Detail Panel */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} modal={false}>
        <SheetContent className="w-[700px] sm:max-w-[700px] p-0 flex flex-col">
          {selectedContact && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex-1">
                  <SheetTitle className="text-lg">{selectedContact.name}</SheetTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{selectedContact.phone}</span>
                    <Badge variant="outline">{selectedContact.campaign}</Badge>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="performance" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="recording">Recording</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="performance" className="flex-1 overflow-hidden m-0 mt-4">
                  <ScrollArea className="h-full">
                    <div className="px-6 space-y-4 pb-6">
                      {/* Campaign Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Attempts:</p>
                          <p className="font-semibold">{selectedContact.attempts}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Duration:</p>
                          <p className="font-semibold">{selectedContact.duration}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Handled By */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Handled By</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{selectedContact.handledBy.name}</span>
                            <Badge variant={selectedContact.handledBy.type === "ai" ? "default" : "secondary"} className="text-xs">
                              {selectedContact.handledBy.type === "ai" ? "AI" : "Human"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* In Call Status */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">In Call</span>
                          <div className="flex items-center gap-2">
                            {selectedContact.inCall ? (
                              <>
                                <span className="text-sm text-green-600">Yes</span>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </>
                            ) : (
                              <>
                                <span className="text-sm text-muted-foreground">No</span>
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Conversation Occurred */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Conversation occurred</span>
                          <div className="flex items-center gap-2">
                            {selectedContact.conversationOccurred ? (
                              <>
                                <span className="text-sm text-green-600">Yes</span>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </>
                            ) : (
                              <>
                                <span className="text-sm text-muted-foreground">No</span>
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {selectedContact.summary && (
                        <>
                          <Separator />
                          {/* Summary */}
                          <div>
                            <h4 className="font-semibold mb-2">Summary</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {selectedContact.summary}
                            </p>
                          </div>
                        </>
                      )}

                      <Separator />

                      {/* Call Outcome */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Last Outcome</span>
                          <StatusBadge status={selectedContact.outcome} />
                        </div>
                      </div>

                      <Separator />

                      {/* Next Call Scheduled */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Next Call Scheduled</span>
                          <span className="text-sm font-medium">{selectedContact.nextCallAt}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Call Attempt History */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Call Attempt History</h4>
                        <div className="space-y-2">
                          {selectedContact.callHistory.map((attempt, idx) => (
                            <div key={idx} className="rounded-lg border p-3 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{attempt.date}</span>
                                <span className="text-xs text-muted-foreground">{attempt.time}</span>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-muted-foreground">{attempt.outcome}</span>
                                <span className="font-medium">{attempt.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tool Calls Section */}
                      {selectedContact.toolCalls && selectedContact.toolCalls.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h4 className="font-semibold">Tool Calls</h4>
                            <div className="space-y-2">
                              {selectedContact.toolCalls.map((toolCall, idx) => (
                                <div key={idx} className="rounded-lg border p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {toolCall.tool.replace('_', ' ')}
                                        </Badge>
                                        {toolCall.success ? (
                                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <XCircle className="h-3 w-3 text-red-600" />
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">{toolCall.action}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Transfer Details Section */}
                      {selectedContact.transfer && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h4 className="font-semibold">Transfer Details</h4>

                            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Transfer Attempted</span>
                                <div className="flex items-center gap-2">
                                  {selectedContact.transfer.attempted ? (
                                    <>
                                      <span className="text-sm text-green-600">Yes</span>
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-sm text-muted-foreground">No</span>
                                      <XCircle className="h-4 w-4 text-muted-foreground" />
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Transfer Successful</span>
                                <div className="flex items-center gap-2">
                                  {selectedContact.transfer.successful ? (
                                    <>
                                      <span className="text-sm text-green-600">Yes</span>
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-sm text-red-600">No</span>
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    </>
                                  )}
                                </div>
                              </div>

                              <Separator />

                              <div>
                                <span className="text-sm text-muted-foreground">Transferred To</span>
                                <p className="font-medium mt-1">{selectedContact.transfer.transferredToName}</p>
                                <p className="text-sm text-muted-foreground">{selectedContact.transfer.transferredTo}</p>
                              </div>

                              <div>
                                <span className="text-sm text-muted-foreground">Transfer Timestamp</span>
                                <p className="font-medium mt-1">{selectedContact.transfer.timestamp}</p>
                              </div>

                              <Separator />

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Warm Transfer SMS Sent</span>
                                <div className="flex items-center gap-2">
                                  {selectedContact.transfer.warmTransferSms ? (
                                    <>
                                      <span className="text-sm text-green-600">Yes</span>
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-sm text-muted-foreground">No</span>
                                      <XCircle className="h-4 w-4 text-muted-foreground" />
                                    </>
                                  )}
                                </div>
                              </div>

                              {selectedContact.transfer.warmTransferSms && selectedContact.transfer.smsContent && (
                                <div>
                                  <span className="text-sm text-muted-foreground">SMS Content</span>
                                  <p className="text-sm mt-1 p-3 bg-background rounded border">
                                    "{selectedContact.transfer.smsContent}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="transcript" className="flex-1 overflow-hidden m-0 mt-4">
                  <ScrollArea className="h-full">
                    <div className="px-6 pb-6">
                      <div className="space-y-4">
                        {selectedContact.conversationOccurred ? (
                          <>
                            <div className="rounded-lg bg-muted p-4">
                              <p className="text-xs text-muted-foreground mb-1">AI Agent - 00:05</p>
                              <p className="text-sm">Hello, this is calling from QufeiAI regarding your property inquiry...</p>
                            </div>
                            <div className="rounded-lg bg-primary/10 p-4">
                              <p className="text-xs text-muted-foreground mb-1">{selectedContact.name} - 00:15</p>
                              <p className="text-sm">Yes, I'm interested in learning more about the property.</p>
                            </div>
                            <div className="rounded-lg bg-muted p-4">
                              <p className="text-xs text-muted-foreground mb-1">AI Agent - 00:25</p>
                              <p className="text-sm">Great! I'd be happy to provide you with more details...</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-muted-foreground">No transcript available</p>
                            <p className="text-sm text-muted-foreground mt-1">Conversation did not occur</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="recording" className="flex-1 overflow-hidden m-0 mt-4">
                  <ScrollArea className="h-full">
                    <div className="px-6 pb-6">
                      {selectedContact.conversationOccurred ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 rounded-lg border p-4">
                            <Button size="icon" variant="outline">
                              <Play className="h-4 w-4" />
                            </Button>
                            <div className="flex-1">
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div className="h-2 w-1/3 rounded-full bg-primary" />
                              </div>
                              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                <span>1:05</span>
                                <span>{selectedContact.duration}</span>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">
                              Recording quality: High
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Format: MP3
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Play className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No recording available</p>
                          <p className="text-sm text-muted-foreground mt-1">Call was not completed</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
