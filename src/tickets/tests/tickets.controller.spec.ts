import { Test, TestingModule } from '@nestjs/testing';
import { Controller_Tickets } from '../tickets.controller';
import { Service_Tickets } from '../tickets.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DTO_ticket_create } from '../dto/create-ticket.dto';

// requirement 3.3 done 

const mock_ticket_service = {
  create: jest.fn(),
  find_all: jest.fn(),
  find_by_id: jest.fn(),
  find_by_showtime: jest.fn(),
  remove: jest.fn(),
};

describe('Controller_Ticket', () => 
{

  // -------- init --------------------------------------------------------------------

  let controller: Controller_Tickets;
  let service: Service_Tickets;

  // -------- before --------------------------------------------------------------------

  beforeEach(async () => 
  {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Controller_Tickets],
      providers: [
        {
          provide: Service_Tickets,
          useValue: mock_ticket_service,
        },
      ],
    }).compile();

    controller = module.get<Controller_Tickets>(Controller_Tickets);
    service = module.get<Service_Tickets>(Service_Tickets);
  });

  // -------- after --------------------------------------------------------------------

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------- create --------------------------------------------------------------------

  describe('create', () => 
  {
    it('should create a new booking', async () => 
    {
      const create_DTO: DTO_ticket_create = {
        showtime_id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        seat: 'A1',
      };
      
      const expected = {
        id: 1,
        ...create_DTO,
        booking_time: new Date(),
        showtime: { id: 1 },
      };
      
      mock_ticket_service.create.mockResolvedValue(expected);
      
      expect(await controller.create(create_DTO)).toBe(expected);
      expect(mock_ticket_service.create).toHaveBeenCalledWith(create_DTO);
    });

    it('should throw ConflictException when seat is already booked', async () => {
      const create_DTO: DTO_ticket_create = {
        showtime_id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        seat: 'A1',
      };
      
      mock_ticket_service.create.mockRejectedValue(new ConflictException('Seat already booked'));
      
      await expect(controller.create(create_DTO)).rejects.toThrow(ConflictException);
      expect(mock_ticket_service.create).toHaveBeenCalledWith(create_DTO);
    });
  });

  // -------- find --------------------------------------------------------------------

  describe('find_all', () => 
  {
    it('should return all bookings when no showtime_id is provided', async () => 
    {
      const expected = [
        {
          id: 1,
          showtime_id: 1,
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          seat_number: 'A1',
          booking_time: new Date(),
        },
        {
          id: 2,
          showtime_id: 2,
          customer_name: 'Jane Smith',
          customer_email: 'jane@example.com',
          seat_number: 'B1',
          booking_time: new Date(),
        },
      ];
      
      mock_ticket_service.find_all.mockResolvedValue(expected);
      
      expect(await controller.find_all()).toBe(expected);
      expect(mock_ticket_service.find_all).toHaveBeenCalled();
      expect(mock_ticket_service.find_by_showtime).not.toHaveBeenCalled();
    });

    it('should return bookings for a specific showtime when showtime_id is provided', async () => 
    {
      const showtime_ID = '1';
      const expected = [
        {
          id: 1,
          showtime_id: 1,
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          seat_number: 'A1',
          booking_time: new Date(),
        },
      ];
      
      mock_ticket_service.find_by_showtime.mockResolvedValue(expected);
      
      expect(await controller.find_all(showtime_ID)).toBe(expected);
      expect(mock_ticket_service.find_by_showtime).toHaveBeenCalledWith(1);
      expect(mock_ticket_service.find_all).not.toHaveBeenCalled();
    });
  });

  describe('find_by_id', () => 
  {
    it('should return a single booking', async () => 
    {
      const expected = {
        id: 1,
        showtime_id: 1,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        seat_number: 'A1',
        booking_time: new Date(),
      };
      
      mock_ticket_service.find_by_id.mockResolvedValue(expected);
      
      expect(await controller.find_by_id('1')).toBe(expected);
      expect(mock_ticket_service.find_by_id).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when booking does not exist', async () =>
    {
      mock_ticket_service.find_by_id.mockRejectedValue(new NotFoundException('Booking not found'));
      
      await expect(controller.find_by_id('999')).rejects.toThrow(NotFoundException);
      expect(mock_ticket_service.find_by_id).toHaveBeenCalledWith(999);
    });
  });

  // -------- remove --------------------------------------------------------------------

  describe('remove', () => 
  {
    it('should remove a booking', async () => 
    {
      mock_ticket_service.remove.mockResolvedValue(undefined);
      
      await controller.remove('1');
      expect(mock_ticket_service.remove).toHaveBeenCalledWith(1);
    });
  });
});