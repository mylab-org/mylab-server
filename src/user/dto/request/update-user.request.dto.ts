import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiProperty({
    example: 'DOCTOR',
    description: '학위',
    enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'])
  degree?: string;
}
