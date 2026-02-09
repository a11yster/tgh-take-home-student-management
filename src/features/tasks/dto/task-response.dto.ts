import { ApiProperty } from '@nestjs/swagger';

export enum TaskViewStatus {
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  COMPLETED = 'COMPLETED',
}

export class TaskResponseDto {
  @ApiProperty({ example: '67a8dc0ac23626bf17798f8d' })
  id: string;

  @ApiProperty({ example: 'Complete module tests' })
  title: string;

  @ApiProperty({ example: 'Add test coverage for task status calculation', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2026-02-10T17:00:00.000Z' })
  dueAt: string;

  @ApiProperty({ enum: TaskViewStatus, example: TaskViewStatus.OVERDUE })
  status: TaskViewStatus;

  @ApiProperty({ example: '2026-02-10T14:00:00.000Z', nullable: true })
  completedAt: string | null;
}
