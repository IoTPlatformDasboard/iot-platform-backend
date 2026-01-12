import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WidgetType } from 'src/common/entities/widget.entity';

export class WidgetDataSourceDto {
  @IsOptional()
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  key: string;
}

export class CreateWidgetBodyDto {
  @ApiProperty({ example: 'widget_title', description: 'Widget title' })
  @IsNotEmpty({ message: 'Widget title cannot be empty' })
  @IsString({ message: 'Widget title must be a string' })
  @Length(3, 50, {
    message: 'Widget title must be between 3 and 50 characters',
  })
  title: string;

  @ApiProperty({ example: 'board', description: 'Widget type' })
  @IsNotEmpty({ message: 'Widget type cannot be empty' })
  @IsEnum(WidgetType, {
    message: 'Widget type must be either BOARD, LINE_CHART, or GAUGE',
  })
  type: WidgetType;

  @ApiProperty({
    example: {
      topic: 'topic',
      key: 'key',
    },
    description: 'Widget data source',
  })
  @IsNotEmpty({ message: 'Widget data source cannot be empty' })
  @ValidateNested()
  @Type(() => WidgetDataSourceDto)
  dataSource: WidgetDataSourceDto;

  @ApiProperty({
    example: {
      min: 0,
      max: 100,
    },
    description: 'Widget config',
  })
  @IsNotEmpty({ message: 'Widget config cannot be empty' })
  @IsObject()
  config: Record<string, any>;
}
