'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  source: string;
  message: string;
  data?: any;
}

interface VapiCall {
  id: string;
  startedAt: string;
  endedAt?: string;
  endedReason?: string;
  transcript?: string;
  customer?: { number: string };
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [vapiCalls, setVapiCalls] = useState<VapiCall[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchAllLogs();

    if (autoRefresh) {
      const interval = setInterval(fetchAllLogs, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchAllLogs = async () => {
    await Promise.all([
      fetchWebhookLogs(),
      fetchVapiCalls(),
      fetchTerminalLogs(),
    ]);
  };

  const fetchWebhookLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch webhook logs:', error);
    }
  };

  const fetchVapiCalls = async () => {
    try {
      const response = await fetch('/api/logs/vapi-calls');
      if (response.ok) {
        const data = await response.json();
        setVapiCalls(data.calls || []);
      }
    } catch (error) {
      console.error('Failed to fetch Vapi calls:', error);
    }
  };

  const fetchTerminalLogs = async () => {
    try {
      const response = await fetch('/api/logs/terminal');
      if (response.ok) {
        const data = await response.json();
        setTerminalLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch terminal logs:', error);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (!filter) return true;
    return (
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.source.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-muted-foreground">Real-time logs from multiple sources</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '● Live' : '○ Paused'}
          </Button>
          <Button variant="outline" onClick={fetchAllLogs}>
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="webhook" className="w-full">
        <TabsList>
          <TabsTrigger value="webhook">Webhook Logs</TabsTrigger>
          <TabsTrigger value="vapi">Vapi API Calls</TabsTrigger>
          <TabsTrigger value="terminal">Terminal Output</TabsTrigger>
        </TabsList>

        <TabsContent value="webhook">
          <Card className="p-4">
            <Input
              placeholder="Filter logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="space-y-2">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No webhook logs found
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Badge variant={getLevelColor(log.level) as any}>
                      {log.level}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.source}
                        </Badge>
                      </div>
                      <div className="text-sm font-mono break-all">
                        {log.message}
                      </div>
                      {log.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            View data
                          </summary>
                          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="vapi">
          <Card className="p-4">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="space-y-2">
                {vapiCalls.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No Vapi calls found
                  </div>
                ) : (
                  vapiCalls.map((call) => (
                    <div
                      key={call.id}
                      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Badge variant={call.endedReason ? 'secondary' : 'default'}>
                          {call.endedReason || 'in-progress'}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground font-mono">
                              {new Date(call.startedAt).toLocaleString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {call.customer?.number || 'Unknown'}
                            </Badge>
                          </div>
                          <div className="text-sm font-mono break-all text-muted-foreground">
                            {call.id}
                          </div>
                          {call.transcript && (
                            <details className="mt-2">
                              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                View transcript
                              </summary>
                              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap">
                                {call.transcript}
                              </pre>
                            </details>
                          )}
                          {(call as any).messages && (
                            <details className="mt-2">
                              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                View all messages ({(call as any).messages.length})
                              </summary>
                              <div className="mt-2 space-y-1 max-h-96 overflow-y-auto">
                                {(call as any).messages.map((msg: any, i: number) => (
                                  <div key={i} className="bg-muted p-2 rounded">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">
                                        {msg.role}
                                      </Badge>
                                      {msg.time && (
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(msg.time).toLocaleTimeString()}
                                        </span>
                                      )}
                                    </div>
                                    {msg.message && (
                                      <div className="text-xs">{msg.message}</div>
                                    )}
                                    {msg.toolCalls && (
                                      <pre className="text-xs mt-1 text-blue-600">
                                        {JSON.stringify(msg.toolCalls, null, 2)}
                                      </pre>
                                    )}
                                    {msg.result && (
                                      <pre className="text-xs mt-1 text-green-600">
                                        {msg.result}
                                      </pre>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="terminal">
          <Card className="p-4">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="space-y-1">
                {terminalLogs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No terminal logs found
                  </div>
                ) : (
                  terminalLogs.map((log, i) => (
                    <div key={i} className="font-mono text-xs p-2 hover:bg-muted/50">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
