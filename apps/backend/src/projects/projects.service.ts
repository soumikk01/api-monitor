import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

// TTLs
const STATS_TTL = 30; // seconds — stats refresh every 30s
const CALLS_TTL = 15; // seconds — recent calls list
const PROJECT_TTL = 120; // seconds — single project metadata
const LIST_TTL = 30; // seconds — user's project list
const MEMBERS_TTL = 60; // seconds — project members list

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /** List all projects for a user, including API call count */
  async list(userId: string) {
    const cacheKey = `projects:${userId}`;
    const cached = await this.cache.get<object[]>(cacheKey);
    if (cached) return cached;

    let result: object[];
    try {
      result = await this.prisma.project.findMany({
        where: {
          OR: [{ userId }, { members: { some: { userId } } }],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { apiCalls: true } },
        },
      });
    } catch {
      // Fallback to simple query if members relation is not yet available
      result = await this.prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { apiCalls: true } },
        },
      });
    }

    await this.cache.set(cacheKey, result, LIST_TTL);
    return result;
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
    const cached = await this.cache.get<{
      id: string;
      userId: string;
      name: string;
      description: string | null;
      createdAt: Date;
      updatedAt: Date;
      members?: { userId: string; role: string }[];
    }>(cacheKey);

    if (cached) {
      const isOwner = cached.userId === userId;
      const isMember =
        cached.members?.some((m) => m.userId === userId) ?? false;
      if (!isOwner && !isMember) throw new ForbiddenException();
      return cached;
    }

    // First try with members included (new schema)
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: { members: { select: { userId: true, role: true } } },
      });

      if (!project) throw new NotFoundException('Project not found');

      const isOwner = project.userId === userId;
      const isMember = project.members.some((m) => m.userId === userId);
      if (!isOwner && !isMember) throw new ForbiddenException();

      await this.cache.set(cacheKey, project, PROJECT_TTL);
      return project;
    } catch (err) {
      // If it's already a NestJS exception, rethrow it
      if (
        err instanceof NotFoundException ||
        err instanceof ForbiddenException
      ) {
        throw err;
      }
      // Fallback: query without members (old Prisma client)
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project) throw new NotFoundException('Project not found');
      if (project.userId !== userId) throw new ForbiddenException();
      await this.cache.set(cacheKey, project, PROJECT_TTL);
      return project;
    }
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
      take: 10_000, // Safety cap — prevents OOM on large projects
      orderBy: { createdAt: 'desc' },
    });

    const total = calls.length;
    if (total === 0) {
      const result = {
        total: 0,
        errors: 0,
        errorRate: 0,
        avgLatency: 0,
        successRate: 100,
        activeInstances: 0,
      };
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

  /** Add a new member to the project */
  async addMember(projectId: string, ownerId: string, emailOrId: string) {
    const project = await this.findOne(projectId, ownerId);
    if (project.userId !== ownerId) {
      throw new ForbiddenException('Only the project owner can add members');
    }

    // Try finding by email first, or fallback to exact ID if it's 24 chars
    const targetUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrId },
          {
            id:
              emailOrId.length === 24 ? emailOrId : '000000000000000000000000',
          },
        ],
      },
    });

    if (!targetUser) throw new NotFoundException('User not found');
    if (targetUser.id === ownerId)
      throw new BadRequestException('Cannot add yourself to the project');

    const existing = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUser.id } },
    });
    if (existing) throw new BadRequestException('User is already a member');

    await this.prisma.projectMember.create({
      data: { projectId, userId: targetUser.id, role: 'MEMBER' },
    });

    await this.cache.del(`project:${projectId}`, `members:${projectId}`);
    return { message: 'Member added successfully' };
  }

  /** Get all members for a project */
  async getMembers(projectId: string, userId: string) {
    await this.findOne(projectId, userId); // Check permissions

    const cacheKey = `members:${projectId}`;
    const cached = await this.cache.get<object[]>(cacheKey);
    if (cached) return cached;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: { select: { id: true, email: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    const result = [
      { user: project.user, role: 'OWNER' },
      ...project.members.map((m) => ({ user: m.user, role: m.role })),
    ];

    await this.cache.set(cacheKey, result, MEMBERS_TTL);
    return result;
  }
}
