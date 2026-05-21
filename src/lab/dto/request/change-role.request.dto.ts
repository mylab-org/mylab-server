import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class ChangeRoleRequestDto {
  @IsNotEmpty()
  @IsEnum(Role, { message: '유효하지 않은 역할입니다' })
  role: Role;
}
