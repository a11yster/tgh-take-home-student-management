import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskEntity, TaskSchema } from './domain/entities/task.entity';
import { TaskRepository } from './infrastructure/task.repository';
import { TasksService } from './application/tasks.service';
import { UsersModule } from 'src/features/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: TaskEntity.name, schema: TaskSchema }]),
  ],
  providers: [TaskRepository, TasksService],
  exports: [TasksService],
})
export class TasksModule {}
