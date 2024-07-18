import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @ApiProperty({ description: 'The title of the task' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'The ID of the project to which the task belongs',
  })
  @Prop({ required: true })
  projectId: string;

  @ApiProperty({ description: 'The ID of the user who created the task' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: 'The status of the task' })
  @Prop({ required: true })
  status: string;

  @ApiProperty({ description: 'The description of the task' })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'The date the task was created',
    type: Date,
  })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
