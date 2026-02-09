import { ActorEnum } from 'src/auth/enum/actor.enum';
import { Role } from 'src/auth/enum/role.enum';

export type AuthUser = {
  userId: string;
  email: string;
  actorType: ActorEnum;
  roles: Role[];
};
