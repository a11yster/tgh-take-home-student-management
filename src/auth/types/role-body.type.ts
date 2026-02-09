import { ActorEnum } from '../enum/actor.enum';
import { Role } from '../enum/role.enum';

export type RoleBody = {
  actorType: ActorEnum;
  role: Role;
};
