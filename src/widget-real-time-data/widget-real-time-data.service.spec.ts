import { Test, TestingModule } from '@nestjs/testing';
import { WidgetRealTimeDataService } from './widget-real-time-data.service';

describe('WidgetRealTimeDataService', () => {
  let service: WidgetRealTimeDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetRealTimeDataService],
    }).compile();

    service = module.get<WidgetRealTimeDataService>(WidgetRealTimeDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
