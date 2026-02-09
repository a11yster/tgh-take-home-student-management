import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty({
    description: 'Student user ID',
    example: '67a8db20c23626bf17798f6a',
  })
  @IsMongoId()
  studentId: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Complete NestJS RBAC assignment',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Implement guard and roles decorator',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Task due time in ISO date format',
    example: '2026-02-10T17:00:00.000Z',
  })
  @IsDateString()
  dueAt: string;
}
