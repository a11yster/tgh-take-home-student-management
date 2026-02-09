import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ description: 'Student name', example: 'Rahul Menon' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Student email ID', example: 'rahul@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Student department', example: 'Computer Science', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Student password', example: 'Student@123' })
  @IsString()
  @MinLength(6)
  password: string;
}
