import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto.js';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto.js';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto.js';
import { ChangePhoneRequestDto } from './dto/request/change-phone.request.dto.js';
import { ApiTags } from '@nestjs/swagger';
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

  @Get(':id')
  @ApiGetProfile()
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getProfile(id);
  }

  @Patch(':id')
  @ApiUpdateProfile()
  async updateProfile(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRequestDto) {
    return this.userService.updateProfile(id, dto);
  }

  @Patch(':id/change-password')
  @ApiChangePassword()
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordRequestDto,
  ) {
    return this.userService.changePassword(id, dto);
  }

  @Patch(':id/change-phone')
  @ApiChangePhone()
  async changePhone(@Param('id', ParseIntPipe) id: number, @Body() dto: ChangePhoneRequestDto) {
    return this.userService.changePhone(id, dto);
  }

  @Delete(':id')
  @ApiDeleteUser()
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
