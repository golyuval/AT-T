import { Test, TestingModule } from '@nestjs/testing';
import { Controller_Showtime } from './showtimes.controller';

describe('ShowtimeController', () => {
  let controller: Controller_Showtime;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Controller_Showtime],
    }).compile();

    controller = module.get<Controller_Showtime>(Controller_Showtime);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
