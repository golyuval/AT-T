import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { DTO_ticket_create } from './DTO/create-ticket.dto';
import { Service_Showtimes } from '../showtimes/showtimes.service';


@Injectable()
export class Service_Tickets 
{

    // -------- overlapping check ------------------------------------------------------------------------------

    constructor(
        @InjectRepository(Ticket)
        private ticket_repo: Repository<Ticket>,
        private showtimes_service: Service_Showtimes,
    ) {}

    // -------- create -----------------------------------------------------------------------------------------

    async create(create_DTO: DTO_ticket_create): Promise<Ticket> 
    {
        // showtime existence check
        await this.showtimes_service.find_by_ID(create_DTO.showtime_id);

        // ticket existence check
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

    // -------- remove -----------------------------------------------------------------------------------------

    async remove(id: number): Promise<void> 
    {
        const result = await this.ticket_repo.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
    }

    // -------- find -------------------------------------------------------------------------------------------

    async find_all(): Promise<Ticket[]> 
    {
        return this.ticket_repo.find();
    }

    async find_by_id(id: number): Promise<Ticket> 
    {
        const ticket = await this.ticket_repo.findOne({ where: { id } });
        
        if (!ticket) 
        {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        
        return ticket;
    }

    async find_by_showtime(showtime_ID: number): Promise<Ticket[]> 
    {
        return this.ticket_repo.find({
            where: { showtime_id: showtime_ID },
        });
    }

    
}