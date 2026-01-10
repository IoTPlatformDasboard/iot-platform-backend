import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UsernameDto } from '../../common/dto/username.dto';
import { PasswordDto } from '../../common/dto/password.dto';

export class LoginBodyDto extends IntersectionType(
  PickType(UsernameDto, ['username'] as const),
  PickType(PasswordDto, ['password'] as const),
) {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
