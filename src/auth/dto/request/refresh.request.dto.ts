import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description: '로그인 시 발급받은 Refresh Token',
  })
  @IsString()
  @IsNotEmpty({ message: 'Refresh Token을 입력하세요' })
  refreshToken: string;
}
