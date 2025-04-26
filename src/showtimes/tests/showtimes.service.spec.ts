import { Test, TestingModule } from '@nestjs/testing';
import { Service_Showtimes } from '../showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Showtime } from '../showtime.entity';
import { Repository } from 'typeorm';
import { Service_Movies } from '../../movies/movies.service';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DTO_showtime_create } from '../DTO/create-showtime.dto';
import { DTO_showtime_update } from '../DTO/update-showtime.dto';

// requirement 3.3 done 

const builder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([]),
};

const mock_showtime_repo = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => builder),
});

const mock_movie_service = {
  find_by_id: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ShowtimesService', () => 
{

  // -------- init --------------------------------------------------------------------

  let service: Service_Showtimes;
  let showtime_repo: MockRepository<Showtime>;
  let movie_service: any;

  // -------- before --------------------------------------------------------------------

  beforeEach(async () => 
  {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Service_Showtimes,
        {
          provide: getRepositoryToken(Showtime),
          useFactory: mock_showtime_repo,
        },
        {
          provide: Service_Movies,
          useValue: mock_movie_service,
        },
      ],
    }).compile();

    service = module.get<Service_Showtimes>(Service_Showtimes);
    showtime_repo = module.get<MockRepository<Showtime>>(getRepositoryToken(Showtime));
    movie_service = module.get<Service_Movies>(Service_Movies);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------- create --------------------------------------------------------------------

  describe('create', () => 
  {
    it('should successfully create a showtime if movie exists and no conflicts', async () => {
      
      const movie = { id: 1, title: 'Test Movie', duration: 120, genre: 'Action', rating: 8.7, releaseYear: 2023 };
      const create_DTO: DTO_showtime_create = {
        movieId: 1,
        theater: 'Theater 1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T12:00:00Z'),
        price: 12.99,
      };
      
      const saved = {
        id: 1,
        movieId: create_DTO.movieId,
        theater: create_DTO.theater,
        startTime: create_DTO.startTime,
        endTime: create_DTO.endTime,
        price: 12.99,
        movie,
      };

      builder.getMany.mockResolvedValue([]);  
      movie_service.find_by_id.mockResolvedValue(movie);
      showtime_repo.save.mockResolvedValue(saved);
      
      const result = await service.create(create_DTO);
      
      expect(movie_service.find_by_id).toHaveBeenCalledWith(create_DTO.movieId);
      expect(builder.getMany).toHaveBeenCalled();
      expect(showtime_repo.save).toHaveBeenCalledWith(create_DTO);
      expect(result).toEqual(saved);
      
    });

    it('should throw ConflictException if there are overlapping showtimes', async () => {

      const movie = { id: 1, title: 'Test Movie', duration: 120, genre: 'Action', rating: 8.7, releaseYear: 2023 };
      const createShowtimeDto: DTO_showtime_create = {
        movieId: 1,
        theater: 'Theater 1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T12:00:00Z'),
        price: 12.99,
      };
      
      builder.getMany.mockResolvedValue([
        { 
          id: 2, 
          theater: 'Theater 1',
          startTime: new Date('2023-01-01T11:00:00Z'),
          endTime: new Date('2023-01-01T13:00:00Z'),
        },
      ]);
      
      movie_service.find_by_id.mockResolvedValue(movie);
      
      await expect(service.create(createShowtimeDto)).rejects.toThrow(ConflictException);
      expect(movie_service.find_by_id).toHaveBeenCalledWith(createShowtimeDto.movieId);
      expect(builder.getMany).toHaveBeenCalled();
      expect(showtime_repo.save).not.toHaveBeenCalled();
      
    });
  });

  // -------- find --------------------------------------------------------------------

  describe('find_all', () => 
  {
    it('should return an array of showtimes', async () => 
    {
      const showtimes = [
        {
          id: 1,
          movieId: 1,
          movie: { id: 1, title: 'Test Movie' },
          theater: 'Theater 1',
          startTime: new Date('2023-01-01T10:00:00Z'),
          endTime: new Date('2023-01-01T12:00:00Z'),
          price: 12.99,
        },
      ];
      
      showtime_repo.find.mockResolvedValue(showtimes);
      
      const result = await service.find_all();
      
      expect(showtime_repo.find).toHaveBeenCalled();
      expect(result).toEqual(showtimes);

    });
  });

  describe('find_by_id', () => 
  {
    it('should return a showtime by id', async () => 
    {
      const showtime = {
        id: 1,
        movieId: 1,
        movie: { id: 1, title: 'Test Movie' },
        theater: 'Theater 1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T12:00:00Z'),
        price: 12.99,
      };
      
      showtime_repo.findOne.mockResolvedValue(showtime);
      
      const result = await service.find_by_id(1);
      
      expect(showtime_repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(showtime);
    });

    it('should throw NotFoundException if showtime not found', async () => {

      showtime_repo.findOne.mockResolvedValue(null);

      await expect(service.find_by_id(999)).rejects.toThrow(NotFoundException);
      expect(showtime_repo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

  });

  // -------- update --------------------------------------------------------------------

  describe('update', () => {

    it('should update a showtime if no conflicts', async () => 
    {
      const showtime_ID = 1;
      const existing_showtime = {
        id: showtime_ID,
        movieId: 1,
        movie: { id: 1, title: 'Test Movie' },
        theater: 'Theater 1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T12:00:00Z'),
        price: 12.99,
      };
      
      const update_DTO = {
        price: 14.99,
        theater: 'Theater 2',
      };
      
      const updated = {
        ...existing_showtime,
        ...update_DTO,
      };
      
      builder.getMany.mockResolvedValue([]);
      showtime_repo.findOne.mockResolvedValue(existing_showtime);
      showtime_repo.save.mockResolvedValue(updated);
      
      const result = await service.update(showtime_ID, update_DTO);
      
      expect(showtime_repo.findOne).toHaveBeenCalledWith({ where: { id: showtime_ID } });
      expect(builder.getMany).toHaveBeenCalled();
      expect(showtime_repo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });
    
    it('should call movies_service.find_by_id if update_DTO.movieId is provided and different from existing', async () => {

      const showtime_ID = 1;
      const existing_showtime = {
        id: showtime_ID,
        movieId: 1,
        movie: { id: 1, title: 'Test Movie' },
        theater: 'Theater 1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T12:00:00Z'),
        price: 12.99,
      };

      const update_DTO = {
        movieId: 2,
      };

      const updated = {
        ...existing_showtime,
        movieId: 2,
        ...update_DTO,
      };

      movie_service.find_by_id.mockResolvedValue({ id: 2 });
      showtime_repo.findOne.mockResolvedValue(existing_showtime);
      showtime_repo.save.mockResolvedValue(updated);
      const result = await service.update(showtime_ID, update_DTO);

      expect(movie_service.find_by_id).toHaveBeenCalledWith(2);
      expect(showtime_repo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });

  });

  // -------- remove --------------------------------------------------------------------
  
  describe('remove', () => {

    it('should delete a showtime by id', async () => {

      const showtime_ID = 1;
      const result = { affected: 1 };
      
      showtime_repo.delete.mockResolvedValue(result);
      
      await service.remove(showtime_ID);
      
      expect(showtime_repo.delete).toHaveBeenCalledWith(showtime_ID);
    });

    it('should throw NotFoundException if showtime not found during delete', async () => {

      const showtime_ID = 999;
      const result = { affected: 0 };
      
      showtime_repo.delete.mockResolvedValue(result);
      
      await expect(service.remove(showtime_ID)).rejects.toThrow(NotFoundException);
      expect(showtime_repo.delete).toHaveBeenCalledWith(showtime_ID);
    });

  });

});
