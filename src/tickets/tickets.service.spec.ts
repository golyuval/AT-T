import { Test, TestingModule } from '@nestjs/testing';
import { Service_Tickets } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Repository } from 'typeorm';
import { Service_Showtimes } from '../showtimes/showtimes.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DTO_ticket_create } from './dto/create-ticket.dto';

const mock_booking_repo = () => ({
  save: jest.fn(),
  find: jest.fn(),
  find_by_id: jest.fn(),
  delete: jest.fn(),
});

const mock_showtime_service = {
  find_by_id: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('BookingsService', () => 
{

  // -------- init --------------------------------------------------------------------

  let ticket_service: Service_Tickets;
  let ticket_repo: MockRepository<Ticket>;
  let showtime_service: any;

  // -------- before --------------------------------------------------------------------

  beforeEach(async () => 
  {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Service_Tickets,
        {
          provide: getRepositoryToken(Ticket),
          useFactory: mock_booking_repo,
        },
        {
          provide: Service_Showtimes,
          useValue: mock_showtime_service,
        },
      ],
    }).compile();

    ticket_service = module.get<Service_Tickets>(Service_Tickets);
    ticket_repo = module.get<MockRepository<Ticket>>(getRepositoryToken(Ticket));
    showtime_service = module.get<Service_Showtimes>(Service_Showtimes);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(ticket_service).toBeDefined();
  });

  // -------- create --------------------------------------------------------------------

  describe('create', () => 
  {
    it('should successfully create a booking if showtime exists and seat is available', async () => 
    {
      const create_DTO: DTO_ticket_create = {
        showtime_id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        seat: 'A1',
      };
      
      const saved = {
        id: 1,
        ...create_DTO,
        booking_time: new Date(),
        showtime: { id: 1, movie_id: 1, theater: 'Theater 1' },
      };

      showtime_service.find_by_id.mockResolvedValue({ id: 1 });
      ticket_repo.findOne.mockResolvedValue(null);
      ticket_repo.save.mockResolvedValue(saved);
      
      const result = await ticket_service.create(create_DTO);
      
      expect(showtime_service.find_by_id).toHaveBeenCalledWith(create_DTO.showtime_id);
      expect(ticket_repo.findOne).toHaveBeenCalledWith({
        where: {
          showtime_id: create_DTO.showtime_id,
          seat: create_DTO.seat,
        },
      });
      expect(ticket_repo.save).toHaveBeenCalledWith(create_DTO);
      expect(result).toEqual(saved);
    });

    it('should throw ConflictException if seat is already booked', async () => 
    {
      const create_DTO: DTO_ticket_create = {
        showtime_id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        seat: 'A1',
      };
      
      showtime_service.find_by_id.mockResolvedValue({ id: 1 });
      
      ticket_repo.findOne.mockResolvedValue({
        id: 2,
        showtime_id: 1,
        seat_number: 'A1',
      });
      
      await expect(ticket_service.create(create_DTO)).rejects.toThrow(ConflictException);
      expect(showtime_service.find_by_id).toHaveBeenCalledWith(create_DTO.showtime_id);
      expect(ticket_repo.findOne).toHaveBeenCalledWith({
        where: {
          showtime_id: create_DTO.showtime_id,
          seat: create_DTO.seat,
        },
      });
      expect(ticket_repo.save).not.toHaveBeenCalled();
    });
  });

  // -------- find --------------------------------------------------------------------

  describe('find_all', () => 
  {
    it('should return an array of bookings', async () => 
    {
      const tickets = [
        {
          id: 1,
          showtime_id: 1,
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          seat_number: 'A1',
          booking_time: new Date(),
        },
      ];
      
      ticket_repo.find.mockResolvedValue(tickets);
      
      const result = await ticket_service.find_all();
      
      expect(ticket_repo.find).toHaveBeenCalled();
      expect(result).toEqual(tickets);
    });
  });

  describe('find_by_id', () => 
  {
    it('should return a booking by id', async () => 
    {
      const ticket = {
        id: 1,
        showtime_id: 1,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        seat_number: 'A1',
        booking_time: new Date(),
      };
      
      ticket_repo.findOne.mockResolvedValue(ticket);
      
      const result = await ticket_service.find_by_id(1);
      
      expect(ticket_repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(ticket);
    });

    it('should throw NotFoundException if booking not found', async () => 
    {
      ticket_repo.findOne.mockResolvedValue(null);
      
      await expect(ticket_service.find_by_id(999)).rejects.toThrow(NotFoundException);
      expect(ticket_repo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('find_by_showtime', () => 
  {
    it('should return bookings for a specific showtime', async () => 
    {
      const showtimeId = 1;
      const bookings = [
        {
          id: 1,
          showtime_id: showtimeId,
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          seat_number: 'A1',
          booking_time: new Date(),
        },
        {
          id: 2,
          showtime_id: showtimeId,
          customer_name: 'Jane Smith',
          customer_email: 'jane@example.com',
          seat_number: 'B1',
          booking_time: new Date(),
        },
      ];
      
      ticket_repo.find.mockResolvedValue(bookings);
      
      const result = await ticket_service.find_by_showtime(showtimeId);
      
      expect(ticket_repo.find).toHaveBeenCalledWith({
        where: { showtime_id: showtimeId },
      });
      expect(result).toEqual(bookings);
    });
  });

  // -------- remove --------------------------------------------------------------------

  describe('remove', () => 
  {
    it('should delete a booking by id', async () => 
    {
      const ticket_ID = 1;
      const result = { affected: 1 };
      
      ticket_repo.delete.mockResolvedValue(result);
      
      await ticket_service.remove(ticket_ID);
      
      expect(ticket_repo.delete).toHaveBeenCalledWith(ticket_ID);
    });

    it('should throw NotFoundException if booking not found during delete', async () => 
    {
      const ticket_ID = 999;
      const result = { affected: 0 };
      
      ticket_repo.delete.mockResolvedValue(result);
      
      await expect(ticket_service.remove(ticket_ID)).rejects.toThrow(NotFoundException);
      expect(ticket_repo.delete).toHaveBeenCalledWith(ticket_ID);
    });
  });
});