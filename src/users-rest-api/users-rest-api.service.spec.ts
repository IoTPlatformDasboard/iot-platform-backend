import { Test, TestingModule } from '@nestjs/testing';
import { UsersRestApiService } from './users-rest-api.service';

describe('UsersRestApiService', () => {
  let service: UsersRestApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRestApiService],
    }).compile();

    service = module.get<UsersRestApiService>(UsersRestApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
