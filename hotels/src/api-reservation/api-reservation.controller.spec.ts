import { Test, TestingModule } from '@nestjs/testing';
import { ApiReservationController } from './api-reservation.controller';

describe('ApiReservationController', () => {
  let controller: ApiReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiReservationController],
    }).compile();

    controller = module.get<ApiReservationController>(ApiReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
