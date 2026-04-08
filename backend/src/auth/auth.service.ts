import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto } from './auth.dto';
import { UserRole, UserStatus } from '@clothing-inventory/shared';

const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';
const REFRESH_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('账号已被禁用');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);
    const accessToken = this.generateAccessToken(user.id, user.username, user.role);

    const [refreshToken, menus] = await Promise.all([
      this.generateRefreshToken(user.id),
      this.getUserMenus(user.role as UserRole),
    ]);

    return {
      accessToken,
      refreshToken,
      user: this.toUserProfile(user),
      menus,
    };
  }

  async refresh(oldToken: string) {
    const hashedToken = this.hashToken(oldToken);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const user = storedToken.user;
    const accessToken = this.generateAccessToken(user.id, user.username, user.role);

    const [refreshToken, menus] = await Promise.all([
      this.generateRefreshToken(user.id),
      this.getUserMenus(user.role as UserRole),
    ]);

    return {
      accessToken,
      refreshToken,
      user: this.toUserProfile(user),
      menus,
    };
  }

  async logout(userId: number, token?: string) {
    if (token) {
      const hashedToken = this.hashToken(token);
      await this.prisma.refreshToken.updateMany({
        where: { token: hashedToken, userId },
        data: { isRevoked: true },
      });
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
    }
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const menus = await this.getUserMenus(user.role as UserRole);
    return { ...this.toUserProfile(user), menus };
  }

  private toUserProfile(user: { id: number; username: string; realName: string | null; phone: string | null; role: string; storeId: number | null }) {
    return {
      id: user.id,
      username: user.username,
      realName: user.realName,
      phone: user.phone,
      role: user.role,
      storeId: user.storeId,
    };
  }

  private generateAccessToken(userId: number, username: string, role: string): string {
    const payload = { sub: userId, username, role };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: ACCESS_EXPIRY,
    });
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: REFRESH_EXPIRY,
    });

    const hashedToken = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS);

    // Cleanup expired/revoked tokens for this user to prevent table bloat
    await this.prisma.refreshToken.deleteMany({
      where: { userId, OR: [{ isRevoked: true }, { expiresAt: { lt: new Date() } }] },
    });

    await this.prisma.refreshToken.create({
      data: { token: hashedToken, userId, expiresAt },
    });

    return token;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async getUserMenus(role: UserRole) {
    const roleMenus = await this.prisma.roleMenu.findMany({
      where: { role },
      include: { menu: true },
      orderBy: { menu: { sort: 'asc' } },
    });

    return roleMenus.map((rm) => ({
      id: rm.menu.id,
      key: rm.menu.key,
      label: rm.menu.label,
      path: rm.menu.path,
      icon: rm.menu.icon,
      sort: rm.menu.sort,
      parentId: rm.menu.parentId,
    }));
  }
}
