import { Test, TestingModule } from '@nestjs/testing';
import { WidgetRealTimeDataGateway } from './widget-real-time-data.gateway';
import { WidgetRealTimeDataService } from './widget-real-time-data.service';

describe('WidgetRealTimeDataGateway', () => {
  let gateway: WidgetRealTimeDataGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetRealTimeDataGateway, WidgetRealTimeDataService],
    }).compile();

    gateway = module.get<WidgetRealTimeDataGateway>(WidgetRealTimeDataGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
