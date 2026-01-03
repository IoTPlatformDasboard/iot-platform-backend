import { Test, TestingModule } from '@nestjs/testing';
import { TopicsRestApiController } from './topics-rest-api.controller';
import { TopicsRestApiService } from './topics-rest-api.service';

describe('TopicsRestApiController', () => {
  let controller: TopicsRestApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsRestApiController],
      providers: [TopicsRestApiService],
    }).compile();

    controller = module.get<TopicsRestApiController>(TopicsRestApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
