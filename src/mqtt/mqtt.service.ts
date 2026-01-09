import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Telemetry } from '../common/entities/telemetry.entity';
import { TopicCacheService } from '../topic-cache/topic-cache.service';
import { WidgetRealTimeDataService } from '../widget-real-time-data/widget-real-time-data.service';

@Injectable()
export class MqttService {
  private readonly logger = new Logger(MqttService.name);
  constructor(
    @InjectRepository(Telemetry)
    private readonly telemetryRepository: Repository<Telemetry>,
    private readonly topicCacheService: TopicCacheService,
    private readonly widgetRealTimeDataService: WidgetRealTimeDataService,
  ) {}

  async handleMqttPayload(topic: string, payload: any) {
    this.logger.log(`Received message from topic: ${topic}`);

    // Validate topic
    const topicId = this.topicCacheService.getId(topic);
    if (!topicId) {
      this.logger.warn(`Ignored message from topic: ${topic}`);
      return;
    }

    // Validate payload type
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      const actualType = Array.isArray(payload)
        ? 'array'
        : payload === null
          ? 'null'
          : typeof payload;
      this.logger.warn(
        `Ignored message with invalid payload type: ${actualType}`,
      );
      return;
    }

    // Validate payload object values
    const values = Object.values(payload);
    const isAllNumbers =
      values.length > 0 &&
      values.every((val) => {
        const isNumeric = typeof val === 'number' && !Number.isNaN(val);
        const isStringNumber =
          typeof val === 'string' &&
          val.trim() !== '' &&
          !Number.isNaN(Number(val));

        return isNumeric || isStringNumber;
      });

    if (!isAllNumbers) {
      this.logger.warn(
        `Ignored message with invalid payload values: ${JSON.stringify(payload)}`,
      );
      return;
    }

    // Publish to widget real-time data
    const payloadKeys = Object.keys(payload);
    for (const key of payloadKeys) {
      this.widgetRealTimeDataService.publish(topic, key, payload[key]);
    }

    // Save payload to database
    const id = uuidv4();
    const newTelemetry = this.telemetryRepository.create({
      id,
      topic_id: topicId,
      payload,
    });
    await this.telemetryRepository.save(newTelemetry);
  }
}
