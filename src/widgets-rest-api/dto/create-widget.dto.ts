import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WidgetDataSourceDto {
  @IsString()
  topic: string;

  @IsString()
  key: string;
}

export enum WidgetType {
  VALUE = 'value',
  CHART = 'chart',
  GAUGE = 'gauge',
}

export class WidgetConfigDto {
  @IsString()
  @IsEnum(WidgetType, {
    message: 'Type must be one of gauge, chart or value',
  })
  type: 'gauge' | 'chart' | 'value';

  @IsNumber()
  order: number;

  @IsString()
  title: string;

  @IsNumber()
  max: number;

  @IsNumber()
  min: number;

  @IsString()
  unit: string;
}

export class CreateWidgetBodyDto {
  @ApiProperty({
    example: {
      topic: 'topic',
      key: 'key',
    },
    description: 'Widget data source',
  })
  @IsNotEmpty({ message: 'Data source cannot be empty' })
  @ValidateNested()
  @Type(() => WidgetDataSourceDto)
  data_source: WidgetDataSourceDto;

  @ApiProperty({
    example: {
      type: 'value',
      order: 1,
      title: 'CPU Usage',
      max: 100,
      min: 0,
      unit: '%',
    },
    description: 'Widget config',
  })
  @IsNotEmpty({ message: 'Config cannot be empty' })
  @ValidateNested()
  @Type(() => WidgetConfigDto)
  config: WidgetConfigDto;
}
