import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { IngestDto } from './dto/ingest.dto';
import { INGEST_QUEUE, INGEST_JOB } from './ingest.queue';

@Injectable()
export class IngestService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(INGEST_QUEUE) private ingestQueue: Queue,
  ) {}

  /** Called by CLI init — validates service token and returns project/service info */
  async setup(sdkToken: string, projectName: string) {
    const service = await this.prisma.service.findUnique({
      where: { sdkToken },
      include: { project: { include: { user: true } } },
    });

    if (!service) throw new UnauthorizedException('Invalid SDK token');

    return {
      projectId: service.projectId,
      serviceId: service.id,
      projectName: service.project.name,
      userId: service.project.userId,
    };
  }

  /**
   * Ingest handler — resolves service from SDK token, enqueues a job.
   * The HTTP request returns immediately (202 Accepted) and the heavy
   * DB writes + WebSocket broadcasts happen in the BullMQ worker.
   */
  async ingest(dto: IngestDto) {
    // Resolve service by SDK token (fast indexed lookup)
    const service = await this.prisma.service.findUnique({
      where: { sdkToken: dto.sdkToken },
      select: {
        id: true,
        projectId: true,
        project: { select: { userId: true } },
      },
    });

    if (!service) throw new UnauthorizedException('Invalid SDK token');

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
