import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordBodyDto {
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
