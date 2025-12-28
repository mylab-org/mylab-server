import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLabRequestDto {
  @ApiProperty({ example: 'My School', description: '학교 이름' })
  @IsString()
  @MinLength(2, { message: '학교 이름은 최소 2자 이상이어야 합니다.' })
  schoolName: string;

  @ApiProperty({ example: 'My Department', description: '학과 이름' })
  @IsString()
  @MinLength(2, { message: '학과 이름은 최소 2자 이상이어야 합니다.' })
  departmentName: string;

  @ApiProperty({ example: 'My lab', description: '연구실 이름' })
  @IsString()
  @MinLength(2, { message: '연구실 이름은 최소 2자 이상이어야 합니다.' })
  labName: string;
}
