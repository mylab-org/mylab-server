import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto.js';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto.js';
import { WithdrawUserRequestDto } from './dto/request/withdraw-user.request.dto.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import {
  ApiChangePassword,
  ApiGetMyCommentedPosts,
  ApiGetMyPosts,
  ApiGetProfile,
  ApiUpdateProfile,
  ApiWithdrawUser,
} from './docs/user.swagger.js';
import { GetMyPostsResponseDto } from './dto/response/get-my-posts.response.dto.js';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiGetProfile()
  async getProfile(@Request() req: { user: { userId: number } }) {
    return this.userService.getProfile(req.user.userId);
  }

  @Get('me/posts')
  @UseGuards(AccessTokenGuard)
  @ApiGetMyPosts()
  async getMyPosts(
    @Request() req: { user: { userId: number } },
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
  ): Promise<GetMyPostsResponseDto> {
    return this.userService.getMyPosts(req.user.userId, cursor);
  }

  @Get('me/commented-posts')
  @UseGuards(AccessTokenGuard)
  @ApiGetMyCommentedPosts()
  async getMyCommentedPosts(
    @Request() req: { user: { userId: number } },
    @Query('cursor', new ParseIntPipe({ optional: true })) cursor?: number,
  ): Promise<GetMyPostsResponseDto> {
    return this.userService.getMyCommentedPosts(req.user.userId, cursor);
  }

  @Patch('me')
  @UseGuards(AccessTokenGuard)
  @ApiUpdateProfile()
  async updateProfile(
    @Request() req: { user: { userId: number } },
    @Body() dto: UpdateUserRequestDto,
  ) {
    return this.userService.updateProfile(req.user.userId, dto);
  }

  @Delete('me')
  @UseGuards(AccessTokenGuard)
  @ApiWithdrawUser()
  async withdrawUser(
    @Request() req: { user: { userId: number } },
    @Body() dto: WithdrawUserRequestDto,
  ) {
    return this.userService.withdrawUser(req.user.userId, dto);
  }

  @Patch('me/password')
  @UseGuards(AccessTokenGuard)
  @ApiChangePassword()
  async changePassword(
    @Request() req: { user: { userId: number } },
    @Body() dto: ChangePasswordRequestDto,
  ) {
    return this.userService.changePassword(req.user.userId, dto);
  }
}
