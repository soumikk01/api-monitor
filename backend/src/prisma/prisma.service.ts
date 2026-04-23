import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

const SLOW_QUERY_MS = 300; // log queries slower than this

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          // MongoDB Atlas connection pooling:
          // connection_limit  — max simultaneous connections (default 5, raise to 10)
          // connect_timeout   — fail fast if Atlas is unreachable
          url: `${process.env.DATABASE_URL}${process.env.DATABASE_URL?.includes('?') ? '&' : '?'}maxPoolSize=10&connectTimeoutMS=5000&socketTimeoutMS=10000`,
        },
      },
      log: [
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'query', emit: 'event' },
      ],
    });

    // Slow query warning

    (this as any).$on('query', (e: { duration: number; query: string }) => {
      if (e.duration > SLOW_QUERY_MS) {
        this.logger.warn(
          `Slow query (${e.duration}ms): ${e.query.slice(0, 120)}`,
        );
      }
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected ✓');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
