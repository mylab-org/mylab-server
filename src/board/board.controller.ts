import {
  Body,
  Controller,
  DefaultValuePipe,
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
  ApiUpdateBoard,
} from './docs/board.swagger.js';
import { CreateUpdateBoardRequest } from './dto/request/create-update-board.request.dto.js';
import { plainToInstance } from 'class-transformer';
import { CreateBoardResponseDto } from './dto/response/create-board.response.dto.js';
import { GetBoardResponseDto } from './dto/response/get-board.response.dto.js';
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
    @Query('page', new DefaultValuePipe(1)) page: number,
  ) {
    const response = await this.boardService.getBoard(userId, categoryId, page);

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
    const response = await this.boardService.createBoard(userId, categoryId, board);

    return plainToInstance(CreateBoardResponseDto, response, {
      excludeExtraneousValues: true, // @Expose가 붙지 않은 필드(lab_members 등)는 자동으로 제외
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
    const message = await this.boardService.updateBoard(userId, pid, board);
    return {
      status: 200,
      message: message,
    };
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
}
