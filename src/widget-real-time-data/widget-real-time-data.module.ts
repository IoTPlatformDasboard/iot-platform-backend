import { Module } from '@nestjs/common';
import { WidgetRealTimeDataService } from './widget-real-time-data.service';
import { WidgetRealTimeDataGateway } from './widget-real-time-data.gateway';

@Module({
  providers: [WidgetRealTimeDataGateway, WidgetRealTimeDataService],
  exports: [WidgetRealTimeDataService],
})
export class WidgetRealTimeDataModule {}
