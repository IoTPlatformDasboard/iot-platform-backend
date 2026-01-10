import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UsernameDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  @Matches(/^\S*$/, {
    message: 'Username should not contain spaces',
  })
  username: string;
}
