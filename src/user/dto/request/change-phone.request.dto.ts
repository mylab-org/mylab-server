import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePhoneRequestDto {
  @ApiProperty({ example: '01099998888', description: '새 전화번호 (010으로 시작, 11자리)' })
  @IsString()
  @IsNotEmpty({ message: '새 전화번호를 입력하세요' })
  @Matches(/^010[0-9]{8}$/, { message: '올바른 전화번호 형식이 아닙니다' })
  newPhone: string;
}
