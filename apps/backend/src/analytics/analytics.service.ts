import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

// TTLs — analytics data is heavier to compute so we cache longer
const SUMMARY_TTL   = 30;  // seconds — per range bucket
const ENDPOINTS_TTL = 60;  // seconds — endpoint breakdown changes less often

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  private async assertProjectOwner(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project)
      throw new ForbiddenException('Project not found or access denied');
    return project;
  }

  /**
   * GET /analytics/summary?projectId=&range=1h
   * range: 1h | 24h | 7d | 30d
   * Cached per (project + range) bucket.
   */
  async summary(userId: string, projectId: string, range = '24h') {
    await this.assertProjectOwner(projectId, userId);

    const cacheKey = `analytics:summary:${projectId}:${range}`;
    const cached = await this.cache.get<object>(cacheKey);
    if (cached) return cached;

    const since = this.rangeToDate(range);
    const calls = await this.prisma.apiCall.findMany({
      where: { projectId, createdAt: { gte: since } },
      select: { status: true, latency: true, statusCode: true },
    });

    const total = calls.length;
    if (!total) {
      const empty = { total: 0, errorRate: 0, avgLatency: 0, successRate: 0, range };
      await this.cache.set(cacheKey, empty, SUMMARY_TTL);
      return empty;
    }

    const errors = calls.filter(
      (c) => c.status === 'CLIENT_ERROR' || c.status === 'SERVER_ERROR',
    ).length;
    const avgLatency = calls.reduce((sum, c) => sum + c.latency, 0) / total;

    const result = {
      total,
      errorRate:   Math.round((errors / total) * 100),
      successRate: Math.round(((total - errors) / total) * 100),
      avgLatency:  Math.round(avgLatency),
      range,
    };

    await this.cache.set(cacheKey, result, SUMMARY_TTL);
    return result;
  }

  /**
   * GET /analytics/endpoints?projectId=
   * Returns per-endpoint breakdown sorted by call count.
   * Cached per project — busted when new calls are ingested.
   */
  async endpoints(userId: string, projectId: string) {
    await this.assertProjectOwner(projectId, userId);

    const cacheKey = `analytics:endpoints:${projectId}`;
    const cached = await this.cache.get<object[]>(cacheKey);
    if (cached) return cached;

    const calls = await this.prisma.apiCall.findMany({
      where: { projectId },
      select: {
        method:  true,
        path:    true,
        host:    true,
        status:  true,
        latency: true,
      },
    });

    // Group by method + path
    const map = new Map<
      string,
      { count: number; errors: number; totalLatency: number }
    >();
    for (const c of calls) {
      const key   = `${c.method} ${c.host}${c.path}`;
      const entry = map.get(key) ?? { count: 0, errors: 0, totalLatency: 0 };
      entry.count++;
      entry.totalLatency += c.latency;
      if (c.status === 'CLIENT_ERROR' || c.status === 'SERVER_ERROR') {
        entry.errors++;
      }
      map.set(key, entry);
    }

    const result = Array.from(map.entries())
      .map(([endpoint, data]) => ({
        endpoint,
        count:      data.count,
        errorRate:  Math.round((data.errors / data.count) * 100),
        avgLatency: Math.round(data.totalLatency / data.count),
      }))
      .sort((a, b) => b.count - a.count);

    await this.cache.set(cacheKey, result, ENDPOINTS_TTL);
    return result;
  }

  private rangeToDate(range: string): Date {
    const now = new Date();
    switch (range) {
      case '1h':  return new Date(now.getTime() - 60 * 60 * 1000);
      case '7d':  return new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:    return new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h
    }
  }
}
