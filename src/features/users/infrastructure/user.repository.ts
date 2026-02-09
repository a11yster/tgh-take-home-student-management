import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActorEnum } from 'src/features/auth/domain/enum/actor.enum';
import { Role } from 'src/features/auth/domain/enum/role.enum';
import { UserDocument, UserEntity } from 'src/features/users/domain/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async createStudent(input: {
    name: string;
    email: string;
    department?: string;
    passwordHash: string;
  }): Promise<UserDocument> {
    return this.userModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      department: input.department || null,
      passwordHash: input.passwordHash,
      role: Role.STUDENT,
      actorType: ActorEnum.WEB_APP,
    });
  }

  async createAdmin(input: {
    name: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<UserDocument> {
    const role = input.role || Role.ADMIN;

    return this.userModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      department: null,
      passwordHash: input.passwordHash,
      role,
      actorType: ActorEnum.ADMIN_WEB_APP,
    });
  }
}
