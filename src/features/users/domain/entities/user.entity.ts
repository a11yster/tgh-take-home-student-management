import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/features/auth/domain/enum/role.enum';
import { ActorEnum } from 'src/features/auth/domain/enum/actor.enum';

export type UserDocument = HydratedDocument<UserEntity>;

@Schema({ timestamps: true, collection: 'users' })
export class UserEntity {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true, default: null })
  department: string | null;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: [String], enum: Object.values(Role), required: true })
  roles: Role[];

  @Prop({ type: String, enum: Object.values(ActorEnum), required: true })
  actorType: ActorEnum;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
