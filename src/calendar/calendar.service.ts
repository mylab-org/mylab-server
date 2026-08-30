import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma, RecurrenceType, ScheduleType } from '@prisma/client';
import { CreateScheduleRequestDto } from './dto/request/create-schedule.request.dto.js';
import { GetMonthlyScheduleRequestDto } from './dto/request/get-monthly-schedule.request.dto.js';
import { CALENDAR_ERRORS } from './constants/calendar.error.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import { CreateScheduleResponseDto } from './dto/response/create-schedule.response.dto.js';
import { GetMonthlyScheduleResponseDto } from './dto/response/get-monthly-schedule.response.dto.js';
import { UpdateScheduleRequestDto } from './dto/request/update-schedule.request.dto.js';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(
    userId: number,
    labId: number,
    dto: CreateScheduleRequestDto,
  ): Promise<CreateScheduleResponseDto> {
    await this.chkUserAccessLab(userId, labId);
    const startAt = new Date(dto.start_at);
    const endAt = dto.end_at ? new Date(dto.end_at) : null;
    const recurrenceType = dto.recurrence_type ?? RecurrenceType.NONE;
    this.validateSchedulePeriod(startAt, endAt);
    this.validateRecurrenceAllowed(dto.schedule_type, recurrenceType);

    const schedule = await this.prisma.$transaction(async (tx) => {
      await this.chkParticipantsInLab(labId, dto.participant_ids, tx);
      const created = await tx.schedules.create({
        data: {
          lab_id: BigInt(labId),
          schedule_type: dto.schedule_type,
          recurrence_type: recurrenceType,
          title: dto.title,
          start_at: startAt,
          end_at: endAt,
          location: dto.location,
          created_by: BigInt(userId),
        },
        select: {
          id: true,
          schedule_type: true,
          recurrence_type: true,
          title: true,
          start_at: true,
          end_at: true,
          location: true,
        },
      });
      await tx.schedule_participants.createMany({
        data: dto.participant_ids.map((memberId) => ({
          schedule_id: created.id,
          lab_id: BigInt(labId),
          lab_member_id: BigInt(memberId),
        })),
      });
      return created;
    });
    return this.toScheduleResponse(
      schedule,
      {
        start_at: schedule.start_at,
        end_at: schedule.end_at,
      },
      dto.participant_ids,
    );
  }

  async getMonthlySchedule(
    userId: number,
    labId: number,
    query: GetMonthlyScheduleRequestDto,
  ): Promise<GetMonthlyScheduleResponseDto[]> {
    await this.chkUserAccessLab(userId, labId);

    const year = Number(query.year);
    const month = Number(query.month);

    const monthStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const nextMonthStart = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    const schedules = await this.prisma.schedules.findMany({
      where: {
        lab_id: BigInt(labId),
        OR: [
          { start_at: { gte: monthStart, lt: nextMonthStart } },
          { recurrence_type: { not: RecurrenceType.NONE }, start_at: { lt: nextMonthStart } },
        ],
      },
      select: {
        id: true,
        schedule_type: true,
        recurrence_type: true,
        title: true,
        start_at: true,
        end_at: true,
        location: true,
        schedule_participants: { select: { lab_member_id: true } },
        scheduleExceptions: {
          where: { occurrence_at: { gte: monthStart, lt: nextMonthStart } },
          select: { occurrence_at: true },
        },
      },
      orderBy: { start_at: 'asc' },
    });

    return schedules.flatMap((schedule) => {
      const cancelledAt = new Set(
        schedule.scheduleExceptions.map((e) => e.occurrence_at.getTime()),
      );
      return this.expandOccurrences(schedule, monthStart, nextMonthStart).map((occurrence) => ({
        ...this.toScheduleResponse(
          schedule,
          occurrence,
          schedule.schedule_participants.map((p) => Number(p.lab_member_id)),
        ),
        is_cancelled: cancelledAt.has(occurrence.start_at.getTime()),
      }));
    });
  }

  async updateSchedule(
    userId: number,
    labId: number,
    scheduleId: number,
    dto: UpdateScheduleRequestDto,
  ): Promise<CreateScheduleResponseDto> {
    await this.chkUserAccessLab(userId, labId);
    const existing = await this.findScheduleOrThrow(labId, scheduleId);
    // this.chkUserCanUpdateSchedule(userId, existing); // 추후 일정 수정 권한 검증을 위한 로직

    const scheduleType = dto.schedule_type ?? existing.schedule_type;
    const recurrenceType = dto.recurrence_type ?? existing.recurrence_type;
    const title = dto.title ?? existing.title;
    const location = dto.location ?? existing.location;
    const startAt = dto.start_at ? new Date(dto.start_at) : existing.start_at;
    const endAt = dto.end_at !== undefined ? new Date(dto.end_at) : existing.end_at;

    this.validateSchedulePeriod(startAt, endAt);
    this.validateRecurrenceAllowed(scheduleType, recurrenceType);

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.participant_ids !== undefined) {
        await this.chkParticipantsInLab(labId, dto.participant_ids, tx);
      }
      const result = await tx.schedules.update({
        where: { id_lab_id: { id: BigInt(scheduleId), lab_id: BigInt(labId) } },
        data: {
          schedule_type: scheduleType,
          recurrence_type: recurrenceType,
          title,
          start_at: startAt,
          end_at: endAt,
          location,
          updated_by: BigInt(userId),
        },
        select: {
          id: true,
          schedule_type: true,
          recurrence_type: true,
          title: true,
          start_at: true,
          end_at: true,
          location: true,
        },
      });
      if (dto.participant_ids !== undefined) {
        await tx.schedule_participants.deleteMany({ where: { schedule_id: result.id } });
        await tx.schedule_participants.createMany({
          data: dto.participant_ids.map((memberId) => ({
            schedule_id: result.id,
            lab_id: BigInt(labId),
            lab_member_id: BigInt(memberId),
          })),
        });
      }
      return result;
    });
    const participantIds =
      dto.participant_ids !== undefined
        ? dto.participant_ids
        : (
            await this.prisma.schedule_participants.findMany({
              where: { schedule_id: updated.id },
              select: { lab_member_id: true },
            })
          ).map((p) => Number(p.lab_member_id));
    return this.toScheduleResponse(
      updated,
      { start_at: updated.start_at, end_at: updated.end_at },
      participantIds,
    );
  }

  async deleteSchedule(userId: number, labId: number, scheduleId: number): Promise<void> {
    await this.chkUserAccessLab(userId, labId);
    await this.findScheduleOrThrow(labId, scheduleId);
    await this.prisma.schedules.delete({
      where: { id_lab_id: { id: BigInt(scheduleId), lab_id: BigInt(labId) } },
    });
  }

  async cancelOccurrence(
    userId: number,
    labId: number,
    scheduleId: number,
    occurrenceAt: string,
  ): Promise<void> {
    await this.chkUserAccessLab(userId, labId);
    const schedule = await this.findScheduleOrThrow(labId, scheduleId);
    if (schedule.recurrence_type === RecurrenceType.NONE) {
      throw new CommonException(CALENDAR_ERRORS.OCCURRENCE_CANCEL_NOT_ALLOWED);
    }
    const occurrenceDate = new Date(occurrenceAt);
    this.validateOccurrenceExists(schedule, occurrenceDate);
    try {
      await this.prisma.schedule_exceptions.create({
        data: {
          schedule_id: schedule.id,
          lab_id: BigInt(labId),
          occurrence_at: occurrenceDate,
          cancelled_by: BigInt(userId),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new CommonException(CALENDAR_ERRORS.OCCURRENCE_ALREADY_CANCELLED);
      }
      throw e;
    }
  }

  private validateOccurrenceExists(
    schedule: { start_at: Date; end_at: Date | null; recurrence_type: RecurrenceType },
    occurrenceAt: Date,
  ) {
    const found = this.expandOccurrences(
      schedule,
      occurrenceAt,
      new Date(occurrenceAt.getTime() + 1),
    );
    if (found.length === 0) {
      throw new CommonException(CALENDAR_ERRORS.OCCURRENCE_NOT_FOUND);
    }
  }

  private validateSchedulePeriod(startAt: Date, endAt: Date | null) {
    if (endAt && endAt < startAt) {
      throw new CommonException(CALENDAR_ERRORS.INVALID_SCHEDULE_PERIOD);
    }
  }

  private validateRecurrenceAllowed(scheduleType: ScheduleType, recurrenceType: RecurrenceType) {
    if (recurrenceType !== RecurrenceType.NONE && scheduleType !== ScheduleType.MEETING) {
      throw new CommonException(CALENDAR_ERRORS.RECURRENCE_NOT_ALLOWED);
    }
  }

  private async findScheduleOrThrow(labId: number, scheduleId: number) {
    const schedule = await this.prisma.schedules.findUnique({
      where: { id_lab_id: { id: BigInt(scheduleId), lab_id: BigInt(labId) } },
      select: {
        id: true,
        created_by: true,
        schedule_type: true,
        recurrence_type: true,
        title: true,
        start_at: true,
        end_at: true,
        location: true,
      },
    });
    if (!schedule) {
      throw new CommonException(CALENDAR_ERRORS.SCHEDULE_NOT_FOUND);
    }
    return schedule;
  }

  // private chkUserCanUpdateSchedule(userId: number, schedule: { create_by: bigint }) {
  //   // 현재는 연구실 소속 멤버 전체 허용. 추후 작성자 본인 또는 교수나 랩장 등으로 제한 가능
  //   return;
  // }

  private async chkParticipantsInLab(
    labId: number,
    participantIds: number[],
    client: PrismaService | Prisma.TransactionClient = this.prisma,
  ) {
    const members = await client.lab_members.findMany({
      where: {
        id: { in: participantIds.map((id) => BigInt(id)) },
        lab_id: BigInt(labId),
        left_at: null,
      },
      select: { id: true },
    });
    if (members.length !== participantIds.length) {
      throw new CommonException(CALENDAR_ERRORS.PARTICIPANT_NOT_FOUND);
    }
  }

  private async chkUserAccessLab(userId: number, labId: number) {
    const member = await this.prisma.lab_members.findFirst({
      where: { user_id: BigInt(userId), lab_id: BigInt(labId), left_at: null },
      select: { id: true },
    });
    if (member) return;
    const lab = await this.prisma.labs.findUnique({
      where: { id: BigInt(labId) },
      select: { id: true },
    });
    throw new CommonException(
      lab ? CALENDAR_ERRORS.USER_NOT_FOUND_IN_LAB : CALENDAR_ERRORS.LAB_NOT_FOUND,
    );
  }

  private expandOccurrences(
    schedule: {
      start_at: Date;
      end_at: Date | null;
      recurrence_type: RecurrenceType;
    },
    rangeStart: Date,
    rangeEnd: Date,
  ): { start_at: Date; end_at: Date | null }[] {
    if (schedule.recurrence_type === RecurrenceType.NONE) {
      return schedule.start_at >= rangeStart && schedule.start_at < rangeEnd
        ? [{ start_at: schedule.start_at, end_at: schedule.end_at }]
        : [];
    }
    const durationMs = schedule.end_at
      ? schedule.end_at.getTime() - schedule.start_at.getTime()
      : null;

    let step = 0;
    if (
      schedule.recurrence_type === RecurrenceType.DAILY ||
      schedule.recurrence_type === RecurrenceType.WEEKLY
    ) {
      const unitMs =
        schedule.recurrence_type === RecurrenceType.DAILY ? 86_400_000 : 86_400_000 * 7;
      const elapsed = rangeStart.getTime() - schedule.start_at.getTime();
      step = elapsed > 0 ? Math.floor(elapsed / unitMs) : 0;
    } else if (schedule.recurrence_type === RecurrenceType.MONTHLY) {
      const monthsDiff =
        (rangeStart.getUTCFullYear() - schedule.start_at.getUTCFullYear()) * 12 +
        (rangeStart.getUTCMonth() - schedule.start_at.getUTCMonth());
      step = Math.max(0, monthsDiff - 1);
    }

    const occurrences: { start_at: Date; end_at: Date | null }[] = [];
    let cursor = this.advance(schedule.start_at, schedule.recurrence_type, step);
    while (cursor < rangeEnd) {
      if (cursor >= rangeStart) {
        occurrences.push({
          start_at: new Date(cursor),
          end_at: durationMs !== null ? new Date(cursor.getTime() + durationMs) : null,
        });
      }
      step += 1;
      cursor = this.advance(schedule.start_at, schedule.recurrence_type, step);
    }
    return occurrences;
  }

  private advance(origin: Date, type: RecurrenceType, step: number): Date {
    const next = new Date(origin);
    switch (type) {
      case RecurrenceType.NONE:
        return next;
      case RecurrenceType.DAILY:
        next.setUTCDate(origin.getUTCDate() + step);
        return next;
      case RecurrenceType.WEEKLY:
        next.setUTCDate(origin.getUTCDate() + step * 7);
        return next;
      case RecurrenceType.MONTHLY:
        next.setUTCMonth(origin.getUTCMonth() + step);
        if (next.getUTCDate() !== origin.getUTCDate()) {
          next.setUTCDate(0);
        }
        return next;
      default:
        throw new Error(`Unhandled RecurrenceType: ${String(type)}`);
    }
  }

  private toScheduleResponse(
    schedule: {
      id: bigint;
      schedule_type: ScheduleType;
      recurrence_type: RecurrenceType;
      title: string;
      location: string | null;
    },
    occurrence: { start_at: Date; end_at: Date | null },
    participantIds: number[],
  ) {
    return {
      id: Number(schedule.id),
      schedule_type: schedule.schedule_type,
      recurrence_type: schedule.recurrence_type,
      title: schedule.title,
      start_at: occurrence.start_at,
      end_at: occurrence.end_at,
      location: schedule.location,
      participant_ids: participantIds,
    };
  }
}
