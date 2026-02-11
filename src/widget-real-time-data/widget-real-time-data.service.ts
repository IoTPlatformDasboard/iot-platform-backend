import { Injectable, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { RealTimeDataMessageDto } from './dto/real-time-data.dto';

@Injectable()
export class WidgetRealTimeDataService {
  private readonly logger = new Logger(WidgetRealTimeDataService.name);
  private readonly clients = new Map<WebSocket, Set<string>>();

  private buildChannel(topic: string, key: string): string {
    return `${topic}:${key}`;
  }

  register(client: WebSocket) {
    this.logger.debug(`There is a new client connected: ${client.url}`);

    this.clients.set(client, new Set());

    client.on('close', () => {
      this.unregister(client);
    });

    client.on('error', () => {
      this.unregister(client);
    });
  }

  unregister(client: WebSocket) {
    this.logger.debug(`There is a client disconnected: ${client.url}`);
    this.clients.delete(client);
  }

  subscribe(client: WebSocket, data: RealTimeDataMessageDto) {
    this.logger.debug(`There is a client subscribed: ${client.url}`);
    const channel = this.buildChannel(data.topic, data.key);

    this.clients.get(client)?.add(channel);
  }

  unsubscribe(client: WebSocket, data: RealTimeDataMessageDto) {
    this.logger.debug(`There is a client unsubscribed: ${client.url}`);
    const channel = this.buildChannel(data.topic, data.key);

    this.clients.get(client)?.delete(channel);
  }

  publish(
    topic: string,
    key: string,
    value: any,
    timestamp: number = Date.now(),
  ) {
    this.logger.debug(`There is a message published: ${topic}:${key}`);
    const channel = this.buildChannel(topic, key);

    for (const [client, channels] of this.clients) {
      if (!channels.has(channel)) continue;

      if (client.readyState !== WebSocket.OPEN) {
        this.unregister(client);
        continue;
      }

      client.send(
        JSON.stringify({
          event: 'data',
          data: {
            topic,
            key,
            value,
            timestamp,
          },
        }),
      );
    }
  }
}
