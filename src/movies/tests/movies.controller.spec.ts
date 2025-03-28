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
  remove_by_title: jest.fn(),
  update_by_title: jest.fn(),
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
        rating: 8.7,
        releaseYear: 2023,
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
          rating: 8.7,
          releaseYear: 2023,
        },
        {
          id: 2,
          title: 'Test Movie 2',
          genre: 'Comedy',
          duration: 90,
          rating: 7.0,
          releaseYear: 2022,
        },
      ];
      
      mock_movie_service.find_all.mockResolvedValue(expected);
      
      expect(await controller.find_all()).toBe(expected);
      expect(mock_movie_service.find_all).toHaveBeenCalled();
    });
  });

  // -------- update_by_title --------------------------------------------------------------------
  
  describe('update_by_title', () => {
    it('should update a movie by title', async () => {
      const updateDto: DTO_movie_update = {
        genre: 'Sci-Fi',
      };
      const expected = {
        id: 1,
        title: 'Test Movie',
        genre: 'Sci-Fi',
        duration: 120,
        rating: 8.7,
        releaseYear: 2023,
      };
      mock_movie_service.update_by_title = jest.fn().mockResolvedValue(expected);
      expect(await controller.update_by_title('Test Movie', updateDto)).toBe(expected);
      expect(mock_movie_service.update_by_title).toHaveBeenCalledWith('Test Movie', updateDto);
    });
  });
  
  // -------- delete_by_title --------------------------------------------------------------------
  
  describe('delete_by_title', () => {
    it('should delete a movie by title', async () => {
      mock_movie_service.remove_by_title = jest.fn().mockResolvedValue(undefined);
      await controller.remove_by_title('Test Movie');
      expect(mock_movie_service.remove_by_title).toHaveBeenCalledWith('Test Movie');
    });
  });

});
