import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class JoinLabRequestDto {
  @ApiProperty({
    example: 'A1B2C3D4',
    description: '8자리 초대 코드',
  })
  @IsString()
  @IsNotEmpty({ message: '초대 코드는 공백이 허용되지 않습니다.' })
  @Length(8, 8, { message: '초대 코드는 8자리입니다' })
  @Matches(/^[A-Z0-9]+$/, { message: '초대 코드는 대문자와 숫자만 포함합니다' })
  code: string;
}
