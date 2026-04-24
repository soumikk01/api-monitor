import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  /**
   * GET /audit
   * Returns paginated audit logs for the current user.
   */
  @Get()
  getLogs(
    @Request() req: AuthRequest,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('projectId') projectId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 50;

    return this.auditService.findAll(req.user.userId, {
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 50 : limit,
      projectId,
      startDate,
      endDate,
    });
  }
}
