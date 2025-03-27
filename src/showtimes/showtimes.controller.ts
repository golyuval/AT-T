import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Service_Showtimes } from './showtimes.service';
import { DTO_showtime_create } from './DTO/create-showtime.dto';
import { DTO_showtime_update } from './DTO/update-showtime.dto';

@Controller('showtimes')
export class Controller_Showtime 
{

    // -------- constructor ---------------------------------------------------------------------

    constructor(private readonly showtimes_service: Service_Showtimes) {}
    
    // -------- post ---------------------------------------------------------------------

    @Post()
    create(@Body(ValidationPipe) create_DTO: DTO_showtime_create) 
    {
        return this.showtimes_service.create(create_DTO);
    }

    // -------- get ---------------------------------------------------------------------

    @Get()
    find_all() 
    {
        return this.showtimes_service.find_all();
    }

    @Get(':id')
    find_by_id(@Param('id') ID: string) 
    {
        return this.showtimes_service.find_by_id(+ID);
    }

    // -------- patch ---------------------------------------------------------------------

    @Patch(':id')
    update(@Param('id') ID: string, @Body(ValidationPipe) update_DTO: DTO_showtime_update) 
    {
        return this.showtimes_service.update(+ID, update_DTO);
    }

    // -------- delete ---------------------------------------------------------------------

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') ID: string) 
    {
        return this.showtimes_service.remove(+ID);
    }

}