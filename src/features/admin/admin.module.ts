import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { UsersModule } from 'src/features/users/users.module';
import { TasksModule } from 'src/features/tasks/tasks.module';
import { AuthModule } from 'src/features/auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule, TasksModule],
  controllers: [AdminController],
})
export class AdminModule {}
