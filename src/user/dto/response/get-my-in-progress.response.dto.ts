import { ApiProperty } from '@nestjs/swagger';
import { PaperResponseDto } from '../../../paper/dto/response/paper.response.dto.js';
import { TaskResponseDto } from '../../../task/dto/response/task.response.dto.js';

export class GetMyInProgressResponseDto {
  @ApiProperty({ type: [PaperResponseDto], description: '완료되지 않은 내 논문' })
  papers: PaperResponseDto[];

  @ApiProperty({
    type: [TaskResponseDto],
    description: '진행 중인 내 개인 업무/미팅 (IN_PROGRESS만)',
  })
  tasks: TaskResponseDto[];
}
