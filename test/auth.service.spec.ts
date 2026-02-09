import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/features/auth/application/auth.service';
import { UsersService } from 'src/features/users/application/users.service';
import { ActorEnum } from 'src/features/auth/domain/enum/actor.enum';
import { Role } from 'src/features/auth/domain/enum/role.enum';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest
              .fn()
              .mockResolvedValueOnce('mock.access.token')
              .mockResolvedValueOnce('mock.refresh.token')
              .mockResolvedValueOnce('next.access.token')
              .mockResolvedValueOnce('next.refresh.token'),
            verifyAsync: jest.fn().mockResolvedValue({
              userId: 'admin-id',
              email: 'admin@example.com',
              actorType: ActorEnum.ADMIN_WEB_APP,
              role: Role.ADMIN,
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              const values: Record<string, string> = {
                TOKEN_SECRET: 'token-secret',
                REFRESH_TOKEN_SECRET: 'refresh-secret',
                JWT_EXPIRY: '1d',
                REFRESH_JWT_EXPIRY: '365d',
              };
              return values[key] || defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login admin successfully with access and refresh token', async () => {
    const passwordHash = await bcrypt.hash('ChangeMe123!', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 'admin-id',
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
      roles: [Role.ADMIN],
      actorType: ActorEnum.ADMIN_WEB_APP,
    } as any);

    const response = await service.loginAdmin({
      email: 'admin@example.com',
      password: 'ChangeMe123!',
    });

    expect(response.accessToken).toBe('mock.access.token');
    expect(response.refreshToken).toBe('mock.refresh.token');
    expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
  });

  it('should refresh token successfully', async () => {
    const response = await service.refreshToken({
      refreshToken: 'valid.refresh.token',
    });

    expect(response.accessToken).toBe('mock.access.token');
    expect(response.refreshToken).toBe('mock.refresh.token');
    expect(jwtService.verifyAsync).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when student hits admin login', async () => {
    const passwordHash = await bcrypt.hash('Student@123', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 'student-id',
      name: 'Student',
      email: 'student@example.com',
      passwordHash,
      roles: [Role.STUDENT],
      actorType: ActorEnum.WEB_APP,
    } as any);

    await expect(
      service.loginAdmin({
        email: 'student@example.com',
        password: 'Student@123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
