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
import { WidgetType } from 'src/common/entities';

export class WidgetDataSourceDto {
  @IsOptional()
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  key: string;
}

export class PostBodyDto {
  @ApiProperty({ example: 'widget_title', description: 'Widget title' })
  @IsOptional()
  @IsString({ message: 'Widget title must be a string' })
  @Length(3, 50, {
    message: 'Widget title must be between 3 and 50 characters',
  })
  title?: string;

  @ApiProperty({ example: 'board', description: 'Widget type' })
  @IsNotEmpty({ message: 'Widget type cannot be empty' })
  @IsEnum(WidgetType, {
    message: 'Widget type must be either BOARD, LINE_CHART, or GAUGE',
  })
  type: WidgetType;

  @ApiProperty({ example: {}, description: 'Widget data source' })
  @IsNotEmpty({ message: 'Widget data source cannot be empty' })
  @ValidateNested()
  @Type(() => WidgetDataSourceDto)
  data_source: WidgetDataSourceDto;

  @ApiProperty({ example: {}, description: 'Widget config' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class PutBodyDto {
  @ApiProperty({ example: 'widget_title', description: 'Widget title' })
  @IsOptional()
  @IsString({ message: 'Widget title must be a string' })
  @Length(3, 50, {
    message: 'Widget title must be between 3 and 50 characters',
  })
  title?: string;

  @ApiProperty({ example: 'board', description: 'Widget type' })
  @IsOptional()
  @IsEnum(WidgetType, {
    message: 'Widget type must be either BOARD, LINE_CHART, or GAUGE',
  })
  type?: WidgetType;

  @ApiProperty({ example: {}, description: 'Widget data source' })
  @IsOptional()
  @ValidateNested()
  @Type(() => WidgetDataSourceDto)
  data_source?: WidgetDataSourceDto;

  @ApiProperty({ example: {}, description: 'Widget config' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
