import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../common/entities/user.entity';

export class RoleDto {
  @ApiProperty({
    example: UserRole.OPERATOR,
    description: 'Role for the member (Admin, Operator, or Viewer)',
    enum: UserRole,
  })
  @IsNotEmpty({ message: 'Role cannot be empty' })
  @IsEnum(UserRole, {
    message: 'Role must be either ADMIN, OPERATOR, or VIEWER',
  })
  role: UserRole;
}
