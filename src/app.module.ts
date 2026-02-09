import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { TasksModule } from './features/tasks/tasks.module';
import { AdminModule } from './features/admin/admin.module';
import { StudentModule } from './features/student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    AdminModule,
    StudentModule,
  ],
})
export class AppModule {}
