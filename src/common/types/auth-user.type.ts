import { ActorEnum } from 'src/features/auth/domain/enum/actor.enum';
import { Role } from 'src/features/auth/domain/enum/role.enum';

export type AuthUser = {
  userId: string;
  email: string;
  actorType: ActorEnum;
  role: Role;
};
