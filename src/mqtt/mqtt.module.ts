import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { TopicCacheModule } from 'src/topic-cache/topic-cache.module';
import { Telemetry } from 'src/common/entities/telemetry.entity';
import { WidgetRealTimeDataModule } from 'src/widget-real-time-data/widget-real-time-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Telemetry]),
    TopicCacheModule,
    WidgetRealTimeDataModule,
  ],
  controllers: [MqttController],
  providers: [MqttService],
})
export class MqttModule {}
