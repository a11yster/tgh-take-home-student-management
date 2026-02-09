import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/features/auth/dto/login.dto';
import { UsersService } from 'src/features/users/application/users.service';
import { Role } from 'src/features/auth/domain/enum/role.enum';
import { ActorEnum } from 'src/features/auth/domain/enum/actor.enum';
import { RefreshTokenDto } from 'src/features/auth/dto/refresh-token.dto';
import { AppException } from 'src/common/exceptions/app.exception';
import { ErrorCode } from 'src/common/exceptions/error-code.enum';

export type TokenPayload = {
  userId: string;
  email: string;
  actorType: ActorEnum;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async loginAdmin(loginDto: LoginDto) {
    const user = await this.validateCredentials(loginDto, [Role.ADMIN]);
    return this.createAuthPayload(
      user.id,
      user.email,
      user.actorType,
      user.roles[0],
    );
  }

  async loginStudent(loginDto: LoginDto) {
    const user = await this.validateCredentials(loginDto, [Role.STUDENT]);
    return this.createAuthPayload(
      user.id,
      user.email,
      user.actorType,
      user.roles[0],
    );
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    if (!refreshTokenDto.refreshToken) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'unauthorized',
        ErrorCode.UNAUTHORIZED,
      );
    }

    const payload = await this.verifyRefreshToken(refreshTokenDto.refreshToken);
    return this.createAuthPayload(
      payload.userId,
      payload.email,
      payload.actorType,
      payload.role,
    );
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get<string>('TOKEN_SECRET'),
    });
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  private async validateCredentials(loginDto: LoginDto, acceptedRoles: Role[]) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hasValidRole = acceptedRoles.some((role) => user.roles.includes(role));
    if (!hasValidRole) {
      throw new UnauthorizedException('Invalid role for this login endpoint');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private async createAuthPayload(
    userId: string,
    email: string,
    actorType: ActorEnum,
    role: Role,
  ) {
    const accessToken = await this.generateAccessToken(
      userId,
      email,
      actorType,
      role,
    );
    const refreshToken = await this.generateRefreshToken(
      userId,
      email,
      actorType,
      role,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(
    userId: string,
    email: string,
    actorType: ActorEnum,
    role: Role,
  ) {
    const payload: TokenPayload = {
      userId,
      email,
      actorType,
      role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRY', '1d'),
    });
  }

  private async generateRefreshToken(
    userId: string,
    email: string,
    actorType: ActorEnum,
    role: Role,
  ) {
    const payload: TokenPayload = {
      userId,
      email,
      actorType,
      role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_JWT_EXPIRY', '365d'),
    });
  }
}
