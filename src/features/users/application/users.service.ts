import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/features/auth/domain/enum/role.enum';
import { CreateStudentDto } from 'src/features/users/dto/create-student.dto';
import { UserRepository } from 'src/features/users/infrastructure/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createStudent(createStudentDto: CreateStudentDto) {
    const existingUser = await this.userRepository.findByEmail(createStudentDto.email);
    if (existingUser) {
      throw new ConflictException('Email ID already exists');
    }

    const passwordHash = await bcrypt.hash(createStudentDto.password, 10);
    const student = await this.userRepository.createStudent({
      ...createStudentDto,
      passwordHash,
    });

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department,
    };
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findStudentById(studentId: string) {
    const user = await this.userRepository.findById(studentId);
    if (!user) {
      throw new NotFoundException('Student not found');
    }

    if (!user.roles.includes(Role.STUDENT)) {
      throw new NotFoundException('User is not a student');
    }

    return user;
  }

  async ensureDefaultAdmin(): Promise<void> {
    await this.ensureSeededAdmin({
      name: process.env.DEFAULT_ADMIN_NAME || 'System Admin',
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
      roles: [Role.ADMIN],
    });
  }

  private async ensureSeededAdmin(input: {
    name: string;
    email?: string;
    password?: string;
    roles: Role[];
  }): Promise<void> {
    if (!input.email || !input.password) {
      return;
    }

    const existingAdmin = await this.userRepository.findByEmail(input.email);
    if (existingAdmin) {
      return;
    }

    try {
      const passwordHash = await bcrypt.hash(input.password, 10);
      await this.userRepository.createAdmin({
        name: input.name,
        email: input.email,
        passwordHash,
        roles: input.roles,
      });
    } catch {
      throw new InternalServerErrorException('Failed to seed default admin user');
    }
  }
}
