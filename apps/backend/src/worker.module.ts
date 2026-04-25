import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from 'nestjs-pino';
import { Cluster } from 'ioredis';

import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { EventsModule } from './events/events.module';
import { IngestProcessor } from './ingest/ingest.processor';
import { INGEST_QUEUE } from './ingest/ingest.queue';

/**
 * Minimal module for the BullMQ worker process.
 * Has NO HTTP server — just connects to Redis, dequeues jobs, writes to DB,
 * and emits WebSocket events via the Redis adapter.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true, singleLine: true },
              }
            : undefined,
      },
    }),

    // BullMQ — same connection logic as AppModule
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const clusterNodes = config.get<string>('REDIS_CLUSTER_NODES');

        if (clusterNodes) {
          const nodes = clusterNodes.split(',').map((n) => {
            const [host, port] = n.trim().split(':');
            return { host, port: parseInt(port, 10) };
          });
          return {
            connection: new Cluster(nodes, {
              enableReadyCheck: false,
              redisOptions: { maxRetriesPerRequest: null },
            }),
          };
        }

        const redisUrl =
          config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
        let host = 'localhost',
          port = 6379;
        let password: string | undefined, tls: object | undefined;
        try {
          const u = new URL(redisUrl);
          host = u.hostname;
          port = parseInt(u.port || '6379', 10);
          password = u.password || undefined;
          tls = redisUrl.startsWith('rediss://') ? {} : undefined;
        } catch {
          console.error('[Worker] Invalid REDIS_URL — using localhost');
        }
        return {
          connection: { host, port, password, tls, maxRetriesPerRequest: null },
        };
      },
    }),

    BullModule.registerQueue({ name: INGEST_QUEUE }),

    PrismaModule,
    CacheModule,
    EventsModule, // provides EventsService for WebSocket emit via Redis adapter
  ],
  providers: [IngestProcessor],
})
export class WorkerModule {}
