import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Store recent terminal logs in memory
const terminalLogs: string[] = [];
const MAX_TERMINAL_LOGS = 200;

export function addTerminalLog(log: string) {
  terminalLogs.unshift(log);
  if (terminalLogs.length > MAX_TERMINAL_LOGS) {
    terminalLogs.pop();
  }
}

export async function GET() {
  try {
    // For now, return the in-memory logs
    // In production, you'd want to tail the actual log file or use a logging service

    return NextResponse.json({
      logs: terminalLogs.length > 0 ? terminalLogs : [
        '[System] Terminal logging active',
        '[Info] Logs will appear here in real-time',
      ]
    });
  } catch (error) {
    console.error('Error fetching terminal logs:', error);
    return NextResponse.json(
      { logs: [], error: String(error) },
      { status: 500 }
    );
  }
}
