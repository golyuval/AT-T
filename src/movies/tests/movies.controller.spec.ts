import { Test, TestingModule } from '@nestjs/testing';
import { Controller_Movies } from '../movies.controller';
import { Service_Movies } from '../movies.service';
import { NotFoundException } from '@nestjs/common';
import { DTO_movie_create } from '../dto/create-movie.dto';
import { DTO_movie_update } from '../dto/update-movie.dto';

// requirement 3.3 done 

const mock_movie_service = {
  create: jest.fn(),
  find_all: jest.fn(),
  find_by_id: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('Controller_Movies', () => 
{

  // -------- init --------------------------------------------------------------------

  let controller: Controller_Movies;
  let service: Service_Movies;

  // -------- before --------------------------------------------------------------------

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule(
    {
      controllers: [Controller_Movies],
      providers: [
        {
          provide: Service_Movies,
          useValue: mock_movie_service,
        },
      ],
    }).compile();

    controller = module.get<Controller_Movies>(Controller_Movies);
    service = module.get<Service_Movies>(Service_Movies);

  });

  // -------- after --------------------------------------------------------------------

  afterEach(() => {

    jest.clearAllMocks();
  
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------- create --------------------------------------------------------------------

  describe('create', () => {

    it('should create a new movie', async () => {
      
      const create_DTO: DTO_movie_create = {
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 'PG-13',
        release_year: 2023,
      };
      
      const expected = {
        id: 1,
        ...create_DTO,
      };
      
      mock_movie_service.create.mockResolvedValue(expected);
      
      expect(await controller.create(create_DTO)).toBe(expected);
      expect(mock_movie_service.create).toHaveBeenCalledWith(create_DTO);

    });
  });

  // -------- find --------------------------------------------------------------------

  describe('find_all', () => {

    it('should return an array of movies', async () => {
      const expected = [
        {
          id: 1,
          title: 'Test Movie 1',
          genre: 'Action',
          duration: 120,
          rating: 'PG-13',
          release_year: 2023,
        },
        {
          id: 2,
          title: 'Test Movie 2',
          genre: 'Comedy',
          duration: 90,
          rating: 'PG',
          release_year: 2022,
        },
      ];
      
      mock_movie_service.find_all.mockResolvedValue(expected);
      
      expect(await controller.find_all()).toBe(expected);
      expect(mock_movie_service.find_all).toHaveBeenCalled();
    });
  });

  describe('find_by_id', () => {

    it('should return a single movie', async () => {

      const expected = {
        id: 1,
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 'PG-13',
        release_year: 2023,
      };
      
      mock_movie_service.find_by_id.mockResolvedValue(expected);
      
      expect(await controller.find_by_id('1')).toBe(expected);
      expect(mock_movie_service.find_by_id).toHaveBeenCalledWith(1);

    });

    it('should throw NotFoundException when movie does not exist', async () => {

      mock_movie_service.find_by_id.mockRejectedValue(new NotFoundException('Movie not found'));
      
      await expect(controller.find_by_id('999')).rejects.toThrow(NotFoundException);
      expect(mock_movie_service.find_by_id).toHaveBeenCalledWith(999);

    });
  });

  // -------- update --------------------------------------------------------------------

  describe('update', () => {

    it('should update a movie', async () => {
      const update_DTO: DTO_movie_update = {
        genre: 'Drama',
        duration: 130,
      };
      
      const expected = {
        id: 1,
        title: 'Test Movie',
        genre: 'Drama',
        duration: 130,
        rating: 'PG-13',
        release_year: 2023,
      };
      
      mock_movie_service.update.mockResolvedValue(expected);
      
      expect(await controller.update('1', update_DTO)).toBe(expected);
      expect(mock_movie_service.update).toHaveBeenCalledWith(1, update_DTO);
      
    });
  });

  // -------- remove --------------------------------------------------------------------
  
  describe('remove', () => {

    it('should remove a movie', async () => {
      mock_movie_service.remove.mockResolvedValue(undefined);
      
      await controller.remove('1');
      expect(mock_movie_service.remove).toHaveBeenCalledWith(1);

    });
  });

});