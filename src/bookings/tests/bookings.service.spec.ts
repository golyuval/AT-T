import { Test, TestingModule } from '@nestjs/testing';
import { Service_Bookings } from '../bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from '../booking.entity';
import { Repository } from 'typeorm';
import { DTO_booking_create } from '../dto/create-booking.dto';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Service_Showtimes } from '../../showtimes/showtimes.service';

const mockBookingRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockShowtimesService: Partial<Service_Showtimes> = {
  find_by_id: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('Service_Bookings', () => 
{

  // ------- init -------------------------------------------------------------------------
    
  let service: Service_Bookings;
  let bookingRepo: MockRepository<Booking>;
  let showtimesService: Partial<Service_Showtimes>;

  // ------- before -------------------------------------------------------------------------
    
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Service_Bookings,
        {
          provide: getRepositoryToken(Booking),
          useFactory: mockBookingRepo,
        },
        {
          provide: Service_Showtimes,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    service = module.get<Service_Bookings>(Service_Bookings);
    bookingRepo = module.get<MockRepository<Booking>>(getRepositoryToken(Booking));
    showtimesService = module.get<Service_Showtimes>(Service_Showtimes) as Partial<Service_Showtimes>;
  });

  // ------- after -------------------------------------------------------------------------
    
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ------- tests -------------------------------------------------------------------------
    
  describe('create', () => {
    
    it('should successfully create a booking', async () => {
      
      const create_DTO: DTO_booking_create = {
        showtimeId: 1,
        seatNumber: 10,
        userId: 'user123',
      };

      // Simulate that the showtime exists.
      (showtimesService.find_by_id as jest.Mock).mockResolvedValue({ id: 1 });

      // Simulate no existing booking for the same seat.
      bookingRepo.findOne.mockResolvedValue(null);

      const savedBooking = {
        bookingId: 'uuid-1234',
        ...create_DTO,
        time: new Date(),
        showtime: { id: 1 },
      };

      bookingRepo.save.mockResolvedValue(savedBooking);

      const result = await service.create(create_DTO);

      expect(showtimesService.find_by_id).toHaveBeenCalledWith(create_DTO.showtimeId);
      expect(bookingRepo.findOne).toHaveBeenCalledWith({
        where: {
          showtimeId: create_DTO.showtimeId,
          seatNumber: create_DTO.seatNumber,
        },
      });
      expect(bookingRepo.save).toHaveBeenCalledWith(create_DTO);
      expect(result).toEqual(savedBooking);
    });

    it('should throw ConflictException if booking already exists', async () => {
      const create_DTO: DTO_booking_create = {
        showtimeId: 1,
        seatNumber: 10,
        userId: 'user123',
      };

      (showtimesService.find_by_id as jest.Mock).mockResolvedValue({ id: 1 });
      bookingRepo.findOne.mockResolvedValue({ bookingId: 'existing' });

      await expect(service.create(create_DTO)).rejects.toThrow(ConflictException);
    });

  });
});
