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
  Patch,
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
  ApiGetMembers,
  ApiChangeRole,
  ApiUpdateLab,
  ApiGetLab,
  ApiDeleteLab,
  ApiGetLabLinks,
  ApiCreateLabLink,
  ApiDeleteLabLink,
} from './docs/lab.swagger.js';
import { ValidateInviteCodeResponseDto } from './dto/response/validate-invite-code.response.dto.js';
import { JoinLabRequestDto } from './dto/request/join-lab.request.dto.js';
import { JoinLabResponseDto } from './dto/response/join-lab.response.dto.js';
import { GetMembersResponseDto } from './dto/response/get-members.dto.js';
import { ChangeRoleRequestDto } from './dto/request/change-role.request.dto.js';
import { UpdateLabRequestDto } from './dto/request/update-lab.request.dto.js';
import { UpdateLabResponseDto } from './dto/response/update-lab.response.dto.js';
import { GetLabResponseDto } from './dto/response/get-lab.response.dto.js';
import { CreateLabLinkRequestDto } from './dto/request/create-lab-link.request.dto.js';
import { LabLinkResponseDto } from './dto/response/lab-link.response.dto.js';

@ApiTags('연구실')
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
  @Delete(':labId/revoke-invite-codes/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRevokeInviteCode()
  async revokeInviteCode(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Param('code') code: string,
  ): Promise<{ message: string }> {
    return this.labService.revokeInviteCode(labId, code, req.user.userId);
  }

  @Get('invite-codes/chk-validate/:code')
  @ApiValidateInviteCode()
  async validateInviteCode(@Param('code') code: string): Promise<ValidateInviteCodeResponseDto> {
    return this.labService.validateInviteCode(code);
  }

  @UseGuards(AccessTokenGuard)
  @Post('join')
  @ApiJoinLab()
  async joinLab(
    @Request() req: { user: { userId: number } },
    @Body() dto: JoinLabRequestDto,
  ): Promise<JoinLabResponseDto> {
    return this.labService.joinLab(req.user.userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':labId')
  @ApiGetLab()
  async getLab(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
  ): Promise<GetLabResponseDto> {
    return this.labService.getLab(req.user.userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':labId')
  @ApiUpdateLab()
  async updateLab(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: UpdateLabRequestDto,
  ): Promise<UpdateLabResponseDto> {
    return this.labService.updateLab(req.user.userId, labId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':labId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteLab()
  async deleteLab(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
  ): Promise<void> {
    return this.labService.deleteLab(req.user.userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':labId/links')
  @ApiGetLabLinks()
  async getLabLinks(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
  ): Promise<LabLinkResponseDto[]> {
    return this.labService.getLabLinks(req.user.userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':labId/links')
  @ApiCreateLabLink()
  async createLabLink(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: CreateLabLinkRequestDto,
  ): Promise<LabLinkResponseDto> {
    return this.labService.createLabLink(req.user.userId, labId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':labId/links/:linkId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteLabLink()
  async deleteLabLink(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Param('linkId', ParseIntPipe) linkId: number,
  ): Promise<void> {
    return this.labService.deleteLabLink(req.user.userId, labId, linkId);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':labId/members')
  @ApiGetMembers()
  async getMembers(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
  ): Promise<GetMembersResponseDto[]> {
    return this.labService.getMembers(req.user.userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':labId/members/:userId/change-role')
  @ApiChangeRole()
  async changeRole(
    @Param('labId', ParseIntPipe) labId: number,
    @Param('userId', ParseIntPipe) targetUserId: number,
    @Request() req: { user: { userId: number } },
    @Body() dto: ChangeRoleRequestDto,
  ): Promise<void> {
    return this.labService.changeRole(labId, targetUserId, req.user.userId, dto);
  }
}
