import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginRequestDto } from './dto/request/login.request.dto.js';
import { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { ApiLogin, ApiLogout, ApiRefresh } from './docs/auth.swagger.js';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiLogin()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @ApiLogout()
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Request() req: { user: { userId: number } }) {
    return this.authService.logout(req.user.userId);
  }

  @ApiRefresh()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Request() req: { user: { userId: number } }) {
    return this.authService.refreshToken(req.user.userId);
  }
}
