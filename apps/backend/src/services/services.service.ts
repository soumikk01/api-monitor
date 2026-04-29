import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /** Verify caller owns (or is member of) the project — result cached 60s */
  private async verifyAccess(projectId: string, userId: string) {
    const accessKey = `access:${projectId}:${userId}`;
    const accessCached = await this.cache.get<{
      id: string;
      userId: string;
      serviceMode: string;
    }>(accessKey);
    if (accessCached) return accessCached;

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ userId }, { members: { some: { userId } } }],
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.cache.set(accessKey, project, 60);
    return project;
  }

  /** GET /projects/:projectId/services — redact sdkToken from list */
  async list(projectId: string, userId: string) {
    await this.verifyAccess(projectId, userId);

    const cacheKey = `services:${projectId}`;
    const cached = await this.cache.get<object[]>(cacheKey);
    if (cached) return cached;

    const services = await this.prisma.service.findMany({
      where: { projectId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
      include: { _count: { select: { apiCalls: true } } },
    });
    // Only the project owner sees the sdkToken
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    const isOwner = project?.userId === userId;
    const result = services.map((s) =>
      isOwner ? s : { ...s, sdkToken: undefined },
    );

    await this.cache.set(cacheKey, result, 60);
    return result;
  }

  /** POST /projects/:projectId/services */
  async create(projectId: string, userId: string, dto: CreateServiceDto) {
    const project = await this.verifyAccess(projectId, userId);

    // For single-mode projects, only allow 1 service
    if (project.serviceMode === 'single') {
      const existing = await this.prisma.service.count({
        where: { projectId },
      });
      if (existing > 0) {
        throw new ForbiddenException(
          'Single-service projects can only have one service',
        );
      }
    }

    // Check name uniqueness within project
    const conflict = await this.prisma.service.findUnique({
      where: { projectId_name: { projectId, name: dto.name } },
    });
    if (conflict) {
      throw new ConflictException(
        `A service named "${dto.name}" already exists in this project`,
      );
    }

    const newService = await this.prisma.service.create({
      data: {
        name: dto.name,
        description: dto.description,
        projectId,
        isDefault: false,
        sdkToken: `sdk_${randomBytes(24).toString('hex')}`,
      },
    });
    // Bust list cache so next fetch reflects the new service
    await this.cache.del(`services:${projectId}`);
    return newService;
  }

  /** GET /projects/:projectId/services/:serviceId */
  async findOne(projectId: string, serviceId: string, userId: string) {
    await this.verifyAccess(projectId, userId);
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, projectId },
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  /** DELETE /projects/:projectId/services/:serviceId */
  async remove(projectId: string, serviceId: string, userId: string) {
    const project = await this.verifyAccess(projectId, userId);

    // Only owner can delete
    if (project.userId !== userId) {
      throw new ForbiddenException(
        'Only the project owner can delete services',
      );
    }

    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, projectId },
    });
    if (!service) throw new NotFoundException('Service not found');
    if (service.isDefault) {
      throw new ForbiddenException('Cannot delete the default service');
    }

    const deleted = await this.prisma.service.delete({
      where: { id: serviceId },
    });
    await this.cache.del(`services:${projectId}`);
    return deleted;
  }

  /** PATCH /projects/:projectId/services/:serviceId */
  async update(
    projectId: string,
    serviceId: string,
    userId: string,
    dto: UpdateServiceDto,
  ) {
    const project = await this.verifyAccess(projectId, userId);

    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, projectId },
    });
    if (!service) throw new NotFoundException('Service not found');

    // Only project owner can rename
    if (project.userId !== userId) {
      throw new ForbiddenException(
        'Only the project owner can update services',
      );
    }

    // Check name uniqueness if renaming
    if (dto.name && dto.name !== service.name) {
      const conflict = await this.prisma.service.findUnique({
        where: { projectId_name: { projectId, name: dto.name } },
      });
      if (conflict) {
        throw new ConflictException(
          `A service named "${dto.name}" already exists in this project`,
        );
      }
    }

    return this.prisma.service.update({
      where: { id: serviceId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  /**
   * Called after project creation to auto-create the default service
   * for single-service projects.
   */
  async createDefault(projectId: string, projectName: string) {
    const name = `default-service_${projectName}`;
    const existing = await this.prisma.service.findUnique({
      where: { projectId_name: { projectId, name } },
    });
    if (existing) return existing;

    return this.prisma.service.create({
      data: {
        name,
        description: 'Auto-created default service',
        projectId,
        isDefault: true,
        sdkToken: `sdk_${randomBytes(24).toString('hex')}`,
      },
    });
  }

  /** POST /projects/:projectId/services/:serviceId/regenerate-token */
  async regenerateSdkToken(
    projectId: string,
    serviceId: string,
    userId: string,
  ) {
    const project = await this.verifyAccess(projectId, userId);
    // Only owner can rotate tokens
    if (project.userId !== userId) {
      throw new ForbiddenException(
        'Only the project owner can regenerate SDK tokens',
      );
    }
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, projectId },
    });
    if (!service) throw new NotFoundException('Service not found');

    const newToken = `sdk_${randomBytes(24).toString('hex')}`;
    const updated = await this.prisma.service.update({
      where: { id: serviceId },
      data: { sdkToken: newToken },
    });
    return { sdkToken: updated.sdkToken };
  }
}
