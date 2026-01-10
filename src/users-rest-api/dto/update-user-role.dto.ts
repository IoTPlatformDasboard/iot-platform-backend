import { RoleDto } from '../../common/dto/role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/mapped-types';
import { UserRole } from '../../common/entities/user.entity';

export class UpdateUserRoleBodyDto extends PickType(RoleDto, [
  'role',
] as const) {
  @ApiProperty({
    example: UserRole.OPERATOR,
    description: 'Role for the member (Admin, Operator, or Viewer)',
    enum: UserRole,
  })
  role: UserRole;
}
