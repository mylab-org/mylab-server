import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service.js';

import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import {
  ApiCreateBoard,
  ApiDeleteBoard,
  ApiGetBoard,
  ApiGetCategory,
  ApiLikeBoard,
  ApiUnlikeBoard,
  ApiUpdateBoard,
} from './docs/board.swagger.js';
import { CreateUpdateBoardRequest } from './dto/request/create-update-board.request.dto.js';
import { plainToInstance } from 'class-transformer';
import { GetBoardResponseDto, PostItemDto } from './dto/response/get-board.response.dto.js';
import { User } from '../common/decoraters/user.decorator.js';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(AccessTokenGuard)
  @Get(':labId/category')
  @ApiGetCategory()
  async getCategories(@User('userId') userId: number, @Param('labId', ParseIntPipe) labId: number) {
    return this.boardService.getCategory(userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':categoryId')
  @ApiGetBoard()
  async getBoard(
    @User('userId') userId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
  ) {
    const response = await this.boardService.getBoard(userId, categoryId, cursor);

    return plainToInstance(GetBoardResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post(':categoryId')
  @ApiCreateBoard()
  async createBoard(
    @User('userId') userId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() board: CreateUpdateBoardRequest,
  ) {
    const post = await this.boardService.createBoard(userId, categoryId, board);

    return plainToInstance(PostItemDto, post, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:pid')
  @ApiUpdateBoard()
  async updateBoard(
    @User('userId') userId: number,
    @Param('pid', ParseIntPipe) pid: number,
    @Body() board: CreateUpdateBoardRequest,
  ) {
    const post = await this.boardService.updateBoard(userId, pid, board);

    return plainToInstance(PostItemDto, post, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:pid')
  @ApiDeleteBoard()
  async deleteBoard(@User('userId') userId: number, @Param('pid', ParseIntPipe) pid: number) {
    const message = await this.boardService.deleteBoard(userId, pid);

    return {
      status: 200,
      message: message,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:pid/like')
  @ApiLikeBoard()
  async likeBoard(@User('userId') userId: number, @Param('pid', ParseIntPipe) pid: number) {
    const message = await this.boardService.setBoardLike(userId, pid, true);

    return {
      status: 200,
      message: message,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:pid/like')
  @ApiUnlikeBoard()
  async unlikeBoard(@User('userId') userId: number, @Param('pid', ParseIntPipe) pid: number) {
    const message = await this.boardService.setBoardLike(userId, pid, false);

    return {
      status: 200,
      message: message,
    };
  }
}
