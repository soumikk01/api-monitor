import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { IngestProcessor } from './ingest.processor';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { INGEST_QUEUE } from './ingest.queue';

@Module({
  imports: [
    EventsModule,
    UsersModule,
    // Register the queue — connection is inherited from BullModule.forRootAsync in AppModule
    BullModule.registerQueue({ name: INGEST_QUEUE }),
  ],
  controllers: [IngestController],
  providers: [
    IngestService,   // producer — enqueues jobs
    IngestProcessor, // worker  — consumes and processes jobs
  ],
})
export class IngestModule {}
