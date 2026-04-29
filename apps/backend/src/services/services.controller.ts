import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  /** GET /projects/:projectId/services */
  @Get()
  list(@Param('projectId') projectId: string, @Request() req: AuthRequest) {
    return this.servicesService.list(projectId, req.user.userId);
  }

  /** POST /projects/:projectId/services */
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Request() req: AuthRequest,
    @Body() dto: CreateServiceDto,
  ) {
    return this.servicesService.create(projectId, req.user.userId, dto);
  }

  /** GET /projects/:projectId/services/:serviceId */
  @Get(':serviceId')
  findOne(
    @Param('projectId') projectId: string,
    @Param('serviceId') serviceId: string,
    @Request() req: AuthRequest,
  ) {
    return this.servicesService.findOne(projectId, serviceId, req.user.userId);
  }

  /** PATCH /projects/:projectId/services/:serviceId */
  @Patch(':serviceId')
  update(
    @Param('projectId') projectId: string,
    @Param('serviceId') serviceId: string,
    @Request() req: AuthRequest,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(
      projectId,
      serviceId,
      req.user.userId,
      dto,
    );
  }

  /** DELETE /projects/:projectId/services/:serviceId */
  @Delete(':serviceId')
  remove(
    @Param('projectId') projectId: string,
    @Param('serviceId') serviceId: string,
    @Request() req: AuthRequest,
  ) {
    return this.servicesService.remove(projectId, serviceId, req.user.userId);
  }

  /** POST /projects/:projectId/services/:serviceId/regenerate-token */
  @Post(':serviceId/regenerate-token')
  regenerateToken(
    @Param('projectId') projectId: string,
    @Param('serviceId') serviceId: string,
    @Request() req: AuthRequest,
  ) {
    return this.servicesService.regenerateSdkToken(
      projectId,
      serviceId,
      req.user.userId,
    );
  }
}
