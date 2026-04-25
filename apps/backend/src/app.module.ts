import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from 'nestjs-pino';
import { Cluster } from 'ioredis';

import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { IngestModule } from './ingest/ingest.module';
import { EventsModule } from './events/events.module';
import { HistoryModule } from './history/history.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuditModule } from './audit/audit.module';
import { AppController } from './app.controller';
import { INGEST_QUEUE } from './ingest/ingest.queue';

@Module({
  imports: [
    // ── Config ───────────────────────────────────────────────────────────
    ConfigModule.forRoot({ isGlobal: true }),

    // ── Pino structured logger ────────────────────────────────────────────
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        // Pretty-print in dev, JSON in production
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true, singleLine: true },
              }
            : undefined,
        // Suppress /health logs — use customSuccessMessage instead of autoLogging.ignore
        // (autoLogging.ignore calls server.listeners() which crashes with pino-http v11 + nestjs-pino v4)
        autoLogging: true,
        customSuccessMessage: (req: any, res: any) => {
          if (req.url === '/health') return ''; // empty string = pino skips the log line
          return `${req.method} ${req.url} ${res.statusCode}`;
        },
      },
    }),

    // ── Rate limiting ─────────────────────────────────────────────────────
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 200 }]),

    // ── BullMQ — cluster-aware or standalone ─────────────────────────────
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
              slotsRefreshTimeout: 2_000,
              clusterRetryStrategy: (times) =>
                times > 3 ? null : Math.min(times * 500, 2_000),
              redisOptions: {
                maxRetriesPerRequest: null,
                connectTimeout: 3_000,
              },
            }),
          };
        }

        // Standalone (Upstash / Redis Cloud / local)
        const redisUrl =
          config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';

        let host = 'localhost';
        let port = 6379;
        let password: string | undefined;
        let tls: object | undefined;

        try {
          const url = new URL(redisUrl);
          host = url.hostname;
          port = parseInt(url.port || '6379', 10);
          password = url.password || undefined;
          tls = redisUrl.startsWith('rediss://') ? {} : undefined;
        } catch {
          console.error(
            `[BullMQ] Invalid REDIS_URL — falling back to localhost:6379`,
          );
        }

        return {
          connection: { host, port, password, tls, maxRetriesPerRequest: null },
          defaultJobOptions: {
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 50 },
            attempts: 3,
            backoff: { type: 'exponential', delay: 1_000 },
          },
        };
      },
    }),

    PrismaModule,
    CacheModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    IngestModule,
    EventsModule,
    HistoryModule,
    AnalyticsModule,
    AuditModule,

    // Register queue so AppController's @InjectQueue can resolve it
    BullModule.registerQueue({ name: INGEST_QUEUE }),
  ],
  controllers: [AppController],
})
export class AppModule {}
