import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Degree } from '@prisma/client';

export class UpdateUserRequestDto {
  @ApiProperty({
    example: 'DOCTOR',
    description: '학위',
    enum: Degree,
    required: false,
  })
  @IsOptional()
  @IsEnum(Degree)
  degree?: Degree;
}
