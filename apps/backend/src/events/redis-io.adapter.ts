import { IoAdapter } from '@nestjs/platform-socket.io';
import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis, { Cluster } from 'ioredis';

/**
 * RedisIoAdapter — plugs the Socket.io Redis adapter at the server level.
 * This is the correct NestJS way to use @socket.io/redis-adapter.
 * afterInit() in the gateway is NOT the right hook — it runs too late.
 *
 * Usage in main.ts:
 *   const adapter = new RedisIoAdapter(app);
 *   await adapter.connectToRedis();
 *   app.useWebSocketAdapter(adapter);
 */
export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;

  constructor(app: INestApplication) {
    super(app);
  }

  async connectToRedis(redisUrl?: string, clusterNodes?: string): Promise<void> {
    if (!redisUrl && !clusterNodes) {
      this.logger.warn('No Redis config — Socket.io running in single-instance mode');
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
        let host = 'localhost', port = 6379;
        let password: string | undefined, tls: object | undefined;
        try {
          const url = new URL(redisUrl!);
          host     = url.hostname;
          port     = parseInt(url.port || '6379', 10);
          password = url.password || undefined;
          tls      = redisUrl!.startsWith('rediss://') ? {} : undefined;
        } catch { this.logger.warn('Invalid REDIS_URL for Socket.io adapter'); }

        const opts = { host, port, password, tls, lazyConnect: true, maxRetriesPerRequest: null as unknown as number };
        pubClient = new Redis(opts);
        subClient = new Redis(opts);
        await Promise.all([(pubClient as Redis).connect(), (subClient as Redis).connect()]);
        this.logger.log('Socket.io Redis standalone adapter ready ✓');
      }

      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (err) {
      this.logger.error(
        `Socket.io Redis adapter failed — single-instance fallback: ${(err as Error).message}`,
      );
    }
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    return server;
  }
}
