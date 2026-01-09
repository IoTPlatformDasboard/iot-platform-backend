import { WebSocketGateway } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { WidgetRealTimeDataService } from './widget-real-time-data.service';
import { RealTimeDataMessageDto } from './dto/real-time-data.dto';

@WebSocketGateway({ path: '/ws/widget-real-time-data' })
export class WidgetRealTimeDataGateway {
  constructor(
    private readonly widgetRealTimeDataService: WidgetRealTimeDataService,
  ) {}

  private isValidDataMessage(data: any): data is RealTimeDataMessageDto {
    return (
      typeof data?.topic === 'string' &&
      data.topic.length > 0 &&
      typeof data?.key === 'string' &&
      data.key.length > 0
    );
  }

  handleConnection(client: WebSocket) {
    this.widgetRealTimeDataService.register(client);

    client.on('message', (raw: Buffer | string) => {
      try {
        // check if message is JSON
        const payload = JSON.parse(
          typeof raw === 'string' ? raw : raw.toString(),
        );

        // checking event
        if (
          payload?.event !== 'subscribe' &&
          payload?.event !== 'unsubscribe'
        ) {
          client.send(
            JSON.stringify({
              event: 'error',
              message: 'Invalid event',
            }),
          );
          return;
        }

        // checking data structure
        if (!this.isValidDataMessage(payload.data)) {
          client.send(
            JSON.stringify({
              event: 'error',
              message: 'Invalid data structure',
            }),
          );
          return;
        }

        // subscribe or unsubscribe event
        if (payload.event === 'subscribe') {
          this.widgetRealTimeDataService.subscribe(client, payload.data);
        }

        if (payload.event === 'unsubscribe') {
          this.widgetRealTimeDataService.unsubscribe(client, payload.data);
        }
      } catch (error) {
        client.send(
          JSON.stringify({
            event: 'error',
            message: 'Invalid JSON payload message',
          }),
        );
      }
    });
  }

  handleDisconnect(client: WebSocket) {
    this.widgetRealTimeDataService.unregister(client);
  }
}
