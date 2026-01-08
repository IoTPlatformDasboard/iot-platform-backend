import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { TopicCacheModule } from 'src/topic-cache/topic-cache.module';
import { Telemetry } from 'src/common/entities/telemetry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Telemetry]), TopicCacheModule],
  controllers: [MqttController],
  providers: [MqttService],
})
export class MqttModule {}
