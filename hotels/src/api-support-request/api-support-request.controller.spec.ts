import { Test, TestingModule } from '@nestjs/testing';
import { ApiSupportRequestController } from './api-support-request.controller';

describe('ApiSupportRequestController', () => {
  let controller: ApiSupportRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiSupportRequestController],
    }).compile();

    controller = module.get<ApiSupportRequestController>(ApiSupportRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
