import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  New = 'new',
  InProgress = 'in_progress',
  Completed = 'completed',
}

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the task' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The status of the task', enum: TaskStatus })
  @IsString()
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
