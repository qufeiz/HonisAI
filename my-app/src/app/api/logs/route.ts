import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Singleton log store using global to persist across hot reloads
const globalForLogs = globalThis as unknown as {
  logs: any[] | undefined;
};

if (!globalForLogs.logs) {
  globalForLogs.logs = [];
}

const logs = globalForLogs.logs;
const MAX_LOGS = 500;

export function addLog(level: 'info' | 'warn' | 'error', source: string, message: string, data?: any) {
  const log = {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date().toISOString(),
    level,
    source,
    message,
    data,
  };

  logs.unshift(log);

  // Keep only last MAX_LOGS
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }

  console.log(`[${level.toUpperCase()}] [${source}] ${message}`, data || '');
}

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '100');

  return NextResponse.json({
    logs: logs.slice(0, limit),
    total: logs.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { level, source, message, data } = await req.json();
    addLog(level, source, message, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
