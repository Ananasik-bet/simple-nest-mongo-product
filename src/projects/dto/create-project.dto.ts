import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'The name of the project' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The description of the project' })
  @IsString()
  description: string;
}

export class UpdateProjectDto {
  @ApiProperty({ description: 'The name of the project', required: false })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The description of the project',
    required: false,
  })
  @IsString()
  description?: string;
}
