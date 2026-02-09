import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ActorEnum } from 'src/auth/enum/actor.enum';
import { Role } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { TasksService } from '../tasks/tasks.service';

@ApiTags('student')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('tasks')
  @ResponseMessage('student tasks fetched successfully')
  @ApiOperation({ summary: 'Get tasks assigned to logged-in student' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: true,
        message: 'student tasks fetched successfully',
        data: [
          {
            id: '67a8dc0ac23626bf17798f8d',
            title: 'Complete assignment',
            description: 'Submit by deadline',
            dueAt: '2026-02-10T17:00:00.000Z',
            status: 'OVERDUE',
            completedAt: null,
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
  @Roles([{ actorType: ActorEnum.WEB_APP, role: Role.STUDENT }])
  async getTasks(@Req() req: Request & { user: { userId: string } }) {
    return this.tasksService.getStudentTasks(req.user.userId);
  }

  @Patch('tasks/:taskId/complete')
  @ResponseMessage('task marked as completed successfully')
  @ApiOperation({ summary: 'Mark a student task as completed' })
  @ApiParam({ name: 'taskId', example: '67a8dc0ac23626bf17798f8d' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: true,
        message: 'task marked as completed successfully',
        data: {
          id: '67a8dc0ac23626bf17798f8d',
          title: 'Complete assignment',
          description: 'Submit by deadline',
          dueAt: '2026-02-10T17:00:00.000Z',
          status: 'COMPLETED',
          completedAt: '2026-02-10T16:35:00.000Z',
        },
      },
    },
  })
  @ApiErrorResponses({
    badRequest: false,
    unauthorized: true,
    forbidden: true,
    notFound: true,
  })
  @Roles([{ actorType: ActorEnum.WEB_APP, role: Role.STUDENT }])
  async markTaskCompleted(
    @Param('taskId') taskId: string,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.tasksService.markTaskCompleted(taskId, req.user.userId);
  }
}
