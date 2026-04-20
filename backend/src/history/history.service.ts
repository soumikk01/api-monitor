import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryHistoryDto } from './dto/query-history.dto';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: QueryHistoryDto) {
    const { projectId, page = 1, limit = 50, status, method } = query;

    // Verify project ownership
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project)
      throw new ForbiddenException('Project not found or access denied');

    const where: Record<string, unknown> = { projectId };
    if (status) where.status = status.toUpperCase();
    if (method) where.method = method.toUpperCase();

    const [total, calls] = await Promise.all([
      this.prisma.apiCall.count({ where }),
      this.prisma.apiCall.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: calls,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const call = await this.prisma.apiCall.findUnique({ where: { id } });
    if (!call) throw new NotFoundException('API call not found');
    if (call.userId !== userId) throw new ForbiddenException();
    return call;
  }
}
