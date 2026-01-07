import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { UsernameDto } from '../../common/dto/username.dto';
import { PasswordDto } from '../../common/dto/password.dto';

export class LoginBodyDto extends IntersectionType(
  PickType(UsernameDto, ['username'] as const),
  PickType(PasswordDto, ['password'] as const),
) {}
