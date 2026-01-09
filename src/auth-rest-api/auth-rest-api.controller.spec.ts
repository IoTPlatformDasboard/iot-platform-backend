import { Test, TestingModule } from '@nestjs/testing';
import { AuthRestApiController } from './auth-rest-api.controller';
import { AuthRestApiService } from './auth-rest-api.service';

describe('AuthRestApiController', () => {
  let controller: AuthRestApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthRestApiController],
      providers: [AuthRestApiService],
    }).compile();

    controller = module.get<AuthRestApiController>(AuthRestApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
