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

  // 校验用户
  async validateUser(username: string, password: string) {
    // 根据用户名查询用户信息，如果用户不存在则抛出UnauthorizedException异常
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    // 显式转换 user.status 为 UserStatus 枚举类型
    if ((user.status as UserStatus) !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('账号已被禁用');
    }
    // bcrypt.compare函数会自动从存储的哈希值中提取盐值，并使用它来对输入的密码进行哈希处理，然后将结果与存储的哈希值进行比较。
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);
    const accessToken = this.generateAccessToken(
      user.id,
      user.username,
      user.role,
    );

    const [refreshToken, menus] = await Promise.all([
      // 生成刷新令牌
      this.generateRefreshToken(user.id),
      // 获取用户菜单
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

    if (
      !storedToken ||
      storedToken.isRevoked ||
      storedToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const user = storedToken.user;
    const accessToken = this.generateAccessToken(
      user.id,
      user.username,
      user.role,
    );

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

  private toUserProfile(user: {
    id: number;
    username: string;
    realName: string | null;
    phone: string | null;
    role: string;
    storeId: number | null;
  }) {
    return {
      id: user.id,
      username: user.username,
      realName: user.realName,
      phone: user.phone,
      role: user.role,
      storeId: user.storeId,
    };
  }

  // 生成访问令牌
  private generateAccessToken(
    userId: number,
    username: string,
    role: string,
  ): string {
    const payload = { sub: userId, username, role };
    // 生成JWT并返回
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'), // 签名密钥
      expiresIn: ACCESS_EXPIRY, // 过期时间
    });
  }

  // 生成刷新token
  private async generateRefreshToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    // 根据刷新令牌密钥生成token
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: REFRESH_EXPIRY,
    });

    // 将刷新令牌进行哈希处理后存储在数据库中，以提高安全性，即使数据库泄露也无法直接使用这些令牌。
    const hashedToken = this.hashToken(token);
    const expiresAt = new Date();
    // 设置刷新令牌的过期时间为当前时间加上REFRESH_DAYS天
    expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS);

    // 清理该用户已过期 / 已撤销的令牌，防止数据表膨胀。
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [{ isRevoked: true }, { expiresAt: { lt: new Date() } }],
      },
    });

    // 存储新的刷新令牌
    await this.prisma.refreshToken.create({
      data: { token: hashedToken, userId, expiresAt },
    });

    return token;
  }

  private hashToken(token: string): string {
    // 创建一个SHA-256哈希对象   将token输入到算法中   以十六进制字符串格式输出结果
    return createHash('sha256').update(token).digest('hex');
  }

  private async getUserMenus(role: UserRole) {
    const roleMenus = await this.prisma.roleMenu.findMany({
      where: { role },
      include: { menu: true },
      orderBy: { menu: { sort: 'asc' } },
    });

    return roleMenus.map((rm: any) => ({
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
