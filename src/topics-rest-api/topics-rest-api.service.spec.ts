import { Test, TestingModule } from '@nestjs/testing';
import { TopicsRestApiService } from './topics-rest-api.service';

describe('TopicsRestApiService', () => {
  let service: TopicsRestApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicsRestApiService],
    }).compile();

    service = module.get<TopicsRestApiService>(TopicsRestApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
