import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [AuthModule, TasksModule],
  controllers: [StudentController],
})
export class StudentModule {}
