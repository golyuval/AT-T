import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, ValidationPipe, Query } from '@nestjs/common';
import { Service_Tickets } from './tickets.service';
import { DTO_ticket_create } from './DTO/create-ticket.dto';

@Controller('tickets')
export class Controller_Tickets 
{

  // -------- constructor --------------------------------------------------------------

  constructor(private readonly ticketsService: Service_Tickets) {}

  // -------- post ---------------------------------------------------------------------

  @Post()
  create(@Body(ValidationPipe) createticketDto: DTO_ticket_create) 
  {
    return this.ticketsService.create(createticketDto);
  }

  // -------- get ----------------------------------------------------------------------

  @Get()
  findAll(@Query('showtime_id') showtimeId?: string) 
  {
    if (showtimeId) 
    {
      return this.ticketsService.find_by_showtime(+showtimeId);
    }
    
    return this.ticketsService.find_all();
  }

  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.ticketsService.find_by_id(+id);
  }

  // -------- delete --------------------------------------------------------------------

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) 
  {
    return this.ticketsService.remove(+id);
  }

}