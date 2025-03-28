import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, ValidationPipe, Query } from '@nestjs/common';
import { Service_Bookings } from './bookings.service';
import { DTO_booking_create } from './DTO/create-booking.dto';

@Controller('bookings')
export class Controller_Bookings 
{

    // ------ constructor --------------------------------------------------------------

    constructor(private readonly bookings_service: Service_Bookings) {}

    
    // ------ GET /showtimes/{showtimeId} -- ( get showtime by ID ) -----------------------------------

    @Post()
    create(@Body(ValidationPipe) create_DTO: DTO_booking_create) 
    {
      return this.bookings_service.create(create_DTO);
    }

}