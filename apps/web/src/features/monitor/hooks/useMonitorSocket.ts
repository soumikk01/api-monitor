'use client';
import { authStorage } from '@/lib/fetchWithAuth';
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

  // Store callbacks in refs so they never cause socket reconnections
  const onApiCallRef = useRef(onApiCall);
  const onStatsRef = useRef(onStats);
  useEffect(() => { onApiCallRef.current = onApiCall; }, [onApiCall]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);

  const connect = useCallback(function doConnect() {
    if (!projectId || typeof window === 'undefined') return;

    // Disconnect existing socket if any
    socketRef.current?.disconnect();

    const token = authStorage.getAccessToken() ?? '';

    const socket = io(`${WS_URL}/ws`, {
      transports: ['websocket', 'polling'],
      auth: { token: `Bearer ${token}` },
      reconnectionDelay: 3000,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join:project', { projectId, token: `Bearer ${token}` });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('api:call', (call: ApiCallEvent) => {
      setEvents(prev => [call, ...prev].slice(0, maxEvents));
      onApiCallRef.current?.(call);
    });

    socket.on('project:stats', (stats: ProjectStats) => {
      onStatsRef.current?.(stats);
    });

    socketRef.current = socket;
  // Only reconnect when projectId or maxEvents changes — callbacks are stable via ref above
  }, [projectId, maxEvents]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [connect]);

  function clearEvents() { setEvents([]); }

  return { connected, events, clearEvents };
}
