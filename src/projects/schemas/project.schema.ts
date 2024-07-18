import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @ApiProperty({ description: 'The user ID associated with the project' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: 'The name of the project' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'The description of the project' })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'The date the project was created',
    type: Date,
  })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
