import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { QueryHistoryDto } from './dto/query-history.dto';

const HISTORY_LIST_TTL = 15; // seconds — paginated list
const HISTORY_ITEM_TTL = 60; // seconds — single call detail

@Injectable()
export class HistoryService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Paginated list of API calls, filtered by status/method.
   * Cache key encodes all filter params so each unique query has its own bucket.
   */
  async findAll(userId: string, query: QueryHistoryDto) {
    const { projectId, page = 1, limit = 50, status, method } = query;

    // Verify project ownership
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project)
      throw new ForbiddenException('Project not found or access denied');

    // Build a deterministic cache key from all filter params
    const cacheKey = `history:${projectId}:p${page}:l${limit}:s${status ?? ''}:m${method ?? ''}`;
    const cached = await this.cache.get<object>(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = { projectId };
    if (status) where.status = status.toUpperCase();
    if (method) where.method = method.toUpperCase();

    const [total, calls] = await Promise.all([
      this.prisma.apiCall.count({ where }),
      this.prisma.apiCall.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const result = {
      data: calls,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cache.set(cacheKey, result, HISTORY_LIST_TTL);
    return result;
  }

  /**
   * Single API call detail — cached for 60s (immutable once written).
   */
  async findOne(id: string, userId: string) {
    const cacheKey = `history:call:${id}`;
    const cached = await this.cache.get<object>(cacheKey);
    if (cached) {
      // Still verify ownership against cached data
      const call = cached as { userId: string };
      if (call.userId !== userId) throw new ForbiddenException();
      return cached;
    }

    const call = await this.prisma.apiCall.findUnique({ where: { id } });
    if (!call) throw new NotFoundException('API call not found');
    if (call.userId !== userId) throw new ForbiddenException();

    await this.cache.set(cacheKey, call, HISTORY_ITEM_TTL);
    return call;
  }
}
