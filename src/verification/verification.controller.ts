import { Controller, Post, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VerificationService } from './verification.service.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';

@ApiTags('Verify')
@Controller('verify')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '교수 이메일 인증 발송' })
  @UseGuards(AccessTokenGuard)
  @Post('email/send')
  async sendEmailVerification(@Request() req: { user: { userId: number } }) {
    return this.verificationService.sendEmailVerification(req.user.userId);
  }

  @ApiOperation({ summary: '이메일 인증 처리' })
  @Get('email')
  async verifyEmail(@Query('token') token: string) {
    return this.verificationService.verifyEmail(token);
  }
}
