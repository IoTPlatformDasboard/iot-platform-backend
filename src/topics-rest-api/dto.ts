import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PostPutTopicBodyDto {
  @ApiProperty({ example: 'topic_name', description: 'Topic name' })
  @IsNotEmpty({ message: 'Topic name cannot be empty' })
  @IsString({ message: 'Topic name must be a string' })
  @Length(3, 20, { message: 'Topic name must be between 3 and 20 characters' })
  name: string;

  @ApiProperty({
    example: 'This is a description of the topic',
    description: 'Topic description',
  })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  @Length(0, 1000, {
    message: 'Description must be between 0 and 1000 characters',
  })
  description: string;

  @ApiProperty({ example: 'topic', description: 'Topic' })
  @IsNotEmpty({ message: 'Topic cannot be empty' })
  @IsString({ message: 'Topic must be a string' })
  @Length(3, 20, { message: 'Topic must be between 3 and 20 characters' })
  @Matches(/^\S*$/, {
    message: 'Topic should not contain spaces',
  })
  topic: string;

  @ApiProperty({ example: 'true', description: 'Is active' })
  @IsNotEmpty({ message: 'Is active cannot be empty' })
  @IsBoolean({ message: 'Is active must be a boolean' })
  is_active: boolean;
}

export class GetTopicListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
