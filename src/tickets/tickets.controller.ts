import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, ValidationPipe, Query } from '@nestjs/common';
import { Service_Tickets } from './tickets.service';
import { DTO_ticket_create } from './DTO/create-ticket.dto';

@Controller('tickets')
export class Controller_Tickets 
{

  // -------- constructor --------------------------------------------------------------

  constructor(private readonly tickets_service: Service_Tickets) {}

  // -------- post ---------------------------------------------------------------------

  @Post()
  create(@Body(ValidationPipe) create_DTO: DTO_ticket_create) 
  {
    return this.tickets_service.create(create_DTO);
  }

  // -------- get ----------------------------------------------------------------------

  @Get()
  find_all(@Query('showtime_id') showtime_ID?: string) 
  {
    if (showtime_ID) 
    {
      return this.tickets_service.find_by_showtime(+showtime_ID);
    }
    
    return this.tickets_service.find_all();
  }

  @Get(':id')
  find_by_id(@Param('id') id: string) 
  {
    return this.tickets_service.find_by_id(+id);
  }

  // -------- delete --------------------------------------------------------------------

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) 
  {
    return this.tickets_service.remove(+id);
  }

}