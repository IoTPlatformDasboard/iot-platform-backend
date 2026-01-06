import { Test, TestingModule } from '@nestjs/testing';
import { WidgetsRestApiController } from './widgets-rest-api.controller';
import { WidgetsRestApiService } from './widgets-rest-api.service';

describe('WidgetsRestApiController', () => {
  let controller: WidgetsRestApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetsRestApiController],
      providers: [WidgetsRestApiService],
    }).compile();

    controller = module.get<WidgetsRestApiController>(WidgetsRestApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
