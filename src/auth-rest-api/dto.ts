import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class PostLoginBodyDto {
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
}

export class PatchUsernameBodyDto {
  @ApiProperty({ example: 'new_username', description: 'New username' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  @Matches(/^\S*$/, {
    message: 'Username should not contain spaces',
  })
  username: string;
}

export class PatchPasswordBodyDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Current password' })
  @IsNotEmpty({ message: 'Old password cannot be empty' })
  @IsString({ message: 'Old password must be a string' })
  old_password: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'New password' })
  @IsNotEmpty({ message: 'New password cannot be empty' })
  @IsString({ message: 'New password must be a string' })
  @Length(6, 20, {
    message: 'New password must be between 6 and 20 characters',
  })
  new_password: string;
}
