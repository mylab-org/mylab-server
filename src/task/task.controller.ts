import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { User } from '../common/decoraters/user.decorator.js';
import {
  ApiCreateTask,
  ApiDeleteTask,
  ApiListTasks,
  ApiUpdateTask,
  ApiUpdateTaskStatus,
} from './docs/task.swagger.js';
import { CreateTaskRequestDto } from './dto/request/create-task.request.dto.js';
import { UpdateTaskRequestDto } from './dto/request/update-task.request.dto.js';
import { UpdateTaskStatusRequestDto } from './dto/request/update-task-status.request.dto.js';
import { TaskService } from './task.service.js';

@ApiTags('개인 업무 및 미팅')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiListTasks()
  async listTasks(@User('userId') userId: number) {
    return this.taskService.listTasks(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiCreateTask()
  async createTask(@User('userId') userId: number, @Body() dto: CreateTaskRequestDto) {
    return this.taskService.createTask(userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':taskId')
  @ApiUpdateTask()
  async updateTask(
    @User('userId') userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskRequestDto,
  ) {
    return this.taskService.updateTask(userId, taskId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':taskId/status')
  @ApiUpdateTaskStatus()
  async updateStatus(
    @User('userId') userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskStatusRequestDto,
  ) {
    return this.taskService.updateStatus(userId, taskId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':taskId')
  @ApiDeleteTask()
  async deleteTask(@User('userId') userId: number, @Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.deleteTask(userId, taskId);
  }
}
