import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('admin login success')
  @ApiOperation({ summary: 'Admin login with email ID and password' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: true,
        message: 'admin login success',
        data: {
          accessToken: '<access-token>',
          refreshToken: '<refresh-token>',
        },
      },
    },
  })
  @ApiErrorResponses({
    unauthorized: true,
    notFound: true,
  })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }

  @Post('student/login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('student login success')
  @ApiOperation({ summary: 'Student login with email ID and password' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: true,
        message: 'student login success',
        data: {
          accessToken: '<access-token>',
          refreshToken: '<refresh-token>',
        },
      },
    },
  })
  @ApiErrorResponses({
    unauthorized: true,
    notFound: true,
  })
  async studentLogin(@Body() loginDto: LoginDto) {
    return this.authService.loginStudent(loginDto);
  }

  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('token refreshed successfully')
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
    description: 'This endpoint requires refresh token in request body.',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: true,
        message: 'token refreshed successfully',
        data: {
          accessToken: '<new-access-token>',
          refreshToken: '<new-refresh-token>',
        },
      },
    },
  })
  @ApiErrorResponses({
    unauthorized: true,
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
