import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { UsernameDto } from '../../common/dto/username.dto';
import { PasswordDto } from '../../common/dto/password.dto';
import { RoleDto } from '../../common/dto/role.dto';

export class CreateUserBodyDto extends IntersectionType(
  PickType(UsernameDto, ['username'] as const),
  PickType(PasswordDto, ['password'] as const),
  PickType(RoleDto, ['role'] as const),
) {}
