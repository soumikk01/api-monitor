import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { QueryHistoryDto } from './dto/query-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  /** GET /history?projectId=&page=1&limit=50&status=CLIENT_ERROR&method=POST */
  @Get()
  findAll(@Request() req: AuthRequest, @Query() query: QueryHistoryDto) {
    return this.historyService.findAll(req.user.userId, query);
  }

  /** GET /history/:id — full detail of a single API call */
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.historyService.findOne(id, req.user.userId);
  }
}
