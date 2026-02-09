import { Module } from '@nestjs/common';
import { StudentController } from './presentation/student.controller';
import { AuthModule } from 'src/features/auth/auth.module';
import { TasksModule } from 'src/features/tasks/tasks.module';

@Module({
  imports: [AuthModule, TasksModule],
  controllers: [StudentController],
})
export class StudentModule {}
