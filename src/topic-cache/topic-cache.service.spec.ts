import { Test, TestingModule } from '@nestjs/testing';
import { TopicCacheService } from './topic-cache.service';

describe('TopicCacheService', () => {
  let service: TopicCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicCacheService],
    }).compile();

    service = module.get<TopicCacheService>(TopicCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
