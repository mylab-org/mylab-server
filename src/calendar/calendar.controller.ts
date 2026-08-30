import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CalendarService } from './calendar.service.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import {
  ApiCalendarCancelOccurrence,
  ApiCalendarCreateSchedule,
  ApiCalendarDeleteSchedule,
  ApiCalendarGetMonthlySchedule,
  ApiCalendarUpdateSchedule,
} from './docs/calendar.swagger.js';
import { CreateScheduleRequestDto } from './dto/request/create-schedule.request.dto.js';
import { GetMonthlyScheduleRequestDto } from './dto/request/get-monthly-schedule.request.dto.js';
import { User } from '../common/decoraters/user.decorator.js';
import { CreateScheduleResponseDto } from './dto/response/create-schedule.response.dto.js';
import { GetMonthlyScheduleResponseDto } from './dto/response/get-monthly-schedule.response.dto.js';
import { UpdateScheduleRequestDto } from './dto/request/update-schedule.request.dto.js';
import { CancelOccurrenceRequestDto } from './dto/request/cancel-occurrence.request.dto.js';

@ApiTags('Calendar')
@Controller('labs/:labId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // 연구실 일정 생성
  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiCalendarCreateSchedule()
  createSchedule(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Body() dto: CreateScheduleRequestDto,
  ): Promise<CreateScheduleResponseDto> {
    return this.calendarService.createSchedule(userId, labId, dto);
  }

  // 월간 캘린더 조회 (일정 있는 날짜에 표시하기 위함)
  // GET /labs/:labId/calendar/dates?year=2026&month=1
  @UseGuards(AccessTokenGuard)
  @Get('dates')
  @ApiCalendarGetMonthlySchedule()
  getMonthlySchedule(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Query() query: GetMonthlyScheduleRequestDto,
  ): Promise<GetMonthlyScheduleResponseDto[]> {
    return this.calendarService.getMonthlySchedule(userId, labId, query);
  }

  // 일정 수정
  // 참가자 0명으로 수정은 불가능
  @UseGuards(AccessTokenGuard)
  @Patch(':scheduleId')
  @ApiCalendarUpdateSchedule()
  updateSchedule(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() dto: UpdateScheduleRequestDto,
  ): Promise<CreateScheduleResponseDto> {
    return this.calendarService.updateSchedule(userId, labId, scheduleId, dto);
  }

  // 일정 삭제
  @UseGuards(AccessTokenGuard)
  @Delete(':scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCalendarDeleteSchedule()
  deleteSchedule(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<void> {
    return this.calendarService.deleteSchedule(userId, labId, scheduleId);
  }

  // 반복 일정 중 하루 취소(스킵)
  @UseGuards(AccessTokenGuard)
  @Delete(':scheduleId/occurrences')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCalendarCancelOccurrence()
  cancelOccurrence(
    @User('userId') userId: number,
    @Param('labId', ParseIntPipe) labId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Query() query: CancelOccurrenceRequestDto,
  ): Promise<void> {
    return this.calendarService.cancelOccurrence(userId, labId, scheduleId, query.occurrence_at);
  }
}
