import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { EventsService } from '../events/events.service';
import { ApiCallEventDto } from './dto/ingest.dto';
import { INGEST_QUEUE, INGEST_JOB, IngestJobPayload } from './ingest.queue';

// ─────────────────────────────────────────────
//  Helpers (copied from ingest.service — no shared dep needed)
// ─────────────────────────────────────────────
function classifyStatus(statusCode?: number): string {
  if (!statusCode) return 'PENDING';
  if (statusCode >= 200 && statusCode < 300) return 'SUCCESS';
  if (statusCode >= 400 && statusCode < 500) return 'CLIENT_ERROR';
  if (statusCode >= 500) return 'SERVER_ERROR';
  return 'PENDING';
}

function extractHost(url: string): string {
  try { return new URL(url).hostname; } catch { return url; }
}

function extractPath(url: string): string {
  try { return new URL(url).pathname; } catch { return url; }
}

// ─────────────────────────────────────────────
//  Per-project stats debounce (lives in the worker process)
// ─────────────────────────────────────────────
const STATS_DEBOUNCE_MS = 5_000;

@Processor(INGEST_QUEUE)
export class IngestProcessor extends WorkerHost {
  private readonly logger = new Logger(IngestProcessor.name);
  private readonly statsDebounce = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private eventsService: EventsService,
  ) {
    super();
  }

  async process(job: Job<IngestJobPayload>): Promise<void> {
    if (job.name !== INGEST_JOB.PROCESS_BATCH) {
      this.logger.warn(`Unknown job type: ${job.name} — skipping`);
      return;
    }

    const { projectId, userId, events } = job.data;

    // ── Write all events in parallel ──────────────────────────────────────
    const records = await Promise.all(
      events.map((event) => this.persistEvent(event, projectId, userId)),
    );

    this.logger.debug(
      `[${projectId}] persisted ${records.length} event(s) (job ${job.id})`,
    );

    // ── Emit WebSocket events ─────────────────────────────────────────────
    for (const record of records) {
      this.eventsService.emitApiCall(projectId, record);

      if (record.status === 'CLIENT_ERROR' || record.status === 'SERVER_ERROR') {
        this.eventsService.emitApiError(projectId, {
          id: record.id,
          error: `${record.statusCode} ${record.statusText ?? ''}`,
        });
      }
    }

    // ── Debounced stats broadcast + cache bust ────────────────────────────
    this.scheduleBroadcastStats(projectId);
  }

  // ─────────────────────────────────────────────
  //  Private helpers
  // ─────────────────────────────────────────────

  private async persistEvent(
    event: ApiCallEventDto,
    projectId: string,
    userId: string,
  ) {
    return this.prisma.apiCall.create({
      data: {
        projectId,
        userId,
        method:          event.method.toUpperCase(),
        url:             event.url,
        host:            extractHost(event.url),
        path:            extractPath(event.url),
        requestHeaders:  event.requestHeaders  ?? null,
        requestBody:     event.requestBody     ?? null,
        queryParams:     event.queryParams     ?? null,
        statusCode:      event.statusCode      ?? null,
        statusText:      event.statusText      ?? null,
        responseHeaders: event.responseHeaders ?? null,
        responseBody:    event.responseBody    ?? null,
        responseSize:    event.responseSize    ?? null,
        latency:         event.latency,
        startedAt:       new Date(event.startedAt),
        endedAt:         new Date(event.endedAt),
        status:          classifyStatus(event.statusCode),
      },
    });
  }

  private scheduleBroadcastStats(projectId: string) {
    const existing = this.statsDebounce.get(projectId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      this.statsDebounce.delete(projectId);
      void this.broadcastStats(projectId);
      // Bust all data caches for this project so the next page load is fresh
      void this.cache.del(
        `stats:${projectId}`,
        `calls:${projectId}:50`,
        `analytics:endpoints:${projectId}`,
        // Summary buckets for all range options
        `analytics:summary:${projectId}:1h`,
        `analytics:summary:${projectId}:24h`,
        `analytics:summary:${projectId}:7d`,
        `analytics:summary:${projectId}:30d`,
      );
      // History pages become stale too — wipe first page as a fast refresh
      void this.cache.delByPattern(`history:${projectId}:*`);
    }, STATS_DEBOUNCE_MS);

    this.statsDebounce.set(projectId, timer);
  }

  /**
   * Windowed stats query — only last 1 hour, hard cap at 10k rows.
   * Uses compound index [projectId, createdAt] for a fast scan.
   */
  private async broadcastStats(projectId: string) {
    const since = new Date(Date.now() - 60 * 60 * 1_000);

    const calls = await this.prisma.apiCall.findMany({
      where: { projectId, createdAt: { gte: since } },
      select: { status: true, latency: true },
      take: 10_000,
    });

    if (!calls.length) return;

    const total      = calls.length;
    const errors     = calls.filter(
      (c) => c.status === 'CLIENT_ERROR' || c.status === 'SERVER_ERROR',
    ).length;
    const avgLatency = calls.reduce((sum, c) => sum + c.latency, 0) / total;

    this.eventsService.emitStats(projectId, {
      total,
      errorRate:  Math.round((errors / total) * 100),
      avgLatency: Math.round(avgLatency),
    });
  }
}
