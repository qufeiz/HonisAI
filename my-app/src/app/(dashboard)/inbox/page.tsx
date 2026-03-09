"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  MessageSquare,
  Mail,
  ArrowRightLeft,
  Send,
  User,
  Bot,
  Search,
  Filter,
  Bell,
  ExternalLink,
} from "lucide-react";
import { getAllConversations, getMessagesForContact } from "@/lib/supabase/queries";
import { type MessageType, type Message, type Conversation } from "@/lib/mockData";

export default function InboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCallId, setExpandedCallId] = useState<number | null>(null);

  const handleViewCallDetails = (callId: number) => {
    router.push(`/calls?callId=${callId}`);
  };

  // Fetch all conversations
  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      const data = await getAllConversations();
      setConversations(data);
      if (data.length > 0) {
        setSelectedConversation(data[0]);
      }
      setLoading(false);
    }
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    async function fetchMessages() {
      if (selectedConversation?.contact_id) {
        const msgs = await getMessagesForContact(selectedConversation.contact_id);
        setMessages(msgs);
      }
    }
    fetchMessages();
  }, [selectedConversation]);

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "ai_call":
      case "human_call":
        return <Phone className="h-4 w-4" />;
      case "ai_sms":
      case "human_sms":
        return <MessageSquare className="h-4 w-4" />;
      case "ai_email":
        return <Mail className="h-4 w-4" />;
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4" />;
      case "notification":
        return <Bell className="h-4 w-4" />;
    }
  };

  const getMessageColor = (type: MessageType) => {
    if (type === "transfer") return "text-orange-600 bg-orange-50";
    if (type === "notification") return "text-yellow-600 bg-yellow-50";
    if (type.startsWith("ai_")) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesStatus = filterStatus === "all" || conv.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      conv.contacts?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.contacts?.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* Conversations List */}
      <div className="w-96 flex flex-col border-r bg-background">
        <div className="p-4 border-b space-y-3">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conversations</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No conversations found</div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation?.id === conv.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </Avatar>
                    <div>
                      <p className="font-semibold">{conv.contacts?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{conv.contacts?.phone || ""}</p>
                    </div>
                  </div>
                  {conv.unread_count > 0 && (
                    <Badge variant="default" className="h-5 px-2 text-xs">
                      {conv.unread_count}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {conv.agent_teams?.name || "No Team"}
                  </Badge>
                  <Badge
                    variant={conv.current_handler_type === "ai" ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {conv.current_handler_type === "ai" ? (
                      <Bot className="h-3 w-3 mr-1" />
                    ) : (
                      <User className="h-3 w-3 mr-1" />
                    )}
                    {conv.current_handler_name || "AI Agent"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{conv.last_message || "No messages"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {conv.last_message_at ? new Date(conv.last_message_at).toLocaleString() : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Conversation Detail */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedConversation.contacts?.name || "Unknown"}</h2>
                <p className="text-sm text-muted-foreground">{selectedConversation.contacts?.phone || ""}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedConversation.agent_teams?.name || "No Team"}</Badge>
                  <Badge
                    variant={
                      selectedConversation.current_handler_type === "ai" ? "secondary" : "default"
                    }
                  >
                    {selectedConversation.current_handler_type === "ai" ? (
                      <Bot className="h-3 w-3 mr-1" />
                    ) : (
                      <User className="h-3 w-3 mr-1" />
                    )}
                    Handled by {selectedConversation.current_handler_name || "AI Agent"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedConversation.current_handler_type === "ai" ? (
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Assign to Human
                  </Button>
                ) : (
                  <Button variant="outline">
                    <Bot className="mr-2 h-4 w-4" />
                    Return to AI
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Messages Timeline */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "transfer" ? (
                  <div className="flex items-center justify-center">
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 max-w-md">
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
                ) : message.type === "notification" ? (
                  <div className="flex items-center justify-center">
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 max-w-md">
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
                ) : (
                  <div
                    className={`flex ${
                      message.direction === "outbound" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-lg rounded-lg p-4 ${
                        message.direction === "outbound"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      } ${
                        message.type === "ai_call" || message.type === "human_call"
                          ? "cursor-pointer hover:opacity-80"
                          : ""
                      }`}
                      onClick={() => {
                        if (message.type === "ai_call" || message.type === "human_call") {
                          setExpandedCallId(expandedCallId === message.id ? null : message.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded ${
                            message.direction === "outbound"
                              ? "bg-white/20"
                              : getMessageColor(message.type)
                          }`}
                        >
                          {getMessageIcon(message.type)}
                        </div>
                        <p className="font-semibold text-sm">{message.from}</p>
                        {message.duration && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              message.direction === "outbound"
                                ? "border-white/30 text-primary-foreground"
                                : ""
                            }`}
                          >
                            {message.duration}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">{message.timestamp}</p>
                        {message.direction === "outbound" && (
                          <Badge
                            variant={message.handledBy.type === "ai" ? "secondary" : "outline"}
                            className="text-xs bg-white/20 border-white/30 text-primary-foreground"
                          >
                            {message.handledBy.type === "ai" ? (
                              <Bot className="h-3 w-3 mr-1" />
                            ) : (
                              <User className="h-3 w-3 mr-1" />
                            )}
                            {message.handledBy.name}
                          </Badge>
                        )}
                      </div>

                      {/* Expanded Call Details */}
                      {expandedCallId === message.id && (message.type === "ai_call" || message.type === "human_call") && (
                        <div className="mt-3 pt-3 border-t border-white/20 space-y-3">
                          <div>
                            <p className="text-xs font-semibold mb-1">Call Summary</p>
                            <p className="text-xs opacity-90">
                              {message.type === "ai_call"
                                ? "AI successfully engaged with lead, answered questions about property amenities and pricing."
                                : "Human agent provided detailed information and scheduled property viewing."}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-1">Outcome</p>
                            <p className="text-xs opacity-90">
                              {message.type === "ai_call"
                                ? "Transferred to human agent for detailed discussion"
                                : "Viewing scheduled for Saturday at 2pm"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-foreground"
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
                )}
              </div>
            ))}
          </div>

          {/* Reply Section */}
          {selectedConversation.current_handler_type === "human" && (
            <div className="p-6 border-t">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={3}
                  />
                  <Button className="px-6">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your reply will be sent from {selectedConversation.agent_teams?.name || "Team"} phone number (proxy)
                </p>
              </div>
            </div>
          )}

          {selectedConversation.current_handler_type === "ai" && (
            <div className="p-6 border-t bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                This conversation is currently handled by AI. Assign to human to reply manually.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>Select a conversation to view details</p>
        </div>
      )}
    </div>
  );
}
