import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule, TasksModule],
  controllers: [AdminController],
})
export class AdminModule {}
