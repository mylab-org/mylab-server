import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { ApiSendEmailVerification, ApiVerifyEmail } from './docs/verification.swagger.js';

@ApiTags('Verification')
@Controller('verify')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Post('email')
  @UseGuards(AccessTokenGuard)
  @ApiSendEmailVerification()
  async sendEmailVerification(@Request() req: { user: { userId: number } }) {
    return this.verificationService.sendEmailVerification(req.user.userId);
  }

  @Get('email')
  @ApiVerifyEmail()
  async verifyEmail(@Query('token') token: string) {
    return this.verificationService.verifyEmail(token);
  }
}
