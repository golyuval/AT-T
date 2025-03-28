import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { DTO_booking_create } from './DTO/create-booking.dto';
import { Service_Showtimes } from '../showtimes/showtimes.service';

// requirement 2.3 done
// requirement 3.1 done (overlapping and ID validations + informative errors)

function validate_str_ID(id: string): void {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Invalid booking ID provided.');
    }
}

function validate_num_ID(id: number): void {
if (!id || id <= 0) {
    throw new BadRequestException('Invalid booking ID provided.');
}
}
  
function validateDto(dto: any, errorMessage: string): void {
    if (!dto || Object.keys(dto).length === 0) {
        throw new BadRequestException(errorMessage);
    }
}

@Injectable()
export class Service_Bookings 
{

    // -------- init ------------------------------------------------------------------------------

    constructor(
        @InjectRepository(Booking)
        private booking_repo: Repository<Booking>,
        private showtimes_service: Service_Showtimes,
    ) {}

    // -------- create (requirement 2.3) -----------------------------------------------------------------------------------------

    async create(create_DTO: DTO_booking_create): Promise<Booking> 
    {
        validateDto(create_DTO, 'Booking data must not be empty.');

        // showtime existence check
        await this.showtimes_service.find_by_id(create_DTO.showtimeId);

        // booked seat check
        const booking_exist = await this.booking_repo.findOne({
            where: {
            showtimeId: create_DTO.showtimeId,
            seatNumber: create_DTO.seatNumber,
            },
        });

        if (booking_exist) 
        {
            throw new ConflictException(`Seat ${create_DTO.seatNumber} is already booked for this showtime`);
        }

        return this.booking_repo.save(create_DTO);
    }


    
}