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

    return { projectId: project.id, projectName: project.name, userId: user.id };
  }

  /**
   * Ingest handler — now just validates auth and enqueues a job.
   * The HTTP request returns immediately (202 Accepted) and the heavy
   * DB writes + WebSocket broadcasts happen in the BullMQ worker.
   *
   * This decouples the SDK agent's HTTP latency from MongoDB write time,
   * allowing the server to handle far more concurrent ingest requests.
   */
  async ingest(dto: IngestDto) {
    // 1. Validate SDK token
    const user = await this.usersService.findBySdkToken(dto.sdkToken);
    if (!user) throw new UnauthorizedException('Invalid SDK token');

    // 2. Verify project belongs to this user
    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, userId: user.id },
    });
    if (!project) throw new UnauthorizedException('Project not found or access denied');

    // 3. Enqueue — returns immediately, worker handles the rest
    await this.ingestQueue.add(
      INGEST_JOB.PROCESS_BATCH,
      {
        projectId: project.id,
        userId:    user.id,
        events:    dto.events,
      },
      {
        // Remove job from Redis after it completes (keeps memory lean)
        removeOnComplete: { count: 100 },
        removeOnFail:     { count: 50 },
        // Retry failed jobs up to 3 times with exponential back-off
        attempts: 3,
        backoff: { type: 'exponential', delay: 1_000 },
      },
    );

    return { received: dto.events.length, projectId: project.id, queued: true };
  }
}
