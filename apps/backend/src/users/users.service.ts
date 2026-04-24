import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    // Never return password
    const { password: _pw, ...safe } = user;
    return safe;
  }

  async findBySdkToken(token: string) {
    return this.prisma.user.findUnique({ where: { sdkToken: token } });
  }

  /**
   * Returns the personalised CLI init command for this user.
   * The frontend shows this command after login so the user can copy-paste it.
   */
  async getCliCommand(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return {
      command: `npx api-nest-cli@latest init --token ${user.sdkToken}`,
      token: user.sdkToken,
      instructions:
        'Run this command in the root of your dev project to start monitoring all HTTP calls.',
    };
  }

  /** Rotates the SDK token — old CLI connections will stop working */
  async regenerateSdkToken(userId: string) {
    const newToken = `sdk_${randomBytes(24).toString('hex')}`;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { sdkToken: newToken },
    });
    return {
      command: `npx api-nest-cli@latest init --token ${user.sdkToken}`,
      token: user.sdkToken,
    };
  }

  /** Update user's avatar index */
  async updateAvatar(userId: string, avatar: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
    });
    const { password: _pw, ...safe } = user;
    return safe;
  }
}
