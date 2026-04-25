import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventsService } from './events.service';

interface JoinProjectPayload {
  projectId: string;
  token: string;
}

@WebSocketGateway({
  namespace: '/ws',
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL ?? 'http://localhost:3000',
    ],
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private eventsService: EventsService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private readonly logger = new Logger(EventsGateway.name);

  /**
   * afterInit — called once the Socket.io server is ready.
   *
   * Attaches the Redis adapter if REDIS_URL is configured.
   * This enables multiple NestJS instances to share WebSocket rooms:
   *   - Instance A handles the SDK agent ingest
   *   - Instance B has the dashboard viewer's socket
   *   - Redis pub/sub bridges the event between them
   *
   * Without this adapter, events only reach clients on the SAME instance.
   * The adapter itself is set up in main.ts via RedisIoAdapter.
   */
  afterInit(server: Server) {
    this.eventsService.setServer(server);
    this.logger.log('WebSocket gateway initialized ✓');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`WS client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`WS client disconnected: ${client.id}`);
  }

  /**
   * Client emits 'join:project' with their JWT and the projectId they want to watch.
   * Server validates the token, then adds the socket to the project room.
   *
   * Client example:
   *   socket.emit('join:project', { projectId: 'abc', token: 'Bearer eyJ...' })
   */
  @SubscribeMessage('join:project')
  async handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinProjectPayload,
  ) {
    try {
      const raw = payload.token?.replace('Bearer ', '');
      this.jwtService.verify(raw, {
        secret: this.config.get('JWT_SECRET'),
      });
      await client.join(`project:${payload.projectId}`);
      client.emit('joined', { projectId: payload.projectId });
    } catch {
      client.emit('error', { message: 'Unauthorized' });
      client.disconnect();
    }
  }

  /** Client can leave a project room */
  @SubscribeMessage('leave:project')
  async handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { projectId: string },
  ) {
    await client.leave(`project:${payload.projectId}`);
    client.emit('left', { projectId: payload.projectId });
  }
}
