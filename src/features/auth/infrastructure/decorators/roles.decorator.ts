import { Reflector } from '@nestjs/core';
import { RoleBody } from 'src/features/auth/domain/types/role-body.type';

export const Roles = Reflector.createDecorator<RoleBody[]>();
