import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UsernameDto } from '../../common/dto/username.dto';
import { PasswordDto } from '../../common/dto/password.dto';
import { RoleDto } from '../../common/dto/role.dto';
import { UserRole } from '../../common/entities/user.entity';

export class CreateUserBodyDto extends IntersectionType(
  PickType(UsernameDto, ['username'] as const),
  PickType(PasswordDto, ['password'] as const),
  PickType(RoleDto, ['role'] as const),
) {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({
    example: UserRole.OPERATOR,
    description: 'Role for the member (Admin, Operator, or Viewer)',
    enum: UserRole,
  })
  role: UserRole;
}
