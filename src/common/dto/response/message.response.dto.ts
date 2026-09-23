import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: '요청이 정상적으로 처리되었습니다.' })
  message: string;
}
