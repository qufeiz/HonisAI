"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  GitBranch,
  Play,
  X,
  Calendar,
  Database,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type NodeType = "trigger" | "action" | "delay" | "condition";

interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config: any;
  position: { x: number; y: number };
}

const mockWorkflow: WorkflowNode[] = [
  {
    id: "1",
    type: "trigger",
    label: "Lead Assigned",
    config: { trigger: "lead_assigned" },
    position: { x: 50, y: 50 },
  },
  {
    id: "2",
    type: "action",
    label: "Send Welcome SMS",
    config: { channel: "sms", message: "Hi! Thanks for your interest..." },
    position: { x: 50, y: 200 },
  },
  {
    id: "3",
    type: "delay",
    label: "Wait 2 hours",
    config: { duration: 2, unit: "hours" },
    position: { x: 50, y: 350 },
  },
  {
    id: "4",
    type: "action",
    label: "AI Call",
    config: { channel: "call", script: "Qualification script..." },
    position: { x: 50, y: 500 },
  },
  {
    id: "5",
    type: "condition",
    label: "Contact Reached?",
    config: { field: "call_status", operator: "equals", value: "completed" },
    position: { x: 50, y: 650 },
  },
  {
    id: "6",
    type: "action",
    label: "Send Follow-up SMS",
    config: { channel: "sms", message: "We tried calling you..." },
    position: { x: 300, y: 800 },
  },
  {
    id: "7",
    type: "action",
    label: "Book Appointment",
    config: { channel: "calendar", action: "book_slot" },
    position: { x: -200, y: 800 },
  },
];

const getNodeIcon = (type: NodeType) => {
  switch (type) {
    case "trigger":
      return <Play className="h-4 w-4" />;
    case "action":
      return <Zap className="h-4 w-4" />;
    case "delay":
      return <Clock className="h-4 w-4" />;
    case "condition":
      return <GitBranch className="h-4 w-4" />;
  }
};

const getNodeColor = (type: NodeType) => {
  switch (type) {
    case "trigger":
      return "bg-green-100 border-green-300 text-green-700";
    case "action":
      return "bg-blue-100 border-blue-300 text-blue-700";
    case "delay":
      return "bg-yellow-100 border-yellow-300 text-yellow-700";
    case "condition":
      return "bg-purple-100 border-purple-300 text-purple-700";
  }
};

export default function WorkflowEditorPage() {
  const params = useParams();
  const [nodes, setNodes] = useState<WorkflowNode[]>(mockWorkflow);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
    setSheetOpen(true);
  };

  const addNode = (type: NodeType) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type,
      label: `New ${type}`,
      config: {},
      position: { x: 50, y: nodes.length * 150 + 50 },
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="border-b bg-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/settings/agents/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Workflow Editor</h1>
            <p className="text-sm text-muted-foreground">
              Real Estate Lead Qualifier
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Test Workflow</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Workflow
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <div className="w-64 border-r bg-muted/30 p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="font-semibold mb-3">Add Nodes</h3>
            <div className="space-y-2">
              <button
                onClick={() => addNode("trigger")}
                className="w-full flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-accent transition-colors text-left"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-green-100 text-green-700">
                  <Play className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Trigger</p>
                  <p className="text-xs text-muted-foreground">Start event</p>
                </div>
              </button>

              <button
                onClick={() => addNode("action")}
                className="w-full flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-accent transition-colors text-left"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-700">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Action</p>
                  <p className="text-xs text-muted-foreground">Perform task</p>
                </div>
              </button>

              <button
                onClick={() => addNode("delay")}
                className="w-full flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-accent transition-colors text-left"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-yellow-100 text-yellow-700">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Delay</p>
                  <p className="text-xs text-muted-foreground">Wait period</p>
                </div>
              </button>

              <button
                onClick={() => addNode("condition")}
                className="w-full flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-accent transition-colors text-left"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-100 text-purple-700">
                  <GitBranch className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Condition</p>
                  <p className="text-xs text-muted-foreground">If/then logic</p>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Phone className="mr-2 h-3 w-3" />
                AI Call
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="mr-2 h-3 w-3" />
                Send SMS
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="mr-2 h-3 w-3" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-3 w-3" />
                Book Calendar
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-grid-pattern overflow-auto">
          <div className="absolute inset-0 p-8">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Draw connections between nodes */}
              {nodes.map((node, idx) => {
                if (idx < nodes.length - 1) {
                  const nextNode = nodes[idx + 1];
                  return (
                    <line
                      key={`line-${node.id}`}
                      x1={node.position.x + 150}
                      y1={node.position.y + 70}
                      x2={nextNode.position.x + 150}
                      y2={nextNode.position.y}
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                }
                return null;
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#cbd5e1" />
                </marker>
              </defs>
            </svg>

            {/* Workflow Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className="absolute"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                }}
              >
                <Card
                  className={`w-[300px] cursor-pointer hover:shadow-lg transition-shadow ${getNodeColor(
                    node.type
                  )}`}
                  onClick={() => handleNodeClick(node)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNodeIcon(node.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {node.type}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">
                          {node.label}
                        </h4>
                        <p className="text-xs opacity-80 line-clamp-2">
                          {node.type === "action" && node.config.channel && (
                            <span>Channel: {node.config.channel}</span>
                          )}
                          {node.type === "delay" && (
                            <span>
                              {node.config.duration} {node.config.unit}
                            </span>
                          )}
                          {node.type === "trigger" && (
                            <span>On {node.config.trigger?.replace("_", " ")}</span>
                          )}
                          {node.type === "condition" && (
                            <span>Check: {node.config.field}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Configuration Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          {selectedNode && (
            <>
              <SheetHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle>Configure Node</SheetTitle>
                    <Badge variant="outline" className="mt-2 capitalize">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSheetOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>

              <div className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="node-label">Node Label</Label>
                  <Input
                    id="node-label"
                    value={selectedNode.label}
                    onChange={(e) =>
                      setSelectedNode({ ...selectedNode, label: e.target.value })
                    }
                  />
                </div>

                {selectedNode.type === "trigger" && (
                  <div className="space-y-2">
                    <Label htmlFor="trigger-type">Trigger Event</Label>
                    <Select defaultValue={selectedNode.config.trigger}>
                      <SelectTrigger id="trigger-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead_assigned">Lead Assigned</SelectItem>
                        <SelectItem value="inbound_call">Inbound Call</SelectItem>
                        <SelectItem value="form_submitted">Form Submitted</SelectItem>
                        <SelectItem value="appointment_booked">
                          Appointment Booked
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedNode.type === "action" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="action-channel">Channel</Label>
                      <Select defaultValue={selectedNode.config.channel}>
                        <SelectTrigger id="action-channel">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">Phone Call</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="calendar">Calendar Booking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedNode.config.channel === "sms" && (
                      <div className="space-y-2">
                        <Label htmlFor="sms-message">SMS Message</Label>
                        <Textarea
                          id="sms-message"
                          rows={4}
                          placeholder="Enter your SMS message..."
                          defaultValue={selectedNode.config.message}
                        />
                      </div>
                    )}

                    {selectedNode.config.channel === "call" && (
                      <div className="space-y-2">
                        <Label htmlFor="call-script">Call Script</Label>
                        <Textarea
                          id="call-script"
                          rows={6}
                          placeholder="Enter AI call script..."
                          defaultValue={selectedNode.config.script}
                        />
                      </div>
                    )}

                    {selectedNode.config.channel === "email" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="email-subject">Subject</Label>
                          <Input
                            id="email-subject"
                            placeholder="Email subject line..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email-body">Email Body</Label>
                          <Textarea
                            id="email-body"
                            rows={8}
                            placeholder="Enter email content..."
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                {selectedNode.type === "delay" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="delay-duration">Duration</Label>
                      <Input
                        id="delay-duration"
                        type="number"
                        defaultValue={selectedNode.config.duration}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delay-unit">Unit</Label>
                      <Select defaultValue={selectedNode.config.unit}>
                        <SelectTrigger id="delay-unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {selectedNode.type === "condition" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="condition-field">Field to Check</Label>
                      <Select defaultValue={selectedNode.config.field}>
                        <SelectTrigger id="condition-field">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call_status">Call Status</SelectItem>
                          <SelectItem value="sms_replied">SMS Replied</SelectItem>
                          <SelectItem value="email_opened">Email Opened</SelectItem>
                          <SelectItem value="appointment_status">
                            Appointment Status
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition-operator">Operator</Label>
                      <Select defaultValue={selectedNode.config.operator}>
                        <SelectTrigger id="condition-operator">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="not_equals">Not Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="greater_than">Greater Than</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition-value">Value</Label>
                      <Input
                        id="condition-value"
                        defaultValue={selectedNode.config.value}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">Save Changes</Button>
                  <Button variant="destructive" className="flex-1">
                    Delete Node
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
