import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

/** 유저와 연구실의 관계(소속 연구실과 그 안에서의 역할)를 나타내는 DTO */
export class LabMembershipDto {
  @ApiProperty({ example: 1 })
  labId: number;

  @ApiProperty({ example: 'AI연구실' })
  labName: string;

  @ApiProperty({ example: 'MEMBER', enum: ['PROFESSOR', 'LAB_LEADER', 'SUB_LEADER', 'MEMBER'] })
  role: Role;
}
