import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Query,
  Request,
  UseGuards,
  Headers,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginRequestDto } from './dto/request/login.request.dto.js';
import { RegisterRequestDto } from './dto/request/register.request.dto.js';
import { ResendVerificationDto } from './dto/request/resend-verification.dto.js';
import {
  REFRESH_TOKEN_CLEAR_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from './constants/refresh-token-cookie.constant.js';
import { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import {
  ApiLogin,
  ApiLogout,
  ApiRefresh,
  ApiRegister,
  ApiResendVerification,
  ApiVerifyEmail,
} from './docs/auth.swagger.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiRegister()
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent?: string,
  ) {
    const { refreshToken, ...result } = await this.authService.login(dto, userAgent);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    return result;
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @ApiLogout()
  async logout(
    @Request() req: ExpressRequest & { user: { userId: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    // 쿠키 없어도(이미 만료 등) 로그아웃은 성공 처리
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_CLEAR_COOKIE_OPTIONS);
    return this.authService.logout(req.user.userId, refreshToken);
  }

  @Get('verify-email')
  @ApiVerifyEmail()
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @ApiResendVerification()
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(dto);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiRefresh()
  async refreshToken(
    @Request() req: { user: { userId: string; refreshToken: string } },
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent?: string,
  ) {
    const { refreshToken, ...result } = await this.authService.refreshToken(
      req.user.userId,
      req.user.refreshToken,
      userAgent,
    );
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    return result;
  }
}
