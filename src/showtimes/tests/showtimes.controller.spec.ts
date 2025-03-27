import { Test, TestingModule } from '@nestjs/testing';
import { Controller_Showtime } from '../showtimes.controller';
import { Service_Showtimes } from '../showtimes.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DTO_showtime_create } from '../dto/create-showtime.dto';
import { DTO_showtime_update } from '../dto/update-showtime.dto';

// requirement 3.3 done 

const mock_showtime_service = {
  create: jest.fn(),
  find_all: jest.fn(),
  find_by_id: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('Controller_Showtime', () => 
{

  // -------- init --------------------------------------------------------------------

  let controller_showtime: Controller_Showtime;
  let service_showtime: Service_Showtimes;

  // -------- before --------------------------------------------------------------------

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Controller_Showtime],
      providers: [
        {
          provide: Service_Showtimes,
          useValue: mock_showtime_service,
        },
      ],
    }).compile();

    controller_showtime = module.get<Controller_Showtime>(Controller_Showtime);
    service_showtime = module.get<Service_Showtimes>(Service_Showtimes);
  });

  // -------- after --------------------------------------------------------------------

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller_showtime).toBeDefined();
  });

  // -------- create --------------------------------------------------------------------

  describe('create', () => 
  {

    it('should create a new showtime', async () => 
    {
      const create_DTO: DTO_showtime_create = {
        movie_id: 1,
        theater: 'Theater 1',
        start_time: new Date('2023-01-01T10:00:00Z'),
        end_time: new Date('2023-01-01T12:00:00Z'),
        price: 12.99,
      };
      
      const expected = {
        id: 1,
        ...create_DTO,
        movie: { id: 1, title: 'Test Movie' },
      };
      
      mock_showtime_service.create.mockResolvedValue(expected);
      
      expect(await controller_showtime.create(create_DTO)).toBe(expected);
      expect(mock_showtime_service.create).toHaveBeenCalledWith(create_DTO);
    });

    it('should throw ConflictException when there are overlapping showtimes', async () => {
      const create_DTO: DTO_showtime_create = {
        movie_id: 1,
        theater: 'Theater 1',
        start_time: new Date('2023-01-01T10:00:00Z'),
        end_time: new Date('2023-01-01T12:00:00Z'),
        price: 12.99,
      };
      
      mock_showtime_service.create.mockRejectedValue(new ConflictException('Showtime overlaps with existing showtime'));
      
      await expect(controller_showtime.create(create_DTO)).rejects.toThrow(ConflictException);
      expect(mock_showtime_service.create).toHaveBeenCalledWith(create_DTO);
    });
  });

  // -------- find --------------------------------------------------------------------

  describe('find_all', () => 
  {

    it('should return an array of showtimes', async () => 
    {
      const expected = [
        {
          id: 1,
          movie_id: 1,
          movie: { id: 1, title: 'Test Movie' },
          theater: 'Theater 1',
          start_time: new Date('2023-01-01T10:00:00Z'),
          end_time: new Date('2023-01-01T12:00:00Z'),
          price: 12.99,
        },
      ];
      
      mock_showtime_service.find_all.mockResolvedValue(expected);
      
      expect(await controller_showtime.find_all()).toBe(expected);
      expect(mock_showtime_service.find_all).toHaveBeenCalled();
    });
  });

  describe('find_by_id', () => {
    it('should return a single showtime', async () => {
      const expected = {
        id: 1,
        movie_id: 1,
        movie: { id: 1, title: 'Test Movie' },
        theater: 'Theater 1',
        start_time: new Date('2023-01-01T10:00:00Z'),
        end_time: new Date('2023-01-01T12:00:00Z'),
        price: 12.99,
      };
      
      mock_showtime_service.find_by_id.mockResolvedValue(expected);
      
      expect(await controller_showtime.find_by_id('1')).toBe(expected);
      expect(mock_showtime_service.find_by_id).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when showtime does not exist', async () => {
      mock_showtime_service.find_by_id.mockRejectedValue(new NotFoundException('Showtime not found'));
      
      await expect(controller_showtime.find_by_id('999')).rejects.toThrow(NotFoundException);
      expect(mock_showtime_service.find_by_id).toHaveBeenCalledWith(999);
    });
  });

  // -------- update --------------------------------------------------------------------

  describe('update', () => 
  {
    it('should update a showtime', async () => 
    {
      const update_DTO: DTO_showtime_update = {
        price: 14.99,
      };
      
      const expected = {
        id: 1,
        movie_id: 1,
        movie: { id: 1, title: 'Test Movie' },
        theater: 'Theater 1',
        start_time: new Date('2023-01-01T10:00:00Z'),
        end_time: new Date('2023-01-01T12:00:00Z'),
        price: 14.99,
      };
      
      mock_showtime_service.update.mockResolvedValue(expected);
      
      expect(await controller_showtime.update('1', update_DTO)).toBe(expected);
      expect(mock_showtime_service.update).toHaveBeenCalledWith(1, update_DTO);
    });
  });

  // -------- remove --------------------------------------------------------------------

  describe('remove', () => 
  {
    it('should remove a showtime', async () => {
      mock_showtime_service.remove.mockResolvedValue(undefined);
      
      await controller_showtime.remove('1');
      expect(mock_showtime_service.remove).toHaveBeenCalledWith(1);
    });
  });

});