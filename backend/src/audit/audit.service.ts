import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditQueryDto {
  page: number;
  limit: number;
  projectId?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: AuditQueryDto) {
    const { page, limit, projectId, startDate, endDate } = query;

    // Verify project ownership if projectId is provided
    if (projectId) {
      const project = await this.prisma.project.findFirst({
        where: { id: projectId, userId },
      });
      if (!project)
        throw new ForbiddenException('Project not found or access denied');
    }

    const where: Record<string, unknown> = { userId };

    if (projectId) {
      where.projectId = projectId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        (where.createdAt as any).gte = new Date(startDate);
      }
      if (endDate) {
        (where.createdAt as any).lte = new Date(endDate);
      }
    }

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          project: {
            select: { name: true, id: true },
          },
        },
      }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // A helper method for other services to log audit events
  async logAction(
    userId: string,
    action: string,
    detail: any = null,
    projectId: string | null = null,
    ipAddress: string | null = null,
    userAgent: string | null = null,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        projectId,
        action,
        detail,
        ipAddress,
        userAgent,
      },
    });
  }
}
