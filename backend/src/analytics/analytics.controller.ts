import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
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

  /** GET /analytics/summary?projectId=&range=24h */
  @Get('summary')
  summary(
    @Request() req: AuthRequest,
    @Query('projectId') projectId: string,
    @Query('range') range?: string,
  ) {
    if (!projectId) throw new BadRequestException('projectId is required');
    return this.analyticsService.summary(req.user.userId, projectId, range);
  }

  /** GET /analytics/endpoints?projectId= */
  @Get('endpoints')
  endpoints(
    @Request() req: AuthRequest,
    @Query('projectId') projectId: string,
  ) {
    if (!projectId) throw new BadRequestException('projectId is required');
    return this.analyticsService.endpoints(req.user.userId, projectId);
  }
}
