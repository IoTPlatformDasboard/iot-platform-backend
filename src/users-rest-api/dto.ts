import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../common/entities';

export class PostCreateUserBodyDto {
  @ApiProperty({ example: 'username', description: 'User username' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  @Matches(/^\S*$/, {
    message: 'Username should not contain spaces',
  })
  username: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;

  @ApiProperty({
    example: UserRole.OPERATOR,
    description: 'Role for the member (Admin, Operator, or Viewer)',
    enum: UserRole,
  })
  @IsNotEmpty({ message: 'Role cannot be empty' })
  @IsEnum(UserRole, {
    message: 'Role must be either Admin, Operator, or Viewer',
  })
  role: UserRole;
}

export class GetUserListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class PatchUserRoleBodyDto {
  @ApiProperty({
    example: UserRole.OPERATOR,
    description: 'Role for the member (Admin, Operator, or Viewer)',
    enum: UserRole,
  })
  @IsNotEmpty({ message: 'Role cannot be empty' })
  @IsEnum(UserRole, {
    message: 'Role must be either Admin, Operator, or Viewer',
  })
  role: UserRole;
}
