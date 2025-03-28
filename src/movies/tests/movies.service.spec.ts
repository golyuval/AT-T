import { Test, TestingModule } from '@nestjs/testing';
import { Service_Movies } from '../movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../movie.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { DTO_movie_update } from '../DTO/update-movie.DTO';

// requirement 3.3 done 

const mock_movie_repo = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('Service_Movies', () => 
{

  // -------- init --------------------------------------------------------------------

  let service: Service_Movies;
  let movie_repo: MockRepository<Movie>;

  // -------- before --------------------------------------------------------------------

  beforeEach(async () => 
  {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Service_Movies,
        {
          provide: getRepositoryToken(Movie),
          useFactory: mock_movie_repo,
        },
      ],
    }).compile();

    service = module.get<Service_Movies>(Service_Movies);
    movie_repo = module.get<MockRepository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------- create --------------------------------------------------------------------

  describe('create', () => {
    it('should successfully create a movie', async () => {
      const movieDto = {
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.7,
        releaseYear: 2023,
      };
      
      const savedMovie = {
        id: 1,
        ...movieDto,
      };
      
      movie_repo.save.mockResolvedValue(savedMovie);
      
      const result = await service.create(movieDto);
      
      expect(movie_repo.save).toHaveBeenCalledWith(movieDto);
      expect(result).toEqual(savedMovie);
    });
  });

  // -------- find --------------------------------------------------------------------

  describe('find_all', () => 
  {
    it('should return an array of movies', async () => 
    {
      const movies = [
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
      
      movie_repo.find.mockResolvedValue(movies);
      
      const result = await service.find_all();
      
      expect(movie_repo.find).toHaveBeenCalled();
      expect(result).toEqual(movies);
    });
  });

  describe('find_by_id', () => 
  {
    it('should return a movie by id', async () => 
    {
      const movie = {
        id: 1,
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.7,
        releaseYear: 2023,
      };
      
      movie_repo.findOne.mockResolvedValue(movie);
      
      const result = await service.find_by_id(1);
      
      expect(movie_repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(movie);
    });
  });

  // -------- edge cases --------------------------------------------------------------------

  describe('Edge Cases', () => {
    it('should throw BadRequestException if create DTO is empty', async () => {
      await expect(service.create({} as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for find_by_id with invalid id (0)', async () => {
      await expect(service.find_by_id(0)).rejects.toThrow(BadRequestException);
    });
  });
  
  // -------- find_by_title --------------------------------------------------------------------
  
  describe('find_by_title', () => {
    it('should return a movie by title', async () => {
      const movie = {
        id: 1,
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.7,
        releaseYear: 2023,
      };
      movie_repo.findOne.mockResolvedValue(movie);
      const result = await service.find_by_title('Test Movie');
      expect(movie_repo.findOne).toHaveBeenCalledWith({ where: { title: 'Test Movie' } });
      expect(result).toEqual(movie);
    });
    it('should throw NotFoundException if movie not found by title', async () => {
      movie_repo.findOne.mockResolvedValue(null);
      await expect(service.find_by_title('Nonexistent')).rejects.toThrow();
      expect(movie_repo.findOne).toHaveBeenCalledWith({ where: { title: 'Nonexistent' } });
    });
  });
  
  // -------- update_by_title --------------------------------------------------------------------
  
  describe('update_by_title', () => {
    it('should update a movie by title', async () => {
      const update_DTO: DTO_movie_update = { genre: 'Sci-Fi' };
      const movie = {
        id: 1,
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.7,
        releaseYear: 2023,
      };
      const updated = { ...movie, ...update_DTO };
      movie_repo.findOne.mockResolvedValue(movie);
      movie_repo.save.mockResolvedValue(updated);
      const result = await service.update_by_title('Test Movie', update_DTO);
      expect(movie_repo.findOne).toHaveBeenCalledWith({ where: { title: 'Test Movie' } });
      expect(movie_repo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });
  });

});
