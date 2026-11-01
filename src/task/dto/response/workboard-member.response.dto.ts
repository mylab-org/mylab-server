import { ApiProperty } from '@nestjs/swagger';
import { Degree, Role } from '@prisma/client';
import { PaperResponseDto } from '../../../paper/dto/response/paper.response.dto.js';
import { TaskResponseDto } from './task.response.dto.js';

export class WorkboardMemberResponseDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: '김철수' })
  name: string;

  @ApiProperty({ example: 'DOCTOR', enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'] })
  degree: Degree;

  @ApiProperty({ example: 'MEMBER', enum: Role })
  role: Role;

  @ApiProperty({ type: [PaperResponseDto], description: '해당 멤버가 참여 중인 논문' })
  papers: PaperResponseDto[];

  @ApiProperty({ type: [TaskResponseDto], description: '해당 멤버의 개인 업무 및 미팅' })
  tasks: TaskResponseDto[];
}
