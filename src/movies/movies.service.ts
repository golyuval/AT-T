
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Movie } from './movie.entity';
import { DTO_movie_create } from './DTO/create-movie.DTO';
import { DTO_movie_update } from './DTO/update-movie.DTO';

@Injectable()
export class Service_Movies 
{

    // -------- constructor ----------------------------------------------------------------

    constructor(
        @InjectRepository(Movie)
        private movie_repo: Repository<Movie>,
    ) {}

    // -------- create ---------------------------------------------------------------------

    async create(create_DTO: DTO_movie_create): Promise<Movie> 
    {
        return this.movie_repo.save(create_DTO);
    }
    
    // -------- remove ---------------------------------------------------------------------

    async remove(ID: number): Promise<void> 
    {
        const result = await this.movie_repo.delete(ID);
        
        if (result.affected === 0) 
        {
            throw new NotFoundException(`movie (ID ${ID}) not found`);
        }
    }
    
    // -------- update ---------------------------------------------------------------------

    async update(ID: number, update_DTO: DTO_movie_update): Promise<Movie> 
    {
        const movie = await this.find_by_ID(ID);
        
        const updated = {
        ...movie,
        ...update_DTO,
        };
        
        return this.movie_repo.save(updated);
    }

    // -------- find ---------------------------------------------------------------------

    async find_all(): Promise<Movie[]> 
    {
        return this.movie_repo.find();
    }

    async find_by_ID(ID: number): Promise<Movie> 
    {
        const movie = await this.movie_repo.findOne({ where: { id: ID } });

        if (!movie) 
        {
            throw new NotFoundException(`movie (ID ${ID}) not found`);
        }

        return movie;
    }

    
}