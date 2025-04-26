import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Service_Showtimes } from './showtimes.service';
import { DTO_showtime_create } from './DTO/create-showtime.dto';
import { DTO_showtime_update } from './DTO/update-showtime.dto';

@Controller('showtimes')
export class Controller_Showtime 
{

    // ------ constructor --------------------------------------------------------------

    constructor(private readonly showtimes_service: Service_Showtimes) {}

    // ------ GET /showtimes/{showtimeId} -- ( get showtime by ID ) -----------------------------------

    @Get(':showtimeId')
    find_by_id(@Param('showtimeId') showtimeId: string) {
        return this.showtimes_service.find_by_id(+showtimeId);
    }

    // ------ POST /showtimes -- ( add showtime ) -----------------------------------

    @Post()
    create(@Body() create_DTO: DTO_showtime_create) {
        return this.showtimes_service.create(create_DTO);
    }

    // ------ POST /showtimes/update/{showtimeId} -- ( update showtime by ID ) -----------------------------------

    @Post('update/:showtimeId')
    update(
        @Param('showtimeId') showtimeId: string,
        @Body() update_DTO: DTO_showtime_update,
    ) {
        return this.showtimes_service.update(+showtimeId, update_DTO);
    }

    // ------ DELETE /showtimes/{showtimeId} -- ( get all movies ) -----------------------------------

    @Delete(':showtimeId')
    @HttpCode(HttpStatus.OK)
    remove(@Param('showtimeId') showtimeId: string) {
        return this.showtimes_service.remove(+showtimeId);
    }

}
