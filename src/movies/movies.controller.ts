import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    ValidationPipe,
  } from '@nestjs/common';
  
import { Service_Movies } from './movies.service';
import { DTO_movie_create } from './dto/create-movie.dto';
import { DTO_movie_update } from './dto/update-movie.dto';

@Controller('movies')
export class Controller_Movies 
{

    // ------ constructor --------------------------------------------------------------

    constructor(private readonly movies_service: Service_Movies) {}
    
    
    // ------ GET /movies/all -- ( get all movies ) -----------------------------------

    @Get('all')
    find_all() {
      return this.movies_service.find_all();
    }

    // ------ POST /movies -- ( add movie ) -------------------------------------------

    @Post()
    create(@Body() create_DTO: DTO_movie_create) {
      return this.movies_service.create(create_DTO);
    }
  
    // ------ POST /movies/update/{movieTitle} -- ( update movie ) --------------------

    @Post('update/:movieTitle')
    update_by_title(
      @Param('movieTitle') movieTitle: string,
      @Body() updateDto: DTO_movie_update,
    ) {
      return this.movies_service.update_by_title(movieTitle, updateDto);
    }
  
    // ------ DELETE /movies/{movieTitle} -- ( get all movies ) ------------------------

    @Delete(':movieTitle')
    @HttpCode(HttpStatus.OK)
    remove_by_title(@Param('movieTitle') movieTitle: string) {
      return this.movies_service.remove_by_title(movieTitle);
    }
  }
  