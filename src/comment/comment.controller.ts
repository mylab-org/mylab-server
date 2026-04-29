import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import {
  ApiCreateComment,
  ApiDeleteComment,
  ApiGetComment,
  ApiUpdateComment,
} from './docs/comment.swagger.js';
import { CreateUpdateCommentRequestDto } from './dto/request/create-update-comment.request.dto.js';
import { User } from '../common/decoraters/user.decorator.js';
import { plainToInstance } from 'class-transformer';
import { getCommentResponseDto } from './dto/response/get-comment-response.dto.js';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/:pid')
  @ApiGetComment()
  async getComment(@User('userId') userId: number, @Param('pid', ParseIntPipe) pid: number) {
    const comments = await this.commentService.getComment(userId, pid);

    // plainToInstance를 사용하여 class-transformer 데코레이터 적용
    return plainToInstance(getCommentResponseDto, comments, { excludeExtraneousValues: true });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:pid')
  @ApiCreateComment()
  async createComment(
    @User('userId') userId: number,
    @Body() comment: CreateUpdateCommentRequestDto,
    @Param('pid', ParseIntPipe) pid: number,
  ) {
    return this.commentService.createComment(userId, pid, comment);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:cid')
  @ApiUpdateComment()
  async updateComment(
    @User('userId') userId: number,
    @Body() comment: CreateUpdateCommentRequestDto,
    @Param('cid', ParseIntPipe) cid: number,
  ) {
    return this.commentService.updateComment(userId, cid, comment);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:cid')
  @ApiDeleteComment()
  async deleteComment(@User('userId') userId: number, @Param('cid', ParseIntPipe) cid: number) {
    return this.commentService.deleteComment(userId, cid);
  }
}
