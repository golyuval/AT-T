import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { DTO_ticket_create } from './DTO/create-ticket.dto';
import { Service_Showtimes } from '../showtimes/showtimes.service';

// requirement 2.3 done
// requirement 3.1 done (overlapping and ID validations + informative errors)

function validateId(id: number): void {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid ticket ID provided.');
    }
}
  
function validateDto(dto: any, errorMessage: string): void {
    if (!dto || Object.keys(dto).length === 0) {
        throw new BadRequestException(errorMessage);
    }
}

@Injectable()
export class Service_Tickets 
{

    // -------- init ------------------------------------------------------------------------------

    constructor(
        @InjectRepository(Ticket)
        private ticket_repo: Repository<Ticket>,
        private showtimes_service: Service_Showtimes,
    ) {}

    // -------- create (requirement 2.3) -----------------------------------------------------------------------------------------

    async create(create_DTO: DTO_ticket_create): Promise<Ticket> 
    {
        validateDto(create_DTO, 'Ticket data must not be empty.');

        // showtime existence check
        await this.showtimes_service.find_by_id(create_DTO.showtime_id);

        // booked seat check
        const ticket_exist = await this.ticket_repo.findOne({
            where: {
            showtime_id: create_DTO.showtime_id,
            seat: create_DTO.seat,
            },
        });

        if (ticket_exist) 
        {
            throw new ConflictException(`Seat ${create_DTO.seat} is already booked for this showtime`);
        }

        return this.ticket_repo.save(create_DTO);
    }

    // -------- remove (additional for testability) -----------------------------------------------------------------------------------------

    async remove(ID: number): Promise<void> 
    {
        validateId(ID);
        const result = await this.ticket_repo.delete(ID);

        if (result.affected === 0) {
            throw new NotFoundException(`Booking with ID ${ID} not found`);
        }
    }

    // -------- find (additional for testability) -------------------------------------------------------------------------------------------

    async find_all(): Promise<Ticket[]> 
    {
        return this.ticket_repo.find();
    }

    async find_by_id(id: number): Promise<Ticket> 
    {
        validateId(id);
        const ticket = await this.ticket_repo.findOne({ where: { id } });
        
        if (!ticket) 
        {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        
        return ticket;
    }

    async find_by_showtime(showtime_ID: number): Promise<Ticket[]> 
    {
        validateId(showtime_ID);
        return this.ticket_repo.find({
            where: { showtime_id: showtime_ID },
        });
    }

    
}