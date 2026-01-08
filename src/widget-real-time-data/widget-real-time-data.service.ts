import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { SubscribeRealTimeDataMessageDto } from './dto/subscribe-real-time-data.dto';
import { UnsubscribeRealTimeDataMessageDto } from './dto/unsubscribe-real-time-data.dto';

@Injectable()
export class WidgetRealTimeDataService {
  private readonly clients = new Map<WebSocket, Set<string>>();

  register(client: WebSocket) {
    this.clients.set(client, new Set());

    client.on('close', () => {
      this.unregister(client);
    });

    client.on('error', () => {
      this.unregister(client);
    });
  }

  unregister(client: WebSocket) {
    this.clients.delete(client);
  }

  subscribe(client: WebSocket, message: SubscribeRealTimeDataMessageDto) {
    const channel = this.buildChannel(message.data.topic, message.data.key);

    this.clients.get(client)?.add(channel);
  }

  unsubscribe(client: WebSocket, message: UnsubscribeRealTimeDataMessageDto) {
    const channel = this.buildChannel(message.data.topic, message.data.key);

    this.clients.get(client)?.delete(channel);
  }

  publish(topic: string, key: string, value: any) {
    console.log('ASW', topic, key, value);
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
          },
        }),
      );
    }
  }

  private buildChannel(topic: string, key: string): string {
    return `${topic}:${key}`;
  }
}
