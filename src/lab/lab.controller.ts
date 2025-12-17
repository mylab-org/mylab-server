import { Controller, Post, Body } from '@nestjs/common';
import { LabService } from './lab.service.js';
import { CreateLabRequestDto } from './dto/request/create-lab.request.dto.js';

@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Post()
  create(@Body() dto: CreateLabRequestDto) {
    // TODO: @CurrentUser() 데코레이터로 실제 로그인 유저 갖고오기
    const id = 1; // 임시
    return this.labService.create(id, dto);
  }
}
