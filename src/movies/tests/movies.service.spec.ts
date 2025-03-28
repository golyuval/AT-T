import { Test, TestingModule } from '@nestjs/testing';
import { Service_Movies } from '../movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../movie.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

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
        rating: 'PG-13',
        release_year: 2023,
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
        rating: 'PG-13',
        release_year: 2023,
      };
      
      movie_repo.findOne.mockResolvedValue(movie);
      
      const result = await service.find_by_id(1);
      
      expect(movie_repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(movie);
    });
  });

  // -------- update --------------------------------------------------------------------

  describe('update', () => 
  {
    it('should update a movie', async () => 
    {
      const movie_ID = 1;
      const update_DTO = 
      {
        title: 'Updated Movie',
        genre: 'Drama',
      };
      
      const exist = 
      {
        id: movie_ID,
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 'PG-13',
        release_year: 2023,
      };
      
      const updated = {
        ...exist,
        ...update_DTO,
      };
      
      movie_repo.findOne.mockResolvedValue(exist);
      movie_repo.save.mockResolvedValue(updated);
      
      const result = await service.update(movie_ID, update_DTO);
      
      expect(movie_repo.findOne).toHaveBeenCalledWith({ where: { id: movie_ID } });
      expect(movie_repo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });
  });

  // -------- remove --------------------------------------------------------------------

  describe('remove', () => 
  {
    it('should delete a movie by id', async () => 
    {
      const movie_ID = 1;
      const deleteResult = { affected: 1 };
      
      movie_repo.delete.mockResolvedValue(deleteResult);
      
      await service.remove(movie_ID);
      
      expect(movie_repo.delete).toHaveBeenCalledWith(movie_ID);
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

    it('should throw BadRequestException for update with invalid id (0)', async () => {
      await expect(service.update(0, { title: 'New Title' } as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if update DTO is empty', async () => {
      // Stub find_by_id to return a valid movie so that update proceeds to DTO check
      const existingMovie = {
        id: 1,
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 'PG-13',
        release_year: 2023,
      };
      movie_repo.findOne.mockResolvedValue(existingMovie);
      
      await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for remove with invalid id (-1)', async () => {
      await expect(service.remove(-1)).rejects.toThrow(BadRequestException);
    });
  });

});