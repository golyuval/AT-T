
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Movie } from './movie.entity';
import { DTO_movie_create } from './DTO/create-movie.DTO';
import { DTO_movie_update } from './DTO/update-movie.DTO';


// requirement 2.1 done
// requirement 3.1 done (ID validations)

function validate_ID(id: number): void {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid movie ID provided.');
    }
  }
  
  function validate_DTO(dto: any, errorMessage: string): void {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException(errorMessage);
    }
  }

@Injectable()
export class Service_Movies 
{

    // -------- constructor ----------------------------------------------------------------

    constructor(
        @InjectRepository(Movie)
        private movie_repo: Repository<Movie>,
    ) {}

    // -------- create (requirement 2.1.1) ---------------------------------------------------------------------

    async create(create_DTO: DTO_movie_create): Promise<Movie> 
    {
        validate_DTO(create_DTO, 'Movie data must not be empty.');

        return this.movie_repo.save(create_DTO);
    }
    
    // -------- remove (requirement 2.1.3) ---------------------------------------------------------------------
    
    async remove_by_title(title: string): Promise<void> {

        const movie = await this.find_by_title(title);
        await this.movie_repo.delete(movie.id);
    }
      
    
    // -------- update (requirement 2.1.2) ---------------------------------------------------------------------

    async update_by_title(title: string, update_DTO: DTO_movie_update): Promise<Movie> {

        validate_DTO(update_DTO, "data must not be empty")
        const movie = await this.find_by_title(title);
        const updated = { ...movie, ...update_DTO };

        return this.movie_repo.save(updated);
    }
      

    // -------- find (requirement 2.1.4) ---------------------------------------------------------------------

    async find_all(): Promise<Movie[]> 
    {
        return this.movie_repo.find();
    }

    async find_by_id(ID: number): Promise<Movie> 
    {
        validate_ID(ID);
        const movie = await this.movie_repo.findOne({ where: { id: ID } });

        if (!movie) 
        {
            throw new NotFoundException(`movie (ID ${ID}) not found`);
        }

        return movie;
    }

    async find_by_title(title: string): Promise<Movie> {

        const movie = await this.movie_repo.findOne({ where: { title } });
            if (!movie) throw new NotFoundException(`Movie "${title}" not found.`);

        return movie;
      }
      

    
}