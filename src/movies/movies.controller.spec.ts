import { Test, TestingModule } from '@nestjs/testing';
import { Controller_Movies } from './movies.controller';

describe('MoviesController', () => {
  let controller: Controller_Movies;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Controller_Movies],
    }).compile();

    controller = module.get<Controller_Movies>(Controller_Movies);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
