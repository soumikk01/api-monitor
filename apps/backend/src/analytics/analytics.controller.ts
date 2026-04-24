import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  Header,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * GET /analytics/summary?projectId=&range=24h
   * Cache-Control: private (user-specific data) — CDN won't cache,
   * but browser caches for 30s so repeated navigations are instant.
   */
  @Get('summary')
  @Header('Cache-Control', 'private, max-age=30, stale-while-revalidate=60')
  summary(
    @Request() req: AuthRequest,
    @Query('projectId') projectId: string,
    @Query('range') range?: string,
  ) {
    if (!projectId) throw new BadRequestException('projectId is required');
    return this.analyticsService.summary(req.user.userId, projectId, range);
  }

  /**
   * GET /analytics/endpoints?projectId=
   * Cache-Control: private — endpoints list changes less often, cache 60s.
   */
  @Get('endpoints')
  @Header('Cache-Control', 'private, max-age=60, stale-while-revalidate=120')
  endpoints(
    @Request() req: AuthRequest,
    @Query('projectId') projectId: string,
  ) {
    if (!projectId) throw new BadRequestException('projectId is required');
    return this.analyticsService.endpoints(req.user.userId, projectId);
  }
}
