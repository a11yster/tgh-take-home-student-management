import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TaskDocument, TaskEntity, TaskStatus } from '../entities/task.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(TaskEntity.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async createTask(input: {
    studentId: string;
    title: string;
    description?: string;
    dueAt: Date;
    assignedBy: string;
  }): Promise<TaskDocument> {
    return this.taskModel.create({
      studentId: new Types.ObjectId(input.studentId),
      title: input.title,
      description: input.description || null,
      dueAt: input.dueAt,
      assignedBy: new Types.ObjectId(input.assignedBy),
      status: TaskStatus.PENDING,
      completedAt: null,
    });
  }

  async listByStudentId(studentId: string): Promise<TaskDocument[]> {
    return this.taskModel
      .find({ studentId: new Types.ObjectId(studentId) })
      .sort({ dueAt: 1 })
      .exec();
  }

  async findByIdAndStudentId(taskId: string, studentId: string): Promise<TaskDocument | null> {
    return this.taskModel.findOne({
      _id: new Types.ObjectId(taskId),
      studentId: new Types.ObjectId(studentId),
    });
  }

  async save(task: TaskDocument): Promise<TaskDocument> {
    return task.save();
  }
}
