import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginRequestDto } from './dto/request/login.request.dto.js';
import { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { ApiLogin, ApiLogout, ApiRefresh, ApiRegister } from './docs/auth.swagger.js';
import { ApiTags } from '@nestjs/swagger';
import { RegisterRequestDto } from './dto/request/register.request.dto.js';

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
  async logout(@Request() req: { user: { userId: number } }) {
    return this.authService.logout(req.user.userId);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiRefresh()
  async refreshToken(@Request() req: { user: { userId: number } }) {
    return this.authService.refreshToken(req.user.userId);
  }
}
