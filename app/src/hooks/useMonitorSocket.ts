'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';

export interface ApiCallEvent {
  id: string;
  method: string;
  url: string;
  host: string;
  path: string;
  statusCode?: number;
  latency: number;
  status: string;
  createdAt: string;
}

interface ProjectStats {
  projectId: string;
  total: number;
  errorRate: number;
  avgLatency: number;
}

interface UseMonitorSocketOptions {
  projectId: string;
  onApiCall?: (call: ApiCallEvent) => void;
  onStats?: (stats: ProjectStats) => void;
  maxEvents?: number;
}

export function useMonitorSocket({
  projectId,
  onApiCall,
  onStats,
  maxEvents = 200,
}: UseMonitorSocketOptions) {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<ApiCallEvent[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(function doConnect() {
    if (!projectId || typeof window === 'undefined') return;

    // Use native WebSocket — works with Socket.io when using websocket transport
    const token = localStorage.getItem('access_token') ?? '';
    const wsBase = WS_URL.replace(/^http/, 'ws');
    const ws = new WebSocket(`${wsBase}/ws?token=${encodeURIComponent(token)}`);

    ws.onopen = () => {
      setConnected(true);
      // Join the project room
      ws.send(JSON.stringify({ event: 'join:project', data: { projectId, token: `Bearer ${token}` } }));
    };

    ws.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 3 seconds
      setTimeout(doConnect, 3000);
    };

    ws.onerror = () => ws.close();

    ws.onmessage = (e: MessageEvent) => {
      try {
        const msg = JSON.parse(e.data as string) as { event: string; data: unknown };
        if (msg.event === 'api:call') {
          const call = msg.data as ApiCallEvent;
          setEvents(prev => [call, ...prev].slice(0, maxEvents));
          onApiCall?.(call);
        } else if (msg.event === 'project:stats') {
          onStats?.(msg.data as ProjectStats);
        }
      } catch { /* ignore parse errors */ }
    };

    socketRef.current = ws;
    return ws;
  }, [projectId, maxEvents, onApiCall, onStats]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  function clearEvents() { setEvents([]); }

  return { connected, events, clearEvents };
}
