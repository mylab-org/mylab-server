import { Body, Controller, Delete, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto.js';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto.js';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto.js';
import { ChangePhoneRequestDto } from './dto/request/change-phone.request.dto.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import {
  ApiChangePassword,
  ApiChangePhone,
  ApiDeleteUser,
  ApiGetProfile,
  ApiRegister,
  ApiUpdateProfile,
} from './docs/user.swagger.js';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiRegister()
  async register(@Body() dto: CreateUserRequestDto) {
    return this.userService.register(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  @ApiGetProfile()
  async getProfile(@Request() req: { user: { userId: number } }) {
    return this.userService.getProfile(req.user.userId);
  }

  // 내 정보 수정
  @UseGuards(AccessTokenGuard)
  @Patch('me')
  @ApiUpdateProfile()
  async updateProfile(
    @Request() req: { user: { userId: number } },
    @Body() dto: UpdateUserRequestDto,
  ) {
    return this.userService.updateProfile(req.user.userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me/change-password')
  @ApiChangePassword()
  async changePassword(
    @Request() req: { user: { userId: number } },
    @Body() dto: ChangePasswordRequestDto,
  ) {
    return this.userService.changePassword(req.user.userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me/change-phone')
  @ApiChangePhone()
  async changePhone(
    @Request() req: { user: { userId: number } },
    @Body() dto: ChangePhoneRequestDto,
  ) {
    return this.userService.changePhone(req.user.userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('me')
  @ApiDeleteUser()
  async deleteUser(@Request() req: { user: { userId: number } }) {
    return this.userService.deleteUser(req.user.userId);
  }
}
