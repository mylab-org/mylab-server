import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Delete,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { LabService } from './lab.service.js';
import { CreateLabRequestDto } from './dto/request/create-lab.request.dto.js';
import { CreateInviteCodeRequestDto } from './dto/request/create-invite-code.request.dto.js';
import { InviteCodeResponseDto } from './dto/response/invite-code.response.dto.js';
import { CreateLabResponseDto } from './dto/response/create-lab.response.dto.js';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import {
  ApiValidateInviteCode,
  ApiCreateInviteCode,
  ApiCreateLab,
  ApiJoinLab,
  ApiRevokeInviteCode,
} from './docs/lab.swagger.js';
import { ValidateInviteCodeResponseDto } from './dto/response/validate-invite-code.response.dto.js';
import { JoinLabRequestDto } from './dto/request/join-lab.request.dto.js';
import { JoinLabResponseDto } from './dto/response/join-lab.response.dto.js';

@ApiTags('Labs')
@Controller('labs')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiCreateLab()
  async createLab(
    @Request() req: { user: { userId: number } },
    @Body() dto: CreateLabRequestDto,
  ): Promise<CreateLabResponseDto> {
    return this.labService.createLab(req.user.userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':labId/invite-codes')
  @ApiCreateInviteCode()
  async createInviteCode(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: CreateInviteCodeRequestDto,
  ): Promise<InviteCodeResponseDto> {
    return this.labService.createInviteCode(req.user.userId, labId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':labId/invite-codes/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRevokeInviteCode()
  async revokeInviteCode(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Param('code') code: string,
  ): Promise<void> {
    return this.labService.revokeInviteCode(labId, code, req.user.userId);
  }

  @Get('invite-codes/chk-validate/:code')
  @ApiValidateInviteCode()
  async validateInviteCode(@Param('code') code: string): Promise<ValidateInviteCodeResponseDto> {
    return this.labService.validateInviteCode(code);
  }

  @UseGuards(AccessTokenGuard)
  @Post('invite-codes')
  @ApiJoinLab()
  async joinLab(
    @Request() req: { user: { userId: number } },
    @Body() dto: JoinLabRequestDto,
  ): Promise<JoinLabResponseDto> {
    return this.labService.joinLab(req.user.userId, dto);
  }
}
