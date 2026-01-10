import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PasswordDto {
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}
