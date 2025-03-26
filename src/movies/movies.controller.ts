import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Service_Movies } from './movies.service';
import { DTO_movie_create } from './dto/create-movie.dto';
import { DTO_movie_update } from './dto/update-movie.dto';


@Controller('movies')
export class Controller_Movies 
{

    // -------- constructor ---------------------------------------------------------------------

    constructor(private readonly movies_service: Service_Movies) {}
    
    // -------- post ---------------------------------------------------------------------

    @Post()
    create(@Body(ValidationPipe) create_DTO: DTO_movie_create) 
    {
        return this.movies_service.create(create_DTO);
    }

    // -------- get ---------------------------------------------------------------------

    @Get()
    findAll() 
    {
        return this.movies_service.find_all();
    }

    @Get(':id')
    findOne(@Param('id') id: string) 
    {
        return this.movies_service.find_by_ID(+id);
    }

    // -------- patch ---------------------------------------------------------------------

    @Patch(':id')
    update(@Param('id') ID: string, @Body(ValidationPipe) update_DTO: DTO_movie_update) 
    {
        return this.movies_service.update(+ID, update_DTO);
    }

    // -------- delete ---------------------------------------------------------------------

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) 
    {
        return this.movies_service.remove(+id);
    }

}