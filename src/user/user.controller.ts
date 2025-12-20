import { Body, Controller, Delete, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto.js';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto.js';
import { ChangePhoneRequestDto } from './dto/request/change-phone.request.dto.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import {
  ApiChangePassword,
  ApiChangePhone,
  ApiDeleteUser,
  ApiGetProfile,
  ApiUpdateProfile,
} from './docs/user.swagger.js';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  @ApiGetProfile()
  async getProfile(@Request() req: { user: { userId: number } }) {
    return this.userService.getProfile(req.user.userId);
  }

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
  @Delete('me')
  @ApiDeleteUser()
  async deleteUser(@Request() req: { user: { userId: number } }) {
    return this.userService.deleteUser(req.user.userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me/password')
  @ApiChangePassword()
  async changePassword(
    @Request() req: { user: { userId: number } },
    @Body() dto: ChangePasswordRequestDto,
  ) {
    return this.userService.changePassword(req.user.userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me/phone')
  @ApiChangePhone()
  async changePhone(
    @Request() req: { user: { userId: number } },
    @Body() dto: ChangePhoneRequestDto,
  ) {
    return this.userService.changePhone(req.user.userId, dto);
  }
}
