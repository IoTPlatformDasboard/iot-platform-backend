import { Test, TestingModule } from '@nestjs/testing';
import { WidgetsRestApiService } from './widgets-rest-api.service';

describe('WidgetsRestApiService', () => {
  let service: WidgetsRestApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetsRestApiService],
    }).compile();

    service = module.get<WidgetsRestApiService>(WidgetsRestApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
