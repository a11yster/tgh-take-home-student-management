import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/features/auth/infrastructure/decorators/roles.decorator';
import { ActorEnum } from 'src/features/auth/domain/enum/actor.enum';
import { Role } from 'src/features/auth/domain/enum/role.enum';
import { RolesGuard } from 'src/features/auth/infrastructure/guard/roles.guard';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateStudentDto } from 'src/features/users/dto/create-student.dto';
import { UsersService } from 'src/features/users/application/users.service';
import { AssignTaskDto } from 'src/features/tasks/dto/assign-task.dto';
import { TasksService } from 'src/features/tasks/application/tasks.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
  ) {}

  @Post('students')
  @ResponseMessage('student created successfully')
  @ApiOperation({ summary: 'Add a student (admin only)' })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        status: true,
        message: 'student created successfully',
        data: {
          id: '67a8db20c23626bf17798f6a',
          name: 'Rahul Menon',
          email: 'rahul@example.com',
          department: 'Computer Science',
        },
      },
    },
  })
  @ApiErrorResponses({
    unauthorized: true,
    forbidden: true,
    conflict: true,
  })
  @Roles([{ actorType: ActorEnum.ADMIN_WEB_APP, role: Role.ADMIN }])
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.usersService.createStudent(createStudentDto);
  }

  @Get('students')
  @ResponseMessage('students fetched successfully')
  @ApiOperation({
    summary: 'List all students with IDs (admin only)',
    description: 'Use this endpoint to get student IDs before assigning tasks.',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: true,
        message: 'students fetched successfully',
        data: [
          {
            id: '67a8db20c23626bf17798f6a',
            name: 'Rahul Menon',
            email: 'rahul@example.com',
            department: 'Computer Science',
          },
        ],
      },
    },
  })
  @ApiErrorResponses({
    badRequest: false,
    unauthorized: true,
    forbidden: true,
  })
  @Roles([{ actorType: ActorEnum.ADMIN_WEB_APP, role: Role.ADMIN }])
  async listStudents() {
    return this.usersService.listStudents();
  }

  @Post('tasks/assign')
  @ResponseMessage('task assigned successfully')
  @ApiOperation({ summary: 'Assign a task to a student (admin only)' })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        status: true,
        message: 'task assigned successfully',
        data: {
          id: '67a8dc0ac23626bf17798f8d',
          title: 'Complete assignment',
          description: 'Submit by deadline',
          dueAt: '2026-02-10T17:00:00.000Z',
          status: 'PENDING',
          completedAt: null,
        },
      },
    },
  })
  @ApiErrorResponses({
    unauthorized: true,
    forbidden: true,
    notFound: true,
  })
  @Roles([{ actorType: ActorEnum.ADMIN_WEB_APP, role: Role.ADMIN }])
  async assignTask(
    @Body() assignTaskDto: AssignTaskDto,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.tasksService.assignTask(assignTaskDto, req.user.userId);
  }
}
