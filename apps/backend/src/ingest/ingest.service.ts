import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { IngestDto } from './dto/ingest.dto';
import { INGEST_QUEUE, INGEST_JOB } from './ingest.queue';

@Injectable()
export class IngestService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    @InjectQueue(INGEST_QUEUE) private ingestQueue: Queue,
  ) {}

  /** Called by CLI init — validates token and returns/creates a project */
  async setup(sdkToken: string, projectName: string) {
    // Try service token first (new path)
    const service = await this.prisma.service.findUnique({
      where: { sdkToken },
      include: { project: { include: { user: true } } },
    });

    if (service) {
      return {
        projectId: service.projectId,
        serviceId: service.id,
        projectName: service.project.name,
        userId: service.project.userId,
      };
    }

    // Fallback: user-level token (legacy support)
    const user = await this.usersService.findBySdkToken(sdkToken);
    if (!user) throw new UnauthorizedException('Invalid SDK token');

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
      serviceId: null,
      projectName: project.name,
      userId: user.id,
    };
  }

  /**
   * Ingest handler — resolves service from SDK token, enqueues a job.
   * The HTTP request returns immediately (202 Accepted) and the heavy
   * DB writes + WebSocket broadcasts happen in the BullMQ worker.
   */
  async ingest(dto: IngestDto) {
    // 1. Resolve service by SDK token (fast indexed lookup)
    const service = await this.prisma.service.findUnique({
      where: { sdkToken: dto.sdkToken },
      include: { project: { include: { user: true } } },
    });

    if (!service) {
      // Fallback: legacy user-level token
      const user = await this.usersService.findBySdkToken(dto.sdkToken);
      if (!user) throw new UnauthorizedException('Invalid SDK token');

      const project = dto.projectId
        ? await this.prisma.project.findFirst({
            where: { id: dto.projectId, userId: user.id },
          })
        : await this.prisma.project.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
          });
      if (!project)
        throw new UnauthorizedException('Project not found or access denied');

      // Find the default service for this project to assign events
      const defaultSvc = await this.prisma.service.findFirst({
        where: { projectId: project.id, isDefault: true },
      });

      await this.ingestQueue.add(
        INGEST_JOB.PROCESS_BATCH,
        {
          projectId: project.id,
          serviceId: defaultSvc?.id ?? '',
          userId: user.id,
          events: dto.events,
        },
        {
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 50 },
          attempts: 3,
          backoff: { type: 'exponential', delay: 1_000 },
        },
      );

      return {
        received: dto.events.length,
        projectId: project.id,
        serviceId: defaultSvc?.id ?? null,
        queued: true,
      };
    }

    // 2. Service token path — enqueue with full service context
    await this.ingestQueue.add(
      INGEST_JOB.PROCESS_BATCH,
      {
        projectId: service.projectId,
        serviceId: service.id,
        userId: service.project.userId,
        events: dto.events,
      },
      {
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
        attempts: 3,
        backoff: { type: 'exponential', delay: 1_000 },
      },
    );

    return {
      received: dto.events.length,
      projectId: service.projectId,
      serviceId: service.id,
      queued: true,
    };
  }
}
