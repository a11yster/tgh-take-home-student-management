import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from 'src/modules/tasks/tasks.service';
import { TaskRepository } from 'src/modules/tasks/repositories/task.repository';
import { UsersService } from 'src/modules/users/users.service';
import { TaskStatus } from 'src/modules/tasks/entities/task.entity';
import { TaskViewStatus } from 'src/modules/tasks/dto/task-response.dto';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useValue: {
            createTask: jest.fn(),
            listByStudentId: jest.fn(),
            findByIdAndStudentId: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findStudentById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return OVERDUE for pending task with past due time', async () => {
    const pastDue = new Date(Date.now() - 60_000);

    taskRepository.listByStudentId.mockResolvedValue([
      {
        id: 'task-id',
        title: 'Past task',
        description: null,
        dueAt: pastDue,
        status: TaskStatus.PENDING,
        completedAt: null,
      },
    ] as any);

    const result = await service.getStudentTasks('student-id');

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(TaskViewStatus.OVERDUE);
  });

  it('should mark task as completed', async () => {
    const task = {
      id: 'task-id',
      title: 'Task',
      description: null,
      dueAt: new Date(Date.now() + 60_000),
      status: TaskStatus.PENDING,
      completedAt: null,
    } as any;

    taskRepository.findByIdAndStudentId.mockResolvedValue(task);
    taskRepository.save.mockResolvedValue({
      ...task,
      status: TaskStatus.COMPLETED,
    } as any);

    const result = await service.markTaskCompleted('task-id', 'student-id');

    expect(taskRepository.save).toHaveBeenCalled();
    expect(result.status).toBe(TaskViewStatus.COMPLETED);
  });

  it('should throw NotFoundException when task does not belong to student', async () => {
    taskRepository.findByIdAndStudentId.mockResolvedValue(null);

    await expect(
      service.markTaskCompleted('task-id', 'student-id'),
    ).rejects.toThrow(NotFoundException);
  });
});
