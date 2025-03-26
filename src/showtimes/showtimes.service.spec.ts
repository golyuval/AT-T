import { Test, TestingModule } from '@nestjs/testing';
import { Service_Showtimes } from './showtimes.service';

describe('ShowtimeService', () => {
  let service: Service_Showtimes;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Service_Showtimes],
    }).compile();

    service = module.get<Service_Showtimes>(Service_Showtimes);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

nest generate module tickets
nest generate controller tickets
nest generate service tickets