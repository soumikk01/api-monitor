import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Cluster } from 'ioredis';

type RedisClient = Redis | Cluster;

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: RedisClient | null = null;
  private readonly enabled: boolean;

  constructor(private config: ConfigService) {
    const clusterNodes = this.config.get<string>('REDIS_CLUSTER_NODES');
    const redisUrl = this.config.get<string>('REDIS_URL');

    if (clusterNodes) {
      // ── Cluster mode ────────────────────────────────────────────────────
      const nodes = clusterNodes.split(',').map((n) => {
        const [host, port] = n.trim().split(':');
        return { host, port: parseInt(port, 10) };
      });

      this.client = new Cluster(nodes, {
        enableReadyCheck: false,
        slotsRefreshTimeout: 2_000,
        clusterRetryStrategy: (times) =>
          times > 3 ? null : Math.min(times * 500, 2_000),
        redisOptions: {
          maxRetriesPerRequest: 1,
          connectTimeout: 3_000,
          offlineQueue: false,
        },
      });

      this.client.on('connect', () =>
        this.logger.log('Redis Cluster connected ✓'),
      );
      this.client.on('error', (err: Error) =>
        this.logger.warn(`Redis Cluster error: ${err.message}`),
      );
      this.enabled = true;
    } else if (redisUrl) {
      // ── Standalone fallback ──────────────────────────────────────────────
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 3_000,
        enableOfflineQueue: false,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Redis gave up — running without cache');
            this.client?.disconnect();
            return null;
          }
          return Math.min(times * 500, 2_000);
        },
      });
      this.client.on('connect', () =>
        this.logger.log('Redis standalone connected ✓'),
      );
      this.client.on('error', (err: Error) =>
        this.logger.warn(`Redis error (cache disabled): ${err.message}`),
      );
      this.client
        .connect()
        .catch(() =>
          this.logger.warn('Redis connect failed — running without cache'),
        );
      this.enabled = true;
    } else {
      this.logger.warn(
        'No REDIS_CLUSTER_NODES or REDIS_URL — caching disabled',
      );
      this.enabled = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.client) return null;
    try {
      const raw = await this.client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 30): Promise<void> {
    if (!this.enabled || !this.client) return;
    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }

  /** Cluster-safe: issues one DEL per key so cross-slot keys work */
  async del(...keys: string[]): Promise<void> {
    if (!this.enabled || !this.client || !keys.length) return;
    try {
      await Promise.all(keys.map((k) => this.client!.del(k)));
    } catch {
      /* ignore */
    }
  }

  /** Cluster-safe: scans each master node independently */
  async delByPattern(pattern: string): Promise<void> {
    if (!this.enabled || !this.client) return;
    try {
      if (this.client instanceof Cluster) {
        const masters = this.client.nodes('master');
        await Promise.all(
          masters.map(async (node) => {
            const keys = await node.keys(pattern);
            if (keys.length) await Promise.all(keys.map((k) => node.del(k)));
          }),
        );
      } else {
        const keys = await this.client.keys(pattern);
        if (keys.length) await this.client.del(...keys);
      }
    } catch {
      /* ignore */
    }
  }

  async onModuleDestroy() {
    if (this.client) await this.client.quit().catch(() => {});
  }
}
