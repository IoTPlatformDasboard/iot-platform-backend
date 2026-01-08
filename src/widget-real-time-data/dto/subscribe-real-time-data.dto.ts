export class SubscribeRealTimeDataMessageDto {
  event: 'subscribe';
  data: { topic: string; key: string };
}
