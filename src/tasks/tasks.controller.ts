import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccessUserGuard } from '../auth/guards/access-user.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('users/:userId/projects/:projectId/tasks')
@UseGuards(JwtAuthGuard, AccessUserGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateTaskDto })
  async create(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.create(userId, projectId, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for a project' })
  @ApiResponse({ status: 200, description: 'Array of tasks.', type: [Task] })
  async findAll(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Query('status') status: string,
    @Query('sortBy') sortBy: string,
    @Query('order') order: string,
    @Query('createdAt') createdAt: Date,
  ): Promise<Task[]> {
    const filter = {
      userId,
      projectId,
      ...(status && { status }),
      ...(createdAt && { createdAt: { $gte: new Date(createdAt) } }),
    };
    const sort = sortBy ? { [sortBy]: order === 'desc' ? -1 : 1 } : {};
    return this.tasksService.findAll(filter, sort);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'The task.', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async findOne(@Param('taskId') taskId: string): Promise<Task> {
    return this.tasksService.findOne(taskId);
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiBody({ type: UpdateTaskDto })
  async update(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async remove(@Param('taskId') taskId: string): Promise<any> {
    return this.tasksService.remove(taskId);
  }
}
