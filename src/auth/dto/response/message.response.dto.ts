import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: '가입이 완료되었습니다. 이메일 인증을 진행해주세요.' })
  message: string;
}
