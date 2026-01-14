import { Test, TestingModule } from '@nestjs/testing';
import { HistoricalDataRestApiController } from './historical-data-rest-api.controller';
import { HistoricalDataRestApiService } from './historical-data-rest-api.service';

describe('HistoricalDataRestApiController', () => {
  let controller: HistoricalDataRestApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricalDataRestApiController],
      providers: [HistoricalDataRestApiService],
    }).compile();

    controller = module.get<HistoricalDataRestApiController>(HistoricalDataRestApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
