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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginRequestDto } from './dto/request/login.request.dto.js';
import { RegisterRequestDto } from './dto/request/register.request.dto.js';
import { ResendVerificationDto } from './dto/request/resend-verification.dto.js';
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
  async login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @ApiLogout()
  async logout(@Request() req: { user: { userId: string } }) {
    return this.authService.logout(req.user.userId);
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
  async refreshToken(@Request() req: { user: { userId: string } }) {
    return this.authService.refreshToken(req.user.userId);
  }
}
