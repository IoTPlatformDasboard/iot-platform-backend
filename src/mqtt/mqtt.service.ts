import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Telemetry } from '../common/entities/telemetry.entity';
import { TopicCacheService } from '../topic-cache/topic-cache.service';

@Injectable()
export class MqttService {
  private readonly logger = new Logger(MqttService.name);
  constructor(
    @InjectRepository(Telemetry)
    private readonly telemetryRepository: Repository<Telemetry>,
    private readonly topicCacheService: TopicCacheService,
  ) {}

  async handleMqttPayload(topic: string, payload: any) {
    // 1. Validate topic
    const topicId = this.topicCacheService.getId(topic);
    if (!topicId) {
      this.logger.warn(`Ignored message from topic: ${topic}`);
      return;
    }

    // 2. Validate payload
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

    // 4. Save to database
    const id = uuidv4();
    const newTelemetry = this.telemetryRepository.create({
      id,
      topic_id: topicId,
      payload,
    });
    await this.telemetryRepository.save(newTelemetry);
  }
}
