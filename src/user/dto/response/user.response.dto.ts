import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Degree } from '@prisma/client';
import { LabMembershipDto } from '../../../common/dto/response/lab-membership.response.dto.js';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: bigint;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 'MASTER', enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'] })
  degree: Degree;

  @ApiProperty({ example: true })
  is_email_verified: boolean;

  @ApiProperty({ example: '2024-12-16T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-12-16T00:00:00.000Z' })
  updated_at: Date;

  @ApiPropertyOptional({
    type: LabMembershipDto,
    nullable: true,
    description: '소속 연구실 정보. 소속된 연구실이 없으면 null',
  })
  lab: LabMembershipDto | null;
}
