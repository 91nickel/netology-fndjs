import { Test, TestingModule } from '@nestjs/testing';
import { ApiHotelController } from './api-hotel.controller';

describe('ApiHotelController', () => {
  let controller: ApiHotelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiHotelController],
    }).compile();

    controller = module.get<ApiHotelController>(ApiHotelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
