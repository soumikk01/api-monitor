import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { IngestDto, ApiCallEventDto } from './dto/ingest.dto';

function classifyStatus(statusCode?: number): string {
  if (!statusCode) return 'PENDING';
  if (statusCode >= 200 && statusCode < 300) return 'SUCCESS';
  if (statusCode >= 400 && statusCode < 500) return 'CLIENT_ERROR';
  if (statusCode >= 500) return 'SERVER_ERROR';
  return 'PENDING';
}

function extractHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function extractPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

@Injectable()
export class IngestService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private eventsService: EventsService,
    private usersService: UsersService,
  ) {}

  /** Called by CLI init — validates token and returns/creates a project */
  async setup(sdkToken: string, projectName: string) {
    const user = await this.usersService.findBySdkToken(sdkToken);
    if (!user) throw new UnauthorizedException('Invalid SDK token');

    // Find existing project with that name, or create a new one
    let project = await this.prisma.project.findFirst({
      where: { userId: user.id, name: projectName },
    });

    if (!project) {
      project = await this.prisma.project.create({
        data: { name: projectName, userId: user.id },
      });
    }

    return {
      projectId: project.id,
      projectName: project.name,
      userId: user.id,
    };
  }

  async ingest(dto: IngestDto) {
    // 1. Validate SDK token
    const user = await this.usersService.findBySdkToken(dto.sdkToken);
    if (!user) throw new UnauthorizedException('Invalid SDK token');

    // 2. Verify project belongs to this user
    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, userId: user.id },
    });
    if (!project)
      throw new UnauthorizedException('Project not found or access denied');

    // 3. Persist each event and broadcast via WebSocket
    const saved: unknown[] = [];
    for (const event of dto.events) {
      const record = await this.persistEvent(event, project.id, user.id);
      saved.push(record);

      // Broadcast to all dashboard clients watching this project
      this.eventsService.emitApiCall(project.id, record);

      if (
        record.status === 'CLIENT_ERROR' ||
        record.status === 'SERVER_ERROR'
      ) {
        this.eventsService.emitApiError(project.id, {
          id: record.id,
          error: `${record.statusCode} ${record.statusText ?? ''}`,
        });
      }
    }

    // 4. Broadcast updated stats + bust stale cache
    void this.broadcastStats(project.id);
    void this.cache.del(`stats:${project.id}`, `calls:${project.id}:50`);

    return { received: saved.length, projectId: project.id };
  }

  private async persistEvent(
    event: ApiCallEventDto,
    projectId: string,
    userId: string,
  ) {
    return this.prisma.apiCall.create({
      data: {
        projectId,
        userId,
        method: event.method.toUpperCase(),
        url: event.url,
        host: extractHost(event.url),
        path: extractPath(event.url),
        requestHeaders: event.requestHeaders ?? null,
        requestBody: event.requestBody ?? null,
        queryParams: event.queryParams ?? null,
        statusCode: event.statusCode ?? null,
        statusText: event.statusText ?? null,
        responseHeaders: event.responseHeaders ?? null,
        responseBody: event.responseBody ?? null,
        responseSize: event.responseSize ?? null,
        latency: event.latency,
        startedAt: new Date(event.startedAt),
        endedAt: new Date(event.endedAt),
        status: classifyStatus(event.statusCode),
      },
    });
  }

  private async broadcastStats(projectId: string) {
    const calls = await this.prisma.apiCall.findMany({
      where: { projectId },
      select: { status: true, latency: true },
    });
    if (!calls.length) return;

    const total = calls.length;
    const errors = calls.filter(
      (c) => c.status === 'CLIENT_ERROR' || c.status === 'SERVER_ERROR',
    ).length;
    const avgLatency = calls.reduce((sum, c) => sum + c.latency, 0) / total;

    this.eventsService.emitStats(projectId, {
      total,
      errorRate: Math.round((errors / total) * 100),
      avgLatency: Math.round(avgLatency),
    });
  }
}
