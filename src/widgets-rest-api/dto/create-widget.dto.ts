import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WidgetDataSourceDto {
  @IsOptional()
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  key: string;
}

export class CreateWidgetBodyDto {
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
  data_source: WidgetDataSourceDto;

  @ApiProperty({
    example: {
      type: 'value',
      title: 'Kelembaban',
      value: 65,
      unit: '%',
    },
    description: 'Widget config',
  })
  @IsNotEmpty({ message: 'Widget config cannot be empty' })
  @IsObject()
  config: Record<string, any>;
}
