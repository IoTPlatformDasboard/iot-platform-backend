export class UnsubscribeRealTimeDataMessageDto {
  event: 'unsubscribe';
  data: { topic: string; key: string };
}
