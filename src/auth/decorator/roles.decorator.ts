import { Reflector } from '@nestjs/core';
import { RoleBody } from '../types/role-body.type';

export const Roles = Reflector.createDecorator<RoleBody[]>();
