import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { tasks } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { TASK_ERROR } from './constants/task.error.js';
import {
  DEFAULT_TASK_STATUS,
  TASK_STATUS,
  TASK_STATUS_LABEL,
} from './constants/tast-status.constant.js';
import type { TaskStatus } from './constants/tast-status.constant.js';
import { CreateTaskRequestDto } from './dto/request/create-task.request.dto.js';
import { UpdateTaskRequestDto } from './dto/request/update-task.request.dto.js';
import { UpdateTaskStatusRequestDto } from './dto/request/update-task-status.request.dto.js';
import { TaskResponseDto } from './dto/response/task.response.dto.js';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async listTasks(userId: number): Promise<TaskResponseDto[]> {
    const rows = await this.prisma.tasks.findMany({
      where: { user_id: BigInt(userId) },
      orderBy: [{ start_at: 'asc' }, { id: 'asc' }],
    });

    return rows.map((task) => this.toTaskResponse(task));
  }

  async createTask(userId: number, dto: CreateTaskRequestDto): Promise<TaskResponseDto> {
    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);
    this.chkPeriod(startAt, endAt);

    const task = await this.prisma.tasks.create({
      data: {
        user_id: BigInt(userId),
        type: dto.type,
        title: dto.title,
        description: dto.description,
        start_at: startAt,
        end_at: endAt,
        status: DEFAULT_TASK_STATUS,
      },
    });

    return this.toTaskResponse(task);
  }

  async updateTask(
    userId: number,
    taskId: number,
    dto: UpdateTaskRequestDto,
  ): Promise<TaskResponseDto> {
    const task = await this.chkOwnTask(userId, taskId);

    const startAt = dto.startAt !== undefined ? new Date(dto.startAt) : task.start_at;
    const endAt = dto.endAt !== undefined ? new Date(dto.endAt) : task.end_at;
    this.chkPeriod(startAt, endAt);

    const updated = await this.prisma.tasks.update({
      where: { id: task.id },
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        start_at: dto.startAt !== undefined ? startAt : undefined,
        end_at: dto.endAt !== undefined ? endAt : undefined,
      },
    });

    return this.toTaskResponse(updated);
  }

  async updateStatus(
    userId: number,
    taskId: number,
    dto: UpdateTaskStatusRequestDto,
  ): Promise<TaskResponseDto> {
    const task = await this.chkOwnTask(userId, taskId);

    const updated = await this.prisma.tasks.update({
      where: { id: task.id },
      data: { status: dto.status },
    });

    return this.toTaskResponse(updated);
  }

  async deleteTask(userId: number, taskId: number): Promise<{ message: string }> {
    const task = await this.chkOwnTask(userId, taskId);

    await this.prisma.tasks.delete({
      where: { id: task.id },
    });

    return { message: '업무가 삭제되었습니다.' };
  }

  private async chkOwnTask(userId: number, taskId: number): Promise<tasks> {
    const task = await this.prisma.tasks.findFirst({
      where: { id: BigInt(taskId), user_id: BigInt(userId) },
    });
    if (!task) throw new NotFoundException(TASK_ERROR.TASK_NOT_FOUND);
    return task;
  }

  private chkPeriod(startAt: Date, endAt: Date) {
    if (endAt < startAt) {
      throw new BadRequestException(TASK_ERROR.INVALID_PERIOD);
    }
  }

  private toTaskResponse(task: tasks): TaskResponseDto {
    const statusIndex = TASK_STATUS.indexOf(task.status as TaskStatus);

    return {
      taskId: Number(task.id),
      userId: Number(task.user_id),
      type: task.type,
      title: task.title,
      description: task.description,
      startAt: task.start_at,
      endAt: task.end_at,
      status: task.status,
      statusLabel: TASK_STATUS_LABEL[task.status as TaskStatus] ?? task.status,
      statusStep: statusIndex + 1,
      totalSteps: TASK_STATUS.length,
      createdAt: task.created_at,
    };
  }
}
