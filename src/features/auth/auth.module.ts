import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { RolesGuard } from './infrastructure/guard/roles.guard';
import { UsersModule } from 'src/features/users/users.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY', '1d'),
        },
      }),
    }),
  ],
  providers: [AuthService, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
