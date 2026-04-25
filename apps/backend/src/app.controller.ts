import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from './prisma/prisma.service';
import { CacheService } from './cache/cache.service';
import { INGEST_QUEUE } from './ingest/ingest.queue';

/**
 * GET /health — load balancer health check
 * Returns live Redis + DB status so NGINX can route away from unhealthy instances.
 * No auth required.
 */
@Controller('health')
export class AppController {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    @InjectQueue(INGEST_QUEUE) private queue: Queue,
  ) {}

  @Get()
  async check() {
    const [redis, db, queueSize] = await Promise.allSettled([
      this.checkRedis(),
      this.checkDb(),
      this.queue.getWaitingCount(),
    ]);

    const redisStatus =
      redis.status === 'fulfilled' ? 'connected' : 'disconnected';
    const dbStatus = db.status === 'fulfilled' ? 'connected' : 'disconnected';
    const queuePending =
      queueSize.status === 'fulfilled' ? queueSize.value : -1;

    const healthy = redisStatus === 'connected' && dbStatus === 'connected';

    return {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      redis: redisStatus,
      db: dbStatus,
      queue: { pending: queuePending },
    };
  }

  private async checkRedis(): Promise<void> {
    // CacheService.get with a dummy key — returns null on miss, throws on error
    await this.cache.get<unknown>('__health__');
  }

  private async checkDb(): Promise<void> {
    await this.prisma.$runCommandRaw({ ping: 1 });
  }
}
