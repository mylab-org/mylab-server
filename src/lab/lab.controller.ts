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
  ApiLeaveLab,
  ApiRemoveMember,
  ApiGetLab,
  ApiUpdateLab,
  ApiGetLabLinks,
  ApiCreateLabLink,
  ApiDeleteLabLink,
  ApiUpdateLabLink,
} from './docs/lab.swagger.js';
import { GetLabResponseDto } from './dto/response/get-lab.response.dto.js';
import { UpdateLabRequestDto } from './dto/request/update-lab.request.dto.js';
import { LabLinkResponseDto } from './dto/response/lab-link.response.dto.js';
import { CreateLabLinkRequestDto } from './dto/request/create-lab-link.request.dto.js';
import { UpdateLabLinkRequestDto } from './dto/request/update-lab-link.request.dto.js';
import { ValidateInviteCodeResponseDto } from './dto/response/validate-invite-code.response.dto.js';
import { JoinLabRequestDto } from './dto/request/join-lab.request.dto.js';
import { JoinLabResponseDto } from './dto/response/join-lab.response.dto.js';
import { GetMembersResponseDto } from './dto/response/get-members.dto.js';
import { ChangeRoleRequestDto } from './dto/request/change-role.request.dto.js';

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

  @UseGuards(AccessTokenGuard)
  @Delete(':labId/members/me')
  @ApiLeaveLab()
  async leaveLab(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
  ): Promise<{ message: string }> {
    return this.labService.leaveLab(req.user.userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':labId/members/:userId')
  @ApiRemoveMember()
  async removeMember(
    @Param('labId', ParseIntPipe) labId: number,
    @Param('userId', ParseIntPipe) targetUserId: number,
    @Request() req: { user: { userId: number } },
  ): Promise<{ message: string }> {
    return this.labService.removeMember(labId, targetUserId, req.user.userId);
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
  ): Promise<GetLabResponseDto> {
    return this.labService.updateLab(req.user.userId, labId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':labId/links')
  @ApiGetLabLinks()
  async getLinks(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
  ): Promise<LabLinkResponseDto[]> {
    return this.labService.getLinks(req.user.userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':labId/links')
  @ApiCreateLabLink()
  async createLink(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: CreateLabLinkRequestDto,
  ): Promise<LabLinkResponseDto> {
    return this.labService.createLink(req.user.userId, labId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':labId/links/:linkId')
  @ApiUpdateLabLink()
  async updateLink(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Param('linkId', ParseIntPipe) linkId: number,
    @Body() dto: UpdateLabLinkRequestDto,
  ): Promise<LabLinkResponseDto> {
    return this.labService.updateLink(req.user.userId, labId, linkId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':labId/links/:linkId')
  @ApiDeleteLabLink()
  async deleteLink(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
    @Param('linkId', ParseIntPipe) linkId: number,
  ): Promise<{ message: string }> {
    return this.labService.deleteLink(req.user.userId, labId, linkId);
  }
}
