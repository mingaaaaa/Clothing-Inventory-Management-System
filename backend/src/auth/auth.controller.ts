import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// 创建校验路由
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 自定义装饰器，标记登录为公开接口，不需要携带JWT
  @Public()
  // 登录路由
  @Post('login')
  // 响应状态码为200（HttpStatus.OK）
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    // 开启@Res装饰器的passthrough选项，在使用原生的Express Response 对象的同时，仍然允许NestJS处理响应的发送。
    @Res({ passthrough: true }) response: Response,
  ) {
    // 调用AuthService的login方法进行登录验证，返回结果包含访问令牌和刷新令牌
    const result = await this.authService.login(dto);
    // 设置cookie
    response.cookie(
      'refresh_token',
      result.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );
    const { refreshToken: _, ...data } = result;
    return data;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const oldToken = request.cookies?.refresh_token;
    if (!oldToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const result = await this.authService.refresh(oldToken);
    response.cookie(
      'refresh_token',
      result.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );
    const { refreshToken: _, ...data } = result;
    return data;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: { id: number },
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies?.refresh_token;
    await this.authService.logout(user.id, token);
    response.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: { id: number }) {
    return this.authService.getProfile(user.id);
  }
}
