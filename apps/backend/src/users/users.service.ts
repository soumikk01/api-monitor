import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

const USER_TTL = 60; // seconds

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findById(id: string) {
    const cacheKey = `user:${id}`;
    const cached = await this.cache.get<object>(cacheKey);
    if (cached) return cached;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    // Never return the hashed password
    const { password: _pw, ...safe } = user;
    await this.cache.set(cacheKey, safe, USER_TTL);
    return safe;
  }

  /** Update user's avatar index */
  async updateAvatar(userId: string, avatar: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
    });
    const { password: _pw, ...safe } = user;
    // Bust cached profile so next /me fetch returns updated avatar
    await this.cache.del(`user:${userId}`);
    return safe;
  }
}
