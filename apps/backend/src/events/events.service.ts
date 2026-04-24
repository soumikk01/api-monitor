import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class EventsService {
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  /** Broadcast a new API call event to all clients watching the project */
  emitApiCall(projectId: string, call: unknown) {
    if (!this.server) return;
    this.server.to(`project:${projectId}`).emit('api:call', call);
  }

  /** Broadcast an error event */
  emitApiError(projectId: string, error: { id: string; error: string }) {
    if (!this.server) return;
    this.server.to(`project:${projectId}`).emit('api:error', error);
  }

  /** Broadcast updated aggregated stats for a project */
  emitStats(
    projectId: string,
    stats: { total: number; errorRate: number; avgLatency: number },
  ) {
    if (!this.server) return;
    this.server.to(`project:${projectId}`).emit('project:stats', stats);
  }
}
