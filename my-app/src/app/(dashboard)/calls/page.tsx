"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calendar, Phone, Play, CheckCircle2, XCircle, X, Filter, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllCalls } from "@/lib/supabase/queries";

const oldMockCalls = [
  {
    id: 1,
    phone: "+1 650 669 1427",
    contact: "Max Planck",
    direction: "outbound" as const,
    timestamp: "11 minutes ago",
    status: "completed" as const,
    duration: "3 minutes",
    aiDetected: false,
    conversationOccurred: true,
    summary: "Max sought a quote from Solar Solutions for a new HVAC system due to heating costs. He confirmed living in a single-family home with central heating, and the ownership with his wife. They are a household of four, and Max expressed urgency for installation preferably within 8 AM the following day. Solar Solutions adviser to discuss options and receive an initial quote.",
    appointment: { scheduled: true, date: "Dec 02, 2024 at 08:00" },
    followUp: false,
    callTransfer: false,
    handledBy: { type: "ai" as const, name: "AI Agent Sarah" },
    toolCalls: [
      { tool: "calendar_booking", action: "Booked appointment for Dec 02, 2024 at 08:00", success: true },
      { tool: "sms_notification", action: "Sent confirmation SMS to customer", success: true }
    ],
    transfer: {
      attempted: true,
      successful: true,
      transferredTo: "+1 (555) 789-0123",
      transferredToName: "Agent John Smith",
      timestamp: "11:03 AM",
      warmTransferSms: true,
      smsContent: "Incoming call from Max Planck regarding HVAC system quote. Customer is ready to discuss installation options."
    }
  },
  {
    id: 2,
    phone: "+1 650 518 1788",
    contact: "Richard Feynman",
    direction: "outbound" as const,
    timestamp: "43 minutes ago",
    status: "completed" as const,
    duration: "2 minutes",
    aiDetected: true,
    conversationOccurred: true,
    summary: "Brief conversation about property inquiry. Contact showed interest in viewing available listings.",
    appointment: { scheduled: false },
    followUp: true,
    callTransfer: false,
    handledBy: { type: "ai" as const, name: "AI Agent Mike" },
    toolCalls: [],
    transfer: {
      attempted: true,
      successful: false,
      transferredTo: "+1 (555) 456-7890",
      transferredToName: "Agent Sarah Johnson",
      timestamp: "9:45 AM",
      warmTransferSms: true,
      smsContent: "Incoming call from Richard Feynman regarding property viewing inquiry."
    }
  },
  {
    id: 3,
    phone: "+1 650 518 1788",
    contact: "Albert Einstein",
    direction: "outbound" as const,
    timestamp: "44 minutes ago",
    status: "not-reached" as const,
    duration: "0 minutes",
    aiDetected: false,
    conversationOccurred: false,
    summary: "",
    appointment: { scheduled: false },
    followUp: false,
    callTransfer: false,
    handledBy: { type: "ai" as const, name: "AI Agent Sarah" },
    toolCalls: [],
    transfer: null
  },
  {
    id: 4,
    phone: "+1 650 679 4960",
    contact: "Niels Bohr",
    direction: "outbound" as const,
    timestamp: "about 1 hour ago",
    status: "not-reached" as const,
    duration: "0 minutes",
    aiDetected: false,
    conversationOccurred: false,
    summary: "",
    appointment: { scheduled: false },
    followUp: false,
    callTransfer: false,
    handledBy: { type: "human" as const, name: "John Davis" },
    toolCalls: [],
    transfer: null
  },
  {
    id: 5,
    phone: "+44 1865 270000",
    contact: "Ernest Rutherford",
    direction: "outbound" as const,
    timestamp: "about 1 hour ago",
    status: "not-reached" as const,
    duration: "0 minutes",
    aiDetected: false,
    conversationOccurred: false,
    summary: "",
    appointment: { scheduled: false },
    followUp: false,
    callTransfer: false,
    handledBy: { type: "ai" as const, name: "AI Agent Mike" },
    toolCalls: [],
    transfer: null
  },
  {
    id: 6,
    phone: "+44 7772 327658",
    contact: "Marie Curie",
    direction: "outbound" as const,
    timestamp: "about 2 hours ago",
    status: "completed" as const,
    duration: "4 minutes",
    aiDetected: true,
    conversationOccurred: true,
    summary: "Discussed investment opportunities in real estate. Contact requested more information.",
    appointment: { scheduled: true, date: "Dec 05, 2024 at 14:00" },
    followUp: true,
    callTransfer: true,
    handledBy: { type: "human" as const, name: "Sarah Chen" },
    toolCalls: [
      { tool: "calendar_booking", action: "Booked appointment for Dec 05, 2024 at 14:00", success: true },
      { tool: "crm_lead", action: "Created lead in Salesforce", success: true }
    ],
    transfer: {
      attempted: true,
      successful: true,
      transferredTo: "+44 7911 123456",
      transferredToName: "Agent David Miller",
      timestamp: "2:15 PM",
      warmTransferSms: true,
      smsContent: "Incoming call from Marie Curie regarding real estate investment opportunities. High priority client."
    }
  },
];

export default function CallHistoryPage() {
  const searchParams = useSearchParams();
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCall, setSelectedCall] = useState<any | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Fetch all calls
  useEffect(() => {
    async function fetchCalls() {
      setLoading(true);
      const data = await getAllCalls();
      setCalls(data);
      setLoading(false);
    }
    fetchCalls();
  }, []);

  // Auto-open call detail if callId is in URL
  useEffect(() => {
    const callId = searchParams.get("callId");
    if (callId && calls.length > 0) {
      const call = calls.find(c => c.id === callId);
      if (call) {
        setSelectedCall(call);
        setSheetOpen(true);
      }
    }
  }, [searchParams, calls]);

  const handleCallClick = (call: any) => {
    setSelectedCall(call);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Call History</h1>
          <p className="text-muted-foreground">
            View detailed call logs and analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Compact Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not-reached">Not Reached</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Full-Width Call Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Calls ({calls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading calls...</div>
          ) : calls.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No calls found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Handled By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow
                    key={call.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleCallClick(call)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full",
                          call.direction === "outbound" ? "bg-blue-100" : "bg-green-100"
                        )}>
                          <Phone className={cn(
                            "h-4 w-4",
                            call.direction === "outbound" ? "text-blue-600" : "text-green-600"
                          )} />
                        </div>
                        <span className="font-medium">{call.contacts?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {call.from_number}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {call.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(call.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : "0s"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={call.handled_by_type === "ai" ? "secondary" : "default"} className="text-xs">
                        {call.handled_by_type === "ai" ? (
                          <Bot className="h-3 w-3 mr-1" />
                        ) : (
                          <User className="h-3 w-3 mr-1" />
                        )}
                        {call.handled_by_name || "AI Agent"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {call.recording_url && (
                        <Button variant="ghost" size="sm">
                          <Play className="mr-2 h-3 w-3" />
                          Play
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Slide-in Call Detail Panel */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} modal={false}>
        <SheetContent className="w-[700px] sm:max-w-[700px] p-0 flex flex-col">
          {selectedCall && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex-1">
                  <SheetTitle className="text-lg">{selectedCall.contacts?.name || "Unknown"}</SheetTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{selectedCall.from_number}</span>
                    <Badge variant="outline" className="capitalize">
                      {selectedCall.direction}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="analysis" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="analysis">Call analysis</TabsTrigger>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="recording">Recording</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="analysis" className="flex-1 overflow-hidden m-0 mt-4">
                  <ScrollArea className="h-full">
                    <div className="px-6 space-y-4 pb-6">
                      {/* Call Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Call duration:</p>
                          <p className="font-semibold">
                            {selectedCall.duration ? `${Math.floor(selectedCall.duration / 60)}m ${selectedCall.duration % 60}s` : "0s"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Call direction:</p>
                          <Badge variant="outline" className="capitalize">{selectedCall.direction}</Badge>
                        </div>
                      </div>

                      <Separator />

                      {/* Handled By */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Handled By</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{selectedCall.handled_by_name || "AI Agent"}</span>
                            <Badge variant={selectedCall.handled_by_type === "ai" ? "default" : "secondary"} className="text-xs">
                              {selectedCall.handled_by_type === "ai" ? "AI" : "Human"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {selectedCall.call_summary && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold mb-2">Summary</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {selectedCall.call_summary}
                            </p>
                          </div>
                        </>
                      )}

                      {selectedCall.outcome && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold mb-2">Outcome</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {selectedCall.outcome}
                            </p>
                          </div>
                        </>
                      )}

                      {selectedCall.sentiment && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold mb-2">Sentiment</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {selectedCall.sentiment}
                            </p>
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
                        {selectedCall.transcript ? (
                          <div className="rounded-lg bg-muted p-4">
                            <pre className="text-sm whitespace-pre-wrap">{selectedCall.transcript}</pre>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-muted-foreground">No transcript available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="recording" className="flex-1 overflow-hidden m-0 mt-4">
                  <ScrollArea className="h-full">
                    <div className="px-6 pb-6">
                      {selectedCall.recording_url ? (
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
                                <span>0:00</span>
                                <span>{selectedCall.duration ? `${Math.floor(selectedCall.duration / 60)}:${String(selectedCall.duration % 60).padStart(2, '0')}` : "0:00"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">
                              Recording URL: {selectedCall.recording_url}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Play className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No recording available</p>
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
