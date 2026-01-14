import { Test, TestingModule } from '@nestjs/testing';
import { HistoricalDataRestApiService } from './historical-data-rest-api.service';

describe('HistoricalDataRestApiService', () => {
  let service: HistoricalDataRestApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoricalDataRestApiService],
    }).compile();

    service = module.get<HistoricalDataRestApiService>(HistoricalDataRestApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
