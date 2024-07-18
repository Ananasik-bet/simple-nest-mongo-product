import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from '../projects/schemas/project.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(
    userId: string,
    projectId: string,
    dto: CreateTaskDto,
  ): Promise<Task> {
    // Validate projectId format
    if (!Types.ObjectId.isValid(projectId)) {
      throw new BadRequestException(`Invalid projectId: ${projectId}`);
    }

    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new NotFoundException(`Project not found, projectId:${projectId} `);
    }
    const task = new this.taskModel({ userId, projectId, ...dto });
    return task.save();
  }

  async findAll(filter: any, sort: any): Promise<Task[]> {
    return this.taskModel.find(filter).sort(sort).exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id }).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id }, dto, { new: true })
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async remove(id: string): Promise<any> {
    const task = await this.taskModel.findOneAndDelete({ _id: id }).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
