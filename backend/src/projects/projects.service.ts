import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

// TTLs
const STATS_TTL   = 30;  // seconds — stats refresh every 30s
const CALLS_TTL   = 15;  // seconds — recent calls list
const PROJECT_TTL = 120; // seconds — single project metadata

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /** List all projects for a user, including API call count */
  async list(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { apiCalls: true } },
      },
    });
  }

  /** Create a new project */
  async create(userId: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: { ...dto, userId },
    });
    // Invalidate user's project list cache (if we cached it later)
    await this.cache.del(`projects:${userId}`);
    return project;
  }

  /** Get a single project (ownership verified, cached) */
  async findOne(projectId: string, userId: string) {
    const cacheKey = `project:${projectId}`;
    const cached = await this.cache.get<{ id: string; userId: string; name: string; description: string | null; createdAt: Date; updatedAt: Date }>(cacheKey);
    if (cached) {
      if (cached.userId !== userId) throw new ForbiddenException();
      return cached;
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();

    await this.cache.set(cacheKey, project, PROJECT_TTL);
    return project;
  }

  /** Update project name / description */
  async update(projectId: string, userId: string, dto: UpdateProjectDto) {
    await this.findOne(projectId, userId); // verifies ownership
    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
    // Bust caches
    await this.cache.del(
      `project:${projectId}`,
      `stats:${projectId}`,
      `calls:${projectId}`,
    );
    return updated;
  }

  /** Delete a project + all its ApiCall records (Prisma cascade) */
  async remove(projectId: string, userId: string) {
    const project = await this.findOne(projectId, userId);
    await this.prisma.project.delete({ where: { id: project.id } });
    // Bust all caches for this project
    await this.cache.delByPattern(`*:${projectId}*`);
    return { message: 'Project deleted' };
  }

  /**
   * Aggregate DB stats — cached 30 seconds.
   * Eliminates repetitive Atlas round-trips on every dashboard refresh.
   */
  async getStats(projectId: string, userId: string) {
    await this.findOne(projectId, userId); // ownership guard

    const cacheKey = `stats:${projectId}`;
    const cached = await this.cache.get<object>(cacheKey);
    if (cached) return cached;

    const calls = await this.prisma.apiCall.findMany({
      where: { projectId },
      select: { status: true, latency: true, createdAt: true },
    });

    const total = calls.length;
    if (total === 0) {
      const result = { total: 0, errors: 0, errorRate: 0, avgLatency: 0, successRate: 100, activeInstances: 0 };
      await this.cache.set(cacheKey, result, STATS_TTL);
      return result;
    }

    const errors = calls.filter(
      (c) => c.status === 'CLIENT_ERROR' || c.status === 'SERVER_ERROR',
    ).length;
    const avgLatency = Math.round(
      calls.reduce((sum, c) => sum + c.latency, 0) / total,
    );

    // Calls in the last 60 seconds count as "live"
    const now = Date.now();
    const recentCalls = calls.filter(
      (c) => now - new Date(c.createdAt).getTime() < 60_000,
    ).length;

    const result = {
      total,
      errors,
      errorRate: parseFloat(((errors / total) * 100).toFixed(1)),
      avgLatency,
      successRate: parseFloat((((total - errors) / total) * 100).toFixed(1)),
      activeInstances: recentCalls > 0 ? 1 : 0,
    };

    await this.cache.set(cacheKey, result, STATS_TTL);
    return result;
  }

  /**
   * Return the most recent API calls — cached 15 seconds.
   * Seeds the Overview feed on page load before live socket events arrive.
   */
  async getRecentCalls(projectId: string, userId: string, limit = 50) {
    await this.findOne(projectId, userId); // guard

    const cacheKey = `calls:${projectId}:${limit}`;
    const cached = await this.cache.get<object[]>(cacheKey);
    if (cached) return cached;

    const calls = await this.prisma.apiCall.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        method: true,
        url: true,
        path: true,
        host: true,
        statusCode: true,
        statusText: true,
        latency: true,
        status: true,
        createdAt: true,
      },
    });

    await this.cache.set(cacheKey, calls, CALLS_TTL);
    return calls;
  }
}
