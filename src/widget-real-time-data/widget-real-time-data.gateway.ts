import { WebSocketGateway } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { WidgetRealTimeDataService } from './widget-real-time-data.service';

@WebSocketGateway({ path: '/ws/widget-real-time-data' })
export class WidgetRealTimeDataGateway {
  constructor(
    private readonly widgetRealTimeDataService: WidgetRealTimeDataService,
  ) {}

  handleConnection(client: WebSocket) {
    this.widgetRealTimeDataService.register(client);

    client.on('message', (raw: Buffer | string) => {
      try {
        const payload = JSON.parse(
          typeof raw === 'string' ? raw : raw.toString(),
        );

        if (!payload.event || !payload.data) {
          throw new Error('Invalid payload structure');
        }

        switch (payload.event) {
          case 'subscribe':
            this.widgetRealTimeDataService.subscribe(client, payload);
            break;

          case 'unsubscribe':
            this.widgetRealTimeDataService.unsubscribe(client, payload);
            break;

          default:
            client.send(
              JSON.stringify({
                event: 'error',
                message: 'Unknown event',
              }),
            );
        }
      } catch (error) {
        client.send(
          JSON.stringify({
            event: 'error',
            message: 'Invalid JSON payload',
          }),
        );
      }
    });
  }

  handleDisconnect(client: WebSocket) {
    this.widgetRealTimeDataService.unregister(client);
  }
}
