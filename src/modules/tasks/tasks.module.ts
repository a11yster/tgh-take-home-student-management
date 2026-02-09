import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskEntity, TaskSchema } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: TaskEntity.name, schema: TaskSchema }]),
  ],
  providers: [TaskRepository, TasksService],
  exports: [TasksService],
})
export class TasksModule {}
