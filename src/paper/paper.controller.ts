import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PaperService } from './paper.service.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { User } from '../common/decoraters/user.decorator.js';
import { CreatePaperRequestDto } from './dto/request/create-paper.request.dto.js';
import { UpdatePaperStatusRequestDto } from './dto/request/update-paper-status.request.dto.js';
import { AddPaperMemberRequestDto } from './dto/request/add-paper-member.request.dto.js';
import {
  ApiAddPaperMember,
  ApiCreatePaper,
  ApiDeletePaper,
  ApiGetPaper,
  ApiListPapers,
  ApiRemovePaperMember,
  ApiUpdatePaperStatus,
} from './docs/paper.swagger.js';

@Controller('labs/:labId/papers')
export class PaperController {
  constructor(private readonly paperService: PaperService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiCreatePaper()
  async createPaper(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: CreatePaperRequestDto,
  ) {
    return this.paperService.createPaper(userId, labId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiListPapers()
  async listPapers(@User('userId') userId: number, @Param('labId', ParseIntPipe) labId: number) {
    return this.paperService.listPapers(userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':paperId')
  @ApiGetPaper()
  async getPaper(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('paperId', ParseIntPipe) paperId: number,
  ) {
    return this.paperService.getPaper(userId, labId, paperId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':paperId/status')
  @ApiUpdatePaperStatus()
  async updateStatus(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('paperId', ParseIntPipe) paperId: number,
    @Body() dto: UpdatePaperStatusRequestDto,
  ) {
    return this.paperService.updateStatus(userId, labId, paperId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':paperId')
  @ApiDeletePaper()
  async deletePaper(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('paperId', ParseIntPipe) paperId: number,
  ) {
    return this.paperService.deletePaper(userId, labId, paperId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':paperId/members')
  @ApiAddPaperMember()
  async addMember(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('paperId', ParseIntPipe) paperId: number,
    @Body() dto: AddPaperMemberRequestDto,
  ) {
    return this.paperService.addMember(userId, labId, paperId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':paperId/members/:memberUserId')
  @ApiRemovePaperMember()
  async removeMember(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('paperId', ParseIntPipe) paperId: number,
    @Param('memberUserId', ParseIntPipe) memberUserId: number,
  ) {
    return this.paperService.removeMember(userId, labId, paperId, memberUserId);
  }
}
