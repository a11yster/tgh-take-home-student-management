import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskResponseDto, TaskViewStatus } from 'src/features/tasks/dto/task-response.dto';
import { AssignTaskDto } from 'src/features/tasks/dto/assign-task.dto';
import { TaskRepository } from 'src/features/tasks/infrastructure/task.repository';
import { TaskDocument, TaskStatus } from 'src/features/tasks/domain/entities/task.entity';
import { UsersService } from 'src/features/users/application/users.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly usersService: UsersService,
  ) {}

  async assignTask(assignTaskDto: AssignTaskDto, assignedBy: string): Promise<TaskResponseDto> {
    await this.usersService.findStudentById(assignTaskDto.studentId);

    const task = await this.taskRepository.createTask({
      studentId: assignTaskDto.studentId,
      title: assignTaskDto.title,
      description: assignTaskDto.description,
      dueAt: new Date(assignTaskDto.dueAt),
      assignedBy,
    });

    return this.toTaskResponse(task);
  }

  async getStudentTasks(studentId: string): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.listByStudentId(studentId);
    return tasks.map((task) => this.toTaskResponse(task));
  }

  async markTaskCompleted(taskId: string, studentId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findByIdAndStudentId(taskId, studentId);
    if (!task) {
      throw new NotFoundException('Task not found for student');
    }

    if (task.status !== TaskStatus.COMPLETED) {
      task.status = TaskStatus.COMPLETED;
      task.completedAt = new Date();
      await this.taskRepository.save(task);
    }

    return this.toTaskResponse(task);
  }

  private toTaskResponse(task: TaskDocument): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueAt: task.dueAt.toISOString(),
      status: this.computeStatus(task),
      completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    };
  }

  private computeStatus(task: TaskDocument): TaskViewStatus {
    if (task.status === TaskStatus.COMPLETED) {
      return TaskViewStatus.COMPLETED;
    }

    const now = new Date();
    return task.dueAt.getTime() < now.getTime()
      ? TaskViewStatus.OVERDUE
      : TaskViewStatus.PENDING;
  }
}
