import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: Redis | null = null;
  private readonly enabled: boolean;

  constructor(private config: ConfigService) {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (redisUrl) {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 3000,
        enableOfflineQueue: false,
        // Stop retrying after 3 failed attempts — prevents log spam
        retryStrategy: (times: number) => {
          if (times > 3) {
            this.logger.warn(
              'Redis gave up after 3 attempts — running without cache',
            );
            this.client?.disconnect();
            return null; // stop retrying
          }
          return Math.min(times * 500, 2000); // exponential back-off: 500ms, 1s, 1.5s
        },
      });

      this.client.on('connect', () => this.logger.log('Redis connected ✓'));
      this.client.on('error', (err: Error) =>
        this.logger.warn(`Redis error (caching disabled): ${err.message}`),
      );

      this.enabled = true;
      this.client.connect().catch(() => {
        this.logger.warn('Redis connect failed — running without cache');
      });
    } else {
      this.logger.warn(
        'REDIS_URL not set — caching disabled (app still works)',
      );
      this.enabled = false;
    }
  }

  /** Get a cached value. Returns null on miss or if Redis is unavailable. */
  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.client) return null;
    try {
      const raw = await this.client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null; // Redis down — degrade gracefully
    }
  }

  /** Set a cached value with TTL in seconds. Silently fails if Redis is down. */
  async set(key: string, value: unknown, ttlSeconds = 30): Promise<void> {
    if (!this.enabled || !this.client) return;
    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }

  /** Delete a cache key (call after mutations). */
  async del(...keys: string[]): Promise<void> {
    if (!this.enabled || !this.client || keys.length === 0) return;
    try {
      await this.client.del(...keys);
    } catch {
      /* ignore */
    }
  }

  /** Delete all keys matching a pattern (e.g. "stats:*" for a project). */
  async delByPattern(pattern: string): Promise<void> {
    if (!this.enabled || !this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length) await this.client.del(...keys);
    } catch {
      /* ignore */
    }
  }

  async onModuleDestroy() {
    if (this.client) await this.client.quit().catch(() => {});
  }
}
