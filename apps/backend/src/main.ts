import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const compression = require('compression');
import helmet from 'helmet';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './events/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // ── Structured JSON logging via Pino ──────────────────────────────────
  app.useLogger(app.get(Logger));

  // ── Socket.io Redis adapter (multi-instance WS sync) ──────────────────
  // Must be set BEFORE app.listen() so createIOServer picks it up.
  const redisAdapter = new RedisIoAdapter(app);
  await redisAdapter.connectToRedis(
    process.env.REDIS_URL,
    process.env.REDIS_CLUSTER_NODES,
  );
  app.useWebSocketAdapter(redisAdapter);

  // ── Security headers ──────────────────────────────────────────────────
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

  // ── Gzip compression ──────────────────────────────────────────────────
  app.use(compression());

  // ── Global validation ─────────────────────────────────────────────────
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ── CORS ──────────────────────────────────────────────────────────────
  app.enableCors({
    origin: [
      // ── Local dev: one origin per app ──────────────────────────────────
      'http://localhost:3000',  // apps/web   (dashboard)
      'http://localhost:3001',  // apps/auth  (auth)
      'http://localhost:3002',  // apps/docs  (docs)
      'http://localhost:3003',  // apps/admin (admin)
      // ── Env-override for production/staging ────────────────────────────
      process.env.FRONTEND_URL    ?? 'http://localhost:3000',
      process.env.AUTH_URL        ?? 'http://localhost:3001',
      process.env.DOCS_URL        ?? 'http://localhost:3002',
      process.env.ADMIN_URL       ?? 'http://localhost:3003',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // /health excluded from prefix so NGINX can probe it without auth
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
}

bootstrap();

