'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket as IoSocket } from 'socket.io-client';

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
  const socketRef = useRef<IoSocket | null>(null);

  const connect = useCallback(function doConnect() {
    if (!projectId || typeof window === 'undefined') return;

    // Disconnect existing socket if any
    socketRef.current?.disconnect();

    const token = localStorage.getItem('access_token') ?? '';

    // Use Socket.io client — matches the NestJS WebSocketGateway
    // Namespace is part of the URL, not the options object
    const socket = io(`${WS_URL}/ws`, {
      transports: ['websocket', 'polling'],
      auth: { token: `Bearer ${token}` },
      reconnectionDelay: 3000,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => {
      setConnected(true);
      // Join the specific project room
      socket.emit('join:project', { projectId, token: `Bearer ${token}` });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('api:call', (call: ApiCallEvent) => {
      setEvents(prev => [call, ...prev].slice(0, maxEvents));
      onApiCall?.(call);
    });

    socket.on('project:stats', (stats: ProjectStats) => {
      onStats?.(stats);
    });

    socketRef.current = socket;
  }, [projectId, maxEvents, onApiCall, onStats]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [connect]);

  function clearEvents() { setEvents([]); }

  return { connected, events, clearEvents };
}
