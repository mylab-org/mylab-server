import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description: '현재 기기의 Refresh Token',
  })
  @IsString()
  @IsNotEmpty({ message: 'Refresh Token을 입력하세요' })
  refreshToken: string;
}
