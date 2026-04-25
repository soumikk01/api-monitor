import { IoAdapter } from '@nestjs/platform-socket.io';
import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis, { Cluster } from 'ioredis';

/**
 * RedisIoAdapter — plugs the Socket.io Redis adapter at the server level.
 *
 * Fix for NestJS v11 + engine.io v6.6 incompatibility:
 *   engine.io@6.6 calls server.listeners() on the http.Server during attach().
 *   The NestJS IoAdapter base class passes an abstracted server object that
 *   doesn't expose listeners() directly — causing "server.listeners is not a function".
 *
 *   Solution: extract the raw httpServer from the NestJS app and pass it
 *   directly to the socket.io Server constructor, bypassing the broken path.
 */
export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;
  private readonly app: INestApplication;

  constructor(app: INestApplication) {
    super(app);
    this.app = app;
  }

  async connectToRedis(
    redisUrl?: string,
    clusterNodes?: string,
  ): Promise<void> {
    if (!redisUrl && !clusterNodes) {
      this.logger.warn(
        'No Redis config — Socket.io running in single-instance mode',
      );
      return;
    }

    try {
      let pubClient: Redis | Cluster;
      let subClient: Redis | Cluster;

      if (clusterNodes) {
        const nodes = clusterNodes.split(',').map((n) => {
          const [host, port] = n.trim().split(':');
          return { host, port: parseInt(port, 10) };
        });
        pubClient = new Cluster(nodes, { enableReadyCheck: false });
        subClient = new Cluster(nodes, { enableReadyCheck: false });
        this.logger.log('Socket.io Redis Cluster adapter ready ✓');
      } else {
        let host = 'localhost',
          port = 6379;
        let password: string | undefined, tls: object | undefined;
        try {
          const url = new URL(redisUrl!);
          host = url.hostname;
          port = parseInt(url.port || '6379', 10);
          password = url.password || undefined;
          tls = redisUrl!.startsWith('rediss://') ? {} : undefined;
        } catch {
          this.logger.warn('Invalid REDIS_URL for Socket.io adapter');
        }

        const opts = {
          host,
          port,
          password,
          tls,
          lazyConnect: true,
          maxRetriesPerRequest: null as unknown as number,
        };
        pubClient = new Redis(opts);
        subClient = new Redis(opts);
        await Promise.all([pubClient.connect(), subClient.connect()]);
        this.logger.log('Socket.io Redis standalone adapter ready ✓');
      }

      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (err) {
      this.logger.error(
        `Socket.io Redis adapter failed — single-instance fallback: ${(err as Error).message}`,
      );
    }
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    // ── NestJS v11 + engine.io v6.6 fix ─────────────────────────────────────
    // engine.io calls httpServer.listeners('request') during attach().
    // The NestJS abstract adapter passes its own wrapper which lacks .listeners().
    // We bypass this by constructing the socket.io Server with the raw httpServer.
    const httpServer = this.app.getHttpServer();

    const cors = (options as any)?.cors ?? {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        process.env.FRONTEND_URL ?? 'http://localhost:3000',
        process.env.AUTH_URL ?? 'http://localhost:3001',
        process.env.DOCS_URL ?? 'http://localhost:3002',
        process.env.ADMIN_URL ?? 'http://localhost:3003',
      ],
      credentials: true,
    };

    const ioServer = new Server(httpServer, {
      ...options,
      cors,
    });

    if (this.adapterConstructor) {
      ioServer.adapter(this.adapterConstructor);
    }

    return ioServer;
  }
}
