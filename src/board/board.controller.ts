import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
  ApiUpdateBoard,
} from './docs/board.swagger.js';
import { CreateUpdateBoardRequest } from './dto/request/create-update-board.request.dto.js';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(AccessTokenGuard)
  @Get(':labId/category')
  @ApiGetCategory()
  async getCategories(
    @Request() req: { user: { userId: number } },
    @Param('labId', ParseIntPipe) labId: number,
  ) {
    return this.boardService.getCategory(req.user.userId, labId);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':categoryId')
  @ApiGetBoard()
  async getBoard(
    @Request() req: { user: { userId: number } },
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.boardService.getBoard(req.user.userId, categoryId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':categoryId')
  @ApiCreateBoard()
  async createBoard(
    @Request() req: { user: { userId: number } },
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() board: CreateUpdateBoardRequest,
  ) {
    return this.boardService.createBoard(req.user.userId, categoryId, board);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:pid')
  @ApiUpdateBoard()
  async updateBoard(
    @Request() req: { user: { userId: number } },
    @Param('pid', ParseIntPipe) pid: number,
    @Body() board: CreateUpdateBoardRequest,
  ) {
    const message = await this.boardService.updateBoard(req.user.userId, pid, board);
    return {
      status: 200,
      message: message,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:pid')
  @ApiDeleteBoard()
  async deleteBoard(@Request() req: { user: { userId: number } }, @Param('pid') pid: number) {
    const message = await this.boardService.deleteBoard(req.user.userId, pid);

    return {
      status: 200,
      message: message,
    };
  }
  //
  // @Get('/comment/:pid')
  // async getComment(@Req() req, @Param('id') id: string) {}
  //
  // @Post('/comment/:pid')
  // async createComment(@Req() req, @Body() comment) {}
  //
  // @Patch('/comment/:cid')
  // async updateComment(@Req() req, @Param('id') id: string) {}
  //
  // @Delete('/comment/:cid')
  // async deleteComment(@Req() req, @Param('id') id: string) {}
}
