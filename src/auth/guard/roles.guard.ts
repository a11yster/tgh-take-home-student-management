import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Roles } from '../decorator/roles.decorator';
import { AuthService } from '../auth.service';
import { RoleBody } from '../types/role-body.type';
import { ActorEnum } from '../enum/actor.enum';
import { Role } from '../enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  private static matchRoles(
    apiRoles: RoleBody[],
    loggedInUserRoles: Role[],
    loggedInActorType: ActorEnum,
  ): boolean {
    if (!apiRoles?.length) return false;

    return apiRoles.some(
      (allowedRole) =>
        allowedRole.actorType === loggedInActorType &&
        loggedInUserRoles.includes(allowedRole.role),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const apiRoles = this.reflector.get(Roles, context.getHandler());
    if (!apiRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: any }>();
    let authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    if (authorization.startsWith('Bearer ')) {
      authorization = authorization.slice(7);
    }

    try {
      const payload = await this.authService.verifyAccessToken(authorization);
      const roles = Array.isArray(payload.roles) ? payload.roles : [];

      request.user = {
        userId: payload.userId,
        email: payload.email,
        actorType: payload.actorType,
        roles,
      };

      return RolesGuard.matchRoles(apiRoles, roles, payload.actorType);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
