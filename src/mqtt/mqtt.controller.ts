import { Controller, Logger } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';
import { MqttService } from './mqtt.service';

@Controller()
export class MqttController {
  private readonly logger = new Logger(MqttController.name);
  constructor(private readonly mqttService: MqttService) {}

  @MessagePattern('#')
  async getMessage(@Payload() payload: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    await this.mqttService.handleMqttPayload(topic, payload);
  }
}
