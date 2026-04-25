import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { CacheService } from './cache/cache.service';
import { getQueueToken } from '@nestjs/bullmq';
import { INGEST_QUEUE } from './ingest/ingest.queue';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: { $runCommandRaw: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: CacheService,
          useValue: { get: jest.fn().mockResolvedValue(null) },
        },
        {
          provide: getQueueToken(INGEST_QUEUE),
          useValue: { getWaitingCount: jest.fn().mockResolvedValue(0) },
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('health check', () => {
    it('should return status ok with redis and db fields', async () => {
      const result = await controller.check();
      expect(result.status).toBe('ok');
      expect(result.redis).toBe('connected');
      expect(result.db).toBe('connected');
      expect(typeof result.uptime).toBe('number');
      expect(result.queue.pending).toBe(0);
    });
  });
});
