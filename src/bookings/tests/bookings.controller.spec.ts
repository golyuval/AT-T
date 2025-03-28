import { Test, TestingModule } from '@nestjs/testing';
import { Controller_Bookings } from '../bookings.controller';
import { Service_Bookings } from '../bookings.service';
import { ConflictException } from '@nestjs/common';
import { DTO_booking_create } from '../dto/create-booking.dto';

const mock_booking_service = {
  create: jest.fn(),
};

describe('Controller_Bookings', () => 
{
    // ------- init -------------------------------------------------------------------------

    let controller: Controller_Bookings;
    let service: Service_Bookings;

    // ------- before -------------------------------------------------------------------------
    
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [Controller_Bookings],
        providers: [
          {
            provide: Service_Bookings,
            useValue: mock_booking_service,
          },
        ],
      }).compile();

      controller = module.get<Controller_Bookings>(Controller_Bookings);
      service = module.get<Service_Bookings>(Service_Bookings);
    });

    // ------- after -------------------------------------------------------------------------

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    // ------- tests -------------------------------------------------------------------------

    describe('create', () => {
      it('should create a new booking', async () => {
        const create_DTO: DTO_booking_create = {
          showtimeId: 1,
          seatNumber: 10,
          userId: 'user123',
        };

        const expected = {
          bookingId: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
          showtimeId: create_DTO.showtimeId,
          userId: create_DTO.userId,
          seatNumber: create_DTO.seatNumber,
          time: new Date(),
          showtime: { id: 1 },
        };

        mock_booking_service.create.mockResolvedValue(expected);

        expect(await controller.create(create_DTO)).toEqual(expected);
        expect(mock_booking_service.create).toHaveBeenCalledWith(create_DTO);
      });

      it('should throw ConflictException when seat is already booked', async () => {
        const create_DTO: DTO_booking_create = {
          showtimeId: 1,
          seatNumber: 10,
          userId: 'user123',
        };

        mock_booking_service.create.mockRejectedValue(
          new ConflictException('Seat already booked'),
        );

        await expect(controller.create(create_DTO)).rejects.toThrow(ConflictException);
        expect(mock_booking_service.create).toHaveBeenCalledWith(create_DTO);
      });
    });
});
