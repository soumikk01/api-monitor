import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { WorkerModule } from './worker.module';

/**
 * Separate worker process entry point.
 * Runs as a standalone NestJS ApplicationContext (no HTTP server).
 *
 * Responsibilities:
 *  - Consume ingest jobs from the BullMQ queue
 *  - Write API call events to MongoDB in parallel
 *  - Emit WebSocket events via Redis adapter (reaches all API instances)
 *  - Debounce stats broadcasts per project
 *
 * Started via: bun run dist/worker
 * In Docker:   CMD ["bun", "run", "dist/worker"]
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  const logger = app.get(Logger);
  logger.log('BullMQ worker started — consuming ingest queue', 'Worker');

  // Keep process alive (ApplicationContext exits immediately otherwise)
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received — shutting down worker gracefully', 'Worker');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT received — shutting down worker gracefully', 'Worker');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
