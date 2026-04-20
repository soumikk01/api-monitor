import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { IngestModule } from './ingest/ingest.module';
import { EventsModule } from './events/events.module';
import { HistoryModule } from './history/history.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting: max 200 requests per 60 seconds per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 200 }]),

    // Database
    PrismaModule,

    // Redis cache (global — auto-available in all modules)
    CacheModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    IngestModule,
    EventsModule,
    HistoryModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
