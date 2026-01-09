import { Test, TestingModule } from '@nestjs/testing';
import { UsersRestApiController } from './users-rest-api.controller';
import { UsersRestApiService } from './users-rest-api.service';

describe('UsersRestApiController', () => {
  let controller: UsersRestApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersRestApiController],
      providers: [UsersRestApiService],
    }).compile();

    controller = module.get<UsersRestApiController>(UsersRestApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
