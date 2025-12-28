import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateInviteCodeResponseDto {
  @ApiProperty({ example: true, description: '초대 코드 유효 여부' })
  isValid: boolean;

  @ApiPropertyOptional({ example: 'My Lab', description: '연구실 이름' })
  labName?: string;

  @ApiPropertyOptional({ example: 'My School', description: '학교 이름' })
  universityName?: string;

  @ApiPropertyOptional({ example: 'My Department', description: '학과 이름' })
  departmentName?: string;

  @ApiPropertyOptional({ example: '김교수', description: '교수 이름' })
  professorName?: string;
}
